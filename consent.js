/* Northhaus – analytics consent + deferred GA4. GA never loads unless the visitor accepts. */
(function () {
  var ID = 'G-CRE9ZPKMT5', KEY = 'nh-analytics-consent', box = null;
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function loadGA() {
    if (window.__nhGA) return;
    window.__nhGA = true;
    window['ga-disable-' + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }

  function dropGACookies() {
    window['ga-disable-' + ID] = true;
    var host = location.hostname, bare = host.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0) {
        [host, '.' + host, bare, '.' + bare].forEach(function (d) {
          document.cookie = n + '=; Max-Age=0; path=/; domain=' + d;
        });
        document.cookie = n + '=; Max-Age=0; path=/';
      }
    });
  }

  function afterLoad(fn) {
    var idle = function () {
      if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 3000 });
      else setTimeout(fn, 1500);
    };
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
  }

  function hide() {
    if (!box) return;
    var b = box; box = null;
    b.style.opacity = '0';
    b.style.transform = 'translateY(12px)';
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 300);
  }

  function choose(v) {
    set(v);
    hide();
    if (v === 'granted') loadGA(); else dropGACookies();
  }

  function btn(label, primary) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cssText = 'flex:1 1 0;min-height:44px;padding:0 18px;border:0;border-radius:0;cursor:pointer;' +
      "font-family:'SharpSansDisplay','Helvetica Neue',Arial,sans-serif;font-weight:900;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#000;" +
      (primary ? 'background:#67D2DF;' : 'background:transparent;box-shadow:inset 0 0 0 2px #000;');
    return b;
  }

  function show() {
    if (box) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    box = document.createElement('div');
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie notice');
    box.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:70;box-sizing:border-box;width:calc(100% - 32px);max-width:360px;' +
      'padding:20px;background:#FBF8F3;color:#000;box-shadow:0 10px 40px rgba(0,0,0,.35);' +
      "font-family:'SharpSansDisplay','Helvetica Neue',Arial,sans-serif;font-weight:500;font-size:14px;line-height:1.5;cursor:auto;" +
      'opacity:0;transform:translateY(12px);transition:' + (reduce ? 'none' : 'opacity .4s cubic-bezier(.6,.5,0,1),transform .4s cubic-bezier(.6,.5,0,1)');
    var p = document.createElement('p');
    p.style.cssText = 'margin:0 0 16px;color:#000';
    p.appendChild(document.createTextNode('We use analytics cookies (Google Analytics) to understand how the site is used. They are only set if you accept. '));
    var a = document.createElement('a');
    a.href = '/privacy#cookies';
    a.textContent = 'Privacy policy';
    a.style.cssText = 'color:#000;text-decoration:underline';
    p.appendChild(a);
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px';
    var no = btn('Decline', false), yes = btn('Accept', true);
    no.addEventListener('click', function () { choose('denied'); });
    yes.addEventListener('click', function () { choose('granted'); });
    row.appendChild(no); row.appendChild(yes);
    box.appendChild(p); box.appendChild(row);
    document.body.appendChild(box);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (box) { box.style.opacity = '1'; box.style.transform = 'none'; }
    }); });
  }

  // "Change cookie settings" links (e.g. on the privacy page): any element with data-cookie-settings
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
    if (!t) return;
    e.preventDefault();
    clear();
    show();
  });

  var c = get();
  if (c === 'granted') afterLoad(loadGA);
  else if (c !== 'denied') afterLoad(show);
})();
