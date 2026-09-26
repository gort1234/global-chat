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

  // Google's s2/favicons service falls back to the generic "G" icon for
  // classroom.google.com, so the real Classroom mark is inlined here instead
  // (path from the official brand icon, colored with Google's published
  // Classroom green, #25A667).
  const CLASSROOM_FAVICON =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E" +
    "%3Cpath fill='%2325A667' d='M1.637 1.637C.732 1.637 0 2.369 0 3.273v17.454c0 .904.732 1.636 1.637 1.636h20.726c.905 0 1.637-.732 1.637-1.636V3.273c0-.904-.732-1.636-1.637-1.636H1.637zm.545 2.181h19.636v16.364h-2.726v-1.09h-4.91v1.09h-12V3.818zM12 8.182a1.636 1.636 0 100 3.273 1.636 1.636 0 100-3.273zm-4.363 1.91c-.678 0-1.229.55-1.229 1.226a1.228 1.228 0 002.455 0c0-.677-.549-1.226-1.226-1.226zm8.726 0a1.227 1.227 0 100 2.453 1.227 1.227 0 000-2.453zM12 12.545c-1.179 0-2.413.401-3.148 1.006a4.136 4.136 0 00-1.215-.188c-1.314 0-2.729.695-2.729 1.559v.896h14.184v-.896c0-.864-1.415-1.559-2.729-1.559-.41 0-.83.068-1.215.188-.735-.605-1.969-1.006-3.148-1.006Z'/%3E" +
    "%3C/svg%3E";

  // id: stable key used for storage. name: shown in the Tools dropdown.
  // title / favicon: what gets applied to the tab.
  const CLOAK_PRESETS = [
    { id: "global-chat",      name: "Global Chat",      title: "global chat",                       favicon: DEFAULT_FAVICON },
    { id: "youtube",          name: "YouTube",          title: "YouTube",                           favicon: googleFavicon("youtube.com") },
    { id: "google",           name: "Google",           title: "Google",                            favicon: googleFavicon("google.com") },
    { id: "google-classroom", name: "Google Classroom", title: "Classes",                           favicon: CLASSROOM_FAVICON },
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
