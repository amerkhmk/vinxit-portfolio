document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    /* --- Apple-like Pinned Image Sequence Scrubber --- */
    const canvas = document.getElementById('hero-scrubber');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 240;
        
        // Helper to get image path (001 to 240)
        const currentFrame = index => (
            `public/images/hero section/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`
        );

        // Preload images into memory
        const images = [];
        let imagesLoaded = 0;
        
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
            
            // Draw the first frame as soon as it loads to prevent blank screen
            if (i === 0) {
                img.onload = () => {
                    canvas.width = img.width || 1920;
                    canvas.height = img.height || 1080;
                    context.drawImage(img, 0, 0);
                };
            }
        }

        const updateImage = index => {
            const img = images[index];
            if (img && img.complete) {
                // Keep native resolution for crispness, CSS handles the cover aspect ratio
                canvas.width = img.width || 1920;
                canvas.height = img.height || 1080;
                context.clearRect(0, 0, canvas.width, canvas.height); // prevent ghosting on transparent frames
                context.drawImage(img, 0, 0);
            }
        };

        const heroSection = document.querySelector('.pinned-hero');
        const feature1 = document.querySelector('.feature-1');
        const feature2 = document.querySelector('.feature-2');
        const feature3 = document.querySelector('.feature-3');

        window.addEventListener('scroll', () => {
            const rect = heroSection.getBoundingClientRect();
            const maxScroll = rect.height - window.innerHeight;
            
            // Calculate progress (0 to 1) inside the pinned section
            let progress = -rect.top / maxScroll;
            
            // Clamp progress
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;

            // Calculate current frame index (0 to 239)
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(progress * frameCount)
            );

            requestAnimationFrame(() => updateImage(frameIndex));

            // Sync Text Overlays to Scroll Progress
            // Feature 1 visible between 5% and 30%
            if (progress > 0.05 && progress <= 0.3) {
                feature1.style.opacity = '1';
                feature1.style.transform = 'translateY(0)';
            } else {
                feature1.style.opacity = '0';
                feature1.style.transform = progress > 0.3 ? 'translateY(-30px)' : 'translateY(30px)';
            }

            // Feature 2 visible between 35% and 65%
            if (progress > 0.35 && progress <= 0.65) {
                feature2.style.opacity = '1';
                feature2.style.transform = 'translateY(0)';
            } else {
                feature2.style.opacity = '0';
                feature2.style.transform = progress > 0.65 ? 'translateY(-30px)' : 'translateY(30px)';
            }

            // Feature 3 visible between 70% and 100%
            if (progress > 0.70 && progress <= 1.0) {
                feature3.style.opacity = '1';
                feature3.style.transform = 'translateY(0)';
            } else {
                feature3.style.opacity = '0';
                feature3.style.transform = progress > 1.0 ? 'translateY(-30px)' : 'translateY(30px)';
            }
        });
    }

    /* --- Intersection Observer for Sections below the Hero --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('skills-content')) {
                    const progressBars = document.querySelectorAll('.progress-bar');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* --- Active Navigation Link Update --- */
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.desktop-nav a');

    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') && link.getAttribute('href').substring(1) === section.getAttribute('id')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    /* --- Contact Form Submit --- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;
            setTimeout(() => {
                alert('Thank you for your message! VINX IT Solutions will get back to you soon.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }
});
