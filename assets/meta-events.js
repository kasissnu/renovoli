(function () {
  const packageValues = {
    trial: 1000,
    starter: 20000,
    scale: 40000,
    monopoly: 75000
  };

  const packageNames = {
    trial: "15-Day Trial",
    starter: "Starter",
    scale: "Scale",
    monopoly: "Monopoly"
  };

  const pageContent = {
    "": ["Renovoli Home", "Lead generation agency"],
    "index.html": ["Renovoli Home", "Lead generation agency"],
    "interiors.html": ["Interior Designers & Architects", "Industry landing page"],
    "photography.html": ["Wedding Photographers", "Industry landing page"],
    "video.html": ["Lead Funnel Video", "Funnel proof"],
    "packages.html": ["Renovoli Packages", "Pricing"]
  };

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function getPageName() {
    return window.location.pathname.split("/").pop();
  }

  function getIndustry() {
    return getParams().get("industry") || "general";
  }

  function getPackageKey() {
    return getParams().get("package") || "scale";
  }

  function getPackagePayload(packageKey) {
    const key = packageKey || getPackageKey();
    const payload = {
      content_name: packageNames[key] || packageNames.scale,
      content_category: getIndustry(),
      contents: [{ id: key, quantity: 1 }],
      currency: "INR"
    };

    if (packageValues[key]) {
      payload.value = packageValues[key];
    }

    return payload;
  }

  function track(eventName, payload) {
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, payload || {});
    }
  }

  window.RenovoliMeta = {
    track,
    getPackagePayload
  };

  document.addEventListener("DOMContentLoaded", function () {
    const page = getPageName();
    const content = pageContent[page];

    if (content) {
      track("ViewContent", {
        content_name: content[0],
        content_category: content[1],
        industry: getIndustry()
      });
    }

    if (page === "payment.html") {
      track("InitiateCheckout", getPackagePayload());
    }

    if (page === "confirmation.html") {
      const packageKey = getPackageKey();
      const packagePayload = getPackagePayload(packageKey);

      track("Purchase", packagePayload);

      if (packageKey === "trial") {
        track("StartTrial", packagePayload);
      } else {
        track("Subscribe", packagePayload);
      }
    }

    document.querySelectorAll("a[href^='payment.html']").forEach(function (link) {
      link.addEventListener("click", function () {
        const url = new URL(link.href, window.location.href);
        track("InitiateCheckout", getPackagePayload(url.searchParams.get("package") || "trial"));
      });
    });

    document.querySelectorAll("a[href^='https://wa.me/']").forEach(function (link) {
      link.addEventListener("click", function () {
        track("Contact", {
          content_name: "WhatsApp onboarding contact",
          content_category: getIndustry()
        });
      });
    });
  });
})();
