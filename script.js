const body = document.body;
const loader = document.querySelector(".loader");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#navMenu");
const year = document.querySelector("#year");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const contactForm = document.querySelector(".contact-form");

year.textContent = new Date().getFullYear();

window.addEventListener("load", () => {
  window.setTimeout(() => {
    body.classList.add("loaded");
    loader.setAttribute("aria-hidden", "true");
  }, 450);
});

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("menu-open", isOpen);
});

navMenu.addEventListener("click", (event) => {
  if (!event.target.matches("a")) {
    return;
  }

  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
});

const animateCounter = (element) => {
  const target = Number(element.dataset.counter);
  const suffix = element.dataset.suffix || "";
  const duration = 1100;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("stat")) {
        entry.target.querySelectorAll("[data-counter]").forEach((counter) => {
          if (!counter.dataset.done) {
            counter.dataset.done = "true";
            animateCounter(counter);
          }
        });
      }

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

counters.forEach((counter) => {
  counter.textContent = `0${counter.dataset.suffix || ""}`;
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  const originalText = button.textContent;

  button.textContent = "Interest Submitted";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    contactForm.reset();
  }, 1800);
});
