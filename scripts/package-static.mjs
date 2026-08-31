/** Download-only release. Does not publish, connect to a server, or change DNS. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import ts from "typescript";
import postcss from "postcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { values } = parseArgs({ options: { output: { type: "string" }, "no-build": { type: "boolean", default: false } } });
const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://tengyodalogistics.com";
const originUrl = new URL(origin);
assert.equal(originUrl.protocol, "https:", "The production origin must use HTTPS.");
assert.equal(originUrl.origin, origin, "Use an origin without a path, credentials or trailing slash.");
assert.ok(!originUrl.port, "Use the public production domain, not a preview port.");

if (!values["no-build"]) {
  execFileSync("npm", ["run", "build"], {
    cwd: root, stdio: "inherit", timeout: 240_000,
    env: { ...process.env, TENGYODA_STATIC_EXPORT: "1", NEXT_PUBLIC_STATIC_EXPORT: "1", NEXT_PUBLIC_SITE_ORIGIN: origin },
  });
}

function loadData(relativePath) {
  const source = readFileSync(path.join(root, relativePath), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", compiled)(module, module.exports);
  return module.exports;
}
const { services } = loadData("lib/services.ts");
const { blogPosts } = loadData("lib/blog-posts.ts");
const { company } = loadData("lib/company.ts");
const routes = ["/", "/services", "/blog", ...services.map(s => `/services/${s.slug}`), ...blogPosts.map(p => `/blog/${p.slug}`)];
const routeFile = route => route === "/" ? "index.html" : `${route.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
const canonical = route => `${origin}${route === "/" ? "/" : `${route.replace(/\/$/, "")}/`}`;
const buildDir = path.join(root, "dist/client");
const manifest = JSON.parse(readFileSync(path.join(root, "dist/server/vinext-prerender.json"), "utf8"));
assert.equal(manifest.trailingSlash, true, "The build must use the static export target.");
assert.ok(manifest.routes.every(r => r.status === "rendered"), "A page was skipped or failed to render.");
for (const route of [...routes, "/404"]) {
  assert.ok(manifest.routes.some(r => (r.path || r.route) === route), `Missing pre-rendered route: ${route}`);
}

const releaseParent = path.resolve(values.output || path.join(root, "outputs"));
mkdirSync(releaseParent, { recursive: true });
const work = mkdtempSync(path.join(releaseParent, "tengyoda-release-"));
const date = new Date().toISOString().slice(0, 10);
const name = `TengYoda-Website-${date}`;
const release = path.join(work, name);
const website = path.join(release, "website");
mkdirSync(release);
cpSync(buildDir, website, { recursive: true, errorOnExist: true });

const xmlEscape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => {
  const post = blogPosts.find(p => route === `/blog/${p.slug}`);
  return `  <url><loc>${xmlEscape(canonical(route))}</loc>${post ? `<lastmod>${post.publishedAt}</lastmod>` : ""}</url>`;
}).join("\n")}\n</urlset>\n`;
writeFileSync(path.join(website, "sitemap.xml"), sitemap);
writeFileSync(path.join(website, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);

function filesIn(directory, prefix = "") {
  return readdirSync(directory).sort().flatMap(name => {
    const relative = prefix ? `${prefix}/${name}` : name;
    const full = path.join(directory, name);
    const stat = lstatSync(full);
    assert.ok(!stat.isSymbolicLink(), `Do not package symlinks: ${relative}`);
    return stat.isDirectory() ? filesIn(full, relative) : [relative];
  });
}
const publicFiles = filesIn(website);
for (const file of publicFiles) {
  assert.doesNotMatch(file, /(^|\/)(?:\.git|\.openai|node_modules|server|\.env[^/]*)(?:\/|$)|\.(?:tsx?|map|pem|key)$/i, `Private source or build data in web root: ${file}`);
}
const documents = new Map(routes.map(route => [route, readFileSync(path.join(website, routeFile(route)), "utf8")]));
const titles = new Set();
const descriptions = new Set();
const checkedAssets = new Set();
let checkedLinks = 0;
let checkedAnchors = 0;
const normalizeRoute = pathname => pathname.replace(/\/+$/, "") || "/";
const decodeEntities = text => text.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");

function localReference(reference, base) {
  const target = new URL(decodeEntities(reference), base);
  if (target.origin !== origin) return;
  const pathname = decodeURIComponent(target.pathname);
  const route = normalizeRoute(pathname);
  if (documents.has(route)) {
    checkedLinks++;
    if (target.hash) {
      const id = decodeURIComponent(target.hash.slice(1));
      assert.ok(documents.get(route).includes(`id="${id}"`), `Missing anchor: ${target.pathname}${target.hash}`);
      checkedAnchors++;
    }
  } else {
    const relative = pathname.replace(/^\//, "");
    const full = path.resolve(website, relative);
    assert.ok(full.startsWith(`${website}/`), `Unsafe public path: ${reference}`);
    assert.ok(existsSync(full) && lstatSync(full).isFile(), `Missing local asset or page: ${reference}`);
    checkedAssets.add(relative);
  }
}

for (const [route, html] of documents) {
  const title = [...html.matchAll(/<title>([^<]+)<\/title>/g)];
  const description = [...html.matchAll(/<meta\b[^>]*name="description"[^>]*>/g)];
  assert.equal(title.length, 1, `${route}: one title`);
  assert.equal(description.length, 1, `${route}: one description`);
  assert.ok(!titles.has(title[0][1]), `${route}: duplicate title`);
  assert.ok(!descriptions.has(description[0][0]), `${route}: duplicate description`);
  titles.add(title[0][1]); descriptions.add(description[0][0]);
  const canonicalTags = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
  assert.equal(canonicalTags.length, 1, `${route}: one canonical`);
  assert.ok(canonicalTags[0][0].includes(`href="${canonical(route)}"`), `${route}: production canonical must match the deployed directory URL`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: one main heading`);
  assert.ok(html.includes('id="main-content"'), `${route}: main content`);
  assert.equal([...html.matchAll(/<strong>TengYoda<span class="brand-chevron"/g)].length, 2, `${route}: original header and footer wordmarks`);
  assert.ok(html.includes(company.email) && html.includes(company.telephone), `${route}: company contacts`);
  assert.doesNotMatch(html, /tengyoda-logo-(?:tyd|solid)\.png/, `${route}: must retain the original wordmark`);
  assert.doesNotMatch(html, /配图为物流场景示意|非公司实拍|Images illustrate logistics scenes|Illustrative logistics scene; not a photograph|Images are illustrative, not photographs/, `${route}: removed image note must not be exported`);
  assert.doesNotMatch(html, /<script[^>]+src="https:\/\/www\.googletagmanager\.com/, `${route}: tracking must wait for consent`);
  assert.match(html, /<script\b/, `${route}: hydration scripts retained`);
  const rscFile = route === "/" ? "index.rsc" : `${route.slice(1)}.rsc`;
  assert.ok(readFileSync(path.join(website, rscFile), "utf8").length > 100, `${route}: serialized app content`);
  for (const [, reference] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) localReference(reference, canonical(route));
  for (const [, reference] of html.matchAll(/["'](\/assets\/[^"']+)["']/g)) localReference(reference, canonical(route));
}
const home = documents.get("/");
assert.ok(home.includes("Oceania") && home.includes("Africa") && home.includes("South America"), "Owner-confirmed ocean trade lanes");
assert.ok(home.includes("RoRo &amp; Project Cargo") && home.includes("/images/project-cargo.webp"), "RoRo homepage card");
assert.doesNotMatch(home, /class="facts"/, "The removed statistics strip must stay removed");
assert.ok(home.includes('class="services-mega') || home.includes(' services-mega'), "Persistent mega menu");

const cssRules = [];
for (const file of publicFiles.filter(file => file.endsWith(".css"))) {
  const css = readFileSync(path.join(website, file), "utf8");
  postcss.parse(css).walkRules(rule => cssRules.push(rule));
  for (const [, raw] of css.matchAll(/url\(\s*([^)]*?)\s*\)/g)) {
    const reference = raw.replace(/^["']|["']$/g, "");
    if (reference && !reference.startsWith("data:") && !reference.startsWith("#")) localReference(reference, `${origin}/${file}`);
  }
}
const declaration = (rule, property) => rule.nodes.find(node => node.type === "decl" && node.prop === property)?.value;
assert.ok(cssRules.some(rule => declaration(rule, "transition") === "transform 1.2s ease-in-out"), "Emitted 1200ms photo transition");
assert.ok(cssRules.some(rule => rule.selector.includes(".media-hover-card:hover") && declaration(rule, "transform") === "scale(1.1)"), "Emitted 1.1x photo hover");
assert.ok(cssRules.some(rule => rule.selector.includes(":has(a:focus-visible)") && declaration(rule, "transform") === "scale(1.1)"), "Keyboard-visible photo hover");

const javascript = publicFiles.filter(file => file.endsWith(".js"));
for (const file of javascript) {
  const code = readFileSync(path.join(website, file), "utf8");
  for (const [, reference] of code.matchAll(/(?:from\s*|import\s*\(\s*)["'](\.{1,2}\/[^"']+)["']/g)) localReference(reference, `${origin}/${file}`);
}
const allClientCode = javascript.map(file => readFileSync(path.join(website, file), "utf8")).join("\n");
assert.doesNotMatch(allClientCode, /配图为物流场景示意|非公司实拍|Images illustrate logistics scenes|Illustrative logistics scene; not a photograph|Images are illustrative, not photographs/, "The deleted bilingual image note must not return after hydration");
for (const token of ["G-G1G4DZNQ9P", "contact_click", "not_confirmed", "zh-CN"]) assert.ok(allClientCode.includes(token), `Client feature missing: ${token}`);
assert.ok(!allClientCode.includes("generate_lead"), "Contact clicks must not become confirmed leads");
assert.ok(existsSync(path.join(website, "404.html")), "Standalone 404 page");
assert.equal([...sitemap.matchAll(/<loc>/g)].length, routes.length, "Sitemap route count");

// Source copy is explicitly separate from the uploadable web root. Exclude
// credentials, local history, caches and server build intermediates.
const source = path.join(release, "source");
mkdirSync(source);
const sourceDirectories = new Set(["app", "build", "components", "deployment", "hooks", "lib", "public", "scripts", "tests", "worker", "types"]);
const sourceFiles = new Set(["package.json", "package-lock.json", "next.config.ts", "tsconfig.json", "vite.config.ts", "postcss.config.mjs", "eslint.config.mjs", "components.json", "README.md", ".gitignore"]);
for (const entry of readdirSync(root)) {
  if (sourceDirectories.has(entry) || sourceFiles.has(entry)) cpSync(path.join(root, entry), path.join(source, entry), { recursive: true });
}
mkdirSync(path.join(source, ".openai"));
const hosting = JSON.parse(readFileSync(path.join(root, ".openai/hosting.json"), "utf8"));
assert.equal(hosting.d1, null); assert.equal(hosting.r2, null);
// Keep the existing build-plugin input shape; no account or runtime credential
// is used by the static build or shipped with the release.
writeFileSync(path.join(source, ".openai/hosting.json"), JSON.stringify({ project_id: hosting.project_id, d1: null, r2: null }, null, 2) + "\n");
cpSync(path.join(root, "deployment/README.zh-CN.md"), path.join(release, "README.zh-CN.md"));
cpSync(path.join(root, "deployment"), path.join(release, "deployment"), { recursive: true });

const report = {
  createdAt: new Date().toISOString(), productionOrigin: origin,
  build: "vinext static export", contentPages: routes.length, notFoundPage: true,
  localAssetsChecked: checkedAssets.size, internalReferencesChecked: checkedLinks, anchorsChecked: checkedAnchors,
  publicFileCount: filesIn(website).length, publicBytes: filesIn(website).reduce((n, file) => n + lstatSync(path.join(website, file)).size, 0),
  routes: routes.map(route => ({ url: canonical(route), file: `website/${routeFile(route)}` })),
  assertions: ["all routes pre-rendered", "all referenced local assets and anchors exist", "production canonical URLs and sitemap", "original wordmarks", "sea-freight priority and trade lanes", "RoRo homepage card", "1200ms / 1.1x emitted photo hover CSS", "JS and RSC retained", "GA4 contact clicks not confirmed leads", "no source or credentials in web root"],
  browserTested: false, uploadedToUserServer: false,
};
writeFileSync(path.join(release, "validation-report.json"), JSON.stringify(report, null, 2) + "\n");
const hashes = filesIn(release).map(file => `${createHash("sha256").update(readFileSync(path.join(release, file))).digest("hex")}  ${file}`);
writeFileSync(path.join(release, "SHA256SUMS.txt"), hashes.join("\n") + "\n");
const archive = path.join(work, `${name}.zip`);
execFileSync("zip", ["-q", "-r", "-X", archive, name], { cwd: work, timeout: 120_000 });
execFileSync("unzip", ["-tq", archive], { stdio: "inherit", timeout: 120_000 });
console.log(JSON.stringify({ archive, bytes: lstatSync(archive).size, report }, null, 2));
