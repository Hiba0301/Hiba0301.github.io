// =========================
// MOBILE NAVIGATION
// =========================
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-links a");

function closeMobileNav() {
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMobileNav();
  }
});

// =========================
// DARK MODE
// =========================
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const savedTheme = localStorage.getItem("portfolio-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);

  const isDark = theme === "dark";
  themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

// =========================
// SCROLL REVEAL
// =========================
const revealElements = document.querySelectorAll(".reveal");

// Precompute each reveal element's position among its reveal siblings (for stagger)
revealElements.forEach((element) => {
  const siblings = Array.from(element.parentElement.children).filter((child) =>
    child.classList.contains("reveal")
  );
  element.dataset.revealIndex = String(siblings.indexOf(element));
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const index = parseInt(target.dataset.revealIndex || "0", 10);
        const delay = Math.min(index, 6) * 90;

        target.style.transitionDelay = `${delay}ms`;
        target.classList.add("visible");
        observer.unobserve(target);

        // Clear the delay after the entrance so later transforms (tilt) aren't delayed
        setTimeout(() => {
          target.style.transitionDelay = "";
        }, delay + 780);
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// =========================
// SCROLL PROGRESS BAR
// =========================
const scrollProgress = document.querySelector("#scroll-progress");

if (scrollProgress) {
  let progressTicking = false;

  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? doc.scrollTop / max : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    progressTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!progressTicking) {
        progressTicking = true;
        requestAnimationFrame(updateProgress);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

// =========================
// BACK TO TOP
// =========================
const backToTopLink = document.querySelector('.footer a[href="#top"]');

if (backToTopLink) {
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  backToTopLink.addEventListener("click", (event) => {
    event.preventDefault();

    const start = window.scrollY || document.documentElement.scrollTop || 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || start === 0) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // Timer-driven animation — reliable in every browser (some ignore behavior:"smooth")
    const duration = Math.min(700, Math.max(320, start * 0.55));
    const startTime = performance.now();

    const timer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - startTime) / duration);
      window.scrollTo({ top: Math.round(start * (1 - easeOutCubic(progress))), behavior: "auto" });
      if (progress >= 1) clearInterval(timer);
    }, 16);
  });
}

// =========================
// ACTIVE NAV LINK / SCROLLSPY
// =========================
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isCurrent);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// =========================
// PROJECT IMAGE MODAL
// =========================
const modal = document.querySelector("#image-modal");
const modalImage = document.querySelector("#modal-image");
const modalClose = document.querySelector("#modal-close");
const modalButtons = document.querySelectorAll("[data-modal-image]");
let lastFocusedElement = null;

function openModal(button) {
  lastFocusedElement = document.activeElement;
  modalImage.src = button.dataset.modalImage;
  modalImage.alt = button.dataset.modalAlt || "Project preview";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalImage.src = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

modalButtons.forEach((button) => {
  button.addEventListener("click", () => openModal(button));
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

// =========================
// PRESENTATION SLIDES VIEWER
// =========================
const slidesModal = document.querySelector("#slides-modal");

if (slidesModal) {
  const slidesImage = document.querySelector("#slides-image");
  const slidesPrev = document.querySelector("#slides-prev");
  const slidesNext = document.querySelector("#slides-next");
  const slidesClose = document.querySelector("#slides-close");
  const slidesCurrent = document.querySelector("#slides-current");
  const slidesTotal = document.querySelector("#slides-total");
  const slidesTriggers = document.querySelectorAll("[data-slides]");

  let slideBase = "";
  let slideCount = 0;
  let slideIndex = 0;
  let slidesLastFocus = null;

  const pad2 = (n) => String(n).padStart(2, "0");

  const preload = (i) => {
    if (i < 1 || i > slideCount) return;
    const img = new Image();
    img.src = `${slideBase}${pad2(i)}.jpg`;
  };

  const renderSlide = () => {
    slidesImage.src = `${slideBase}${pad2(slideIndex + 1)}.jpg`;
    slidesImage.alt = `Presentation slide ${slideIndex + 1} of ${slideCount}`;
    slidesCurrent.textContent = String(slideIndex + 1);
    slidesPrev.disabled = slideIndex === 0;
    slidesNext.disabled = slideIndex === slideCount - 1;
    preload(slideIndex + 2);
    preload(slideIndex);
  };

  const goTo = (i) => {
    slideIndex = Math.max(0, Math.min(slideCount - 1, i));
    renderSlide();
  };

  const openSlides = (trigger) => {
    slideBase = trigger.dataset.slides;
    slideCount = parseInt(trigger.dataset.slideCount, 10) || 1;
    slideIndex = 0;
    slidesLastFocus = document.activeElement;
    slidesTotal.textContent = String(slideCount);
    renderSlide();
    slidesModal.classList.add("open");
    slidesModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    slidesNext.focus();
  };

  const closeSlides = () => {
    slidesModal.classList.remove("open");
    slidesModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    slidesImage.src = "";
    if (slidesLastFocus) slidesLastFocus.focus();
  };

  slidesTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openSlides(trigger));
  });

  slidesPrev.addEventListener("click", () => goTo(slideIndex - 1));
  slidesNext.addEventListener("click", () => goTo(slideIndex + 1));
  slidesClose.addEventListener("click", closeSlides);

  slidesModal.addEventListener("click", (event) => {
    if (event.target === slidesModal) closeSlides();
  });

  document.addEventListener("keydown", (event) => {
    if (!slidesModal.classList.contains("open")) return;
    if (event.key === "Escape") closeSlides();
    if (event.key === "ArrowRight") goTo(slideIndex + 1);
    if (event.key === "ArrowLeft") goTo(slideIndex - 1);
  });
}

