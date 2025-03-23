/**
 * Blog Admin Panel
 * Provides functionality for managing blog posts and subscribers
 */

import { BlogPost } from './blog-post-model.js';
import { newsletterService } from './newsletter-service.js';

// For browsers that don't support ES modules, use traditional script tag approach:
// const newsletterService = window.newsletterService;

document.addEventListener('DOMContentLoaded', () => {
    initAdminPanel();
});

/**
 * Initialize the admin panel functionality
 */
function initAdminPanel() {
    setupNewPostForm();
    
    // Switch tabs functionality already handled in HTML

    // Add event listeners for tab functionality
    document.getElementById('posts-tab').addEventListener('click', () => {
        loadPublishedPosts();
        loadDraftPosts();
    });

    document.getElementById('subscribers-tab').addEventListener('click', () => {
        setupSubscribersList();
    });

    // Initialize notifications
    setupNotifications();
}

/**
 * Setup the new post form submission
 */
function setupNewPostForm() {
    const form = document.getElementById('new-post-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Create post object from form data
        const formData = new FormData(form);
        const postData = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            category: formData.get('category'),
            image_url: formData.get('image_url') || ''
        };
        
        // Check if the newsletter should be sent
        const sendNewsletter = formData.get('send_newsletter') === 'on';
        
        // Save post (in a real app, this would be an API call)
        savePost(postData)
            .then(savedPost => {
                if (sendNewsletter) {
                    // Send newsletter about the new post
                    const result = newsletterService.sendBlogNewsletter(savedPost);
                    showNotification(
                        result.success ? 'success' : 'error',
                        result.message
                    );
                } else {
                    showNotification('success', 'Post published successfully (no newsletter sent)');
                }
                
                // Reset form
                form.reset();
            })
            .catch(error => {
                console.error('Error saving post:', error);
                showNotification('error', 'Failed to save post: ' + error.message);
            });
    });
}

/**
 * Setup the subscribers list display
 */
function setupSubscribersList() {
    const subscribersContainer = document.getElementById('subscribers-list');
    
    if (!subscribersContainer) return;
    
    // Get all active subscribers
    const activeSubscribers = newsletterService.getActiveSubscribers();
    
    // Clear previous content
    subscribersContainer.innerHTML = '';
    
    if (activeSubscribers.length === 0) {
        subscribersContainer.innerHTML = `
            <div class="text-center p-8 bg-gray-900/50 rounded-lg">
                <p class="text-gray-400">No subscribers yet.</p>
            </div>
        `;
        return;
    }
    
    // Create subscribers statistics
    const stats = document.createElement('div');
    stats.className = 'mb-6 grid grid-cols-2 md:grid-cols-4 gap-4';
    
    // Calculate statistics
    const totalSubscribers = activeSubscribers.length;
    const cookingSubscribers = countSubscribersByInterest(activeSubscribers, 'cooking');
    const animeSubscribers = countSubscribersByInterest(activeSubscribers, 'anime');
    const techSubscribers = countSubscribersByInterest(activeSubscribers, 'tech');
    
    stats.innerHTML = `
        <div class="bg-gray-800 p-4 rounded-lg">
            <h3 class="text-lg font-medium">Total</h3>
            <p class="text-2xl font-bold text-purple-500">${totalSubscribers}</p>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
            <h3 class="text-lg font-medium">Cooking</h3>
            <p class="text-2xl font-bold text-purple-500">${cookingSubscribers}</p>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
            <h3 class="text-lg font-medium">Anime</h3>
            <p class="text-2xl font-bold text-purple-500">${animeSubscribers}</p>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg">
            <h3 class="text-lg font-medium">Tech</h3>
            <p class="text-2xl font-bold text-purple-500">${techSubscribers}</p>
        </div>
    `;
    
    subscribersContainer.appendChild(stats);
    
    // Create subscribers table
    const table = document.createElement('div');
    table.className = 'overflow-x-auto';
    table.innerHTML = `
        <table class="min-w-full divide-y divide-gray-700">
            <thead>
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Interests</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Added</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
                ${activeSubscribers.map(subscriber => `
                    <tr>
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">${subscriber.email}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            ${Object.entries(subscriber.interests)
                                .filter(([_, value]) => value)
                                .map(([key, _]) => `
                                    <span class="px-2 py-1 mr-1 text-xs rounded-full bg-gray-700">${key}</span>
                                `).join('')}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            ${new Date(subscriber.dateAdded).toLocaleDateString()}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            <button 
                                class="text-blue-400 hover:text-blue-300 mr-3 send-test-email"
                                data-email="${subscriber.email}"
                            >
                                <i class="fas fa-paper-plane"></i> Send Test
                            </button>
                            <button 
                                class="text-red-400 hover:text-red-300 remove-subscriber"
                                data-email="${subscriber.email}"
                            >
                                <i class="fas fa-user-minus"></i> Remove
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    subscribersContainer.appendChild(table);
    
    // Add event listeners to action buttons
    subscribersContainer.querySelectorAll('.send-test-email').forEach(button => {
        button.addEventListener('click', () => {
            const email = button.getAttribute('data-email');
            sendTestEmail(email);
        });
    });
    
    subscribersContainer.querySelectorAll('.remove-subscriber').forEach(button => {
        button.addEventListener('click', () => {
            const email = button.getAttribute('data-email');
            removeSubscriber(email);
        });
    });
}

