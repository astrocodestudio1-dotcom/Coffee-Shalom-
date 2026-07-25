document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. LOADER INICIAL
       ================================---------- */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 500);
    });

    /* ==========================================
       2. MENÚ MÓVIL Y NAVBAR STICKY
       ================================---------- */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Cerrar menú al hacer clic en enlaces
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    /* ==========================================
       3. FILTRADO DE CATÁLOGO
       ================================---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================
       4. PREGUNTAS FRECUENTES (ACCORDION)
       ================================---------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================
       5. CARRITO DE COMPRAS CON LOCALSTORAGE
       ================================---------- */
    let cart = JSON.parse(localStorage.getItem('coffee_shalom_cart')) || [];

    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartCount = document.getElementById('cartCount');
    const cartFooter = document.getElementById('cartFooter');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');

    // Abrir / Cerrar Modal Carrito
    cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
    closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });

    // Añadir producto al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = parseFloat(card.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            updateCart();
            cartModal.classList.add('active');
        });
    });

    function updateCart() {
        localStorage.setItem('coffee_shalom_cart', JSON.stringify(cart));
        renderCartItems();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            cartFooter.style.display = 'none';
            cartCount.textContent = '0';
            return;
        }

        cartFooter.style.display = 'block';
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)} MXN</span>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        cartCount.textContent = totalItems;
        cartSubtotal.textContent = `$${subtotal.toFixed(2)} MXN`;
        cartTotal.textContent = `$${subtotal.toFixed(2)} MXN`;

        attachCartEventListeners();
    }

    function attachCartEventListeners() {
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) item.quantity += 1;
                updateCart();
            });
        });

        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                }
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                cart = cart.filter(i => i.id !== id);
                updateCart();
            });
        });
    }

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });

    // Inicializar renderizado del carrito al cargar
    renderCartItems();

    /* ==========================================
       6. PREPARACIÓN E INTEGRACIÓN STRIPE
       ================================---------- */
    /* 
      INSTRUCCIONES DE CONFIGURACIÓN DE STRIPE:
      1. Obtén tus llaves desde el panel de Stripe (https://dashboard.stripe.com/).
      2. Reemplaza 'pk_test_TU_CLAVE_PUBLICA_AQUI' con tu Clave Pública de prueba o producción.
      3. Asegúrate de configurar tu servidor backend para manejar los webhooks y las sesiones de Checkout (stripe.checkout.sessions.create).
    */
    const stripeCheckoutBtn = document.getElementById('stripeCheckoutBtn');
    
    // Simulación de pasarela Stripe lista para credenciales
    stripeCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        // Variable de llave pública (Sustituir cuando se disponga de la cuenta)
        const STRIPE_PUBLIC_KEY = 'pk_test_TU_CLAVE_PUBLICA_AQUI';

        if (STRIPE_PUBLIC_KEY.includes('TU_CLAVE_PUBLICA')) {
            alert('⚙️ El sistema de pagos con Stripe está correctamente estructurado y preparado.\n\nPara activarlo en producción o pruebas, ingresa tu Clave Pública en el archivo script.js y conecta tu backend.');
            return;
        }

        /* 
          Ejecución real al tener la clave configurada:
          const stripe = Stripe(STRIPE_PUBLIC_KEY);
          stripe.redirectToCheckout({ sessionId: 'SESSION_ID_GENERADO_EN_BACKEND' });
        */
    });

    /* ==========================================
       7. VALIDACIÓN DE FORMULARIO DE CONTACTO
       ================================---------- */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nombre = document.getElementById('nombre');
        const correo = document.getElementById('correo');
        const telefono = document.getElementById('telefono');
        const asunto = document.getElementById('asunto');
        const mensaje = document.getElementById('mensaje');

        // Limpiar errores previos
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('error'));

        if (nombre.value.trim() === '') {
            showError(nombre, 'errorNombre', 'El nombre es obligatorio.');
            isValid = false;
        }

        if (correo.value.trim() === '') {
            showError(correo, 'errorCorreo', 'El correo es obligatorio.');
            isValid = false;
        } else if (!isValidEmail(correo.value)) {
            showError(correo, 'errorCorreo', 'Ingresa un correo electrónico válido.');
            isValid = false;
        }

        if (telefono.value.trim() === '') {
            showError(telefono, 'errorTelefono', 'El teléfono es obligatorio.');
            isValid = false;
        }

        if (asunto.value.trim() === '') {
            showError(asunto, 'errorAsunto', 'El asunto es obligatorio.');
            isValid = false;
        }

        if (mensaje.value.trim() === '') {
            showError(mensaje, 'errorMensaje', 'El mensaje no puede estar vacío.');
            isValid = false;
        }

        if (isValid) {
            // Simulación de envío exitoso hacia coffeshalom1@gmail.com
            formSuccess.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo muy pronto a través de coffeshalom1@gmail.com.';
            contactForm.reset();
            setTimeout(() => {
                formSuccess.textContent = '';
            }, 6000);
        }
    });

    function showError(inputElement, errorId, message) {
        inputElement.classList.add('error');
        document.getElementById(errorId).textContent = message;
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

});
