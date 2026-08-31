import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function source(path) { return readFileSync(new URL(`../${path}`, import.meta.url), "utf8"); }
function data(path, imports = {}) {
  const code = ts.transpileModule(source(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(name => {
    assert.ok(name in imports, `Unexpected import: ${name}`);
    return imports[name];
  }, module, module.exports);
  return module.exports;
}
const companyData = data("lib/company.ts");
const { company, enquiryLinks } = companyData;
const { GA4_MEASUREMENT_ID, measuredPaths, analyticsPage, contactMethod, contactPlacement, readAnalyticsConsent, serializeAnalyticsConsent, createAnalyticsClient } = data("lib/analytics.ts", { "./company": companyData });
const origin = "https://tengyoda-premium-preview.xieguining04.chatgpt.site";
const page = analyticsPage(`${origin}/services/air-freight`);

function harness() {
  const commands = [], loads = [], disabled = [];
  const client = createAnalyticsClient({ command: (...args) => commands.push(args), load: id => loads.push(id), disable: value => disabled.push(value) });
  return { client, commands, loads, disabled, events: () => commands.filter(command => command[0] === "event") };
}

test("analytics covers exactly the 15 content routes and the confirmed measurement ID", () => {
  const { services } = data("lib/services.ts");
  const { blogPosts } = data("lib/blog-posts.ts");
  assert.deepEqual([...measuredPaths].sort(), ["/", "/blog", "/services", ...services.map(item => `/services/${item.slug}`), ...blogPosts.map(item => `/blog/${item.slug}`)].sort());
  assert.equal(GA4_MEASUREMENT_ID, "G-G1G4DZNQ9P");
  for (const path of measuredPaths) assert.equal(analyticsPage(`${origin}${path}`).page_path, path);
});

test("page context strips query, fragment and referrer path, and separates preview traffic", () => {
  assert.deepEqual(analyticsPage(`${origin}/blog/?email=private@example.test#cargo`, "https://example.test/private-name?token=secret"), {
    page_path: "/blog", page_location: `${origin}/blog`, page_referrer: "https://example.test", site_environment: "preview",
  });
  assert.equal(analyticsPage("https://www.tengyodalogistics.com/").site_environment, "production");
  assert.equal(analyticsPage(`${origin}/blog`, "javascript:alert(1)").page_referrer, "");
  for (const url of ["http://localhost:4173/", "https://localhost/", "https://unrelated.example/blog", `${origin}/private-customer`, `${origin}/?bad`.replace("https:", "http:"), "invalid"]) assert.equal(analyticsPage(url), null, url);
});

test("only verified company WhatsApp, email and telephone destinations are contact events", () => {
  const links = enquiryLinks("A private enquiry topic");
  assert.equal(contactMethod(links.whatsapp), "whatsapp");
  assert.equal(contactMethod(links.email), "email");
  assert.equal(contactMethod(`mailto:${company.alternateEmail}`), "email");
  assert.equal(contactMethod(company.telephone), "phone");
  for (const link of ["#contact", "/services", company.tiktok, company.instagram, "https://wa.me/123", "https://wa.me.evil.example/8618620244613", "mailto:other@example.test", "tel:+12345", "mailto:%zz", "javascript:void(0)"]) assert.equal(contactMethod(link), null, link);
});

test("contact placements distinguish shared navigation, page CTAs and footer", () => {
  const anchor = (...selectors) => ({ closest: selector => selectors.includes(selector) ? {} : null });
  for (const [selector, expected] of [[".float-wa", "floating_button"], [".mobile-sheet", "mobile_menu"], [".mega-cta", "mega_menu"], [".main-header, .world-clock-bar", "header"], [".shared-footer", "footer"], ["#contact", "contact_section"]]) assert.equal(contactPlacement(anchor(selector), "/"), expected);
  assert.equal(contactPlacement(anchor(".blog-cta"), "/services/air-freight"), "service_cta");
  assert.equal(contactPlacement(anchor(".blog-cta"), "/blog"), "blog_cta");
  assert.equal(contactPlacement(anchor(), "/"), "content");
  assert.equal(contactPlacement(anchor(".mega-cta", ".main-header, .world-clock-bar"), "/"), "mega_menu");
});

test("consent is explicit, versioned, expires after 180 days and rejects corrupt values", () => {
  const now = 2_000_000_000_000;
  for (const value of [true, false]) assert.equal(readAnalyticsConsent(serializeAnalyticsConsent(value, now - 1000), now), value);
  for (const raw of [null, "", "not-json", "null", "{}", '{"version":1,"analytics":"true","updatedAt":1}', serializeAnalyticsConsent(true, now + 1), serializeAnalyticsConsent(true, now - 180 * 86_400_000)]) assert.equal(readAnalyticsConsent(raw, now), null);
});

test("no tag, page view or contact event is sent before consent or on unsupported hosts", () => {
  const { client, commands, loads } = harness();
  client.pageView(page);
  client.contact(company.whatsapp, "header", page, "en");
  client.setConsent(false, page);
  client.setConsent(true, null);
  client.pageView(null);
  assert.deepEqual(commands, []);
  assert.deepEqual(loads, []);
});

test("consented tag initializes once, keeps ads denied, and does not duplicate page views", () => {
  const { client, commands, loads, events } = harness();
  client.setConsent(true, page);
  assert.equal(client.pageView(page), true);
  client.setConsent(true, page);
  assert.equal(client.pageView(page), false);
  assert.deepEqual(loads, [GA4_MEASUREMENT_ID]);
  assert.deepEqual(commands[0].slice(0, 2), ["consent", "default"]);
  assert.equal(commands[0][2].analytics_storage, "denied");
  for (const command of commands.filter(item => item[0] === "consent")) {
    assert.equal(command[2].ad_storage, "denied");
    assert.equal(command[2].ad_user_data, "denied");
    assert.equal(command[2].ad_personalization, "denied");
  }
  for (const command of commands.filter(item => item[0] === "config")) assert.equal(command[2].send_page_view, false);
  assert.equal(commands.find(item => item[0] === "config")[2].allow_google_signals, false);
  assert.equal(events().length, 1);
  client.pageView(analyticsPage(`${origin}/blog`));
  assert.deepEqual(events().map(item => item[1]), ["page_view", "page_view"]);
});

test("contact clicks never assert receipt and never include the message or full contact URL", () => {
  const { client, events } = harness();
  const links = enquiryLinks("PRIVATE-TEST-MESSAGE");
  client.setConsent(true, page);
  for (const [href, method] of [[links.whatsapp, "whatsapp"], [links.email, "email"], [company.telephone, "phone"]]) {
    assert.equal(client.contact(href, "service_cta", page, "zh-CN"), true);
    const event = events().at(-1);
    assert.equal(event[1], "contact_click");
    assert.equal(event[2].contact_method, method);
    assert.equal(event[2].contact_placement, "service_cta");
    assert.equal(event[2].enquiry_status, "not_confirmed");
    assert.equal(event[2].ui_language, "zh-CN");
    assert.equal(event[2].site_environment, "preview");
    const payload = JSON.stringify(event);
    for (const privateValue of ["PRIVATE-TEST-MESSAGE", company.email, "8618620244613", "generate_lead", "link_url"]) assert.ok(!payload.includes(privateValue), privateValue);
  }
  assert.equal(events().length, 3);
});

test("withdrawing consent immediately disables further events and unknown routes stop measurement", () => {
  const { client, events, disabled, loads } = harness();
  client.setConsent(true, page);
  client.pageView(page);
  client.setConsent(false, page);
  assert.equal(disabled.at(-1), true);
  assert.equal(client.contact(company.whatsapp, "footer", page, "en"), false);
  assert.equal(client.pageView(analyticsPage(`${origin}/blog`)), false);
  assert.equal(events().length, 1);
  client.setConsent(true, page);
  assert.equal(disabled.at(-1), false);
  assert.equal(loads.length, 1);
  assert.equal(client.contact(company.whatsapp, "footer", page, "en"), true);
  client.setConsent(true, null);
  assert.equal(disabled.at(-1), true);
  assert.equal(client.contact(company.whatsapp, "footer", page, "en"), false);
});

test("analytics failures do not throw or change contact navigation", () => {
  const fail = () => { throw new Error("Analytics unavailable"); };
  const client = createAnalyticsClient({ command: fail, load: fail, disable: fail });
  assert.doesNotThrow(() => { client.setConsent(true, page); client.pageView(page); client.contact(company.whatsapp, "header", page, "en"); client.setConsent(false, page); });
  const component = source("components/site-analytics.tsx");
  assert.doesNotMatch(component, /preventDefault|stopPropagation|window\.open|generate_lead/);
  assert.match(component, /document\.addEventListener\("click", trackContact, true\)/);
  assert.match(component, /document\.removeEventListener\("click", trackContact, true\)/);
  assert.match(source("app/layout.tsx"), /<SiteAnalytics\s*\/>/);
  assert.match(source("components/site-footer.tsx"), /<AnalyticsPreferenceButton language=\{language\}/);
});