// =========================
// 3D TILT INTERACTIONS
// =========================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!prefersReducedMotion && finePointer) {
  // --- Cursor-driven card tilt with specular glare ---
  const tiltCards = document.querySelectorAll(".feature-card, .project-card, .education-card, .cert-card");
  const MAX_TILT = 9; // degrees

  tiltCards.forEach((card) => {
    const glare = document.createElement("span");
    glare.className = "tilt-glare";
    glare.setAttribute("aria-hidden", "true");
    card.appendChild(glare);

    let frame = null;

    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const ry = (px - 0.5) * (MAX_TILT * 2);
        const rx = (0.5 - py) * (MAX_TILT * 2);
        card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      });
    };

    const onEnter = () => card.classList.add("is-tilting");

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      card.classList.remove("is-tilting");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
  });

  // --- Hero profile parallax ---
  const heroVisual = document.querySelector(".hero-visual");
  const profileShell = document.querySelector(".profile-shell");

  if (heroVisual && profileShell) {
    let heroFrame = null;

    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;

      if (heroFrame) cancelAnimationFrame(heroFrame);
      heroFrame = requestAnimationFrame(() => {
        profileShell.style.setProperty("--hero-ry", `${((px - 0.5) * 26).toFixed(2)}deg`);
        profileShell.style.setProperty("--hero-rx", `${((0.5 - py) * 20).toFixed(2)}deg`);
      });
    });

    heroVisual.addEventListener("pointerleave", () => {
      if (heroFrame) cancelAnimationFrame(heroFrame);
      profileShell.style.setProperty("--hero-ry", "0deg");
      profileShell.style.setProperty("--hero-rx", "0deg");
    });
  }
}

// =========================
// FORMSPREE CONTACT FORM
// =========================
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const defaultButtonContent = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    contactForm.reset();
    formStatus.textContent = "Message sent successfully. Thank you!";
    formStatus.className = "form-status success";
  } catch (error) {
    formStatus.textContent = "Unable to send the message. Please try again or contact me by email.";
    formStatus.className = "form-status error";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = defaultButtonContent;
  }
});

// =========================
// PROJECT IMAGE CAROUSEL
// =========================
document.querySelectorAll("[data-carousel]").forEach((root) => {
  const track = root.querySelector(".carousel-track");
  const slides = Array.from(root.querySelectorAll(".carousel-slide"));
  const prev = root.querySelector(".carousel-prev");
  const next = root.querySelector(".carousel-next");
  const dotsWrap = root.querySelector(".carousel-dots");
  const counter = root.querySelector(".carousel-index");
  const caption = root.querySelector(".carousel-caption");
  const total = slides.length;
  if (!track || total === 0) return;

  let index = 0;
  let timer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to screenshot ${i + 1}`);
    dot.addEventListener("click", () => {
      go(i);
      restart();
    });
    dotsWrap && dotsWrap.appendChild(dot);
    return dot;
  });

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    slides.forEach((slide, i) => slide.setAttribute("aria-hidden", i === index ? "false" : "true"));
    if (counter) counter.textContent = String(index + 1);
    if (caption) {
      const img = slides[index].querySelector("img");
      if (img && img.dataset.caption) caption.textContent = img.dataset.caption;
    }
  }

  function go(i) {
    index = (i + total) % total;
    render();
  }
  const nextSlide = () => go(index + 1);
  const prevSlide = () => go(index - 1);

  next && next.addEventListener("click", () => { nextSlide(); restart(); });
  prev && prev.addEventListener("click", () => { prevSlide(); restart(); });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") { nextSlide(); restart(); }
    else if (event.key === "ArrowLeft") { prevSlide(); restart(); }
  });

  // Touch swipe
  const viewport = root.querySelector(".carousel-viewport");
  let startX = null;
  if (viewport) {
    viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    viewport.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); }
      startX = null;
      restart();
    });
  }

  function start() {
    if (!reduceMotion && total > 1 && timer === null) {
      timer = window.setInterval(nextSlide, 5000);
    }
  }
  function stop() {
    if (timer !== null) { window.clearInterval(timer); timer = null; }
  }
  function restart() { stop(); start(); }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  render();
  start();
});
