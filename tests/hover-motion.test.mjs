import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import postcss from "postcss";

const source = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const stylesheet = postcss.parse(source("app/globals.css"));

function rulesMatching(selector) {
  const matches = [];
  stylesheet.walkRules(rule => { if (rule.selector.includes(selector)) matches.push(rule); });
  return matches;
}
function property(rule, name) {
  return rule.nodes.filter(node => node.type === "decl" && node.prop === name).at(-1)?.value;
}
function mediaConditions(rule) {
  const conditions = [];
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === "atrule" && parent.name === "media") conditions.push(parent.params);
  }
  return conditions.join(" ");
}

test("services navigation keeps accessible Radix hover, click and mobile primitives", () => {
  const header = source("components/site-header.tsx");
  assert.match(header, /NavigationMenu viewport=\{false\} delayDuration=\{0\} skipDelayDuration=\{0\}/);
  for (const primitive of ["NavigationMenuTrigger", "NavigationMenuContent", "SheetTrigger", "SheetClose", "AccordionTrigger"]) assert.ok(header.includes(primitive));
  assert.doesNotMatch(header, /onMouseOver|onMouseOut|onMouseLeave|preventDefault/);
});

test("mouse entry and exit start the menu animation without a hover-intent delay", () => {
  const header = source("components/site-header.tsx");
  const item = header.match(/<NavigationMenuItem\s+value="services"[\s\S]*?<NavigationMenuTrigger/)?.[0];
  assert.ok(item, "the trigger and dropdown share one hover boundary");
  assert.match(item, /onPointerEnter=\{event => \{ if \(event\.pointerType === "mouse"\) setNavigationValue\("services"\); \}\}/);
  assert.match(item, /onPointerLeave=\{event => \{ if \(event\.pointerType === "mouse"\) setNavigationValue\(""\); \}\}/);
  assert.doesNotMatch(item, /setTimeout|preventDefault|onClick|onKeyDown/, "touch, click, Escape and keyboard behavior remain with Radix");
});

test("desktop navigation hit areas extend to the dropdown edge without changing mobile layout", () => {
  for (const [selector, height] of [[".site-navigation, .site-navigation-list", "var(--site-header-height)"], [".site-navigation > div, .site-navigation-list > li", "100%"], [".site-navigation .nav-top-link, .site-navigation .nav-top-trigger", "100%"]]) {
    const rule = rulesMatching(selector).find(item => property(item, "height") === height);
    assert.ok(rule, selector);
    assert.match(mediaConditions(rule), /min-width: 1101px/);
  }
  const cue = rulesMatching('.nav-top-trigger[data-state="open"]::before').at(-1);
  assert.equal(property(cue, "opacity"), "1");
});

test("the entire menu uses the reference 30px slide/fade in both directions", () => {
  const closed = rulesMatching(".main-header .services-mega").find(rule => property(rule, "opacity") === "0");
  const open = rulesMatching('.main-header .services-mega[data-state="open"]').at(-1);
  assert.equal(property(closed, "transform"), "translateY(-30px)");
  assert.equal(property(closed, "transition"), "opacity .3s ease-in-out, transform .3s ease-in-out, visibility .3s ease-in-out");
  assert.equal(property(open, "opacity"), "1");
  assert.equal(property(open, "transform"), "translateY(0)");
  assert.equal(property(open, "visibility"), "visible");
  assert.equal(property(open, "pointer-events"), "auto");
  assert.equal(property(open, "transition-duration"), undefined, "no slower custom opening override");
  assert.equal(property(open, "transition-delay"), undefined, "no custom hover delay");
  for (const rule of rulesMatching(".mega-surface")) {
    for (const name of ["opacity", "transform", "transition", "transition-duration"]) assert.equal(property(rule, name), undefined, `no separate inner-layer ${name}`);
  }
  for (const rule of rulesMatching(".services-mega")) {
    for (const name of ["clip-path", "scale", "height"]) assert.equal(property(rule, name), undefined, `no custom ${name} reveal`);
  }
  assert.ok(rulesMatching('.services-mega[data-state="closed"]').some(rule => property(rule, "pointer-events") === "none"));
  const reduced = rulesMatching(".main-header .services-mega").find(rule => property(rule, "transition") === "none");
  assert.ok(reduced);
  assert.match(mediaConditions(reduced), /prefers-reduced-motion: reduce/);
});

