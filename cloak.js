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

  // The user's own uploaded Google Classroom logo image, embedded verbatim
  // (not recreated/redrawn) as a base64 data URI so no external request or
  // separate asset file is needed.
  const CLASSROOM_FAVICON = "data:image/jpeg;base64,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";

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
