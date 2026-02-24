/**
 * Anemonet Brand Design — Docs site scripts
 */

(function () {
  const STORAGE_KEY = 'anm-theme';

  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(STORAGE_KEY, mode);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', mode === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替');
      toggle.setAttribute('data-theme-current', mode);
    }
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Apply theme immediately to avoid flash
  applyTheme(getInitialTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // OS theme change listener
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Copy hex values on swatch click
    document.querySelectorAll('[data-copy]').forEach(function (el) {
      el.addEventListener('click', function () {
        const val = el.getAttribute('data-copy');
        if (val && navigator.clipboard) {
          navigator.clipboard.writeText(val).then(function () {
            showCopyToast(val);
          });
        }
      });
    });
  });

  function showCopyToast(text) {
    const existing = document.getElementById('copy-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.textContent = '"' + text + '" をコピーしました';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2000);
  }
})();
