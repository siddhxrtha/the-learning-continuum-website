document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#enquiry-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Form submitted");

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      form.reportValidity();
      return;
    }

    var message = [
      "New Enquiry from Website",
      "",
      "Parent Name: " + getFieldValue("parentName"),
      "Student Name: " + getFieldValue("studentName"),
      "Level: " + getFieldValue("level"),
      "Subject Interest: " + getFieldValue("subject"),
      "Contact Number: " + getFieldValue("contactNumber"),
      "Email: " + getFieldValue("email"),
      "Message: " + (getFieldValue("message") || "-")
    ].join("\n");

    var whatsappUrl = "https://wa.me/6589103647?text=" + encodeURIComponent(message);
    console.log(whatsappUrl);
    window.open(whatsappUrl, "_blank");
  });
});

function getFieldValue(id) {
  var field = document.getElementById(id);
  return field && typeof field.value === "string" ? field.value.trim() : "";
}
