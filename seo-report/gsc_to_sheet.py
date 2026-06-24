#!/usr/bin/env python3
"""Daily SafeLocal.ai keyword rankings report -> Google Sheet.

For each keyword in seo-report/keywords.md, pull metrics from Google Search
Console and append one dated row per keyword to a Google Sheet:

    תאריך | מילת חיפוש | כמות חיפושים (Impressions) | מיקום האתר שלנו

Note on "כמות חיפושים": GSC does not expose market search volume. We use
Impressions (how many times safelocal.ai was shown for the query in the
window) as the closest first-party proxy. A keyword with no impressions in
the window is reported as 0 / "—" (the site is not yet surfacing for it).

Auth: ONE Google service account (JSON) that is
  * added as a user on the GSC property, and
  * shared (Editor) on the target spreadsheet,
with the Search Console API and Google Sheets API enabled.

Env vars:
  GSC_SA_KEY     service-account JSON, as a string (required)
  SEO_SHEET_ID   target spreadsheet id (required)
  GSC_SITE_URL   GSC property, default "sc-domain:safelocal.ai"
  SEO_SHEET_TAB  worksheet/tab name, default "Rankings"
  LOOKBACK_DAYS  rolling metrics window in days, default 7
"""
import datetime
import json
import os
import pathlib
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
]

ROOT = pathlib.Path(__file__).resolve().parent
KEYWORDS_FILE = ROOT / "keywords.md"
HEADER = ["תאריך", "מילת חיפוש", "כמות חיפושים (Impressions)", "מיקום האתר שלנו"]


def require_env(name):
    val = os.environ.get(name)
    if not val:
        sys.exit(f"Missing required env var: {name}")
    return val


def load_keywords():
    """Parse markdown list items wrapped in backticks: - `keyword`."""
    keywords = []
    for line in KEYWORDS_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line.startswith("- "):
            term = line[2:].strip().strip("`").strip()
            if term:
                keywords.append(term)
    if not keywords:
        sys.exit("No keywords parsed from keywords.md")
    return keywords


def get_credentials():
    info = json.loads(require_env("GSC_SA_KEY"))
    return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)


def gsc_metrics(creds, site_url, keywords, start, end):
    """Return {keyword: (impressions:int, position:float|None)}."""
    sc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    resp = (
        sc.searchanalytics()
        .query(
            siteUrl=site_url,
            body={
                "startDate": start,
                "endDate": end,
                "dimensions": ["query"],
                "rowLimit": 25000,
            },
        )
        .execute()
    )
    by_query = {r["keys"][0].lower(): r for r in resp.get("rows", [])}
    out = {}
    for kw in keywords:
        row = by_query.get(kw.lower())
        if row:
            out[kw] = (int(round(row["impressions"])), round(row["position"], 1))
        else:
            out[kw] = (0, None)
    return out


def append_to_sheet(creds, sheet_id, tab, data_rows):
    svc = build("sheets", "v4", credentials=creds, cache_discovery=False)
    values = svc.spreadsheets().values()
    existing = (
        values.get(spreadsheetId=sheet_id, range=f"{tab}!A1:D1").execute().get("values", [])
    )
    rows = []
    if not existing:
        rows.append(HEADER)
    rows.extend(data_rows)
    values.append(
        spreadsheetId=sheet_id,
        range=f"{tab}!A1",
        valueInputOption="USER_ENTERED",
        insertDataOption="INSERT_ROWS",
        body={"values": rows},
    ).execute()


def main():
    site_url = os.environ.get("GSC_SITE_URL") or "sc-domain:safelocal.ai"
    sheet_id = require_env("SEO_SHEET_ID")
    tab = os.environ.get("SEO_SHEET_TAB") or "Rankings"
    lookback = int(os.environ.get("LOOKBACK_DAYS", "7"))

    today = datetime.date.today()
    # GSC data lags ~2-3 days; end the window 2 days back so it's complete.
    end = today - datetime.timedelta(days=2)
    start = end - datetime.timedelta(days=lookback - 1)

    creds = get_credentials()
    keywords = load_keywords()
    metrics = gsc_metrics(creds, site_url, keywords, start.isoformat(), end.isoformat())

    stamp = today.isoformat()
    data_rows = []
    for kw in keywords:
        impressions, position = metrics[kw]
        data_rows.append([stamp, kw, impressions, "—" if position is None else position])

    append_to_sheet(creds, sheet_id, tab, data_rows)
    print(
        f"Appended {len(data_rows)} rows for {stamp} "
        f"(window {start}..{end}) to sheet {sheet_id} / tab '{tab}'."
    )


if __name__ == "__main__":
    main()
