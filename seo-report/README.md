# Daily SEO rankings report (Google Apps Script)

Appends a dated keyword-rankings block to a tab named **"SEO Rankings"** in your
Google Sheet, every day at **11:00** (Israel time):

| תאריך | מילת חיפוש | כמות חיפושים (Impressions) | מיקום האתר שלנו |
|---|---|---|---|

The script runs **as you** — since you verified `safelocal.ai` in Search Console
and own the sheet, it has access automatically. **No service account, no API
key, no secrets.**

> **"כמות חיפושים":** Search Console has no market search-volume number, so we
> use **Impressions** (times safelocal.ai was shown for the query in the last 7
> days) as the proxy. `0` / `—` means the site isn't surfacing for that keyword
> yet — expect mostly zeros for the first few weeks after launch.

---

## Setup (one time, ~3 minutes)

1. Open the **Google Sheet** you want the report in.
2. Menu **Extensions → Apps Script** (opens the script editor).
3. Click the **⚙️ Project Settings** (left sidebar) and tick
   **"Show 'appsscript.json' manifest file in editor."**
4. Back in **Editor** (`</>`):
   - Open **`Code.gs`**, delete everything, and paste the contents of
     [`Code.gs`](Code.gs).
   - Open **`appsscript.json`**, delete everything, and paste the contents of
     [`appsscript.json`](appsscript.json). Save (💾).
5. In the function dropdown (top toolbar) pick **`setupDailyTrigger`** → click
   **Run**. Google will ask for permission:
   - Choose your account → on the "Google hasn't verified this app" screen click
     **Advanced → Go to (project) (unsafe)** → **Allow**. (This is normal for a
     personal script; the "app" is your own script.)
6. Pick **`runReport`** → **Run** once to test. Check the new **"SEO Rankings"**
   tab — you should see today's rows.

That's it. From now on it runs by itself daily at 11:00.

---

## Notes
- **Property type:** the script defaults to a **Domain** property
  (`sc-domain:safelocal.ai`). If you verified a **URL-prefix** property instead,
  change `SITE_URL` at the top of `Code.gs` to `'https://safelocal.ai/'`.
- **Keywords** are read live from [`keywords.md`](keywords.md) in the GitHub
  repo (single source of truth). Edit that file to add/remove a tracked
  keyword — no need to touch the script. (A fallback copy is embedded in case
  the fetch fails.)
- **Change the time:** edit `.atHour(11)` in `setupDailyTrigger` and re-run it.
