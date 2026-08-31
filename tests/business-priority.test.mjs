import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
function data(path) {
  const compiled = ts.transpileModule(source(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", compiled)(module, module.exports);
  return module.exports;
}
const { primaryService, supportingServices, coreServices, homepageServices, orderedServices } = data("lib/services.ts");
const { homeSeo, serviceSeo } = data("lib/seo.ts");

test("sea freight is the sole main recommendation and domestic road transport remains a supporting service", () => {
  assert.equal(primaryService.slug, "sea-freight");
  assert.deepEqual(coreServices.map(item => item.slug), ["sea-freight", "air-freight", "international-express", "china-import-export", "cargo-consolidation", "transport-warehousing"]);
  assert.equal(orderedServices[0].slug, "sea-freight");
  assert.equal(supportingServices.length, 5);
  assert.ok(supportingServices.some(item => item.slug === "transport-warehousing"));
  assert.ok(supportingServices.every(item => item.slug !== primaryService.slug));
});

test("English and Chinese positioning consistently identify the three owner-confirmed sea-freight regions", () => {
  for (const [language, regions] of [["en", ["Oceania", "Africa", "South America"]], ["zh-CN", ["大洋洲", "非洲", "南美"]]]) {
    for (const region of regions) {
      assert.ok(primaryService.content[language].summary.includes(region));
      assert.ok(serviceSeo["sea-freight"].content[language].intro.includes(region));
      for (const path of ["components/hero-carousel.tsx", "app/page.tsx", "components/site-footer.tsx", "components/service-view.tsx"]) {
        assert.ok(source(path).includes(region), `${path}: ${language} ${region}`);
      }
    }
  }
  for (const region of ["Oceania", "Africa", "South America"]) {
    assert.ok(homeSeo.description.includes(region));
    assert.ok(serviceSeo["sea-freight"].longTail.some(term => term.includes(region)));
  }
});

test("homepage replaces only the road-transport card with the existing bilingual RoRo and project cargo service", () => {
  assert.deepEqual(homepageServices.map(item => item.slug), ["sea-freight", "air-freight", "international-express", "china-import-export", "cargo-consolidation", "roro-project-cargo"]);
  assert.equal(new Set(homepageServices.map(item => item.image)).size, 6);
  assert.equal(homepageServices[5].content["zh-CN"].title, "滚装与项目货物");
  assert.equal(homepageServices[5].content.en.title, "RoRo & Project Cargo");
  assert.equal(homepageServices[5].image, "/images/project-cargo.webp");
  assert.ok(orderedServices.some(item => item.slug === "transport-warehousing"), "road transport stays in the full catalog");
  assert.ok(supportingServices.some(item => item.slug === "transport-warehousing"), "road transport stays in footer supporting services");
});

test("rendered hero, service grids, menu and footer lead with sea freight without losing supporting links", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  for (const route of ["/", "/services", "/services/sea-freight"]) {
    const response = await worker.fetch(new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
    assert.equal(response.status, 200);
    const html = await response.text();
    const footer = html.match(/<div class="footer-services">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(footer, route);
    const footerLinks = [...footer.matchAll(/href="\/services\/([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(footerLinks, coreServices.map(item => item.slug));
    assert.ok(footer.indexOf("Our main service") < footer.indexOf("sea-freight"));
    assert.ok(footer.indexOf("Supporting services") < footer.indexOf("transport-warehousing"));
    assert.match(footer, /Oceania · Africa · South America/);
    const menu = html.match(/<div class="mega-links">([\s\S]*?)<\/div>/)?.[1];
    assert.equal(menu?.match(/href="\/services\/([^"]+)"/)?.[1], "sea-freight");
    if (route === "/") {
      assert.match(html, /<h1>Global sea freight bookings\. From China to the world\.<\/h1>/);
      const firstSlide = html.match(/class="[^"]*hero-slide is-active[^>]*>([\s\S]*?)class="hero-controls/)?.[1];
      assert.ok(firstSlide?.indexOf("/images/sea-freight.webp") < firstSlide?.indexOf("/images/warehouse-operations.webp"));
      assert.equal(html.match(/class="service-cover" href="\/services\/([^"]+)"/)?.[1], "sea-freight");
      const cards = [...html.matchAll(/<article class="service-card service-photo-card media-hover-card">([\s\S]*?)<\/article>/g)].map(match => match[1]);
      assert.equal(cards.length, 6);
      assert.deepEqual(cards.map(card => card.match(/href="\/services\/([^"]+)"/)?.[1]), homepageServices.map(item => item.slug));
      assert.equal([...cards[5].matchAll(/href="\/services\/roro-project-cargo"/g)].length, 3, "image, title and learn-more all open the RoRo detail page");
      assert.match(cards[5], /RoRo &amp; Project Cargo/);
      assert.ok(cards[5].includes(homepageServices[5].content.en.summary));
      assert.match(cards[5], /src="\/images\/project-cargo\.webp"/);
      assert.doesNotMatch(cards.join(""), /transport-warehousing|china-domestic-trucking/);
    }
    if (route === "/services") assert.equal(html.match(/class="insight-visual" href="\/services\/([^"]+)"/)?.[1], "sea-freight");
  }
});
