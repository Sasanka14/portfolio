import { Subscriber } from './newsletter-subscriber-model.js';

/**
 * Newsletter Service
 * Handles newsletter subscription management and sending
 */
export class NewsletterService {
    constructor() {
        this.subscribers = [];
        this.STORAGE_KEY = 'newsletter_subscribers';
        this.loadSubscribers();
    }

    /**
     * Load subscribers from local storage
     */
    loadSubscribers() {
        try {
            const storedData = localStorage.getItem(this.STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                this.subscribers = parsedData.map(data => Subscriber.fromJSON(data));
            }
        } catch (error) {
            console.error('Error loading subscribers:', error);
            this.subscribers = [];
        }
    }

    /**
     * Save subscribers to local storage
     */
    saveSubscribers() {
        try {
            const data = this.subscribers.map(subscriber => subscriber.toJSON());
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving subscribers:', error);
        }
    }

    /**
     * Add a new subscriber or update existing one
     * @param {string} email - Subscriber email
     * @param {Object} interests - Interest preferences
     * @returns {boolean} - Success status
     */
    addSubscriber(email, interests = {}) {
        if (!email || !this.validateEmail(email)) {
            console.error('Invalid email provided');
            return false;
        }

        // Check if subscriber already exists
        const existingIndex = this.subscribers.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
        
        if (existingIndex >= 0) {
            // Update existing subscriber
            const existing = this.subscribers[existingIndex];
            existing.updateInterests(interests);
            existing.setActive(true); // Re-activate if previously unsubscribed
            this.subscribers[existingIndex] = existing;
        } else {
            // Add new subscriber
            const newSubscriber = new Subscriber(email, interests);
            this.subscribers.push(newSubscriber);
        }

        this.saveSubscribers();
        this.notifyAdmin(email, interests);
        return true;
    }

    /**
     * Unsubscribe a user
     * @param {string} email - Subscriber email
     * @returns {boolean} - Success status
     */
    unsubscribe(email) {
        const index = this.subscribers.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
        
        if (index >= 0) {
            // Mark as inactive rather than removing
            this.subscribers[index].setActive(false);
            this.saveSubscribers();
            return true;
        }
        
        return false;
    }

    /**
     * Get all active subscribers
     * @returns {Array} - List of active subscribers
     */
    getActiveSubscribers() {
        return this.subscribers.filter(subscriber => subscriber.active);
    }

    /**
     * Get subscribers interested in a specific category
     * @param {string} category - Category to filter by
     * @returns {Array} - List of matching subscribers
     */
    getSubscribersByInterest(category) {
        if (!category) return this.getActiveSubscribers();
        
        return this.getActiveSubscribers()
            .filter(subscriber => subscriber.isInterestedIn(category) || subscriber.isInterestedIn('general'));
    }

    /**
     * Notify admin about new subscriber
     * @param {string} email - New subscriber email
     * @param {Object} interests - Subscriber interests
     */
    notifyAdmin(email, interests) {
        // In a real implementation, this would send an email to the admin
        console.log(`New subscriber: ${email}`, interests);
        
        // Placeholder for EmailJS or other notification system
        // emailjs.send('service_id', 'template_id', {
        //     to_email: 'admin@example.com',
        //     subscriber_email: email,
        //     subscriber_interests: JSON.stringify(interests)
        // });
    }

    /**
     * Send newsletter about a new blog post
     * @param {Object} postData - Blog post data
     * @returns {Object} - Result of the operation
     */
    sendBlogNewsletter(postData) {
        if (!postData || !postData.category) {
            return { success: false, error: 'Invalid post data' };
        }

        const category = postData.category;
        const interestedSubscribers = this.getSubscribersByInterest(category);
        
        if (interestedSubscribers.length === 0) {
            return { 
                success: true, 
                message: 'No subscribers interested in this category',
                sent: 0
            };
        }

        // In a real implementation, this would send actual emails
        console.log(`Sending ${category} newsletter to ${interestedSubscribers.length} subscribers`);
        
        // Simulate sending emails
        interestedSubscribers.forEach(subscriber => {
            console.log(`Sending to ${subscriber.email}: New post - ${postData.title}`);
            
            // Placeholder for EmailJS or other email service
            // emailjs.send('service_id', 'template_id', {
            //     to_email: subscriber.email,
            //     subject: `New ${category} Post: ${postData.title}`,
            //     post_title: postData.title,
            //     post_description: postData.description,
            //     post_link: `https://yourdomain.com/blog/${postData.slug || postData.id}`
            // });
        });

        return {
            success: true,
            message: `Newsletter sent to ${interestedSubscribers.length} subscribers`,
            sent: interestedSubscribers.length
        };
    }

    /**
     * Send a test email to a specific address
     * @param {string} email - Email to send test to
     * @param {string} category - Category to test
     * @returns {Object} - Result of the operation
     */
    sendTestEmail(email, category = 'general') {
        if (!email || !this.validateEmail(email)) {
            return { success: false, error: 'Invalid email' };
        }

        console.log(`Sending test email to ${email} for category: ${category}`);
        
        // Placeholder for actual email sending
        // This would use EmailJS or another service in production
        // emailjs.send('service_id', 'template_id', {
        //     to_email: email,
        //     subject: `Test Newsletter: ${category}`,
        //     message: `This is a test newsletter for the ${category} category.`
        // });

        return { 
            success: true, 
            message: `Test email sent to ${email}` 
        };
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}

// Create and export a singleton instance
export const newsletterService = new NewsletterService(); 