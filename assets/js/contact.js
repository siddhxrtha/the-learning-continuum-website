document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#enquiry-form");
  if (!form) {
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
