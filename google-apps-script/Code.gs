const CONFIG = {
  spreadsheetId: "1Db002ydHhFhIYLUYVyQdVY2m5EyLAEWrj-vXvSWKBzI",
  sheetName: "Leads",
  headers: [
    "submittedAt",
    "sourcePage",
    "name",
    "email",
    "phone",
    "pageUrl",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "userAgent"
  ]
};

function doGet() {
  return jsonResponse({
    ok: true,
    message: "Renovoli lead collector is running."
  });
}

function doPost(e) {
  try {
    const payload = normalizePayload(parsePayload(e));
    const sheet = getLeadSheet();
    ensureHeaders(sheet);

    const row = CONFIG.headers.map(function (key) {
      return payload[key] || "";
    });

    sheet.appendRow(row);

    return jsonResponse({
      ok: true
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: String(error)
    });
  }
}

function parsePayload(e) {
  const payload = {};

  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (key) {
      payload[key] = e.parameter[key];
    });
  }

  if (e && e.postData && e.postData.contents) {
    try {
      const parsed = JSON.parse(e.postData.contents);
      Object.keys(parsed).forEach(function (key) {
        payload[key] = parsed[key];
      });
    } catch (error) {
      // The front end sends form-encoded data, so e.parameter is enough.
    }
  }

  return payload;
}

function normalizePayload(payload) {
  const normalized = {};

  CONFIG.headers.forEach(function (key) {
    normalized[key] = payload[key] ? String(payload[key]) : "";
  });

  normalized.submittedAt = formatSubmittedAt(normalized.submittedAt);

  return normalized;
}

function formatSubmittedAt(value) {
  const date = value ? new Date(value) : new Date();
  const pattern = "dd/MM HH:mm";

  if (isNaN(date.getTime())) {
    return Utilities.formatDate(new Date(), "Asia/Kolkata", pattern);
  }

  return Utilities.formatDate(date, "Asia/Kolkata", pattern);
}

function getLeadSheet() {
  const spreadsheet = CONFIG.spreadsheetId
    ? SpreadsheetApp.openById(CONFIG.spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("Set CONFIG.spreadsheetId or bind this script to a Google Sheet before deploying the web app.");
  }

  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  }

  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow(CONFIG.headers);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
