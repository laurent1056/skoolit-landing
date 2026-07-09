# Skoolit Landing Page

Static landing page for [getskoolit.com](https://getskoolit.com). Collects waitlist emails into a Google Sheet via a Cloudflare Pages Function.

## Stack

- **Hosting:** Cloudflare Pages (auto-deploy from `main`)
- **Form handler:** Cloudflare Pages Function (`functions/subscribe.js`)
- **Email storage:** Google Apps Script → Google Sheet

## Deploying from Claude Code

```bash
npx wrangler pages deploy public --project-name skoolit-landing
```

Or push to `main` — Cloudflare auto-deploys via GitHub integration.

## First-time setup

### 1. Google Apps Script (one-time)

1. Open [script.google.com](https://script.google.com) → New project
2. Paste this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // Column layout is read from the header row (row 1), so field order here can
  // change without touching this script. Make sure the header row contains at
  // least "email" and "heard_from" cells for the two-step flow below.
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0].map(String);
  const colOf = (name) => headers.indexOf(name) + 1; // 1-based; 0 = not found

  // Two-step signup: the email is written on the first submit, then the
  // "How did you hear about us?" answer arrives on the second submit with
  // update:true. Fill heard_from on this email's most recent row instead of
  // appending a duplicate. Falls back to appending if the row isn't found.
  if (data.update) {
    const emailCol = colOf('email');
    const heardCol = colOf('heard_from');
    const rows = Math.max(sheet.getLastRow() - 1, 0);
    if (emailCol && heardCol && rows) {
      const emails = sheet.getRange(2, emailCol, rows, 1).getValues();
      const target = String(data.email).trim().toLowerCase();
      for (let i = emails.length - 1; i >= 0; i--) {
        if (String(emails[i][0]).trim().toLowerCase() === target) {
          sheet.getRange(i + 2, heardCol).setValue(data.heard_from || '');
          return json({ success: true, updated: true });
        }
      }
    }
  }

  // First submit (and any non-update call): append a new row, aligning each
  // value to its header column by name.
  sheet.appendRow(headers.map((h) => (data[h] !== undefined ? data[h] : '')));
  return json({ success: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Replace `YOUR_SHEET_ID` with the ID from your Google Sheet URL. Ensure row 1
   has header cells whose names match the payload fields you want stored —
   e.g. `timestamp`, `email`, `source`, `heard_from`, `utm_source`, `ref`.
4. Deploy → New deployment → Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL

### 2. Add the secret to Cloudflare

```bash
npx wrangler pages secret put APPS_SCRIPT_URL --project-name skoolit-landing
# paste the Apps Script URL when prompted
```

Or set it in the Cloudflare dashboard: Pages → skoolit-landing → Settings → Environment variables → Add secret `APPS_SCRIPT_URL`.

### 3. Connect GitHub to Cloudflare Pages

Cloudflare dashboard → Pages → Create project → Connect to Git → select `skoolit-landing`

- Build command: *(leave blank)*
- Output directory: `public`

### 4. Custom domain

Pages → skoolit-landing → Custom domains → Add `getskoolit.com`

Cloudflare handles DNS and SSL automatically.

### 5. Redirect domains

For skoolit.ai, skoolit.app, skoolit.co, skoolit.net:

Cloudflare dashboard → Rules → Redirect Rules → Bulk Redirects → Create list:
- Source URL: `https://skoolit.app/` → Destination: `https://getskoolit.com/` (301, Include subpath)
- Repeat for each domain

## Local preview

```bash
npx wrangler pages dev public --binding APPS_SCRIPT_URL=https://your-script-url
```
