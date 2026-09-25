// js/product.js
// Logic for product.html: loads a single product by ?id=, renders detail view.

let CURRENT_PRODUCT = null;
let SELECTED_VARIANT_INDEX = 0;
let SELECTED_QUANTITY = 1;

async function initProductPage() {
  const productId = getUrlParam('id');
  const categories = await getCategories();
  CATEGORY_CACHE = categories;

  if (!productId) {
    showProductNotFound();
    return;
  }

  const product = await getProductById(productId);
  if (!product) {
    showProductNotFound();
    return;
  }

  CURRENT_PRODUCT = product;
  SELECTED_VARIANT_INDEX = 0;
  SELECTED_QUANTITY = 1;

  document.title = `${product.name} | Uday Chutney and Masale`;
  document.getElementById('product-page-title').textContent = `${product.name} | Uday Chutney and Masale`;
  document.getElementById('product-page-description').setAttribute('content', product.shortDescription);

  renderBreadcrumb(product);
  renderProductDetail(product);
}

function showProductNotFound() {
  document.getElementById('product-detail-wrap').style.display = 'none';
  document.getElementById('product-breadcrumb').style.display = 'none';
  document.getElementById('product-not-found').style.display = 'block';
}

function renderBreadcrumb(product) {
  const el = document.getElementById('product-breadcrumb');
  el.innerHTML = `
    <a href="shop.html">Shop</a> /
    <a href="shop.html?category=${product.category}">${getCategoryDisplayName(product.category)}</a> /
    <span>${product.name}</span>
  `;
}

function renderProductDetail(product) {
  const wrap = document.getElementById('product-detail-wrap');
  const variant = product.variants[SELECTED_VARIANT_INDEX];
  const priceLabel = (variant.priceConfirmed && variant.price != null) ? `₹${variant.price}` : 'Price on request';

  wrap.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>

      <div class="product-detail-info">
        <span class="product-card-category">${getCategoryDisplayName(product.category)}</span>
        <h1>${product.name}</h1>
        <p class="product-detail-desc">${product.shortDescription}</p>

        <div class="product-detail-price" id="product-detail-price">${priceLabel}</div>

        ${product.variants.length > 1 ? `
          <div class="variant-selector">
            <span class="variant-label">Size:</span>
            <div class="variant-options" id="variant-options">
              ${product.variants.map((v, i) => `
                <button class="variant-btn ${i === SELECTED_VARIANT_INDEX ? 'active' : ''}" data-index="${i}">
                  ${v.weight}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${product.variantsNote ? `<p class="variant-note">${product.variantsNote}</p>` : ''}

        <div class="quantity-selector">
          <span class="variant-label">Quantity:</span>
          <div class="qty-stepper">
            <button id="qty-decrease" aria-label="Decrease quantity">−</button>
            <span id="qty-display">${SELECTED_QUANTITY}</span>
            <button id="qty-increase" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="product-detail-actions">
          <button class="btn btn-primary btn-lg" id="product-add-to-cart">Add to Cart</button>
          <a href="#" class="btn btn-whatsapp btn-lg" id="product-whatsapp-order">Order on WhatsApp</a>
        </div>

        <div class="product-detail-tabs">
          <div class="tab-buttons">
            <button class="tab-btn active" data-tab="description">Description</button>
            <button class="tab-btn" data-tab="how-to-use">How to Use</button>
          </div>
          <div class="tab-panel active" id="tab-description">
            <p>${product.description}${product.descriptionIsPlaceholder ? ' <span class="demo-badge">Placeholder</span>' : ''}</p>
          </div>
          <div class="tab-panel" id="tab-how-to-use">
            <p>Usage instructions will be added once confirmed by the business owner. <span class="demo-badge">Placeholder</span></p>
          </div>
        </div>
      </div>
    </div>
  `;

  attachProductDetailEvents(product);
}

function attachProductDetailEvents(product) {
  // Variant selection
  document.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      SELECTED_VARIANT_INDEX = parseInt(btn.dataset.index, 10);
      renderProductDetail(product);
    });
  });

  // Quantity stepper
  const decreaseBtn = document.getElementById('qty-decrease');
  const increaseBtn = document.getElementById('qty-increase');
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      if (SELECTED_QUANTITY > 1) {
        SELECTED_QUANTITY--;
        document.getElementById('qty-display').textContent = SELECTED_QUANTITY;
      }
    });
  }
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      SELECTED_QUANTITY++;
      document.getElementById('qty-display').textContent = SELECTED_QUANTITY;
    });
  }

  // Add to cart
  document.getElementById('product-add-to-cart').addEventListener('click', () => {
    const variant = product.variants[SELECTED_VARIANT_INDEX];
    addToCart(product, variant, SELECTED_QUANTITY);
    showToast(`${product.name} (${variant.weight}) added to cart`);
  });

  // WhatsApp order for this product directly
  const variant = product.variants[SELECTED_VARIANT_INDEX];
  const priceText = (variant.priceConfirmed && variant.price != null) ? `₹${variant.price}` : 'price to be confirmed';
  const msg = `Hello! I'm interested in ordering:\n\n${product.name}\nPack: ${variant.weight}\nQuantity: ${SELECTED_QUANTITY}\nPrice: ${priceText}\n\nPlease confirm availability and delivery.`;
  document.getElementById('product-whatsapp-order').href = buildWhatsAppLink(msg);

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', initProductPage);