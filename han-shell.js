(function (window) {
  var Data = window.HanGroupData;
  var Boot = window.MaviInciBoot;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pageHref(page) {
    if (page === 'home') return './index.html';
    if (page === 'hotels') return './odalar.html';
    if (page === 'venues') return './deneyimler.html';
    if (page === 'guide') return './erdek-rehberi.html';
    if (page === 'corporate') return './kurumsal.html';
    if (page === 'contact') return './iletisim.html';
    if (page === 'booking') return './rezervasyon.html';
    if (page === 'admin') return './admin.html';
    return './index.html';
  }

  function businessHref(business) {
    return './tesis.html?business=' + encodeURIComponent(business.id);
  }

  function absoluteUrl(href) {
    return new URL(href, window.location.href).href;
  }

  function primaryHotel(state) {
    return Data && typeof Data.getBusinessById === 'function'
      ? (Data.getBusinessById(state, 'mavi-inci-park-otel') || null)
      : null;
  }

  function updateMeta(state, meta) {
    var title = meta.title || state.group.name;
    var description = meta.description || state.group.description;
    var canonical = absoluteUrl(meta.canonical || pageHref('home'));
    document.title = title;
    setMeta('meta[name="description"]', { name: 'description' }, description);
    setMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    setLink('link[rel="canonical"]', { rel: 'canonical' }, canonical);
  }

  function setMeta(selector, attributes, content) {
    var element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      Object.keys(attributes).forEach(function (key) { element.setAttribute(key, attributes[key]); });
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  function setLink(selector, attributes, href) {
    var element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('link');
      Object.keys(attributes).forEach(function (key) { element.setAttribute(key, attributes[key]); });
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  }

  function setStructuredData(payload) {
    var node = document.getElementById('structuredData');
    if (!node) return;
    node.textContent = JSON.stringify(payload || {}, null, 2);
  }

  function renderHeader(state, activePage) {
    var hotel = primaryHotel(state) || {};
    var brandName = hotel.name || 'Mavi Inci Park Otel';
    var brandTagline = hotel.tagline || 'Erdek sahilinde butik sehir oteli';
    var brandPhone = hotel.phone || state.group.phone;
    var links = [
      { id: 'home', label: 'Ana Sayfa', href: pageHref('home') },
      { id: 'corporate', label: 'Kurumsal', href: pageHref('corporate') },
      { id: 'hotels', label: 'Odalar', href: pageHref('hotels') },
      { id: 'guide', label: 'Erdek Rehberi', href: pageHref('guide') },
      { id: 'contact', label: 'Iletisim', href: pageHref('contact') },
      { id: 'booking', label: 'Rezervasyon', href: pageHref('booking') }
    ];
    return '' +
      '<div class="top-strip">' +
      '<div class="container top-strip-inner">' +
      '<div><strong>' + escapeHtml(brandName) + '</strong> | ' + escapeHtml(brandTagline) + '</div>' +
      '<div class="quick-meta"><span>' + escapeHtml(hotel.location || state.group.city) + '</span><span>' + escapeHtml(brandPhone) + '</span></div>' +
      '</div></div>' +
      '<header class="site-header site-header-page">' +
      '<div class="container nav-shell">' +
      '<a class="brand" href="' + pageHref('home') + '" aria-label="' + escapeHtml(brandName) + ' ana sayfa">' +
      '<span class="brand-mark">M</span>' +
      '<span class="brand-copy"><strong>' + escapeHtml(brandName) + '</strong><span>13 odali butik sehir oteli</span></span>' +
      '</a>' +
      '<nav class="desktop-nav" aria-label="Ana menu">' +
      links.map(function (link) {
        return '<a class="' + (link.id === activePage ? 'is-current' : '') + '" href="' + link.href + '">' + escapeHtml(link.label) + '</a>';
      }).join('') +
      '</nav>' +
      '<div class="nav-actions">' +
      '<a class="button button-soft nav-contact-button" href="tel:' + escapeHtml(brandPhone.replace(/\s+/g, '')) + '">Ara</a>' +
      '<a class="button button-primary" href="' + pageHref('booking') + '">Hemen Rezervasyon Yap</a>' +
      '<button class="button button-secondary mobile-toggle" id="mobileToggle" aria-expanded="false" aria-controls="mobilePanel"><span></span></button>' +
      '</div>' +
      '</div>' +
      '<div class="container mobile-panel hidden" id="mobilePanel"><nav aria-label="Mobil menu">' +
      links.map(function (link) { return '<a class="' + (link.id === activePage ? 'is-current' : '') + '" href="' + link.href + '">' + escapeHtml(link.label) + '</a>'; }).join('') +
      '<a href="./admin.html">Yonetim</a>' +
      '</nav></div>' +
      '</header>';
  }

  function renderFooter(state) {
    var hotel = primaryHotel(state) || {};
    var hotelName = hotel.name || 'Mavi Inci Park Otel';
    var hotelDescription = hotel.description || 'Erdek merkezde konforlu ve guven veren butik konaklama deneyimi.';
    var hotelPhone = hotel.phone || state.group.phone;
    var hotelEmail = hotel.email || state.group.email;
    var hotelWhatsapp = (hotelPhone || state.group.whatsapp).replace(/[^\d]/g, '');
    return '' +
      '<footer class="footer">' +
      '<div class="container footer-grid">' +
      '<div class="footer-brand"><strong>' + escapeHtml(hotelName) + '</strong><span>' + escapeHtml(hotelDescription) + '</span></div>' +
      '<div><p class="section-kicker">Kisayollar</p><div class="footer-links">' +
      '<a href="' + pageHref('home') + '">Ana Sayfa</a>' +
      '<a href="' + pageHref('corporate') + '">Kurumsal</a>' +
      '<a href="' + pageHref('hotels') + '">Odalar</a>' +
      '<a href="' + pageHref('guide') + '">Erdek Rehberi</a>' +
      '<a href="' + pageHref('contact') + '">Iletisim</a>' +
      '</div></div>' +
      '<div><p class="section-kicker">Iletisim</p><div class="footer-links">' +
      '<a href="tel:' + escapeHtml(hotelPhone.replace(/\s+/g, '')) + '">' + escapeHtml(hotelPhone) + '</a>' +
      '<a href="mailto:' + escapeHtml(hotelEmail) + '">' + escapeHtml(hotelEmail) + '</a>' +
      '<a href="https://wa.me/' + escapeHtml(hotelWhatsapp) + '">WhatsApp</a>' +
      '</div></div>' +
      '<div><p class="section-kicker">Yasal Bilgi</p><div class="footer-links"><a href="' + pageHref('contact') + '#kvkk-placeholder">KVKK Aydinlatma Metni</a><a href="' + pageHref('contact') + '#iptal-iade-placeholder">Iptal ve Iade Kosullari</a><a href="' + pageHref('booking') + '">Hemen Rezervasyon Yap</a></div></div>' +
      '</div>' +
      '<div class="container footer-note"><div class="footer-meta">Mavi Inci Park Otel | Erdek merkezli butik konaklama</div><div class="footer-meta">13 oda | merkezi konum | dogrudan rezervasyon</div></div>' +
      '</footer>';
  }

  function renderBusinessCard(business, options) {
    options = options || {};
    var actionLabel = options.actionLabel || 'Detaylari Incele';
    var secondaryLabel = options.secondaryLabel || 'Talep Gonder';
    return '' +
      '<article class="room-card han-business-card" style="--business-accent:' + escapeHtml(business.accent) + ';">' +
      '<div class="han-business-cover" style="background:' + escapeHtml(business.cover) + ';"></div>' +
      '<div class="han-business-body">' +
      '<div class="stay-preview-intro"><span class="tag">' + escapeHtml(business.type === 'hotel' ? 'Otel' : business.type === 'fastfood' ? 'Fast Food' : 'Pub') + '</span><span class="stay-preview-note">' + escapeHtml(business.location) + '</span></div>' +
      '<h3>' + escapeHtml(business.name) + '</h3>' +
      '<p class="han-business-summary">' + escapeHtml(business.summary) + '</p>' +
      '<div class="stay-preview-highlights">' + (business.highlights || []).slice(0, 2).map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join('') + '</div>' +
      '<div class="room-actions">' +
      '<a class="button button-dark" href="' + businessHref(business) + '">' + escapeHtml(actionLabel) + '</a>' +
      '<a class="button button-soft" href="' + pageHref('booking') + '?business=' + encodeURIComponent(business.id) + '">' + escapeHtml(secondaryLabel) + '</a>' +
      '</div>' +
      '</div>' +
      '</article>';
  }

  function renderStats(stats) {
    return '<div class="hero-signature-grid">' + stats.map(function (item) {
      return '<article class="hero-signature-card"><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong></article>';
    }).join('') + '</div>';
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
  }

  function mountReady() {
    if (Boot && typeof Boot.markMounted === 'function') Boot.markMounted();
  }

  function mountFail(message) {
    var root = document.getElementById('root');
    if (root) {
      root.innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">' + escapeHtml(message) + '</div>';
    }
    if (Boot && typeof Boot.fail === 'function') Boot.fail(message);
  }

  window.HanShell = {
    escapeHtml: escapeHtml,
    pageHref: pageHref,
    businessHref: businessHref,
    updateMeta: updateMeta,
    setStructuredData: setStructuredData,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    renderBusinessCard: renderBusinessCard,
    renderStats: renderStats,
    initializeNavigation: initializeNavigation,
    mountReady: mountReady,
    mountFail: mountFail
  };
})(window);
