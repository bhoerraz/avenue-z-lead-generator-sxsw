# AEO Readiness Assessment — Avenue Z

A Next.js lead generation app built for SXSW 2026. Attendees scan a QR code, enter their email, complete a 10-section AI Search Readiness Assessment, and receive an instant scored results page with a personalized breakdown.

**Live URL:** https://aeo.avenuez.com

---

## What It Does

- Email capture on landing → logged to Google Sheets as "Incomplete"
- 10-section assessment with 4-point scale per question (0–3)
- Instant results page with score, maturity level, section breakdown, and priority focus areas
- Completion row logged to Google Sheets with full section scores
- Results email sent via Resend from Tina Fleming `<no-reply@send.avenuez.com>`
- GA4 tracking with `assessment_started` and `assessment_completed` custom events

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | Nunito Sans |
| Data store | Google Sheets via `googleapis` |
| Email | Resend |
| Analytics | GA4 (`G-14EZ67DY2W`) |
| Hosting | Vercel |

---

## Environment Variables

Set in `.env.local` (local) and Vercel dashboard (production):

```
GOOGLE_SERVICE_ACCOUNT_KEY=   # Full service account JSON, stringified
GOOGLE_SHEET_ID=               # ID from Google Sheet URL
RESEND_API_KEY=                # From resend.com dashboard
RESEND_FROM_EMAIL=             # e.g. Tina Fleming <no-reply@send.avenuez.com>
NEXT_PUBLIC_AUDIT_CTA_URL=     # CTA link, e.g. mailto:hello@avenuez.com
```

---

## Local Development

```bash
cd aeo-assessment
npm install
npm run dev
```

Open http://localhost:3000

---

## Google Sheets

Sheet tab: **Leads**
Column order: `Timestamp | Email | Total Score | Maturity Level | S1–S10`

Two rows per completed user (by design):
1. Email submitted on landing → `Incomplete`
2. Assessment completed → full scores

Filter by non-empty `Total Score` for completions only.

---

## Deployment

Pushing to `main` on GitHub auto-deploys via Vercel.

Vercel project: `avenue-z-lead-generator-sxsw-654s`
GitHub repo: `bhoerraz/avenue-z-lead-generator-sxsw`
