// js/app.js
// Homepage-specific rendering: featured products, category cards, WhatsApp CTA links.
// Shared helpers (productCardHTML, quickAddToCart, showToast, CATEGORY_CACHE) live in products.js

async function renderFeaturedProducts() {
  const grid = document.getElementById('featured-products-grid');
  if (!grid) return;

  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);
  CATEGORY_CACHE = categories;

  if (featured.length === 0) {
    grid.innerHTML = `<p>No featured products yet.</p>`;
    return;
  }

  grid.innerHTML = featured.map(productCardHTML).join('');
}

async function renderCategoryGrid() {
  const grid = document.getElementById('category-grid');
  if (!grid) return;

  const [categories, products] = await Promise.all([
    getCategories(),
    getAllProducts()
  ]);
  CATEGORY_CACHE = categories;

  grid.innerHTML = categories.map(cat => {
    const sampleProduct = products.find(p => p.category === cat.id);
    const bgImage = sampleProduct ? sampleProduct.image : '';
    return `
      <a href="shop.html?category=${cat.id}" class="category-card">
        ${bgImage ? `<img src="${bgImage}" alt="${cat.name}" class="category-card-image" />` : ''}
        <span>${cat.name}</span>
      </a>
    `;
  }).join('');
}

// Wire up hero + CTA WhatsApp buttons to use the config-driven link
document.addEventListener('DOMContentLoaded', () => {
  const genericMsg = `Hello, I would like to know more about ${BUSINESS.name} products.`;
  const heroBtn = document.getElementById('hero-whatsapp-btn');
  const ctaBtn = document.getElementById('cta-whatsapp-btn');
  if (heroBtn) heroBtn.href = buildWhatsAppLink(genericMsg);
  if (ctaBtn) ctaBtn.href = buildWhatsAppLink(genericMsg);

  renderFeaturedProducts();
  renderCategoryGrid();

  // Fill in contact teaser placeholders from config
  const addrEl = document.getElementById('contact-address');
  const hoursEl = document.getElementById('contact-hours');
  if (addrEl) addrEl.textContent = BUSINESS.address;
  if (hoursEl) hoursEl.textContent = BUSINESS.hours;
});