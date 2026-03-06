document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#enquiry-form");
  if (!form) {
    return;
  }

  var isLocalDev = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

  // Local static servers usually reject POST to HTML files (405).
  // For local preview only, validate and then redirect to the thank-you page.
  if (form.hasAttribute("data-netlify") && isLocalDev) {
    form.addEventListener("submit", function (event) {
      var isValid = form.checkValidity();
      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      event.preventDefault();
      var successUrl = form.getAttribute("action") || "/thank-you.html";
      window.location.assign(successUrl);
    });
    return;
  }

  // Netlify form submissions should post normally without JS interception.
  if (form.hasAttribute("data-netlify")) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    var isValid = form.checkValidity();
    if (!isValid) {
      form.classList.add("was-validated");
      return;
    }

    var payload = {
      id: "enquiry_" + Date.now(),
      submittedAt: new Date().toISOString(),
      parentName: getFieldValue(form, "parentName"),
      studentName: getFieldValue(form, "studentName"),
      level: getFieldValue(form, "level"),
      subject: getFieldValue(form, "subject"),
      contactNumber: getFieldValue(form, "contactNumber"),
      email: getFieldValue(form, "email"),
      preferredSlot: getFieldValue(form, "preferredSlot"),
      message: getFieldValue(form, "message")
    };

    var saved = [];
    try {
      saved = JSON.parse(localStorage.getItem("tlc_enquiries") || "[]");
    } catch (error) {
      saved = [];
    }

    saved.push(payload);
    localStorage.setItem("tlc_enquiries", JSON.stringify(saved));

    form.reset();
    form.classList.remove("was-validated");

    if (typeof showSiteToast === "function") {
      showSiteToast("Thank you. Your enquiry has been received.");
    }

    var successPanel = document.querySelector(".js-contact-success");
    if (successPanel) {
      successPanel.classList.remove("d-none");
      window.setTimeout(function () {
        successPanel.classList.add("d-none");
      }, 3600);
    }
  });
});

function getFieldValue(form, name) {
  var field = form.elements[name];
  return field && typeof field.value === "string" ? field.value.trim() : "";
}
