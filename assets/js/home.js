document.addEventListener("DOMContentLoaded", function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initTrustCards(reducedMotion);
  initReviewModule(reducedMotion);
});

function initTrustCards(reducedMotion) {
  var cards = document.querySelectorAll(".js-trust-card");
  if (!cards.length) {
    return;
  }

  cards.forEach(function (card) {
    card.classList.add("will-reveal");
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach(function (card) {
      card.classList.remove("will-reveal");
      card.classList.add("is-visible");
      animateCounters(card, reducedMotion);
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        var card = entry.target;
        var delay = Number(card.dataset.delay || 0);

        window.setTimeout(function () {
          card.classList.remove("will-reveal");
          card.classList.add("is-visible");
          animateCounters(card, reducedMotion);
        }, delay);

        obs.unobserve(card);
      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  cards.forEach(function (card) {
    observer.observe(card);
  });

  window.setTimeout(function () {
    cards.forEach(function (card) {
      if (!card.classList.contains("is-visible")) {
        card.classList.remove("will-reveal");
        card.classList.add("is-visible");
        animateCounters(card, reducedMotion);
      }
    });
  }, 1200);
}

function animateCounters(scope, reducedMotion) {
  var counters = scope.querySelectorAll(".js-counter");

  counters.forEach(function (counter) {
    if (counter.dataset.counted === "true") {
      return;
    }

    var target = Number(counter.dataset.target || 0);
    var suffix = counter.dataset.suffix || "";
    var duration = 900;
    var startTime = null;

    counter.dataset.counted = "true";

    if (reducedMotion) {
      counter.textContent = String(target) + suffix;
      return;
    }

    function tick(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }

      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(progress * target);
      counter.textContent = String(value) + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        counter.textContent = String(target) + suffix;
      }
    }

    window.requestAnimationFrame(tick);
  });
}

function initReviewModule(reducedMotion) {
  initReviewReveal(reducedMotion);
  initReviewAutoScroll(reducedMotion);
}

function initReviewReveal(reducedMotion) {
  var items = document.querySelectorAll(".js-review-reveal");
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

  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        window.setTimeout(function () {
          el.classList.remove("will-reveal");
          el.classList.add("is-visible");
        }, delay);
        obs.unobserve(el);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  items.forEach(function (item) {
    revealObserver.observe(item);
  });

  window.setTimeout(function () {
    items.forEach(function (item) {
      if (!item.classList.contains("is-visible")) {
        item.classList.remove("will-reveal");
        item.classList.add("is-visible");
      }
    });
  }, 1400);
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

  cards.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.classList.remove("js-review-reveal", "will-reveal");
    clone.classList.add("is-visible");
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  var halfWidth = Math.max(track.scrollWidth / 2, 1);
  var direction = 1;
  var speed = window.innerWidth < 768 ? 0.36 : 0.48;
  var paused = reducedMotion;
  var rafId = null;

  function tick() {
    if (!paused) {
      track.scrollLeft += speed * direction;

      if (track.scrollLeft >= halfWidth) {
        track.scrollLeft -= halfWidth;
      } else if (track.scrollLeft < 0) {
        track.scrollLeft += halfWidth;
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

  if (reducedMotion) {
    return;
  }

  window.addEventListener("blur", pause);
  window.addEventListener("focus", resume);

  if (rafId === null) {
    rafId = window.requestAnimationFrame(tick);
  }
}
