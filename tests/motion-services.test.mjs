import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

function source(path) { return readFileSync(new URL(`../${path}`, import.meta.url), "utf8"); }
function data(path) {
  const code = ts.transpileModule(source(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", code)(module, module.exports);
  return module.exports;
}
const { services, getService, coreServices, orderedServices, relatedServices } = data("lib/services.ts");
const { blogPosts } = data("lib/blog-posts.ts");

test("all nine service destinations have complete bilingual content", () => {
  assert.equal(services.length, 9);
  assert.equal(new Set(services.map(item => item.slug)).size, 9);
  for (const item of services) {
    assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(getService(item.slug), item);
    for (const language of ["en", "zh-CN"]) {
      const copy = item.content[language];
      assert.ok(copy.title && copy.summary && copy.detail);
      assert.equal(copy.scope.length, 4);
      assert.equal(copy.preparation.length, 3);
      assert.ok(item.alt[language]);
    }
  }
  assert.equal(getService("unknown"), undefined);
  assert.equal(getService("constructor"), undefined);
});

test("six core services take priority and related links reflect shipment workflow", () => {
  assert.equal(coreServices.length, 6);
  assert.ok(coreServices.some(service => service.slug === "international-express"));
  assert.equal(orderedServices.length, services.length);
  assert.equal(new Set(orderedServices.map(service => service.slug)).size, services.length);
  for (const service of services) {
    const related = relatedServices(service.slug);
    assert.equal(related.length, 3);
    assert.ok(related.every(item => item.slug !== service.slug && getService(item.slug)));
  }
  assert.ok(relatedServices("air-freight").some(service => service.slug === "international-express"));
});

test("service and article images exist and match their topic", () => {
  for (const path of [...services.map(item => item.image), ...blogPosts.map(post => post.image.src)]) {
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), path);
  }
  assert.match(getService("air-freight").image, /air-freight/);
  assert.match(getService("oversize-freight").image, /project-cargo/);
  assert.match(getService("cargo-consolidation").image, /warehouse/);
  assert.match(blogPosts[0].image.src, /warehouse/);
  assert.match(blogPosts[1].image.src, /air-freight/);
  assert.equal(new Set(blogPosts.map(post => post.image.src)).size, 3);
});

test("shared navigation connects the homepage, blog and service pages", () => {
  for (const path of ["app/page.tsx", "components/blog-view.tsx", "components/service-view.tsx"]) assert.match(source(path), /<SiteHeader /);
  const header = source("components/site-header.tsx");
  assert.match(header, /NavigationMenuTrigger/);
  assert.match(header, /services\.map/);
  assert.match(header, /href=\{`\/services\/\$\{service\.slug\}`\}/);
  assert.match(header, /SheetClose/);
  assert.match(header, /AccordionTrigger/);
});

test("carousel supports manual controls, pause, inactive-slide isolation and reduced motion", () => {
  const hero = source("components/hero-carousel.tsx");
  assert.match(hero, /CarouselContent/);
  assert.match(hero, /api\?\.scrollPrev\(reduced\)/);
  assert.match(hero, /api\?\.scrollNext\(reduced\)/);
  assert.match(hero, /Pause slideshow/);
  assert.match(hero, /inert=\{!active\}/);
  assert.match(hero, /visibilitychange/);
  assert.match(hero, /clearInterval/);
  assert.match(hero, /playing && !hovered && visible && !reduced/);
  const motion = source("components/motion.tsx");
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(source("app/globals.css"), /@media \(prefers-reduced-motion: reduce\)/);
});
