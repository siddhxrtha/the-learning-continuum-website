if (!customElements.get("site-video-section")) {
  customElements.define(
    "site-video-section",
    class extends HTMLElement {
      connectedCallback() {
        if (this.querySelector(".video-section")) {
          return;
        }

        this.innerHTML = `
          <section class="section-space video-section" aria-labelledby="video-section-title">
            <div class="container text-center">
              <div class="mb-4 mb-lg-5">
                <h2 id="video-section-title" class="fw-bold mb-0">Inside The Learning Continuum</h2>
              </div>
              <a
                class="video-frame"
                href="https://youtube.com/shorts/_gioFic1SDo?is=44l-s13kjOUnjTn8"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch Inside The Learning Continuum on YouTube (opens in a new tab)"
              >
                <img
                  src="assets/images/learning-continuum-video.jpg"
                  alt=""
                  width="1280"
                  height="720"
                  loading="lazy"
                />
                <span class="video-play" aria-hidden="true"><i class="bi bi-play-fill"></i></span>
              </a>
              <p class="mt-4 mb-0">
                <a href="https://youtube.com/shorts/_gioFic1SDo?is=44l-s13kjOUnjTn8" target="_blank" rel="noopener noreferrer">Watch on YouTube<span class="visually-hidden"> (opens in a new tab)</span></a>
              </p>
            </div>
          </section>
        `;

        const title = this.querySelector("#video-section-title");
        if (this.dataset.title) {
          title.textContent = this.dataset.title;
          this.querySelector(".video-frame").setAttribute(
            "aria-label",
            `Watch ${this.dataset.title} on YouTube (opens in a new tab)`
          );
        }

        if (this.dataset.subtitle) {
          const subtitle = document.createElement("p");
          subtitle.className = "programmes-subtitle mt-2 mb-0";
          subtitle.textContent = this.dataset.subtitle;
          title.after(subtitle);
        }
      }
    }
  );
}
