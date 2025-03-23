import { newsletterService } from './newsletter-service.js';

/**
 * Newsletter Form Handler
 * Handles the newsletter subscription form submissions
 */
document.addEventListener('DOMContentLoaded', () => {
    // Get all newsletter forms on the page
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    if (newsletterForms.length === 0) return;
    
    // Initialize each form
    newsletterForms.forEach(form => {
        initNewsletterForm(form);
    });
});

/**
 * Initialize a newsletter subscription form
 * @param {HTMLFormElement} form - The form element to initialize
 */
function initNewsletterForm(form) {
    // Clear existing event listeners (in case this is called multiple times)
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    form = newForm;
    
    // Get element references
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const interestCheckboxes = form.querySelectorAll('input[type="checkbox"][name^="interest-"]');
    const responseMessage = form.querySelector('.newsletter-response') || createResponseElement(form);
    
    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Validate form
        if (!emailInput || !emailInput.value) {
            showFormMessage(responseMessage, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable form during submission
        setFormState(form, true);
        
        // Collect interests from checkboxes
        const interests = {};
        interestCheckboxes.forEach(checkbox => {
            const category = checkbox.name.replace('interest-', '');
            interests[category] = checkbox.checked;
        });
        
        // Default to general interest if none selected
        if (interestCheckboxes.length > 0 && Object.values(interests).every(v => !v)) {
            interests.general = true;
        }
        
        try {
            // Add subscriber
            const result = newsletterService.addSubscriber(emailInput.value, interests);
            
            if (result) {
                // Show success message
                showFormMessage(responseMessage, 'Thank you for subscribing!', 'success');
                
                // Reset form
                form.reset();
            } else {
                showFormMessage(responseMessage, 'There was an error with your subscription. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showFormMessage(responseMessage, 'An unexpected error occurred. Please try again later.', 'error');
        } finally {
            // Re-enable form
            setFormState(form, false);
        }
    });
    
    // Simple client-side validation
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            validateEmail(emailInput);
        });
    }
}

/**
 * Create a response message element if it doesn't exist
 * @param {HTMLFormElement} form - The form element
 * @returns {HTMLElement} - The response message element
 */
function createResponseElement(form) {
    const responseElement = document.createElement('div');
    responseElement.className = 'newsletter-response mt-3 text-sm hidden';
    form.appendChild(responseElement);
    return responseElement;
}

/**
 * Display a message in the form
 * @param {HTMLElement} element - The element to show the message in
 * @param {string} message - The message to display
 * @param {string} type - Message type (success, error)
 */
function showFormMessage(element, message, type = 'info') {
    // Set message
    element.textContent = message;
    
    // Set appropriate classes
    element.className = `newsletter-response mt-3 text-sm ${
        type === 'success' ? 'text-green-400' :
        type === 'error' ? 'text-red-400' :
        'text-gray-400'
    }`;
    
    // Ensure it's visible
    element.classList.remove('hidden');
    
    // Hide after some time for success messages
    if (type === 'success') {
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Set the form's enabled/disabled state
 * @param {HTMLFormElement} form - The form element
 * @param {boolean} isLoading - Whether the form is in loading state
 */
function setFormState(form, isLoading) {
    const inputs = form.querySelectorAll('input, button, select, textarea');
    inputs.forEach(input => {
        input.disabled = isLoading;
    });
    
    // Find submit button and update its text/state
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        if (isLoading) {
            submitButton.dataset.originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Subscribing...';
        } else if (submitButton.dataset.originalText) {
            submitButton.innerHTML = submitButton.dataset.originalText;
        }
    }
}

/**
 * Validate an email input field
 * @param {HTMLInputElement} input - The email input element
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    // Add/remove validation classes
    if (input.value) {
        if (isValid) {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500');
        } else {
            input.classList.remove('border-green-500');
            input.classList.add('border-red-500');
        }
    } else {
        input.classList.remove('border-red-500', 'border-green-500');
    }
    
    return isValid;
} 