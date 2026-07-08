/* Skoolit attribution tracking — first-touch UTM + referrer + per-referrer capture.
 *
 * Included on every page. On load it captures campaign parameters from the
 * URL (first-touch wins — existing values are never overwritten), and it
 * transparently attaches the stored values to every POST to /subscribe via a
 * fetch() wrapper. This keeps all signup forms covered without per-form
 * changes, and preserves any fields a form sets explicitly (e.g. the prototype
 * gate's name/phone/source, or the "How did you hear about us?" heard_from).
 *
 * Per-referrer referral links (?ref=)
 * -----------------------------------
 * Ambassadors and boosters each get a unique referral link so their signups
 * can be credited to them. The link carries a `ref` query param:
 *
 *     https://getskoolit.com/trial/?ref=<code>
 *     https://getskoolit.com/?ref=<code>
 *
 * Expected `ref` format: a short URL-safe referrer code assigned by the
 * backend — letters, digits, hyphen and underscore (e.g. `amb-jane42`,
 * `booster_1057`). We capture it verbatim; we do not parse or validate its
 * internal structure here. First-touch wins, and because a referred visitor
 * may return days later before signing up, `ref` is persisted in
 * localStorage (durable across sessions) rather than sessionStorage. It is
 * then forwarded on the /subscribe payload as `ref` for the backend to credit
 * the right referrer. (Backend crediting is out of scope for this repo.)
 */
(function () {
  'use strict';

  var PREFIX = 'sk_attr_';
  // Params captured on first touch.
  var CAPTURE = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
  // Fields forwarded to /subscribe (utm_term is captured but not forwarded).
  var FORWARD = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref', 'first_referrer'];
  // Keys persisted durably (localStorage) so they survive across sessions —
  // a per-referrer ref should still credit the referrer if the visitor
  // returns later. Everything else lives in sessionStorage (this visit only).
  var DURABLE = { ref: true };

  function backend(key) {
    try {
      return DURABLE[key] ? window.localStorage : window.sessionStorage;
    } catch (e) {
      return null;
    }
  }

  function store(key, value) {
    try {
      var s = backend(key);
      if (s && value && !s.getItem(PREFIX + key)) {
        s.setItem(PREFIX + key, value);
      }
    } catch (e) { /* storage unavailable (private mode / disabled) */ }
  }

  function read(key) {
    try {
      var s = backend(key);
      return (s && s.getItem(PREFIX + key)) || '';
    } catch (e) {
      return '';
    }
  }

  // ── First-touch capture: UTM + ref from the query string ──────────────
  try {
    var params = new URLSearchParams(window.location.search);
    CAPTURE.forEach(function (k) { store(k, params.get(k)); });
  } catch (e) { /* no-op */ }

  // ── First-touch capture: external referrer only ───────────────────────
  try {
    if (document.referrer) {
      var refHost = new URL(document.referrer).hostname;
      if (refHost && refHost !== window.location.hostname) {
        store('first_referrer', document.referrer);
      }
    }
  } catch (e) { /* malformed referrer */ }

  // ── Public accessor (also useful for debugging in the console) ────────
  function attribution() {
    var out = {};
    FORWARD.forEach(function (k) { out[k] = read(k); });
    return out;
  }
  window.skoolitAttribution = attribution;

  // ── Transparent /subscribe payload enrichment ─────────────────────────
  if (typeof window.fetch === 'function') {
    var nativeFetch = window.fetch;
    window.fetch = function (input, init) {
      try {
        var url = typeof input === 'string' ? input : (input && input.url) || '';
        if (url.indexOf('/subscribe') !== -1 && init && typeof init.body === 'string') {
          var data = JSON.parse(init.body);
          var attr = attribution();
          // Only fill fields the form didn't set — don't clobber explicit values.
          Object.keys(attr).forEach(function (k) {
            if (data[k] === undefined || data[k] === '') data[k] = attr[k];
          });
          init.body = JSON.stringify(data);
        }
      } catch (e) { /* leave the request untouched on any error */ }
      return nativeFetch.apply(this, arguments);
    };
  }
})();
