import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function loadSource(path, overrides = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(name => overrides[name] ?? require(name), module, module.exports);
  return module.exports;
}
const data = loadSource("../lib/blog-posts.ts");
const serviceData = loadSource("../lib/services.ts");
const seoData = loadSource("../lib/seo.ts");
const { blogPosts, getBlogPost, readingMinutes, formatBlogDate } = data;

test("three complete articles have unique safe slugs and valid dates", () => {
  assert.equal(blogPosts.length, 3);
  assert.equal(new Set(blogPosts.map(post => post.slug)).size, blogPosts.length);
  for (const post of blogPosts) {
    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(new Date(post.publishedAt).toISOString().slice(0, 10), post.publishedAt);
    assert.equal(getBlogPost(post.slug), post);
    assert.ok(post.author);
  }
  assert.equal(getBlogPost("missing-article"), undefined);
  assert.equal(getBlogPost("toString"), undefined);
});
test("both languages contain real article sections and matching table-of-contents targets", () => {
  for (const post of blogPosts) {
    for (const lang of ["en", "zh-CN"]) {
      const content = post.content[lang];
      assert.ok(content.title && content.summary && content.introduction);
      assert.ok(content.sections.length >= 5);
      assert.equal(new Set(content.sections.map(section => section.id)).size, content.sections.length);
      assert.ok(content.sections.every(section => section.heading && section.paragraphs.length >= 2 && section.paragraphs.every(Boolean)));
      assert.ok(readingMinutes(content, lang) >= 1);
    }
    assert.deepEqual(post.content.en.sections.map(section => section.id), post.content["zh-CN"].sections.map(section => section.id));
    assert.match(post.content["zh-CN"].title, /[\u4e00-\u9fff]/);
  }
});
test("dates are deterministic and the sitemap includes every article", () => {
  assert.match(formatBlogDate("2026-08-30", "en"), /30/);
  assert.match(formatBlogDate("2026-08-30", "zh-CN"), /2026/);
  const sitemap = loadSource("../app/sitemap.ts", { "@/lib/blog-posts": data, "@/lib/services": serviceData, "@/lib/seo": seoData }).default();
  assert.equal(sitemap.length, blogPosts.length + serviceData.services.length + 3);
  for (const post of blogPosts) assert.ok(sitemap.some(entry => entry.url.endsWith(`/blog/${post.slug}`)));
  for (const service of serviceData.services) assert.ok(sitemap.some(entry => entry.url.endsWith(`/services/${service.slug}`)));
});
test("homepage uses article data and links to blog routes rather than contact placeholders", () => {
  const source = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /blogPosts\.slice\(0, 3\)/);
  assert.match(source, /href=\{`\/blog\/\$\{post\.slug\}`\}/);
  assert.match(source, /<SiteFooter language=\{language\}/);
  assert.match(readFileSync(new URL("../components/site-footer.tsx", import.meta.url), "utf8"), /href="\/blog"/);
  assert.doesNotMatch(source, /href="#contact">Read more/);
});
