// Light/dark theme switch. Dark is the default; the visitor's choice is remembered.
// Loaded in <head> (not deferred) so a saved light theme applies before the page paints.
//
// The choice is stored in two places:
//  - localStorage: shared by all pages of the site when it is served over http(s).
//  - window.name: survives navigation within the same tab, which keeps the choice
//    when pages are opened as local files (Firefox gives each file:// page its own storage).
(function () {
    var KEY = 'theme';
    var NAME_PREFIX = 'theme:';
    var root = document.documentElement;

    // window.name first: it holds the latest choice made in this tab, while a
    // per-file localStorage (file:// in Firefox) may still hold an older one.
    function load() {
        if (window.name.indexOf(NAME_PREFIX) === 0) return window.name.slice(NAME_PREFIX.length);
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function save(theme) {
        try { localStorage.setItem(KEY, theme); } catch (e) {}
        // only overwrite window.name if it is empty or already ours
        if (!window.name || window.name.indexOf(NAME_PREFIX) === 0) window.name = NAME_PREFIX + theme;
    }

    var initial = load();
    if (initial === 'light') root.setAttribute('data-theme', 'light');
    if (initial) save(initial); // copy to both stores so either one can carry it to the next page

    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.querySelector('.theme-toggle');
        if (!btn) return;

        function isDark() { return root.getAttribute('data-theme') !== 'light'; }

        btn.setAttribute('aria-pressed', String(isDark()));
        btn.addEventListener('click', function () {
            var dark = !isDark();
            if (dark) root.removeAttribute('data-theme');
            else root.setAttribute('data-theme', 'light');
            btn.setAttribute('aria-pressed', String(dark));
            save(dark ? 'dark' : 'light');
        });
    });
})();
