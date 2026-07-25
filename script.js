/* ==========================================================================
   COFFEE SHALOM - SCRIPT DEFINITIVO Y BLINDADO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Loader Inteligente y Seguro (Se quita sí o sí usando la clase CSS)
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.progress');
    
    let width = 0;
    const interval = setInterval(() => {
        width += 30;
        if (progress) progress.style.width = width + '%';
        if (width >= 100) {
            clearInterval(interval);
            ocultarLoader();
        }
    }, 40);

    // Seguridad total: A los 1.2 segundos el loader desaparece obligatoriamente
    const safetyTimer = setTimeout(() => {
        ocultarLoader();
    }, 1200);

    function ocultarLoader() {
        if (loader) {
            loader.classList.add('oculto');
            setTimeout(() => {
                loader.style.display = 'none';
                clearTimeout(safetyTimer);
            }, 500);
        }
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('header');
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
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

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
                    const target = parseInt(stat.getAttribute('data-target')) || 100;
                    let count = 0;
                    const speed = target / 30;

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

    // 5. Formulario de Contacto y Redirección a WhatsApp
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

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
                    window.open(`https://wa.me/529971668631?text=${waText}`, '_blank');
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }
                    if (formStatus) {
                        formStatus.textContent = "";
                        formStatus.className = "form-status";
                    }
                }, 1000);
            }, 800);
        });
    }

    // 6. Partículas / Granos de Café Flotantes (Canvas)
    initParticles();
});

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 20; i++) {
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
