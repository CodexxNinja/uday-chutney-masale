// js/products.js
// Loads product data from data/products.json and exposes helper functions.

let PRODUCT_DATA = null;

async function loadProductData() {
  if (PRODUCT_DATA) return PRODUCT_DATA;
  const res = await fetch('data/products.json');
  PRODUCT_DATA = await res.json();
  return PRODUCT_DATA;
}

async function getAllProducts() {
  const data = await loadProductData();
  return data.products;
}

async function getFeaturedProducts() {
  const products = await getAllProducts();
  return products.filter(p => p.featured);
}

async function getCategories() {
  const data = await loadProductData();
  return data.categories;
}

async function getProductById(id) {
  const products = await getAllProducts();
  return products.find(p => p.id === id);
}

async function getProductsByCategory(categoryId) {
  const products = await getAllProducts();
  if (!categoryId || categoryId === 'all') return products;
  return products.filter(p => p.category === categoryId);
}

function getCategoryName(categoryId, categories) {
  const found = categories.find(c => c.id === categoryId);
  return found ? found.name : categoryId;
}

// Returns the lowest-priced confirmed variant, or null if no price is confirmed yet.
function getDisplayPrice(product) {
  const confirmed = product.variants.filter(v => v.priceConfirmed && v.price != null);
  if (confirmed.length === 0) return null;
  return Math.min(...confirmed.map(v => v.price));
}

// ---------- Shared product card rendering (used by homepage + shop page) ----------

let CATEGORY_CACHE = [];

function getCategoryDisplayName(categoryId) {
  return getCategoryName(categoryId, CATEGORY_CACHE);
}

function productCardHTML(product) {
  const price = getDisplayPrice(product);
  const priceLabel = price != null ? `₹${price}` : 'Price on request';

  return `
    <div class="product-card">
      <a href="product.html?id=${product.id}" class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="product-card-body">
        <span class="product-card-category">${getCategoryDisplayName(product.category)}</span>
        <a href="product.html?id=${product.id}" class="product-card-name">${product.name}</a>
        <span class="product-card-price">${priceLabel}</span>
        <div class="product-card-actions">
          <a href="product.html?id=${product.id}" class="btn btn-outline">View Details</a>
          <button class="btn btn-primary" onclick="quickAddToCart('${product.id}')">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function quickAddToCart(productId) {
  getProductById(productId).then(product => {
    if (!product) return;
    const variant = product.variants[0];
    addToCart(product, variant, 1);
    showToast(`${product.name} added to cart`);
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}