// js/config.js
// Business details used across the site.

const BUSINESS = {
  name: "Uday Chutney and Masale",
  tagline: "Tastemakers since 1988",
  city: "Kolhapur",
  state: "Maharashtra",

  // WhatsApp number in international format, no + or spaces
  whatsappNumber: "919860461773",

  phone: "+91 98604 61773",
  email: "adityapalsule9772@gmail.com",

  // ⚠️ PLACEHOLDER — street address not yet given as text; Maps link below has the exact location
  address: "Phulewadi,Kolhapur, 416010",

  hours: "Always Open",

  mapsUrl: "https://www.google.com/maps/place/%E0%A4%89%E0%A4%A6%E0%A4%AF+%E0%A4%9A%E0%A4%9F%E0%A4%A3%E0%A5%80+%E0%A4%B5+%E0%A4%AE%E0%A4%B8%E0%A4%BE%E0%A4%B2%E0%A5%87.%E0%A4%95%E0%A5%8B%E0%A4%B2%E0%A5%8D%E0%A4%B9%E0%A4%BE%E0%A4%AA%E0%A5%82%E0%A4%B0+1988/@16.6925694,74.1965706,99m/data=!3m1!1e3!4m14!1m7!3m6!1s0x3bc1ab17ffa6ee7f:0xd1886419792204d8!2z4KSJ4KSm4KSvIOCkmuCkn-Cko-ClgCDgpLUg4KSu4KS44KS-4KSy4KWHLuCkleCli-CksuCljeCkueCkvuCkquClguCksCAxOTg4!8m2!3d16.692519!4d74.1964424!16s%2Fg%2F11gtgfs894",

  mapEmbedLat: 16.692519,
  mapEmbedLng: 74.1964424,

  social: {
    instagram: "https://www.instagram.com/adityapalsule/",
    facebook: "https://www.facebook.com/p/Uday-masale-kolhapur-1988-100066637176033/"
  }
};

// Builds a wa.me link with a prefilled message.
function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encoded}`;
}