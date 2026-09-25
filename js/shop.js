// js/shop.js
// Logic for shop.html: search, category filter, sorting, rendering.

let SHOP_ALL_PRODUCTS = [];
let SHOP_CATEGORIES = [];
let SHOP_ACTIVE_CATEGORY = 'all';


async function initShopPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories()
  ]);
  SHOP_ALL_PRODUCTS = products;
  SHOP_CATEGORIES = categories;
  CATEGORY_CACHE = categories; // used by shopProductCardHTML for category display name

  const urlCategory = getUrlParam('category');
  if (urlCategory) SHOP_ACTIVE_CATEGORY = urlCategory;

  renderCategoryChips();
  applyShopFilters();

  document.getElementById('shop-search-input').addEventListener('input', applyShopFilters);
  document.getElementById('shop-sort-select').addEventListener('change', applyShopFilters);
}

function renderCategoryChips() {
  const wrap = document.getElementById('shop-category-chips');
  const chips = [{ id: 'all', name: 'All' }, ...SHOP_CATEGORIES];

  wrap.innerHTML = chips.map(cat => `
    <button class="category-chip ${cat.id === SHOP_ACTIVE_CATEGORY ? 'active' : ''}"
            data-category="${cat.id}">
      ${cat.name}
    </button>
  `).join('');

  wrap.querySelectorAll('.category-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      SHOP_ACTIVE_CATEGORY = btn.dataset.category;
      renderCategoryChips();
      applyShopFilters();
    });
  });
}

function applyShopFilters() {
  const searchTerm = document.getElementById('shop-search-input').value.trim().toLowerCase();
  const sortValue = document.getElementById('shop-sort-select').value;

  let results = SHOP_ALL_PRODUCTS.filter(p => {
    const matchesCategory = SHOP_ACTIVE_CATEGORY === 'all' || p.category === SHOP_ACTIVE_CATEGORY;
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.shortDescription.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch && p.available;
  });

  results = sortProducts(results, sortValue);

  const grid = document.getElementById('shop-product-grid');
  const noResults = document.getElementById('shop-no-results');

  if (results.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    grid.innerHTML = results.map(productCardHTML).join('');
  }
}

function sortProducts(products, sortValue) {
  const list = [...products];
  switch (sortValue) {
    case 'price-asc':
      return list.sort((a, b) => (getDisplayPrice(a) ?? Infinity) - (getDisplayPrice(b) ?? Infinity));
    case 'price-desc':
      return list.sort((a, b) => (getDisplayPrice(b) ?? -Infinity) - (getDisplayPrice(a) ?? -Infinity));
    case 'name-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return list.sort((a, b) => (b.featured === true) - (a.featured === true));
  }
}

document.addEventListener('DOMContentLoaded', initShopPage);