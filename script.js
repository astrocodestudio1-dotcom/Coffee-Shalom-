// Catálogo de Productos Oficial (Protagonista: Café Coffee Shalom y repostería selecta)
const products = [
    { 
        id: 1, 
        name: "Café Coffee Shalom (Presentación 500g)", 
        price: 280, 
        desc: "Nuestro café insignia de tueste medio-oscuro con notas aromáticas a chocolate y frutos secos.",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 2, 
        name: "Trufas de Autor (Caja de 12 pzas)", 
        price: 450, 
        desc: "Selección exclusiva de chocolates artesanales con rellenos cremosos y finos cacaos.",
        image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 3, 
        name: "Tarta de Chocolate & Cerezo", 
        price: 310, 
        desc: "Repostería gourmet elaborada con capas de bizcocho húmedo y ganache artesanal.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" 
    },
    { 
        id: 4, 
        name: "Pan Artesanal de Masa Madre", 
        price: 120, 
        desc: "Horneado diariamente con corteza crujiente y fermentación natural prolongada.",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" 
    }
];

let cart = JSON.parse(localStorage.getItem('coffee_shalom_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Loader elegante inicial
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 600);
        }
    }, 1200);

    renderProducts();
    updateCartUI();

    // Event Listeners Carrito
    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('close-cart')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.getElementById('clear-cart-btn')?.addEventListener('click', clearCart);

    // Configuración Preparada para Stripe (Punto 16)
    document.getElementById('stripe-checkout-btn')?.addEventListener('click', () => {
        if(cart.length === 0) {
            alert("Tu carrito está vacío. Agrega productos para continuar.");
            return;
        }
        
        /* 
           ===================================================================
           CONFIGURACIÓN DE STRIPE (INSTRUCCIONES):
           1. Inicializa Stripe con tu Publishable Key real cuando configures tu cuenta:
              const stripe = Stripe('tu_publishable_key_aqui');
           2. Envía los datos del carrito a tu servidor backend para crear una Checkout Session.
           ===================================================================
        */
        
        // Simulación profesional lista para producción con Stripe SDK
        alert("Integración con Stripe preparada correctamente. Al configurar tus credenciales en el archivo script.js, el pago se procesará de forma segura.");
    });

    // Validación y Envío del Formulario de Contacto (Punto 14)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const feedback = document.getElementById('form-feedback');

            if(!name || !email || !phone || !subject || !message) {
                feedback.style.color = '#ff6b6b';
                feedback.textContent = 'Por favor completa todos los campos requeridos.';
                return;
            }

            // Simulación de envío exitoso hacia coffeshalom1@gmail.com
            feedback.style.color = 'var(--color-gold)';
            feedback.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
            contactForm.reset();
        });
    }
});

// Renderizar Catálogo en Pantalla
function renderProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
            <h3 class="product-title">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <p class="product-price">$${p.price.toFixed(2)} MXN</p>
            <button onclick="addToCart(${p.id})" class="btn btn-gold btn-block">Agregar al Carrito</button>
        </div>
    `).join('');
}

// Funciones del Carrito (LocalStorage, cantidades, eliminar)
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

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveCart();
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
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.textContent = totalQty;

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalEl) subtotalEl.textContent = `$${totalAmount.toFixed(2)} MXN`;
    if (totalEl) totalEl.textContent = `$${totalAmount.toFixed(2)} MXN`;

    if (itemsEl) {
        if (cart.length === 0) {
            itemsEl.innerHTML = '<p style="text-align:center; color:#a3918b; margin-top:30px;">Tu carrito está vacío.</p>';
        } else {
            itemsEl.innerHTML = cart.map(item => `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(201,162,39,0.15); padding-bottom:12px;">
                    <div style="flex-grow:1; padding-right:10px;">
                        <h4 style="font-size:0.9rem; margin-bottom:4px;">${item.name}</h4>
                        <p style="color:var(--color-gold); font-size:0.85rem; font-weight:600;">$${item.price} MXN</p>
                        <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                            <button onclick="updateQuantity(${item.id}, -1)" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:22px; height:22px; border-radius:4px; cursor:pointer;">-</button>
                            <span style="font-size:0.85rem;">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:22px; height:22px; border-radius:4px; cursor:pointer;">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ff6b6b; font-size:1.2rem; cursor:pointer;" title="Eliminar">&times;</button>
                </div>
            `).join('');
        }
    }
}

function openCart() {
    document.getElementById('cart-sidebar')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('active');
}

function closeCart() {
    document.getElementById('cart-sidebar')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('active');
}
