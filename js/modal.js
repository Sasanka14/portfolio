/**
 * Project Modal Handler
 * 
 * Manages the display of project modals across the portfolio site
 * Uses Alpine.js for state management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Setup Alpine store for modals
    if (window.Alpine) {
        window.Alpine.store('modals', {
            // Track current open modal
            current: null,
            
            // Modal cache to avoid refetching the same content
            cache: {},
            
            // Open a modal
            open(modalId) {
                // Store the modal ID
                this.current = modalId;
                
                // Load the content if not cached
                if (!this.cache[modalId]) {
                    this.loadModalContent(modalId);
                } else {
                    // Use cached content
                    const modalContent = document.getElementById('modal-content');
                    if (modalContent) {
                        modalContent.innerHTML = this.cache[modalId];
                    }
                }
                
                // Focus on the close button, add ARIA attributes
                setTimeout(() => {
                    const closeBtn = document.querySelector('#modal-content button[aria-label="Close modal"]');
                    if (closeBtn) closeBtn.focus();
                    
                    // Trap focus inside the modal
                    this.trapFocus();
                    
                    // Disable scrolling on the body
                    document.body.classList.add('overflow-hidden');
                }, 100);
            },
            
            // Close the current modal
            close() {
                this.current = null;
                
                // Re-enable scrolling
                document.body.classList.remove('overflow-hidden');
                
                // Return focus to the element that opened the modal
                const opener = document.activeElement;
                if (opener && opener.getAttribute('data-return-focus')) {
                    const returnElement = document.querySelector(opener.getAttribute('data-return-focus'));
                    if (returnElement) returnElement.focus();
                }
            },
            
            // Close all modals
            closeAll() {
                this.close();
            },
            
            // Trap focus inside the modal for accessibility
            trapFocus() {
                const modal = document.getElementById('modal-content');
                if (!modal) return;
                
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                // Handle tab and shift+tab to trap focus
                modal.addEventListener('keydown', function(e) {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        } else if (!e.shiftKey && document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            },
            
            // Load modal content based on project ID
            loadModalContent(modalId) {
                try {
                    // Extract the project ID from the modal ID (format: project{id})
                    const projectId = parseInt(modalId.replace('project', ''));
                    
                    // Ensure projectsData is available
                    if (typeof projectsData === 'undefined' || !Array.isArray(projectsData)) {
                        throw new Error('Project data is not available');
                    }
            
                    // Find project data
                    const project = projectsData.find(p => p.id === projectId);
                    if (!project) throw new Error(`Project with ID ${projectId} not found`);
                    
                    // Format the date
                    const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    // Generate HTML for the modal
                    const modalHtml = `
                        <!-- Modal Header -->
                        <div class="border-b border-gray-800 p-6">
                            <div class="flex justify-between items-center">
                                <h2 id="modal-title" class="text-2xl font-bold">${project.title}</h2>
                                <button @click="$store.modals.close()" class="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                                    <i class="fas fa-times text-xl" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Modal Content -->
                        <div class="p-6 space-y-6">
                            <!-- Project Image -->
                            <div class="mb-6 overflow-hidden rounded-lg">
                                <img 
                                    src="${project.image}" 
                                    alt="${project.title} Screenshot" 
                                    class="w-full h-auto object-cover"
                                    loading="lazy"
                                    width="1200"
                                    height="675"
                                    onerror="this.onerror=null;this.src='../images/placeholder.svg';"
                                >
                            </div>
                            
                            <!-- Project Details -->
                            <div class="space-y-6">
                                <!-- Project Overview -->
                                <div>
                                    <h3 class="text-xl font-semibold mb-3">Project Overview</h3>
                                    <p class="text-gray-300">${project.longDescription || project.description}</p>
                                </div>
                                
                                <!-- Project Info -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 class="text-xl font-semibold mb-3">Project Details</h3>
                                        <div class="space-y-2">
                                            <div class="flex">
                                                <span class="text-gray-400 w-24">Category:</span>
                                                <span class="text-white">${project.category}</span>
                                            </div>
                                            <div class="flex">
                                                <span class="text-gray-400 w-24">Date:</span>
                                                <span class="text-white">${formattedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 class="text-xl font-semibold mb-3">Technologies Used</h3>
                                        <div class="flex flex-wrap gap-2">
                                            ${project.technologies.map(tech => 
                                                `<span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">${tech}</span>`
                                            ).join('')}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Project Features -->
                                ${project.features ? `
                                <div>
                                    <h3 class="text-xl font-semibold mb-3">Key Features</h3>
                                    <ul class="list-disc pl-5 text-gray-300 space-y-1">
                                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>` : ''}
                            </div>
                            
                            <!-- Project Links -->
                            <div class="flex flex-wrap gap-4 pt-4 mt-6 border-t border-gray-800">
                                <a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                    <i class="fas fa-external-link-alt" aria-hidden="true"></i> View Live
                                </a>
                                <a href="${project.repoLink}" target="_blank" rel="noopener noreferrer" class="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50">
                                    <i class="fab fa-github" aria-hidden="true"></i> View Code
                                </a>
                            </div>
                        </div>
                    `;
                    
                    // Update modal content
                    const modalContent = document.getElementById('modal-content');
                    if (modalContent) {
                        modalContent.innerHTML = modalHtml;
                        
                        // Cache the modal content
                        this.cache[modalId] = modalHtml;
                    }
                    
                } catch (error) {
                    console.error('Error showing project modal:', error);
                    
                    // Show error message in modal
                    const modalContent = document.getElementById('modal-content');
                    if (modalContent) {
                        modalContent.innerHTML = `
                            <div class="p-6 text-center">
                                <div class="text-red-500 mb-4">
                                    <i class="fas fa-exclamation-triangle text-3xl" aria-hidden="true"></i>
                                </div>
                                <h2 class="text-xl font-bold mb-2">Error Loading Project</h2>
                                <p class="text-gray-300 mb-4">${error.message}</p>
                                <button @click="$store.modals.close()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                                    Close
                                </button>
                            </div>
                        `;
                    }
                }
            }
        });
    }
});

/**
 * Setup click event listeners for project detail buttons
 */
function setupProjectDetailButtons() {
    // Add click event to all project detail buttons
    document.querySelectorAll('.view-project-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            if (projectId && window.Alpine && window.Alpine.store('modals')) {
                // Store the button to return focus when modal closes
                this.setAttribute('data-return-focus', `[data-project-id="${projectId}"]`);
                window.Alpine.store('modals').open(`project${projectId}`);
            } else {
                console.warn('Modal system not available, project ID:', projectId);
            }
        });
    });
}

// Set up event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupProjectDetailButtons();
}); 