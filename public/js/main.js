// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Add AOS library link if not already in the document
    initParticles();
    handleBackToTop();
    animateTechElements();
    if (!document.querySelector('link[href*="aos"]')) {
        const aosCSS = document.createElement('link');
        aosCSS.rel = 'stylesheet';
        aosCSS.href = 'https://unpkg.com/aos@next/dist/aos.css';
        document.head.appendChild(aosCSS);
    }
  
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
  // Initialize particles.js
  function initParticles() {
      particlesJS('particles-js', {
          particles: {
              number: {
                  value: 30,
                  density: {
                      enable: true,
                      value_area: 800
                  }
              },
              color: {
                  value: '#22c55e'
              },
              shape: {
                  type: 'circle',
                  stroke: {
                      width: 0,
                      color: '#000000'
                  },
                  polygon: {
                      nb_sides: 5
                  }
              },
              opacity: {
                  value: 0.3,
                  random: true,
                  anim: {
                      enable: true,
                      speed: 0.5,
                      opacity_min: 0.1,
                      sync: false
                  }
              },
              size: {
                  value: 5,
                  random: true,
                  anim: {
                      enable: true,
                      speed: 2,
                      size_min: 1,
                      sync: false
                  }
              },
              line_linked: {
                  enable: true,
                  distance: 150,
                  color: '#22c55e',
                  opacity: 0.2,
                  width: 1
              },
              move: {
                  enable: true,
                  speed: 1,
                  direction: 'none',
                  random: true,
                  straight: false,
                  out_mode: 'out',
                  bounce: false,
                  attract: {
                      enable: false,
                      rotateX: 600,
                      rotateY: 1200
                  }
              }
          },
  
          interactivity: {
              detect_on: 'canvas',
              events: {
                  onhover: {
                      enable: true,
                      mode: 'grab'
                  },
                  onclick: {
                      enable: true,
                      mode: 'push'
                  },
                  resize: true
              },
              modes: {
                  grab: {
                      distance: 140,
                      line_linked: {
                          opacity: 0.5
                      }
                  },
                  push: {
                      particles_nb: 3
                  }
              }
          },
          retina_detect: true
      });
  }
  
  
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
  
    if (mobileMenuBtn && mobileMenu && menuIcon) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
            menuIcon.classList.toggle('fa-bars');
            menuIcon.classList.toggle('fa-xmark');
        });
  
        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.style.display = 'none';
                menuIcon.classList.add('fa-bars');
                menuIcon.classList.remove('fa-xmark');
            });
        });
    }
  
    // Testimonials Slider
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    const testimonialCards = testimonialsSlider ? testimonialsSlider.querySelectorAll('.testimonial-card') : [];
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        testimonialCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate corresponding dot
        if (testimonialCards[index]) {
            testimonialCards[index].style.display = 'block';
            dots[index].classList.add('active');
        }
    }
    
    // Initialize slider
    if (testimonialCards.length > 0) {
        // Set up initial display
        testimonialCards.forEach((card, index) => {
            if (index !== 0) {
                card.style.display = 'none';
            }
        });
        
        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Add click events to prev/next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
                showSlide(currentSlide);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % testimonialCards.length;
                showSlide(currentSlide);
            });
        }
        
        // Auto-rotate slides every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            showSlide(currentSlide);
        }, 5000);
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
  
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
  
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground && scrollPosition < window.innerHeight) {
                heroBackground.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            }
        });
    }
  
    // Add scroll animation to navbar
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(2, 44, 34, 0.95)';
                header.style.padding = '1rem 0';
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'transparent';
                header.style.padding = '1.5rem 0';
                header.style.boxShadow = 'none';
            }
        });
    }
  
    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        });
    });
  });
  
  
  // Animate tech elements (drone and tractor)
  function animateTechElements() {
      console.log("drone is working.")
      // Animate drone with complex path
      const drone = document.querySelector('.drone');
      const droneShadow = document.querySelector('.drone-shadow');
      
      // Fade in drone
      gsap.to(drone, {
          opacity: 1,
          duration: 1,
          delay: 2
      });
      
      // Complex path animation
      const droneTimeline = gsap.timeline({
          repeat: -1,
          repeatDelay: 1
      });
      
      droneTimeline
          .to(drone, {
              x: -100,
              y: 50,
              scale: 1.1,
              duration: 4,
              ease: 'power1.inOut'
          })
          .to(droneShadow, {
              opacity: 0.7,
              scale: 0.9,
              duration: 4,
              ease: 'power1.inOut'
          }, '-=4')
          .to(drone, {
              x: -50,
              y: -30,
              scale: 0.9,
              duration: 3,
              ease: 'power1.inOut'
          })
          .to(droneShadow, {
              opacity: 0.5,
              scale: 0.7,
              duration: 3,
              ease: 'power1.inOut'
          }, '-=3')
          .to(drone, {
              x: 100,
              y: 20,
              scale: 1.2,
              duration: 5,
              ease: 'power1.inOut'
          })
          .to(droneShadow, {
              opacity: 0.8,
              scale: 1,
              duration: 5,
              ease: 'power1.inOut'
          }, '-=5')
          .to(drone, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 4,
              ease: 'power1.inOut'
          })
          .to(droneShadow, {
              opacity: 0.6,
              scale: 0.8,
              duration: 4,
              ease: 'power1.inOut'
          }, '-=4');
      
      // Subtle rotation effect
      gsap.to(drone, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
      });
      
      // Animate tractor with modern movement
      const tractor = document.querySelector('.tractor');
      
      const tractorTimeline = gsap.timeline({
          repeat: -1,
          repeatDelay: 3
      });
      
      tractorTimeline
          .fromTo(tractor,
              { x: -100, opacity: 0 },
              { 
                  x: 0, 
                  opacity: 1, 
                  duration: 1, 
                  ease: 'power2.out' 
              }
          )
          .to(tractor, {
              x: '100vw',
              duration: 15,
              ease: 'power1.inOut'
          })
          .to(tractor, {
              opacity: 0,
              duration: 0.5
          }, '-=1');
      
      // Add bouncing effect
      gsap.to(tractor, {
          y: 5,
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
      });
  }
  
  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  
  function handleBackToTop() {
      if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
      } else {
          backToTopBtn.classList.remove('visible');
      }
  }
  
  if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }
  window.addEventListener('scroll', () => {
      handleBackToTop();
  });