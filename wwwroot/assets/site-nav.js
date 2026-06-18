(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primaryNav");

  const setMenuOpen = (open) => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    primaryNav.classList.toggle("is-open", open);
  };

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  primaryNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
})();
