/**
 * Newsletter Subscriber Model
 * Represents a subscriber to the blog newsletter with their preferences
 */
export class Subscriber {
    /**
     * Create a new subscriber
     * @param {string} email - The subscriber's email address
     * @param {Object} interests - Object containing boolean values for each interest category
     * @param {boolean} active - Whether the subscriber is active
     * @param {string} dateAdded - ISO string of subscription date
     */
    constructor(email, interests = {}, active = true, dateAdded = new Date().toISOString()) {
        this.email = email;
        this.interests = {
            cooking: interests.cooking || false,
            anime: interests.anime || false,
            tech: interests.tech || false,
            other: interests.other || false,
            general: interests.general !== undefined ? interests.general : true // Default to general updates
        };
        this.active = active;
        this.dateAdded = dateAdded;
        this.lastUpdated = new Date().toISOString();
    }

    /**
     * Update subscriber interests
     * @param {Object} interests - Object containing updated interest preferences
     */
    updateInterests(interests) {
        if (!interests) return;
        
        // Only update provided interests, keeping others as they were
        Object.keys(interests).forEach(key => {
            if (this.interests.hasOwnProperty(key)) {
                this.interests[key] = interests[key];
            }
        });
        
        this.lastUpdated = new Date().toISOString();
    }

    /**
     * Set subscriber active status
     * @param {boolean} status - Whether the subscriber should be active
     */
    setActive(status) {
        this.active = status;
        this.lastUpdated = new Date().toISOString();
    }

    /**
     * Check if subscriber is interested in a specific category
     * @param {string} category - The category to check interest for
     * @returns {boolean} - Whether the subscriber is interested in this category
     */
    isInterestedIn(category) {
        return this.interests.hasOwnProperty(category) ? this.interests[category] : false;
    }

    /**
     * Convert subscriber to JSON for storage
     * @returns {Object} - Plain object representation of subscriber
     */
    toJSON() {
        return {
            email: this.email,
            interests: { ...this.interests },
            active: this.active,
            dateAdded: this.dateAdded,
            lastUpdated: this.lastUpdated
        };
    }

    /**
     * Create a Subscriber instance from stored JSON data
     * @param {Object} data - Subscriber data from storage
     * @returns {Subscriber} - New Subscriber instance
     */
    static fromJSON(data) {
        const subscriber = new Subscriber(
            data.email, 
            data.interests, 
            data.active, 
            data.dateAdded
        );
        subscriber.lastUpdated = data.lastUpdated || new Date().toISOString();
        return subscriber;
    }
} 