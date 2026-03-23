(function () {
  var Data = window.MaviInciData;
  if (!Data) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Veri katmani yuklenemedi.</div>';
    return;
  }

  var state = Data.resolveSiteData();
  var params = new URLSearchParams(window.location.search);
  var room = Data.getRoomByKey(state, params.get('room')) || Data.getActiveRooms(state)[0];
  var galleryItems = Data.getRoomGallery(state, room.id);
  var primaryGalleryItem = galleryItems[0] || { id: 'fallback-room-gallery', title: room.name, category: 'Oda', color: 'linear-gradient(135deg,#4c8ca9,#e4cfad)' };
  var galleryState = { items: galleryItems.length ? galleryItems.slice() : [primaryGalleryItem], index: 0 };
  var revealObserver = null;
  var detailKeydownHandler = null;

  function bookingHref() {
    return './index.html?room=' + encodeURIComponent(Data.getRoomKey(room)) + '#rezervasyon';
  }

  function renderMedia(item, fallbackLabel, options) {
    options = options || {};
    if (item && item.src) {
      var loading = options.loading || 'lazy';
      var decoding = options.decoding || (loading === 'eager' ? 'sync' : 'async');
      var fetchPriority = options.fetchPriority || (loading === 'eager' ? 'high' : 'low');
      return '<img src="' + item.src + '" alt="' + Data.escapeHtml(item.alt || item.title || fallbackLabel) + '" loading="' + loading + '" decoding="' + decoding + '" fetchpriority="' + fetchPriority + '">';
    }
    return '<div class="media-fallback" style="background:' + Data.escapeHtml(item.color || 'linear-gradient(135deg,#4c8ca9,#e4cfad)') + ';"><span>' + Data.escapeHtml(item.title || fallbackLabel) + '</span></div>';
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

  function buildRoomStructuredData() {
    var roomKey = Data.getRoomKey(room);
    var canonical = Data.getSiteUrl(state, '/room.html?room=' + encodeURIComponent(roomKey));
    var siteUrl = Data.getSiteUrl(state, '/');
    var sizeValue = parseInt(String(room.size || '').replace(/[^\d]/g, ''), 10);
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: state.hotel.name, item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Odalar', item: Data.getSiteUrl(state, '/#odalar') },
          { '@type': 'ListItem', position: 3, name: room.name, item: canonical }
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'HotelRoom',
        name: room.name + ' | ' + state.hotel.name,
        description: room.story || room.notes || state.hotel.description,
        url: canonical,
        image: Data.getSiteUrl(state, '/favicon.svg'),
        bed: room.bed,
        occupancy: {
          '@type': 'QuantitativeValue',
          maxValue: Number(room.capacityAdults || 0) + Number(room.capacityChildren || 0)
        },
        floorSize: isNaN(sizeValue) ? undefined : {
          '@type': 'QuantitativeValue',
          value: sizeValue,
          unitCode: 'MTK'
        },
        amenityFeature: (room.includes || []).map(function (item) {
          return {
            '@type': 'LocationFeatureSpecification',
            name: item,
            value: true
          };
        }),
        isPartOf: {
          '@type': 'Hotel',
          name: state.hotel.name,
          url: siteUrl
        }
      }
    ];
  }

  function availabilitySlice() {
    return state.availability.slice(0, 7);
  }

  function renderHeader() {
    return '<div class="top-strip"><div class="container top-strip-inner"><div><strong>Oda Detay Sayfasi</strong> | ' + Data.escapeHtml(room.name) + '</div><div class="quick-meta"><span>' + Data.formatMoney(state, room.nightlyPrice) + ' / gece</span><span>' + room.size + '</span><span>' + room.view + '</span></div></div></div><header class="site-header"><div class="container nav-shell"><a class="brand" href="./index.html#anasayfa"><span class="brand-mark">MI</span><span class="brand-copy"><strong>' + Data.escapeHtml(state.hotel.name) + '</strong><span>Oda Detayi</span></span></a><nav class="desktop-nav" aria-label="Oda navigasyonu"><a href="./index.html#odalar">Tum Odalar</a><a href="#oda-galerisi">Galeri</a><a href="#oda-detaylari">Detaylar</a><a href="#benzer-odalar">Benzer Odalar</a></nav><div class="nav-actions"><a class="button button-secondary" href="./index.html">Ana Sayfa</a><a class="button button-primary" href="' + bookingHref() + '">Bu Odayi Rezerve Et</a></div></div></header>';
  }

  function renderHeroSignatureCard(item) {
    return '<article class="hero-signature-card"><span>' + Data.escapeHtml(item.label) + '</span><strong>' + Data.escapeHtml(item.value) + '</strong></article>';
  }

  function renderHero() {
    var heroMedia = primaryGalleryItem;
    var signatureCards = [
      { label: 'Hafta Ici Baslangic', value: Data.formatMoney(state, room.nightlyPrice) },
      { label: 'Hafta Sonu Baslangic', value: Data.formatMoney(state, room.weekendPrice || room.nightlyPrice) },
      { label: 'Sabah Akisi', value: 'Kahvalti ' + state.hotel.breakfastHours }
    ];
    var ribbons = (room.highlights && room.highlights.length ? room.highlights : state.content.highlights).slice(0, 3);
    var includePreview = (room.includes || []).slice(0, 3);
    return '<section class="room-page-hero"><div class="container room-page-grid"><div class="room-page-copy"><div class="hero-prelude"><span class="hero-chip">Mavi / Beyaz / Oda Deneyimi</span><span class="hero-rule"></span><span class="hero-annotation">' + Data.escapeHtml(room.view) + ' gorunumu ve mavi beyaz detaylarla kurgulanan oda akisi</span></div><div class="breadcrumb"><a href="./index.html">Ana Sayfa</a><span>/</span><a href="./index.html#odalar">Odalar</a><span>/</span><strong>' + Data.escapeHtml(room.name) + '</strong></div><p class="kicker">Oda Deneyimi</p><h1 class="hero-title room-page-title">' + Data.escapeHtml(room.name) + '</h1><p class="hero-text">' + Data.escapeHtml(room.story || room.notes || state.hotel.description) + '</p><div class="hero-ribbon-row">' + ribbons.map(function (item) { return '<span class="hero-ribbon">' + Data.escapeHtml(item) + '</span>'; }).join('') + '</div><div class="hero-actions"><a class="button button-primary" href="' + bookingHref() + '">Rezervasyon Formuna Git</a><a class="button button-secondary" href="#oda-galerisi">Gorselleri Incele</a></div><div class="hero-signature-grid">' + signatureCards.map(renderHeroSignatureCard).join('') + '</div><div class="room-facts-grid"><article class="fact-chip"><strong>' + Data.escapeHtml(room.size) + '</strong><span>yasam alani</span></article><article class="fact-chip"><strong>' + Data.escapeHtml(room.view) + '</strong><span>gorunum</span></article><article class="fact-chip"><strong>' + Data.escapeHtml(room.bed) + '</strong><span>yatak duzeni</span></article><article class="fact-chip"><strong>' + room.capacityAdults + ' + ' + room.capacityChildren + '</strong><span>kapasite</span></article></div><div class="hero-meta"><article class="detail-card"><h3>Odada Dahil Olanlar</h3><ul class="detail-list">' + includePreview.map(function (item) { return '<li>' + Data.escapeHtml(item) + '</li>'; }).join('') + '</ul></article><article class="detail-card"><h3>Planlama Notlari</h3><ul class="detail-list"><li>Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + ' / Check-out ' + Data.escapeHtml(state.hotel.checkOutTime) + '</li><li>' + (state.hotel.airportTransfer ? 'Transfer talebi rezervasyon sirasinda eklenebilir.' : 'Pratik giris ve hizli ekip donusu planlanir.') + '</li><li>' + (Number(room.availableRooms) > 0 ? room.availableRooms + ' oda su an musait gorunuyor.' : 'Oda bekleme listesi akisi ile yonetiliyor.') + '</li></ul></article></div></div><aside class="room-summary-card"><div class="room-summary-media">' + renderMedia(heroMedia, room.name, { loading: 'eager', fetchPriority: 'high' }) + '</div><div class="room-summary-body"><span class="tag">' + (Number(room.availableRooms) > 0 ? room.availableRooms + ' oda musait' : 'Bekleme listesi') + '</span><h2>' + Data.escapeHtml(room.name) + '</h2><div class="room-summary-price"><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong><span>/ hafta ici baslangic</span></div><div class="summary-line"><span>Hafta sonu</span><strong>' + Data.formatMoney(state, room.weekendPrice || room.nightlyPrice) + '</strong></div><div class="summary-line"><span>Banyo</span><strong>' + Data.escapeHtml(room.bathroom) + '</strong></div><div class="summary-line"><span>Check-in</span><strong>' + Data.escapeHtml(state.hotel.checkInTime) + '</strong></div><div class="summary-line"><span>Check-out</span><strong>' + Data.escapeHtml(state.hotel.checkOutTime) + '</strong></div></div></aside></div><div class="container hero-collector room-hero-collector"><div class="hero-collector-card"><span>Stay Composition</span><strong>' + Data.escapeHtml(room.notes || 'Deniz ritmi, yalnizlik hissi ve konforlu bir yasam alani dengede tutuldu.') + '</strong></div><div class="hero-collector-card"><span>Operational Clarity</span><strong>' + (state.hotel.onlineBooking ? 'Bu oda rezervasyon akisinda on secili ve fiyat ozetiyle ilerliyor.' : 'Bu oda ekip teyidi ile planlanan kontrollu rezervasyon akisinda sunuluyor.') + '</strong></div><div class="hero-collector-card"><span>Guest Fit</span><strong>' + room.capacityAdults + ' yetiskin ve ' + room.capacityChildren + ' cocuk kapasitesi ile ' + Data.escapeHtml(room.name) + ' dengeli bir konaklama alternatifi sunuyor.</strong></div></div></section>';
  }

  function renderGallerySection() {
    var thumbs = galleryItems.slice(1);
    return '<section class="section section-light room-detail-section" id="oda-galerisi"><div class="container"><div class="section-header"><p class="section-kicker">Oda Galerisi</p><h2 class="section-title">' + Data.escapeHtml(room.name) + ' icin secilmis kareler</h2><p class="section-text">Oda icindeki detaylar ile otelin ortak deneyim alanlarini ayni akista gorebilirsiniz.</p></div><div class="room-gallery-layout"><button class="room-gallery-stage" type="button" data-room-gallery-open="' + Data.escapeHtml(primaryGalleryItem.id) + '">' + renderMedia(primaryGalleryItem, room.name, { loading: 'lazy', fetchPriority: 'low' }) + '</button><div class="room-gallery-grid">' + (thumbs.length ? thumbs.map(function (item) { return '<button class="room-gallery-thumb" type="button" data-room-gallery-open="' + Data.escapeHtml(item.id) + '">' + renderMedia(item, item.title, { loading: 'lazy', fetchPriority: 'low' }) + '<span>' + Data.escapeHtml(item.title) + '</span></button>'; }).join('') : '<article class="value-prop room-gallery-note"><h3>Daha fazla kare yakinda</h3><p>Bu oda icin ek gorseller admin panelinden yuklendiginde burada otomatik gorunur.</p></article>') + '</div></div></div></section>';
  }

  function renderDetailSection() {
    return '<section class="section section-light room-detail-section" id="oda-detaylari"><div class="container room-detail-columns"><article class="story-card"><p class="section-kicker">Oda Hikayesi</p><h2>' + Data.escapeHtml(room.name) + ' nasil bir deneyim sunuyor?</h2><p class="story-copy">' + Data.escapeHtml(room.story || room.notes || '') + '</p><ul class="highlight-list">' + (room.highlights || []).map(function (item) { return '<li>' + Data.escapeHtml(item) + '</li>'; }).join('') + '</ul></article><div class="value-stack"><article class="value-prop"><h3>Neler Dahil?</h3><ul class="detail-list detail-list-dark">' + (room.includes || []).map(function (item) { return '<li>' + Data.escapeHtml(item) + '</li>'; }).join('') + '</ul></article><article class="value-prop"><h3>Oda Teknik Bilgileri</h3><ul class="detail-list detail-list-dark"><li>' + Data.escapeHtml(room.amenities) + '</li><li>' + Data.escapeHtml(room.bathroom) + '</li><li>' + Data.escapeHtml(room.view) + '</li><li>' + room.capacityAdults + ' yetiskin / ' + room.capacityChildren + ' cocuk</li></ul></article></div></div></section>';
  }

  function renderAvailabilitySection() {
    return '<section class="section section-dark room-detail-section"><div class="container room-detail-columns"><article class="editorial-card"><p class="section-kicker">Kisa Musaitlik Bakisi</p><h2 class="editorial-title">Yaklasan gunlerde durum</h2><div class="availability-list availability-list-wide">' + availabilitySlice().map(function (item) { return '<div class="availability-item"><div><strong>' + Data.formatShortDate(item.date) + '</strong><span>' + Data.escapeHtml(item.note) + '</span></div><span class="status-pill status-' + item.status + '">' + Data.getAvailabilityLabel(item.status) + '</span></div>'; }).join('') + '</div></article><article class="editorial-card"><p class="section-kicker">Rezervasyon Notu</p><h2 class="editorial-title">Bu odaya dogrudan gecis yapin</h2><ul class="booking-bullets"><li>Oda tipi on secili gelir</li><li>Admin paneldeki fiyat kurallari tahmine yansir</li><li>Talep admin rezervasyon listesine otomatik duser</li><li>WhatsApp veya telefonla hizli geri donus saglanir</li></ul><div class="hero-actions"><a class="button button-primary" href="' + bookingHref() + '">Rezervasyon Adimina Git</a><a class="button button-secondary" href="./index.html#galeri">Tum Galeriyi Goster</a></div></article></div></section>';
  }

  function renderSimilarRooms() {
    var others = Data.getActiveRooms(state).filter(function (item) { return item.id !== room.id; }).slice(0, 2);
    return '<section class="section section-light room-detail-section" id="benzer-odalar"><div class="container"><div class="section-header"><p class="section-kicker">Benzer Oda Secenekleri</p><h2 class="section-title">Baska bir atmosfer denemek isterseniz</h2></div><div class="room-related-grid">' + others.map(function (item, index) { var media = Data.getRoomGallery(state, item.id)[0] || galleryItems[index] || { title: item.name, color: 'linear-gradient(135deg,#4c8ca9,#e4cfad)' }; return '<article class="room-related-card"><a class="room-related-media" href="./room.html?room=' + encodeURIComponent(Data.getRoomKey(item)) + '">' + renderMedia(media, item.name, { loading: 'lazy', fetchPriority: 'low' }) + '</a><div class="room-related-body"><h3>' + Data.escapeHtml(item.name) + '</h3><p>' + Data.escapeHtml(item.notes || item.story || '') + '</p><div class="room-related-actions"><a class="button button-dark" href="./room.html?room=' + encodeURIComponent(Data.getRoomKey(item)) + '">Detaylari Incele</a><a class="button button-soft" href="./index.html?room=' + encodeURIComponent(Data.getRoomKey(item)) + '#rezervasyon">Rezerve Et</a></div></div></article>'; }).join('') + '</div></div></section>';
  }

  function renderFooter() {
    return '<footer class="footer"><div class="container footer-grid"><div class="footer-brand"><strong>' + Data.escapeHtml(state.hotel.name) + '</strong><span>' + Data.escapeHtml(state.hotel.description) + '</span></div><div><p class="section-kicker">Oda Akisi</p><div class="footer-links"><a href="#oda-galerisi">Galeri</a><a href="#oda-detaylari">Detaylar</a><a href="#benzer-odalar">Benzer Odalar</a><a href="./index.html#rezervasyon">Rezervasyon</a></div></div><div><p class="section-kicker">Iletisim</p><div class="footer-links"><a href="tel:' + Data.escapeHtml(state.hotel.phone) + '">' + Data.escapeHtml(state.hotel.phone) + '</a><a href="mailto:' + Data.escapeHtml(state.hotel.email) + '">' + Data.escapeHtml(state.hotel.email) + '</a><a href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp</a></div></div><div><p class="section-kicker">Diger</p><div class="footer-links"><a href="./index.html">Ana Sayfa</a><a href="./index.html#odalar">Tum Odalar</a><a href="./admin.html">Admin Paneli</a></div></div></div><div class="container footer-note"><div class="footer-meta">Oda detay sayfasi admin paneldeki oda bilgilerini okur.</div><div class="footer-meta">' + Data.escapeHtml(room.name) + '</div></div></footer><div class="lightbox hidden" id="detailLightbox" aria-hidden="true"><div class="lightbox-backdrop" data-detail-close></div><div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Oda galerisi"><button class="lightbox-close" type="button" data-detail-close>Kapat</button><div class="lightbox-stage" id="detailStage"></div><div class="lightbox-meta"><div><strong id="detailTitle">Galeri</strong><span id="detailCaption"></span></div><div class="lightbox-controls"><button class="lightbox-nav" type="button" id="detailPrev">Onceki</button><span id="detailCounter">1 / 1</span><button class="lightbox-nav" type="button" id="detailNext">Sonraki</button></div></div></div></div>';
  }

  function renderApp() {
    return '<div class="shell room-page-shell">' + renderHeader() + renderHero() + '<main>' + renderGallerySection() + renderDetailSection() + renderAvailabilitySection() + renderSimilarRooms() + '</main>' + renderFooter() + '</div>';
  }

  function updateMeta() {
    var title = state.hotel.name + ' | ' + room.name;
    var description = room.story || room.notes || state.hotel.description;
    var canonical = Data.getSiteUrl(state, '/room.html?room=' + encodeURIComponent(Data.getRoomKey(room)));
    var image = Data.getSiteUrl(state, '/favicon.svg');
    var keywords = [
      state.hotel.name,
      room.name,
      'Erdek oda detay'
    ].concat(room.highlights || []).join(', ');

    document.title = title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);

    setMetaTag('meta[name="keywords"]', { name: 'keywords' }, keywords);
    setMetaTag('meta[property="og:title"]', { property: 'og:title' }, title);
    setMetaTag('meta[property="og:description"]', { property: 'og:description' }, description);
    setMetaTag('meta[property="og:url"]', { property: 'og:url' }, canonical);
    setMetaTag('meta[property="og:image"]', { property: 'og:image' }, image);
    setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image' }, image);
    setLinkTag('link[rel="canonical"]', { rel: 'canonical' }, canonical);
    setStructuredData(buildRoomStructuredData());
  }

  function refreshStateFromStorage() {
    state = Data.resolveSiteData();
    room = Data.getRoomByKey(state, params.get('room')) || Data.getActiveRooms(state)[0];
    galleryItems = Data.getRoomGallery(state, room.id);
    primaryGalleryItem = galleryItems[0] || { id: 'fallback-room-gallery', title: room.name, category: 'Oda', color: 'linear-gradient(135deg,#4c8ca9,#e4cfad)' };
    galleryState = { items: galleryItems.length ? galleryItems.slice() : [primaryGalleryItem], index: 0 };
    updateMeta();
    document.getElementById('root').innerHTML = renderApp();
    initializeLightbox();
    initializeRevealAnimations();
  }

  function initializeLightbox() {
    var lightbox = document.getElementById('detailLightbox');
    var stage = document.getElementById('detailStage');
    var title = document.getElementById('detailTitle');
    var caption = document.getElementById('detailCaption');
    var counter = document.getElementById('detailCounter');

    function renderCurrent() {
      var item = galleryState.items[galleryState.index];
      if (!item) return;
      stage.innerHTML = item.src ? '<img class="lightbox-image" src="' + item.src + '" alt="' + Data.escapeHtml(item.alt || item.title) + '" loading="eager" decoding="async" fetchpriority="high">' : '<div class="lightbox-placeholder" style="background:' + Data.escapeHtml(item.color || 'linear-gradient(135deg,#4c8ca9,#e4cfad)') + ';"><span>' + Data.escapeHtml(item.title) + '</span></div>';
      title.textContent = item.title || room.name;
      caption.textContent = item.category || 'Galeri';
      counter.textContent = (galleryState.index + 1) + ' / ' + galleryState.items.length;
    }

    function openById(id) {
      galleryState.index = Math.max(0, galleryState.items.findIndex(function (item) { return item.id === id; }));
      renderCurrent();
      lightbox.classList.remove('hidden');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function close() {
      lightbox.classList.add('hidden');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    function step(direction) {
      galleryState.index = (galleryState.index + direction + galleryState.items.length) % galleryState.items.length;
      renderCurrent();
    }

    document.querySelectorAll('[data-room-gallery-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        openById(button.getAttribute('data-room-gallery-open'));
      });
    });

    lightbox.querySelectorAll('[data-detail-close]').forEach(function (button) {
      button.addEventListener('click', close);
    });
    document.getElementById('detailPrev').addEventListener('click', function () { step(-1); });
    document.getElementById('detailNext').addEventListener('click', function () { step(1); });
    if (detailKeydownHandler) {
      document.removeEventListener('keydown', detailKeydownHandler);
    }
    detailKeydownHandler = function (event) {
      if (lightbox.classList.contains('hidden')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', detailKeydownHandler);
  }

  function initializeRevealAnimations() {
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.room-page-copy > *, .room-summary-card, .hero-collector-card, .section-header, .room-gallery-stage, .room-gallery-thumb, .story-card, .value-prop, .editorial-card, .room-related-card'
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

  document.addEventListener('DOMContentLoaded', function () {
    try {
      refreshStateFromStorage();
    } catch (error) {
      console.error(error);
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Oda detay sayfasi yuklenemedi.</div>';
    }
  });

  window.addEventListener('storage', function (event) {
    if (event.key === Data.storageKey) {
      refreshStateFromStorage();
    }
  });
})();
