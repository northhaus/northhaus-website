// Renders the static /links page from links-data.mjs. No runtime JS required.
// opts.asset(path) can remap asset URLs (used for local previews only).
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderLinks(d, opts = {}) {
  const asset = opts.asset || ((p) => p);
  const fontBase = opts.fontBase || '/assets/fonts/';
  const consentSrc = opts.consentSrc ?? '/consent.js';
  const analytics = opts.analytics ?? true;
  const sorted = [...d.products].sort((a, b) => a.order - b.order);
  const f = sorted.find((p) => p.featured) || sorted[0];
  const rest = sorted.filter((p) => p !== f);
  const withPrice = (p) => (p.price ? `, ${p.price}` : '');
  const img = f.image;
  const srcset = img ? img.srcset.map((s) => `${esc(asset(s.src))} ${s.w}w`).join(', ') : '';
  const largest = img ? img.srcset[img.srcset.length - 1].src : '';
  const P = d.page;
  const fonts = [300, 500, 600, 700, 900].map((w) =>
    `@font-face{font-family:'SharpSansDisplay';src:url('${fontBase}SharpSansDisplay-${w}.woff2') format('woff2');font-weight:${w};font-display:swap}`).join('\n');

  const productItems = rest.map((p) => `      <li>
        <a class="nh-item" href="${esc(p.url)}" aria-label="${esc(`${p.title}, ${p.category.toLowerCase()}${withPrice(p)}`)}">
          <span class="nh-item-body">
            <span class="nh-item-top"><span class="nh-item-title">${esc(p.title)}</span><span class="nh-item-meta">${esc(p.price ? `${p.category} · ${p.price}` : p.category)}</span></span>
            <span class="nh-item-desc">${esc(p.description)}</span>
          </span>
          <span class="nh-arrow" aria-hidden="true">&rarr;</span>
        </a>
      </li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#000000">
<title>${esc(P.title)}</title>
<meta name="description" content="${esc(P.description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${esc(P.url)}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Northhaus">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(P.title)}">
<meta property="og:description" content="${esc(P.shareDescription)}">
<meta property="og:url" content="${esc(P.url)}">
<meta property="og:image" content="${esc(P.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(P.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(P.title)}">
<meta name="twitter:description" content="${esc(P.shareDescription)}">
<meta name="twitter:image" content="${esc(P.ogImage)}">
<link rel="preload" as="font" type="font/woff2" href="${fontBase}SharpSansDisplay-900.woff2" crossorigin="anonymous">
<link rel="preload" as="font" type="font/woff2" href="${fontBase}SharpSansDisplay-500.woff2" crossorigin="anonymous">
${img ? `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="(min-width:600px) 560px, calc(100vw - 40px)" href="${esc(asset(largest))}">\n` : ''}<style>
${fonts}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%;background:#000}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:#000;color:#FBF8F3;font-family:'SharpSansDisplay','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;overflow-wrap:break-word}
a{color:#FBF8F3;text-decoration:none}
a:hover{color:#66D1DE}
:focus-visible{outline:3px solid #FBF8F3;outline-offset:4px;box-shadow:0 0 0 4px #000}
.nh-skip{position:absolute;left:12px;top:12px;z-index:10;padding:12px 18px;background:#66D1DE;color:#000;font-weight:700;transform:translateY(-200%)}
.nh-skip:focus{transform:none;color:#000}
.nh-page{order:1;flex:1 0 auto;position:relative;overflow:hidden}
.nh-glow{position:absolute;left:50%;top:-220px;width:760px;max-width:160vw;height:560px;transform:translateX(-50%);background:radial-gradient(closest-side,rgba(102,209,222,.16),rgba(102,209,222,.06) 55%,rgba(0,0,0,0));pointer-events:none}
main{position:relative;max-width:560px;margin:0 auto;padding:calc(28px + env(safe-area-inset-top,0px)) max(20px,env(safe-area-inset-right,0px)) 28px max(20px,env(safe-area-inset-left,0px));display:flex;flex-direction:column;gap:28px}
main:focus{outline:none}
.nh-head{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding-top:4px}
.nh-logo{display:inline-flex;padding:4px}
.nh-logo img{height:40px;width:auto;display:block}
.nh-tagline{margin:0;font-size:16px;font-weight:500;letter-spacing:.01em}
.nh-note{margin:-8px 0 0;padding:12px 16px;border:1px solid rgba(102,209,222,.35);border-radius:10px;background:#0a0b0c;font-size:14px;line-height:1.5;color:#FBF8F3;text-align:center;text-wrap:pretty}
.nh-feat{border:1px solid rgba(102,209,222,.45);border-radius:14px;overflow:hidden;background:#07090a;box-shadow:0 0 0 1px rgba(102,209,222,.06),0 18px 60px -24px rgba(102,209,222,.35)}
.nh-feat img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;background:#0d1314}
.nh-feat-body{padding:22px 22px 24px;display:flex;flex-direction:column;gap:12px}
.nh-eyebrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase}
.nh-teal{color:#66D1DE}
h1,h2{margin:0}
.nh-title{font-weight:900;text-transform:uppercase;letter-spacing:.01em;font-size:clamp(24px,6.4vw,32px);line-height:1.05;text-wrap:balance}
.nh-desc{margin:0;font-size:16px;line-height:1.55;color:#d9d6d0;text-wrap:pretty}
.nh-btn{display:flex;align-items:center;justify-content:center;min-height:56px;padding:12px 20px;text-align:center;font-weight:900;text-transform:uppercase;letter-spacing:.06em;font-size:15px;line-height:1.2;transition:background-color .3s ease,color .3s ease}
.nh-btn--primary{margin-top:6px;background:#66D1DE;color:#000}
.nh-btn--primary:hover,.nh-btn--primary:active{background:#FBF8F3;color:#000}
.nh-btn--outline{box-shadow:inset 0 0 0 2px #66D1DE;color:#66D1DE}
.nh-btn--outline:hover,.nh-btn--outline:active{background:#66D1DE;color:#000}
.nh-btn--outline:focus-visible{box-shadow:inset 0 0 0 2px #66D1DE,0 0 0 4px #000}
.nh-products{display:flex;flex-direction:column;gap:14px}
.nh-label{font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#66D1DE}
.nh-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.nh-item{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;min-height:64px;padding:16px 18px;border:1px solid rgba(251,248,243,.16);border-radius:12px;background:#0a0b0c;transition:border-color .3s ease,background-color .3s ease}
.nh-item:hover{border-color:rgba(102,209,222,.6);color:#FBF8F3}
.nh-item:active{background:#0f1a1b;border-color:#66D1DE}
.nh-item-body{display:flex;flex-direction:column;gap:4px;min-width:0}
.nh-item-top{display:flex;align-items:baseline;gap:4px 10px;flex-wrap:wrap}
.nh-item-title{font-size:17px;font-weight:700;line-height:1.25}
.nh-item-meta{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#66D1DE}
.nh-item-desc{font-size:14px;line-height:1.45;color:#bdbab4;text-wrap:pretty}
.nh-arrow{font-size:20px;color:#66D1DE}
.nh-text-link{align-self:center;display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 8px;font-size:15px;font-weight:600;border-bottom:2px solid #66D1DE;text-align:center}
.nh-plan{border-radius:14px;background:#66D1DE;color:#000;padding:24px 22px;display:flex;flex-direction:column;gap:12px}
.nh-plan .nh-eyebrow,.nh-plan .nh-title{color:#000}
.nh-plan .nh-title{font-size:clamp(24px,6.4vw,30px)}
.nh-plan p{margin:0;color:#000;text-wrap:pretty}
.nh-plan-desc{font-size:16px;line-height:1.55}
.nh-plan-detail{font-size:14px;line-height:1.5}
.nh-btn--dark{margin-top:6px;background:#000;color:#FBF8F3}
.nh-btn--dark:hover,.nh-btn--dark:active{background:#FBF8F3;color:#000}
.nh-plan :focus-visible{outline:3px solid #000;outline-offset:3px;box-shadow:0 0 0 3px #66D1DE,0 0 0 9px #FBF8F3}
.nh-more{display:flex;justify-content:center}
.nh-more .nh-text-link{font-size:16px}
.nh-footer{order:3;padding:20px max(20px,env(safe-area-inset-right,0px)) calc(28px + env(safe-area-inset-bottom,0px)) max(20px,env(safe-area-inset-left,0px))}
.nh-foot{text-align:center;font-size:12px;color:#9a9893;letter-spacing:.04em;margin:0}
/* Cookie notice (consent.js): shown in normal flow above the footer on this page. Behaviour unchanged. */
[role="region"][aria-label="Cookie notice"]{order:2;position:static !important;left:auto !important;right:auto !important;bottom:auto !important;z-index:auto !important;width:auto !important;max-width:520px !important;margin:0 max(20px,env(safe-area-inset-right,0px)) 0 max(20px,env(safe-area-inset-left,0px)) !important;align-self:stretch;padding:16px !important;background:#0a0b0c !important;color:#FBF8F3 !important;border:1px solid rgba(102,209,222,.55) !important;border-radius:12px !important;box-shadow:none !important;font-size:14px !important;overflow-wrap:break-word;opacity:1 !important;transform:none !important;transition:none !important}
@media (min-width:560px){[role="region"][aria-label="Cookie notice"]{align-self:center;width:calc(100% - 40px) !important;margin:0 auto !important}}
[role="region"][aria-label="Cookie notice"] p{color:#FBF8F3 !important;margin:0 0 14px !important}
[role="region"][aria-label="Cookie notice"] a{color:#66D1DE !important;text-decoration:underline !important;text-underline-offset:2px;display:inline-block;padding:4px 0}
[role="region"][aria-label="Cookie notice"] > div{flex-wrap:wrap !important}
[role="region"][aria-label="Cookie notice"] button{flex:1 1 120px !important;min-height:48px !important;height:auto !important;padding:10px 18px !important;line-height:1.2 !important;white-space:normal !important}
[role="region"][aria-label="Cookie notice"] button:first-child{background:transparent !important;color:#FBF8F3 !important;box-shadow:inset 0 0 0 2px #FBF8F3 !important}
[role="region"][aria-label="Cookie notice"] button:last-child{background:#66D1DE !important;color:#000 !important}
[role="region"][aria-label="Cookie notice"] :focus-visible{outline:3px solid #FBF8F3 !important;outline-offset:3px !important}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms !important}}
@media (forced-colors:active){.nh-btn,.nh-item{border:2px solid ButtonText}}
</style>
${analytics ? '<script defer src="/_vercel/insights/script.js"></script>\n' : ''}${consentSrc ? `<script src="${esc(consentSrc)}" defer></script>\n` : ''}</head>
<body>
<a class="nh-skip" href="#main">Skip to content</a>
<div class="nh-page">
  <div class="nh-glow" aria-hidden="true"></div>
  <main id="main" tabindex="-1">
    <header class="nh-head">
      <a class="nh-logo" href="${esc(d.site.url)}" aria-label="Northhaus home"><img src="${esc(asset(P.logo.src))}" alt="${esc(P.logo.alt)}" width="${P.logo.width}" height="${P.logo.height}"></a>
      <p class="nh-tagline">${esc(P.tagline)}</p>
    </header>
${P.inAppNote ? `
    <p class="nh-note" role="note">${esc(P.inAppNote)}</p>
` : ''}
    <section class="nh-feat" aria-labelledby="featured-title">
${img ? `      <img src="${esc(asset(largest))}" srcset="${srcset}" sizes="(min-width:600px) 560px, calc(100vw - 40px)" alt="${esc(img.alt)}" width="${img.width}" height="${img.height}" fetchpriority="high" decoding="async">\n` : ''}      <div class="nh-feat-body">
        <p class="nh-eyebrow"><span class="nh-teal">${esc(f.eyebrow || 'Featured')}</span>${f.price ? `<span>${esc(f.price)}</span>` : ''}</p>
        <h1 id="featured-title" class="nh-title">${esc(f.title)}</h1>
        <p class="nh-desc">${esc(f.description)}</p>
        <a class="nh-btn nh-btn--primary" href="${esc(f.url)}" aria-label="${esc(`${f.cta || 'View'}: ${f.title}${withPrice(f)}`)}">${esc(f.cta || 'View')}</a>
      </div>
    </section>

    <section class="nh-products" aria-labelledby="products-title">
      <h2 id="products-title" class="nh-label">Planners &amp; digital products</h2>
      <ul class="nh-list">
${productItems}
      </ul>
      <a class="nh-btn nh-btn--outline" href="${esc(d.shop.url)}">${esc(d.shop.label)}</a>
      <a class="nh-text-link" href="${esc(d.productsPage.url)}">${esc(d.productsPage.label)} <span class="nh-teal" aria-hidden="true">&rarr;</span></a>
    </section>

    <section class="nh-plan" aria-labelledby="siteplan-title">
      <p class="nh-eyebrow">${esc(d.sitePlan.eyebrow)}</p>
      <h2 id="siteplan-title" class="nh-title">${esc(d.sitePlan.title)}</h2>
      <p class="nh-plan-desc">${esc(d.sitePlan.description)}</p>
      <p class="nh-plan-detail">${esc(d.sitePlan.detail)}</p>
      <a class="nh-btn nh-btn--dark" href="${esc(d.sitePlan.url)}">${esc(d.sitePlan.cta)}</a>
    </section>

    <nav class="nh-more" aria-label="More from Northhaus">
      <a class="nh-text-link" href="${esc(d.site.url)}">${esc(d.site.label)} <span class="nh-teal" aria-hidden="true">&rarr;</span></a>
    </nav>

  </main>
</div>
<footer class="nh-footer"><p class="nh-foot">${esc(d.footer)}</p></footer>
</body>
</html>
`;
}
