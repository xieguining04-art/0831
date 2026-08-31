import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
function loadSource(path) {
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(require, module, module.exports);
  return module.exports;
}
const { worldClocks } = loadSource("../lib/world-clocks.ts");
const { translateText, localizePage } = loadSource("../lib/localization.tsx");

test("city labels match the supplied reference bar", () => {
  assert.deepEqual(worldClocks.map(clock => clock.city), ["澳大利亚墨尔本", "中国上海", "美国长滩", "荷兰鹿特丹", "意大利拉斯佩齐亚", "南非德班"]);
});

test("six city clocks use correct January offsets including southern summer time", () => {
  const now = new Date("2026-01-15T00:00:00Z");
  assert.deepEqual(worldClocks.map(clock => clock.formatter.format(now)), ["11:00", "08:00", "16:00", "01:00", "01:00", "02:00"]);
});
test("six city clocks use correct July daylight saving offsets", () => {
  const now = new Date("2026-07-15T00:00:00Z");
  assert.deepEqual(worldClocks.map(clock => clock.formatter.format(now)), ["10:00", "08:00", "17:00", "02:00", "02:00", "02:00"]);
});
test("midnight uses 00:00, not 24:00", () => {
  assert.equal(worldClocks[1].formatter.format(new Date("2026-07-15T16:00:00Z")), "00:00");
});
test("Chinese text preserves surrounding spacing and contact data", () => {
  assert.equal(translateText(" FROM CHINA TO THE WORLD", "zh-CN"), " 从中国连接全球");
  assert.equal(translateText("FROM CHINA TO THE WORLD", "en"), "FROM CHINA TO THE WORLD");
  assert.equal(translateText(" About Us ", "zh-CN"), " 关于我们 ");
  assert.equal(translateText("Enquire about Air Freight", "zh-CN"), "咨询国际空运");
  assert.equal(translateText("vinson_xie@tydscc.cn", "zh-CN"), "vinson_xie@tydscc.cn");
});
test("page translation handles nested service lists, links and accessible labels", () => {
  const element = React.createElement("main", null,
    React.createElement("h1", null, "Moving business forward, from China to the world."),
    ["Air Freight", "Sea Freight"].map(title => React.createElement("a", {
      key: title, href: "#contact", "aria-label": `Enquire about ${title}`,
    }, title)),
  );
  const html = renderToStaticMarkup(localizePage(element, "zh-CN"));
  assert.match(html, /立足中国，让您的货物通达全球。/);
  assert.match(html, /aria-label="咨询国际空运"/);
  assert.match(html, /href="#contact"/);
  assert.match(html, /国际海运/);
  assert.equal(localizePage(element, "en"), element);
});
