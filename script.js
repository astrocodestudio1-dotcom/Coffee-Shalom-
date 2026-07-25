document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Loader Inteligente
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 1000);

    // 2. Navbar Cambia al Hacer Scroll
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 3. Menú Hamburguesa Mobile
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    });

    // 4. Scroll Reveal Animaciones
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-left, .reveal-right, .reveal-fade").forEach(el => {
        observer.observe(el);
    });

    // 5. Accordion FAQ
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(q => {
        q.addEventListener("click", () => {
            const answer = q.nextElementSibling;
            const isVisible = answer.style.display === "block";
            
            document.querySelectorAll(".faq-answer").forEach(a => a.style.display = "none");
            
            if (!isVisible) {
                answer.style.display = "block";
            }
        });
    });

    // 6. Formulario de Contacto
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            let valid = true;

            const nombre = document.getElementById("nombre");
            const email = document.getElementById("email");
            const telefono = document.getElementById("telefono");
            const asunto = document.getElementById("asunto");
            const mensaje = document.getElementById("mensaje");

            document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

            if (nombre.value.trim() === "") {
                showError(nombre, "Por favor, ingresa tu nombre.");
                valid = false;
            }

            if (!validateEmail(email.value)) {
                showError(email, "Ingresa un correo electrónico válido.");
                valid = false;
            }

            if (telefono.value.trim().length < 8) {
                showError(telefono, "Ingresa un teléfono válido.");
                valid = false;
            }

            if (asunto.value.trim() === "") {
                showError(asunto, "Ingresa el asunto.");
                valid = false;
            }

            if (mensaje.value.trim() === "") {
                showError(mensaje, "Escribe tu mensaje.");
                valid = false;
            }

            if (!valid) {
                e.preventDefault();
            }
        });
    }

    function showError(input, message) {
        const parent = input.parentElement;
        const error = parent.querySelector(".error-msg");
        if (error) error.textContent = message;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});

// 7. Lightbox Modals
function openLightbox(src) {
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    lightbox.style.display = "flex";
    img.src = src;
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}
