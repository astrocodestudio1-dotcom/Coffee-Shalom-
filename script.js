/* ==========================================
   COFFEE SHALOM® - SCRIPT PRINCIPAL
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. LOADER ANIMADO
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 600);
    });
    // Fallback por si el evento load tarda
    setTimeout(() => {
        if (!loader.classList.contains('fade-out')) {
            loader.classList.add('fade-out');
        }
    }, 2000);

    // 2. MENÚ MÓVIL (HAMBURGUESA)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerBtn.classList.remove('open');
        });
    });

    // 3. BASE DE DATOS DE PRODUCTOS
    const productsData = [
        {
            id: 'cafe-reserva-500',
            name: 'Café Coffee Shalom - Reserva Exclusiva 500g',
            category: 'cafe',
            price: 349.00,
            desc: 'Notas de cata excepcionales con sutiles matices de chocolate amargo y frutos secos.',
            img: 'assets/img/product-cafe-shalom.jpg',
            tag: 'Exclusivo'
        },
        {
            id: 'cafe-tradicional-1kg',
            name: 'Café Coffee Shalom - Grano Tradicional 1Kg',
            category: 'cafe',
            price: 580.00,
            desc: 'Cuerpo completo e intenso tueste medio para los verdaderos amantes del café de altura.',
            img: 'assets/img/product-cafe-1kg.jpg',
            tag: 'Popular'
        },
        {
            id: 'chocolate-oscuro-70',
            name: 'Barra de Chocolate Artesanal 70% Cacao',
            category: 'chocolates',
            price: 120.00,
            desc: 'Fino cacao mexicano con notas florales y textura sedosa en boca.',
            img: 'assets/img/product-choc-dark.jpg',
            tag: 'Artesanal'
        },
        {
            id: 'chocolate-relleno-cafe',
            name: 'Bombones Rellenos de Crema de Café Shalom',
            category: 'chocolates',
            price: 195.00,
            desc: 'Caja con 9 piezas de chocolates finos con corazón de espresso.',
            img: 'assets/img/product-choc-coffee.jpg',
            tag: 'Gourmet'
        },
        {
            id: 'pastel-tres-chocolates',
            name: 'Pastel Fino Tres Chocolates (Rebanada/Entero)',
            category: 'reposteria',
            price: 450.00,
            desc: 'Bizcocho húmedo de chocolate con mousses de cacao blanco, con leche y amargo.',
            img: 'assets/img/product-cake-3choc.jpg',
            tag: 'Favorito'
        },
        {
            id: 'tarta-frutos-rojos',
            name: 'Tarta Artesanal de Frutos Rojos y Crema',
            category: 'reposteria',
            price: 380.00,
            desc: 'Base crujiente de mantequilla, crema ligera de vainilla y selección de frutos frescos.',
            img: 'assets/img/product-tart-berries.jpg',
            tag: 'Fresco'
        },
        {
            id: 'pan-masa-madre',
            name: 'Pan Artesanal de Masa Madre',
            category: 'pan',
            price: 85.00,
            desc: 'Fermentación lenta de 24 horas, corteza crujiente y miga suave y alveolada.',
            img: 'assets/img/product-bread-sourdough.jpg',
            tag: 'Diario'
        },
        {
            id: 'concha-gourmet',
            name: 'Concha Tradicional Gourmet (Paquete con 4)',
            category: 'pan',
            price: 70.00,
            desc: 'Cobertura crujiente de vainilla y cacao puro de alta calidad.',
            img: 'assets/img/product-bread-concha.jpg',
            tag: 'Horneado'
        }
    ];

    // Renderizar Favoritos / Destacados
    const featuredGrid = document.getElementById('featuredProductsGrid');
    const fullCatalogGrid = document.getElementById('fullCatalogGrid');

    function renderProducts(container, items) {
        if (!container) return;
        container.innerHTML = '';
        items.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card-img">
                    <img src="${product.img}" alt="${product.name}" loading="lazy">
                    <span class="product-card-tag">${product.tag}</span>
                </div>
                <div class="product-card-body">
                    <h4>${product.name}</h4>
                    <p class="product-card-desc">${product.desc}</p>
                    <div class="product-card-footer">
                        <span class="price">$${product.price.toFixed(2)} <small>MXN</small></span>
                        <button class="btn btn-primary add-to-cart-btn" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-img="${product.img}">
                            Agregar
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Inicializar grids
    renderProducts(featuredGrid, productsData.slice(0, 4));
    renderProducts(fullCatalogGrid, productsData);

    // Filtros de Catálogo
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.getAttribute('data-filter');
            
            if (filter === 'all') {
                renderProducts(fullCatalogGrid, productsData);
            } else {
                const filtered = productsData.filter(p => p.category === filter);
                renderProducts(fullCatalogGrid, filtered);
            }
            attachCartEvents();
        });
    });

    // 4. CARRITO DE COMPRAS LÓGICA (LOCALSTORAGE)
    let cart = JSON.parse(localStorage.getItem('coffee_shalom_cart')) || [];

    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartBadge = document.getElementById('cartBadge');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const stripeCheckoutBtn = document.getElementById('stripeCheckoutBtn');

    function toggleCart() {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        renderCart();
    }

    cartToggleBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    function addToCart(e) {
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;

        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        const img = btn.getAttribute('data-img');

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }

        saveCart();
        renderCart();
        
        // Abrir carrito de forma automática para feedback visual
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    }

    function attachCartEvents() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.removeEventListener('click', addToCart); // Evitar duplicados
            button.addEventListener('click', addToCart);
        });
    }
    attachCartEvents();

    function updateCartQuantities(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        saveCart();
        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
    }

    function saveCart() {
        localStorage.setItem('coffee_shalom_cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let subtotalVal = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-text">Tu carrito está actualmente vacío.</p>';
            cartBadge.textContent = '0';
            cartSubtotal.textContent = '$0.00 MXN';
            cartTax.textContent = '$0.00 MXN';
            cartTotal.textContent = '$0.00 MXN';
            return;
        }

        cart.forEach(item => {
            totalItems += item.quantity;
            subtotalVal += item.price * item.quantity;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    <span class="cart-item-price">$${item.price.toFixed(2)} MXN</span>
                    <div class="cart-item-controls">
                        <button class="qty-btn decrease-qty" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn increase-qty" data-id="${item.id}">+</button>
                        <button class="remove-item-btn" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });

        cartBadge.textContent = totalItems;
        const taxVal = subtotalVal * 0.16; // IVA 16% México
        const grandTotal = subtotalVal; // Generalmente precios en México ya incluyen IVA

        cartSubtotal.textContent = `$${subtotalVal.toFixed(2)} MXN`;
        cartTax.textContent = `$${taxVal.toFixed(2)} MXN`;
        cartTotal.textContent = `$${grandTotal.toFixed(2)} MXN`;

        // Eventos internos del carrito
        document.querySelectorAll('.increase-qty').forEach(b => {
            b.addEventListener('click', () => updateCartQuantities(b.getAttribute('data-id'), 1));
        });
        document.querySelectorAll('.decrease-qty').forEach(b => {
            b.addEventListener('click', () => updateCartQuantities(b.getAttribute('data-id'), -1));
        });
        document.querySelectorAll('.remove-item-btn').forEach(b => {
            b.addEventListener('click', () => removeFromCart(b.getAttribute('data-id')));
        });
    }

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCart();
    });

    // Simulación de Checkout con Stripe
    stripeCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos para proceder al pago.');
            return;
        }
        
        // Simulación de pasarela segura
        stripeCheckoutBtn.textContent = 'Conectando con Stripe...';
        setTimeout(() => {
            alert('Redirigiendo a pasarela segura de pago Stripe para Coffee Shalom. ¡Gracias por tu compra!');
            stripeCheckoutBtn.textContent = 'Pagar con Stripe';
            cart = [];
            saveCart();
            renderCart();
            toggleCart();
        }, 1500);
    });

    // Cargar estado inicial del carrito
    renderCart();

    // 5. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    // 6. VALIDACIÓN DEL FORMULARIO DE CONTACTO
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nombre = document.getElementById('nombre');
            const correo = document.getElementById('correo');
            const mensaje = document.getElementById('mensaje');
            const successMsg = document.getElementById('formSuccess');

            // Validación Nombre
            if (!nombre.value.trim()) {
                nombre.closest('.form-group').classList.add('error');
                isValid = false;
            } else {
                nombre.closest('.form-group').classList.remove('error');
            }

            // Validación Correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo.value.trim())) {
                correo.closest('.form-group').classList.add('error');
                isValid = false;
            } else {
                correo.closest('.form-group').classList.remove('error');
            }

            // Validación Mensaje
            if (!mensaje.value.trim()) {
                mensaje.closest('.form-group').classList.add('error');
                isValid = false;
            } else {
                mensaje.closest('.form-group').classList.remove('error');
            }

            if (isValid) {
                successMsg.style.display = 'block';
                contactForm.reset();
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            }
        });
    }
});
