/**
 * Dynamic Content Loader
 * 
 * This script loads specific sections from about.html and projects.html
 * into index.html to avoid content duplication and ensure consistency.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cache if not exists
    if (!window.contentCache) {
        window.contentCache = {};
    }
    
    // Load About section content
    loadAboutContent();
    
    // Load Featured Projects
    loadFeaturedProjects();
});

/**
 * Gets the correct base path based on current location
 * @returns {string} The base path for requests
 */
function getBasePath() {
    const path = window.location.pathname;
    // Check if we're in a subdirectory or directly in root
    if (path.includes('/pages/')) {
        return '../';
    } else if (path === '/' || path.endsWith('index.html')) {
        return './';
    }
    return './';
}

/**
 * Loads the About Me content from about.html
 */
async function loadAboutContent() {
    const aboutSectionTarget = document.getElementById('about-content');
    if (!aboutSectionTarget) return;
    
    try {
        // Show loading state
        aboutSectionTarget.innerHTML = '<div class="flex justify-center items-center py-8"><div class="spinner" aria-hidden="true"></div><span class="ml-3 text-gray-300">Loading about content...</span></div>';
        
        // Check cache first
        if (window.contentCache.aboutContent) {
            console.log('Using cached about content');
            setTimeout(() => {
                aboutSectionTarget.innerHTML = window.contentCache.aboutContent;
            }, 100); // Small timeout for a smoother experience
            return;
        }
        
        // Determine the correct path
        const basePath = getBasePath();
        
        // Fetch about.html content
        const response = await fetch(`${basePath}pages/about.html`);
        if (!response.ok) throw new Error(`Failed to load about content: ${response.status}`);
        
        const html = await response.text();
        
        // Create a temporary element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract the introduction and bio content
        const bioContent = doc.querySelector('.bento-item.md\\:col-span-8 .md\\:w-2\\/3');
        
        if (bioContent) {
            // Create the HTML structure for the about content
            const contentHTML = `
                <div class="mb-6 fade-in-loading">
                    ${bioContent.innerHTML}
                </div>
                <div class="text-center mt-6 fade-in-loading">
                    <a href="${basePath}pages/about.html" class="inline-flex items-center text-purple-500 hover:text-purple-400 transition-colors">
                        Learn more about me
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </a>
                </div>
            `;
            
            // Cache the content
            window.contentCache.aboutContent = contentHTML;
            
            // Use setTimeout to create a smoother transition
            setTimeout(() => {
                aboutSectionTarget.innerHTML = contentHTML;
            }, 300);
        } else {
            throw new Error('Could not find About content in about.html');
        }
    } catch (error) {
        console.error('Error loading About content:', error);
        aboutSectionTarget.innerHTML = `
            <div class="text-center py-8 fade-in-loading">
                <div class="text-red-500 mb-4">
                    <i class="fas fa-exclamation-triangle text-3xl" aria-hidden="true"></i>
                </div>
                <p>Unable to load About content. Please try again later.</p>
                <a href="${getBasePath()}pages/about.html" class="text-purple-500 hover:text-purple-400 mt-4 inline-block">View About page</a>
            </div>
        `;
    }
}

/**
 * Loads featured projects from projects.html and data.js
 */
