/* ==========================================================================
   ENDTECH AI SOLUTIONS — validation.js
   Contact form validation (client side). Only active on pages that
   include #contactForm.
   NOTE: Form submission must be wired to a SECURE BACKEND endpoint.
   Never send credentials or API keys from the browser. See the
   TODO placeholder in the submit handler below.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_RE = /^\+?[0-9\s().\-]{7,18}$/;
    var MIN_MESSAGE = 20;

    /* Field rules: [element, validator, errorElementId] */
    var fields = [
      {
        el: document.getElementById("fullName"),
        test: function (v) { return v.trim().length >= 2; },
        msg: "Please enter your full name."
      },
      {
        el: document.getElementById("email"),
        test: function (v) { return EMAIL_RE.test(v.trim()); },
        msg: "Please enter a valid email address."
      },
      {
        el: document.getElementById("phone"),
        test: function (v) { return PHONE_RE.test(v.trim()); },
        msg: "Enter a valid phone number (7–18 digits, e.g. +254 700 000 000)."
      },
      {
        el: document.getElementById("company"),
        test: function () { return true; }, // optional field
        msg: ""
      },
      {
        el: document.getElementById("service"),
        test: function (v) { return v !== ""; },
        msg: "Please select the service you need."
      },
      {
        el: document.getElementById("budget"),
        test: function (v) { return v !== ""; },
        msg: "Please select a budget range."
      },
      {
        el: document.getElementById("message"),
        test: function (v) { return v.trim().length >= MIN_MESSAGE; },
        msg: "Please describe your project (at least " + MIN_MESSAGE + " characters)."
      }
    ];

    function validateField(field) {
      var ok = field.test(field.el.value);
      var feedback = field.el.parentElement.querySelector(".invalid-feedback");
      field.el.classList.toggle("is-invalid", !ok);
      field.el.classList.toggle("is-valid", ok && field.el.value.trim() !== "");
      if (feedback && !ok) feedback.textContent = field.msg;
      return ok;
    }

    // Validate on blur; re-validate live once a field has an error
    fields.forEach(function (field) {
      if (!field.el) return;
      field.el.addEventListener("blur", function () { validateField(field); });
      field.el.addEventListener("input", function () {
        if (field.el.classList.contains("is-invalid")) validateField(field);
      });
      field.el.addEventListener("change", function () {
        if (field.el.tagName === "SELECT") validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (field) {
        if (field.el && !validateField(field)) allValid = false;
      });

      if (!allValid) {
        var firstError = form.querySelector(".is-invalid");
        if (firstError) firstError.focus();
        return;
      }

      /* ---------------------------------------------------------------
         TODO (backend integration): send the payload through a secure
         server endpoint, e.g.:
           fetch("/api/contact", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(payload)
           });
         The backend should sanitize input, rate-limit requests, and
         hold any API keys/secrets. Do NOT call third-party services
         directly from this file.
      --------------------------------------------------------------- */
      var success = document.getElementById("formSuccess");
      var name = document.getElementById("fullName").value.trim();
      if (success) {
        success.querySelector("strong").textContent =
          "Thank you, " + name.split(" ")[0] + ".";
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      form.querySelectorAll(".is-valid, .is-invalid").forEach(function (el) {
        el.classList.remove("is-valid", "is-invalid");
      });
    });
  });
})();
