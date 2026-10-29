export default async function handler(req, res) {
  // Google Apps Script Web App URL
  const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyuigY3QbA27PaYTmOJlPY88X3S6juLFqfCt7tj9ZEK5csJ9oOuyWjkDHdX2pBsJMr_Yg/exec?action=getAppHtml';

  try {
    const response = await fetch(APPSCRIPT_URL, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${response.status}`);
    }

    const html = await response.text();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>SSIS Leave Card - Connecting...</title></head>
      <body style="font-family: system-ui, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#0f172a; color:#fff;">
        <div style="text-align:center; max-width:500px; padding:30px; background:#1e293b; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
          <div style="font-size:3rem; margin-bottom:15px;">⏳</div>
          <h2 style="margin:0 0 10px 0;">Connecting to Google Apps Script...</h2>
          <p style="color:#94a3b8; font-size:0.9rem; line-height:1.5;">${err.message}</p>
          <p style="color:#64748b; font-size:0.8rem; margin-top:20px;">Please ensure your Apps Script Web App is deployed with "Who has access: Anyone".</p>
        </div>
      </body>
      </html>
    `);
  }
}
