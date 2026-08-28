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
  // Params captured on first touch. utm_source_platform distinguishes the
  // scheduler behind a social post (e.g. `publer`) from the network itself.
  var CAPTURE = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_source_platform', 'ref'];
  // Fields forwarded to /subscribe (utm_term is captured but not forwarded).
  var FORWARD = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_source_platform', 'ref', 'first_referrer'];
  // Keys persisted durably (localStorage) so first-touch attribution survives
  // across sessions — a visitor who clicks a campaign post today and signs up
  // days later is still credited to that campaign (and to the referrer via
  // ref). utm_term lives in sessionStorage (this visit only) and isn't
  // forwarded, so it's intentionally left out.
  var DURABLE = {
    utm_source: true,
    utm_medium: true,
    utm_campaign: true,
    utm_content: true,
    utm_source_platform: true,
    first_referrer: true,
    ref: true
  };

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

  // ── Transparent /subscribe payload enrichment + GA4 conversion ────────
  // Every signup form on the site POSTs to /subscribe, so this one wrapper is
  // the single place that (a) attaches first-touch attribution to the payload
  // the backend stores, and (b) fires one GA4 `sign_up` event per new signup —
  // carrying the campaign fields so a conversion can be traced to the exact
  // campaign, network, and post (e.g. preaccess_aug26 / publer / soc_mental_07).
  if (typeof window.fetch === 'function') {
    var nativeFetch = window.fetch;
    window.fetch = function (input, init) {
      var fireSignup = false;
      var signupSource = '';
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
          // One conversion per new email. Skip follow-up updates to an existing
          // signup (e.g. the trial page's second "heard_from" POST, update:true).
          if (!data.update) {
            fireSignup = true;
            signupSource = data.source || attr.utm_source || 'direct';
          }
        }
      } catch (e) { /* leave the request untouched on any error */ }

      var result = nativeFetch.apply(this, arguments);

      // Fire the GA4 event only after the backend confirms the signup, and
      // never let an analytics error affect the request the form is awaiting.
      if (fireSignup && result && typeof result.then === 'function') {
        return result.then(function (res) {
          try {
            if (res && res.ok && typeof window.gtag === 'function') {
              var a = attribution();
              window.gtag('event', 'sign_up', {
                method: signupSource,
                campaign: a.utm_campaign || '',
                source: a.utm_source || '',
                content: a.utm_content || '',
                source_platform: a.utm_source_platform || ''
              });
            }
          } catch (e) { /* analytics must never break the signup */ }
          return res;
        });
      }
      return result;
    };
  }
})();
