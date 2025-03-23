/**
 * Blog Filters
 * 
 * This script handles the filtering functionality for the blog page,
 * including category filtering and search.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all blog posts
    const blogPostsContainer = document.getElementById('blog-posts-container');
    if (!blogPostsContainer) return;

    const blogPosts = document.querySelectorAll('.blog-card');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const paginationContainer = document.getElementById('pagination-container');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const featuredPost = document.querySelector('article:not(.blog-card)'); // Featured post is not a .blog-card
    
    let currentCategory = 'all';
    let currentSearchTerm = '';
    
    // Initialize pagination
    const postsPerPage = 6;
    let currentPage = 1;
    let totalPages = 1;
    
    /**
     * Filter blog posts based on category and search term
     */
    function filterBlogPosts() {
        let visibleCount = 0;
        let filteredPosts = [];
        
        // First filter posts by category and search term
        blogPosts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            const postTitle = post.querySelector('h3').textContent.toLowerCase();
            const postContent = post.querySelector('p').textContent.toLowerCase();
            const searchContent = postTitle + ' ' + postContent;
            
            // Check if post matches current category filter
            const matchesCategory = currentCategory === 'all' || postCategory === currentCategory;
            
            // Check if post matches current search term
            const matchesSearch = currentSearchTerm === '' || 
                searchContent.includes(currentSearchTerm.toLowerCase());
            
            // If post matches both filters, add to filtered posts array
            if (matchesCategory && matchesSearch) {
                filteredPosts.push(post);
                visibleCount++;
            }
            
            // Hide all posts initially
            post.style.display = 'none';
        });
        
        // Handle featured post visibility
        if (featuredPost) {
            // Extract category from featured post span (e.g., "Featured • Cooking")
            const categorySpan = featuredPost.querySelector('span.bg-purple-700');
            let featuredCategory = 'cooking'; // Default if not found
            
            if (categorySpan) {
                const categoryText = categorySpan.textContent;
                if (categoryText.includes('Cooking')) featuredCategory = 'cooking';
                else if (categoryText.includes('Anime')) featuredCategory = 'anime';
                else if (categoryText.includes('Tech')) featuredCategory = 'tech';
                else if (categoryText.includes('Other')) featuredCategory = 'other';
            }
            
            // Get title and content for search
            const featuredTitle = featuredPost.querySelector('h2').textContent.toLowerCase();
            const featuredContent = featuredPost.querySelector('p').textContent.toLowerCase();
            const featuredSearchContent = featuredTitle + ' ' + featuredContent;
            
            // Check if featured post matches filters
            const matchesCategory = currentCategory === 'all' || currentCategory === featuredCategory;
            const matchesSearch = currentSearchTerm === '' || 
                featuredSearchContent.includes(currentSearchTerm.toLowerCase());
            
            // Show/hide featured post
            featuredPost.style.display = (matchesCategory && matchesSearch) ? 'block' : 'none';
        }
        
        // Calculate total pages
        totalPages = Math.max(1, Math.ceil(visibleCount / postsPerPage));
        
        // Ensure current page is within bounds
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        
        // Show only posts for current page
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = Math.min(startIndex + postsPerPage, filteredPosts.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            filteredPosts[i].style.display = 'flex';
        }
        
        // Update pagination
        updatePagination();
        
        // Show no results message if needed
        const noResults = visibleCount === 0 && (featuredPost ? featuredPost.style.display === 'none' : true);
        showNoResultsMessage(noResults);
    }
    
    /**
     * Update pagination controls based on filtered results
     */
    function updatePagination() {
        if (!paginationContainer) return;
        
        // Clear existing pagination buttons except prev and next
        const paginationButtons = paginationContainer.querySelectorAll('button:not(#prev-page):not(#next-page)');
        paginationButtons.forEach(button => button.remove());
        
        // If only one page, hide pagination
        if (totalPages <= 1) {
            paginationContainer.parentElement.style.display = 'none';
            return;
        }
        
        paginationContainer.parentElement.style.display = 'flex';
        
        // Update prev button state
        if (prevPageButton) {
            prevPageButton.disabled = currentPage === 1;
            prevPageButton.setAttribute('aria-disabled', currentPage === 1);
        }
        
        // Update next button state
        if (nextPageButton) {
            nextPageButton.disabled = currentPage === totalPages;
            nextPageButton.setAttribute('aria-disabled', currentPage === totalPages);
        }
        
        // Add page buttons (insert before next button)
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add('pagination-button', 'relative', 'inline-flex', 'items-center', 'px-3', 'py-2', 'text-sm', 'font-medium');
            
            if (i === currentPage) {
                button.classList.add('text-white', 'bg-purple-700');
                button.setAttribute('aria-current', 'page');
            } else {
                button.classList.add('text-gray-400', 'hover:bg-gray-800', 'hover:text-white');
            }
            
            button.setAttribute('aria-label', `Page ${i}`);
            button.setAttribute('data-page', i);
            button.textContent = i;
            
            button.addEventListener('click', () => {
                currentPage = i;
                filterBlogPosts();
                window.scrollTo({
                    top: blogPostsContainer.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
            
            // Insert before next button
            if (nextPageButton) {
                paginationContainer.insertBefore(button, nextPageButton);
            } else {
                paginationContainer.appendChild(button);
            }
        }
    }
    
    /**
     * Show/hide no results message
     */
    function showNoResultsMessage(show) {
        let noResultsMessage = document.getElementById('no-results-message');
        
        if (!noResultsMessage && show) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.id = 'no-results-message';
            noResultsMessage.className = 'text-center py-12 text-gray-400 w-full';
            noResultsMessage.innerHTML = `
                <i class="fas fa-search fa-3x mb-4 opacity-50"></i>
                <h3 class="text-xl font-bold mb-2">No Matching Posts Found</h3>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
                <button id="reset-filters" class="mt-4 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition">
                    Reset Filters
                </button>
            `;
            blogPostsContainer.after(noResultsMessage);
            
            // Add event listener to reset button
            document.getElementById('reset-filters').addEventListener('click', resetFilters);
        } else if (noResultsMessage) {
            noResultsMessage.style.display = show ? 'block' : 'none';
        }
    }
    
    /**
     * Reset all filters
     */
    function resetFilters() {
        currentCategory = 'all';
        currentSearchTerm = '';
        currentPage = 1;
        
        // Reset search input
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset category buttons
        categoryFilters.forEach(button => {
            if (button.getAttribute('data-category') === 'all') {
                button.classList.remove('bg-gray-800');
                button.classList.add('bg-purple-700');
                button.setAttribute('aria-selected', 'true');
            } else {
                button.classList.remove('bg-purple-700');
                button.classList.add('bg-gray-800');
                button.setAttribute('aria-selected', 'false');
            }
        });
        
        // Apply filters
        filterBlogPosts();
    }
    
    // Add event listeners to category filter buttons
    categoryFilters.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button styling
            categoryFilters.forEach(btn => {
                btn.classList.remove('bg-purple-700');
                btn.classList.add('bg-gray-800');
                btn.setAttribute('aria-selected', 'false');
            });
            
            button.classList.remove('bg-gray-800');
            button.classList.add('bg-purple-700');
            button.setAttribute('aria-selected', 'true');
            
            // Update current category and reset to first page
            currentCategory = button.getAttribute('data-category');
            currentPage = 1;
            
            // Apply filters
            filterBlogPosts();
        });
    });
    
    // Add event listener to search form
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update current search term and reset to first page
            currentSearchTerm = searchInput.value.trim();
            currentPage = 1;
            
            // Apply filters
            filterBlogPosts();
        });
    }
    
    // Clear search when input is cleared
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '' && currentSearchTerm !== '') {
                currentSearchTerm = '';
                currentPage = 1;
                filterBlogPosts();
            }
        });
    }
    
    // Add event listeners to pagination controls
    if (prevPageButton) {
        prevPageButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                filterBlogPosts();
                window.scrollTo({
                    top: blogPostsContainer.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    if (nextPageButton) {
        nextPageButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                filterBlogPosts();
                window.scrollTo({
                    top: blogPostsContainer.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Initialize filters
    filterBlogPosts();
}); 