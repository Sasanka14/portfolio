/**
 * Components Loader
 * This script handles loading header, footer, and other components into all pages
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load the header
    loadComponent('header-container', './components/header.html');
    
    // Load the footer
    loadComponent('footer-container', './components/footer.html');
});

/**
 * Load a component into a target element
 * @param {string} targetId - ID of the element to load the component into
 * @param {string} componentPath - Path to the component HTML file
 */
function loadComponent(targetId, componentPath) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    // Handle relative paths based on current page depth
    const adjustedPath = adjustPathForPageDepth(componentPath);
    
    fetch(adjustedPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            targetElement.innerHTML = html;
            
            // Fix relative paths in loaded component
            fixRelativePaths(targetElement);
            
            // Highlight current page in navigation
            if (targetId === 'header-container') {
                highlightCurrentPageInNav();
            }
        })
        .catch(error => {
            console.error(`Error loading ${componentPath}:`, error);
            targetElement.innerHTML = `<div class="error-message">Error loading component</div>`;
        });
}

/**
 * Adjust the component path based on the current page depth
 * @param {string} path - Original component path
 * @returns {string} - Adjusted path
 */
function adjustPathForPageDepth(path) {
    // Check if we're in a subdirectory
    const currentPath = window.location.pathname;
    const isInSubdir = currentPath.includes('/pages/');
    
    // If we're in the pages subdirectory, we need to go up one level
    return isInSubdir ? '../' + path : path;
}

/**
 * Fix relative paths in loaded component
 * @param {HTMLElement} element - The component element
 */
function fixRelativePaths(element) {
    // Check if we're in a subdirectory
    const currentPath = window.location.pathname;
    const isInSubdir = currentPath.includes('/pages/');
    
    if (!isInSubdir) return; // No need to fix paths if we're at the root
    
    // Fix relative paths in links and images
    const links = element.querySelectorAll('a[href^="./"], a[href^="css/"], a[href^="js/"], a[href^="images/"]');
    links.forEach(link => {
        if (!link.getAttribute('href').startsWith('http')) {
            link.href = '../' + link.getAttribute('href');
        }
    });
    
    const images = element.querySelectorAll('img[src^="./"], img[src^="images/"]');
    images.forEach(img => {
        img.src = '../' + img.getAttribute('src');
    });
}

/**
 * Highlight the current page in the navigation
 */
function highlightCurrentPageInNav() {
    // Get the current page path
    const currentPath = window.location.pathname;
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('#header-container nav a');
    
    navLinks.forEach(link => {
        // Get the link's href attribute
        const href = link.getAttribute('href');
        
        // Check if this link points to the current page
        if (currentPath.endsWith(href) || 
            (currentPath.endsWith('/') && href === 'index.html') ||
            (href === './' && currentPath.endsWith('index.html'))) {
            
            // Add the active class to highlight the link
            link.classList.add('active');
        }
    });
    
    // Initialize mobile menu toggle
    initMobileMenu();
}

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', function() {
        // Toggle mobile menu visibility
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        mobileMenu.setAttribute('aria-hidden', isExpanded);
        
        // Toggle body class to prevent scrolling when menu is open
        document.body.classList.toggle('mobile-menu-open', !isExpanded);
        
        // Change button icon based on menu state
        const svg = mobileMenuButton.querySelector('svg');
        if (!isExpanded) {
            // Menu is now open, show close icon
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        } else {
            // Menu is now closed, show hamburger icon
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16"></path>';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        
        if (isMenuOpen && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuButton.contains(event.target)) {
            
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
            mobileMenu.setAttribute('aria-hidden', 'true');
            
            // Remove body class to allow scrolling again
            document.body.classList.remove('mobile-menu-open');
            
            // Reset to hamburger icon
            const svg = mobileMenuButton.querySelector('svg');
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16"></path>';
        }
    });
    
    // Close mobile menu when clicking a mobile menu link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
            mobileMenu.setAttribute('aria-hidden', 'true');
            
            // Remove body class to allow scrolling again
            document.body.classList.remove('mobile-menu-open');
            
            // Reset to hamburger icon
            const svg = mobileMenuButton.querySelector('svg');
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16"></path>';
        });
    });
    
    // Handle screen resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) { // md breakpoint
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('hidden');
            mobileMenu.setAttribute('aria-hidden', 'true');
            
            // Remove body class to allow scrolling again
            document.body.classList.remove('mobile-menu-open');
            
            // Reset to hamburger icon
            const svg = mobileMenuButton.querySelector('svg');
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16"></path>';
        }
    });
} 