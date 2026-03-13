import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getMaturityLevel, TOTAL_MAX } from '@/lib/scoring'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, score, sections, resultsUrl } = body as {
    email: string
    score: number | null
    sections: number[] | null
    resultsUrl?: string
  }

  // Google Sheets
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const now = new Date().toISOString()
    const maturityLevel =
      score !== null ? getMaturityLevel(score).label : 'Incomplete'

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: 'Leads!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            now,
            email,
            score ?? '',
            maturityLevel,
            ...(sections ?? Array(6).fill('')),
          ],
        ],
      },
    })
  } catch (err) {
    console.error('[submit-email] Sheets write failed:', err)
  }

  // Send results email only on completion (score is not null)
  if (score !== null && resultsUrl) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const maturity = getMaturityLevel(score)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'Tina Fleming <no-reply@send.avenuez.com>',
        to: email,
        subject: `Your AEO Readiness Score: ${score}/${TOTAL_MAX} — ${maturity.label}`,
        html: buildEmailHtml({ email, score, maturity, resultsUrl }),
      })
    } catch (err) {
      console.error('[submit-email] Resend failed:', err)
    }
  }

  return NextResponse.json({ success: true })
}

function buildEmailHtml({
  score,
  maturity,
  resultsUrl,
}: {
  email: string
  score: number
  maturity: ReturnType<typeof getMaturityLevel>
  resultsUrl: string
}) {
  const pct = Math.round((score / TOTAL_MAX) * 100)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your AEO Readiness Score</title>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Avenue Z</span>
            </td>
          </tr>

          <!-- Score card -->
          <tr>
            <td style="background:#272727;border-radius:16px;border:1px solid rgba(255,255,255,0.06);padding:40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8A8A8A;">
                Your AEO Readiness Score
              </p>
              <p style="margin:0 0 4px;font-size:72px;font-weight:900;line-height:1;background:linear-gradient(135deg,#FFFC60,#60FF80,#60FDFF,#39A0FF,#6034FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                ${score}
              </p>
              <p style="margin:0 0 24px;font-size:24px;font-weight:700;color:#8A8A8A;">/ ${TOTAL_MAX}</p>

              <div style="display:inline-block;padding:8px 20px;border-radius:9999px;border:1.5px solid rgba(255,255,255,0.2);margin-bottom:16px;">
                <span style="font-size:12px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#ffffff;">
                  ${maturity.label}
                </span>
              </div>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#8A8A8A;">
                ${maturity.description}
              </p>

              <!-- Progress bar -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td style="background:#1a1a1a;border-radius:9999px;height:6px;overflow:hidden;">
                    <div style="width:${pct}%;height:6px;background:linear-gradient(135deg,#FFFC60,#60FF80,#60FDFF,#39A0FF,#6034FF);border-radius:9999px;"></div>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 32px;font-size:12px;color:#555555;text-align:right;">${pct}% readiness</p>

              <a href="${resultsUrl}"
                style="display:inline-block;background:linear-gradient(135deg,#FFFC60,#60FF80,#60FDFF);color:#000000;font-size:13px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:9999px;">
                View Full Results →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#555555;">
                © Avenue Z · <a href="https://avenuez.com" style="color:#555555;">avenuez.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:#444444;">
                This is an automated email from an unmonitored inbox — please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
