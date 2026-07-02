// Cloudflare Pages Function — handles /subscribe POSTs and forwards to Apps Script.
export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers });
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address.' }), { status: 400, headers });
  }

  const appsScriptUrl = env.APPS_SCRIPT_URL;
  if (!appsScriptUrl) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration.' }), { status: 500, headers });
  }

  // Neutralize spreadsheet formula injection before values reach Google Sheets.
  // Any value beginning with =, +, -, @, or a tab/CR is treated as a formula by
  // Sheets (e.g. =IMPORTXML/=IMAGE auto-execute on open and can exfiltrate data),
  // so prefix those with an apostrophe and cap length as defense-in-depth.
  const sanitize = (value, max) => {
    let v = (value || '').trim().slice(0, max);
    if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
    return v || undefined;
  };

  const payload = {
    email:  sanitize(email, 254),
    timestamp: new Date().toISOString(),
    name:   sanitize(body.name,   100),
    phone:  sanitize(body.phone,  40),
    source: sanitize(body.source, 100),
    // Attribution fields (default to empty string when absent so the Sheet
    // columns stay aligned for submissions that carry no campaign data).
    utm_source:     sanitize(body.utm_source,     200) || '',
    utm_medium:     sanitize(body.utm_medium,     200) || '',
    utm_campaign:   sanitize(body.utm_campaign,   200) || '',
    utm_content:    sanitize(body.utm_content,    200) || '',
    ref:            sanitize(body.ref,            200) || '',
    first_referrer: sanitize(body.first_referrer, 500) || '',
  };

  try {
    const res = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (!res.ok) {
      throw new Error(`Apps Script returned ${res.status}`);
    }
  } catch (err) {
    console.error('Apps Script error:', err.message);
    return new Response(JSON.stringify({ error: 'Failed to save. Please try again.' }), { status: 502, headers });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
