const LOGO_URL = 'https://tour-mate-ai-game-agent.vercel.app/logo.svg';

export function verificationEmailHtml(code: string, expiresInMinutes: number): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#eee;font-family:Poppins,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:20px;background-color:#eee;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td align="center" style="background-color:#0A0A0F;padding:24px;">
                <img src="${LOGO_URL}" width="72" height="72" alt="TourMate AI" style="border-radius:16px;background:#ffffff;padding:6px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;">
                <h1 style="margin:0 0 16px;color:#19053B;font-size:20px;font-weight:700;">Verify your email address</h1>
                <p style="margin:0 0 20px;color:#333333;font-size:14px;line-height:22px;">
                  Thanks for creating a TourMate AI account. Enter the code below to confirm it's really you.
                  If you didn't request this, you can safely ignore this email.
                </p>
                <table role="presentation" width="100%" style="margin:0 0 20px;">
                  <tr>
                    <td align="center">
                      <p style="margin:0;color:#666666;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Verification code</p>
                      <p style="margin:8px 0;color:#19053B;font-size:36px;font-weight:800;letter-spacing:8px;">${code}</p>
                      <p style="margin:0;color:#999999;font-size:12px;">This code expires in ${expiresInMinutes} minutes.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td style="border-top:1px solid #eeeeee;"></td></tr>
            <tr>
              <td style="padding:20px 28px;">
                <p style="margin:0;color:#999999;font-size:12px;line-height:18px;">
                  TourMate AI will never ask you to share this code with anyone, including TourMate staff.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
