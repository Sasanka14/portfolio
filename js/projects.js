document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const projectsGrid = document.getElementById('projects-grid');
    const loadingIndicator = document.getElementById('loading-indicator');
    const noResults = document.getElementById('no-results');
    const pagination = document.getElementById('pagination');
    const projectSearch = document.getElementById('project-search');
    const searchClear = document.getElementById('search-clear');
    const filterDropdown = document.getElementById('filter-dropdown');
    const filterMenu = document.getElementById('filter-menu');
    const sortMenu = document.getElementById('sort-menu');
    const categoryFilters = document.getElementById('category-filters');
    const activeFilters = document.getElementById('active-filters');
    const visibleCount = document.getElementById('visible-count');
    const totalCount = document.getElementById('total-count');
    const clearFiltersBtn = document.getElementById('clear-filters');

    // Variables
    let currentPage = 1;
    const projectsPerPage = 6;
    let filteredProjects = [];
    let activeCategories = [];
    let searchTerm = '';
    let sortOption = 'newest';
    
    // Initialize the page
    init();
    
    function init() {
        // Setup event listeners
        setupEventListeners();
        
        // Populate category filters
        populateCategoryFilters();
        
        // Set initial projects
        filterAndSortProjects();
        
        // Display initial projects
        displayProjects();
        
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
        
        // Ensure clear filters button works
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearAllFilters);
        }
    }
    
    function setupEventListeners() {
        // Search input
        if (projectSearch) {
            projectSearch.addEventListener('input', handleSearch);
            
            // Clear search when X is clicked
            if (searchClear) {
                searchClear.addEventListener('click', clearSearch);
            }
        }
        
        // Sort buttons
        document.querySelectorAll('#sort-menu button').forEach(button => {
            button.addEventListener('click', function() {
                sortOption = this.getAttribute('data-sort');
                
                // Update active class
                document.querySelectorAll('#sort-menu button').forEach(btn => {
                    btn.classList.remove('bg-gray-800');
                });
                this.classList.add('bg-gray-800');
                
                filterAndSortProjects();
                displayProjects();
            });
        });
        
        // Clear all filters button
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearAllFilters);
        }
    }
    
    function populateCategoryFilters() {
        // Clear existing filters
        if (categoryFilters) {
            categoryFilters.innerHTML = '';
            
            // Get unique categories
            const categories = [...new Set(projectsData.map(project => project.category))];
            
            // Sort categories alphabetically
            categories.sort();
            
            // Create filter checkboxes
            categories.forEach(category => {
                const label = document.createElement('label');
                label.className = 'flex items-center cursor-pointer py-1 hover:bg-gray-800 px-2 rounded transition-colors';
                
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.value = category;
                input.className = 'form-checkbox h-4 w-4 text-purple-600 rounded border-gray-700 bg-gray-800 focus:ring-0 focus:ring-offset-0';
                input.addEventListener('change', function() {
                    handleCategoryChange(this.value, this.checked);
                });
                
                const span = document.createElement('span');
                span.className = 'ml-2 text-sm text-white';
                span.textContent = category;
                
                label.appendChild(input);
                label.appendChild(span);
                
                categoryFilters.appendChild(label);
            });
        }
    }
    
    function handleSearch() {
        searchTerm = projectSearch.value.trim().toLowerCase();
        currentPage = 1;
        filterAndSortProjects();
        displayProjects();
        
        // Toggle clear button visibility
        if (searchTerm && searchClear) {
            searchClear.classList.remove('hidden');
        } else if (searchClear) {
            searchClear.classList.add('hidden');
        }
    }
    
    function clearSearch() {
        if (projectSearch) {
            projectSearch.value = '';
            searchTerm = '';
            
            if (searchClear) {
                searchClear.classList.add('hidden');
            }
            
            currentPage = 1;
            filterAndSortProjects();
            displayProjects();
        }
    }
    
    function handleCategoryChange(category, isChecked) {
        if (isChecked) {
            activeCategories.push(category);
            addActiveFilter(category);
        } else {
            activeCategories = activeCategories.filter(cat => cat !== category);
            removeActiveFilter(category);
        }
        
        currentPage = 1;
        filterAndSortProjects();
        displayProjects();
    }
    
    function clearAllFilters() {
        // Clear search
        if (projectSearch) {
            projectSearch.value = '';
            searchTerm = '';
            
            if (searchClear) {
                searchClear.classList.add('hidden');
            }
        }
        
        // Uncheck all category checkboxes
        document.querySelectorAll('#category-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear active categories
        activeCategories = [];
        
        // Clear active filter tags
        if (activeFilters) {
            activeFilters.innerHTML = '';
        }
        
        // Reset page
        currentPage = 1;
        
        // Update projects
        filterAndSortProjects();
        displayProjects();
    }
    
    function addActiveFilter(category) {
        if (activeFilters) {
            const filterTag = document.createElement('div');
            filterTag.className = 'filter-tag';
            filterTag.dataset.category = category;
            
            filterTag.innerHTML = `
                <span>${category}</span>
                <span class="remove-filter" data-category="${category}">
                    <i class="fas fa-times"></i>
                </span>
            `;
            
            filterTag.querySelector('.remove-filter').addEventListener('click', function() {
                // Uncheck the corresponding checkbox
                const checkbox = document.querySelector(`#category-filters input[value="${category}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                }
                
                // Remove from active categories
                activeCategories = activeCategories.filter(cat => cat !== category);
                
                // Remove the filter tag
                removeActiveFilter(category);
                
                // Update projects
                currentPage = 1;
                filterAndSortProjects();
                displayProjects();
            });
            
            activeFilters.appendChild(filterTag);
        }
    }
    
    function removeActiveFilter(category) {
        if (activeFilters) {
            const filterTag = activeFilters.querySelector(`.filter-tag[data-category="${category}"]`);
            if (filterTag) {
                activeFilters.removeChild(filterTag);
            }
        }
    }
    
    function filterAndSortProjects() {
        // Filter projects
        filteredProjects = projectsData.filter(project => {
            // Check search term
            const matchesSearch = searchTerm === '' || 
                project.title.toLowerCase().includes(searchTerm) || 
                project.description.toLowerCase().includes(searchTerm) ||
                (project.technologies && project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))) ||
                (project.category && project.category.toLowerCase().includes(searchTerm));
            
            // Check categories
            const matchesCategory = activeCategories.length === 0 || 
                (project.category && activeCategories.includes(project.category));
            
            return matchesSearch && matchesCategory;
        });
        
        // Sort projects
        filteredProjects.sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'a-z':
                    return a.title.localeCompare(b.title);
                case 'z-a':
                    return b.title.localeCompare(a.title);
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });
        
        // Update counters
        if (visibleCount && totalCount) {
            const startIndex = (currentPage - 1) * projectsPerPage;
            const endIndex = Math.min(startIndex + projectsPerPage, filteredProjects.length);
            const visibleProjects = endIndex - startIndex;
            
            visibleCount.textContent = visibleProjects;
            totalCount.textContent = filteredProjects.length;
        }
    }
    
    function displayProjects() {
        projectsGrid.innerHTML = '';
        
        // Calculate pagination
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = Math.min(startIndex + projectsPerPage, filteredProjects.length);
        
        // Check if there are any results
        if (filteredProjects.length === 0) {
            projectsGrid.classList.add('hidden');
            pagination.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        } else {
            projectsGrid.classList.remove('hidden');
            pagination.classList.remove('hidden');
            noResults.classList.add('hidden');
        }
        
        // Display current page of projects
        for (let i = startIndex; i < endIndex; i++) {
            const project = filteredProjects[i];
            const card = createProjectCard(project);
            projectsGrid.appendChild(card);
        }
        
        // Update pagination
        createPagination(totalPages);
        
        // Set up event listeners for new project detail buttons
        setupProjectDetailButtons();
    }
    
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'group relative overflow-hidden rounded-xl bg-gray-900/50 hover:bg-gray-900/80 transition-all duration-300 project-card';
        
        // Add featured badge if project is featured
        const featuredBadge = project.featured ? 
            `<div class="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Featured</div>` : '';
        
        // Get the first 3 technologies for the card
        const technologies = project.technologies.slice(0, 3);
        const remainingTechs = project.technologies.length > 3 ? project.technologies.length - 3 : 0;
        
        let techHTML = '';
        technologies.forEach(tech => {
            techHTML += `<span class="project-tag">${tech}</span>`;
        });
        
        if (remainingTechs > 0) {
            techHTML += `<span class="project-tag">+${remainingTechs}</span>`;
        }
        
        card.innerHTML = `
            <!-- Project Image -->
            <div class="aspect-video w-full overflow-hidden">
                <img 
                    src="${project.image}" 
                    alt="${project.title}" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onerror="this.onerror=null;this.src='../images/placeholder.svg';"
                >
                ${featuredBadge}
            </div>
            <!-- Content -->
            <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
                <p class="text-gray-300 mb-4 text-sm line-clamp-2">${project.description}</p>
                
                <div class="project-tags mb-4">
                    ${techHTML}
                </div>
                
                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-2">
                    <button class="view-project-btn px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2" data-project-id="${project.id}">
                        <i class="fas fa-info-circle"></i> View Details
                    </button>
                    ${project.liveLink ? `
                        <a href="${project.liveLink}" target="_blank" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2">
                            <i class="fas fa-external-link-alt"></i> View Live
                        </a>
                    ` : ''}
                    ${project.repoLink ? `
                        <a href="${project.repoLink}" target="_blank" class="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm transition-colors flex items-center gap-2">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        return card;
    }
    
    function createPagination(totalPages) {
        // Clear previous pagination
        pagination.innerHTML = '';
        
        // Don't show pagination if only one page
        if (totalPages <= 1) {
            pagination.classList.add('hidden');
            return;
        } else {
            pagination.classList.remove('hidden');
        }
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.disabled = currentPage === 1;
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProjects();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.disabled = currentPage === totalPages;
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProjects();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        // Page buttons
        const pageButtons = document.createElement('div');
        pageButtons.className = 'flex space-x-2';
        
        // Determine which page buttons to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust startPage if we're showing less than 5 pages
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = i === currentPage ? 'pagination-button active' : 'pagination-button';
            pageButton.textContent = i;
            
            pageButton.addEventListener('click', () => {
                if (i !== currentPage) {
                    currentPage = i;
                    displayProjects();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            
            pageButtons.appendChild(pageButton);
        }
        
        // Append buttons to pagination container
        pagination.appendChild(prevButton);
        pagination.appendChild(pageButtons);
        pagination.appendChild(nextButton);
    }
}); 