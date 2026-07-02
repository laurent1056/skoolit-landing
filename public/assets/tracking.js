/* Skoolit attribution tracking — first-touch UTM + referrer capture.
 *
 * Included on every page. On load it captures campaign parameters from the
 * URL into sessionStorage (first-touch wins — existing values are never
 * overwritten), and it transparently attaches the stored values to every
 * POST to /subscribe via a fetch() wrapper. This keeps all signup forms
 * covered without per-form changes, and preserves any fields a form sets
 * explicitly (e.g. the prototype gate's name/phone/source).
 */
(function () {
  'use strict';

  var PREFIX = 'sk_attr_';
  // Params captured to sessionStorage on first touch.
  var CAPTURE = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref'];
  // Fields forwarded to /subscribe (utm_term is captured but not forwarded).
  var FORWARD = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref', 'first_referrer'];

  function store(key, value) {
    try {
      if (value && !sessionStorage.getItem(PREFIX + key)) {
        sessionStorage.setItem(PREFIX + key, value);
      }
    } catch (e) { /* sessionStorage unavailable (private mode / disabled) */ }
  }

  function read(key) {
    try {
      return sessionStorage.getItem(PREFIX + key) || '';
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
