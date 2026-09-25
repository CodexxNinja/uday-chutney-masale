// js/components.js
// Injects shared navbar, footer, and floating WhatsApp button into every page.
// Each HTML page just needs: <div id="site-header"></div> and <div id="site-footer"></div>

function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const cartCount = getCartCount();

  header.innerHTML = `
    <header class="navbar">
      <div class="container navbar-inner">
        <a href="index.html" class="navbar-logo">
          <img src="images/logo/uday-logo.jpg" alt="${BUSINESS.name} logo" />
        </a>

        <nav class="navbar-links" id="navbar-links">
          <a href="index.html">Home</a>
          <a href="shop.html">Shop</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </nav>

        <div class="navbar-actions">
          <a href="checkout.html" class="cart-icon-link" aria-label="View cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="cart-badge" id="cart-badge">${cartCount}</span>
          </a>
          <a href="${buildWhatsAppLink('Hello, I would like to know more about ' + BUSINESS.name + ' products.')}"
             class="btn btn-whatsapp btn-sm navbar-whatsapp-btn" target="_blank" rel="noopener">
            Order on WhatsApp
          </a>
          <button class="navbar-hamburger" id="navbar-hamburger" aria-label="Open menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `;

  const hamburger = document.getElementById('navbar-hamburger');
  const links = document.getElementById('navbar-links');
  hamburger.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    const navEl = header.querySelector('.navbar');
    if (window.scrollY > 10) {
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  });
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <img src="images/logo/uday-logo.jpg" alt="${BUSINESS.name} logo" class="footer-logo" />
          <p>Authentic flavours from ${BUSINESS.city}.</p>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a>
          <a href="shop.html">Shop</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>

        <div class="footer-col">
          <h4>Contact</h4>
          <a href="tel:${BUSINESS.phone}">${BUSINESS.phone}</a>
          <a href="${buildWhatsAppLink('Hello, I would like to know more about ' + BUSINESS.name + ' products.')}" target="_blank" rel="noopener">WhatsApp</a>
          <p>${BUSINESS.city}, ${BUSINESS.state}</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 ${BUSINESS.name}. All Rights Reserved.</p>
      </div>
    </footer>
  `;
}

function renderWhatsAppFloat() {
  const el = document.createElement('a');
  el.href = buildWhatsAppLink('Hello, I would like to know more about ' + BUSINESS.name + ' products.');
  el.target = '_blank';
  el.rel = 'noopener';
  el.className = 'whatsapp-float';
  el.setAttribute('aria-label', 'Order on WhatsApp');
  el.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.87 11.87L4 20l4.24-1.11a7.9 7.9 0 0 0 3.8 1H12a7.94 7.94 0 0 0 5.6-13.57zm-5.55 12.2a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.62 6.62 0 1 1 5.59 3.09zm3.63-4.96c-.2-.1-1.17-.58-1.35-.64s-.32-.1-.45.1-.5.64-.62.77-.23.15-.43.05a5.4 5.4 0 0 1-2.7-2.36c-.2-.35.2-.32.58-1.08a.36.36 0 0 0 0-.35c0-.1-.45-1.08-.62-1.48s-.33-.33-.45-.34h-.39a.74.74 0 0 0-.54.25 2.27 2.27 0 0 0-.7 1.68 3.94 3.94 0 0 0 .82 2.1 9 9 0 0 0 3.46 3.06c.48.2.86.33 1.15.42a2.76 2.76 0 0 0 1.27.08 2.09 2.09 0 0 0 1.37-.96 1.7 1.7 0 0 0 .12-.96c-.05-.1-.18-.15-.38-.25z"/>
    </svg>
  `;
  document.body.appendChild(el);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderWhatsAppFloat();
});