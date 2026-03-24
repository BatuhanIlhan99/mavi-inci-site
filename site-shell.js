(function (window) {
  var Data = window.MaviInciData;
  if (!Data) return;

  var toastTimer = null;
  var revealObserver = null;

  function roomHref(room) {
    return './room.html?room=' + encodeURIComponent(Data.getRoomKey(room));
  }

  function bookingHref(room) {
    return './rezervasyon.html' + (room ? '?room=' + encodeURIComponent(Data.getRoomKey(room)) : '');
  }

  function pageHref(page) {
    if (page === 'home') return './index.html';
    if (page === 'rooms') return './odalar.html';
    if (page === 'experiences') return './deneyimler.html';
    if (page === 'booking') return './rezervasyon.html';
    return './index.html';
  }

  function renderMedia(item, fallbackLabel, options) {
    options = options || {};
    if (item && item.src) {
      var loading = options.loading || 'lazy';
      var decoding = options.decoding || (loading === 'eager' ? 'sync' : 'async');
      var fetchPriority = options.fetchPriority || (loading === 'eager' ? 'high' : 'low');
      return '<img src="' + item.src + '" alt="' + Data.escapeHtml(item.alt || item.title || fallbackLabel) + '" loading="' + loading + '" decoding="' + decoding + '" fetchpriority="' + fetchPriority + '">';
    }
    var background = item && item.color ? item.color : 'linear-gradient(135deg, #4c8ca9 0%, #e4cfad 100%)';
    var label = item && item.title ? item.title : fallbackLabel;
    return '<div class="media-fallback" style="background:' + Data.escapeHtml(background) + ';"><span>' + Data.escapeHtml(label) + '</span></div>';
  }

  function setMetaTag(selector, attributes, content) {
    var element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      Object.keys(attributes).forEach(function (key) {
        element.setAttribute(key, attributes[key]);
      });
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  function setLinkTag(selector, attributes, href) {
    var element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('link');
      Object.keys(attributes).forEach(function (key) {
        element.setAttribute(key, attributes[key]);
      });
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  }

  function setStructuredData(data) {
    var element = document.getElementById('structuredData');
    if (!element) {
      element = document.createElement('script');
      element.type = 'application/ld+json';
      element.id = 'structuredData';
      document.head.appendChild(element);
    }
    element.textContent = JSON.stringify(data);
  }

  function buildHotelStructuredData(state, meta) {
    var siteUrl = Data.getSiteUrl(state, '/');
    var instagram = Data.getInstagramUrl(state.hotel.instagram);
    var roomPrices = Data.getActiveRooms(state).map(function (room) {
      return Number(room.weekendPrice || room.nightlyPrice || 0);
    });
    return {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      name: state.hotel.name,
      description: meta.description || state.hotel.description,
      url: meta.canonical || siteUrl,
      image: meta.image || Data.getSiteUrl(state, '/favicon.svg'),
      telephone: state.hotel.phone,
      email: state.hotel.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: state.hotel.address,
        addressLocality: 'Erdek',
        addressRegion: 'Balikesir',
        addressCountry: 'TR'
      },
      checkinTime: state.hotel.checkInTime,
      checkoutTime: state.hotel.checkOutTime,
      priceRange: Data.formatMoney(state, Data.getStartingPrice(state)) + ' - ' + Data.formatMoney(state, Math.max.apply(null, roomPrices)),
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Beach Service', value: !!state.hotel.beachService },
        { '@type': 'LocationFeatureSpecification', name: 'Airport Transfer', value: !!state.hotel.airportTransfer },
        { '@type': 'LocationFeatureSpecification', name: 'Online Booking', value: !!state.hotel.onlineBooking },
        { '@type': 'LocationFeatureSpecification', name: 'Breakfast', value: true }
      ],
      sameAs: instagram ? [instagram] : []
    };
  }

  function updateMeta(state, meta) {
    var title = meta.title;
    var description = meta.description;
    var canonical = meta.canonical;
    var image = meta.image || Data.getSiteUrl(state, '/favicon.svg');
    var keywords = (meta.keywords || [
      state.hotel.name,
      'Erdek butik otel',
      'Balikesir sahil oteli',
      'Mavi Inci Park Otel'
    ]).join(', ');

    document.title = title;
    setMetaTag('meta[name="description"]', { name: 'description' }, description);
    setMetaTag('meta[name="keywords"]', { name: 'keywords' }, keywords);
    setMetaTag('meta[property="og:title"]', { property: 'og:title' }, title);
    setMetaTag('meta[property="og:description"]', { property: 'og:description' }, description);
    setMetaTag('meta[property="og:url"]', { property: 'og:url' }, canonical);
    setMetaTag('meta[property="og:image"]', { property: 'og:image' }, image);
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, image);
    setLinkTag('link[rel="canonical"]', { rel: 'canonical' }, canonical);
    setStructuredData(buildHotelStructuredData(state, {
      title: title,
      description: description,
      canonical: canonical,
      image: image
    }));
  }

  function renderTopStrip(state) {
    var promo = Data.getPrimaryPromotion(state);
    return '<div class="top-strip"><div class="container top-strip-inner"><div>' +
      (promo ? '<strong>' + Data.escapeHtml(promo.title) + '</strong> | ' + Data.escapeHtml(promo.code) + ' koduyla %' + promo.discount + ' web avantaji' : '<strong>Direkt Rezervasyon Hatti</strong> | Telefon ve WhatsApp uzerinden hizli geri donus') +
      '</div><div class="quick-meta"><span>Tel ' + Data.escapeHtml(state.hotel.phone) + '</span><span>Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + '</span><span>Kahvalti ' + Data.escapeHtml(state.hotel.breakfastHours) + '</span></div></div></div>';
  }

  function renderHeader(state, activePage) {
    var links = [
      { id: 'home', label: 'Ana Sayfa', href: pageHref('home') },
      { id: 'rooms', label: 'Odalar', href: pageHref('rooms') },
      { id: 'experiences', label: 'Deneyimler', href: pageHref('experiences') },
      { id: 'booking', label: 'Rezervasyon', href: pageHref('booking') }
    ];
    return '<header class="site-header site-header-page"><div class="container nav-shell"><a class="brand" href="' + pageHref('home') + '" aria-label="Mavi Inci Park Otel ana sayfa"><span class="brand-mark">MI</span><span class="brand-copy"><strong>' + Data.escapeHtml(state.hotel.name) + '</strong><span>Erdek Sahilinde Rafine Butik Konaklama</span></span></a><nav class="desktop-nav" aria-label="Ana menu">' +
      links.map(function (link) {
        return '<a class="' + (link.id === activePage ? 'is-current' : '') + '" href="' + link.href + '">' + link.label + '</a>';
      }).join('') +
      '</nav><div class="nav-actions"><a class="button button-soft nav-contact-button" href="tel:' + Data.escapeHtml(state.hotel.phone) + '">Ara</a><a class="button button-primary" href="' + pageHref('booking') + '">Rezervasyon Yap</a><button class="button button-secondary mobile-toggle" id="mobileToggle" aria-expanded="false" aria-controls="mobilePanel"><span></span></button></div></div><div class="container mobile-panel hidden" id="mobilePanel"><nav aria-label="Mobil menu">' +
      links.map(function (link) { return '<a class="' + (link.id === activePage ? 'is-current' : '') + '" href="' + link.href + '">' + link.label + '</a>'; }).join('') +
      '<a href="tel:' + Data.escapeHtml(state.hotel.phone) + '">Ara</a><a href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp</a></nav></div></header>';
  }

  function renderFooter(state, activePage) {
    var links = [
      { id: 'home', label: 'Ana Sayfa', href: pageHref('home') },
      { id: 'rooms', label: 'Odalar', href: pageHref('rooms') },
      { id: 'experiences', label: 'Deneyimler', href: pageHref('experiences') },
      { id: 'booking', label: 'Rezervasyon', href: pageHref('booking') }
    ];
    return '<footer class="footer"><div class="container footer-grid"><div class="footer-brand"><strong>' + Data.escapeHtml(state.hotel.name) + '</strong><span>' + Data.escapeHtml(state.hotel.description) + '</span></div><div><p class="section-kicker">Sayfalar</p><div class="footer-links">' +
      links.map(function (link) {
        return '<a class="' + (link.id === activePage ? 'is-current' : '') + '" href="' + link.href + '">' + link.label + '</a>';
      }).join('') +
      '</div></div><div><p class="section-kicker">Rezervasyon Ofisi</p><div class="footer-links"><a href="tel:' + Data.escapeHtml(state.hotel.phone) + '">' + Data.escapeHtml(state.hotel.phone) + '</a><a href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp Hatti</a><a href="mailto:' + Data.escapeHtml(state.hotel.email) + '">' + Data.escapeHtml(state.hotel.email) + '</a></div></div><div><p class="section-kicker">Operasyon</p><div class="footer-links"><a href="#">Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + '</a><a href="#">Check-out ' + Data.escapeHtml(state.hotel.checkOutTime) + '</a><a href="#">Kahvalti ' + Data.escapeHtml(state.hotel.breakfastHours) + '</a><a href="#">Adres ' + Data.escapeHtml(state.hotel.address) + '</a></div></div></div><div class="container footer-note"><div class="footer-meta">Cok sayfali otel deneyimi; odalar, rezervasyon ve deneyim akisini daha net karar vermek icin ayristirir.</div><div class="footer-meta">Mavi Inci Park Otel | Erdek</div></div></footer><div class="toast" id="toast"></div>';
  }

  function renderFloatingActions(state, options) {
    options = options || {};
    var whatsapp = 'https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, ''));
    var primaryHref = options.primaryHref || pageHref('booking');
    var primaryTitle = options.primaryTitle || 'Rezervasyon';
    var primaryLabel = options.primaryLabel || 'Planlamaya Gec';
    var secondaryLabel = options.secondaryLabel || 'Hemen Bilgi Al';
    return '<div class="floating-actions" aria-label="Hizli rezervasyon ve iletisim aksiyonlari">' +
      '<a class="floating-button floating-button-secondary" href="' + whatsapp + '">' +
      '<span>WhatsApp</span><strong>' + Data.escapeHtml(secondaryLabel) + '</strong></a>' +
      '<a class="floating-button floating-button-primary" href="' + primaryHref + '">' +
      '<span>' + Data.escapeHtml(primaryTitle) + '</span><strong>' + Data.escapeHtml(primaryLabel) + '</strong></a>' +
      '</div>';
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function initializeNavigation() {
    var toggle = document.getElementById('mobileToggle');
    var panel = document.getElementById('mobilePanel');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', function () {
      var open = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', open);
      panel.classList.toggle('hidden', !open);
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        panel.classList.remove('is-open');
        panel.classList.add('hidden');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initializeRevealAnimations() {
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.section-header, .hero-copy > *, .hero-aside, .hero-collector-card, .detail-card, .story-card, .value-prop, .room-card, .feature-card, .editorial-card, .booking-shell, .booking-sidebar > *, .gallery-card, .review-card, .faq-item, .comparison-spotlight, .comparison-table-shell, .package-card, .seasonal-card, .seasonal-promo-card, .seasonal-note, .page-hero-copy > *, .page-hero-aside, .stay-preview-card, .arrival-card, .destination-card'
    ));

    targets.forEach(function (target, index) {
      target.classList.add('reveal-on-scroll');
      target.style.setProperty('--reveal-delay', String((index % 8) * 55) + 'ms');
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (target) { target.classList.add('is-visible'); });
      return;
    }

    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (target) {
      revealObserver.observe(target);
    });
  }

  window.MaviInciShell = {
    renderMedia: renderMedia,
    updateMeta: updateMeta,
    renderTopStrip: renderTopStrip,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    renderFloatingActions: renderFloatingActions,
    initializeNavigation: initializeNavigation,
    initializeRevealAnimations: initializeRevealAnimations,
    showToast: showToast,
    pageHref: pageHref,
    roomHref: roomHref,
    bookingHref: bookingHref
  };
})(window);
