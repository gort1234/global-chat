/* ── Global Chat: Tab Cloaking ──
   Shared by index.html and tools.html.
   Only changes document.title and the tab favicon — never the URL/routing.

   To add a new preset later: add one object to CLOAK_PRESETS below.
   Nothing else needs to change; the Tools page dropdown and the apply
   logic both read from this same array.
*/
(function () {
  const STORAGE_KEY = "gcTabCloak";

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

  // id: stable key used for storage. name: shown in the Tools dropdown.
  // title / favicon: what gets applied to the tab.
  const CLOAK_PRESETS = [
    { id: "global-chat",      name: "Global Chat",      title: "global chat",                       favicon: DEFAULT_FAVICON },
    { id: "youtube",          name: "YouTube",          title: "YouTube",                           favicon: googleFavicon("youtube.com") },
    { id: "google",           name: "Google",           title: "Google",                            favicon: googleFavicon("google.com") },
    { id: "google-classroom", name: "Google Classroom", title: "Home - Classroom",                  favicon: CLASSROOM_FAVICON },
    { id: "google-docs",      name: "Google Docs",      title: "Untitled document - Google Docs",   favicon: googleFavicon("docs.google.com") },
    { id: "wikipedia",        name: "Wikipedia",        title: "Wikipedia",                         favicon: googleFavicon("wikipedia.org") },
    { id: "calculator",       name: "Calculator",       title: "Calculator",                        favicon: googleFavicon("calculator.net") }
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

  function applyPreset(id) {
    const preset = findPreset(id);
    document.title = preset.title;
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

  // Apply immediately on every page load (chat page and tools page alike),
  // so the cloak persists across refreshes and navigation.
  applyPreset(getSavedPresetId());

  window.GCTabCloak = {
    presets: CLOAK_PRESETS,
    applyPreset,
    setPreset,
    getSavedPresetId,
    STORAGE_KEY
  };
})();
