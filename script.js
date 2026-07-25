const products = [
    { id: 1, name: "Café Shalom Premium", price: 280, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Trufas de Autor (Caja)", price: 450, image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Tarta de Chocolate & Cerezo", price: 310, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" }
];

let cart = JSON.parse(localStorage.getItem('coffee_shalom_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1000);

    renderProducts();
    updateCartUI();

    document.getElementById('cart-btn')?.addEventListener('click', openCart);
    document.getElementById('close-cart')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.getElementById('clear-cart-btn')?.addEventListener('click', clearCart);
    document.getElementById('stripe-checkout-btn')?.addEventListener('click', () => {
        if(cart.length === 0) return alert("Tu carrito está vacío.");
        alert("Modo de prueba Stripe listo.");
    });
});

function renderProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <h3 class="product-title">${p.name}</h3>
            <p class="product-price">$${p.price} MXN</p>
            <button onclick="addToCart(${p.id})" class="btn btn-gold btn-block">Añadir al Carrito</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.quantity += 1; } 
    else { cart.push({ ...product, quantity: 1 }); }
    saveCart();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
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
            itemsEl.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Tu carrito está vacío.</p>';
        } else {
            itemsEl.innerHTML = cart.map(item => `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #333; padding-bottom:8px;">
                    <div>
                        <h4 style="font-size:0.9rem;">${item.name}</h4>
                        <p style="color:var(--color-gold); font-size:0.8rem;">$${item.price} x ${item.quantity}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">&times;</button>
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