async function loadFeaturedProjects() {
    const projectsSectionTarget = document.getElementById('featured-projects');
    if (!projectsSectionTarget) return;
    
    try {
        // Show loading state
        projectsSectionTarget.innerHTML = '<div class="flex justify-center items-center py-8"><div class="spinner" aria-hidden="true"></div><span class="ml-3 text-gray-300">Loading featured projects...</span></div>';
        
        // Check cache first
        if (window.contentCache.featuredProjects) {
            console.log('Using cached featured projects');
            setTimeout(() => {
                projectsSectionTarget.innerHTML = window.contentCache.featuredProjects;
                setupEventListeners();
            }, 100);
            return;
        }
        
        // Determine the correct path
        const basePath = getBasePath();
        
        // Check if projectsData is already available (might be loaded in data.js)
        if (typeof projectsData === 'undefined') {
            // If not available, fetch and evaluate the data.js file
            const dataResponse = await fetch(`${basePath}js/data.js`);
            if (!dataResponse.ok) throw new Error(`Failed to load project data: ${dataResponse.status}`);
            
            const dataJs = await dataResponse.text();
            // This is a safe way to evaluate the JS since we control the content
            eval(dataJs);
            
            // Check again if data is now available
            if (typeof projectsData === 'undefined') {
                throw new Error('Project data not available in data.js');
            }
        }
        
        // Get exactly the 3 most recent projects
        // Sort projects by date (newest first)
        const sortedProjects = [...projectsData].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Take exactly the first 3 projects
        const selectedProjects = sortedProjects.slice(0, 3);
        
        if (selectedProjects.length === 0) {
            throw new Error('No projects found');
        }
        
        // Create HTML for featured projects grid
        let projectsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 fade-in-loading">';
        
        selectedProjects.forEach(project => {
            // Ensure the image path is correct regardless of current page
            const imagePath = project.image.startsWith('http') 
                ? project.image 
                : (project.image.startsWith('../') 
                    ? project.image.replace('../', basePath) 
                    : `${basePath}${project.image}`);
            
            projectsHtml += `
                <div class="group relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 
                           hover:bg-gray-900/70 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 project-card transform hover:-translate-y-1" 
                     data-project-id="${project.id}" 
                     data-featured="${project.featured ? 'true' : 'false'}"
                     data-latest="true">
                    <!-- Project Image -->
                    <div class="aspect-video w-full overflow-hidden">
                        <img 
                            src="${imagePath}" 
                            alt="${project.title}" 
                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='${basePath}images/placeholder.svg';"
                            width="600"
                            height="340"
                        >
                        <div class="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            Latest
                        </div>
                    </div>
                    <!-- Content -->
                    <div class="p-5 sm:p-6">
                        <h3 class="text-lg sm:text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">${project.title}</h3>
                        <p class="text-gray-300 mb-4 text-xs sm:text-sm line-clamp-2">${project.description}</p>
                        
                        <div class="project-tags mb-4 flex flex-wrap gap-1.5 sm:gap-2">
                            ${project.technologies.slice(0, 3).map(tech => 
                                `<span class="project-tag text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-500/20 text-purple-400 rounded-full">${tech}</span>`
                            ).join('')}
                            ${project.technologies.length > 3 ? 
                                `<span class="project-tag text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-500/20 text-purple-400 rounded-full">+${project.technologies.length - 3}</span>` : 
                                ''}
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex flex-col sm:flex-row gap-2 mt-auto">
                            <button class="view-project-btn w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50" data-project-id="${project.id}" aria-label="View details of ${project.title}">
                                <i class="fas fa-info-circle" aria-hidden="true"></i> <span>View Details</span>
                            </button>
                            <div class="flex w-full gap-2">
                                <a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50" aria-label="View live demo of ${project.title}">
                                    <i class="fas fa-external-link-alt" aria-hidden="true"></i> <span class="sm:inline">Live</span>
                                </a>
                                <a href="${project.repoLink}" target="_blank" rel="noopener noreferrer" class="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-gray-500/50" aria-label="View source code of ${project.title}">
                                    <i class="fab fa-github" aria-hidden="true"></i> <span class="sm:inline">Code</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        projectsHtml += '</div>';
        
        // Add "View all projects" link
        projectsHtml += `
            <div class="text-center mt-12 fade-in-loading">
                <a href="${basePath}pages/projects.html" class="inline-flex items-center gap-2 bg-gray-800/70 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    View all projects
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        `;
        
        // Cache the content
        window.contentCache.featuredProjects = projectsHtml;
        
        // Use setTimeout to create a smoother transition
        setTimeout(() => {
            projectsSectionTarget.innerHTML = projectsHtml;
            setupEventListeners();
        }, 300);
        
    } catch (error) {
        console.error('Error loading Featured Projects:', error);
        projectsSectionTarget.innerHTML = `
            <div class="text-center py-8 fade-in-loading">
                <div class="text-red-500 mb-4">
                    <i class="fas fa-exclamation-triangle text-3xl" aria-hidden="true"></i>
                </div>
                <p>Unable to load featured projects. Please try again later.</p>
                <a href="${getBasePath()}pages/projects.html" class="text-purple-500 hover:text-purple-400 mt-4 inline-block">View All Projects</a>
            </div>
        `;
    }
}

/**
 * Sets up event listeners for project cards
 */
function setupEventListeners() {
    // Add event listeners to detail buttons using the function from modal.js
    if (typeof setupProjectDetailButtons === 'function') {
        setupProjectDetailButtons();
    } else {
        console.warn('setupProjectDetailButtons function not found. Make sure modal.js is loaded before content-loader.js');
        
        // Fallback implementation if setupProjectDetailButtons is not available
        document.querySelectorAll('.view-project-btn').forEach(button => {
            button.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project-id');
                if (projectId && window.$store && window.$store.modals) {
                    window.$store.modals.open(`project${projectId}`);
                } else {
                    console.warn('Modal system not available.');
                }
            });
        });
    }
} 