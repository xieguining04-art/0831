import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const module = { exports: {} };
const source = readFileSync(new URL("../lib/company.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
new Function("module", "exports", compiled)(module, module.exports);
const { company, companyLocations, enquiryLinks } = module.exports;

test("provided company contact details are consistent", () => {
  assert.equal(company.email, "vinson_xie@tydscc.cn");
  assert.equal(company.alternateEmail, "xieguining04@gmail.com");
  assert.equal(company.telephone, "tel:+8618620244613");
  assert.equal(company.whatsapp, "https://wa.me/8618620244613");
});
test("all three warehouses and two offices retain the provided street addresses", () => {
  assert.equal(companyLocations.length, 5);
  assert.equal(companyLocations.filter(location => location.type === "warehouse").length, 3);
  assert.equal(companyLocations.filter(location => location.type === "office").length, 2);
  for (const text of ["76 Huanghe East Road", "458 Jingfa Avenue", "85-8 Nanyuan", "Room 1011, Building 6", "No. 54 Rentian Industrial Zone"]) assert.ok(companyLocations.some(location => location.address.includes(text)));
});
test("enquiry links safely encode the current topic and cargo checklist", () => {
  const topic = "DHL / FedEx / UPS & 中国采购";
  const links = enquiryLinks(topic);
  const whatsapp = new URL(links.whatsapp);
  const email = new URL(links.email);
  assert.equal(whatsapp.hostname, "wa.me");
  assert.equal(whatsapp.pathname, "/8618620244613");
  assert.ok(whatsapp.searchParams.get("text").includes(topic));
  assert.equal(email.pathname, company.email);
  assert.ok(email.searchParams.get("subject").includes(topic));
  assert.equal(email.searchParams.get("body"), whatsapp.searchParams.get("text"));
  for (const field of ["Cargo / product", "Packed dimensions", "Pickup city", "Destination and postcode", "Cargo-ready date"]) assert.ok(email.searchParams.get("body").includes(field));
});
test("every page uses the shared contact footer and old statistical strip is absent", () => {
  for (const path of ["app/page.tsx", "components/blog-view.tsx", "components/service-view.tsx"]) {
    const page = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.match(page, /<SiteFooter /);
    assert.match(page, /id="main-content"/);
  }
  assert.doesNotMatch(readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8"), /className="facts"/);
});
