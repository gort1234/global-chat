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

  // id: stable key used for storage. name: shown in the Tools dropdown.
  // title / favicon: what gets applied to the tab.
  const CLOAK_PRESETS = [
    { id: "global-chat",      name: "Global Chat",      title: "global chat",                       favicon: DEFAULT_FAVICON },
    { id: "youtube",          name: "YouTube",          title: "YouTube",                           favicon: googleFavicon("youtube.com") },
    { id: "google",           name: "Google",           title: "Google",                            favicon: googleFavicon("google.com") },
    { id: "google-classroom", name: "Google Classroom", title: "Classes",                           favicon: googleFavicon("classroom.google.com") },
    { id: "google-docs",      name: "Google Docs",      title: "Untitled document - Google Docs",   favicon: googleFavicon("docs.google.com") },
    { id: "wikipedia",        name: "Wikipedia",        title: "Wikipedia",                         favicon: googleFavicon("wikipedia.org") },
    { id: "calculator",       name: "Calculator",       title: "Calculator",                        favicon: googleFavicon("calculator.net") }
  ];

  function getFaviconLink() {
    let link = document.querySelector('link[rel="icon"][data-gc-cloak]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.setAttribute("data-gc-cloak", "true");
      document.head.appendChild(link);
    }
    return link;
  }

  function findPreset(id) {
    return CLOAK_PRESETS.find(p => p.id === id) || CLOAK_PRESETS[0];
  }

  function applyPreset(id) {
    const preset = findPreset(id);
    document.title = preset.title;
    getFaviconLink().href = preset.favicon;
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
