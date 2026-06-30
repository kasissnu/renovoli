(function () {
  const config = {
    optinEndpoint: "",
    videoEmbedUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
    calendlyUrl: "https://calendly.com/YOUR_HANDLE/discovery-call"
  };

  // Drop in real YouTube video IDs here as you get them.
  // Each entry: { id: "<youtube_video_id>", name: "Person Name", company: "Company" }
  const testimonials = [
    { id: "", name: "Milind", company: "Catalys" },
    { id: "", name: "Aaun", company: "Crafted Influence" },
    { id: "", name: "Siddhant", company: "Persona Studios" },
    { id: "", name: "Nilanjan", company: "Outland Circle" },
    { id: "", name: "Joshua", company: "Performance Pilots" },
    { id: "", name: "Shriti", company: "AndAnother" }
  ];

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

  function hasTrackedScheduleConversion() {
    try {
      return window.sessionStorage.getItem("renovoliScheduleConversionTracked") === "1";
    } catch (err) {
      return false;
    }
  }

  function markScheduleConversionTracked() {
    try {
      window.sessionStorage.setItem("renovoliScheduleConversionTracked", "1");
    } catch (err) {}
  }

  function serializeForm(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function getFormField(form, name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function getFieldWrapper(input) {
    return input ? input.closest(".field") : null;
  }

  function getFieldErrorNode(input) {
    const wrapper = getFieldWrapper(input);
    if (!wrapper) return null;

    let errorNode = wrapper.querySelector(".field-error");
    if (errorNode) return errorNode;

    errorNode = document.createElement("div");
    errorNode.className = "field-error";
    errorNode.id = input.name + "-error";
    wrapper.appendChild(errorNode);
    return errorNode;
  }

  function setFieldError(input, message) {
    const errorNode = getFieldErrorNode(input);
    if (!errorNode || !input) return;

    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errorNode.id);
      errorNode.textContent = message;
      errorNode.hidden = false;
      return;
    }

    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    errorNode.textContent = "";
    errorNode.hidden = true;
  }

  function validateName(input) {
    if (!input) return true;

    const value = input.value.replace(/\s+/g, " ").trim();
    input.value = value;

    if (!value) {
      setFieldError(input, "Enter your name.");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(value)) {
      setFieldError(input, "Use letters and spaces only.");
      return false;
    }

    setFieldError(input, "");
    return true;
  }

  function validateEmail(input) {
    if (!input) return true;

    input.value = input.value.trim();

    if (!input.value) {
      setFieldError(input, "Enter your email address.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      setFieldError(input, "Enter a valid email address.");
      return false;
    }

    setFieldError(input, "");
    return true;
  }

  function normalizePhone(input) {
    if (!input) return;
    input.value = input.value.replace(/\D+/g, "");
  }

  function validatePhone(input) {
    if (!input) return true;

    normalizePhone(input);

    if (!input.value) {
      setFieldError(input, "Enter a 10-digit phone number.");
      return false;
    }

    if (!/^\d{10}$/.test(input.value)) {
      setFieldError(input, "Phone number must be exactly 10 digits.");
      return false;
    }

    setFieldError(input, "");
    return true;
  }

  function validateFormFields(form) {
    const nameInput = getFormField(form, "name");
    const emailInput = getFormField(form, "email");
    const phoneInput = getFormField(form, "phone");

    const isNameValid = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isPhoneValid = validatePhone(phoneInput);

    return isNameValid && isEmailValid && isPhoneValid;
  }

  function bindFieldValidation(input, validate) {
    if (!input) return;

    input.addEventListener("input", function () {
      if (input.dataset.touched === "true") {
        validate(input);
      } else if (!input.value) {
        setFieldError(input, "");
      }
    });

    input.addEventListener("blur", function () {
      input.dataset.touched = "true";
      validate(input);
    });
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

    if (!config.videoEmbedUrl || config.videoEmbedUrl.includes("YOUR_VIDEO_ID")) {
      frame.innerHTML = '<div class="video-placeholder video-placeholder--embed"><span class="media-kicker">Video embed</span><strong>Add your Loom, YouTube, or Vimeo iframe here</strong><p>This block is styled to match the embedded player in your reference. Add the embed URL in assets/funnel.js.</p><div class="video-play">▶</div></div>';
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

  function renderCalendly() {
    const frame = document.querySelector("[data-calendly-frame]");
    if (!frame) return;

    if (!config.calendlyUrl || config.calendlyUrl.includes("YOUR_HANDLE")) {
      frame.innerHTML = '<div class="visual-placeholder calendly-placeholder"><div><h3>Calendly goes here</h3><p>Add your Calendly URL in <code>assets/funnel.js</code> to show the live booking calendar.</p></div></div>';
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = config.calendlyUrl;
    iframe.title = "Schedule a strategy call";
    iframe.frameBorder = "0";
    frame.innerHTML = "";
    frame.appendChild(iframe);
  }

  function renderTestimonials() {
    const grid = document.querySelector("[data-testimonial-grid]");
    if (!grid) return;

    grid.innerHTML = testimonials
      .map(function (t) {
        const hasVideo = t.id && t.id.trim().length > 0;
        const thumb = hasVideo
          ? '<img src="https://img.youtube.com/vi/' + t.id + '/hqdefault.jpg" alt="' + t.name + ' testimonial" loading="lazy" />'
          : '<div class="testimonial-empty"><span>Add video ID</span></div>';
        const link = hasVideo
          ? '<a class="testimonial-thumb" href="https://www.youtube.com/watch?v=' + t.id + '" target="_blank" rel="noopener" aria-label="Watch ' + t.name + ' testimonial">' + thumb + '<span class="play-badge">&#9658;</span></a>'
          : '<div class="testimonial-thumb">' + thumb + '</div>';

        return (
          '<div class="testimonial-card">' +
            link +
            '<div class="testimonial-caption">' + t.name + ' - ' + t.company + '</div>' +
          '</div>'
        );
      })
      .join("");
  }

  function personalizeGreeting() {
    const target = document.querySelector("[data-firstname-slot]");
    if (!target) return;

    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKeys.optin) || "null");
      if (stored && stored.name) {
        const firstName = stored.name.split(" ")[0];
        target.textContent = firstName;
        const wrapper = document.querySelector("[data-firstname-wrapper]");
        if (wrapper) wrapper.hidden = false;
      }
    } catch (err) {
      // No stored opt-in yet, leave default copy as-is.
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderVideo();
    renderCalendly();
    renderTestimonials();
    personalizeGreeting();

    if (getPageName() === "thank-you" && getParams().get("scheduled") === "1" && !hasTrackedScheduleConversion()) {
      track("Schedule", {
        content_name: "Interior designer strategy call",
        content_category: "Interior Designers & Architects"
      });
      markScheduleConversionTracked();
    }

    document.querySelectorAll("[data-calendly-link]").forEach(function (link) {
      link.href = "/schedule";
      link.addEventListener("click", function () {
        track("InitiateCheckout", {
          content_name: "Interior designer strategy call",
          content_category: "Interior Designers & Architects"
        });
      });
    });

    const optinForm = document.querySelector("[data-optin-form]");
    if (optinForm) {
      optinForm.noValidate = true;
      const nameInput = getFormField(optinForm, "name");
      const emailInput = getFormField(optinForm, "email");
      const phoneInput = getFormField(optinForm, "phone");

      bindFieldValidation(nameInput, validateName);
      bindFieldValidation(emailInput, validateEmail);
      bindFieldValidation(phoneInput, validatePhone);

      optinForm.addEventListener("submit", function (event) {
        event.preventDefault();

        [nameInput, emailInput, phoneInput].forEach(function (input) {
          if (input) input.dataset.touched = "true";
        });

        if (!validateFormFields(optinForm)) {
          return;
        }

        const data = serializeForm(optinForm);

        window.localStorage.setItem(storageKeys.optin, JSON.stringify(data));
        track("Lead", {
          content_name: "Interior designer training opt-in",
          content_category: "Interior Designers & Architects"
        });

        postIfConfigured(config.optinEndpoint, data).finally(function () {
          window.location.href = "/vsl";
        });
      });
    }

    const scheduleForm = document.querySelector("[data-schedule-form]");
    if (scheduleForm) {
      scheduleForm.noValidate = true;
      const note = document.querySelector("[data-schedule-note]");
      const nameInput = getFormField(scheduleForm, "name");
      const emailInput = getFormField(scheduleForm, "email");
      const phoneInput = getFormField(scheduleForm, "phone");

      bindFieldValidation(nameInput, validateName);
      bindFieldValidation(emailInput, validateEmail);
      bindFieldValidation(phoneInput, validatePhone);

      scheduleForm.addEventListener("submit", function (event) {
        event.preventDefault();

        [nameInput, emailInput, phoneInput].forEach(function (input) {
          if (input) input.dataset.touched = "true";
        });

        if (!validateFormFields(scheduleForm)) {
          return;
        }

        const data = serializeForm(scheduleForm);

        window.localStorage.setItem(storageKeys.schedule, JSON.stringify(data));
        track("Lead", {
          content_name: "Interior designer schedule request",
          content_category: "Interior Designers & Architects"
        });

        if (note) {
          note.style.display = "block";
          note.textContent = "Request saved. Scroll down to pick a time on the calendar below.";
        }

        const calendlySection = document.querySelector("[data-calendly-frame]");
        if (calendlySection) {
          calendlySection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  });
})();
