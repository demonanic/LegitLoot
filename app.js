(() => {
  document.querySelectorAll(".site-header").forEach((header, index) => {
    const toggle = header.querySelector(".menu-toggle");
    const nav = header.querySelector(".main-nav");
    if (!toggle || !nav) return;

    if (!nav.id) nav.id = `site-navigation-${index + 1}`;
    toggle.setAttribute("aria-controls", nav.id);

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target) && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
    });
  });

  const year = new Date().getFullYear();
  document.querySelectorAll("#year").forEach((element) => {
    element.textContent = String(year);
  });
})();
