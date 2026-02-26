function initSiteNavbar(navRoot) {
  if (!navRoot) {
    return;
  }

  var collapseElement = navRoot.querySelector(".tlc-nav-menu");
  var navLinks = Array.prototype.slice.call(navRoot.querySelectorAll(".js-nav-link"));
  var sections = navLinks
    .map(function (link) {
      var hash = link.getAttribute("href");
      if (!hash || hash.charAt(0) !== "#") {
        return null;
      }
      return document.querySelector(hash);
    })
    .filter(Boolean);

  function markActiveByHash(hash) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === hash;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveSection() {
    var fromTop = window.scrollY + 130;
    var current = sections[0];

    sections.forEach(function (section) {
      if (section.offsetTop <= fromTop) {
        current = section;
      }
    });

    if (current && current.id) {
      markActiveByHash("#" + current.id);
    }
  }

  function updateScrollState() {
    navRoot.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  updateScrollState();
  updateActiveSection();

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);

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

        this.innerHTML = `
        <nav class="navbar navbar-expand-lg sticky-top tlc-navbar" aria-label="Main navigation">
          <div class="container-fluid px-3 px-lg-4">
            <div class="tlc-nav-shell w-100">
              <a class="navbar-brand tlc-brand" href="#home" aria-label="The Learning Continuum home">
                <span class="tlc-brand-dot" aria-hidden="true"><i class="bi bi-mortarboard-fill"></i></span>
                <span class="tlc-brand-text">The Learning Continuum</span>
              </a>
              <button class="navbar-toggler tlc-nav-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-controls="${collapseId}" aria-expanded="false" aria-label="Toggle navigation">
                <i class="bi bi-list" aria-hidden="true"></i>
              </button>
              <div class="collapse navbar-collapse tlc-nav-menu" id="${collapseId}">
                <ul class="navbar-nav tlc-nav-links align-items-lg-center">
                  <li class="nav-item"><a class="nav-link js-nav-link" href="#home">Home</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" href="#programmes">Programmes</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" href="#results">Results</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" href="#teachers">Teachers</a></li>
                  <li class="nav-item"><a class="nav-link js-nav-link" href="#reviews">Reviews</a></li>
                  <li class="nav-item ms-lg-auto mt-3 mt-lg-0 d-grid d-lg-block">
                    <a class="tlc-nav-cta" href="#contact">Book Consultation</a>
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
