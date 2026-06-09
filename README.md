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
  sheet.appendRow([data.timestamp, data.email]);
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Replace `YOUR_SHEET_ID` with the ID from your Google Sheet URL
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
