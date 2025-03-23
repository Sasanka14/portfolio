/**
 * Blog Post Model
 * Represents a blog post with all necessary metadata and content
 */
export class BlogPost {
    /**
     * Create a new blog post
     * @param {Object} postData - The blog post data
     * @param {string} postData.id - Unique identifier for the post (generated if not provided)
     * @param {string} postData.title - Post title
     * @param {string} postData.description - Short description/excerpt
     * @param {string} postData.content - Full post content
     * @param {string} postData.category - Post category (cooking, anime, tech, other)
     * @param {string} postData.image_url - Featured image URL
     * @param {boolean} postData.published - Whether the post is published
     * @param {string} postData.dateCreated - ISO string of creation date
     * @param {string} postData.datePublished - ISO string of publish date (if published)
     * @param {string} postData.dateUpdated - ISO string of last update date
     */
    constructor(postData = {}) {
        this.id = postData.id || this.generateId();
        this.title = postData.title || '';
        this.description = postData.description || '';
        this.content = postData.content || '';
        this.category = postData.category || 'other';
        this.image_url = postData.image_url || '';
        this.published = postData.published || false;
        this.dateCreated = postData.dateCreated || new Date().toISOString();
        this.datePublished = postData.datePublished || null;
        this.dateUpdated = postData.dateUpdated || new Date().toISOString();
        this.slug = postData.slug || this.generateSlug();
    }

    /**
     * Generate a unique ID for the post
     * @returns {string} - A unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Generate a URL-friendly slug from the title
     * @returns {string} - A URL slug
     */
    generateSlug() {
        if (!this.title) return '';
        return this.title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '') // Remove special characters
            .trim()
            .replace(/\s+/g, '-'); // Replace spaces with hyphens
    }

    /**
     * Publish the blog post
     */
    publish() {
        this.published = true;
        this.datePublished = new Date().toISOString();
        this.dateUpdated = new Date().toISOString();
    }

    /**
     * Update the blog post
     * @param {Object} updates - Fields to update
     */
    update(updates) {
        Object.keys(updates).forEach(key => {
            if (this.hasOwnProperty(key) && key !== 'id' && key !== 'dateCreated') {
                this[key] = updates[key];
            }
        });

        // Regenerate slug if title changed
        if (updates.title) {
            this.slug = this.generateSlug();
        }

        this.dateUpdated = new Date().toISOString();
    }

    /**
     * Get a preview of the post content
     * @param {number} length - Maximum length of preview
     * @returns {string} - Truncated post content
     */
    getPreview(length = 150) {
        if (!this.content || this.content.length <= length) {
            return this.content;
        }
        
        return this.content.substring(0, length).trim() + '...';
    }

    /**
     * Format the publication date for display
     * @returns {string} - Formatted date string
     */
    getFormattedDate() {
        const date = this.datePublished ? new Date(this.datePublished) : new Date(this.dateCreated);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Convert post to JSON for storage
     * @returns {Object} - Plain object representation of post
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            content: this.content,
            category: this.category,
            image_url: this.image_url,
            published: this.published,
            dateCreated: this.dateCreated,
            datePublished: this.datePublished,
            dateUpdated: this.dateUpdated,
            slug: this.slug
        };
    }

    /**
     * Create a BlogPost instance from stored JSON data
     * @param {Object} data - Blog post data from storage
     * @returns {BlogPost} - New BlogPost instance
     */
    static fromJSON(data) {
        return new BlogPost(data);
    }
} 