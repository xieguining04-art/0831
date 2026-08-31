import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";
import postcss from "postcss";

function loadData(path) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", compiled)(module, module.exports);
  return module.exports;
}
const { services, coreServices } = loadData("lib/services.ts");
const { blogPosts } = loadData("lib/blog-posts.ts");
const { company, companyLocations } = loadData("lib/company.ts");
const routes = ["/", "/services", "/blog", ...services.map(service => `/services/${service.slug}`), ...blogPosts.map(post => `/blog/${post.slug}`)];
const validPaths = new Set(routes);

test("the rendered homepage loads the generated slow-hover stylesheet, not only the source CSS", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  const html = await response.text();
  const hrefs = [...html.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => /\brel="stylesheet"/.test(tag) ? tag.match(/\bhref="([^"]+)"/)?.[1] : undefined)
    .filter(href => href?.startsWith("/"));
  assert.ok(hrefs.length, "SSR must link an emitted local stylesheet");
  const rules = [];
  for (const href of new Set(hrefs)) {
    const path = new URL(href, "https://site.invalid").pathname;
    const css = readFileSync(new URL(`../dist/client${path}`, import.meta.url), "utf8");
    postcss.parse(css).walkRules(rule => {
      rules.push(rule);
    });
  }
  const declaration = (rule, name) => rule.nodes.find(node => node.type === "decl" && node.prop === name)?.value;
  assert.ok(rules.some(rule => declaration(rule, "transition") === "transform 1.2s ease-in-out"), "the actual linked CSS contains the 1200ms transition");
  const hover = rules.find(rule => rule.selector.includes(".media-hover-card:hover") && declaration(rule, "transform") === "scale(1.1)");
  assert.ok(hover, "the emitted hover selector enlarges the image");
  assert.match(hover.parent.params, /any-hover:\s*hover/);
  assert.match(hover.parent.params, /any-pointer:\s*fine/);
  assert.doesNotMatch(hover.parent.params, /prefers-reduced-motion/);
  assert.ok(rules.some(rule => rule.selector.includes(":has(a:focus-visible)") && declaration(rule, "transform") === "scale(1.1)"));
  assert.ok(rules.filter(rule => rule.selector.includes(".media-hover-card:focus-within")).every(rule => !declaration(rule, "transform")), "mouse-click focus does not pin the compiled image transform");
  const imageSelector = ".media-hover-card :is(.service-cover,.insight-visual) img";
  assert.ok(rules.filter(rule => rule.selector.replaceAll(/\s*,\s*/g, ",").includes(imageSelector)).every(rule => declaration(rule, "transform") !== "none"), "emitted reduced-motion rules cannot disable photo transforms");
  const durationResets = rules.filter(rule => declaration(rule, "transition-duration") === ".01ms");
  assert.ok(durationResets.length);
  for (const rule of durationResets) {
    assert.ok(rule.selector.replaceAll(/\s*,\s*/g, ",").includes(`:not(${imageSelector})`), "the emitted global duration reset must exempt the photo layers");
  }
});

test("all site routes render valid service links, local images and shared contact details", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  for (const route of routes) {
    const response = await worker.fetch(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /id="main-content"/, route);
    assert.equal([...html.matchAll(/<strong>TengYoda<span class="brand-chevron" aria-hidden="true">›<\/span><\/strong><small>GLOBAL LOGISTICS<\/small>/g)].length, 2, `${route}: original wordmark appears in both shared header and footer`);
    assert.doesNotMatch(html, /tengyoda-logo-(?:tyd|solid)\.png|class="brand-logo"/, `${route}: neither uploaded-image version is displayed`);
    assert.match(html, /Analytics preferences/, `${route}: consent can be changed from the footer`);
    const menuTag = html.match(/<div\b[^>]*class="[^"]*\bservices-mega\b[^"]*"[^>]*>/)?.[0];
    assert.ok(menuTag, `${route}: persistent services panel`);
    assert.match(menuTag, /data-state="closed"/, `${route}: menu starts closed`);
    assert.match(menuTag, /aria-hidden="true"/, `${route}: closed menu hidden from assistive technology`);
    assert.match(menuTag, /\binert=""/, `${route}: closed menu cannot receive clicks or keyboard focus`);
    const expectedCards = route === "/" ? 9 : route === "/services" ? 9 : route === "/blog" ? 3 : route.startsWith("/blog/") ? 2 : 0;
    assert.equal([...html.matchAll(/<article\b[^>]*class="[^"]*\bmedia-hover-card\b[^"]*"/g)].length, expectedCards, `${route}: shared hover cards`);
    assert.match(html, /href="\/favicon\.svg\?v=tengyoda-2"/, `${route}: branded favicon`);
    assert.doesNotMatch(html, /<script[^>]+src="https:\/\/www\.googletagmanager\.com\//, `${route}: no tracking script before consent`);
    assert.ok(html.includes(company.email), `${route}: company email`);
    assert.ok(html.includes(company.telephone), `${route}: telephone`);
    assert.ok(html.includes(`href="${company.telephone}"`), `${route}: valid telephone link`);
    assert.doesNotMatch(html, /href="tel:tel:/, `${route}: duplicated telephone scheme`);
    assert.ok(html.includes(company.instagram), `${route}: Instagram`);
    assert.ok(html.includes(company.tiktok), `${route}: TikTok`);
    for (const service of coreServices) assert.ok(html.includes(`/services/${service.slug}`), `${route}: core service ${service.slug}`);
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^\"]+)"/g)) {
      if (href.startsWith("/")) assert.ok(validPaths.has(href.split("#")[0] || "/"), `${route}: broken internal route ${href}`);
      if (href.startsWith("#")) assert.ok(html.includes(`id="${href.slice(1)}"`), `${route}: missing anchor ${href}`);
    }
    for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^\"]+)"/g)) {
      if (src.startsWith("/")) assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), `${route}: missing image ${src}`);
    }
    if (route === "/") {
      for (const location of companyLocations) assert.ok(html.includes(location.address.replaceAll("&", "&amp;")), `Missing ${location.id} address`);
      assert.doesNotMatch(html, /class="facts"/);
    }
  }
});
