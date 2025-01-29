// Array of image URLs from placeholder service
const images = [
    'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg',  // Santorini
    'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg',  // Mountain Lake
    'https://images.pexels.com/photos/3225528/pexels-photo-3225528.jpeg',  // Japanese Temple
    'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg',  // Beach
    'https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg'   // Mountain Range
];
// Function to create and manage slideshow
function initializeSlideshow() {
    const slideshow = document.getElementById('slideshow');
    if(slideshow !== null)
    {
        let currentImageIndex = 0;
        let images_loaded = [];

        // Preload images
        images.forEach((url, index) => {
            const img = new Image();
            img.src = url;
            img.classList.add('slideshow-image');
            if (index === 0) img.classList.add('active');
            slideshow.appendChild(img);
            images_loaded.push(img);
        });

        // Function to change image
        function changeImage() {
            images_loaded[currentImageIndex].classList.remove('active');
            currentImageIndex = (currentImageIndex + 1) % images.length;
            images_loaded[currentImageIndex].classList.add('active');
        }

        // Change image every 5 seconds
        setInterval(changeImage, 5000);
    }
}
function initializeSmoothScroll() {
    const learnMoreButton = document.querySelector('a[href="#features"]');
    
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const featuresSection = document.getElementById('features');
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            
            const targetPosition = featuresSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');

    function toggleMenu() {
        document.body.classList.toggle('menu-open');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
        });
    });
    const auth = new Auth();
    initializeSlideshow();
    initializeSmoothScroll();
    if (document.querySelector('.requires-auth')) {
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'index.html';
        }
    }
});