/**
 * Count subscribers by specific interest
 * @param {Array} subscribers - Array of subscribers
 * @param {string} interest - Interest to count
 * @returns {number} - Count of subscribers interested in the category
 */
function countSubscribersByInterest(subscribers, interest) {
    return subscribers.filter(sub => sub.isInterestedIn(interest)).length;
}

/**
 * Send a test email to a subscriber
 * @param {string} email - Email to send test to
 */
function sendTestEmail(email) {
    const result = newsletterService.sendTestEmail(email);
    
    showNotification(
        result.success ? 'success' : 'error',
        result.message
    );
}

/**
 * Remove a subscriber
 * @param {string} email - Email of subscriber to remove
 */
function removeSubscriber(email) {
    if (confirm(`Are you sure you want to unsubscribe ${email}?`)) {
        const result = newsletterService.unsubscribe(email);
        
        showNotification(
            result ? 'success' : 'error',
            result ? `${email} has been unsubscribed` : `Failed to unsubscribe ${email}`
        );
        
        // Refresh subscribers list
        setupSubscribersList();
    }
}

/**
 * Load and display draft posts
 */
function loadDraftPosts() {
    const draftsContainer = document.getElementById('draft-posts');
    
    if (!draftsContainer) return;
    
    // Get posts from storage (in a real app, this would be an API call)
    const posts = getPosts().filter(post => !post.published);
    
    if (posts.length === 0) {
        draftsContainer.innerHTML = `
            <div class="text-center p-8 bg-gray-900/50 rounded-lg">
                <p class="text-gray-400">No draft posts yet.</p>
            </div>
        `;
        return;
    }
    
    // Display posts
    draftsContainer.innerHTML = `
        <div class="space-y-4">
            ${posts.map(post => `
                <div class="p-4 border border-gray-700 rounded-lg">
                    <div class="flex justify-between items-start">
                        <h3 class="text-lg font-semibold">${post.title}</h3>
                        <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs capitalize">${post.category}</span>
                    </div>
                    <p class="text-gray-400 text-sm mt-2">${post.description}</p>
                    <div class="mt-3 flex justify-end space-x-2">
                        <button class="text-blue-400 hover:text-blue-300 edit-post" data-id="${post.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="text-green-400 hover:text-green-300 publish-post" data-id="${post.id}">
                            <i class="fas fa-paper-plane"></i> Publish
                        </button>
                        <button class="text-red-400 hover:text-red-300 delete-post" data-id="${post.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add event listeners to buttons
    // (in a full implementation, these would handle editing, publishing, deleting)
    draftsContainer.querySelectorAll('.edit-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            // editPost(id); // Would implement this function
            alert(`Edit post ${id} - This would open the post in the editor`);
        });
    });
    
    draftsContainer.querySelectorAll('.publish-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            // publishPost(id); // Would implement this function
            alert(`Publish post ${id} - This would publish the post`);
        });
    });
    
    draftsContainer.querySelectorAll('.delete-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            // deletePost(id); // Would implement this function
            alert(`Delete post ${id} - This would delete the post`);
        });
    });
}

