// Tech Stack Data
const techStackData = [
    // Programming Languages
    {
        name: "JavaScript",
        iconClass: "fab fa-js",
        color: "#F7DF1E",
        category: "language"
    },
    {
        name: "TypeScript",
        iconClass: "fab fa-js",
        color: "#3178C6",
        category: "language"
    },
    {
        name: "Python",
        iconClass: "fab fa-python",
        color: "#3776AB",
        category: "language"
    },
    {
        name: "Java",
        iconClass: "fab fa-java",
        color: "#007396",
        category: "language"
    },
    {
        name: "C",
        iconClass: "fas fa-copyright",
        color: "#A8B9CC",
        category: "language"
    },
    
    // Frontend Technologies
    {
        name: "HTML5",
        iconClass: "fab fa-html5",
        color: "#E34F26",
        category: "frontend"
    },
    {
        name: "CSS3",
        iconClass: "fab fa-css3-alt",
        color: "#1572B6",
        category: "frontend"
    },
    {
        name: "React",
        iconClass: "fab fa-react",
        color: "#61DAFB",
        category: "frontend"
    },
    {
        name: "Next.js",
        iconClass: "fab fa-react",
        color: "#000000",
        category: "frontend"
    },
    
    // Backend Technologies
    {
        name: "Node.js",
        iconClass: "fab fa-node-js",
        color: "#339933",
        category: "backend"
    },
    {
        name: "Express",
        iconClass: "fas fa-server",
        color: "#000000",
        category: "backend"
    },
    {
        name: "MongoDB",
        iconClass: "fas fa-database",
        color: "#47A248",
        category: "backend"
    },
    
    // Tools & Others
    {
        name: "Git",
        iconClass: "fab fa-git-alt",
        color: "#F05032",
        category: "tool"
    },
    {
        name: "GitHub",
        iconClass: "fab fa-github",
        color: "#181717",
        category: "tool"
    },
    {
        name: "VS Code",
        iconClass: "fas fa-code",
        color: "#007ACC",
        category: "tool"
    }
];

