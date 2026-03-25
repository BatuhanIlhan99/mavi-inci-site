(function () {
  var Data = window.HanGroupData;
  var Shell = window.HanShell;

  if (!Data || !Shell) {
    var failedRoot = document.getElementById('root');
    if (failedRoot) {
      failedRoot.innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Han Otelcilik uygulama dosyalari yuklenemedi.</div>';
    }
    if (window.MaviInciBoot && typeof window.MaviInciBoot.fail === 'function') {
      window.MaviInciBoot.fail('Han Otelcilik uygulama dosyalari yuklenemedi.');
    }
    return;
  }

  var ADMIN_USER = 'admin';
  var ADMIN_PASSWORD = '1234';
  var FLASH_KEY = 'han-otelcilik-flash-v1';
  var root = null;

  var ROW_SCHEMAS = {
    stats: {
      title: 'Metrikler',
      addLabel: 'Yeni metrik ekle',
      fields: [
        { key: 'label', label: 'Baslik', placeholder: 'Orn. Oda sayisi' },
        { key: 'value', label: 'Deger', placeholder: 'Orn. 13 oda' }
      ]
    },
    sources: {
      title: 'Kaynaklar',
      addLabel: 'Yeni kaynak ekle',
      fields: [
        { key: 'label', label: 'Kaynak adi', placeholder: 'Orn. Resmi site' },
        { key: 'url', label: 'Baglanti', placeholder: 'https://...' }
      ]
    },
    hotelCollection: {
      title: 'Oda kalemleri',
      addLabel: 'Yeni oda kalemi ekle',
      fields: [
        { key: 'name', label: 'Oda adi', placeholder: 'Standart Oda' },
        { key: 'meta', label: 'Meta', placeholder: '24 m2 | 2 yetiskin' },
        { key: 'price', label: 'Fiyat', placeholder: '4.700 TL' },
        { key: 'note', label: 'Not', placeholder: 'Oda icin kisa operasyon notu' }
      ]
    },
    venueCollection: {
      title: 'Menu / servis kalemleri',
      addLabel: 'Yeni menu kalemi ekle',
      fields: [
        { key: 'name', label: 'Kalem', placeholder: 'Signature Burger' },
        { key: 'meta', label: 'Meta', placeholder: 'Burger + patates + icecek' },
        { key: 'price', label: 'Fiyat', placeholder: 'Panelden girilir' },
        { key: 'note', label: 'Not', placeholder: 'Acilis veya servis notu' }
      ]
    }
  };

  function page() {
    return document.body.getAttribute('data-page') || 'home';
  }

  function businessId() {
    var params = new URLSearchParams(window.location.search);
    return document.body.getAttribute('data-business') || params.get('business') || 'mavi-inci-park-otel';
  }

  function panelSlug(id) {
    if (id === 'mavi-inci-park-otel') return 'mavi-inci';
    if (id === 'gulplaj-hotel') return 'gulplaj';
    if (id === 'villa-ece-pansiyon') return 'villa-ece';
    if (id === 'han-fast-food') return 'fastfood';
    if (id === 'han-pub') return 'pub';
    return id;
  }

  function splitLines(value) {
    return String(value || '')
      .split(/\r?\n|,/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function joinLines(items) {
    return (items || []).join('\n');
  }

  function setFlash(message) {
    window.sessionStorage.setItem(FLASH_KEY, message);
  }

  function consumeFlash() {
    var value = window.sessionStorage.getItem(FLASH_KEY);
    if (value) {
      window.sessionStorage.removeItem(FLASH_KEY);
    }
    return value || '';
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return '-';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  }

  function safe(value) {
    return Shell.escapeHtml(value || '');
  }

  function hero(state, options) {
    options = options || {};
    return '' +
      '<section class="page-hero page-hero-group">' +
      '<div class="container page-hero-grid">' +
      '<div class="page-hero-copy">' +
      '<div class="hero-prelude"><span class="hero-chip">' + safe(options.chip || state.group.name) + '</span><span class="hero-rule"></span><span class="hero-annotation">' + safe(options.annotation || state.group.tagline) + '</span></div>' +
      '<p class="kicker">' + safe(options.kicker || state.group.name) + '</p>' +
      '<h1 class="hero-title room-page-title">' + safe(options.title || state.group.name) + '</h1>' +
      '<p class="hero-text">' + safe(options.text || state.group.description) + '</p>' +
      '<div class="hero-actions">' +
      '<a class="button button-primary" href="' + safe(options.primaryHref || Shell.pageHref('booking')) + '">' + safe(options.primaryLabel || 'Talep Formu') + '</a>' +
      '<a class="button button-secondary" href="' + safe(options.secondaryHref || Shell.pageHref('hotels')) + '">' + safe(options.secondaryLabel || 'Portfoyu Incele') + '</a>' +
      '</div>' +
      (options.statsHtml || '') +
      '</div>' +
      '<aside class="page-hero-aside">' +
      '<article class="contact-card han-side-card">' +
      '<p class="section-kicker">' + safe(options.sideKicker || 'Merkezi Operasyon') + '</p>' +
      '<h3>' + safe(options.sideTitle || 'Tek merkez, ayri markalar') + '</h3>' +
      '<p>' + safe(options.sideText || state.group.reservationNote) + '</p>' +
      '<div class="summary-line"><span>Telefon</span><strong>' + safe(state.group.phone) + '</strong></div>' +
      '<div class="summary-line"><span>E-Posta</span><strong>' + safe(state.group.email) + '</strong></div>' +
      '<div class="summary-line"><span>Konum</span><strong>' + safe(state.group.city) + '</strong></div>' +
      '</article>' +
      '</aside>' +
      '</div>' +
      '</section>';
  }

  function statCards(items) {
    return Shell.renderStats(items || []);
  }

  function infoCards(items) {
    return (items || []).map(function (item) {
      return '' +
        '<article class="feature-card han-tone-card">' +
        '<div class="feature-icon">' + safe(item.icon || '01') + '</div>' +
        '<h3>' + safe(item.title) + '</h3>' +
        '<p>' + safe(item.text) + '</p>' +
        '</article>';
    }).join('');
  }

  function flashBanner(message) {
    if (!message) return '';
    return '<div class="han-flash" role="status">' + safe(message) + '</div>';
  }

  function loginView(title, text) {
    return '' +
      '<div class="shell">' +
      '<main class="section section-light han-login-shell">' +
      '<div class="container">' +
      '<div class="booking-shell han-admin-login">' +
      '<div class="booking-shell-header">' +
      '<h3>' + safe(title) + '</h3>' +
      '<p>' + safe(text) + '</p>' +
      '</div>' +
      '<form id="adminLoginForm" class="form-grid two">' +
      '<label class="field"><span>Kullanici Adi</span><input id="adminUser" type="text" autocomplete="username" required /></label>' +
      '<label class="field"><span>Sifre</span><input id="adminPassword" type="password" autocomplete="current-password" required /></label>' +
      '<div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Panele Gir</button><span class="price-note" id="adminLoginStatus"></span></div>' +
      '</form>' +
      '</div>' +
      '</div>' +
      '</main>' +
      '</div>';
  }

  function publicShell(state, activePage, main) {
    return '<div class="shell">' + Shell.renderHeader(state, activePage) + '<main>' + main + '</main>' + Shell.renderFooter(state) + '</div>';
  }

  function inquiryList(items, title, emptyText) {
    var rows = items || [];
    return '' +
      '<section class="section section-light">' +
      '<div class="container">' +
      '<div class="section-header">' +
      '<p class="section-kicker">Talepler</p>' +
      '<h2 class="section-title">' + safe(title) + '</h2>' +
      '<p class="section-text">Merkezi formdan gelen kayitlar localStorage icinde tutulur ve ilgili isletme bazinda filtrelenir.</p>' +
      '</div>' +
      '<div class="han-inquiry-stack">' +
      (rows.length ? rows.map(function (item) {
        return '' +
          '<article class="contact-card han-inquiry-card">' +
          '<div class="han-inquiry-head"><strong>' + safe(item.name || 'Isimsiz talep') + '</strong><span>' + safe(item.businessName || item.businessId || '-') + '</span></div>' +
          '<div class="han-inquiry-grid">' +
          '<div><span>Talep tipi</span><strong>' + safe(item.type || '-') + '</strong></div>' +
          '<div><span>Telefon</span><strong>' + safe(item.phone || '-') + '</strong></div>' +
          '<div><span>Tarihler</span><strong>' + safe((item.checkIn || '-') + ' / ' + (item.checkOut || '-')) + '</strong></div>' +
          '<div><span>Olusturma</span><strong>' + safe(formatDate(item.createdAt)) + '</strong></div>' +
          '</div>' +
          '<p>' + safe(item.note || 'Talep notu girilmedi.') + '</p>' +
          '</article>';
      }).join('') : '<article class="contact-card"><p>' + safe(emptyText) + '</p></article>') +
      '</div>' +
      '</div>' +
      '</section>';
  }

  function rowItemMarkup(schema, item) {
    return '' +
      '<div class="han-row" data-row-item>' +
      schema.fields.map(function (field) {
        return '' +
          '<label class="field">' +
          '<span>' + safe(field.label) + '</span>' +
          '<input type="text" data-row-key="' + safe(field.key) + '" placeholder="' + safe(field.placeholder) + '" value="' + safe(item[field.key] || '') + '" />' +
          '</label>';
      }).join('') +
      '<button class="button button-ghost han-row-remove" type="button" data-remove-row>Sil</button>' +
      '</div>';
  }

  function rowEditor(groupName, schemaKey, items) {
    var schema = ROW_SCHEMAS[schemaKey];
    var list = items && items.length ? items : [{}];
    return '' +
      '<section class="han-editor-block field-span-2">' +
      '<div class="han-editor-head">' +
      '<h3>' + safe(schema.title) + '</h3>' +
      '<button class="button button-soft" type="button" data-add-row="' + safe(groupName) + '" data-schema="' + safe(schemaKey) + '">' + safe(schema.addLabel) + '</button>' +
      '</div>' +
      '<div class="han-row-editor" data-row-group="' + safe(groupName) + '" data-row-schema="' + safe(schemaKey) + '">' +
      list.map(function (item) { return rowItemMarkup(schema, item); }).join('') +
      '</div>' +
      '</section>';
  }

  function collectionCards(business) {
    var list = business.type === 'hotel' ? business.rooms : business.offerings;
    return (list || []).map(function (item) {
      return '' +
        '<article class="feature-card han-tone-card">' +
        '<div class="feature-icon">' + safe(business.type === 'hotel' ? 'RM' : 'MN') + '</div>' +
        '<h3>' + safe(item.name) + '</h3>' +
        '<p>' + safe(item.meta) + '</p>' +
        '<div class="feature-stat">' + safe(item.price) + '</div>' +
        '<p class="han-note">' + safe(item.note) + '</p>' +
        '</article>';
    }).join('');
  }

  function businessLinks(state) {
    return state.businesses.map(function (item) {
      return '' +
        '<a class="han-mini-link" href="./panel-' + safe(panelSlug(item.id)) + '.html">' +
        '<strong>' + safe(item.name) + '</strong>' +
        '<span>' + safe(item.type === 'hotel' ? 'Otel paneli' : item.type === 'fastfood' ? 'Fast food paneli' : 'Pub paneli') + '</span>' +
        '</a>';
    }).join('');
  }

  function momentList(items) {
    return '<ul class="highlight-list han-moment-list">' + (items || []).map(function (item) {
      return '<li>' + safe(item) + '</li>';
    }).join('') + '</ul>';
  }

  function destinationCards(items) {
    return (items || []).map(function (item) {
      return '' +
        '<article class="contact-card han-destination-card">' +
        '<div class="han-destination-media"><img src="' + safe(item.image) + '" alt="' + safe(item.imageAlt || item.name) + '" loading="lazy" /></div>' +
        '<div class="han-destination-body">' +
        '<div class="stay-preview-intro"><span class="tag">' + safe(item.category) + '</span><span class="stay-preview-note">' + safe(item.bestTime) + '</span></div>' +
        '<h3>' + safe(item.name) + '</h3>' +
        '<p class="han-destination-tagline">' + safe(item.tagline) + '</p>' +
        '<p>' + safe(item.story) + '</p>' +
        '<div class="han-destination-meta"><span>' + safe(item.duration) + '</span><span>' + safe(item.whyGo) + '</span></div>' +
        '<a class="contact-link" href="' + safe(item.sourceUrl) + '">' + safe(item.sourceLabel) + '</a>' +
        '</div>' +
        '</article>';
    }).join('');
  }

  function itineraryCards(items, limit) {
    var list = typeof limit === 'number' ? (items || []).slice(0, limit) : (items || []);
    return list.map(function (item) {
      return '' +
        '<article class="feature-card han-itinerary-card">' +
        '<div class="feature-icon">' + safe(item.day.replace('. Gun', '')) + '</div>' +
        '<h3>' + safe(item.title) + '</h3>' +
        '<p><strong>Sabah:</strong> ' + safe(item.morning) + '</p>' +
        '<p><strong>Ogleden sonra:</strong> ' + safe(item.afternoon) + '</p>' +
        '<p><strong>Aksam:</strong> ' + safe(item.evening) + '</p>' +
        '</article>';
    }).join('');
  }

  function relatedDestinations(state, business) {
    return (business.nearby || []).map(function (id) {
      return Data.getDestinationById(state, id);
    }).filter(Boolean);
  }

  function renderHome(state) {
    var hotels = Data.listHotels(state);
    return publicShell(state, 'home',
      hero(state, {
        kicker: 'Han Otelcilik',
        title: 'Erdekte konaklama, hikaye ve deneyimi bir araya getiren premium grup',
        text: state.group.manifesto,
        primaryLabel: 'Otelleri Incele',
        primaryHref: Shell.pageHref('hotels'),
        secondaryLabel: 'Erdek Rehberi',
        secondaryHref: Shell.pageHref('guide'),
        statsHtml: statCards([
          { label: 'Toplam Isletme', value: String(state.businesses.length) },
          { label: 'Konaklama Markasi', value: String(hotels.length) },
          { label: 'Yeme Icme Birimi', value: String(Data.listVenues(state).length) }
        ]),
        sideTitle: 'Dogrudan Konaklama Avantaji',
        sideText: state.group.directBookingPromise
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Portfoy Yapisi</p><h2 class="section-title">Her isletme ayri sayfa, ayri panel ve ayri deneyim vaadi ile kurgulandi</h2><p class="section-text">Ana sayfa marka hikayesini anlatir; oteller, yeme icme birimleri ve Erdek rehberi ise karar vermeyi kolaylastiran ayri katmanlar olarak calisir.</p></div><div class="stay-preview-grid han-business-grid">' +
      state.businesses.map(function (business) { return Shell.renderBusinessCard(business); }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Grubun Hikayesi</p><h2 class="section-title">Her marka, Erdek deneyiminin farkli bir sahnesini tasir</h2><p class="section-text">' + safe(state.group.description) + '</p></div><div class="han-editorial-grid">' +
      hotels.map(function (business) {
        return '<article class="story-card han-editorial-card"><p class="section-kicker">' + safe(business.shortName) + '</p><h3>' + safe(business.storyTitle) + '</h3><p class="story-copy">' + safe(business.story) + '</p><p class="han-editorial-note">' + safe(business.editorial) + '</p><a class="button button-secondary" href="' + Shell.businessHref(business) + '">Hikayeyi Ac</a></article>';
      }).join('') +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Erdek Rehberi</p><h2>' + safe(state.guide.introTitle) + '</h2><p class="story-copy">' + safe(state.guide.introText) + '</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('guide') + '">Tum Rehberi Ac</a><a class="button button-secondary" href="' + Shell.pageHref('booking') + '">Talep Formu</a></div></article><div class="value-stack"><article class="value-prop"><h3>Bu rehber neden var?</h3><p>Misafirler yalnizca oda degil, iyi kurgulanmis bir destinasyon deneyimi satin alir. Bu yuzden tarihi duraklari, sahil ritmini ve yerel rota onerilerini sayfaya tasidik.</p></article><article class="value-prop"><h3>One cikan duraklar</h3>' + momentList(state.guide.destinations.slice(0, 4).map(function (item) { return item.name + ' | ' + item.tagline; })) + '</article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Kesfet</p><h2 class="section-title">Erdekte mutlaka zaman ayirilmasi gereken duraklar</h2><p class="section-text">Tarihi alanlar, sahil hafizasi ve mavi rota duraklari tek bir karar ekraninda toplandi.</p></div><div class="han-destination-grid">' +
      destinationCards(state.guide.destinations.slice(0, 3)) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">1 Haftalik Rota</p><h2 class="section-title">Konaklama kararini guclendiren tam hafta kurgusu</h2><p class="section-text">Erdege ilk kez gelen bir misafirin bir haftayi nasil gecirebilecegine dair ozenle kurgulanmis plan.</p></div><div class="features-grid han-itinerary-grid">' +
      itineraryCards(state.guide.itinerary, 3) +
      '</div><div class="hero-actions han-section-actions"><a class="button button-primary" href="' + Shell.pageHref('guide') + '">7 Gunluk Programi Ac</a><a class="button button-secondary" href="' + Shell.pageHref('booking') + '">Dogrudan Talep Gonder</a></div></div></section>');
  }

  function renderHotels(state) {
    var hotels = Data.listHotels(state);
    return publicShell(state, 'hotels',
      hero(state, {
        chip: 'Han Otelcilik / Oteller',
        kicker: 'Konaklama Portfoyu',
        title: 'Erdek portfoyumuzdaki uc farkli konaklama hikayesi',
        text: 'Mavi Inci Park Otel, Gulplaj Hotel ve Villa Ece Pansiyon; farkli misafir tiplerine seslenen uc ayri konaklama tonu olarak kurgulandi. Biri merkez ritmini, biri klasik yaz oteli hafizasini, digeri ise daha sakin aile pansiyonu duygusunu tasir.',
        primaryLabel: 'Merkezi Talep Formu',
        primaryHref: Shell.pageHref('booking'),
        secondaryLabel: 'Erdek Rehberi',
        secondaryHref: Shell.pageHref('guide'),
        statsHtml: statCards(hotels.map(function (item) { return { label: item.shortName, value: item.heroTag }; }))
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Otellerimiz</p><h2 class="section-title">Dogal segment ayrimi ile kurgulanmis otel portfoyu</h2><p class="section-text">Her otel icin resmi veya guvenilir kaynaklardan toplanan bilgiler temel alindi. Panel yapisi sayesinde bu bilgi seti, kendi operasyon akisiniza gore kolayca guncellenebilir.</p></div><div class="stay-preview-grid han-business-grid">' +
      hotels.map(function (business) { return Shell.renderBusinessCard(business, { actionLabel: 'Otel Detayi', secondaryLabel: 'Bu Otel Icin Talep' }); }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Hikaye Katmani</p><h2 class="section-title">Her otel kendi misafir tipine gore konumlanir</h2></div><div class="han-editorial-grid">' +
      hotels.map(function (business) {
        return '<article class="story-card han-editorial-card"><p class="section-kicker">' + safe(business.name) + '</p><h3>' + safe(business.storyTitle) + '</h3><p class="story-copy">' + safe(business.story) + '</p>' + momentList(business.signatureMoments) + '</article>';
      }).join('') +
      '</div></div></section>');
  }

  function renderVenues(state) {
    var venues = Data.listVenues(state);
    return publicShell(state, 'venues',
      hero(state, {
        chip: 'Han Otelcilik / Yeme Icme',
        kicker: 'Fast Food ve Pub Operasyonlari',
        title: 'Konaklama deneyimini gun boyu tamamlayan yeme icme markalari',
        text: 'Smile Foodhouse gun icindeki hizli ihtiyaca, pub ise aksam ritmine cevap verir. Ikisi birlikte konaklama disi geliri guclendirirken misafirin de gruptan kopmadan zaman gecirmesini saglar.',
        primaryLabel: 'Isletme Talebi Ac',
        primaryHref: Shell.pageHref('booking'),
        secondaryLabel: 'Erdek Rehberi',
        secondaryHref: Shell.pageHref('guide'),
        statsHtml: statCards(venues.map(function (item) { return { label: item.shortName, value: item.heroTag }; }))
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Yeme Icme Portfoyu</p><h2 class="section-title">Otel trafigini grubun icinde tutan ticari hatlar</h2><p class="section-text">Smile Foodhouse hizli servis ve paket satis odagi ile; pub ise aksam ekonomisi ve etkinlik kurgusu ile ele alindi. Ikisi de otel markalariyla birlikte capraz satis uretecek sekilde planlandi.</p></div><div class="stay-preview-grid han-business-grid">' +
      venues.map(function (business) { return Shell.renderBusinessCard(business, { actionLabel: 'Birimi Incele', secondaryLabel: 'Bu Birime Talep' }); }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Marka Rolleri</p><h2 class="section-title">Her birim gunun farkli bir anina cevap verir</h2></div><div class="han-editorial-grid">' +
      venues.map(function (business) {
        return '<article class="story-card han-editorial-card"><p class="section-kicker">' + safe(business.name) + '</p><h3>' + safe(business.storyTitle) + '</h3><p class="story-copy">' + safe(business.story) + '</p><p class="han-editorial-note">' + safe(business.editorial) + '</p>' + momentList(business.signatureMoments) + '</article>';
      }).join('') +
      '</div></div></section>');
  }

  function renderGuide(state) {
    var hotels = Data.listHotels(state);
    var sourceMap = {};
    var sources = [];

    (state.guide.destinations || []).forEach(function (item) {
      if (!item || !item.sourceUrl || sourceMap[item.sourceUrl]) return;
      sourceMap[item.sourceUrl] = true;
      sources.push({ label: item.sourceLabel, url: item.sourceUrl });
    });

    return publicShell(state, 'guide',
      hero(state, {
        chip: 'Han Otelcilik / Erdek Rehberi',
        kicker: 'Destinasyon Rehberi',
        title: state.guide.title,
        text: state.guide.introText,
        primaryLabel: 'Talep Formu',
        primaryHref: Shell.pageHref('booking'),
        secondaryLabel: 'Otelleri Incele',
        secondaryHref: Shell.pageHref('hotels'),
        statsHtml: statCards([
          { label: 'Secili Durak', value: String((state.guide.destinations || []).length) },
          { label: 'Planlanan Gun', value: String((state.guide.itinerary || []).length) },
          { label: 'Otel Onerisi', value: String(hotels.length) }
        ]),
        sideTitle: 'Neden bu rehber?',
        sideText: 'Konaklama karari, iyi bir destinasyon kurgusu ile birlikte anlam kazanir. Bu sayfa, misafirin Erdek tatilini bastan sona planlayabilmesi icin olusturuldu.'
      }) +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Editoryal Giris</p><h2>' + safe(state.guide.introTitle) + '</h2><p class="story-copy">' + safe(state.guide.introText) + '</p><p class="han-editorial-note">Tarihi alanlar, sahil hafizasi ve tekne rotalari ayni rehberde birlestirilerek misafirin yalnizca oda degil, tam bir Erdek deneyimi satin almasi hedeflendi.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Merkezi Talep Formu</a><a class="button button-secondary" href="' + Shell.pageHref('hotels') + '">Konaklama Portfoyu</a></div></article><div class="value-stack"><article class="value-prop"><h3>Bu sayfada ne var?</h3>' + momentList(['Tarihi ve fotografik duraklar', 'Hafta bazli gezi planlamasi', 'Otele gore rota onerisi', 'Kaynakli destinasyon notlari']) + '</article><article class="value-prop"><h3>Kimler icin ideal?</h3><p>Erdege ilk kez gelenler, sahil ile tarihi ayni tatilde birlestirmek isteyenler ve ailece planlama yapmak isteyen misafirler icin hazirlandi.</p></article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Mutlaka Gorulmeli</p><h2 class="section-title">Erdegin tarihi, sahili ve ada ritmini bir araya getiren secili duraklar</h2><p class="section-text">Her kartta, lokasyonun hikayesi, en iyi ziyaret zamani ve resmi ya da yerel kaynaga giden referans baglantisi yer alir.</p></div><div class="han-destination-grid">' +
      destinationCards(state.guide.destinations) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">7 Gunluk Gezi Plani</p><h2 class="section-title">Erdekte bir haftayi dogru tempo ile planlayan premium rota</h2><p class="section-text">Konaklama, tarih, deniz ve aksami dengeleyen; hem ilk kez gelenler hem de tekrar gelenler icin uygulanabilir bir program.</p></div><div class="features-grid han-itinerary-grid">' +
      itineraryCards(state.guide.itinerary) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Nerede Konaklamali?</p><h2 class="section-title">Bu rehberin ritmine uyumlu uc farkli konaklama tonu</h2><p class="section-text">Rehberdeki rotalara gore merkez temposu, klasik yaz oteli hafizasi veya daha sakin aile pansiyonu karakteri arasindan tercih yapabilirsiniz.</p></div><div class="stay-preview-grid han-business-grid">' +
      hotels.map(function (business) { return Shell.renderBusinessCard(business, { actionLabel: 'Bu Oteli Incele', secondaryLabel: 'Bu Otel Icin Talep' }); }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container contact-grid"><article class="contact-card"><p class="section-kicker">Kaynaklar</p><h3>Rehber hangi bilgilerle hazirlandi?</h3><div class="footer-links han-source-list">' +
      sources.map(function (source) { return '<a href="' + safe(source.url) + '">' + safe(source.label) + '</a>'; }).join('') +
      '</div></article><article class="contact-card"><p class="section-kicker">Planlama Destegi</p><h3>Rotayi birlikte netlestirelim</h3><p>Hangi otelin hangi rota ile daha uyumlu oldugunu netlestirmek, tarih secmek ve aile yapiniza uygun plan olusturmak icin merkezi talep formunu kullanabilirsiniz.</p><div class="footer-links"><a href="' + Shell.pageHref('booking') + '">Talep Formunu Ac</a><a href="https://wa.me/905376963030">WhatsApp ile Yaz</a></div></article></div></section>');
  }

  function renderBusiness(state, business) {
    if (!business) {
      return publicShell(state, 'home',
        '<section class="section section-light"><div class="container"><div class="booking-shell"><div class="booking-shell-header"><h3>Isletme bulunamadi</h3><p>Baglanti gecersiz gorunuyor. Lutfen ana portfoy sayfalarindan ilgili isletmeyi tekrar secin.</p></div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('home') + '">Ana Sayfa</a><a class="button button-secondary" href="' + Shell.pageHref('hotels') + '">Oteller</a></div></div></div></section>');
    }

    var nearby = relatedDestinations(state, business);
    return publicShell(state, business.type === 'hotel' ? 'hotels' : 'venues',
      hero(state, {
        chip: business.name,
        kicker: business.type === 'hotel' ? 'Otel Detayi' : business.type === 'fastfood' ? 'Fast Food Birimi' : 'Pub Birimi',
        title: business.name,
        text: business.description,
        primaryLabel: 'Bu Isletme Icin Talep',
        primaryHref: Shell.pageHref('booking') + '?business=' + encodeURIComponent(business.id),
        secondaryLabel: 'Paneli Ac',
        secondaryHref: './panel-' + panelSlug(business.id) + '.html',
        statsHtml: statCards(business.stats),
        sideText: business.summary
      }) +
      '<section class="section section-light"><div class="container han-business-spotlight"><div class="han-business-photo"><img src="' + safe(business.photo ? business.photo : state.guide.destinations[0].image) + '" alt="' + safe(business.photoAlt || business.name) + '" loading="eager" /></div><div class="han-business-spotlight-copy"><p class="section-kicker">Genel Bakis</p><h2>' + safe(business.tagline) + '</h2><p class="story-copy">' + safe(business.summary) + '</p>' + momentList(business.highlights) + '<div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(business.id) + '">Bu Isletme Icin Talep</a><a class="button button-secondary" href="' + Shell.pageHref('guide') + '">Erdek Rehberi</a></div></div></div></section>' +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Marka Hikayesi</p><h2>' + safe(business.storyTitle) + '</h2><p class="story-copy">' + safe(business.story) + '</p><p class="han-editorial-note">' + safe(business.editorial) + '</p></article><div class="value-stack"><article class="value-prop"><h3>Iletisim</h3><p>' + safe(business.address) + '</p><p><a class="contact-link" href="tel:' + safe((business.phone || '').replace(/\s+/g, '')) + '">' + safe(business.phone) + '</a></p><p><a class="contact-link" href="mailto:' + safe(business.email) + '">' + safe(business.email) + '</a></p>' + (business.website ? '<p><a class="contact-link" href="' + safe(business.website) + '">Resmi web sitesi</a></p>' : '') + '</article><article class="value-prop"><h3>Imza Anlari</h3>' + momentList(business.signatureMoments) + '</article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">' + safe(business.type === 'hotel' ? 'Oda Kurgusu' : 'Menu ve Servis') + '</p><h2 class="section-title">' + safe(business.name) + ' ana kalemleri</h2><p class="section-text">Bu liste ilgili isletmenin kendi panelinden duzenlenebilir.</p></div><div class="stay-preview-grid han-business-grid">' + collectionCards(business) + '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Yakindaki Deneyimler</p><h2 class="section-title">' + safe(business.name) + ' konaklamasini buyuten Erdek duraklari</h2><p class="section-text">Bu isletmeden hareketle planlanabilecek en guclu rota duraklari, Erdek rehberinden secildi.</p></div><div class="han-destination-grid">' + destinationCards(nearby) + '</div></div></section>' +
      '<section class="section section-dark"><div class="container contact-grid"><article class="contact-card"><p class="section-kicker">Bilgi Kaynaklari</p><div class="footer-links">' + (business.sources.length ? business.sources.map(function (source) { return '<a href="' + safe(source.url) + '">' + safe(source.label) + '</a>'; }).join('') : '<a href="#">Bu birim icin kaynak bilgisi panelden genisletilebilir</a>') + '</div></article><article class="contact-card"><p class="section-kicker">Panel Erisimi</p><h3>Ayrik admin paneli hazir</h3><p>Bu isletme icin ayri bir panel olusturuldu; tanitim metinleri, oda veya menu kalemleri ve metrikler bu panelden bagimsiz yonetilebilir.</p><div class="footer-links"><a href="./panel-' + safe(panelSlug(business.id)) + '.html">Panele Git</a><a href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(business.id) + '">Talep Olustur</a></div></article></div></section>');
  }

  function renderBooking(state) {
    return publicShell(state, 'booking',
      hero(state, {
        chip: 'Han Otelcilik / Talep',
        kicker: 'Merkezi Talep Formu',
        title: 'Secilen isletmeye yonlenen profesyonel grup talep akisi',
        text: 'Bu form; otel secimi, konaklama tarihleri, misafir bilgileri ve ozel notlari tek merkezde toplar. Operasyon ekibi uygun isletmeye yonlenerek kisa surede geri donus yapar.',
        primaryLabel: 'WhatsApp ile Yaz',
        primaryHref: 'https://wa.me/905376963030',
        secondaryLabel: 'Erdek Rehberi',
        secondaryHref: Shell.pageHref('guide'),
        statsHtml: statCards([
          { label: 'Otel', value: String(Data.listHotels(state).length) },
          { label: 'Yeme Icme Birimi', value: String(Data.listVenues(state).length) },
          { label: 'Merkezi Hat', value: state.group.phone }
        ]),
        sideTitle: 'Rezervasyon Yaklasimimiz',
        sideText: state.group.directBookingPromise
      }) +
      '<section class="section section-light"><div class="container story-grid"><article class="booking-shell"><div class="booking-shell-header"><h3>Merkezi talep formu</h3><p>Konaklama, masa veya genel bilgi talepleri tek formdan alinip secilen isletmeye gore siniflandirilir. Tarih secimleri, misafir bilgileri ve operasyon notlari ayni ekrana toplandi.</p></div><form id="groupInquiryForm" class="form-grid two"><label class="field"><span>Isletme</span><select id="inquiryBusiness">' + state.businesses.map(function (item) { return '<option value="' + safe(item.id) + '">' + safe(item.name) + '</option>'; }).join('') + '</select></label><label class="field"><span>Talep Tipi</span><select id="inquiryType"><option value="konaklama">Konaklama</option><option value="masa">Masa / servis</option><option value="bilgi">Genel bilgi</option></select></label><label class="field"><span>Giris Tarihi</span><input id="inquiryCheckIn" type="date" /></label><label class="field"><span>Cikis Tarihi</span><input id="inquiryCheckOut" type="date" /></label><label class="field"><span>Yetiskin</span><input id="inquiryAdults" type="number" min="1" value="2" /></label><label class="field"><span>Cocuk</span><input id="inquiryChildren" type="number" min="0" value="0" /></label><label class="field"><span>Ad Soyad</span><input id="inquiryName" type="text" required /></label><label class="field"><span>Telefon</span><input id="inquiryPhone" type="text" required /></label><label class="field"><span>E-Posta</span><input id="inquiryEmail" type="email" /></label><label class="field"><span>Donus Tercihi</span><select id="inquiryChannel"><option value="telefon">Telefon</option><option value="whatsapp">WhatsApp</option><option value="eposta">E-Posta</option></select></label><label class="field field-span-2"><span>Not</span><textarea id="inquiryNote" rows="5" placeholder="Oda tercihi, varis saati, cocuk yaslari veya ozel notlarinizi yazabilirsiniz."></textarea></label><div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Talebi Kaydet</button><span class="price-note" id="inquiryStatus"></span></div></form></article><div class="value-stack"><article class="value-prop"><h3>Biz nasil ilerliyoruz?</h3>' + momentList(['Talep ilgili isletmeye gore etiketlenir', 'Tarih ve kapasite uygunlugu hizla kontrol edilir', 'Sectiginiz iletisim kanalindan geri donus planlanir']) + '</article><article class="value-prop"><h3>WhatsApp ve telefon destegi</h3><p>Hizli iletisim icin dogrudan WhatsApp hattimizi veya telefon numaramizi da kullanabilirsiniz.</p><div class="footer-links"><a href="https://wa.me/905376963030">WhatsApp ile yaz</a><a href="tel:905376963030">+90 537 696 30 30</a></div></article><article class="value-prop"><h3>Gezi planina ihtiyaciniz varsa</h3><p>Erdekte gecireceginiz haftayi planlamak icin destinasyon rehberimizi inceleyebilir, rotaya uygun otel secimini daha kolay yapabilirsiniz.</p><div class="footer-links"><a href="' + Shell.pageHref('guide') + '">Erdek Rehberini Ac</a></div></article></div></div></section>');
  }

  function renderAdminHub(state) {
    if (!Data.hasAdminSession()) {
      return loginView('Han Otelcilik Admin Hub', 'Tum panel gecisleri tek login ile acilir. Bu yapi statik demo mantiginda calisir ve veriler tarayicida saklanir.');
    }

    var flash = consumeFlash();
    return publicShell(state, null,
      hero(state, {
        chip: 'Han Otelcilik / Admin',
        kicker: 'Merkezi Yonetim',
        title: 'Grup operasyon merkezi ve panel gecis hubi',
        text: 'Bu merkezden grup bilgileri guncellenir, gelen tum talepler goruntulenir ve her isletmenin ayri paneline gecilir.',
        primaryLabel: 'Ana Sayfaya Don',
        primaryHref: Shell.pageHref('home'),
        secondaryLabel: 'Erdek Rehberi',
        secondaryHref: Shell.pageHref('guide'),
        statsHtml: statCards([
          { label: 'Toplam Talep', value: String((state.inquiries || []).length) },
          { label: 'Otel Paneli', value: String(Data.listHotels(state).length) },
          { label: 'Yeme Icme Paneli', value: String(Data.listVenues(state).length) }
        ]),
        sideTitle: 'Panel Gecisleri',
        sideText: 'Her isletme kendi sayfasinda ayrik sekilde yonetilir. Grup hub, ortak bilgiler ve gelen talepler icin merkez gorevi gorur.'
      }) +
      '<section class="section section-light"><div class="container">' + flashBanner(flash) + '<div class="han-admin-grid"><article class="booking-shell han-settings-card"><div class="booking-shell-header"><h3>Grup Bilgileri</h3><p>Ust marka, iletisim, manifesto ve dogrudan rezervasyon mesajlari burada yonetilir.</p></div><form id="groupSettingsForm" class="form-grid two"><label class="field"><span>Grup Adi</span><input name="name" type="text" value="' + safe(state.group.name) + '" required /></label><label class="field"><span>Telefon</span><input name="phone" type="text" value="' + safe(state.group.phone) + '" required /></label><label class="field"><span>WhatsApp</span><input name="whatsapp" type="text" value="' + safe(state.group.whatsapp) + '" required /></label><label class="field"><span>E-Posta</span><input name="email" type="email" value="' + safe(state.group.email) + '" /></label><label class="field"><span>Sehir</span><input name="city" type="text" value="' + safe(state.group.city) + '" /></label><label class="field field-span-2"><span>Adres</span><input name="address" type="text" value="' + safe(state.group.address) + '" /></label><label class="field field-span-2"><span>Slogan</span><input name="tagline" type="text" value="' + safe(state.group.tagline) + '" /></label><label class="field field-span-2"><span>Aciklama</span><textarea name="description" rows="4">' + safe(state.group.description) + '</textarea></label><label class="field field-span-2"><span>Manifesto</span><textarea name="manifesto" rows="4">' + safe(state.group.manifesto || '') + '</textarea></label><label class="field field-span-2"><span>Dogrudan Rezervasyon Mesaji</span><textarea name="directBookingPromise" rows="3">' + safe(state.group.directBookingPromise || '') + '</textarea></label><label class="field field-span-2"><span>Rezervasyon Notu</span><textarea name="reservationNote" rows="3">' + safe(state.group.reservationNote) + '</textarea></label><label class="field field-span-2"><span>One Cikanlar</span><textarea name="highlights" rows="5">' + safe(joinLines(state.group.highlights)) + '</textarea></label><div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Grup Bilgilerini Kaydet</button><button class="button button-secondary" type="button" data-admin-logout>Oturumu Kapat</button><span class="price-note" id="groupSettingsStatus"></span></div></form></article><article class="contact-card han-panel-links"><p class="section-kicker">Panel Gecisleri</p><h3>Her isletme icin ayri yonetim sayfasi</h3><p>Oteller, Smile Foodhouse ve pub icin ayrik paneller burada listelenir.</p><div class="han-mini-links">' + businessLinks(state) + '</div></article></div></div></section>' +
      inquiryList(state.inquiries, 'Tum merkezi talepler', 'Henuz merkezi talep kaydi bulunmuyor.'));
  }

  function renderPanel(state, business) {
    if (!Data.hasAdminSession()) {
      return loginView('Isletme Paneli', 'Bu paneli acmak icin admin oturumunun aktif olmasi gerekir.');
    }

    if (!business) {
      return publicShell(state, null,
        '<section class="section section-light"><div class="container"><div class="booking-shell"><div class="booking-shell-header"><h3>Panel bulunamadi</h3><p>Baglantiya ait isletme kaydi bulunamadi.</p></div><div class="hero-actions"><a class="button button-primary" href="./admin.html">Admin Hub</a></div></div></div></section>');
    }

    var flash = consumeFlash();
    var relatedInquiries = (state.inquiries || []).filter(function (item) { return item.businessId === business.id; });
    var collectionKey = business.type === 'hotel' ? 'hotelCollection' : 'venueCollection';
    var collectionItems = business.type === 'hotel' ? business.rooms : business.offerings;

    return publicShell(state, null,
      hero(state, {
        chip: business.name + ' / Panel',
        kicker: business.type === 'hotel' ? 'Otel Paneli' : business.type === 'fastfood' ? 'Fast Food Paneli' : 'Pub Paneli',
        title: business.name + ' yonetim paneli',
        text: 'Bu panel; markanin vitrin metinlerini, iletisim alanlarini, metriklerini ve oda veya menu kalemlerini bagimsiz sekilde guncellemek icin tasarlandi.',
        primaryLabel: 'Detay Sayfasini Ac',
        primaryHref: Shell.businessHref(business),
        secondaryLabel: 'Admin Hub',
        secondaryHref: './admin.html',
        statsHtml: statCards(business.stats),
        sideKicker: 'Panel Notu',
        sideTitle: 'Ayrik marka yonetimi',
        sideText: 'Bu panelde yaptiginiz degisiklikler sadece ilgili isletmenin vitrin sayfasini ve talep akislarini etkiler.'
      }) +
      '<section class="section section-light"><div class="container">' + flashBanner(flash) + '<div class="han-admin-grid"><article class="booking-shell han-settings-card"><div class="booking-shell-header"><h3>' + safe(business.name) + ' ayarlari</h3><p>Tanitim dili, hikaye katmani, gorseller, kaynaklar ve urun kalemleri bu panelden yonetilir.</p></div><form id="businessPanelForm" class="form-grid two"><label class="field"><span>Isletme Adi</span><input name="name" type="text" value="' + safe(business.name) + '" required /></label><label class="field"><span>Kisa Ad</span><input name="shortName" type="text" value="' + safe(business.shortName) + '" /></label><label class="field field-span-2"><span>Hero Etiketi</span><input name="heroTag" type="text" value="' + safe(business.heroTag) + '" /></label><label class="field field-span-2"><span>Tagline</span><input name="tagline" type="text" value="' + safe(business.tagline) + '" /></label><label class="field"><span>Lokasyon</span><input name="location" type="text" value="' + safe(business.location) + '" /></label><label class="field"><span>Vurgu Rengi</span><input name="accent" type="text" value="' + safe(business.accent) + '" /></label><label class="field field-span-2"><span>Adres</span><input name="address" type="text" value="' + safe(business.address) + '" /></label><label class="field"><span>Telefon</span><input name="phone" type="text" value="' + safe(business.phone) + '" /></label><label class="field"><span>E-Posta</span><input name="email" type="email" value="' + safe(business.email) + '" /></label><label class="field field-span-2"><span>Web Sitesi</span><input name="website" type="text" value="' + safe(business.website) + '" /></label><label class="field field-span-2"><span>Kapak Gradient</span><input name="cover" type="text" value="' + safe(business.cover) + '" /></label><label class="field field-span-2"><span>Foto URL</span><input name="photo" type="text" value="' + safe(business.photo || '') + '" /></label><label class="field field-span-2"><span>Foto Alt Metni</span><input name="photoAlt" type="text" value="' + safe(business.photoAlt || '') + '" /></label><label class="field field-span-2"><span>Kisa Ozet</span><textarea name="summary" rows="4">' + safe(business.summary) + '</textarea></label><label class="field field-span-2"><span>Uzun Aciklama</span><textarea name="description" rows="5">' + safe(business.description) + '</textarea></label><label class="field field-span-2"><span>Hikaye Basligi</span><input name="storyTitle" type="text" value="' + safe(business.storyTitle || '') + '" /></label><label class="field field-span-2"><span>Hikaye Metni</span><textarea name="story" rows="5">' + safe(business.story || '') + '</textarea></label><label class="field field-span-2"><span>Editoryal Not</span><textarea name="editorial" rows="4">' + safe(business.editorial || '') + '</textarea></label><label class="field field-span-2"><span>Imza Anlari</span><textarea name="signatureMoments" rows="5">' + safe(joinLines(business.signatureMoments || [])) + '</textarea></label><label class="field field-span-2"><span>Yakin Rota ID' + "'" + 'leri</span><textarea name="nearby" rows="4" placeholder="zeytinliada, kyzikos, cugra-kurbagali">' + safe(joinLines(business.nearby || [])) + '</textarea></label><label class="field field-span-2"><span>One Cikanlar</span><textarea name="highlights" rows="5">' + safe(joinLines(business.highlights)) + '</textarea></label><label class="field field-span-2"><span>Operasyon Notlari</span><textarea name="features" rows="5">' + safe(joinLines(business.features)) + '</textarea></label>' +
      rowEditor('stats', 'stats', business.stats) +
      rowEditor('collection', collectionKey, collectionItems) +
      rowEditor('sources', 'sources', business.sources) +
      '<div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Paneli Kaydet</button><a class="button button-secondary" href="./admin.html">Huba Don</a><button class="button button-ghost" type="button" data-admin-logout>Oturumu Kapat</button><span class="price-note" id="panelStatus"></span></div></form></article><article class="contact-card han-panel-links"><p class="section-kicker">Hizli Gecis</p><h3>Diger paneller</h3><div class="han-mini-links">' + businessLinks(state) + '</div><div class="footer-links"><a href="' + Shell.businessHref(business) + '">Detay sayfasini ac</a><a href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(business.id) + '">Bu isletme icin talep olustur</a></div></article></div></div></section>' +
      inquiryList(relatedInquiries, business.name + ' icin gelen talepler', 'Bu isletme icin henuz talep kaydi bulunmuyor.'));
  }

  function createRowNode(schemaKey) {
    var schema = ROW_SCHEMAS[schemaKey];
    var wrapper = document.createElement('div');
    wrapper.innerHTML = rowItemMarkup(schema, {});
    return wrapper.firstChild;
  }

  function bindEditorControls() {
    var addButtons = document.querySelectorAll('[data-add-row]');
    addButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var group = button.getAttribute('data-add-row');
        var schemaKey = button.getAttribute('data-schema');
        var container = document.querySelector('[data-row-group="' + group + '"]');
        if (!container) return;
        container.appendChild(createRowNode(schemaKey));
        bindRemoveControls();
      });
    });
    bindRemoveControls();
  }

  function bindRemoveControls() {
    var removeButtons = document.querySelectorAll('[data-remove-row]');
    removeButtons.forEach(function (button) {
      button.onclick = function () {
        var row = button.closest('[data-row-item]');
        var container = button.closest('[data-row-group]');
        if (!row || !container) return;
        if (container.querySelectorAll('[data-row-item]').length === 1) {
          row.querySelectorAll('input').forEach(function (input) { input.value = ''; });
          return;
        }
        row.remove();
      };
    });
  }

  function collectRows(groupName) {
    var container = document.querySelector('[data-row-group="' + groupName + '"]');
    if (!container) return [];
    return Array.from(container.querySelectorAll('[data-row-item]')).map(function (row) {
      var item = {};
      row.querySelectorAll('[data-row-key]').forEach(function (input) {
        item[input.getAttribute('data-row-key')] = input.value.trim();
      });
      return item;
    }).filter(function (item) {
      return Object.keys(item).some(function (key) { return Boolean(item[key]); });
    });
  }

  function bindLogin() {
    var form = document.getElementById('adminLoginForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var user = document.getElementById('adminUser');
      var password = document.getElementById('adminPassword');
      var status = document.getElementById('adminLoginStatus');
      if (!user || !password || !status) return;
      if (user.value.trim() === ADMIN_USER && password.value === ADMIN_PASSWORD) {
        Data.setAdminSession(true);
        setFlash('Admin oturumu acildi.');
        mount();
        return;
      }
      status.textContent = 'Kullanici adi veya sifre hatali.';
    });
  }

  function bindLogout() {
    var buttons = document.querySelectorAll('[data-admin-logout]');
    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        Data.setAdminSession(false);
        setFlash('Admin oturumu kapatildi.');
        window.location.href = './admin.html';
      });
    });
  }

  function bindGroupSettings() {
    var form = document.getElementById('groupSettingsForm');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      Data.updateGroup({
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        whatsapp: form.elements.whatsapp.value.trim(),
        email: form.elements.email.value.trim(),
        address: form.elements.address.value.trim(),
        city: form.elements.city.value.trim(),
        tagline: form.elements.tagline.value.trim(),
        description: form.elements.description.value.trim(),
        manifesto: form.elements.manifesto.value.trim(),
        directBookingPromise: form.elements.directBookingPromise.value.trim(),
        reservationNote: form.elements.reservationNote.value.trim(),
        highlights: splitLines(form.elements.highlights.value)
      });
      setFlash('Grup bilgileri kaydedildi.');
      mount();
    });
  }

  function bindPanel(state, business) {
    var form = document.getElementById('businessPanelForm');
    if (!form || !business) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var patch = {
        name: form.elements.name.value.trim(),
        shortName: form.elements.shortName.value.trim(),
        heroTag: form.elements.heroTag.value.trim(),
        tagline: form.elements.tagline.value.trim(),
        location: form.elements.location.value.trim(),
        accent: form.elements.accent.value.trim(),
        address: form.elements.address.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        website: form.elements.website.value.trim(),
        cover: form.elements.cover.value.trim(),
        photo: form.elements.photo.value.trim(),
        photoAlt: form.elements.photoAlt.value.trim(),
        summary: form.elements.summary.value.trim(),
        description: form.elements.description.value.trim(),
        storyTitle: form.elements.storyTitle.value.trim(),
        story: form.elements.story.value.trim(),
        editorial: form.elements.editorial.value.trim(),
        signatureMoments: splitLines(form.elements.signatureMoments.value),
        nearby: splitLines(form.elements.nearby.value),
        highlights: splitLines(form.elements.highlights.value),
        features: splitLines(form.elements.features.value),
        stats: collectRows('stats'),
        sources: collectRows('sources')
      };

      if (business.type === 'hotel') {
        patch.rooms = collectRows('collection');
      } else {
        patch.offerings = collectRows('collection');
      }

      Data.updateBusiness(business.id, patch);
      setFlash(business.name + ' paneli kaydedildi.');
      mount();
    });
  }

  function bindBooking(state) {
    var form = document.getElementById('groupInquiryForm');
    if (!form) return;

    var businessField = document.getElementById('inquiryBusiness');
    var typeField = document.getElementById('inquiryType');
    var checkInField = document.getElementById('inquiryCheckIn');
    var checkOutField = document.getElementById('inquiryCheckOut');
    var status = document.getElementById('inquiryStatus');
    var preferredBusiness = businessId();

    if (checkInField) checkInField.min = today();
    if (checkOutField) checkOutField.min = today();

    if (businessField && Data.getBusinessById(state, preferredBusiness)) {
      businessField.value = preferredBusiness;
    }

    function syncInquiryMode() {
      var selected = Data.getBusinessById(state, businessField.value);
      var isHotel = selected && selected.type === 'hotel';
      var needsDates = isHotel || typeField.value === 'konaklama';
      if (isHotel) {
        typeField.value = 'konaklama';
      } else if (typeField.value === 'konaklama') {
        typeField.value = 'masa';
      }
      checkInField.disabled = !needsDates;
      checkOutField.disabled = !needsDates;
      checkInField.required = needsDates;
      checkOutField.required = needsDates;
    }

    businessField.addEventListener('change', syncInquiryMode);
    typeField.addEventListener('change', syncInquiryMode);

    checkInField.addEventListener('change', function () {
      if (checkInField.value) {
        checkOutField.min = checkInField.value;
      } else {
        checkOutField.min = today();
      }
    });

    syncInquiryMode();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var selected = Data.getBusinessById(state, businessField.value);
      var needsDates = !checkInField.disabled;
      status.textContent = '';

      if (!selected) {
        status.textContent = 'Lutfen bir isletme secin.';
        return;
      }

      if (needsDates) {
        if (!checkInField.value || !checkOutField.value) {
          status.textContent = 'Konaklama taleplerinde tarih alanlari zorunludur.';
          return;
        }
        if (checkInField.value < today()) {
          status.textContent = 'Giris tarihi bugunden once olamaz.';
          return;
        }
        if (checkOutField.value <= checkInField.value) {
          status.textContent = 'Cikis tarihi giris tarihinden sonra olmalidir.';
          return;
        }
      }

      var payload = {
        businessId: selected.id,
        businessName: selected.name,
        type: typeField.value,
        checkIn: checkInField.disabled ? '' : checkInField.value,
        checkOut: checkOutField.disabled ? '' : checkOutField.value,
        adults: document.getElementById('inquiryAdults').value,
        children: document.getElementById('inquiryChildren').value,
        name: document.getElementById('inquiryName').value.trim(),
        phone: document.getElementById('inquiryPhone').value.trim(),
        email: document.getElementById('inquiryEmail').value.trim(),
        preferredChannel: document.getElementById('inquiryChannel').value,
        note: document.getElementById('inquiryNote').value.trim()
      };

      if (!payload.name || !payload.phone) {
        status.textContent = 'Ad soyad ve telefon bilgileri zorunludur.';
        return;
      }

      Data.addInquiry(payload);
      console.log('Han Otelcilik talep JSON:', JSON.stringify(payload, null, 2));
      status.textContent = 'Talep kaydedildi ve ilgili panele yonlendirildi.';
      form.reset();
      document.getElementById('inquiryAdults').value = '2';
      document.getElementById('inquiryChildren').value = '0';
      if (Data.getBusinessById(state, preferredBusiness)) {
        businessField.value = preferredBusiness;
      }
      syncInquiryMode();
    });
  }

  function applyMeta(state, currentPage, business) {
    var baseUrl = currentPage === 'home'
      ? Shell.pageHref('home')
      : currentPage === 'hotels'
      ? Shell.pageHref('hotels')
      : currentPage === 'guide'
      ? Shell.pageHref('guide')
      : currentPage === 'venues'
      ? Shell.pageHref('venues')
      : currentPage === 'booking'
      ? Shell.pageHref('booking')
      : currentPage === 'admin'
      ? './admin.html'
      : currentPage === 'panel' && business
      ? './panel-' + panelSlug(business.id) + '.html'
      : business
      ? Shell.businessHref(business)
      : Shell.pageHref('home');

    var title = state.group.name + ' | Erdek konaklama ve yeme icme grubu';
    var description = state.group.description;
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: state.group.name,
      telephone: state.group.phone,
      email: state.group.email,
      address: state.group.address,
      areaServed: state.group.city
    };

    if (currentPage === 'hotels') {
      title = state.group.name + ' | Oteller';
      description = 'Han Otelcilik catisi altindaki Mavi Inci Park Otel, Gulplaj Hotel ve Villa Ece Pansiyon bilgileri.';
    } else if (currentPage === 'guide') {
      title = state.group.name + ' | ' + state.guide.title;
      description = 'Erdek tarihi lokasyonlari, sahil duraklari ve 7 gunluk gezi plani ile hazirlanan kurumsal destinasyon rehberi.';
      schema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: state.guide.title,
        description: state.guide.introText,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: (state.guide.destinations || []).map(function (item, index) {
            return {
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              url: item.sourceUrl
            };
          })
        }
      };
    } else if (currentPage === 'venues') {
      title = state.group.name + ' | Fast Food ve Pub';
      description = 'Han Otelcilik catisindaki fast food restoran ve pub operasyonlari.';
    } else if (currentPage === 'booking') {
      title = state.group.name + ' | Merkezi talep formu';
      description = 'Secilen isletmeye yonlenen merkezi talep ve rezervasyon formu.';
    } else if (currentPage === 'admin') {
      title = state.group.name + ' | Admin Hub';
      description = 'Han Otelcilik merkezi admin hubi ve panel gecis sayfasi.';
    } else if (business) {
      title = business.name + ' | ' + state.group.name;
      description = business.summary;
      schema = {
        '@context': 'https://schema.org',
        '@type': business.type === 'hotel' ? 'Hotel' : 'LocalBusiness',
        name: business.name,
        description: business.description,
        telephone: business.phone,
        email: business.email,
        address: business.address,
        url: baseUrl
      };
    }

    Shell.updateMeta(state, {
      title: title,
      description: description,
      canonical: baseUrl
    });

    if (typeof Shell.setStructuredData === 'function') {
      Shell.setStructuredData(schema);
    }
  }

  function mount() {
    var state = Data.resolveState();
    var currentPage = page();
    var business = Data.getBusinessById(state, businessId());
    root = document.getElementById('root');

    if (!root) {
      Shell.mountFail('Uygulama alani bulunamadi.');
      return;
    }

    var html = '';
    if (currentPage === 'home') {
      html = renderHome(state);
    } else if (currentPage === 'hotels') {
      html = renderHotels(state);
    } else if (currentPage === 'guide') {
      html = renderGuide(state);
    } else if (currentPage === 'venues') {
      html = renderVenues(state);
    } else if (currentPage === 'booking') {
      html = renderBooking(state);
    } else if (currentPage === 'admin') {
      html = renderAdminHub(state);
    } else if (currentPage === 'panel') {
      html = renderPanel(state, business);
    } else if (currentPage === 'business' || currentPage === 'room') {
      html = renderBusiness(state, business);
    } else {
      html = renderHome(state);
    }

    root.innerHTML = html;
    applyMeta(state, currentPage, business);
    Shell.initializeNavigation();
    bindEditorControls();
    bindLogin();
    bindLogout();
    bindGroupSettings();
    bindPanel(state, business);
    bindBooking(state);
    Shell.mountReady();
  }

  document.addEventListener('DOMContentLoaded', mount);
  window.addEventListener('storage', function (event) {
    if (!event.key || event.key === Data.storageKey) {
      mount();
    }
  });
})();
