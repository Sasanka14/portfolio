/**
 * Contact Form Handler
 * 
 * Manages form submission and validation for the contact form
 */

document.addEventListener('DOMContentLoaded', function() {
    // Direct EmailJS configuration 
    const emailJsConfig = {
        SERVICE_ID: "service_whapvvi",
        TEMPLATE_ID: "template_56mrn9b"
    };
    
    // Get form elements
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Form inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Field validation function
    function validateField(input, errorMessage) {
        if (!input) return true; // Skip if element not found
        
        const errorElement = input.parentElement.querySelector('.error-message');
        if (!errorElement) return true; // Skip if error element not found
        
        if (input.id === 'email' && input.value && !isValidEmail(input.value)) {
            errorElement.textContent = errorMessage || 'Please enter a valid email address';
            errorElement.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        } else if (input.required && !input.value.trim()) {
            errorElement.textContent = errorMessage || 'This field is required';
            errorElement.classList.remove('hidden');
            input.classList.add('border-red-500');
            return false;
        } else {
            errorElement.classList.add('hidden');
            input.classList.remove('border-red-500');
            return true;
        }
    }
    
    // Add blur event listeners for real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', () => validateField(nameInput, 'Please enter your name'));
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateField(emailInput, 'Please enter a valid email address'));
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', () => validateField(messageInput, 'Please enter your message'));
    }
    
    // Add input event listeners to clear errors as user types
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim()) {
                const errorElement = nameInput.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.classList.add('hidden');
                    nameInput.classList.remove('border-red-500');
                }
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (isValidEmail(emailInput.value)) {
                const errorElement = emailInput.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.classList.add('hidden');
                    emailInput.classList.remove('border-red-500');
                }
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim()) {
                const errorElement = messageInput.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.classList.add('hidden');
                    messageInput.classList.remove('border-red-500');
                }
            }
        });
    }
    
    // Rate limiting to prevent spam
    const RATE_LIMIT_MS = 60000; // 1 minute
    let lastSubmitTime = 0;
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Rate limiting check
        const now = Date.now();
        if (now - lastSubmitTime < RATE_LIMIT_MS) {
            const waitTimeSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
            alert(`Please wait ${waitTimeSeconds} seconds before submitting again.`);
            return false;
        }
        
        // Validate all fields before submission
        const nameValid = validateField(nameInput, 'Please enter your name');
        const emailValid = validateField(emailInput, 'Please enter a valid email address');
        const messageValid = validateField(messageInput, 'Please enter your message');
        
        // Check honeypot field (anti-spam)
        const honeypot = document.getElementById('bot_check');
        if (honeypot && honeypot.value) {
            return false;
        }
        
        // If all validations pass, send the email
        if (nameValid && emailValid && messageValid) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
            `;
            
            // Get subject value - if not visible in the form, use default
            const subjectValue = (subjectInput && subjectInput.value.trim()) ? 
                subjectInput.value.trim() : 
                'New Contact Form Message';
            
            // Form data - Make sure parameter names match exactly what EmailJS template expects
            const formData = {
                user_name: nameInput.value,
                user_email: emailInput.value, 
                from_name: nameInput.value,
                from_email: emailInput.value,
                subject: subjectValue,
                user_subject: subjectValue,
                email_id: emailInput.value,
                message: messageInput.value
            };
            
            // Send email
            emailjs.send(emailJsConfig.SERVICE_ID, emailJsConfig.TEMPLATE_ID, formData)
                .then(function() {
                    // Set rate limit timestamp
                    lastSubmitTime = Date.now();
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Hide form, show success message
                    contactForm.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Send Message</span><i class="fas fa-paper-plane ml-2"></i>`;
                })
                .catch(function(error) {
                    // Show error message
                    errorMessage.classList.remove('hidden');
                    
                    // Add shake animation to error message
                    errorMessage.classList.add('shake');
                    setTimeout(() => {
                        errorMessage.classList.remove('shake');
                    }, 500);
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Try Again</span><i class="fas fa-paper-plane ml-2"></i>`;
                });
        } else {
            // If validation fails, add shake animation to the form
            contactForm.classList.add('shake');
            setTimeout(() => {
                contactForm.classList.remove('shake');
            }, 500);
        }
    });
    
    // Button to try again after error
    const tryAgainBtn = document.querySelector('#error-message button');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            errorMessage.classList.add('hidden');
            contactForm.classList.remove('hidden');
        });
    }
}); 