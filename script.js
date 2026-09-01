document.addEventListener("DOMContentLoaded", () => {
  const scrollContainer = document.getElementById("scrollContainer");
  const reveals = document.querySelectorAll(".reveal");
  const navItems = [...document.querySelectorAll("#proDock .nav-item")];
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // Reveal sections as they enter the scroll viewport.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    root: scrollContainer,
    threshold: 0.12
  });

  reveals.forEach((el) => revealObserver.observe(el));

  // Navigation: use the clicked section as the source of truth,
  // then sync the active item while scrolling.
  const sectionLinks = navItems
    .map((item) => ({
      item,
      section: document.querySelector(item.getAttribute("href"))
    }))
    .filter(({ section }) => section);

  const setActiveNav = (activeItem) => {
    navItems.forEach((item) => {
      item.classList.toggle("active", item === activeItem);
    });
  };

  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const target = document.querySelector(item.getAttribute("href"));

      if (!target) return;

      event.preventDefault();
      setActiveNav(item);

      const wrapperTop = scrollContainer.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;

      scrollContainer.scrollTo({
        top: Math.max(
          0,
          scrollContainer.scrollTop + targetTop - wrapperTop - 18
        ),
        behavior: "smooth"
      });
    });
  });

  const syncNavToScroll = () => {
    const triggerLine =
      scrollContainer.getBoundingClientRect().top +
      Math.min(110, scrollContainer.clientHeight * 0.28);

    let current = sectionLinks[0];

    for (const link of sectionLinks) {
      const top = link.section.getBoundingClientRect().top;

      if (top <= triggerLine) {
        current = link;
      }
    }

    if (current) {
      setActiveNav(current.item);
    }
  };

  scrollContainer.addEventListener(
    "scroll",
    syncNavToScroll,
    { passive: true }
  );

  syncNavToScroll();

  // Persist theme preference and keep the control state accessible.
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark =
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark-theme");
  }

  const updateThemeControl = () => {
    const dark = document.body.classList.contains("dark-theme");

    themeIcon.setAttribute(
      "name",
      dark ? "sunny-outline" : "moon-outline"
    );

    themeToggle.setAttribute(
      "aria-pressed",
      String(dark)
    );

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        dark ? "#070b12" : "#eef3f9"
      );
  };

  updateThemeControl();

  themeToggle.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark-theme");

    localStorage.setItem(
      "portfolio-theme",
      dark ? "dark" : "light"
    );

    updateThemeControl();
  });

  // Avoid the demo alert; provide an in-page confirmation instead.
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    formStatus.textContent =
      "Thanks! Your message is ready to be connected to your form backend.";

    contactForm.reset();
  });

  // Keep the fixed dock from covering the final content on narrow screens.
  const dock = document.getElementById("proDock");

  const setDockSpace = () => {
    const height =
      dock?.getBoundingClientRect().height || 64;

    document.documentElement.style.setProperty(
      "--dock-space",
      `${height + 40}px`
    );
  };

  setDockSpace();

  window.addEventListener(
    "resize",
    setDockSpace,
    { passive: true }
  );
});