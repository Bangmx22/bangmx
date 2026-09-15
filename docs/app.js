// app.js — BANGMX STORE (core lengkap)
'use strict';

// ===== Utilities =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function showSection(sectionId) {
    const sections = ['products', 'order-section', 'payment-section'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === sectionId ? 'block' : 'none';
    });
}

// ===== Auth Module (localStorage) =====
const Auth = {
    usersKey: 'bangmx_users',
    adminKey: 'bangmx_admin_email',
    sessionKey: 'bangmx_session',

    getUsers() {
        try { return JSON.parse(localStorage.getItem(this.usersKey) || '[]'); }
        catch { return []; }
    },
    saveUsers(users) { localStorage.setItem(this.usersKey, JSON.stringify(users)); },

    isAdmin(email) {
        try { return localStorage.getItem(this.adminKey) === email.toLowerCase(); }
        catch { return false; }
    },
    setAdmin(email) { localStorage.setItem(this.adminKey, email.toLowerCase()); },

    currentUser() {
        try { return JSON.parse(localStorage.getItem(this.sessionKey) || 'null'); }
        catch { return null; }
    },
    isLoggedIn() { return !!this.currentUser(); },

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) return false;
        localStorage.setItem(this.sessionKey, JSON.stringify({ name: user.name, email: user.email }));
        return true;
    },
    register(name, email, password) {
        const users = this.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email sudah terdaftar.');
        }
        users.push({ name, email: email.toLowerCase(), password });
        this.saveUsers(users);
        // User pertama jadi admin
        if (users.length === 1) this.setAdmin(email.toLowerCase());
        return true;
    },
    logout() {
        localStorage.removeItem(this.sessionKey);
    },

    initNav() {
        const nav = document.querySelector('.nav-auth');
        if (!nav) return;
        if (this.isLoggedIn()) {
            const user = this.currentUser();
            nav.innerHTML = `
                <span class="text-muted" style="font-size:0.85rem">Halo, ${user.name}</span>
                <a href="admin.html" class="btn-admin">Admin</a>
                <a href="orders.html" class="btn-admin">Riwayat</a>
                <button class="btn-logout" onclick="Auth.logout(); window.location.href='index.html'">Keluar</button>
            `;
        } else {
            nav.innerHTML = `
                <a href="auth.html" class="btn-admin">Login / Daftar</a>
            `;
        }
    }
};

// ===== Order Store (localStorage) =====
const OrderStore = {
    key: 'bangmx_orders',

    getAll() {
        try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
        catch { return []; }
    },
    save(order) {
        const orders = this.getAll();
        orders.push(order);
        localStorage.setItem(this.key, JSON.stringify(orders));
        return order;
    },
    update(id, changes) {
        const orders = this.getAll();
        const idx = orders.findIndex(o => o.id === id);
        if (idx === -1) return null;
        orders[idx] = { ...orders[idx], ...changes };
        localStorage.setItem(this.key, JSON.stringify(orders));
        return orders[idx];
    },
    getByCustomer(email) {
        return this.getAll().filter(o => o.customerEmail && o.customerEmail.toLowerCase() === email.toLowerCase());
    }
};

