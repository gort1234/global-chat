/* ── Global Chat: Tab Cloaking ──
   Shared by index.html and tools.html.
   Only changes document.title and the tab favicon — never the URL/routing.

   To add a new preset later: add one object to CLOAK_PRESETS below.
   Nothing else needs to change; the Tools page dropdown and the apply
   logic both read from this same array.
*/
(function () {
  const STORAGE_KEY = "gcTabCloak";
  // Persists the custom name typed for presets with requiresName (e.g. Aleks),
  // separate from STORAGE_KEY so it survives switching presets and back.
  const STORAGE_KEY_NAME = "gcTabCloakName";

  // Default "restored" favicon: a small dark square with the site's accent dot.
  const DEFAULT_FAVICON =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
    "%3Crect width='32' height='32' rx='7' fill='%2316161a'/%3E" +
    "%3Ccircle cx='16' cy='16' r='6' fill='%236c8fff'/%3E%3C/svg%3E";

  function googleFavicon(domain) {
    return "https://www.google.com/s2/favicons?sz=64&domain=" + domain;
  }

  // The user's own uploaded Google Classroom favicon image, embedded verbatim
  // (not recreated/redrawn) as a base64 data URI so no external request or
  // separate asset file is needed.
  const CLASSROOM_FAVICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABsklEQVQYV6WPMY9MYRSGnzO5K5mrsczINCujkBh3ihU1CX9BMSsKtqTQ6mzDr5BFQiLRSkRoFRu7icIQ3YoCESHL3DEbmfMqzjc3d1BxmvPlS97nPK9J4n8mm75Yvsz00zkzYTYPkwypAbJ4e2xkyBuw0LpvPzfaMpURrgMUAIhgBZGBGgGznIzpGMx4OW7xatLGbBYGJJTecoHHu2h+pZ/vgP8gQ4YQw3GbB1+OQgIgkS80kYvR7igBHLkzaImi+Q1kZKEJuJB71WDvnpy1M1dBsPb0BqNJiWpGqSWN6GRJ05ELubiwvEJ33xLdxSVWT5xHVRclw8ilCoY89STwt7fu0V08BMD687thKM1biKhgM3CtwmhScu3xdSRR7pZVuPInDicDknoA+p0eRecY/U4PgOGH12y83WT783aAHDSrIBlAquBcOXmJ00dOUZ+i02Nw/CwPh4+4+exWfMqQjExuYIDC4vdwfQ7v786FEWSoAYiiucPgwDuGb9bnQlVloCw/stJ+T5F/j4MyrHxyUKCw+NsIIK4pbbAAy8gkWwUu2uzSDKT6+jMIINkdU93xH+YXTrImgXmBBtYAAAAASUVORK5CYII=";

  // The user's own uploaded Renaissance favicon, embedded verbatim (true
  // format is WebP despite the .png filename, so the MIME type below
  // reflects the actual bytes rather than the filename).
  const RENAISSANCE_FAVICON = "data:image/webp;base64,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";

  // TEMPORARY placeholder for the Aleks preset. The favicon.ico file
  // supplied for "Aleks" is actually a white "M" on a red background, not
  // the blue letter "A" described — so it was NOT used here (per the
  // instruction not to substitute a different icon). This neutral gray
  // placeholder is used until the correct file is provided; swap this one
  // constant out once it is.
  const ALEKS_FAVICON_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
    "%3Crect width='32' height='32' rx='7' fill='%23444455'/%3E" +
    "%3Ctext x='16' y='23' font-family='Arial,sans-serif' font-size='18' font-weight='bold' text-anchor='middle' fill='white'%3EA%3C/text%3E%3C/svg%3E";

  // id: stable key used for storage. name: shown in the Tools dropdown.
  // title / favicon: what gets applied to the tab.
  // requiresName: true marks a preset whose title has a {name} placeholder,
  // filled in from the Tools page's "Insert name" box (see titleEmpty below
  // for what to show before any name has been typed).
  const CLOAK_PRESETS = [
    { id: "global-chat",      name: "Global Chat",      title: "global chat",                       favicon: DEFAULT_FAVICON },
    { id: "youtube",          name: "YouTube",          title: "YouTube",                           favicon: googleFavicon("youtube.com") },
    { id: "google",           name: "Google",           title: "Google",                            favicon: googleFavicon("google.com") },
    { id: "google-classroom", name: "Google Classroom", title: "Home - Classroom",                  favicon: CLASSROOM_FAVICON },
    { id: "google-docs",      name: "Google Docs",      title: "Untitled document - Google Docs",   favicon: googleFavicon("docs.google.com") },
    { id: "wikipedia",        name: "Wikipedia",        title: "Wikipedia",                         favicon: googleFavicon("wikipedia.org") },
    { id: "renaissance",      name: "Renaissance",      title: "Renaissance Student Home",          favicon: RENAISSANCE_FAVICON },
    { id: "aleks",            name: "Aleks",            title: "ALEKS - {name} - Home",             favicon: ALEKS_FAVICON_PLACEHOLDER, requiresName: true, titleEmpty: "ALEKS - Home" }
  ];

  function setFaviconHref(href) {
    // Some browsers don't repaint the tab icon when you merely mutate an
    // existing <link rel="icon">'s href — they only pick up a *new* element.
    // So the old cloak <link> (if any) is removed and a fresh one inserted
    // every time a preset is applied, rather than reusing/mutating one node.
    const old = document.querySelector('link[rel="icon"][data-gc-cloak]');
    if (old) old.remove();
    const link = document.createElement("link");
    link.rel = "icon";
    link.setAttribute("data-gc-cloak", "true");
    link.href = href;
    document.head.appendChild(link);
    return link;
  }

  function findPreset(id) {
    return CLOAK_PRESETS.find(p => p.id === id) || CLOAK_PRESETS[0];
  }

  function buildTitle(preset, customName) {
    if (!preset.requiresName) return preset.title;
    const name = (customName || "").trim();
    if (!name) return preset.titleEmpty || preset.title;
    return preset.title.replace("{name}", name);
  }

  function applyPreset(id, customName) {
    const preset = findPreset(id);
    const name = customName !== undefined ? customName : getSavedCustomName();
    document.title = buildTitle(preset, name);
    setFaviconHref(preset.favicon);
    return preset;
  }

  function getSavedPresetId() {
    try { return localStorage.getItem(STORAGE_KEY) || CLOAK_PRESETS[0].id; }
    catch (e) { return CLOAK_PRESETS[0].id; }
  }

  function setPreset(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* ignore */ }
    applyPreset(id);
  }

  function getSavedCustomName() {
    try { return localStorage.getItem(STORAGE_KEY_NAME) || ""; }
    catch (e) { return ""; }
  }

  function setCustomName(name) {
    try { localStorage.setItem(STORAGE_KEY_NAME, name); } catch (e) { /* ignore */ }
    // Re-apply whatever preset is currently selected so the title updates live.
    applyPreset(getSavedPresetId(), name);
  }

  // Apply immediately on every page load (chat page and tools page alike),
  // so the cloak persists across refreshes and navigation.
  applyPreset(getSavedPresetId());

  window.GCTabCloak = {
    presets: CLOAK_PRESETS,
    applyPreset,
    setPreset,
    getSavedPresetId,
    getSavedCustomName,
    setCustomName,
    STORAGE_KEY,
    STORAGE_KEY_NAME
  };
})();
