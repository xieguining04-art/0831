import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function loadData(path) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", compiled)(module, module.exports);
  return module.exports;
}
const { services } = loadData("lib/services.ts");
const { blogPosts } = loadData("lib/blog-posts.ts");
const { homeSeo, serviceSeo, blogSeo, siteOrigin, pageMetadata } = loadData("lib/seo.ts");
const escapeHtml = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");

test("SEO targeting covers every service and article without duplicate primary topics", () => {
  assert.deepEqual(Object.keys(serviceSeo).sort(), services.map(service => service.slug).sort());
  assert.deepEqual(Object.keys(blogSeo).sort(), blogPosts.map(post => post.slug).sort());
  const records = [homeSeo, ...Object.values(serviceSeo), ...Object.values(blogSeo)];
  assert.equal(new Set(records.map(record => record.primary.toLowerCase())).size, records.length);
  assert.equal(new Set(records.map(record => record.title)).size, records.length);
  for (const record of records) {
    assert.ok(record.title.length >= 25 && record.title.length <= 75, record.title);
    assert.ok(record.description.length >= 100 && record.description.length <= 180, record.description);
    assert.ok(record.longTail.length >= 3);
    assert.equal(new Set(record.longTail).size, record.longTail.length);
    assert.ok(record.longTail.every(term => term.trim().split(/\s+/).length >= 3));
  }
});

test("bilingual service answers and editorial links have complete valid targets", () => {
  for (const [slug, seo] of Object.entries(serviceSeo)) {
    assert.ok(blogPosts.some(post => post.slug === seo.guideSlug), `${slug}: guide`);
    for (const language of ["en", "zh-CN"]) {
      const copy = seo.content[language];
      assert.ok(copy.h1 && copy.intro, `${slug}: ${language}`);
      assert.equal(copy.questions.length, 2);
      assert.ok(copy.questions.every(item => item.question && item.answer));
      if (language === "zh-CN") assert.match(copy.h1, /[\u4e00-\u9fff]/);
    }
  }
  for (const seo of Object.values(blogSeo)) {
    assert.equal(new Set(seo.serviceSlugs).size, 3);
    assert.ok(seo.serviceSlugs.every(slug => services.some(service => service.slug === slug)));
  }
  const metadata = pageMetadata(homeSeo.title, homeSeo.description, "/");
  assert.equal(metadata.alternates.canonical, `${siteOrigin}/`);
  assert.equal(metadata.keywords, undefined);
});

test("rendered SEO is unique, visible and canonical across all fifteen routes", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const routes = [
    { path: "/", seo: homeSeo },
    { path: "/services" },
    { path: "/blog" },
    ...services.map(service => ({ path: `/services/${service.slug}`, seo: serviceSeo[service.slug], serviceSlug: service.slug })),
    ...blogPosts.map(post => ({ path: `/blog/${post.slug}`, seo: blogSeo[post.slug], postSlug: post.slug })),
  ];
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes) {
    const response = await worker.fetch(new Request(`http://localhost${route.path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    const titleTags = [...html.matchAll(/<title>([^<]+)<\/title>/g)];
    const descriptionTags = [...html.matchAll(/<meta\b[^>]*name="description"[^>]*>/g)];
    const canonicalTags = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
    const headings = [...html.matchAll(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/g)];
    assert.equal(titleTags.length, 1, `${route.path}: title count`);
    assert.equal(descriptionTags.length, 1, `${route.path}: description count`);
    assert.equal(canonicalTags.length, 1, `${route.path}: canonical count`);
    assert.equal(headings.length, 1, `${route.path}: h1 count`);
    assert.ok(headings[0][2].trim(), `${route.path}: empty h1`);
    assert.doesNotMatch(headings[0][1], /sr-only|hidden/, `${route.path}: hidden h1`);
    const title = titleTags[0][1];
    const description = descriptionTags[0][0].match(/content="([^"]+)"/)?.[1];
    assert.ok(description, `${route.path}: empty description`);
    assert.ok(!titles.has(title), `${route.path}: duplicate title`);
    assert.ok(!descriptions.has(description), `${route.path}: duplicate description`);
    titles.add(title); descriptions.add(description);
    assert.ok(canonicalTags[0][0].includes(`href="${siteOrigin}${route.path}"`), `${route.path}: canonical URL`);
    assert.doesNotMatch(html, /<meta\b[^>]*name="keywords"/i);
    if (route.seo) {
      assert.equal(title, escapeHtml(route.seo.title), route.path);
      assert.equal(description, escapeHtml(route.seo.description), route.path);
    }
    if (route.serviceSlug) {
      assert.equal(headings[0][2], escapeHtml(route.seo.content.en.h1), route.path);
      assert.ok(html.includes(`href="/blog/${route.seo.guideSlug}"`));
      assert.ok(html.includes('class="service-search-details"'));
      for (const item of route.seo.content.en.questions) {
        assert.ok(html.includes(escapeHtml(item.question)), `${route.path}: question`);
        assert.ok(html.includes(escapeHtml(item.answer)), `${route.path}: answer`);
      }
    }
    if (route.postSlug) assert.ok(html.includes('class="blog-service-links"'), `${route.path}: contextual service links`);
  }
  assert.equal(routes.length, 15);
});
