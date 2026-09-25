// js/checkout.js
// Logic for checkout.html: render cart items, handle quantity changes,
// build and open the WhatsApp order message.

function initCheckoutPage() {
  renderCartItems();

  document.getElementById('checkout-form').addEventListener('submit', handleOrderSubmit);
}

function renderCartItems() {
  const cart = getCart();
  const listEl = document.getElementById('cart-items-list');
  const layoutEl = document.getElementById('checkout-layout');
  const emptyEl = document.getElementById('checkout-empty-state');

  if (cart.length === 0) {
    layoutEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }

  layoutEl.style.display = 'grid';
  emptyEl.style.display = 'none';

  listEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-line-id="${item.lineId}">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-weight">${item.weight}</span>
        <span class="cart-item-price">${item.price != null ? `₹${item.price}` : 'Price to confirm'}</span>
      </div>
      <div class="qty-stepper cart-item-qty">
        <button class="cart-qty-decrease" aria-label="Decrease quantity">−</button>
        <span>${item.quantity}</span>
        <button class="cart-qty-increase" aria-label="Increase quantity">+</button>
      </div>
      <button class="cart-item-remove" aria-label="Remove item">✕</button>
    </div>
  `).join('');

  attachCartItemEvents();
  renderSubtotal();
}

function attachCartItemEvents() {
  document.querySelectorAll('.cart-item').forEach(itemEl => {
    const lineId = itemEl.dataset.lineId;
    const cart = getCart();
    const item = cart.find(i => i.lineId === lineId);
    if (!item) return;

    itemEl.querySelector('.cart-qty-decrease').addEventListener('click', () => {
      updateCartItemQuantity(lineId, item.quantity - 1);
      renderCartItems();
    });
    itemEl.querySelector('.cart-qty-increase').addEventListener('click', () => {
      updateCartItemQuantity(lineId, item.quantity + 1);
      renderCartItems();
    });
    itemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
      removeCartItem(lineId);
      renderCartItems();
    });
  });
}

function renderSubtotal() {
  const { total, hasUnpricedItems } = getCartSubtotal();
  document.getElementById('cart-subtotal-amount').textContent = `₹${total}`;
  document.getElementById('cart-unpriced-note').style.display = hasUnpricedItems ? 'block' : 'none';
}

function handleOrderSubmit(e) {
  e.preventDefault();

  const cart = getCart();
  if (cart.length === 0) return;

  const name = document.getElementById('cf-name').value.trim();
  const phone = document.getElementById('cf-phone').value.trim();
  const address = document.getElementById('cf-address').value.trim();
  const area = document.getElementById('cf-area').value.trim();
  const city = document.getElementById('cf-city').value.trim();
  const pin = document.getElementById('cf-pin').value.trim();
  const notes = document.getElementById('cf-notes').value.trim();

  const { total, hasUnpricedItems } = getCartSubtotal();

  let message = `Hello ${BUSINESS.name}!\n\nI would like to place an order.\n\n`;
  message += `Customer Details:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}, ${area}, ${city}\nPIN: ${pin}\n\n`;
  message += `Order Details:\n\n`;

  cart.forEach((item, i) => {
    const priceText = item.price != null ? `₹${item.price}` : 'price to be confirmed';
    message += `${i + 1}. ${item.name}\n   Pack: ${item.weight}\n   Quantity: ${item.quantity}\n   Price: ${priceText}\n\n`;
  });

  message += `Subtotal: ₹${total}${hasUnpricedItems ? ' (some prices pending confirmation)' : ''}\n\n`;
  if (notes) message += `Delivery Instructions:\n${notes}\n\n`;
  message += `Please confirm the order and delivery charges.\n\nThank you!`;

  const link = buildWhatsAppLink(message);
  window.open(link, '_blank');
}

document.addEventListener('DOMContentLoaded', initCheckoutPage);