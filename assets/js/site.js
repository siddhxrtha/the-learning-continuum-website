document.addEventListener("DOMContentLoaded", function () {
  initFloatingActions();
  initScrollTopButton();
  initFooterYear();
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