// ===== Products =====
window.PRODUCTS = [
    { id: 'pubg-1', name: 'UC 100 (Small)', game: 'PUBG Mobile', price: 150000, desc: 'UC 100 untuk PUBG Mobile.' },
    { id: 'pubg-2', name: 'UC 500 (Medium)', game: 'PUBG Mobile', price: 450000, desc: 'UC 500.' },
    { id: 'pubg-3', name: 'UC 1000 (Large)', game: 'PUBG Mobile', price: 850000, desc: 'UC 1000.' },
    { id: 'pubg-4', name: 'Royal Pass Season', game: 'PUBG Mobile', price: 350000, desc: 'Royal Pass akses.' },
    { id: 'ml-1', name: 'Diamond 100', game: 'Mobile Legends', price: 35000, desc: 'Diamond 100 + bonus gold.' },
    { id: 'ml-2', name: 'Diamond 300', game: 'Mobile Legends', price: 95000, desc: 'Diamond 300 + bonus gold.' },
    { id: 'ml-3', name: 'Diamond 600', game: 'Mobile Legends', price: 175000, desc: 'Diamond 600.' },
    { id: 'ml-4', name: 'Battle Pass', game: 'Mobile Legends', price: 120000, desc: 'Battle Pass akses + rewards.' },
    { id: 'ff-1', name: '5 Diamond', game: 'Free Fire', price: 1000, desc: '5 Diamond untuk Free Fire.' },
    { id: 'ff-2', name: '70 Diamond', game: 'Free Fire', price: 10000, desc: '70 Diamond Free Fire.' },
    { id: 'ff-3', name: '140 Diamond', game: 'Free Fire', price: 20000, desc: '140 Diamond Free Fire.' },
    { id: 'ff-4', name: '720 Diamond', game: 'Free Fire', price: 100000, desc: '720 Diamond Free Fire.' },
    { id: 'val-1', name: '475 VP', game: 'Valorant', price: 47000, desc: '475 VP Valorant.' },
    { id: 'val-2', name: '1000 VP', game: 'Valorant', price: 95000, desc: '1000 VP Valorant.' },
    { id: 'val-3', name: '2050 VP', game: 'Valorant', price: 190000, desc: '2050 VP Valorant.' },
    { id: 'hon-1', name: '150 Honor Points', game: 'Honor of Kings', price: 15000, desc: '150 Honor Points.' },
    { id: 'hon-2', name: '500 Honor Points', game: 'Honor of Kings', price: 45000, desc: '500 Honor Points.' },
    { id: 'hon-3', name: '1200 Honor Points', game: 'Honor of Kings', price: 95000, desc: '1200 Honor Points.' },
    { id: 'wl-1', name: '150 Wild Cores', game: 'League of Legends: Wild Rift', price: 15000, desc: '150 Wild Cores.' },
    { id: 'wl-2', name: '500 Wild Cores', game: 'League of Legends: Wild Rift', price: 45000, desc: '500 Wild Cores.' },
    { id: 'wl-3', name: '1300 Wild Cores', game: 'League of Legends: Wild Rift', price: 95000, desc: '1300 Wild Cores.' },
    { id: 'rl-1', name: '450 Robux', game: 'Roblox', price: 45000, desc: '450 Robux.' },
    { id: 'rl-2', name: '1000 Robux', game: 'Roblox', price: 95000, desc: '1000 Robux.' },
    { id: 'rl-3', name: '2200 Robux', game: 'Roblox', price: 175000, desc: '2200 Robux.' },
    { id: 'gen-1', name: 'Primogem 160', game: 'Genshin Impact', price: 18000, desc: '160 Primogem + bonus.' },
    { id: 'gen-2', name: 'Primogem 330', game: 'Genshin Impact', price: 35000, desc: '330 Primogem + bonus.' },
    { id: 'gen-3', name: 'Primogem 810', game: 'Genshin Impact', price: 78000, desc: '810 Primogem + bonus.' },
    { id: 'hon-4', name: '2200 Honor Points', game: 'Honor of Kings', price: 200000, desc: '2200 Honor Points.' },
    { id: 'wl-4', name: '2000 Wild Cores', game: 'League of Legends: Wild Rift', price: 140000, desc: '2000 Wild Cores.' },
    { id: 'rl-4', name: '5000 Robux', game: 'Roblox', price: 400000, desc: '5000 Robux.' },
];

const BANK_ACCOUNTS = {
    banks: ['Bank BCA', 'Bank Mandiri', 'Bank BRI'],
    accountNumber: '123-456-7890',
    accountName: 'BANGMX Store'
};

