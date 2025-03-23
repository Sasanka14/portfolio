# Setting Up EmailJS for Your Contact Form

This documentation will guide you through setting up EmailJS to enable the contact form on your portfolio website to send emails directly to your Gmail account.

## 1. Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and sign up for a free account
2. The free tier allows 200 emails per month, which is sufficient for most portfolio sites

## 2. Connect Your Email Service

1. In the EmailJS dashboard, go to "Email Services" 
2. Click "Add New Service"
3. Select "Gmail" as your service provider
4. Follow the authentication steps to connect your Gmail account
5. Name your service (e.g., "portfolio_gmail")
6. Note down the Service ID (e.g., "service_xxxxxxx")

## 3. Create an Email Template

1. In the EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Design your email template with the following variables:
   - `{{user_name}}` - The name provided in the contact form
   - `{{user_email}}` - The email provided in the contact form
   - `{{subject}}` - The subject of the email
   - `{{message}}` - The message from the contact form
4. Save your template and note down the Template ID (e.g., "template_xxxxxxx")

## 4. Update Environment Variables

The contact form uses a secure environment variables system managed through the env-manager.js file.

Your EmailJS credentials have already been configured in the env-manager.js file:
```javascript
const _serviceIds = {
    EMAIL_JS: {
        PUBLIC_KEY: "***", // Your EmailJS public key
        SERVICE_ID: "***", // Your EmailJS service ID
        TEMPLATE_ID: "***" // Your EmailJS template ID
    }
};
```

## 5. Understanding the Environment System

The portfolio now uses a more secure approach for managing environment variables:

1. **Environment Manager**: The `env-manager.js` file contains all environment variables in a single location
2. **Secure Access**: Variables are accessed through the `ENV.get()` method rather than directly
3. **Fallback System**: The contact form will work only when the environment manager is properly loaded
4. **Validation**: The form validation utility checks that all environment variables are properly set

This approach follows current best practices for client-side environmental variables, providing an appropriate level of security while maintaining functionality.

## 6. Testing the Contact Form

1. Open your portfolio website
2. Fill out the contact form with test information
3. Submit the form
4. You should receive the email at your connected Gmail account
5. The sender should see a success message on the website

## Troubleshooting

If you encounter issues:

1. Open browser DevTools (F12) and check the console for any errors
2. Use the validation utility which automatically checks all components
3. Verify that the environment variables match your EmailJS account details
4. Ensure your EmailJS service is active and connected properly
5. Check your spam folder if you don't receive test emails

## Security Considerations

- The environment variable system uses closure-based encapsulation to protect keys
- EmailJS has built-in security measures to prevent abuse of public keys
- There is rate limiting built into the contact form to prevent spam (one submission per minute)
- The form includes a honeypot field to help catch bot submissions

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS SDK Reference](https://www.emailjs.com/docs/sdk/installation/) 