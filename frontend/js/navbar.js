// js/navbar.js
// Responsive navbar helpers: toggle, close-on-link-click, close-on-outside-click, ESC, auto-close on resize

(function () {
  const menuId = "navMenu";
  const hamburgerSelector = ".hamburger";
  const linkSelector = "#navMenu a";
  const breakpoint = 768;

  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

  function toggleMenu() {
    const menu = document.getElementById(menuId);
    if (!menu) return;
    menu.classList.toggle("open");
  }

  // Close menu
  function closeMenu() {
    const menu = document.getElementById(menuId);
    if (!menu) return;
    menu.classList.remove("open");
  }

  // Click outside to close
  function onDocumentClick(e) {
    const menu = document.getElementById(menuId);
    const hamburger = document.querySelector(hamburgerSelector);
    if (!menu || !hamburger) return;

    // If click is inside menu or hamburger, ignore
    if (menu.contains(e.target) || hamburger.contains(e.target)) return;

    // Otherwise close
    closeMenu();
  }

  // Close on Escape key
  function onKeyUp(e) {
    if (e.key === "Escape") closeMenu();
  }

  // Auto-close when window resized above breakpoint
  function onResize() {
    if (window.innerWidth > breakpoint) closeMenu();
  }

  // Close menu when a nav link is clicked (mobile)
  function onNavLinkClick() {
    if (window.innerWidth <= breakpoint) closeMenu();
  }

  // Expose toggle for onclick attribute (keeps your HTML unchanged)
  window.toggleMenu = toggleMenu;

  // Init listeners after DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(hamburgerSelector);

    if (hamburger) {
      hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    // Close when clicking outside
    document.addEventListener("click", onDocumentClick);

    // Close on ESC
    document.addEventListener("keyup", onKeyUp);

    // Resize behavior
    window.addEventListener("resize", onResize);

    // Close when nav links clicked
    $all(linkSelector).forEach((a) => a.addEventListener("click", onNavLinkClick));
  });
})();
