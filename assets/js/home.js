document.addEventListener("DOMContentLoaded", function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initScrollProgress();
  initHeroParallax(reducedMotion);
  initRevealGroup(".js-reveal", reducedMotion);
  initTrustCounters(reducedMotion);
  initStatCounters(reducedMotion);
  initReviewModule(reducedMotion);
});

function initScrollProgress() {
  var progressBar = document.querySelector(".scroll-progress");
  if (!progressBar) {
    return;
  }

  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
    var percent = Math.min((scrollTop / maxScroll) * 100, 100);
    progressBar.style.width = percent + "%";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function initHeroParallax(reducedMotion) {
  if (reducedMotion) {
    return;
  }

  var wraps = document.querySelectorAll(".js-parallax-wrap");
  if (!wraps.length) {
    return;
  }

  wraps.forEach(function (wrap) {
    var layers = wrap.querySelectorAll("[data-parallax]:not(.float-orb)");
    if (!layers.length) {
      return;
    }

    var pointerX = 0;
    var pointerY = 0;

    function renderLayers() {
      var rect = wrap.getBoundingClientRect();
      var viewportProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      var scrollShift = (viewportProgress - 0.5) * 24;

      layers.forEach(function (layer) {
        var depth = Number(layer.dataset.parallax || 0.1);
        var tx = pointerX * depth * 22;
        var ty = pointerY * depth * 16 + scrollShift * depth;
        layer.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
      });
    }

    wrap.addEventListener("mousemove", function (event) {
      var rect = wrap.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      window.requestAnimationFrame(renderLayers);
    });

    wrap.addEventListener("mouseleave", function () {
      pointerX = 0;
      pointerY = 0;
      window.requestAnimationFrame(renderLayers);
    });

    window.addEventListener(
      "scroll",
      function () {
        window.requestAnimationFrame(renderLayers);
      },
      { passive: true }
    );

    renderLayers();
  });
}

function initRevealGroup(selector, reducedMotion) {
  var items = document.querySelectorAll(selector);
  if (!items.length) {
    return;
  }

  items.forEach(function (item) {
    item.classList.add("will-reveal");
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (item) {
      item.classList.remove("will-reveal");
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        var element = entry.target;
        var delay = Number(element.dataset.revealDelay || 0);

        window.setTimeout(function () {
          element.classList.remove("will-reveal");
          element.classList.add("is-visible");
        }, delay);

        obs.unobserve(element);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });

  // Fallback: if any element misses intersection due browser edge-cases, reveal anyway.
  window.setTimeout(function () {
    items.forEach(function (item) {
      if (!item.classList.contains("is-visible")) {
        item.classList.remove("will-reveal");
        item.classList.add("is-visible");
      }
    });
  }, 1700);
}

function initTrustCounters(reducedMotion) {
  var counters = document.querySelectorAll(".js-counter");
  initCounterGroup(counters, reducedMotion, 1000, 0.3);
}

function initStatCounters(reducedMotion) {
  var counters = document.querySelectorAll(".js-stat-counter");
  initCounterGroup(counters, reducedMotion, 1200, 0.35);
}

function initCounterGroup(counters, reducedMotion, duration, threshold) {
  if (!counters.length) {
    return;
  }

  if (reducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach(function (counter) {
      animateCounterElement(counter, true, duration);
    });
    return;
  }

  var counterObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        var target = entry.target;
        animateCounterElement(target, false, duration);
        obs.unobserve(target);
      });
    },
    {
      threshold: threshold
    }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  window.setTimeout(function () {
    counters.forEach(function (counter) {
      animateCounterElement(counter, false, duration);
    });
  }, 1800);
}

function animateCounterElement(counter, reducedMotion, duration) {
  if (counter.dataset.counted === "true") {
    return;
  }

  var target = Number(counter.dataset.target || 0);
  var suffix = counter.dataset.suffix || "";
  var prefix = counter.dataset.prefix || "";
  var decimals = Number(counter.dataset.decimals || 0);
  var scale = Number(counter.dataset.scale || 1);
  var startTime = null;

  function formatValue(raw) {
    var displayed = raw / scale;
    return (
      prefix +
      displayed.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) +
      suffix
    );
  }

  counter.dataset.counted = "true";

  if (reducedMotion) {
    counter.textContent = formatValue(target);
    return;
  }

  function tick(timestamp) {
    if (!startTime) {
      startTime = timestamp;
    }

    var progress = Math.min((timestamp - startTime) / duration, 1);
    var currentValue = target * progress;
    counter.textContent = formatValue(currentValue);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    counter.textContent = formatValue(target);
  }

  window.requestAnimationFrame(tick);
}

function initReviewModule(reducedMotion) {
  initRevealGroup(".js-review-reveal", reducedMotion);
  initReviewAutoScroll(reducedMotion);
}

function initReviewAutoScroll(reducedMotion) {
  var track = document.querySelector(".js-reviews-track");
  if (!track) {
    return;
  }

  var cards = Array.prototype.slice.call(track.querySelectorAll(".review-card"));
  if (cards.length < 2) {
    return;
  }

  if (reducedMotion) {
    return;
  }

  cards.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.classList.remove("js-review-reveal", "will-reveal");
    clone.classList.add("is-visible");
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  var halfWidth = Math.max(track.scrollWidth / 2, 1);
  var direction = -1; // left-to-right movement in viewport
  var speed = window.innerWidth < 768 ? 0.34 : 0.5;
  var paused = false;
  var rafId = null;

  track.scrollLeft = halfWidth * 0.5;

  function tick() {
    if (!paused) {
      track.scrollLeft += speed * direction;

      if (track.scrollLeft <= 1) {
        track.scrollLeft += halfWidth;
      } else if (track.scrollLeft >= halfWidth) {
        track.scrollLeft -= halfWidth;
      }
    }

    rafId = window.requestAnimationFrame(tick);
  }

  function pause() {
    paused = true;
  }

  function resume() {
    if (!reducedMotion) {
      paused = false;
    }
  }

  track.addEventListener("mouseenter", pause);
  track.addEventListener("mouseleave", resume);
  track.addEventListener("focusin", pause);
  track.addEventListener("focusout", resume);
  track.addEventListener("touchstart", pause, { passive: true });
  track.addEventListener("touchend", resume, { passive: true });

  window.addEventListener("blur", pause);
  window.addEventListener("focus", resume);

  if (rafId === null) {
    rafId = window.requestAnimationFrame(tick);
  }
}
