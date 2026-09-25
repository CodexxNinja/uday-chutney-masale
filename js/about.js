// js/about.js
// Logic for about.html: WhatsApp CTA link + brand gallery from real product images.

async function initAboutPage() {
  const genericMsg = `Hello, I would like to know more about ${BUSINESS.name} products.`;
  const btn = document.getElementById('about-whatsapp-btn');
  if (btn) btn.href = buildWhatsAppLink(genericMsg);

  const products = await getAllProducts();
  const gallery = document.getElementById('about-gallery');
  gallery.innerHTML = products.map(p => `
    <img src="${p.image}" alt="${p.name}" loading="lazy" />
  `).join('');
}

document.addEventListener('DOMContentLoaded', initAboutPage);