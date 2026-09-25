// js/cart.js
// Cart logic using localStorage. No backend — cart lives entirely in the browser.

const CART_STORAGE_KEY = 'udayCart';

// Cart item shape: { productId, name, image, weight, price, quantity }

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Cart read error:', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Cart save error:', e);
  }
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  const cart = getCart();
  const knownPriceTotal = cart.reduce((sum, item) => {
    return item.price != null ? sum + (item.price * item.quantity) : sum;
  }, 0);
  const hasUnpricedItems = cart.some(item => item.price == null);
  return { total: knownPriceTotal, hasUnpricedItems };
}

// product: full product object from products.json
// variant: one entry from product.variants (has weight, price, priceConfirmed)
function addToCart(product, variant, quantity = 1) {
  const cart = getCart();
  const lineId = `${product.id}__${variant.weight}`;

  const existing = cart.find(item => item.lineId === lineId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      lineId,
      productId: product.id,
      name: product.name,
      image: product.image,
      weight: variant.weight,
      price: variant.priceConfirmed ? variant.price : null,
      quantity
    });
  }
  saveCart(cart);
}

function updateCartItemQuantity(lineId, newQuantity) {
  let cart = getCart();
  if (newQuantity <= 0) {
    cart = cart.filter(item => item.lineId !== lineId);
  } else {
    const item = cart.find(i => i.lineId === lineId);
    if (item) item.quantity = newQuantity;
  }
  saveCart(cart);
}

function removeCartItem(lineId) {
  const cart = getCart().filter(item => item.lineId !== lineId);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = getCartCount();
  badge.classList.add('pulse');
  setTimeout(() => badge.classList.remove('pulse'), 300);
}