test("the persistent menu is inert when closed and transitions can reverse without remounting", () => {
  const header = source("components/site-header.tsx");
  assert.match(header, /value=\{navigationValue\} onValueChange=\{setNavigationValue\}/);
  assert.match(header, /NavigationMenuItem\s+value="services"/);
  assert.match(header, /NavigationMenuContent forceMount className="services-mega" inert=\{!servicesOpen\} aria-hidden=\{!servicesOpen\}/);
  assert.doesNotMatch(source("app/globals.css"), /@keyframes mega-(?:open|close|content-in)/);
  const container = rulesMatching(".main-header .services-mega").find(rule => property(rule, "visibility") === "hidden");
  assert.equal(property(container, "background"), "transparent");
  assert.equal(property(container, "animation"), "none");
  assert.equal(property(container, "overflow-x"), "hidden", "full-bleed backdrops cannot cause horizontal page scrolling");
  assert.equal(property(container, "overflow-y"), "auto");
  assert.equal(container.parent.type, "root", "the unlayered animation override wins over the UI primitive's layered zoom utilities");
});

test("the 41-by-20 pointer slides and fades in sync with the menu, while the small caret stays still", () => {
  const pointer = rulesMatching(".nav-top-trigger::before").find(rule => property(rule, "opacity") === "0");
  const open = rulesMatching('.nav-top-trigger[data-state="open"]::before').at(-1);
  const panel = rulesMatching(".main-header .services-mega").find(rule => property(rule, "opacity") === "0");
  assert.equal(property(pointer, "width"), "41px");
  assert.equal(property(pointer, "height"), "20px");
  assert.equal(property(pointer, "transform"), "translateX(-50%) translateY(-30px)");
  assert.equal(property(open, "transform"), "translateX(-50%) translateY(0)");
  assert.equal(property(pointer, "transition"), property(panel, "transition"));
  assert.equal(property(pointer, "pointer-events"), "none");
  const caret = rulesMatching(".nav-top-trigger::after").at(-1);
  assert.equal(property(caret, "border-top"), "6px solid");
  assert.equal(property(caret, "margin-left"), "11px");
  assert.equal(property(caret, "transform"), undefined);
  const reduced = rulesMatching(".nav-top-trigger::before").find(rule => property(rule, "transition") === "none");
  assert.match(mediaConditions(reduced), /prefers-reduced-motion: reduce/);
  assert.equal(property(reduced, "transform"), "translateX(-50%)", "keep the pointer centered without vertical animation");
});

test("reference backdrops replace the fixed menu photo with 44px and 34px live blur", () => {
  const surface = rulesMatching(".mega-surface").at(-1);
  assert.equal(property(surface, "background"), "transparent");
  const layout = rulesMatching(".mega-layout").find(rule => property(rule, "grid-template-columns") === "68% 32%");
  assert.ok(layout);
  for (const [selector, blur, background] of [[".mega-main::before", "blur(44px)", "rgba(0, 0, 0, .43)"], [".mega-cta::before", "blur(34px)", "rgba(0, 0, 0, .7)"]]) {
    const rule = rulesMatching(selector).find(item => property(item, "backdrop-filter"));
    assert.equal(property(rule, "background"), background);
    assert.equal(property(rule, "backdrop-filter"), blur);
    assert.equal(property(rule, "-webkit-backdrop-filter"), blur);
  }
  const backdrop = rulesMatching(".mega-main::before, .mega-cta::before").at(-1);
  assert.equal(property(backdrop, "pointer-events"), "none");
  assert.equal(property(backdrop, "width"), "100vw");
});

test("service labels stay in place and the view-all arrow moves the reference 10px", () => {
  for (const rule of rulesMatching(".site-navigation .mega-service-link")) {
    if (!mediaConditions(rule)) assert.equal(property(rule, "transform"), undefined, "no added text slide");
  }
  const arrow = rulesMatching(".mega-heading a:is(:hover, :focus-visible) svg").at(-1);
  assert.equal(property(arrow, "transform"), "translateX(10px)");
  assert.equal(property(rulesMatching(".mega-heading a svg, .mega-cta .button svg").find(rule => property(rule, "transition")), "transition"), "transform .3s ease-in-out");
});

test("homepage, directory and blog cards all opt into the same photo interactions", () => {
  assert.match(source("app/page.tsx"), /className="service-card service-photo-card media-hover-card"/);
  assert.match(source("app/page.tsx"), /<article className="media-hover-card">/);
  assert.match(source("components/service-view.tsx"), /className="directory-card media-hover-card"/);
  assert.match(source("components/blog-view.tsx"), /className="blog-card media-hover-card"/);
});

