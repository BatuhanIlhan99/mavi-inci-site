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

  function renderHome(state) {
    return publicShell(state, 'home',
      hero(state, {
        kicker: 'Han Otelcilik',
        title: 'Erdek odakli coklu konaklama ve yeme icme grubu',
        text: 'Han Otelcilik; Mavi Inci Park Otel, Gulplaj Hotel ve Villa Ece Pansiyon bilgilerini tek cati altinda toplarken, Smile Foodhouse restoran markasi ve pub operasyonunu da ayni kurumsal yapinin icine yerlestirir.',
        primaryLabel: 'Otelleri Incele',
        primaryHref: Shell.pageHref('hotels'),
        secondaryLabel: 'Fast Food & Pub',
        secondaryHref: Shell.pageHref('venues'),
        statsHtml: statCards([
          { label: 'Toplam Isletme', value: String(state.businesses.length) },
          { label: 'Konaklama Markasi', value: String(Data.listHotels(state).length) },
          { label: 'Yeme Icme Birimi', value: String(Data.listVenues(state).length) }
        ]),
        sideText: 'Villa Ece resmi sitesinde Mavi Inci Park Otel ve Gul Plaj Hotel diger tesislerimiz olarak gosteriliyor; bu kurgu grup mimarisinin dayanak noktasini olusturuyor.'
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Portfoy Yapisi</p><h2 class="section-title">Her isletme ayri sayfa, ayri panel ve ayri ticari amac ile kurgulandi</h2><p class="section-text">Ana sayfa grup hikayesini anlatir; oteller, yeme-icme birimleri ve merkezi talep akisi ise birbirinden ayrilan profesyonel sayfa yapilarina sahip olur.</p></div><div class="stay-preview-grid han-business-grid">' +
      state.businesses.map(function (business) { return Shell.renderBusinessCard(business); }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Kurumsal Cati</p><h2 class="section-title">Tek merkezden yonetilen, farkli segmente ayrilmis gelir modeli</h2><p class="section-text">Bu yapi; butik otel, aile oteli, pansiyon, hizli servis restoran ve pub operasyonlarini birbirini besleyen bir ticari akisa cevirir.</p></div><div class="features-grid">' +
      infoCards([
        { icon: '01', title: 'Konaklama Segmentasyonu', text: 'Uc ayri konaklama markasi sayesinde farkli misafir profilleri tek cati icinde yakalanir.' },
        { icon: '02', title: 'Capraz Satis Olanagi', text: 'Fast food ve pub birimleri otel misafirini grubun icinde tutarken ek gelir hattini guclendirir.' },
        { icon: '03', title: 'Ayrik Panel Yapisi', text: 'Her marka kendi panelinden tanitim, fiyat, oda veya menu kalemlerini bagimsiz sekilde yonetebilir.' }
      ]) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Merkezi Talep Akisi</p><h2>Rezervasyon ve bilgi talepleri tek merkezde toplanir</h2><p class="story-copy">Talep formu, secilen isletmeye gore kayit olusturur ve ilgili panelde gorunur. Bu yapi; telefondan, WhatsApp hattindan veya webden gelen talepleri tek operasyon diline cevirir.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Talep Formunu Ac</a><a class="button button-secondary" href="./admin.html">Admin Hub</a></div></article><div class="value-stack"><article class="value-prop"><h3>Grup Vizyonu</h3><p>' + safe(state.group.description) + '</p></article><article class="value-prop"><h3>Temel Avantajlar</h3><ul class="detail-list detail-list-dark">' + state.group.highlights.map(function (item) { return '<li>' + safe(item) + '</li>'; }).join('') + '</ul></article></div></div></section>');
  }

  function renderHotels(state) {
    var hotels = Data.listHotels(state);
    return publicShell(state, 'hotels',
      hero(state, {
        chip: 'Han Otelcilik / Oteller',
        kicker: 'Konaklama Portfoyu',
        title: 'Erdek portfoyumuzdaki uc farkli konaklama markasi',
        text: 'Mavi Inci Park Otel, Gulplaj Hotel ve Villa Ece Pansiyon; ayni grupta ama farkli segmentlerde konumlanan uc ayri konaklama markasi olarak tasarlandi.',
        primaryLabel: 'Merkezi Talep Formu',
        primaryHref: Shell.pageHref('booking'),
        secondaryLabel: 'Grup Anasayfasi',
        secondaryHref: Shell.pageHref('home'),
        statsHtml: statCards(hotels.map(function (item) { return { label: item.shortName, value: item.heroTag }; }))
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Otellerimiz</p><h2 class="section-title">Dogal segment ayrimi ile kurgulanmis otel portfoyu</h2><p class="section-text">Her otel icin resmi veya guvenilir kaynaklardan toplanan bilgiler temel alindi. Panel yapisi sayesinde bu bilgi seti, kendi operasyon akisiniza gore kolayca guncellenebilir.</p></div><div class="stay-preview-grid han-business-grid">' +
      hotels.map(function (business) { return Shell.renderBusinessCard(business, { actionLabel: 'Otel Detayi', secondaryLabel: 'Bu Otel Icin Talep' }); }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Kullanim Mantigi</p><h2 class="section-title">Her otel kendi misafir tipine gore konumlanir</h2></div><div class="features-grid">' +
      infoCards([
        { icon: 'A', title: 'Mavi Inci Park Otel', text: 'Sehir-oteli karakteri ve butik oda olcegi ile daha merkezi, hizli karar verilen rezervasyonlara uygundur.' },
        { icon: 'B', title: 'Gulplaj Hotel', text: 'Deniz tatili ve aile odakli kullanim icin sahil algisini kuvvetli sekilde tasir.' },
        { icon: 'C', title: 'Villa Ece Pansiyon', text: 'Pansiyon karakteri, esnek yarim pansiyon kurgusu ve aile segmenti ile farklilasir.' }
      ]) +
      '</div></div></section>');
  }

  function renderVenues(state) {
    var venues = Data.listVenues(state);
    return publicShell(state, 'venues',
      hero(state, {
        chip: 'Han Otelcilik / Yeme Icme',
        kicker: 'Fast Food ve Pub Operasyonlari',
        title: 'Konaklama disi gelir yaratan iki ayri marka kurgusu',
        text: 'Smile Foodhouse hizli servis restoran markasi olarak netlestirildi. Pub birimi ise ayrik panel yapisi icinde yonetiliyor ve istenirse daha sonra yeniden adlandirilabiliyor.',
        primaryLabel: 'Isletme Talebi Ac',
        primaryHref: Shell.pageHref('booking'),
        secondaryLabel: 'Admin Hub',
        secondaryHref: './admin.html',
        statsHtml: statCards(venues.map(function (item) { return { label: item.shortName, value: item.heroTag }; }))
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Yeme Icme Portfoyu</p><h2 class="section-title">Otel trafigini grubun icinde tutan ticari hatlar</h2><p class="section-text">Smile Foodhouse hizli servis ve paket satis odagi ile; pub ise aksam ekonomisi ve etkinlik kurgusu ile ele alindi. Ikisi de otel markalariyla birlikte capraz satis uretecek sekilde planlandi.</p></div><div class="stay-preview-grid han-business-grid">' +
      venues.map(function (business) { return Shell.renderBusinessCard(business, { actionLabel: 'Birimi Incele', secondaryLabel: 'Bu Birime Talep' }); }).join('') +
      '</div></div></section>');
  }

  function renderBusiness(state, business) {
    if (!business) {
      return publicShell(state, 'home',
        '<section class="section section-light"><div class="container"><div class="booking-shell"><div class="booking-shell-header"><h3>Isletme bulunamadi</h3><p>Baglanti gecersiz gorunuyor. Lutfen ana portfoy sayfalarindan ilgili isletmeyi tekrar secin.</p></div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('home') + '">Ana Sayfa</a><a class="button button-secondary" href="' + Shell.pageHref('hotels') + '">Oteller</a></div></div></div></section>');
    }

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
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Genel Bakis</p><h2>' + safe(business.tagline) + '</h2><p class="story-copy">' + safe(business.summary) + '</p><ul class="highlight-list">' + business.highlights.map(function (item) { return '<li>' + safe(item) + '</li>'; }).join('') + '</ul></article><div class="value-stack"><article class="value-prop"><h3>Iletisim</h3><p>' + safe(business.address) + '</p><p><a class="contact-link" href="tel:' + safe((business.phone || '').replace(/\s+/g, '')) + '">' + safe(business.phone) + '</a></p><p><a class="contact-link" href="mailto:' + safe(business.email) + '">' + safe(business.email) + '</a></p>' + (business.website ? '<p><a class="contact-link" href="' + safe(business.website) + '">Resmi web sitesi</a></p>' : '') + '</article><article class="value-prop"><h3>Operasyon Notlari</h3><ul class="detail-list detail-list-dark">' + business.features.map(function (item) { return '<li>' + safe(item) + '</li>'; }).join('') + '</ul></article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">' + safe(business.type === 'hotel' ? 'Oda Kurgusu' : 'Menu ve Servis') + '</p><h2 class="section-title">' + safe(business.name) + ' ana kalemleri</h2><p class="section-text">Bu liste ilgili isletmenin kendi panelinden duzenlenebilir.</p></div><div class="stay-preview-grid han-business-grid">' + collectionCards(business) + '</div></div></section>' +
      '<section class="section section-dark"><div class="container contact-grid"><article class="contact-card"><p class="section-kicker">Bilgi Kaynaklari</p><div class="footer-links">' + (business.sources.length ? business.sources.map(function (source) { return '<a href="' + safe(source.url) + '">' + safe(source.label) + '</a>'; }).join('') : '<a href="#">Bu birim icin kaynak bilgisi panelden genisletilebilir</a>') + '</div></article><article class="contact-card"><p class="section-kicker">Panel Erisimi</p><h3>Ayrik admin paneli hazir</h3><p>Bu isletme icin ayri bir panel olusturuldu; tanitim metinleri, oda veya menu kalemleri ve metrikler bu panelden bagimsiz yonetilebilir.</p><div class="footer-links"><a href="./panel-' + safe(panelSlug(business.id)) + '.html">Panele Git</a><a href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(business.id) + '">Talep Olustur</a></div></article></div></section>');
  }

  function renderBooking(state) {
    return publicShell(state, 'booking',
      hero(state, {
        chip: 'Han Otelcilik / Talep',
        kicker: 'Merkezi Talep Formu',
        title: 'Secilen isletmeye yonlenen profesyonel grup talep akisi',
        text: 'Form; secilen otel veya mekan, tarih, misafir bilgileri ve operasyon notlarini tek yerde toplar. Kayit hem tarayici konsoluna JSON olarak yazilir hem ilgili panelde son talepler listesine duser.'
      }) +
      '<section class="section section-light"><div class="container"><div class="booking-shell"><div class="booking-shell-header"><h3>Merkezi talep formu</h3><p>Konaklama, masa veya genel bilgi talepleri tek formdan alinip secilen isletmeye gore siniflandirilir.</p></div><form id="groupInquiryForm" class="form-grid two"><label class="field"><span>Isletme</span><select id="inquiryBusiness">' + state.businesses.map(function (item) { return '<option value="' + safe(item.id) + '">' + safe(item.name) + '</option>'; }).join('') + '</select></label><label class="field"><span>Talep Tipi</span><select id="inquiryType"><option value="konaklama">Konaklama</option><option value="masa">Masa / servis</option><option value="bilgi">Genel bilgi</option></select></label><label class="field"><span>Giris Tarihi</span><input id="inquiryCheckIn" type="date" /></label><label class="field"><span>Cikis Tarihi</span><input id="inquiryCheckOut" type="date" /></label><label class="field"><span>Yetiskin</span><input id="inquiryAdults" type="number" min="1" value="2" /></label><label class="field"><span>Cocuk</span><input id="inquiryChildren" type="number" min="0" value="0" /></label><label class="field"><span>Ad Soyad</span><input id="inquiryName" type="text" required /></label><label class="field"><span>Telefon</span><input id="inquiryPhone" type="text" required /></label><label class="field"><span>E-Posta</span><input id="inquiryEmail" type="email" /></label><label class="field"><span>Donus Tercihi</span><select id="inquiryChannel"><option value="telefon">Telefon</option><option value="whatsapp">WhatsApp</option><option value="eposta">E-Posta</option></select></label><label class="field field-span-2"><span>Not</span><textarea id="inquiryNote" rows="5"></textarea></label><div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Talebi Kaydet</button><span class="price-note" id="inquiryStatus"></span></div></form></div></div></section>');
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
        secondaryLabel: 'Panel Gecisleri',
        secondaryHref: './panel-mavi-inci.html',
        statsHtml: statCards([
          { label: 'Toplam Talep', value: String((state.inquiries || []).length) },
          { label: 'Otel Paneli', value: String(Data.listHotels(state).length) },
          { label: 'Yeme Icme Paneli', value: String(Data.listVenues(state).length) }
        ]),
        sideTitle: 'Panel Gecisleri',
        sideText: 'Her isletme kendi sayfasinda ayrik sekilde yonetilir. Grup hub, ortak bilgiler ve gelen talepler icin merkez gorevi gorur.'
      }) +
      '<section class="section section-light"><div class="container">' + flashBanner(flash) + '<div class="han-admin-grid"><article class="booking-shell han-settings-card"><div class="booking-shell-header"><h3>Grup Bilgileri</h3><p>Ust marka, iletisim ve ortak mesajlar burada yonetilir.</p></div><form id="groupSettingsForm" class="form-grid two"><label class="field"><span>Grup Adi</span><input name="name" type="text" value="' + safe(state.group.name) + '" required /></label><label class="field"><span>Telefon</span><input name="phone" type="text" value="' + safe(state.group.phone) + '" required /></label><label class="field"><span>E-Posta</span><input name="email" type="email" value="' + safe(state.group.email) + '" /></label><label class="field"><span>Sehir</span><input name="city" type="text" value="' + safe(state.group.city) + '" /></label><label class="field field-span-2"><span>Adres</span><input name="address" type="text" value="' + safe(state.group.address) + '" /></label><label class="field field-span-2"><span>Slogan</span><input name="tagline" type="text" value="' + safe(state.group.tagline) + '" /></label><label class="field field-span-2"><span>Aciklama</span><textarea name="description" rows="4">' + safe(state.group.description) + '</textarea></label><label class="field field-span-2"><span>Rezervasyon Notu</span><textarea name="reservationNote" rows="3">' + safe(state.group.reservationNote) + '</textarea></label><label class="field field-span-2"><span>One Cikanlar</span><textarea name="highlights" rows="5">' + safe(joinLines(state.group.highlights)) + '</textarea></label><div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Grup Bilgilerini Kaydet</button><button class="button button-secondary" type="button" data-admin-logout>Oturumu Kapat</button><span class="price-note" id="groupSettingsStatus"></span></div></form></article><article class="contact-card han-panel-links"><p class="section-kicker">Panel Gecisleri</p><h3>Her isletme icin ayri yonetim sayfasi</h3><p>Oteller, fast food restorani ve pub icin ayrik paneller burada listelenir.</p><div class="han-mini-links">' + businessLinks(state) + '</div></article></div></div></section>' +
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
      '<section class="section section-light"><div class="container">' + flashBanner(flash) + '<div class="han-admin-grid"><article class="booking-shell han-settings-card"><div class="booking-shell-header"><h3>' + safe(business.name) + ' ayarlari</h3><p>Tanitim dili, iletisim, kaynaklar ve urun kalemleri bu panelden yonetilir.</p></div><form id="businessPanelForm" class="form-grid two"><label class="field"><span>Isletme Adi</span><input name="name" type="text" value="' + safe(business.name) + '" required /></label><label class="field"><span>Kisa Ad</span><input name="shortName" type="text" value="' + safe(business.shortName) + '" /></label><label class="field field-span-2"><span>Hero Etiketi</span><input name="heroTag" type="text" value="' + safe(business.heroTag) + '" /></label><label class="field field-span-2"><span>Tagline</span><input name="tagline" type="text" value="' + safe(business.tagline) + '" /></label><label class="field"><span>Lokasyon</span><input name="location" type="text" value="' + safe(business.location) + '" /></label><label class="field"><span>Vurgu Rengi</span><input name="accent" type="text" value="' + safe(business.accent) + '" /></label><label class="field field-span-2"><span>Adres</span><input name="address" type="text" value="' + safe(business.address) + '" /></label><label class="field"><span>Telefon</span><input name="phone" type="text" value="' + safe(business.phone) + '" /></label><label class="field"><span>E-Posta</span><input name="email" type="email" value="' + safe(business.email) + '" /></label><label class="field field-span-2"><span>Web Sitesi</span><input name="website" type="text" value="' + safe(business.website) + '" /></label><label class="field field-span-2"><span>Kapak Gradient</span><input name="cover" type="text" value="' + safe(business.cover) + '" /></label><label class="field field-span-2"><span>Kisa Ozet</span><textarea name="summary" rows="4">' + safe(business.summary) + '</textarea></label><label class="field field-span-2"><span>Uzun Aciklama</span><textarea name="description" rows="5">' + safe(business.description) + '</textarea></label><label class="field field-span-2"><span>One Cikanlar</span><textarea name="highlights" rows="5">' + safe(joinLines(business.highlights)) + '</textarea></label><label class="field field-span-2"><span>Operasyon Notlari</span><textarea name="features" rows="5">' + safe(joinLines(business.features)) + '</textarea></label>' +
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
        email: form.elements.email.value.trim(),
        address: form.elements.address.value.trim(),
        city: form.elements.city.value.trim(),
        tagline: form.elements.tagline.value.trim(),
        description: form.elements.description.value.trim(),
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
        summary: form.elements.summary.value.trim(),
        description: form.elements.description.value.trim(),
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
