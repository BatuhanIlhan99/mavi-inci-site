(function () {
  var Boot = window.MaviInciBoot;
  var Data = window.MaviInciData;
  var Shell = window.MaviInciShell;
  if (!Data || !Shell) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Sayfa cekirdek dosyalari yuklenemedi.</div>';
    if (Boot && typeof Boot.fail === 'function') Boot.fail('Deneyimler sayfasi cekirdek dosyalari yuklenemedi.');
    return;
  }

  var state = Data.resolveSiteData();
  var galleryItems = Data.getGalleryItems(state);
  var galleryState = { category: 'Tumu', currentItems: galleryItems.slice(), currentIndex: 0 };
  var featureLibrary = [
    { icon: '01', title: 'Sahil Ritmi', text: 'Gun dogumundan gun batimina uzanan deniz yakinligi, konaklamaya sakin ve davetkar bir ritim katar.' },
    { icon: '02', title: 'Butik Servis', text: 'Kucuk olcegin avantaji ile daha hizli geri donus, daha dikkatli yonlendirme ve daha net iletisim sunariz.' },
    { icon: '03', title: 'Ozenli Kahvalti', text: 'Yerel dokunuslar ve rahat bir sabah temposuyla kahvalti deneyimini gunun keyifli bir parcasina donustururuz.' },
    { icon: '04', title: 'Gun Batimi Atmosferi', text: 'Aksam saatlerinde ortak alanlar ve sahil hatti, otelin mavi beyaz kimligini en guclu sekilde hissettirir.' }
  ];

  function renderPageHero() {
    return '<section class="page-hero page-hero-experiences"><div class="container page-hero-grid"><div class="page-hero-copy"><div class="hero-prelude"><span class="hero-chip">Deneyimler ve Teklifler</span><span class="hero-rule"></span><span class="hero-annotation">Iyi otel sitelerinde odalar kadar deneyim, teklif ve mekan ritmi de net okunur</span></div><p class="kicker">Deneyimler</p><h1 class="hero-title room-page-title">Konaklamayi tamamlayan deneyimler, avantajlar ve galeri akisi</h1><p class="hero-text">Bu sayfada servis basliklarini, galeri secimini, imza paketleri ve sezon avantajlarini tek bir kurgu icinde topladik. Amacimiz yalnizca guzel bir sunum degil; misafirin neyi, neden tercih ettigini daha net hissettirmek.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Rezervasyon Sayfasina Gec</a><a class="button button-secondary" href="#galeri">Galeriyi Incele</a></div></div><aside class="page-hero-aside"><article class="contact-card"><p class="section-kicker">Bugunun Ruhu</p><h3>Deneyim basliklari</h3><div class="summary-line"><span>Sahil</span><strong>' + (state.hotel.beachService ? 'Servis destekli sakin akisi' : 'Sakin sahil ritmi') + '</strong></div><div class="summary-line"><span>Kahvalti</span><strong>' + Data.escapeHtml(state.hotel.breakfastHours) + '</strong></div><div class="summary-line"><span>Transfer</span><strong>' + (state.hotel.airportTransfer ? 'Not alinabilir' : 'Standart ulasim') + '</strong></div><div class="summary-line"><span>Direkt Hat</span><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong></div></article></aside></div></section>';
  }

  function renderFeatures() {
    return '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Otel Deneyimi</p><h2 class="section-title">Sadece bir oda degil, butunsel bir konaklama ritmi</h2><p class="section-text">Gucu yalnizca fotografa birakmiyor; deneyim basliklarini da karar surecinin parcasina donusturuyoruz. Bu sayfa, konaklamayi tamamlayan detaylari daha okunur hale getirir.</p></div><div class="features-grid">' + featureLibrary.map(function (item) { return '<article class="feature-card"><div class="feature-icon">' + Data.escapeHtml(item.icon) + '</div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p></article>'; }).join('') + '</div></div></section>';
  }

  function buildSignaturePackages() {
    var deluxe = Data.getRoomByKey(state, 'deniz-manzarali-delux') || Data.getRoomByKey(state, 'sultan-keyfi') || Data.getActiveRooms(state)[0];
    var family = Data.getRoomByKey(state, 'standart-buyuk') || Data.getRoomByKey(state, 'standart') || deluxe;
    var solo = Data.getRoomByKey(state, 'tek-kisilik') || Data.getRoomByKey(state, 'standart') || family;
    var promo = Data.getPrimaryPromotion(state);
    return [
      { title: 'Sunset Escape', kicker: 'Imza Kacamak', room: deluxe, note: 'Gun batimi saatini manzara ve ozel servis hissiyle birlestiren daha rafine bir iki kisilik kacamak.', perks: ['Deniz odakli oda secimi', 'Gun batimi saatine uygun varis duzeni', 'Premium banyo seti ve daha yavas sabah akisi'], accent: true },
      { title: 'Aile Mavi Beyaz Paketi', kicker: 'Daha Genis Yasam', room: family, note: 'Ailece Erdek ritmine rahat bir giris yapmak isteyenler icin daha genis plan, daha sakin bir tempo.', perks: ['Daha rahat hareket alani', 'Cocuklu konaklamaya uygun duzen', 'Kahvalti ve sahil ritmi icin dengeli planlama'], accent: false },
      { title: 'Weekday Reset', kicker: promo ? 'Web Avantaji' : 'Yavas Konaklama', room: solo, note: promo ? 'Aktif web kampanyasi ile hafta ici daha sakin, daha hizli karar verilen bir konaklama alternatifi.' : 'Hafta ici daha sessiz bir ritimde calisma ve dinlenme dengesini koruyan sade bir kacis.', perks: ['Hafta ici daha sakin operasyon', 'Hizli check-in ve net fiyat akisi', promo ? promo.code + ' koduyla ek avantaj' : 'Kisa ve verimli konaklama kompozisyonu'], accent: false }
    ];
  }

  function renderSignaturePackages() {
    var packages = buildSignaturePackages();
    return '<section class="section section-light section-packages" id="imza-paketler"><div class="container"><div class="section-header"><p class="section-kicker">Ozel Deneyim Paketleri</p><h2 class="section-title">Hazir kurgulanmis konaklama senaryolari</h2><p class="section-text">Misafirlerimizin sifirdan karar vermek zorunda kalmamasi icin, oda seceneklerini konaklama niyetiyle birlikte paketledik ve daha sezgisel bir secim akisi kurduk.</p></div><div class="package-grid">' + packages.map(function (item) { var room = item.room; return '<article class="package-card' + (item.accent ? ' is-featured' : '') + '"><div class="package-topline"><span class="package-kicker">' + Data.escapeHtml(item.kicker) + '</span><span class="tag">' + Data.escapeHtml(room.short || room.name) + '</span></div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.note) + '</p><div class="package-meta"><div><span>Oda</span><strong>' + Data.escapeHtml(room.name) + '</strong></div><div><span>Baslangic</span><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong></div></div><ul class="package-perks">' + item.perks.map(function (perk) { return '<li>' + Data.escapeHtml(perk) + '</li>'; }).join('') + '</ul><div class="package-actions"><a class="button button-dark" href="' + Shell.bookingHref(room) + '">Rezervasyona Git</a><a class="button button-soft" href="' + Shell.roomHref(room) + '">Odayi Incele</a></div></article>'; }).join('') + '</div></div></section>';
  }

  function formatSeasonWindow(item) {
    return Data.formatShortDate(item.start) + ' - ' + Data.formatShortDate(item.end);
  }

  function renderSeasonalOffers() {
    var promotions = state.promotions.slice(0, 3);
    var seasonal = state.seasonalPricing.slice(0, 3);
    return '<section class="section section-dark section-seasonal" id="sezon-firsatlari"><div class="container seasonal-grid"><article class="seasonal-panel"><div class="section-header"><p class="section-kicker">Sezon Teklifleri</p><h2 class="section-title">Fiyat mantigi, promosyon ve sezon etkisi tek yerde</h2><p class="section-text">Dogrudan rezervasyonda fiyat mantiginin saklanmamasini onemsiyoruz. Bu bolum, misafirlerimizin kampanya ve sezon etkisini daha guvenle okumasina yardimci olur.</p></div><div class="seasonal-card-grid">' + seasonal.map(function (item, index) { var multiplier = Number(item.multiplier || 1); var change = Math.round(Math.abs(multiplier - 1) * 100); var label = multiplier >= 1 ? '%' + change + ' sezon etkisi' : '%' + change + ' web avantaji'; return '<article class="seasonal-card' + (index === 0 ? ' is-accent' : '') + '"><div class="seasonal-topline"><span class="tag">' + Data.escapeHtml(label) + '</span><span>' + Data.escapeHtml(item.channel || 'Tum Kanallar') + '</span></div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.note) + '</p><div class="seasonal-meta"><strong>' + Data.escapeHtml(formatSeasonWindow(item)) + '</strong><span>' + (multiplier >= 1 ? 'Talep yogunlugu fiyata yansir' : 'Web rezervasyonunda fiyat avantaji') + '</span></div></article>'; }).join('') + '</div></article><aside class="seasonal-brief"><p class="section-kicker">Aktif Promosyonlar</p><h3>Karar anini hizlandiran web avantajlari</h3><div class="seasonal-promo-list">' + promotions.map(function (promo) { return '<article class="seasonal-promo-card"><div><span class="tag">%' + promo.discount + ' avantaj</span><h4>' + Data.escapeHtml(promo.title) + '</h4></div><p>' + Data.escapeHtml(promo.note) + '</p><div class="seasonal-meta"><strong>Kod: ' + Data.escapeHtml(promo.code) + '</strong><span>' + (promo.status === 'active' ? 'Su an kullanima acik' : 'Planlanan kampanya') + '</span></div></article>'; }).join('') + '</div><div class="seasonal-note"><strong>Direkt rezervasyon notu</strong><p>Teklif sayfasi yalnizca kampanya gostermek icin degil, misafirlerimizin neden dogrudan bizimle iletisim kurmasi gerektigini guclu ve guven veren bir dille anlatmak icin de tasarlandi.</p></div></aside></div></section>';
  }

  function renderGalleryCard(item) {
    return '<article class="gallery-card" data-gallery-card data-category="' + Data.escapeHtml(item.category || 'Galeri') + '" data-gallery-id="' + Data.escapeHtml(item.id) + '"><button class="gallery-card-button" type="button" data-gallery-open="' + Data.escapeHtml(item.id) + '"><div class="gallery-media">' + Shell.renderMedia(item, item.title, { loading: 'lazy', fetchPriority: 'low' }) + '</div><div class="gallery-caption"><h3>' + Data.escapeHtml(item.title) + '</h3><span>' + Data.escapeHtml(item.category || 'Galeri') + '</span></div></button></article>';
  }

  function renderGallery() {
    var categories = Data.getGalleryCategories(state);
    return '<section class="section section-light" id="galeri"><div class="container"><div class="gallery-heading"><div><p class="section-kicker">Galeri</p><h2>Otel atmosferini anlatan secili kareler</h2></div><p class="section-text">Galeri akisini deneyimler sayfasina entegre ederek oda, ortak alan ve sahil hissini tek bir editorial duzende gezilebilir hale getirdik.</p></div><div class="gallery-filters" id="galleryFilters">' + categories.map(function (category, index) { return '<button class="filter-chip' + (index === 0 ? ' is-active' : '') + '" type="button" data-gallery-filter="' + Data.escapeHtml(category) + '">' + Data.escapeHtml(category) + '</button>'; }).join('') + '</div><div class="gallery-grid" id="galleryGrid">' + galleryItems.map(renderGalleryCard).join('') + '</div></div></section>';
  }

  function renderLocalGuide() {
    var cards = [
      { title: 'Gun Batimi Saati', text: 'Sahilden terasa donen kisa bir rota ile gunun tonunu yavasca degistiren saatler.', meta: 'Aksam ritmi' },
      { title: 'Kahvalti Sonrasi Rota', text: 'Otelin sakin temposunu bozmadan Erdek kiyisina acilan yurumeler ve deniz havasina yakin bir plan.', meta: 'Sabah ritmi' },
      { title: 'Sessiz Ogleden Sonra', text: 'Oda, lounge ve sahil arasinda acele etmeyen bir tatil duzeni icin sade bir zaman kurgusu.', meta: 'Butik tempo' }
    ];
    return '<section class="section section-light section-destination"><div class="container"><div class="section-header"><p class="section-kicker">Mekanin Ruhu</p><h2 class="section-title">Deneyim sayfasini yalnizca imkan listesi olmaktan cikardik</h2><p class="section-text">Iyi otel siteleri yalnizca ne sundugunu degil, konaklamanin nasil hissettirdigini de aktarir. Bu nedenle deneyim sayfasina daha editorial, daha yavas ve daha secici bir akis ekledik.</p></div><div class="destination-grid">' + cards.map(function (item) { return '<article class="destination-card"><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><span>' + Data.escapeHtml(item.meta) + '</span></article>'; }).join('') + '</div></div></section>';
  }

  function renderApp() {
    return '<div class="shell">' +
      Shell.renderTopStrip(state) +
      Shell.renderHeader(state, 'experiences') +
      '<main>' + renderPageHero() + renderFeatures() + renderSignaturePackages() + renderSeasonalOffers() + renderGallery() + renderLocalGuide() + '</main>' +
      Shell.renderFooter(state, 'experiences') +
      Shell.renderFloatingActions(state, { primaryHref: Shell.pageHref('booking'), primaryTitle: 'Rezervasyon', primaryLabel: 'Planlamaya Gec', secondaryLabel: 'Deneyim Icin Yaz' }) +
      '<div class="lightbox hidden" id="lightbox" aria-hidden="true"><div class="lightbox-backdrop" data-lightbox-close></div><div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Galeri buyutme"><button class="lightbox-close" type="button" data-lightbox-close>Kapat</button><div class="lightbox-stage" id="lightboxStage"></div><div class="lightbox-meta"><div><strong id="lightboxTitle">Galeri</strong><span id="lightboxCaption"></span></div><div class="lightbox-controls"><button class="lightbox-nav" type="button" id="lightboxPrev">Onceki</button><span id="lightboxCounter">1 / 1</span><button class="lightbox-nav" type="button" id="lightboxNext">Sonraki</button></div></div></div></div>' +
      '</div>';
  }

  function initializeGalleryFlow() {
    var filters = document.querySelectorAll('[data-gallery-filter]');
    var cards = document.querySelectorAll('[data-gallery-card]');
    var lightbox = document.getElementById('lightbox');
    var stage = document.getElementById('lightboxStage');
    var title = document.getElementById('lightboxTitle');
    var caption = document.getElementById('lightboxCaption');
    var counter = document.getElementById('lightboxCounter');
    var prev = document.getElementById('lightboxPrev');
    var next = document.getElementById('lightboxNext');
    if (!lightbox || !stage || !title || !caption || !counter || !prev || !next) return;

    function filteredItems() {
      if (galleryState.category === 'Tumu') return galleryItems.slice();
      return galleryItems.filter(function (item) { return item.category === galleryState.category; });
    }

    function applyFilter(category) {
      galleryState.category = category;
      galleryState.currentItems = filteredItems();
      filters.forEach(function (button) {
        button.classList.toggle('is-active', button.getAttribute('data-gallery-filter') === category);
      });
      cards.forEach(function (card) {
        var visible = category === 'Tumu' || card.getAttribute('data-category') === category;
        card.classList.toggle('is-hidden', !visible);
      });
    }

    function renderLightboxItem() {
      var item = galleryState.currentItems[galleryState.currentIndex];
      if (!item) return;
      stage.innerHTML = item.src ? '<img class="lightbox-image" src="' + item.src + '" alt="' + Data.escapeHtml(item.alt || item.title) + '" loading="eager" decoding="async" fetchpriority="high">' : '<div class="lightbox-placeholder" style="background:' + Data.escapeHtml(item.color || 'linear-gradient(135deg,#4c8ca9,#e4cfad)') + ';"><span>' + Data.escapeHtml(item.title) + '</span></div>';
      title.textContent = item.title || 'Galeri';
      caption.textContent = item.category || 'Galeri';
      counter.textContent = (galleryState.currentIndex + 1) + ' / ' + galleryState.currentItems.length;
    }

    function openById(id) {
      galleryState.currentItems = filteredItems();
      galleryState.currentIndex = Math.max(0, galleryState.currentItems.findIndex(function (item) { return item.id === id; }));
      renderLightboxItem();
      lightbox.classList.remove('hidden');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function close() {
      lightbox.classList.add('hidden');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    function step(direction) {
      if (!galleryState.currentItems.length) return;
      galleryState.currentIndex = (galleryState.currentIndex + direction + galleryState.currentItems.length) % galleryState.currentItems.length;
      renderLightboxItem();
    }

    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        applyFilter(button.getAttribute('data-gallery-filter'));
      });
    });

    document.querySelectorAll('[data-gallery-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        openById(button.getAttribute('data-gallery-open'));
      });
    });

    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (button) {
      button.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (event) {
      if (lightbox.classList.contains('hidden')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    });

    applyFilter('Tumu');
  }

  function mount() {
    Shell.updateMeta(state, {
      title: state.hotel.name + ' | Deneyimler ve Teklifler',
      description: 'Mavi Inci Park Otel deneyimler sayfasi; galeri, imza konaklama paketleri, sezon teklifleri ve direkt rezervasyon avantajlarini tek sayfada toplar.',
      canonical: Data.getSiteUrl(state, '/deneyimler.html'),
      keywords: ['Mavi Inci Park Otel deneyimler', 'Erdek otel galeri', 'otel paketleri', 'sezon teklifleri butik otel']
    });
    document.getElementById('root').innerHTML = renderApp();
    Shell.initializeNavigation();
    initializeGalleryFlow();
    Shell.initializeRevealAnimations();
    if (Boot && typeof Boot.markMounted === 'function') Boot.markMounted();
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      mount();
    } catch (error) {
      console.error(error);
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Deneyimler sayfasi yuklenirken bir hata olustu.</div>';
      if (Boot && typeof Boot.fail === 'function') Boot.fail('Deneyimler sayfasi yuklenirken teknik bir sorun olustu.');
    }
  });
})();