test("owner-requested photo zoom works independently of motion preference with mouse or keyboard-visible focus", () => {
  for (const state of [":hover", ":has(a:focus-visible)"]) {
    const zoom = rulesMatching(`.media-hover-card${state} :is(.service-cover, .insight-visual) img`).find(rule => property(rule, "transform") === "scale(1.1)");
    assert.ok(zoom, state);
    assert.doesNotMatch(mediaConditions(zoom), /prefers-reduced-motion/, "the owner explicitly removed this condition for images");
    if (state === ":hover") {
      assert.match(mediaConditions(zoom), /\(any-hover: hover\)/);
      assert.match(mediaConditions(zoom), /\(any-pointer: fine\)/);
      assert.doesNotMatch(mediaConditions(zoom), /\((?:hover|pointer):/, "a touchscreen primary input must not exclude an attached mouse");
    }
  }
  assert.ok(rulesMatching(".media-hover-card :is(.service-cover, .insight-visual) img").every(rule => property(rule, "transform") !== "none"), "no reduced-motion transform reset may cancel the photo zoom");
});

test("the global reduced-motion duration reset excludes only the requested photo layers", () => {
  const reset = rulesMatching(":where(*:not(.media-hover-card :is(.service-cover, .insight-visual) img))").find(rule => property(rule, "transition-duration") === ".01ms");
  assert.ok(reset, "removing the transform reset alone would still leave an almost-instant transition");
  assert.equal(reset.selector, ":where(*:not(.media-hover-card :is(.service-cover, .insight-visual) img)), *::before, *::after");
  assert.match(mediaConditions(reset), /prefers-reduced-motion: reduce/);
  assert.ok(reset.nodes.find(node => node.prop === "transition-duration").important);
  assert.ok(rulesMatching(".hero-photo, .editorial-photo").some(rule => property(rule, "transform") === "none" && /prefers-reduced-motion: reduce/.test(mediaConditions(rule))), "unrelated banner preferences remain intact");
});

test("photo overlays cannot intercept clicks and enlargement stays inside the image frame", () => {
  const frame = rulesMatching(".media-hover-card :is(.service-cover, .insight-visual)").find(rule => property(rule, "overflow") === "hidden");
  assert.ok(frame);
  const overlay = rulesMatching(".media-hover-card :is(.service-cover, .insight-visual)::after").find(rule => property(rule, "pointer-events") === "none");
  assert.ok(overlay);
  assert.equal(property(overlay, "opacity"), "0");
  const image = rulesMatching(".media-hover-card :is(.service-cover, .insight-visual) img").find(rule => property(rule, "transition"));
  assert.equal(property(image, "transition"), "transform 1.2s ease-in-out");
  assert.equal(property(image, "transform"), "scale(1)");
  assert.equal(property(image, "transform-origin"), "center");
});

test("the requested slower image zoom uses one symmetric transition without the old fast-start easing", () => {
  const base = rulesMatching(".service-cover img, .insight-visual img").at(-1);
  assert.equal(property(base, "transition"), undefined, "no older 700ms image transition competes with the shared effect");
  for (const state of [":hover", ":has(a:focus-visible)"]) {
    const zoom = rulesMatching(`.media-hover-card${state} :is(.service-cover, .insight-visual) img`).find(rule => property(rule, "transform") === "scale(1.1)");
    for (const name of ["transition", "transition-duration", "transition-delay", "animation"]) assert.equal(property(zoom, name), undefined, `enter and leave inherit the same ${name}`);
  }
});

test("retained mouse-click focus cannot keep the photo zoomed after pointer exit", () => {
  for (const rule of rulesMatching(".media-hover-card:focus-within")) {
    assert.equal(property(rule, "transform"), undefined, "only keyboard-visible focus should trigger zoom");
  }
  assert.ok(rulesMatching(".media-hover-card:has(a:focus-visible)").some(rule => property(rule, "transform") === "scale(1.1)"));
});

test("titles, arrows and focus cues respond without hiding the existing contact or page links", () => {
  for (const state of [":hover", ":focus-within"]) {
    assert.ok(rulesMatching(`.media-hover-card${state} :is(h2, h3) a`).some(rule => property(rule, "color") === "#a64b00"));
  }
  for (const state of [":hover", ":has(a:focus-visible)"]) {
    assert.ok(rulesMatching(`.media-hover-card${state} a > svg`).some(rule => property(rule, "transform") === "translateX(8px)"));
  }
  const focus = rulesMatching(".media-hover-card :is(.service-cover, .insight-visual):focus-visible").at(-1);
  assert.equal(property(focus, "outline"), "3px solid var(--orange)");
  for (const rule of rulesMatching(".media-hover-card")) {
    assert.notEqual(property(rule, "display"), "none");
    assert.notEqual(property(rule, "visibility"), "hidden");
  }
});
