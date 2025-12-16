export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: 'Env missing' });
    }

    const d = req.body || {};

    const text = `
🧸 Memory Drop Studio – Yeni Ön Sipariş

👤 Ad Soyad: ${d.musteriAdi || '-'}
📞 Telefon: ${d.telefon || '-'}
🎵 Sekme: ${d.activeTab || '-'}

${d.hazirMuzikTitle ? `🎶 Hazır Müzik: ${d.hazirMuzikTitle}` : ''}
${d.youtubeLink ? `🔗 YouTube: ${d.youtubeLink}` : ''}
${d.yukluDosyaAdlari?.length ? `📁 Dosyalar: ${d.yukluDosyaAdlari.join(', ')}` : ''}
    `.trim();

    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    const result = await tg.json();

    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.description || 'Telegram error' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
