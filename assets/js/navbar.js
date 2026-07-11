function initSiteNavbar(navRoot) {
  if (!navRoot) {
    return;
  }

  var path = (window.location.pathname || "").toLowerCase();
  var currentPage = "home";
  var pageMatchers = [
    { key: "about", test: /about\.html$/i },
    { key: "programmes", test: /programmes\.html$/i },
    { key: "schedule", test: /schedule\.html$/i },
    { key: "testimonials", test: /testimonials\.html$/i },
    { key: "gallery", test: /gallery\.html$/i },
    { key: "faq", test: /faq\.html$/i },
    { key: "contact", test: /contact\.html$/i },
    { key: "results", test: /results\.html$/i }
  ];

  pageMatchers.forEach(function (matcher) {
    if (matcher.test.test(path)) {
      currentPage = matcher.key;
    }
  });

  var collapseElement = navRoot.querySelector(".tlc-nav-menu");
  var navLinks = Array.prototype.slice.call(navRoot.querySelectorAll(".js-nav-link"));

  function markActiveByPage() {
    navLinks.forEach(function (link) {
      var pageKey = link.dataset.page || "";
      var isActive = pageKey === currentPage;
      link.classList.toggle("is-active", isActive);
      link.classList.toggle("active", isActive);
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
    if (
      collapseElement &&
      collapseElement.classList.contains("show") &&
      window.matchMedia("(max-width: 1199.98px)").matches
    ) {
      return;
    }

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

  if (collapseElement) {
    collapseElement.addEventListener("hidden.bs.collapse", syncNavHeightVar);
  }

  if ("ResizeObserver" in window) {
    var navResizeObserver = new ResizeObserver(function () {
      syncNavHeightVar();
    });
    navResizeObserver.observe(navRoot);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncNavHeightVar);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (!collapseElement || typeof bootstrap === "undefined") {
        return;
      }

      if (window.matchMedia("(max-width: 1199.98px)").matches) {
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
        var bookHref = "contact.html#enquiry-form";

        this.innerHTML = `
        <nav class="navbar navbar-expand-xl sticky-top tlc-navbar" aria-label="Main navigation">
          <div class="container-fluid px-3 px-lg-4">
            <div class="tlc-nav-shell w-100">
              <a class="navbar-brand tlc-brand" href="${brandHref}" aria-label="The Learning Continuum home">
                <span class="tlc-brand-badge">
                  <img
                    class="tlc-brand-logo"
                    src="tlc_logo.png"
                    alt="The Learning Continuum"
                    width="582"
                    height="429"
                  >
                </span>
              </a>
              <button class="navbar-toggler tlc-nav-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-controls="${collapseId}" aria-expanded="false" aria-label="Toggle navigation">
                <i class="bi bi-list" aria-hidden="true"></i>
              </button>
              <div class="collapse navbar-collapse tlc-nav-menu" id="${collapseId}">
                <ul class="navbar-nav tlc-nav-links align-items-lg-center">
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="home" href="index.html">Home</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="about" href="about.html">About Us</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="programmes" href="programmes.html">Programmes</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="schedule" href="schedule.html">Schedules</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="testimonials" href="testimonials.html">Testimonials</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="gallery" href="gallery.html">Gallery</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="faq" href="faq.html">FAQ</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" data-page="contact" href="contact.html">Contact</a></li>
                  <li class="nav-item ms-lg-auto mt-3 mt-lg-0 d-grid d-lg-block">
                    <a class="tlc-nav-cta" href="${bookHref}">Book Free Trial</a>
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
