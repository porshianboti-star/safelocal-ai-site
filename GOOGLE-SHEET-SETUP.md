# Connect the lead form to a Google Sheet

Form submissions (name, email, phone) from every **Request a Demo / Get a quote / Talk to sales** button are sent to a Google Sheet on **porshianboti@gmail.com**. This takes ~3 minutes and uses a free Google Apps Script — no third‑party service, no backend server.

## One-time setup

1. **Sign in** to Google as **porshianboti@gmail.com**, then open **https://script.google.com** and click **New project**.

2. Delete the sample code, then **paste the entire contents of `lead-to-sheet.gs`** (in this folder) into the editor. Click the **Save** icon.

3. Click **Deploy → New deployment**.
   - Click the gear ⚙ next to "Select type" → choose **Web app**.
   - **Execute as:** *Me (porshianboti@gmail.com)*
   - **Who has access:** *Anyone*
   - Click **Deploy**, then **Authorize access** and approve the permissions (Google will warn it's an unverified app — choose *Advanced → Go to project → Allow*; this is your own script).

4. Copy the **Web app URL** — it ends in `/exec` and looks like:
   `https://script.google.com/macros/s/AKfycb..../exec`

5. Open **`assets/js/main.js`** and paste that URL into the `LEAD_ENDPOINT` value near the top:
   ```js
   var LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycb..../exec";
   ```

6. (Optional) Paste the `/exec` URL into your browser once. It returns `{"ok":true,...}` and **auto-creates the "SafeLocal Leads" spreadsheet** in your Google Drive.

Done. Every submission now adds a row: **Timestamp · Name · Email · Phone · Language · Source · Page**.

## Notes
- The sheet is named **SafeLocal Leads** and lives in the Drive of whoever deployed the script. Deploy as **porshianboti@gmail.com** so it lands on that account.
- To change fields later, edit both the form in `assets/js/main.js` and the `appendRow([...])` line in `lead-to-sheet.gs`, then **Deploy → Manage deployments → Edit → New version**.
- Until `LEAD_ENDPOINT` is set, the form still works visually and logs the captured lead to the browser console (nothing is sent).
- Want email alerts on each new lead too? Add a `MailApp.sendEmail(...)` line inside `doPost` — say the word and I'll wire it up.