// Projects Data
const projectsData = [
    {
        id: 1,
        title: "E-Commerce Platform",
        slug: "e-commerce-platform",
        description: "A full-stack e-commerce solution with responsive design, user authentication, product filtering, and secure checkout.",
        longDescription: "This comprehensive e-commerce platform offers a seamless shopping experience with features like user authentication, product filtering, cart management, and secure payment processing. The admin panel allows for easy product and inventory management, while analytics provide valuable business insights.",
        image: "../images/projects/ecommerce.jpg",
        date: "2023-08-15",
        category: "Web Development",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe API"],
        liveLink: "https://example-ecommerce.com",
        repoLink: "https://github.com/username/ecommerce-platform",
        featured: true,
        features: [
            "User authentication and profile management",
            "Product search and filtering",
            "Shopping cart and wishlist functionality",
            "Secure payment processing with Stripe",
            "Admin dashboard for inventory management",
            "Order tracking and history"
        ]
    },
    {
        id: 2,
        title: "AI Image Generator",
        slug: "ai-image-generator",
        description: "A web application that uses AI to generate unique images based on text prompts, built with the OpenAI API.",
        longDescription: "This innovative application leverages OpenAI's powerful image generation capabilities to create unique, high-quality images based on user-provided text prompts. Users can customize generation parameters, save favorites, and download images in various formats.",
        image: "../images/projects/ai-image-generator.jpg",
        date: "2023-06-20",
        category: "AI & Machine Learning",
        technologies: ["React", "Next.js", "OpenAI API", "Tailwind CSS", "Vercel"],
        liveLink: "https://ai-image-generator-demo.vercel.app",
        repoLink: "https://github.com/username/ai-image-generator",
        featured: true,
        features: [
            "Text-to-image generation using OpenAI's DALL-E",
            "Customizable image parameters",
            "User gallery for saving generated images",
            "Social sharing capabilities",
            "Responsive design for all devices",
            "Image editing and enhancement tools"
        ]
    },
    {
        id: 3,
        title: "Task Manager",
        slug: "task-manager",
        description: "A productivity application for task management with features like drag-and-drop organization, reminders, and team collaboration.",
        longDescription: "This comprehensive task management solution helps individuals and teams organize their work efficiently. With features like drag-and-drop task boards, priority levels, deadline reminders, and collaborative workspaces, it streamlines productivity workflows and improves team coordination.",
        image: "../images/projects/task-manager.jpg",
        date: "2023-04-10",
        category: "Web Development",
        technologies: ["Vue.js", "Firebase", "Vuex", "SCSS", "PWA"],
        liveLink: "https://task-manager-app.web.app",
        repoLink: "https://github.com/username/task-manager",
        featured: false,
        features: [
            "Kanban board with drag-and-drop functionality",
            "Task prioritization and deadline tracking",
            "Team collaboration features",
            "Real-time notifications and reminders",
            "Progressive Web App for offline use",
            "Data visualization for productivity insights"
        ]
    },
    {
        id: 4,
        title: "Weather Dashboard",
        slug: "weather-dashboard",
        description: "A weather application providing real-time forecasts, interactive maps, and weather alerts for locations worldwide.",
        longDescription: "This comprehensive weather dashboard provides users with accurate, real-time weather data from multiple sources. Features include current conditions, 7-day forecasts, interactive radar maps, severe weather alerts, and historical data comparison. The application is optimized for both desktop and mobile use.",
        image: "../images/projects/weather-dashboard.jpg",
        date: "2023-02-05",
        category: "Web Development",
        technologies: ["JavaScript", "Bootstrap", "Weather API", "Chart.js", "Leaflet Maps"],
        liveLink: "https://weather-dashboard-demo.netlify.app",
        repoLink: "https://github.com/username/weather-dashboard",
        featured: false,
        features: [
            "Real-time weather data and forecasts",
            "Interactive weather maps",
            "Location-based weather detection",
            "Severe weather alerts",
            "Historical weather data comparison",
            "Customizable dashboard layout"
        ]
    },
    {
        id: 5,
        title: "Fitness Tracking App",
        slug: "fitness-tracking-app",
        description: "A mobile fitness application for tracking workouts, nutrition, and health metrics with personalized insights.",
        longDescription: "This comprehensive fitness tracking application helps users monitor their health and fitness journey. It offers workout tracking, nutrition logging, body metrics monitoring, and personalized fitness insights. The app integrates with wearable devices for more accurate data collection and provides custom workout plans based on user goals.",
        image: "../images/projects/fitness-app.jpg",
        date: "2022-11-18",
        category: "Mobile Development",
        technologies: ["React Native", "Redux", "Firebase", "Health API", "Expo"],
        liveLink: "https://expo.dev/@username/fitness-tracker",
        repoLink: "https://github.com/username/fitness-tracker",
        featured: true,
        features: [
            "Customizable workout plans and tracking",
            "Nutrition and meal logging",
            "Progress visualization and analytics",
            "Integration with wearable fitness devices",
            "Community challenges and social features",
            "Personalized health insights and recommendations"
        ]
    },
    {
        id: 6,
        title: "Portfolio Website",
        slug: "portfolio-website",
        description: "A modern portfolio website showcasing my projects, skills, and professional experience with a clean, responsive design.",
        longDescription: "This personal portfolio website was designed to showcase my professional work, skills, and experience in a clean, modern interface. Built with performance and accessibility in mind, it features smooth animations, responsive design, and optimized load times. The project section includes detailed case studies and the blog features technical articles.",
        image: "../images/projects/portfolio.jpg",
        date: "2022-09-30",
        category: "Web Development",
        technologies: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Aceternity UI"],
        liveLink: "https://sasanka-portfolio.com",
        repoLink: "https://github.com/username/portfolio",
        featured: false,
        features: [
            "Responsive design for all device sizes",
            "Interactive project showcases",
            "Skills and experience sections",
            "Contact form with validation",
            "Performance optimized with 90+ Lighthouse score",
            "Blog section for technical articles"
        ]
    },
    {
        id: 7,
        title: "Recipe Finder",
        slug: "recipe-finder",
        description: "A recipe discovery application that allows users to find recipes based on available ingredients, dietary restrictions, and preferences.",
        longDescription: "This recipe discovery application helps users find the perfect meal based on their available ingredients, dietary restrictions, and culinary preferences. It features an extensive recipe database, personalized recommendations, nutrition information, and step-by-step cooking instructions with timers and videos.",
        image: "../images/projects/recipe-finder.jpg",
        date: "2022-07-15",
        category: "Web Development",
        technologies: ["Angular", "TypeScript", "Node.js", "MongoDB", "Spoonacular API"],
        liveLink: "https://recipe-finder-app.netlify.app",
        repoLink: "https://github.com/username/recipe-finder",
        featured: false,
        features: [
            "Ingredient-based recipe search",
            "Dietary restriction and allergy filters",
            "Nutritional information and analysis",
            "Meal planning and grocery list generation",
            "Favorite recipes and collection management",
            "Step-by-step cooking instructions with timers"
        ]
    },
    {
        id: 8,
        title: "Budget Tracker",
        slug: "budget-tracker",
        description: "A financial management application for tracking expenses, income, and budgets with visual reports and insights.",
        longDescription: "This comprehensive budget tracking application helps users take control of their finances by monitoring expenses, income, and savings goals. It features customizable budget categories, visual spending reports, recurring transaction tracking, and financial insights to help users make better financial decisions.",
        image: "../images/projects/budget-tracker.jpg",
        date: "2022-05-20",
        category: "Web Development",
        technologies: ["React", "Firebase", "D3.js", "Material UI", "PWA"],
        liveLink: "https://budget-tracker-app.web.app",
        repoLink: "https://github.com/username/budget-tracker",
        featured: false,
        features: [
            "Expense and income tracking by category",
            "Customizable budget creation and monitoring",
            "Visual reports and spending analysis",
            "Financial goal setting and tracking",
            "Recurring transaction management",
            "Export functionality for financial records"
        ]
    },
    {
        id: 9,
        title: "Smart Home Dashboard",
        slug: "smart-home-dashboard",
        description: "An IoT dashboard for managing and monitoring smart home devices with automation capabilities and energy insights.",
        longDescription: "This comprehensive smart home control center allows users to manage all their connected devices from a single interface. It features device control, automation scheduling, energy usage monitoring, and security camera integration. The system uses machine learning to learn user preferences and optimize home automation for comfort and energy efficiency.",
        image: "../images/projects/smart-home.jpg",
        date: "2022-03-10",
        category: "IoT & Web Development",
        technologies: ["React", "Node.js", "MQTT", "WebSockets", "Chart.js", "IoT APIs"],
        liveLink: "https://smart-home-demo.netlify.app",
        repoLink: "https://github.com/username/smart-home-dashboard",
        featured: true,
        features: [
            "Centralized control for all smart home devices",
            "Automation routines and scheduling",
            "Energy usage monitoring and optimization",
            "Security system integration and alerts",
            "Voice control capabilities",
            "AI-powered suggestions for energy savings"
        ]
    }
]; 