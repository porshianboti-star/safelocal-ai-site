/**
 * SafeLocal.ai — lead capture endpoint (Google Apps Script).
 *
 * Receives the demo/quote/contact form submissions from the website and
 * appends them to a Google Sheet named "SafeLocal Leads" on the Google
 * account that DEPLOYS this script (deploy it while signed in as
 * porshianboti@gmail.com so the sheet is created on that account).
 *
 * See GOOGLE-SHEET-SETUP.md for step-by-step deployment instructions.
 */

var SHEET_NAME = 'SafeLocal Leads';

function doPost(e) {
  try {
    var data = (e && e.parameter) ? e.parameter : {};
    // Fallback: support JSON request bodies too.
    if ((!data || !data.email) && e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (ignore) {}
    }
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.lang || '',
      data.source || '',
      data.page || ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Visiting the /exec URL in a browser creates the sheet and confirms it's live.
function doGet() {
  getSheet_();
  return json_({ ok: true, message: 'SafeLocal lead endpoint is live.' });
}

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    var existing = DriveApp.getFilesByName(SHEET_NAME);
    ss = existing.hasNext() ? SpreadsheetApp.open(existing.next()) : SpreadsheetApp.create(SHEET_NAME);
    props.setProperty('SHEET_ID', ss.getId());
  }
  var sheet = ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Language', 'Source', 'Page']);
    sheet.getRange('A1:G1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
