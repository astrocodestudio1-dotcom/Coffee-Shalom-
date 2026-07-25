/* ==========================================================================
   COFFEE SHALOM - INTERACTIVIDAD & ANIMACIONES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Ocultar Loader de forma fluida (Corregido y asegurado)
    const loader = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    const progress = document.querySelector('.progress');
    
    if (loader) {
        let width = 0;
        const interval = setInterval(() => {
            width += Math.floor(Math.random() * 20) + 10;
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
                if (progress) progress.style.width = '100%';
                
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    loader.style.display = 'none';
                }, 300);
            } else {
                if (progress) progress.style.width = width + '%';
            }
        }, 80);

        // Fallback de seguridad por si el intervalo falla por cualquier motivo
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                clearInterval(interval);
                if (progress) progress.style.width = '100%';
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                loader.style.display = 'none';
            }
        }, 3000);
    }

    // 2. Navbar Scroll Effect
    const navbar = id('header') || document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Menú Mobile Toggle
    const mobileToggle = id('mobile-toggle') || document.querySelector('.mobile-toggle');
    const navMenu = id('nav-menu') || document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 4. Efecto de Contadores Animados en Hero
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    window.addEventListener('scroll', () => {
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats && !animatedStats) {
            const pos = heroStats.getBoundingClientRect().top;
            if (pos < window.innerHeight) {
                statNumbers.forEach(stat => {
                    const targetAttr = stat.getAttribute('data-target');
                    const target = targetAttr ? +targetAttr : parseInt(stat.innerText) || 100;
                    let count = 0;
                    const speed = target / 50 || 1;

                    const updateCount = () => {
                        count += speed;
                        if (count < target) {
                            stat.innerText = Math.ceil(count);
                            setTimeout(updateCount, 30);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCount();
                });
                animatedStats = true;
            }
        }
    });

    // 5. Carrusel de Café
    const track = document.getElementById('coffee-track');
    const prevBtn = document.getElementById('coffee-prev');
    const nextBtn = document.getElementById('coffee-next');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const slides = track.children;
        const totalSlides = slides.length;

        function updateCarousel() {
            const slideWidth = slides[0].getBoundingClientRect().width + 30; // ancho + gap
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 3) {
                currentIndex++;
            } else {
                currentIndex = 0; // Regresar al inicio
            }
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - 3 > 0 ? totalSlides - 3 : 0;
            }
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
    }

    // 6. Filtros Dinámicos del Menú
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 7. Lightbox de Galería
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = id('lightbox') || document.querySelector('.lightbox-modal');
    const lightboxImg = id('lightbox-img') || document.querySelector('.lightbox-content');
    const closeLightbox = document.querySelector('.close-lightbox');

    if (lightbox && lightboxImg) {
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
            });
        });

        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // 8. Formulario de Contacto Avanzado con Redirección a WhatsApp
    const contactForm = id('contact-form') || document.querySelector('#contact-form');
    const formStatus = id('form-status') || document.querySelector('.form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !phone || !message) {
                if (formStatus) {
                    formStatus.textContent = "Por favor, completa todos los campos requeridos.";
                    formStatus.className = "form-status error";
                }
                return;
            }

            const submitBtn = contactForm.querySelector("button[type='submit']");
            let originalBtnText = "";
            if (submitBtn) {
                originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                if (formStatus) {
                    formStatus.textContent = "¡Mensaje enviado con éxito! Redirigiendo a WhatsApp...";
                    formStatus.className = "form-status success";
                }

                const waText = encodeURIComponent(`Hola Coffee Shalom, mi nombre es ${name}. Correo: ${email}. Tel: ${phone}. Mensaje/Pedido: ${message}`);
                
                setTimeout(() => {
                    window.open(`https://wa.me/?text=${waText}`, '_blank');
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }
                    if (formStatus) {
                        formStatus.textContent = "";
                        formStatus.className = "form-status";
                    }
                }, 1500);
            }, 1000);
        });
    }

    // 9. Partículas / Granos de Café Flotantes (Canvas)
    initParticles();
});

function id(e) { return document.getElementById(e); }

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 25;

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: 'rgba(201, 162, 39, ' + (Math.random() * 0.3 + 0.1) + ')',
            speedY: -Math.random() * 0.5 - 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            p.y += p.speedY;
            if (p.y < 0) p.y = canvas.height;
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
