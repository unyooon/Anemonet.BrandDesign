/**
 * Anemonet — Business site scripts
 * Theme toggle, smooth scroll, mobile menu
 */

(function () {
  var STORAGE_KEY = "anm-theme";

  /**
   * テーマを適用してlocalStorageに保存する
   * @param {string} mode - "light" | "dark"
   */
  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(STORAGE_KEY, mode);
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        mode === "dark" ? "ライトモードに切替" : "ダークモードに切替"
      );
      toggle.setAttribute("data-theme-current", mode);
    }
  }

  /**
   * 初期テーマを取得する（localStorage → OS設定 → light の順で優先）
   * @returns {string} "light" | "dark"
   */
  function getInitialTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  // フラッシュ防止のため即時適用
  applyTheme(getInitialTheme());

  document.addEventListener("DOMContentLoaded", function () {
    // ---- テーマ切替 ----
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }

    // OS テーマ変更の追従（ユーザーが明示的に選択していない場合のみ）
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", function (e) {
          if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? "dark" : "light");
          }
        });
    }

    // ---- スムーズスクロール ----
    var navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (href === "#") return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        // モバイルメニューが開いていれば閉じる
        closeMobileMenu();
        var header = document.querySelector(".site-header");
        var headerHeight = header ? header.offsetHeight : 0;
        var top =
          target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
        window.scrollTo({ top: top, behavior: "smooth" });
        // フォーカスをターゲットへ移動（アクセシビリティ）
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });

    // ---- モバイルメニュー ----
    var menuBtn = document.getElementById("mobile-menu-btn");
    var mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", function () {
        var isOpen = mobileMenu.getAttribute("aria-hidden") === "false";
        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      // メニュー外クリックで閉じる
      document.addEventListener("click", function (e) {
        if (
          mobileMenu.getAttribute("aria-hidden") === "false" &&
          !mobileMenu.contains(e.target) &&
          e.target !== menuBtn &&
          !menuBtn.contains(e.target)
        ) {
          closeMobileMenu();
        }
      });

      // Escape キーで閉じる
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mobileMenu.getAttribute("aria-hidden") === "false") {
          closeMobileMenu();
          menuBtn.focus();
        }
      });
    }

    /**
     * モバイルメニューを開く
     */
    function openMobileMenu() {
      mobileMenu.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "メニューを閉じる");
      document.body.style.overflow = "hidden";
    }

    /**
     * モバイルメニューを閉じる
     */
    function closeMobileMenu() {
      if (!mobileMenu) return;
      mobileMenu.setAttribute("aria-hidden", "true");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "メニューを開く");
      }
      document.body.style.overflow = "";
    }
  });
})();
