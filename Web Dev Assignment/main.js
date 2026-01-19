/* =====================================================
   🎮 GAMER'S PARADISE - MAIN JS
===================================================== */

/* =========================
   SEARCH FUNCTIONALITY
========================= */
function filterProducts() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const items = document.querySelectorAll('.hardware-item, .game-item');

  items.forEach(item => {
    const name = item.dataset.productName?.toLowerCase() || '';
    const text = item.textContent.toLowerCase();
    
    if (name.includes(searchTerm) || text.includes(searchTerm)) {
      item.style.display = '';
      item.style.opacity = '1';
    } else {
      item.style.opacity = '0.3';
      item.style.pointerEvents = 'none';
    }
  });
}

/* =========================
   EMAIL VALIDATION
========================= */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* =========================
   NOTIFICATIONS
========================= */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.3s ease-out, slideOut 0.3s ease-out 3.7s forwards;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    font-size: 14px;
    max-width: 300px;
  `;

  if (type === 'success') {
    notification.style.background = '#00ffd5';
    notification.style.color = '#0f0f1a';
  } else if (type === 'error') {
    notification.style.background = '#ff6b6b';
    notification.style.color = '#fff';
  } else {
    notification.style.background = '#8f7cff';
    notification.style.color = '#fff';
  }

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

/* =========================
   RESPONSIVE NAVBAR
========================= */
function addResponsiveNavBar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function resizeNav() {
    navbar.style.padding = window.innerWidth <= 768 ? '10px 0' : '15px 0';
  }

  resizeNav();
  window.addEventListener('resize', resizeNav);
}

/* =========================
   SCROLL ANIMATIONS
========================= */
function observeElements() {
  const elements = document.querySelectorAll(
    'section, .hardware-item, .game-item, .product-highlight, .game-highlight, .team-member'
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = '0.6s ease';
    observer.observe(el);
  });
}

/* =========================
   SHOPPING CART SYSTEM
========================= */
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart(cart);
}

function removeFromCart(name) {
  let cart = getCart();
  cart = cart.filter(item => item.name !== name);
  saveCart(cart);
  displayCart();
  showNotification('🗑️ Item removed', 'info');
}

function updateQuantity(name, qty) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);

  if (item) {
    item.quantity = Math.max(1, qty);
    saveCart(cart);
    displayCart();
  }
}

/* =========================
   DISPLAY CART PAGE
========================= */
function displayCart() {
  const cart = getCart();
  const empty = document.getElementById('cart-empty');
  const items = document.getElementById('cart-items');
  const list = document.getElementById('items-list');

  if (!list) return;

  if (!cart.length) {
    if (empty) empty.style.display = 'flex';
    if (items) items.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  items.style.display = 'grid';
  list.innerHTML = '';

  let subtotal = 0;

  cart.forEach(item => {
    const total = item.price * item.quantity;
    subtotal += total;

    list.innerHTML += `
      <div class="cart-item">
        <div>📦</div>
        <div>
          <strong>${item.name}</strong><br>
          R${item.price} each<br>
          <span style="color:#00ffd5">Total: R${total}</span>
        </div>
        <div>
          <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
          ${item.quantity}
          <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
          <br>
          <button onclick="removeFromCart('${item.name}')">Remove</button>
        </div>
      </div>
    `;
  });

  const tax = Math.round(subtotal * 0.15);
  document.getElementById('subtotal').textContent = `R${subtotal}`;
  document.getElementById('tax').textContent = `R${tax}`;
  document.getElementById('total').textContent = `R${subtotal + tax}`;
}

/* =========================
   ADD TO CART BUTTONS
========================= */
function initializeCart() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('[data-product-name]');
      if (!item) return;

      const name = item.dataset.productName;
      const price = Number(item.dataset.productPrice);

      addToCart(name, price);
      showNotification(`✅ ${name} added to cart`, 'success');

      btn.textContent = '✅ Added';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '🛒 Add to Cart';
        btn.disabled = false;
      }, 1200);
    });
  });

  if (location.pathname.includes('cart')) {
    displayCart();
    
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear your entire cart?')) {
          localStorage.removeItem('cart');
          displayCart();
          showNotification('🗑️ Cart cleared!', 'success');
        }
      });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        showNotification('💳 Proceeding to checkout...', 'info');
      });
    }
  }
}

/* =========================
   DYNAMIC CSS ANIMATIONS
========================= */
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn { from { transform: translateX(300px); opacity:0 } to { transform:none; opacity:1 } }
@keyframes slideOut { to { transform: translateX(300px); opacity:0 } }
.navbar a { position: relative }
.navbar a::after {
  content:'';
  position:absolute;
  bottom:0;
  left:0;
  width:0;
  height:2px;
  background:#00ffd5;
  transition:0.3s;
}
.navbar a:hover::after { width:100% }
`;
document.head.appendChild(style);

/* =========================
   INIT ON LOAD
========================= */
document.addEventListener('DOMContentLoaded', () => {
  addResponsiveNavBar();
  observeElements();
  initializeCart();
  document.documentElement.style.scrollBehavior = 'smooth';

  // Active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar a').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.style.background = '#00ffd5';
      link.style.color = '#0f0f1a';
    }
  });
});

/* =========================
   CONSOLE EASTER EGG
========================= */
console.log('%c🎮 Gamer\'s Paradise Loaded!', 'color:#00ffd5;font-size:18px;font-weight:bold;');
