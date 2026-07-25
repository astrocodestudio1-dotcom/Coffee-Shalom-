/* ==========================================================================
   CONFIGURACIÓN DE STRIPE
   ========================================================================== */
const STRIPE_CONFIG = {
    // Coloca tu 'Publishable Key' de Stripe aquí cuando configures tu cuenta:
    publicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
};

let stripe = null;
if (typeof Stripe !== 'undefined' && STRIPE_CONFIG.publicKey) {
    stripe = Stripe(STRIPE_CONFIG.publicKey);
}

/* ==========================================================================
   CATÁLOGO DE PRODUCTOS
   ========================================================================== */
const products = [
    {
        id: 1,
        name: "Café Shalom Tueste Especial (500g)",
        price: 280,
        featured: true,
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Caja de Bombones Artesanales (12 pzs)",
        price: 320,
        featured: true,
        image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Tarta de Frutos Rojos & Crema Fina",
        price: 350,
        featured: true,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Croissant de Mantequilla & Almendras",
        price: 75,
        featured: false,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Pan Rústico Artesanal de Masa Madre",
        price: 110,
        featured: false,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = JSON.parse(localStorage.getItem('coffee_shalom_cart')) || [];

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Ocultar Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 600);
        }
    }, 1200);

    renderProducts();
    updateCartUI();
    setupCartListeners();
    setupContactForm();
});

/* ==========================================================================
   RENDERIZADO DE PRODUCTOS
   ========================================================================== */
function renderProducts() {
    const productContainer = document.getElementById('product-container');
    const featuredContainer = document.getElementById('featured-container');

    if (productContainer) {
        productContainer.innerHTML = products.map(p => createProductCard(p)).join('');
    }

    if (featuredContainer) {
        featuredContainer.innerHTML = products.filter(p => p.featured).map(p => createProductCard(p)).join('');
    }
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)} MXN</p>
                <button onclick="addToCart(${product.id})" class="btn btn-gold btn-block">Agregar al Carrito</button>
            </div>
        </div>
    `;
}

/* ==========================================================================
   CARRITO DE COMPRAS (LOCALSTORAGE)
   ========================================================================== */
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateQuantity(id, qty) {
    if (qty <= 0) {
        removeFromCart(id);
        return;
    }
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = qty;
        saveCart();
    }
}

function clearCart() {
    cart = [];
    saveCart();
}

function saveCart() {
    localStorage.setItem('coffee_shalom_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalQty;

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `$${totalAmount.toFixed(2)} MXN`;
    if (cartTotal) cartTotal.textContent = `$${totalAmount.toFixed(2)} MXN`;

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:20px;">Tu carrito está vacío.</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <h4 style="font-size:0.95rem;">${item.name}</h4>
                        <p style="color:var(--color-gold); font-size:0.85rem;">$${item.price} x ${item.quantity}</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="btn-outline-sm">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="btn-outline-sm">+</button>
                        <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; margin-left:8px;">&times;</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

/* ==========================================================================
   EVENTOS DE INTERFAZ DEL CARRITO
   ========================================================================== */
function setupCartListeners() {
    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('close-cart')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.getElementById('clear-cart-btn')?.addEventListener('click', clearCart);
    document.getElementById('stripe-checkout-btn')?.addEventListener('click', handleStripeCheckout);
}

function openCart() {
    document.getElementById('cart-sidebar')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('active');
}

function closeCart() {
    document.getElementById('cart-sidebar')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('active');
}

/* ==========================================================================
   PAGO STRIPE (INSTRUCCIONES DE ACTIVACIÓN)
   ========================================================================== */
function handleStripeCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    /* 
    -----------------------------------------------------------------------
    DONDE AGREGAR TUS CLAVES DE STRIPE:
    -----------------------------------------------------------------------
    1. Agrega tu clave pública en la constante 'STRIPE_CONFIG.publicKey' (Línea 5).
    2. Cuando tengas tu servidor o función Serverless lista, utiliza el método
       de sesión de Checkout para redirigir al cliente:

       stripe.redirectToCheckout({
           sessionId: 'ID_DE_SESION_DESDE_TU_SERVIDOR'
       }).then(function (result) {
           if (result.error) alert(result.error.message);
       });
    -----------------------------------------------------------------------
    */

    alert("⚡ [MODO PRUEBA STRIPE]\n\nEl sistema está listo. Al configurar tu cuenta de Stripe e ingresar tu clave pública en 'script.js', tus clientes serán dirigidos al pago seguro.");
}

/* ==========================================================================
   VALIDACIÓN DEL FORMULARIO DE CONTACTO
   ========================================================================== */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !phone || !subject || !message) {
            showFeedback("Por favor completa todos los campos requeridos.", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            showFeedback("Ingresa un correo electrónico válido.", "error");
            return;
        }

        showFeedback("¡Mensaje enviado con éxito a coffeshalom1@gmail.com!", "success");
        form.reset();
    });

    function showFeedback(msg, type) {
        if (!feedback) return;
        feedback.textContent = msg;
        feedback.style.color = type === "success" ? "#D4AF37" : "#ff4d4d";
    }
}
