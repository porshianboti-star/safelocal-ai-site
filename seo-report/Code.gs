/**
 * SafeLocal.ai — Daily keyword rankings report.
 *
 * Pulls per-keyword Impressions + average position from Google Search Console
 * and appends a dated block to the "SEO Rankings" tab of THIS spreadsheet.
 * Runs as you (the sheet owner / GSC-verified user) — no service account needed.
 *
 * Columns:  תאריך | מילת חיפוש | כמות חיפושים (Impressions) | מיקום האתר שלנו
 *
 * Setup (once): paste this file + appsscript.json into the bound Apps Script
 * project, run setupDailyTrigger() and authorize. See seo-report/README.md.
 */

// If you verified a URL-prefix property instead of a Domain property,
// change this to 'https://safelocal.ai/'.
var SITE_URL = 'sc-domain:safelocal.ai';
var SHEET_NAME = 'SEO Rankings';
var LOOKBACK_DAYS = 7;

// Keywords live in the repo so they stay the single source of truth.
var KEYWORDS_URL =
  'https://raw.githubusercontent.com/porshianboti-star/safelocal-ai-site/master/seo-report/keywords.md';

// Used only if the GitHub fetch fails.
var FALLBACK_KEYWORDS = [
  'on-premise llm for enterprise', 'private ai automation infrastructure',
  'self-hosted local ai for business', 'secure offline ai assistant',
  'local llm data privacy compliance', 'offline ai assistant',
  'local ai for windows', 'private ai locally', 'ai without internet',
  'chatgpt offline alternative', 'run llm locally', 'local llm gui'
];

function getKeywords_() {
  try {
    var txt = UrlFetchApp.fetch(KEYWORDS_URL, { muteHttpExceptions: true }).getContentText();
    var out = [];
    txt.split('\n').forEach(function (line) {
      var m = line.match(/^\s*-\s+`(.+?)`\s*$/); // markdown list item wrapped in backticks
      if (m) out.push(m[1].trim());
    });
    if (out.length) return out;
  } catch (e) { /* fall through to fallback */ }
  return FALLBACK_KEYWORDS;
}

function fmtDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function gscQuery_(startDate, endDate) {
  var url = 'https://www.googleapis.com/webmasters/v3/sites/' +
    encodeURIComponent(SITE_URL) + '/searchAnalytics/query';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({
      startDate: startDate, endDate: endDate,
      dimensions: ['query'], rowLimit: 25000
    }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Search Console API ' + res.getResponseCode() + ': ' + res.getContentText());
  }
  var rows = (JSON.parse(res.getContentText()).rows) || [];
  var map = {};
  rows.forEach(function (r) { map[String(r.keys[0]).toLowerCase()] = r; });
  return map;
}

/** Main job: query GSC and append today's rows. */
function runReport() {
  var today = new Date();
  var end = new Date(today); end.setDate(end.getDate() - 2);                 // GSC lags ~2-3 days
  var start = new Date(end); start.setDate(start.getDate() - (LOOKBACK_DAYS - 1));

  var byQuery = gscQuery_(fmtDate_(start), fmtDate_(end));
  var keywords = getKeywords_();
  var stamp = fmtDate_(today);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['תאריך', 'מילת חיפוש', 'כמות חיפושים (Impressions)', 'מיקום האתר שלנו']);
    sh.setFrozenRows(1);
  }

  var out = keywords.map(function (kw) {
    var r = byQuery[kw.toLowerCase()];
    return [stamp, kw, r ? Math.round(r.impressions) : 0, r ? Math.round(r.position * 10) / 10 : '—'];
  });
  sh.getRange(sh.getLastRow() + 1, 1, out.length, 4).setValues(out);
  SpreadsheetApp.flush();
}

/** Run once: schedule runReport daily at 11:00 (project time zone = Asia/Jerusalem). */
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'runReport') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('runReport').timeBased().everyDays(1).atHour(11).create();
}
