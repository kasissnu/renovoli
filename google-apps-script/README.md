# Google Sheets Lead Capture

This folder contains the Google Apps Script that receives the opt-in form data and appends it to a Google Sheet.

## Setup

1. Create a new Google Sheet.
2. Copy the spreadsheet ID from the Sheet URL.
   - It is the long string between `/d/` and `/edit`.
3. Open `Extensions` -> `Apps Script`.
4. Replace the default code with the contents of [`Code.gs`](./Code.gs).
5. Set `CONFIG.spreadsheetId` to your Sheet ID.
6. Save the project.
7. Deploy -> New deployment -> Web app.
8. Set:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
9. Deploy and copy the Web App URL.
10. Paste that URL into [`assets/funnel-config.js`](../assets/funnel-config.js) as `optinEndpoint`.

## What gets stored

The sheet will receive:

- `submittedAt`
- `sourcePage`
- `name`
- `email`
- `phone`
- `pageUrl`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `userAgent`

The script creates or uses a `Leads` sheet tab inside the spreadsheet you connect.
