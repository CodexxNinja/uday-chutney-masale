// js/contact.js
// Fills contact.html with real business details from config.js.

function initContactPage() {
  document.getElementById('contact-business-name').textContent = BUSINESS.name;
  document.getElementById('contact-business-tagline').textContent = BUSINESS.tagline;
  document.getElementById('contact-city-state').textContent = `${BUSINESS.city}, ${BUSINESS.state}`;
  document.getElementById('contact-hours-detail').textContent = BUSINESS.hours;

  const phoneLink = document.getElementById('contact-phone-link');
  phoneLink.href = `tel:${BUSINESS.phone.replace(/\s/g, '')}`;

  const whatsappLink = document.getElementById('contact-whatsapp-link');
  whatsappLink.href = buildWhatsAppLink(`Hello, I would like to know more about ${BUSINESS.name} products.`);

  const emailLink = document.getElementById('contact-email-link');
  emailLink.href = `mailto:${BUSINESS.email}`;

  const mapsLink = document.getElementById('contact-maps-link');
  mapsLink.href = BUSINESS.mapsUrl;

  // Social links — only show the ones that are actually filled in
  const socialWrap = document.getElementById('contact-social-links');
  const socialItems = [];
  if (BUSINESS.social.instagram) {
    socialItems.push(`<a href="${BUSINESS.social.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (BUSINESS.social.facebook) {
    socialItems.push(`<a href="${BUSINESS.social.facebook}" target="_blank" rel="noopener">Facebook</a>`);
  }
  if (socialItems.length === 0) {
    document.getElementById('contact-social-item').style.display = 'none';
  } else {
    socialWrap.innerHTML = socialItems.join('');
  }

  // Embedded map using lat/lng — no API key needed for a basic embed
  const mapEmbed = document.getElementById('contact-map-embed');
  mapEmbed.innerHTML = `
    <iframe
      width="100%"
      height="100%"
      style="border:0;"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=${BUSINESS.mapEmbedLat},${BUSINESS.mapEmbedLng}&z=16&output=embed">
    </iframe>
  `;
}

document.addEventListener('DOMContentLoaded', initContactPage);