// ===== Index Page Logic =====
function loadProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    PRODUCTS.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <span class="game-tag">${p.game}</span>
            <h3>${p.name}</h3>
            <p class="desc">${p.desc}</p>
            <div class="price">Rp ${p.price.toLocaleString('id-ID')}</div>
            <button class="btn btn-primary" onclick="selectProduct('${p.id}')">Pilih & Order</button>
        `;
        grid.appendChild(card);
    });
}

function selectProduct(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    window.currentProduct = product;
    document.getElementById('product-id').value = productId;
    document.getElementById('player-id').value = '';
    document.getElementById('fullname').value = '';
    document.getElementById('email').value = Auth.isLoggedIn() ? Auth.currentUser().email : '';
    document.getElementById('contact').value = '';
    document.getElementById('notes').value = '';
    showSection('order-section');
    document.getElementById('player-id').focus();
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    Auth.initNav();

    document.getElementById('cancel-order')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('products');
    });

    document.getElementById('back-to-cart')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('order-section');
    });

    document.getElementById('order-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const playerId = document.getElementById('player-id').value.trim();
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const contact = document.getElementById('contact').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!playerId) { showToast('Player ID wajib diisi', 'error'); return; }
        if (!fullname) { showToast('Nama lengkap wajib diisi', 'error'); return; }
        if (!email || !email.includes('@')) { showToast('Email wajib diisi (digunakan untuk riwayat order)', 'error'); return; }

        const productId = document.getElementById('product-id').value;
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
        const order = {
            id: orderId,
            productName: product.name,
            game: product.game,
            price: product.price,
            playerId,
            customerName: fullname,
            customerEmail: email,
            customerContact: contact,
            notes,
            status: 'pending',
            paymentProof: null,
            deliveryNotes: null,
            createdAt: new Date().toISOString()
        };

        OrderStore.save(order);
        window.currentOrder = order;
        showPaymentInfo(order);
        showSection('payment-section');
        showToast('Order berhasil dibuat! Melakukan pembayaran.', 'success');
    });
});

function showPaymentInfo(order) {
    const container = document.getElementById('payment-info');
    if (!container) return;
    container.innerHTML = `
        <h3>✅ Order #${order.id.slice(0, 8)} — Rp ${order.price.toLocaleString('id-ID')}</h3>
        <p><strong>Produk:</strong> ${order.productName} (${order.game})</p>
        <p><strong>Player ID:</strong> ${order.playerId}</p>
        <p><strong>Pembeli:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Status:</strong> <span style="color: var(--warning)">${order.status}</span></p>

        <div class="payment-rekening">
            ${BANK_ACCOUNTS.banks.map(bank => `
                <div class="rekening-row"><span class="rekening-label">Bank</span><span>${bank}</span></div>
            `).join('')}
            <div class="rekening-row"><span class="rekening-label">No. Rekening</span><span>${BANK_ACCOUNTS.accountNumber}</span></div>
            <div class="rekening-row"><span class="rekening-label">Atas Nama</span><span>${BANK_ACCOUNTS.accountName}</span></div>
        </div>

        <div class="payment-note">
            ⚠️ Lakukan transfer sesuai nominal. Setelah transfer, segera kirim bukti ke admin (link di bawah) untuk diproses.
        </div>

        <div class="payment-actions">
            <a href="admin.html?order=${order.id}" target="_blank" class="btn btn-outline">
                📋 Konfirmasi Pembayaran (Admin)
            </a>
            <button class="btn btn-outline" onclick="copyOrderInfo('${order.id}')">
                📋 Copy Info Order
            </button>
        </div>
    `;
}

function copyOrderInfo(orderId) {
    const orders = OrderStore.getAll();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const text = [
        `BANGMX STORE - Order #${order.id}`,
        `Produk: ${order.productName} (${order.game})`,
        `Harga: Rp ${order.price.toLocaleString('id-ID')}`,
        `Player ID: ${order.playerId}`,
        `Pembeli: ${order.customerName}`,
        `Email: ${order.customerEmail}`,
        `Contact: ${order.customerContact || '-'}`,
        `Catatan: ${order.notes || '-'}`,
        `Status: ${order.status}`
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
        showToast('Info order berhasil dicopy!', 'success');
    }).catch(() => {
        showToast('Gagal copy (periksa izin browser)', 'error');
    });
}
