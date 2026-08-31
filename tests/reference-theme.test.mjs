import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import postcss from "postcss";
import sharp from "sharp";
import ts from "typescript";

function source(path) { return readFileSync(new URL(`../${path}`, import.meta.url), "utf8"); }
function data(path) {
  const compiled = ts.transpileModule(source(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", compiled)(module, module.exports);
  return module.exports;
}

test("blog index reserves the responsive overlay-header height before its breadcrumb", () => {
  const css = source("app/globals.css");
  assert.match(source("components/blog-view.tsx"), /post \? "blog-article-hero editorial-hero" : "blog-index-hero"/);
  assert.match(css, /\.blog-index-hero\s*\{\s*padding-top:\s*calc\(var\(--site-header-height\) \+ 45px\)/);
  for (const height of [104, 90, 82]) assert.ok(css.includes(`--site-header-height: ${height}px`));
  assert.match(css, /\.main-header\s*\{\s*height: var\(--site-header-height\); margin-bottom: calc\(-1 \* var\(--site-header-height\)\)/);
});

test("branded favicon uses the orange/charcoal identity and a cache-versioned URL", () => {
  const svg = source("public/favicon.svg");
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert.match(svg, /<title>TengYoda Logistics<\/title>/);
  assert.match(svg, /#252831/i);
  assert.match(svg, /#FF8900/i);
  assert.match(source("app/layout.tsx"), /icon: "\/favicon\.svg\?v=tengyoda-2"/);
});

test("shared branding restores the original TengYoda wordmark and retains the unused supplied artwork", () => {
  const image = readFileSync(new URL("../public/images/tengyoda-logo-tyd.png", import.meta.url));
  assert.equal(createHash("sha256").update(image).digest("hex"), "107c6337f81f87127ca89f9a3dfdd4bfb49956cd05e3afe87be456f231c9b282", "retain the original file separately from the monochrome edit");
  assert.equal(image.readUInt32BE(16), 181);
  assert.equal(image.readUInt32BE(20), 97);
  const brand = source("components/site-header.tsx").match(/export function Brand\(\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(brand);
  assert.match(brand, /href="\/" aria-label="TengYoda Logistics home"/);
  assert.match(brand, /<strong>TengYoda<span className="brand-chevron" aria-hidden="true">›<\/span><\/strong>/);
  assert.match(brand, /<small>GLOBAL LOGISTICS<\/small>/);
  assert.doesNotMatch(brand, /<img|tengyoda-logo|brand-symbol/);
  assert.match(source("components/site-footer.tsx"), /<Brand\s*\/>/);
});

test("retained unused solid logo has exactly one orange RGB color and a real transparent alpha channel", async () => {
  const path = new URL("../public/images/tengyoda-logo-solid.png", import.meta.url).pathname;
  const metadata = await sharp(path).metadata();
  assert.equal(metadata.hasAlpha, true);
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 181);
  assert.equal(info.height, 68);
  let transparent = 0, opaque = 0, antialiased = 0;
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (!alpha) { transparent++; continue; }
    assert.deepEqual([...data.subarray(i, i + 3)], [255, 137, 0], "no red/yellow gradient or white fringe");
    if (alpha === 255) opaque++; else antialiased++;
  }
  assert.ok(transparent > info.width * info.height / 2, "background and cutouts are actually transparent");
  assert.ok(opaque > 2000, "solid filled logo, not a faint mask");
  assert.ok(antialiased > 0, "preserve softened original edges");
});

test("retained unused recoloring preserves every original silhouette pixel and every white cutout", async () => {
  const original = await sharp(new URL("../public/images/tengyoda-logo-tyd.png", import.meta.url).pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const edited = await sharp(new URL("../public/images/tengyoda-logo-solid.png", import.meta.url).pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let originalFilled = 0;
  for (let y = 0; y < original.info.height; y++) {
    for (let x = 0; x < original.info.width; x++) {
      const i = (y * original.info.width + x) * 4;
      const filled = original.data[i + 3] > 0 && Math.min(...original.data.subarray(i, i + 3)) < 255;
      const outX = x - 5, outY = y - 28;
      if (filled) originalFilled++;
      if (outX < 0 || outY < 0 || outX >= edited.info.width || outY >= edited.info.height) {
        assert.equal(filled, false, "only empty margins were removed");
      } else {
        assert.equal(edited.data[(outY * edited.info.width + outX) * 4 + 3] > 0, filled, `silhouette/cutout at ${x},${y}`);
      }
    }
  }
  let editedFilled = 0;
  for (let i = 3; i < edited.data.length; i += 4) if (edited.data[i] > 0) editedFilled++;
  assert.equal(editedFilled, originalFilled, "no redrawn, expanded or additional shape pixels");
});

test("wordmark styling restores the original white type, orange chevron and mobile sizes", () => {
  const rules = [];
  postcss.parse(source("app/globals.css")).walkRules(rule => {
    rules.push(rule);
  });
  const value = (rule, prop) => rule.nodes.find(node => node.prop === prop)?.value;
  const desktop = selector => rules.filter(rule => rule.selector === selector && rule.parent.type === "root").at(-1);
  const mobile = selector => rules.filter(rule => rule.selector === selector && rule.parent.type === "atrule" && rule.parent.params === "(max-width: 820px)").at(-1);
  assert.equal(value(desktop(".brand strong"), "font-size"), "37px");
  assert.equal(value(desktop(".brand strong"), "color"), "white");
  assert.equal(value(desktop(".brand-chevron"), "color"), "var(--orange)");
  assert.equal(value(desktop(".brand-chevron"), "font-size"), "48px");
  assert.equal(value(desktop(".brand small"), "font-size"), "9px");
  assert.equal(value(desktop(".brand small"), "color"), "white");
  assert.equal(value(mobile(".brand strong"), "font-size"), "31px");
  assert.equal(value(mobile(".brand-chevron"), "font-size"), "42px");
  assert.equal(value(mobile(".brand small"), "font-size"), "8px");
  assert.notEqual(value(desktop(".brand"), "line-height"), "0");
  assert.ok(!rules.some(rule => rule.selector === ".brand-logo"), "uploaded-image framing no longer applies");
});

test("six core services have distinct, optimised subject-specific images", () => {
  const { coreServices, getService } = data("lib/services.ts");
  assert.equal(new Set(coreServices.map(service => service.image)).size, 6);
  const expected = {
    "transport-warehousing": "china-domestic-trucking",
    "sea-freight": "sea-freight",
    "air-freight": "air-freight",
    "international-express": "international-express-parcels",
    "china-import-export": "procurement-warehouse",
    "cargo-consolidation": "warehouse-operations",
  };
  for (const [slug, filename] of Object.entries(expected)) {
    const service = getService(slug);
    assert.equal(service.image, `/images/${filename}.webp`);
    const path = new URL(`../public${service.image}`, import.meta.url);
    assert.ok(statSync(path).size < 350_000, `${slug}: optimised size`);
    assert.equal(readFileSync(path).subarray(8, 12).toString(), "WEBP");
  }
});

test("reference art direction preserves accessible contact links without the removed image note", () => {
  const css = source("app/globals.css");
  assert.match(css, /--orange: #ff8900/);
  assert.match(css, /\.main-header \{ height: var\(--site-header-height\); margin-bottom: calc\(-1 \* var\(--site-header-height\)\)/);
  assert.match(css, /\.button\.accent \{ color: #252831; \}/);
  assert.match(source("components/world-clock-bar.tsx"), /className="clock-call" href=\{company\.telephone\}/);
  assert.doesNotMatch(source("components/world-clock-bar.tsx"), /tel:\$\{company\.telephone\}/);
  const footer = source("components/site-footer.tsx");
  assert.doesNotMatch(footer, /配图为物流场景示意|非公司实拍|Images illustrate logistics scenes, not company facilities/);
  assert.match(footer, /AnalyticsPreferenceButton language=\{language\}/);
  assert.match(footer, /href="#top"/);
  for (const file of ["components/site-footer.tsx", "components/service-view.tsx", "components/blog-view.tsx"]) {
    assert.doesNotMatch(source(file), /非公司实拍|Images illustrate logistics scenes|Illustrative logistics scene; not a photograph|Images are illustrative, not photographs/, file);
  }
  const hero = source("components/hero-carousel.tsx");
  assert.match(hero, /warehouse-operations\.webp/);
  assert.match(hero, /sea-freight\.webp/);
  assert.match(hero, /air-freight\.webp/);
  assert.match(hero, /direction-mark" aria-hidden="true"/);
});
