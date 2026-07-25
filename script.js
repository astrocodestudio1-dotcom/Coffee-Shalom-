document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. LOADER INICIAL
    ========================================= */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 800);
    });


    /* =========================================
       2. CANVAS: GRANOS DE CAFÉ FLOTANTES
    ========================================= */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const numberOfParticles = 35;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class CoffeeParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 2;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
        }
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new CoffeeParticle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* =========================================
       3. NAVBAR SCROLLED Y MENÚ MÓVIL
    ========================================= */
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });


    /* =========================================
       4. CONTADOR ANIMADO (ESTADÍSTICAS)
    ========================================= */
    const statsSection = document.querySelector('.hero-stats');
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let started = false;

    function startCounters() {
        statNumbers.forEach(num => {
            const target = +num.getAttribute('data-target');
            let count = 0;
            const speed = target / 30; // Velocidad de conteo

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    num.innerText = Math.ceil(count);
                    setTimeout(updateCount, 40);
                } else {
                    num.innerText = target;
                }
            };
            updateCount();
        });
    }

    window.addEventListener('scroll', () => {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && !started) {
            startCounters();
            started = true;
        }
    });


    /* =========================================
       5. FILTRO DE CATÁLOGO / MENÚ
    ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Activar botón actual
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'flex';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });


    /* =========================================
       6. LIGHTBOX PARA LA GALERÍA
    ========================================= */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
        }
    });


    /* =========================================
       7. FORMULARIO CON REDIRECCIÓN A WHATSAPP
    ========================================= */
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;

            // Reemplaza este número de teléfono con el tuyo real (incluyendo código de país, ej: 34 o 52)
            const whatsappNumber = "34600000000"; 

            const text = `Hola, mi nombre es *${name}*%0A` +
                         `Correo: *${email}*%0A` +
                         `Teléfono: *${phone}*%0A` +
                         `Mensaje / Pedido: _${message}_`;

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

            const statusDiv = document.getElementById('form-status');
            statusDiv.style.color = "var(--gold)";
            statusDiv.innerHTML = "¡Redirigiendo a WhatsApp para enviar tu pedido...";

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                statusDiv.innerHTML = "¡Mensaje listo para enviar!";
                contactForm.reset();
            }, 1000);
        });
    }

});