/**
 * Load and display published posts
 */
function loadPublishedPosts() {
    const publishedContainer = document.getElementById('published-posts');
    
    if (!publishedContainer) return;
    
    // Get posts from storage (in a real app, this would be an API call)
    const posts = getPosts().filter(post => post.published);
    
    if (posts.length === 0) {
        publishedContainer.innerHTML = `
            <div class="text-center p-8 bg-gray-900/50 rounded-lg">
                <p class="text-gray-400">No published posts yet.</p>
            </div>
        `;
        return;
    }
    
    // Display posts
    publishedContainer.innerHTML = `
        <div class="space-y-4">
            ${posts.map(post => `
                <div class="p-4 border border-gray-700 rounded-lg">
                    <div class="flex justify-between items-start">
                        <h3 class="text-lg font-semibold">${post.title}</h3>
                        <span class="bg-purple-700 text-white px-2 py-1 rounded text-xs capitalize">${post.category}</span>
                    </div>
                    <p class="text-gray-400 text-sm mt-2">${post.description}</p>
                    <div class="mt-1 text-xs text-gray-500">
                        Published: ${new Date(post.datePublished || post.dateCreated).toLocaleDateString()}
                    </div>
                    <div class="mt-3 flex justify-end space-x-2">
                        <button class="text-blue-400 hover:text-blue-300 edit-post" data-id="${post.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="text-orange-400 hover:text-orange-300 send-newsletter" data-id="${post.id}">
                            <i class="fas fa-envelope"></i> Send Newsletter
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add event listeners to buttons
    publishedContainer.querySelectorAll('.edit-post').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            // editPost(id); // Would implement this function
            alert(`Edit post ${id} - This would open the post in the editor`);
        });
    });
    
    publishedContainer.querySelectorAll('.send-newsletter').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const post = getPosts().find(p => p.id === id);
            
            if (post) {
                const result = newsletterService.sendBlogNewsletter(post);
                showNotification(
                    result.success ? 'success' : 'error',
                    result.message
                );
            }
        });
    });
}

/**
 * Save a post to storage
 * @param {Object} postData - Post data
 * @returns {Promise} - Resolves with saved post
 */
function savePost(postData) {
    return new Promise((resolve, reject) => {
        try {
            // Create a new BlogPost instance
            const post = new BlogPost(postData);
            post.publish(); // Publish immediately for demo
            
            // Save to storage
            const posts = getPosts();
            posts.push(post.toJSON());
            localStorage.setItem('blog_posts', JSON.stringify(posts));
            
            resolve(post.toJSON());
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get all posts from storage
 * @returns {Array} - Array of posts
 */
function getPosts() {
    try {
        const storedPosts = localStorage.getItem('blog_posts');
        return storedPosts ? JSON.parse(storedPosts) : [];
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

/**
 * Setup notifications
 */
function setupNotifications() {
    // Create notifications container if it doesn't exist
    if (!document.getElementById('notifications')) {
        const notificationsContainer = document.createElement('div');
        notificationsContainer.id = 'notifications';
        notificationsContainer.className = 'fixed top-4 right-4 z-50 space-y-4';
        document.body.appendChild(notificationsContainer);
    }
}

/**
 * Show a notification
 * @param {string} type - Notification type (success, error, info)
 * @param {string} message - Notification message
 */
function showNotification(type, message) {
    const container = document.getElementById('notifications');
    
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `px-4 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-800 text-green-100' :
        type === 'error' ? 'bg-red-800 text-red-100' :
        'bg-blue-800 text-blue-100'
    } flex items-center transition-all duration-300 transform translate-x-0 opacity-0`;
    
    notification.innerHTML = `
        <div class="mr-3">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle'
            }"></i>
        </div>
        <div>${message}</div>
        <button class="ml-auto text-sm opacity-70 hover:opacity-100">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to DOM
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.remove('opacity-0');
        notification.classList.add('opacity-100');
    }, 10);
    
    // Add click event to close button
    notification.querySelector('button').addEventListener('click', () => {
        notification.classList.remove('opacity-100');
        notification.classList.add('opacity-0');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('opacity-100');
            notification.classList.add('opacity-0');
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
} 