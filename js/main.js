const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("mainMenu");
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const yearEl = document.getElementById("year");
const form = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const submitBtn = document.getElementById("submitBtn");
const skeleton = document.getElementById("insightsSkeleton");
const insights = document.getElementById("insightsContent");
const emptyState = document.getElementById("insightsEmpty");

const THEME_KEY = "sustaingrow-theme";

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.firstElementChild.textContent = theme === "dark" ? "Dark" : "Light";
  }
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  setTheme(initial);
}

function validateField(field) {
  const value = field.value.trim();
  let valid = true;

  if (!value) {
    valid = false;
  } else if (field.type === "email") {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  field.setAttribute("aria-invalid", String(!valid));
  return valid;
}

function setFeedback(type, message) {
  if (!formFeedback) return;
  formFeedback.classList.remove("is-error", "is-success");
  if (type === "error") formFeedback.classList.add("is-error");
  if (type === "success") formFeedback.classList.add("is-success");
  formFeedback.textContent = message;
}

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll('.menu a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (form && submitBtn) {
  const fields = Array.from(form.querySelectorAll("input, textarea"));

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFeedback("", "");

    const valid = fields.every((field) => validateField(field));
    if (!valid) {
      setFeedback("error", "Please provide valid information in all required fields.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const [name, email, company, message] = fields.map((field) => field.value.trim());
      const subject = encodeURIComponent("New Inspection Request - SUSTAINGROW Website");
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company}`,
          "",
          "Inspection Requirement:",
          message
        ].join("\n")
      );
      const mailtoLink = `mailto:info@sustaingrowsl.com?subject=${subject}&body=${body}`;

      // Short delay keeps feedback state visible and avoids abrupt UI jump.
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      window.location.href = mailtoLink;

      form.reset();
      fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
      setFeedback("success", "Draft opened in your email app. Please send to complete the request.");
    } catch (_error) {
      setFeedback("error", "Unable to submit right now. Please email info@sustaingrowsl.com.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Request";
    }
  });
}

window.setTimeout(() => {
  if (!skeleton || !insights || !emptyState) return;
  skeleton.classList.add("hidden");
  const hasInsights = true;
  if (hasInsights) {
    insights.classList.remove("hidden");
  } else {
    emptyState.classList.remove("hidden");
  }
}, 900);

initTheme();
