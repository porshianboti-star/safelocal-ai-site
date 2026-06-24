# Daily SEO rankings report

A scheduled GitHub Action (`.github/workflows/seo-report.yml`) runs every day
~11:00 Israel time, reads the keywords from [`keywords.md`](keywords.md), pulls
metrics from **Google Search Console**, and appends one dated row per keyword to
a **Google Sheet**:

| תאריך | מילת חיפוש | כמות חיפושים (Impressions) | מיקום האתר שלנו |
|---|---|---|---|

> **"כמות חיפושים":** GSC has no market search-volume figure. We use
> **Impressions** (times safelocal.ai was shown for the query in the last 7
> days) as the first-party proxy. `0` / `—` = the site isn't surfacing for that
> keyword yet. Since the site launched recently, expect mostly zeros for the
> first few weeks until Google crawls and starts ranking it.

---

## One-time setup (your Google account)

### 1. Verify `safelocal.ai` in Google Search Console
- https://search.google.com/search-console → **Add property** → **Domain** →
  `safelocal.ai` → add the TXT record it gives you to DNS. (Domain property is
  recommended; it covers en/he/vs and www. If you instead use a **URL-prefix**
  property, set the repo variable `GSC_SITE_URL` to `https://safelocal.ai/`.)

### 2. Create a service account + enable APIs
- In Google Cloud Console (any project): **APIs & Services → Enable APIs** →
  enable **Google Search Console API** and **Google Sheets API**.
- **IAM & Admin → Service Accounts → Create**. No project roles needed.
- On the service account → **Keys → Add key → JSON** → download the file.
- Note the service account email, e.g. `seo-report@<project>.iam.gserviceaccount.com`.

### 3. Grant the service account access
- **GSC:** property → **Settings → Users and permissions → Add user** → the SA
  email → permission **Full** (or Restricted).
- **Sheet:** create a Google Sheet for the report, **Share** it with the SA
  email as **Editor**. Copy its **spreadsheet id** from the URL
  (`https://docs.google.com/spreadsheets/d/<THIS_PART>/edit`).

### 4. Store the secrets in the repo
From this repo:
```bash
gh secret set GSC_SA_KEY  < /path/to/service-account.json
gh secret set SEO_SHEET_ID --body "<spreadsheet id>"
# only if you used a URL-prefix property instead of a Domain property:
gh variable set GSC_SITE_URL --body "https://safelocal.ai/"
```

That's it — the daily job will start populating the sheet.

---

## Run / test manually
```bash
gh workflow run "Daily SEO rankings report"   # trigger now
gh run watch                                   # follow it
```

Local run:
```bash
pip install -r seo-report/requirements.txt
export GSC_SA_KEY="$(cat /path/to/service-account.json)"
export SEO_SHEET_ID="<spreadsheet id>"
python seo-report/gsc_to_sheet.py
```

## Config (env vars)
| var | required | default | meaning |
|---|---|---|---|
| `GSC_SA_KEY` | ✅ | — | service-account JSON (string) |
| `SEO_SHEET_ID` | ✅ | — | target spreadsheet id |
| `GSC_SITE_URL` | | `sc-domain:safelocal.ai` | GSC property |
| `SEO_SHEET_TAB` | | `Rankings` | worksheet/tab name |
| `LOOKBACK_DAYS` | | `7` | rolling metrics window |

## Add / remove keywords
Edit [`keywords.md`](keywords.md) — each tracked term is a backtick-wrapped
markdown list item (`` - `keyword` ``). Commit; the next run picks it up.
