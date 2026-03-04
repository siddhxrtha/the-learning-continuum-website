function initSiteNavbar(navRoot) {
  if (!navRoot) {
    return;
  }

  var isAboutPage = /about\.html$/i.test(window.location.pathname);
  var isSchedulePage = /schedule\.html$/i.test(window.location.pathname);
  var isHomePage = !isAboutPage && !isSchedulePage;
  var collapseElement = navRoot.querySelector(".tlc-nav-menu");
  var navLinks = Array.prototype.slice.call(navRoot.querySelectorAll(".js-nav-link"));

  function markActiveByPage() {
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var isHome = /index\.html$/i.test(href);
      var isAbout = /about\.html$/i.test(href);
      var isSchedule = /schedule\.html$/i.test(href);
      var isActive =
        (isHomePage && isHome) ||
        (isAboutPage && isAbout) ||
        (isSchedulePage && isSchedule);
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateScrollState() {
    navRoot.classList.toggle("is-scrolled", window.scrollY > 8);
    syncNavHeightVar();
  }

  function syncNavHeightVar() {
    var navHeight = Math.ceil(navRoot.getBoundingClientRect().height);
    if (!navHeight) {
      return;
    }
    document.documentElement.style.setProperty("--tlc-nav-height", navHeight + "px");
  }

  updateScrollState();
  markActiveByPage();

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", function () {
    syncNavHeightVar();
  });
  window.addEventListener("load", syncNavHeightVar);

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (!collapseElement || typeof bootstrap === "undefined") {
        return;
      }

      if (window.matchMedia("(max-width: 991.98px)").matches) {
        var instance = bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false });
        instance.hide();
      }
    });
  });
}

if (!customElements.get("site-navbar")) {
  customElements.define(
    "site-navbar",
    class extends HTMLElement {
      connectedCallback() {
        var collapseId = "mainNav-" + Math.random().toString(36).slice(2, 9);
        var brandHref = "index.html";
        var homeHref = "index.html";
        var aboutHref = "about.html";
        var scheduleHref = "schedule.html";
        var bookHref = "index.html#contact";

        this.innerHTML = `
        <nav class="navbar navbar-expand-lg sticky-top tlc-navbar" aria-label="Main navigation">
          <div class="container-fluid px-3 px-lg-4">
            <div class="tlc-nav-shell w-100">
              <a class="navbar-brand tlc-brand" href="${brandHref}" aria-label="The Learning Continuum home">
                <span class="tlc-brand-dot" aria-hidden="true"><i class="bi bi-mortarboard-fill"></i></span>
                <span class="tlc-brand-text">The Learning Continuum</span>
              </a>
              <button class="navbar-toggler tlc-nav-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-controls="${collapseId}" aria-expanded="false" aria-label="Toggle navigation">
                <i class="bi bi-list" aria-hidden="true"></i>
              </button>
              <div class="collapse navbar-collapse tlc-nav-menu" id="${collapseId}">
                <ul class="navbar-nav tlc-nav-links align-items-lg-center">
                  <li class="nav-item"><a class="nav-link js-nav-link" href="${homeHref}">Home</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" href="${aboutHref}">About Us</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" href="${scheduleHref}">Schedules</a></li>
                  <li class="nav-item ms-lg-auto mt-3 mt-lg-0 d-grid d-lg-block">
                    <a class="tlc-nav-cta" href="${bookHref}">Book Consultation</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        `;

        var rootNav = this.querySelector(".tlc-navbar");
        initSiteNavbar(rootNav);
      }
    }
  );
}
