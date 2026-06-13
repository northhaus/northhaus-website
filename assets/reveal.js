/* ─────────────────────────────────────────────
   NORTHHAUS — cursor code-reveal
   Builds a clipped "code band" inside the hero and
   reveals it under a smoothed cursor spotlight.
   Desktop + fine pointer only. The hero lives inside
   the 3840 canvas that the stage scales, so cursor
   coords are mapped from screen space into canvas px.
   ───────────────────────────────────────────── */
(function () {
  "use strict";

  var SPOTLIGHT_SCREEN_R = 260;   // on-screen radius in CSS px
  var EASE = 0.12;                // cursor smoothing
  var ACTIVE = "(min-width: 1100px) and (pointer: fine)";

  /* Per-page code. Keyed off the filename. Two columns each:
     left = markup, right = styles / logic. Purely decorative,
     but themed to each page so the reveal feels intentional. */
  var SNIPPETS = {
    about: {
      left:
'<span class="com">&lt;!-- hero.about --&gt;</span>\n' +
'<span class="tag">&lt;section</span> <span class="attr">class</span>=<span class="str">"hero"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;h1</span> <span class="attr">class</span>=<span class="str">"hero__title"</span><span class="tag">&gt;</span>\n' +
'    <span class="tag">&lt;span</span> <span class="attr">class</span>=<span class="str">"line-a"</span><span class="tag">&gt;</span>Redefining<span class="tag">&lt;/span&gt;</span>\n' +
'    <span class="tag">&lt;span</span> <span class="attr">class</span>=<span class="str">"line-b"</span><span class="tag">&gt;</span>What&rsquo;s Possible.<span class="tag">&lt;/span&gt;</span>\n' +
'  <span class="tag">&lt;/h1&gt;</span>\n' +
'  <span class="tag">&lt;p</span> <span class="attr">class</span>=<span class="str">"hero__lede"</span><span class="tag">&gt;</span>\n' +
'    I build interfaces from the future.\n' +
'  <span class="tag">&lt;/p&gt;</span>\n' +
'<span class="tag">&lt;/section&gt;</span>\n\n' +
'<span class="com">&lt;!-- nav · five routes --&gt;</span>\n' +
'<span class="tag">&lt;nav</span> <span class="attr">class</span>=<span class="str">"primary-nav"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;a</span> <span class="attr">aria-current</span>=<span class="str">"page"</span><span class="tag">&gt;</span>about<span class="tag">&lt;/a&gt;</span>\n' +
'  <span class="tag">&lt;a&gt;</span>web design<span class="tag">&lt;/a&gt;</span>\n' +
'  <span class="tag">&lt;a&gt;</span>graphic design<span class="tag">&lt;/a&gt;</span>\n' +
'  <span class="tag">&lt;a&gt;</span>digital products<span class="tag">&lt;/a&gt;</span>\n' +
'  <span class="tag">&lt;a&gt;</span>contact<span class="tag">&lt;/a&gt;</span>\n' +
'<span class="tag">&lt;/nav&gt;</span>',
      right:
'<span class="com">/* tokens.css */</span>\n' +
'<span class="tag">:root</span> {\n' +
'  <span class="attr">--bg</span>:    <span class="str">#000000</span>;\n' +
'  <span class="attr">--teal</span>:  <span class="str">#66d1de</span>;\n' +
'  <span class="attr">--text</span>:  <span class="str">#ffffff</span>;\n' +
'  <span class="attr">--font</span>:  <span class="str">"Sharp Sans Display"</span>;\n' +
'  <span class="attr">--canvas-w</span>: <span class="str">3840px</span>;\n' +
'}\n\n' +
'<span class="tag">.hero__title</span> {\n' +
'  <span class="attr">font-weight</span>: <span class="str">900</span>;\n' +
'  <span class="attr">font-size</span>: <span class="str">332pt</span>;\n' +
'  <span class="attr">line-height</span>: <span class="str">0.86</span>;\n' +
'  <span class="attr">text-transform</span>: <span class="str">uppercase</span>;\n' +
'}\n' +
'<span class="tag">.line-a</span> { <span class="attr">color</span>: <span class="str">var(--teal)</span>; }\n' +
'<span class="tag">.dot</span>    { <span class="attr">color</span>: <span class="str">var(--teal)</span>; }\n\n' +
'<span class="com">// reveal · spotlight follows cursor</span>\n' +
'<span class="attr">smooth.x</span> += (mouse.x - smooth.x) * <span class="str">0.12</span>;\n' +
'<span class="attr">smooth.y</span> += (mouse.y - smooth.y) * <span class="str">0.12</span>;'
      ,third:
'<span class="com">// stage · scale to viewport</span>\n' +
'<span class="attr">const</span> s = innerWidth / <span class="str">3840</span>;\n' +
'stage.style.transform =\n' +
'  <span class="str">`scale(${s})`</span>;\n\n' +
'<span class="com">// hero words rise on load</span>\n' +
'words.forEach((w, i) =&gt; {\n' +
'  w.style.transitionDelay =\n' +
'    (i * <span class="str">0.14</span>) + <span class="str">"s"</span>;\n' +
'});\n' +
'title.classList.add(<span class="str">"is-revealed"</span>);\n\n' +
'<span class="com">/* hairline frames the band */</span>\n' +
'<span class="tag">.header-rule</span> { <span class="attr">height</span>: <span class="str">3px</span>; }'
    },

    web: {
      left:
'<span class="com">&lt;!-- web-design --&gt;</span>\n' +
'<span class="tag">&lt;main</span> <span class="attr">class</span>=<span class="str">"grid"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;article</span> <span class="attr">class</span>=<span class="str">"case"</span><span class="tag">&gt;</span>\n' +
'    <span class="tag">&lt;figure&gt;</span>\n' +
'      <span class="tag">&lt;img</span> <span class="attr">loading</span>=<span class="str">"lazy"</span>\n' +
'           <span class="attr">src</span>=<span class="str">"case-01.webp"</span><span class="tag">&gt;</span>\n' +
'    <span class="tag">&lt;/figure&gt;</span>\n' +
'    <span class="tag">&lt;h3&gt;</span>Responsive build<span class="tag">&lt;/h3&gt;</span>\n' +
'  <span class="tag">&lt;/article&gt;</span>\n' +
'<span class="tag">&lt;/main&gt;</span>\n\n' +
'<span class="com">&lt;!-- breakpoints --&gt;</span>\n' +
'<span class="tag">&lt;meta</span> <span class="attr">name</span>=<span class="str">"viewport"</span>\n' +
'      <span class="attr">content</span>=<span class="str">"width=device-width"</span><span class="tag">&gt;</span>',
      right:
'<span class="com">/* fluid grid */</span>\n' +
'<span class="tag">.grid</span> {\n' +
'  <span class="attr">display</span>: <span class="str">grid</span>;\n' +
'  <span class="attr">grid-template-columns</span>:\n' +
'    <span class="str">repeat(auto-fit, minmax(320px, 1fr))</span>;\n' +
'  <span class="attr">gap</span>: <span class="str">clamp(24px, 4vw, 80px)</span>;\n' +
'}\n\n' +
'<span class="tag">@media</span> (<span class="attr">min-width</span>: <span class="str">1100px</span>) {\n' +
'  <span class="tag">.stage</span> {\n' +
'    <span class="attr">width</span>: <span class="str">var(--canvas-w)</span>;\n' +
'    <span class="attr">transform</span>: <span class="str">scale(calc(100vw / 3840))</span>;\n' +
'    <span class="attr">transform-origin</span>: <span class="str">top left</span>;\n' +
'  }\n' +
'}\n\n' +
'<span class="com">// lazy-load + reveal on scroll</span>\n' +
'<span class="attr">new</span> IntersectionObserver(reveal, {\n' +
'  <span class="attr">rootMargin</span>: <span class="str">"-10% 0px"</span>\n' +
'}).observe(tile);'
      ,third:
'<span class="com">// preload critical webp</span>\n' +
'<span class="attr">const</span> link =\n' +
'  document.createElement(<span class="str">"link"</span>);\n' +
'link.rel  = <span class="str">"preload"</span>;\n' +
'link.as   = <span class="str">"image"</span>;\n' +
'link.href = <span class="str">"case-01.webp"</span>;\n' +
'head.appendChild(link);\n\n' +
'<span class="com">/* respect motion prefs */</span>\n' +
'<span class="tag">@media</span> (prefers-reduced-motion) {\n' +
'  * { <span class="attr">animation</span>: <span class="str">none</span>; }\n' +
'}'
    },

    graphic: {
      left:
'<span class="com">&lt;!-- graphic-design --&gt;</span>\n' +
'<span class="tag">&lt;svg</span> <span class="attr">viewBox</span>=<span class="str">"0 0 256 256"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;path</span> <span class="attr">fill</span>=<span class="str">"#66d1de"</span>\n' +
'        <span class="attr">d</span>=<span class="str">"M128 0 L256 128 ..."</span><span class="tag">/&gt;</span>\n' +
'<span class="tag">&lt;/svg&gt;</span>\n\n' +
'<span class="com">&lt;!-- type specimen --&gt;</span>\n' +
'<span class="tag">&lt;span</span> <span class="attr">class</span>=<span class="str">"specimen"</span><span class="tag">&gt;</span>\n' +
'  Sharp Sans Display\n' +
'  300 &middot; 500 &middot; 600 &middot; 700 &middot; 900\n' +
'<span class="tag">&lt;/span&gt;</span>',
      right:
'<span class="com">/* brand palette */</span>\n' +
'<span class="attr">$black</span>:  <span class="str">#000000</span>;\n' +
'<span class="attr">$teal</span>:   <span class="str">#66d1de</span>;\n' +
'<span class="attr">$white</span>:  <span class="str">#ffffff</span>;\n\n' +
'<span class="tag">.mark</span> {\n' +
'  <span class="attr">fill</span>: <span class="str">$teal</span>;\n' +
'  <span class="attr">transform-box</span>: <span class="str">fill-box</span>;\n' +
'}\n' +
'<span class="tag">.wordmark::after</span> {\n' +
'  <span class="attr">content</span>: <span class="str">"."</span>;\n' +
'  <span class="attr">color</span>: <span class="str">$teal</span>;\n' +
'}\n\n' +
'<span class="com">// export @1x @2x @3x</span>\n' +
'<span class="attr">scales</span>.forEach(s =&gt; render(art, s));'
      ,third:
'<span class="com">// build the asset set</span>\n' +
'<span class="attr">const</span> sizes = [<span class="str">1</span>, <span class="str">2</span>, <span class="str">3</span>];\n' +
'sizes.forEach(scale =&gt; {\n' +
'  canvas.width = w * scale;\n' +
'  ctx.drawImage(art, <span class="str">0</span>, <span class="str">0</span>);\n' +
'  save(<span class="str">`logo@${scale}x.png`</span>);\n' +
'});\n\n' +
'<span class="com">/* safe area for the mark */</span>\n' +
'<span class="tag">.mark</span> { <span class="attr">padding</span>: <span class="str">12.5%</span>; }'
    },

    products: {
      left:
'<span class="com">&lt;!-- digital-products --&gt;</span>\n' +
'<span class="tag">&lt;section</span> <span class="attr">class</span>=<span class="str">"tool"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;h2&gt;</span>UK Budget Tracker<span class="tag">&lt;/h2&gt;</span>\n' +
'  <span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"number"</span>\n' +
'         <span class="attr">data-field</span>=<span class="str">"amount"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;button</span> <span class="attr">data-act</span>=<span class="str">"export"</span><span class="tag">&gt;</span>\n' +
'    Export CSV\n' +
'  <span class="tag">&lt;/button&gt;</span>\n' +
'<span class="tag">&lt;/section&gt;</span>',
      right:
'<span class="com">// persist to localStorage</span>\n' +
'<span class="attr">function</span> save(state) {\n' +
'  localStorage.setItem(\n' +
'    <span class="str">"northhaus:budget"</span>,\n' +
'    JSON.stringify(state)\n' +
'  );\n' +
'}\n\n' +
'<span class="attr">function</span> toCSV(rows) {\n' +
'  <span class="attr">return</span> rows\n' +
'    .map(r =&gt; r.join(<span class="str">","</span>))\n' +
'    .join(<span class="str">"\\n"</span>);\n' +
'}\n\n' +
'<span class="com">/* print → PDF */</span>\n' +
'<span class="tag">@media</span> print { <span class="tag">.ui</span> { <span class="attr">display</span>: <span class="str">none</span>; } }'
      ,third:
'<span class="com">// running totals</span>\n' +
'<span class="attr">const</span> total = rows\n' +
'  .reduce((a, r) =&gt; a + r.amt, <span class="str">0</span>);\n' +
'render(format(total, <span class="str">"GBP"</span>));\n\n' +
'<span class="com">// import from CSV</span>\n' +
'<span class="attr">function</span> fromCSV(text) {\n' +
'  <span class="attr">return</span> text.trim()\n' +
'    .split(<span class="str">"\\n"</span>)\n' +
'    .map(l =&gt; l.split(<span class="str">","</span>));\n' +
'}'
    },

    contact: {
      left:
'<span class="com">&lt;!-- contact --&gt;</span>\n' +
'<span class="tag">&lt;form</span> <span class="attr">method</span>=<span class="str">"post"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;label&gt;</span>Name\n' +
'    <span class="tag">&lt;input</span> <span class="attr">name</span>=<span class="str">"name"</span> <span class="attr">required</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;/label&gt;</span>\n' +
'  <span class="tag">&lt;label&gt;</span>Email\n' +
'    <span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"email"</span> <span class="attr">required</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;/label&gt;</span>\n' +
'  <span class="tag">&lt;button&gt;</span>Send<span class="tag">&lt;/button&gt;</span>\n' +
'<span class="tag">&lt;/form&gt;</span>',
      right:
'<span class="com">// validate + send</span>\n' +
'<span class="attr">const</span> ok = form.checkValidity();\n' +
'<span class="attr">if</span> (ok) {\n' +
'  <span class="attr">await</span> fetch(<span class="str">"/api/contact"</span>, {\n' +
'    method: <span class="str">"POST"</span>,\n' +
'    body: <span class="attr">new</span> FormData(form)\n' +
'  });\n' +
'}\n\n' +
'<span class="com">/* studio */</span>\n' +
'<span class="attr">hello</span>@<span class="str">northhaus.io</span>\n' +
'<span class="attr">based</span>: <span class="str">United Kingdom</span>'
      ,third:
'<span class="com">// honeypot + throttle</span>\n' +
'<span class="attr">if</span> (form.elements.website.value)\n' +
'  <span class="attr">return</span>;  <span class="com">// bot caught</span>\n\n' +
'<span class="com">/* studio hours */</span>\n' +
'mon&ndash;fri &middot; 09:00&ndash;17:30\n' +
'replies within 1 working day\n\n' +
'<span class="com">// open mail client</span>\n' +
'location.href =\n' +
'  <span class="str">`mailto:${to}?subject=${s}`</span>;'
    },

    portfolio: {
      left:
'<span class="com">&lt;!-- portfolio --&gt;</span>\n' +
'<span class="tag">&lt;ul</span> <span class="attr">class</span>=<span class="str">"folio"</span><span class="tag">&gt;</span>\n' +
'  <span class="tag">&lt;li&gt;</span>\n' +
'    <span class="tag">&lt;video</span> <span class="attr">autoplay</span> <span class="attr">muted</span> <span class="attr">loop&gt;</span>\n' +
'      <span class="tag">&lt;source</span> <span class="attr">src</span>=<span class="str">"reel.mp4"</span><span class="tag">&gt;</span>\n' +
'    <span class="tag">&lt;/video&gt;</span>\n' +
'  <span class="tag">&lt;/li&gt;</span>\n' +
'  <span class="com">&lt;!-- 28 client projects --&gt;</span>\n' +
'<span class="tag">&lt;/ul&gt;</span>',
      right:
'<span class="com">/* masonry tiles */</span>\n' +
'<span class="tag">.folio</span> {\n' +
'  <span class="attr">columns</span>: <span class="str">3</span>;\n' +
'  <span class="attr">gap</span>: <span class="str">40px</span>;\n' +
'}\n' +
'<span class="tag">.folio li</span> {\n' +
'  <span class="attr">break-inside</span>: <span class="str">avoid</span>;\n' +
'  <span class="attr">opacity</span>: <span class="str">0</span>;\n' +
'  <span class="attr">transition</span>: <span class="str">opacity .6s</span>;\n' +
'}\n\n' +
'<span class="com">// stagger in on scroll</span>\n' +
'<span class="attr">tiles</span>.forEach((t, i) =&gt;\n' +
'  setTimeout(() =&gt; reveal(t), i * <span class="str">60</span>));'
      ,third:
'<span class="com">// lazy-load each reel</span>\n' +
'<span class="attr">const</span> io = <span class="attr">new</span> IntersectionObserver(\n' +
'  (entries) =&gt; entries.forEach(e =&gt; {\n' +
'    <span class="attr">if</span> (e.isIntersecting)\n' +
'      e.target.play();\n' +
'  }), { threshold: <span class="str">0.4</span> });\n\n' +
'videos.forEach(v =&gt; io.observe(v));\n\n' +
'<span class="com">/* grid gutters */</span>\n' +
'<span class="tag">.folio</span> { <span class="attr">column-gap</span>: <span class="str">40px</span>; }'
    }
  };

  /* Repeat a snippet so the column always fills the band height,
     no matter how tall the band is. Clipped by overflow:hidden. */
  function fill(block) {
    var sep = '\n\n<span class="com">/* — */</span>\n\n';
    return block + sep + block + sep + block;
  }

  function pageKey() {    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (file.indexOf("web-design") === 0) return "web";
    if (file.indexOf("graphic-design") === 0) return "graphic";
    if (file.indexOf("digital-products") === 0) return "products";
    if (file.indexOf("contact") === 0) return "contact";
    if (file.indexOf("portfolio") === 0) return "portfolio";
    return "about";
  }

  var built = false;
  var band, glow, rafId = null;
  var scrims = [];
  var mouse = { x: -9999, y: -9999 };
  var smooth = { x: -9999, y: -9999 };

  function build() {
    if (built) return;
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var snip = SNIPPETS[pageKey()] || SNIPPETS.about;

    band = document.createElement("div");
    band.className = "code-band";
    band.setAttribute("aria-hidden", "true");
    var cols = document.createElement("div");
    cols.className = "code-cols";
    var keys = ["left", "right", "third"].filter(function (k) { return snip[k]; });
    var COL_COUNT = 5;   // enough columns that the open area beside the title stays filled
    for (var i = 0; i < COL_COUNT; i++) {
      var col = document.createElement("div");
      col.className = "code-col";
      col.innerHTML = fill(snip[keys[i % keys.length]]);
      cols.appendChild(col);
    }
    band.appendChild(cols);

    glow = document.createElement("div");
    glow.className = "code-glow";

    /* Insert behind the hero's content. */
    hero.insertBefore(glow, hero.firstChild);
    hero.insertBefore(band, hero.firstChild);

    /* Enable styles first so .hero is positioned (offsetParent) before
       we measure text positions for the scrims. */
    document.body.classList.add("reveal-on");

    /* Opaque feathered scrims over each text block (z-index 2),
       sized in canvas px so they scale with the stage. */
    addScrim(hero, hero.querySelector(".hero__title, .page-title"), 70, 90);
    addScrim(hero, hero.querySelector(".hero__lede, .page-lede"), 55, 50);

    built = true;
  }

  function sizeScrim(o) {
    var el = o.src, s = o.el;
    var host = el.offsetParent || el.parentElement;
    var hostRect = host.getBoundingClientRect();
    var scale = hostRect.width / host.offsetWidth || 1;

    /* Tight text bounds: the <h1> block is full-width, so union the
       actual .word boxes (title) — or fall back to a content range
       (lede, which has no word spans) — to hug just the glyphs. */
    var rect = null;
    var words = el.querySelectorAll(".word");
    if (words.length) {
      var L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
      words.forEach(function (w) {
        var wr = w.getBoundingClientRect();
        if (wr.left < L) L = wr.left;
        if (wr.top < T) T = wr.top;
        if (wr.right > R) R = wr.right;
        if (wr.bottom > B) B = wr.bottom;
      });
      rect = { left: L, top: T, width: R - L, height: B - T };
    } else {
      try {
        var range = document.createRange();
        range.selectNodeContents(el);
        var rr = range.getBoundingClientRect();
        if (rr.width) rect = { left: rr.left, top: rr.top, width: rr.width, height: rr.height };
      } catch (e) {}
    }
    if (!rect) {
      var er = el.getBoundingClientRect();
      rect = { left: er.left, top: er.top, width: er.width, height: er.height };
    }

    var left = (rect.left - hostRect.left) / scale;
    var top = (rect.top - hostRect.top) / scale;
    var width = rect.width / scale;
    var height = rect.height / scale;

    s.style.left = (left - o.padX) + "px";
    s.style.top = (top - o.padY) + "px";
    s.style.width = (width + o.padX * 2) + "px";
    s.style.height = (height + o.padY * 2) + "px";
  }

  function addScrim(hero, el, padX, padY) {
    if (!el) return;
    var s = document.createElement("div");
    s.className = "code-scrim";
    /* place above glow/band but below the text */
    hero.insertBefore(s, el);
    var o = { el: s, src: el, padX: padX, padY: padY };
    scrims.push(o);
    sizeScrim(o);
  }

  function teardown() {
    if (!built) return;
    if (band) band.remove();
    if (glow) glow.remove();
    scrims.forEach(function (s) { s.el.remove(); });
    scrims = [];
    document.body.classList.remove("reveal-on");
    built = false;
  }

  function onMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  function onLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function loop() {
    smooth.x += (mouse.x - smooth.x) * EASE;
    smooth.y += (mouse.y - smooth.y) * EASE;

    if (band) {
      var rect = band.getBoundingClientRect();          // scaled, on-screen
      var scale = rect.width / band.offsetWidth || 1;   // px per canvas-px
      var lx = (smooth.x - rect.left) / scale;          // → canvas space
      var ly = (smooth.y - rect.top) / scale;
      var r = SPOTLIGHT_SCREEN_R / scale;

      band.style.setProperty("--x", lx + "px");
      band.style.setProperty("--y", ly + "px");
      band.style.setProperty("--r", r + "px");

      glow.style.setProperty("--gx", (lx + 600) + "px");
      glow.style.setProperty("--gy", (ly + 600) + "px");
      glow.style.setProperty("--gr", r + "px");
    }
    rafId = requestAnimationFrame(loop);
  }

  function reposition() {
    scrims.forEach(sizeScrim);
  }

  function start() {
    build();
    if (!built) return;
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    if (rafId === null) loop();
    /* re-measure once fonts settle, so scrims hug the real text size */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(reposition);
    }
    setTimeout(reposition, 600);
  }
  function stop() {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseout", onLeave);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    teardown();
  }

  var mq = window.matchMedia(ACTIVE);
  function sync() { if (mq.matches) start(); else stop(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sync);
  } else {
    sync();
  }
  if (mq.addEventListener) mq.addEventListener("change", sync);
  else if (mq.addListener) mq.addListener(sync);
})();
