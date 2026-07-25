/* ==========================================================================
   COFFEE SHALOM - INTERACTIVIDAD & CONTROLADORES DE ANIMACIÓN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Loader Control
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 1800);

    // 2. Transición del Header en Scroll
    const navbar = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Menú Móvil Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 4. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Animación de Contadores Estadísticos
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    window.addEventListener('scroll', () => {
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats && !animatedStats) {
            const pos = heroStats.getBoundingClientRect().top;
            if (pos < window.innerHeight) {
                statNumbers.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    let count = 0;
                    const speed = target / 40;

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

    // 6. Filtro Dinámico para Menú
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
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

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

    // 8. Envío de Formulario
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.innerHTML = '<p style="color: #C9A227; margin-top: 15px;">¡Muchas gracias! Tu mensaje ha sido enviado. Nos pondremos en contacto a la brevedad.</p>';
            contactForm.reset();
        });
    }

    // 9. Motor de Partículas Interactivas
    initParticles();
});

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 30;

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2.5 + 1,
            color: 'rgba(201, 162, 39, ' + (Math.random() * 0.3 + 0.1) + ')',
            speedY: -Math.random() * 0.4 - 0.1
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
}
