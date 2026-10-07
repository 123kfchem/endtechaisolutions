/*
==========================================================================
ENDTECH AI SOLUTIONS
validation.js

Contact form validation + EmailJS submission + Customer Auto Reply
==========================================================================
*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    // Stop if the contact form does not exist on this page
    if (!form) return;

    /*EMAILJS CONFIGURATION*/

    const EMAILJS_PUBLIC_KEY = "iLZY9nKjxw8HCOE-9";

    const SERVICE_ID = "service_1b2nyny";

  
    const ADMIN_TEMPLATE_ID = "template_98rb4sb";

  
    const AUTO_REPLY_TEMPLATE_ID = "template_xar6t9h";


    

    if (typeof emailjs !== "undefined") {

        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

    }


    /*FORM ELEMENTS */
   

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    const successMessage = document.getElementById(
        "formSuccess"
    );

    const errorMessage = document.getElementById(
        "formError"
    );


    const fields = {

        fullName: document.getElementById("fullName"),

        email: document.getElementById("email"),

        phone: document.getElementById("phone"),

        company: document.getElementById("company"),

        service: document.getElementById("service"),

        budget: document.getElementById("budget"),

        message: document.getElementById("message")

    };


    /*
    ------------------------------------------------------------------------
    VALIDATION RULES
    ------------------------------------------------------------------------
    */

    const EMAIL_REGEX =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const PHONE_REGEX =
        /^\+?[0-9\s().-]{7,18}$/;

    const MIN_MESSAGE_LENGTH = 20;


    /*
    ------------------------------------------------------------------------
    VALIDATE INDIVIDUAL FIELD
    ------------------------------------------------------------------------
    */

    function validateField(field, message) {

        if (!field) return true;

        const value = field.value.trim();

        const feedback =
            field.parentElement &&
            field.parentElement.querySelector(
                ".invalid-feedback"
            );

        let valid = true;


        // Required field
        if (
            field.hasAttribute("required") &&
            value === ""
        ) {

            valid = false;

        }


        // Email validation
        if (
            valid &&
            field === fields.email &&
            !EMAIL_REGEX.test(value)
        ) {

            valid = false;

        }


        // Phone validation
        if (
            valid &&
            field === fields.phone &&
            !PHONE_REGEX.test(value)
        ) {

            valid = false;

        }


        // Service and budget
        if (
            valid &&
            (
                field === fields.service ||
                field === fields.budget
            ) &&
            value === ""
        ) {

            valid = false;

        }


        // Message length
        if (
            valid &&
            field === fields.message &&
            value.length < MIN_MESSAGE_LENGTH
        ) {

            valid = false;

        }


        // Update visual state
        field.classList.toggle(
            "is-invalid",
            !valid
        );

        field.classList.toggle(
            "is-valid",
            valid && value !== ""
        );


        if (!valid && feedback) {

            feedback.textContent = message;

        }


        return valid;

    }


    /*
    ------------------------------------------------------------------------
    VALIDATION MESSAGES
    ------------------------------------------------------------------------
    */

    const validationMessages = {

        fullName:
            "Please enter your full name.",

        email:
            "Please enter a valid email address.",

        phone:
            "Enter a valid phone number, e.g. +254 700 000 000.",

        service:
            "Please select the service you need.",

        budget:
            "Please select a budget range.",

        message:
            "Please describe your project using at least " +
            MIN_MESSAGE_LENGTH +
            " characters."

    };


    /*
    ------------------------------------------------------------------------
    VALIDATE ALL FIELDS
    ------------------------------------------------------------------------
    */

    function validateForm() {

        let formIsValid = true;


        Object.keys(validationMessages).forEach(
            (fieldName) => {

                const field =
                    fields[fieldName];

                const valid =
                    validateField(
                        field,
                        validationMessages[fieldName]
                    );

                if (!valid) {

                    formIsValid = false;

                }

            }
        );


        return formIsValid;

    }


    /*
    ------------------------------------------------------------------------
    LIVE VALIDATION
    ------------------------------------------------------------------------
    */

    Object.keys(fields).forEach(
        (fieldName) => {

            const field =
                fields[fieldName];

            if (!field) return;


            field.addEventListener(
                "blur",
                () => {

                    if (
                        validationMessages[fieldName]
                    ) {

                        validateField(
                            field,
                            validationMessages[fieldName]
                        );

                    }

                }
            );


            field.addEventListener(
                "input",
                () => {

                    if (
                        field.classList.contains(
                            "is-invalid"
                        )
                    ) {

                        validateField(
                            field,
                            validationMessages[fieldName]
                        );

                    }

                }
            );


            field.addEventListener(
                "change",
                () => {

                    if (
                        validationMessages[fieldName]
                    ) {

                        validateField(
                            field,
                            validationMessages[fieldName]
                        );

                    }

                }
            );

        }
    );


    /*
    ------------------------------------------------------------------------
    SHOW SUCCESS MESSAGE
    ------------------------------------------------------------------------
    */

    function showSuccessMessage() {

        if (!successMessage) return;


        const firstName =
            fields.fullName.value
                .trim()
                .split(" ")[0];


        successMessage.innerHTML =
            "<strong>Thank you, " +
            firstName +
            ".</strong> " +
            "Your message has been sent successfully. " +
            "An ENDTECH engineer will reach out shortly.";


        if (errorMessage) {

            errorMessage.hidden = true;

            errorMessage.textContent = "";

            errorMessage.classList.remove(
                "show"
            );

        }


        successMessage.style.display =
            "block";

        successMessage.classList.add(
            "show"
        );


        successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /*
    ------------------------------------------------------------------------
    SHOW ERROR MESSAGE
    ------------------------------------------------------------------------
    */

    function showErrorMessage(message) {

        if (!errorMessage) return;


        errorMessage.textContent =
            message ||
            "We couldn't send your message right now. Please try again or contact ENDTECH directly.";


        errorMessage.hidden = false;

        errorMessage.classList.add(
            "show"
        );


        errorMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /*
    ------------------------------------------------------------------------
    RESET FORM STYLES
    ------------------------------------------------------------------------
    */

    function resetValidation() {

        form.querySelectorAll(
            ".is-valid, .is-invalid"
        ).forEach(
            (field) => {

                field.classList.remove(
                    "is-valid",
                    "is-invalid"
                );

            }
        );

    }


    /*
    ------------------------------------------------------------------------
    SET SUBMIT BUTTON STATE
    ------------------------------------------------------------------------
    */

    function setSendingState(isSending) {

        if (!submitButton) return;


        submitButton.disabled =
            isSending;


        submitButton.innerHTML =
            isSending
                ? `
                    Sending...
                    <i class="bi bi-arrow-repeat"></i>
                  `
                : `
                    Send Message
                    <i class="bi bi-send"></i>
                  `;

    }


    /*
    ------------------------------------------------------------------------
    FORM SUBMISSION
    ------------------------------------------------------------------------
    */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /*
            Validate form
            */

            if (!validateForm()) {

                const firstError =
                    form.querySelector(
                        ".is-invalid"
                    );


                if (firstError) {

                    firstError.focus();

                }


                return;

            }


            setSendingState(true);


            try {

                /*
                ------------------------------------------------------------
                CHECK EMAILJS
                ------------------------------------------------------------
                */

                if (
                    typeof emailjs === "undefined"
                ) {

                    throw new Error(
                        "EmailJS is not loaded."
                    );

                }


                /*
                ------------------------------------------------------------
                CHECK AUTO-REPLY TEMPLATE
                ------------------------------------------------------------
                */

                if (
                    AUTO_REPLY_TEMPLATE_ID ===
                    "PASTE_AUTO_REPLY_TEMPLATE_ID_HERE"
                ) {

                    throw new Error(
                        "Auto-reply template ID has not been added."
                    );

                }


                /*
                ------------------------------------------------------------
                SEND BOTH EMAILS
                ------------------------------------------------------------

                1. ENDTECH receives the inquiry
                2. Customer receives automatic confirmation
                */

                await Promise.all([

                    emailjs.sendForm(
                        SERVICE_ID,
                        ADMIN_TEMPLATE_ID,
                        form
                    ),

                    emailjs.sendForm(
                        SERVICE_ID,
                        AUTO_REPLY_TEMPLATE_ID,
                        form
                    )

                ]);


                /*
                ------------------------------------------------------------
                SUCCESS
                ------------------------------------------------------------
                */

                console.log(
                    "Inquiry and auto-reply sent successfully."
                );


                showSuccessMessage();


                /*
                Reset form
                */

                form.reset();

                resetValidation();

            }


            catch (error) {

                console.error(
                    "EmailJS error:",
                    error
                );


                showErrorMessage(
                    "We couldn't send your message right now. Please try again or contact ENDTECH directly."
                );

            }


            finally {

                setSendingState(false);

            }

        }
    );

});