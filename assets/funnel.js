(function () {
  const config = {
    optinEndpoint: "",
    videoEmbedUrl: "",
    calendlyUrl: ""
  };

  const storageKeys = {
    optin: "renovoliInteriorOptin",
    schedule: "renovoliInteriorSchedule"
  };

  function track(eventName, payload) {
    if (window.RenovoliMeta && typeof window.RenovoliMeta.track === "function") {
      window.RenovoliMeta.track(eventName, payload || {});
      return;
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, payload || {});
    }
  }

  function serializeForm(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function postIfConfigured(endpoint, data) {
    if (!endpoint) return Promise.resolve();

    return fetch(endpoint, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
  }

  function renderVideo() {
    const frame = document.querySelector("[data-video-frame]");
    if (!frame) return;

    if (!config.videoEmbedUrl) {
      frame.innerHTML = '<div class="visual-placeholder"><div><h3>VSL goes here</h3><p>Add the YouTube, Vimeo or Loom embed URL in <code>assets/funnel.js</code>.</p></div></div>';
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = config.videoEmbedUrl;
    iframe.title = "Interior designer lead generation training";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    frame.innerHTML = "";
    frame.appendChild(iframe);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderVideo();

    document.querySelectorAll("[data-calendly-link]").forEach(function (link) {
      if (config.calendlyUrl) {
        link.href = config.calendlyUrl;
      }

      link.addEventListener("click", function () {
        track("Schedule", {
          content_name: "Interior designer strategy call",
          content_category: "Interior Designers & Architects"
        });
      });
    });

    const optinForm = document.querySelector("[data-optin-form]");
    if (optinForm) {
      optinForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const data = serializeForm(optinForm);

        window.localStorage.setItem(storageKeys.optin, JSON.stringify(data));
        track("Lead", {
          content_name: "Interior designer training opt-in",
          content_category: "Interior Designers & Architects"
        });

        postIfConfigured(config.optinEndpoint, data).finally(function () {
          window.location.href = "interior-designers-training.html";
        });
      });
    }

    const scheduleForm = document.querySelector("[data-schedule-form]");
    if (scheduleForm) {
      const note = document.querySelector("[data-schedule-note]");

      scheduleForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const data = serializeForm(scheduleForm);

        window.localStorage.setItem(storageKeys.schedule, JSON.stringify(data));
        track("Lead", {
          content_name: "Interior designer schedule request",
          content_category: "Interior Designers & Architects"
        });

        if (config.calendlyUrl) {
          window.location.href = config.calendlyUrl;
          return;
        }

        if (note) {
          note.style.display = "block";
          note.textContent = "Request saved. Add the Calendly URL in assets/funnel.js to send people directly to booking.";
        }
      });
    }
  });
})();
