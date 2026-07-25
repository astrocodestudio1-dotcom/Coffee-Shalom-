/* ==========================================
   COFFEE SHALOM - SCRIPT PRINCIPAL
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. LOADER ELEGANTE --- */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    });

    // Fallback por si el evento load tarda
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 2500);


    /* --- 9 & 16. CARRITO DE COMPRAS & LOCALSTORAGE --- */
    let cart = JSON.parse(localStorage.getItem('coffeeShalomCart')) || [];

    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const stripeCheckoutBtn = document.getElementById('stripeCheckoutBtn');

    function toggleCart() {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }

    openCartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    function saveCart() {
        localStorage.setItem('coffeeShalomCart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
            cartCount.textContent = '0';
            cartSubtotal.textContent = '$0.00';
            cartTotal.textContent = '$0.00';
            return;
        }

        let totalCount = 0;
        let subtotalAmount = 0;

        cart.forEach((item, index) => {
            totalCount += item.quantity;
            subtotalAmount += item.price * item.quantity;

            const itemRow = document.createElement('div');
            itemRow.className = 'cart-item-row';
            itemRow.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn decrease-qty" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn increase-qty" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemRow);
        });

        cartCount.textContent = totalCount;
        cartSubtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
        cartTotal.textContent = `$${subtotalAmount.toFixed(2)}`;
    }

    // Agregar producto al carrito desde el catálogo
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = parseFloat(card.getAttribute('data-price'));

            const existingIndex = cart.findIndex(item => item.id === id);

            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            saveCart();
            renderCart();
            toggleCart();
        });
    });

    // Control de cantidades y eliminación dentro del carrito
    cartItemsContainer.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        
        if (e.target.classList.contains('increase-qty')) {
            cart[index].quantity += 1;
        } else if (e.target.classList.contains('decrease-qty')) {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        } else if (e.target.classList.contains('remove-item')) {
            cart.splice(index, 1);
        }

        saveCart();
        renderCart();
    });

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCart();
    });

    // Render inicial al cargar la página
    renderCart();


    /* --- 16. CONFIGURACIÓN E INTEGRACIÓN DE STRIPE --- */
    /*
       INSTRUCCIONES DE CONFIGURACIÓN DE STRIPE:
       1. Crea tu cuenta en https://stripe.com
       2. Obtén tus llaves de API (Publishable Key y Secret Key).
       3. Inicializa Stripe en tu backend o utiliza Stripe Checkout con tu Publishable Key.
       Ejemplo de inicialización en entorno de producción:
       
       const stripe = Stripe('tu_publishable_key_aqui');
       
       stripeCheckoutBtn.addEventListener('click', () => {
           if (cart.length === 0) {
               alert('Tu carrito está vacío.');
               return;
           }
           // Lógica para enviar la sesión de pago al servidor o Stripe Checkout
           alert('Redirigiendo a la pasarela de pagos segura de Stripe...');
       });
    */

    stripeCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        /* 
           TODO: Coloca aquí tu Publishable Key de Stripe cuando configures tu cuenta.
           const stripePublicKey = 'pk_test_TU_PUBLISHABLE_KEY_AQUI';
        */

        alert('🔌 Integración con Stripe preparada.\n\nPara activar los cobros reales, introduce tu Publishable Key en el archivo script.js (Línea 145) y conecta tu pasarela.');
    });


    /* --- 14. VALIDACIÓN DE FORMULARIO DE CONTACTO --- */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;

            const nombre = document.getElementById('nombre');
            const correo = document.getElementById('correo');
            const telefono = document.getElementById('telefono');
            const asunto = document.getElementById('asunto');
            const mensaje = document.getElementById('mensaje');

            // Validación Nombre
            if (nombre.value.trim() === '') {
                nombre.classList.add('error');
                isValid = false;
            } else {
                nombre.classList.remove('error');
            }

            // Validación Correo (Soporte explícito para coffeshalom1@gmail.com)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo.value.trim())) {
                correo.classList.add('error');
                isValid = false;
            } else {
                correo.classList.remove('error');
            }

            // Validación Teléfono (10 dígitos)
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(telefono.value.trim())) {
                telefono.classList.add('error');
                isValid = false;
            } else {
                telefono.classList.remove('error');
            }

            // Validación Asunto
            if (asunto.value.trim() === '') {
                asunto.classList.add('error');
                isValid = false;
            } else {
                asunto.classList.remove('error');
            }

            // Validación Mensaje
            if (mensaje.value.trim() === '') {
                mensaje.classList.add('error');
                isValid = false;
            } else {
                mensaje.classList.remove('error');
            }

            if (isValid) {
                // Simulación de envío exitoso al correo coffeshalom1@gmail.com
                formSuccess.style.display = 'block';
                contactForm.reset();

                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            }
        });
    }

});
