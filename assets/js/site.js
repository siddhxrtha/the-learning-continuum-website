document.addEventListener("DOMContentLoaded", function () {
  initFloatingActions();
  initScrollTopButton();
  initFooterYear();
  initNewsletterForms();
});

function initFloatingActions() {
  if (document.querySelector(".floating-whatsapp")) {
    return;
  }

  var wrap = document.createElement("div");
  wrap.className = "floating-actions";
  wrap.innerHTML =
    '<a class="floating-whatsapp" href="https://wa.me/6597533888" target="_blank" rel="noopener noreferrer" aria-label="Chat with The Learning Continuum on WhatsApp"><i class="bi bi-whatsapp" aria-hidden="true"></i></a>' +
    '<button class="scroll-top-btn" type="button" aria-label="Scroll to top"><i class="bi bi-arrow-up" aria-hidden="true"></i></button>';

  document.body.appendChild(wrap);
}

function initScrollTopButton() {
  var topBtn = document.querySelector(".scroll-top-btn");
  if (!topBtn) {
    return;
  }

  function toggleVisibility() {
    topBtn.classList.toggle("is-visible", window.scrollY > 320);
  }

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });
}

function initFooterYear() {
  var years = document.querySelectorAll(".js-current-year");
  var year = String(new Date().getFullYear());
  years.forEach(function (item) {
    item.textContent = year;
  });
}

function initNewsletterForms() {
  var forms = document.querySelectorAll(".js-newsletter-form");
  if (!forms.length) {
    return;
  }

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var input = form.querySelector('input[type="email"]');
      if (!input || !input.value.trim()) {
        if (input) {
          input.focus();
        }
        return;
      }

      var email = input.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input.focus();
        input.classList.add("is-invalid");
        return;
      }

      input.classList.remove("is-invalid");
      var saved = [];

      try {
        saved = JSON.parse(localStorage.getItem("tlc_newsletter_subscribers") || "[]");
      } catch (error) {
        saved = [];
      }

      if (!saved.includes(email)) {
        saved.push(email);
      }

      localStorage.setItem("tlc_newsletter_subscribers", JSON.stringify(saved));
      form.reset();
      showSiteToast("Subscribed successfully. We will share centre updates soon.");
    });
  });
}

function showSiteToast(message) {
  var existing = document.querySelector(".site-toast");
  if (existing) {
    existing.remove();
  }

  var toast = document.createElement("div");
  toast.className = "site-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML =
    '<i class="bi bi-check-circle-fill" aria-hidden="true"></i>' +
    '<span>' + message + "</span>";

  document.body.appendChild(toast);
  window.setTimeout(function () {
    toast.classList.add("is-visible");
  }, 20);

  window.setTimeout(function () {
    toast.classList.remove("is-visible");
    window.setTimeout(function () {
      toast.remove();
    }, 250);
  }, 3000);
}
