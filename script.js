
(function () {
  var Data = window.MaviInciData;
  if (!Data) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Veri katmani yuklenemedi.</div>';
    return;
  }

  var state = Data.resolveSiteData();
  var galleryItems = Data.getGalleryItems(state);
  var galleryState = { category: 'Tumu', currentItems: galleryItems.slice(), currentIndex: 0 };
  var bookingWizardState = { step: 1 };
  var revealObserver = null;
  var toastTimer = null;

  var testimonials = [
    { score: '9.6/10', title: 'Sessiz ama canli bir deneyim', text: 'Sahile bu kadar yakin olup bu kadar rafine bir atmosfer sunmasi gercekten etkileyiciydi.', guest: 'Elif & Can' },
    { score: 'Muthis', title: 'Kisa kacamak icin dogru secim', text: 'Deluxe odada kaldik; sabah deniz sesiyle uyanmak ve aksami terasta kapatmak tum tatilin tonunu degistirdi.', guest: 'Murat D.' },
    { score: 'Tekrar geliriz', title: 'Ailece cok rahat ettik', text: 'Standart Buyuk Oda ferah, ekip hizli ve kahvalti gercekten doyurucuydu.', guest: 'Yildiz Ailesi' }
  ];

  var faqs = [
    { title: 'Rezervasyon onayi ne kadar surede gelir?', text: 'Web sitesi uzerinden iletilen talepler genellikle ayni gun icinde teyit edilir.' },
    { title: 'Erken giris veya gec cikis talep edebilir miyim?', text: 'Musaitlige bagli olarak erken giris ve gec cikis talepleri degerlendirilir.' },
    { title: 'Cocuklu konaklamalarda hangi oda daha uygun?', text: 'Aileler icin en rahat secenek genellikle Standart Buyuk Oda veya Sultan Keyfi Oda olur.' }
  ];

  var featureLibrary = [
    { icon: '01', title: 'Sahil Ritmi', text: 'Gun dogumundan gun batimina kadar denizle ayni akista, sakin ama karakterli bir atmosfer.' },
    { icon: '02', title: 'Butik Servis', text: 'Kucuk olcegin avantajiyla hizli donus ve kisilestirilmis deneyim.' },
    { icon: '03', title: 'Yavas Kahvalti', text: 'Yerel urunler ve uzun kahvaltilarla gunu acele etmeden baslatan bir akim.' },
    { icon: '04', title: 'Gun Batimi Terasi', text: 'Aksam saatlerinde sahile yakin ama dingin kalan ozel alanlar.' }
  ];

  var bookingSteps = [
    { index: 1, title: 'Planla', text: 'Tarih, oda ve fiyat akisi' },
    { index: 2, title: 'Misafir', text: 'Iletisim ve ozel talepler' },
    { index: 3, title: 'Onay', text: 'Kontrol et ve talebi gonder' }
  ];

  function roomDetailHref(room) {
    return './room.html?room=' + encodeURIComponent(Data.getRoomKey(room));
  }

  function bookingHref(room) {
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

  function buildHotelStructuredData() {
    var siteUrl = Data.getSiteUrl(state, '/');
    var instagram = Data.getInstagramUrl(state.hotel.instagram);
    var roomPrices = Data.getActiveRooms(state).map(function (room) {
      return Number(room.weekendPrice || room.nightlyPrice || 0);
    });
    return {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      name: state.hotel.name,
      description: state.content.seoDescription || state.hotel.description,
      url: siteUrl,
      image: Data.getSiteUrl(state, '/favicon.svg'),
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

  function renderTopStrip() {
    var promo = Data.getPrimaryPromotion(state);
    return '<div class="top-strip"><div class="container top-strip-inner"><div>' +
      (promo ? '<strong>' + Data.escapeHtml(promo.title) + '</strong> | ' + Data.escapeHtml(promo.code) + ' koduyla %' + promo.discount + ' avantaj' : '<strong>Erdek sahilinde ozenli bir kacis</strong> | Dogrudan rezervasyona ozel esnek planlama') +
      '</div><div class="quick-meta"><span>Baslangic ' + Data.formatMoney(state, Data.getStartingPrice(state)) + ' / gece</span><span>Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + '</span><span>Kahvalti ' + Data.escapeHtml(state.hotel.breakfastHours) + '</span></div></div></div>';
  }

  function renderHeader() {
    return '<header class="site-header"><div class="container nav-shell"><a class="brand" href="#anasayfa" aria-label="Mavi Inci Park Otel ana sayfa"><span class="brand-mark">MI</span><span class="brand-copy"><strong>' + Data.escapeHtml(state.hotel.name) + '</strong><span>Erdek Sahilinde Butik Konaklama</span></span></a><nav class="desktop-nav" aria-label="Ana menu"><a href="#deneyim">Deneyim</a><a href="#odalar">Odalar</a><a href="#rezervasyon">Rezervasyon</a><a href="#galeri">Galeri</a><a href="#iletisim">Iletisim</a></nav><div class="nav-actions"><a class="button button-primary" href="#rezervasyon">' + Data.escapeHtml(state.content.bookingLabel || 'Hemen Rezervasyon Yap') + '</a><button class="button button-secondary mobile-toggle" id="mobileToggle" aria-expanded="false" aria-controls="mobilePanel"><span></span></button></div></div><div class="container mobile-panel hidden" id="mobilePanel"><nav aria-label="Mobil menu"><a href="#deneyim">Deneyim</a><a href="#odalar">Odalar</a><a href="#rezervasyon">Rezervasyon</a><a href="#galeri">Galeri</a><a href="#iletisim">Iletisim</a></nav></div></header>';
  }

  function renderHeroSignatureCard(item) {
    return '<article class="hero-signature-card"><span>' + Data.escapeHtml(item.label) + '</span><strong>' + Data.escapeHtml(item.value) + '</strong></article>';
  }

  function renderHero() {
    var promo = Data.getPrimaryPromotion(state);
    var availability = state.availability.slice(0, 5);
    var signatures = [
      { label: 'Sahil Ritueli', value: state.hotel.beachService ? 'Gun boyu sahil destegi' : 'Sessiz sahil ritmi' },
      { label: 'Sabah Akisi', value: 'Kahvalti ' + state.hotel.breakfastHours },
      { label: 'Varis Deneyimi', value: state.hotel.airportTransfer ? 'Transfer planlamasi' : 'Pratik check-in' }
    ];
    return '<section class="hero" id="anasayfa"><div class="container hero-grid"><div class="hero-copy"><div class="hero-prelude"><span class="hero-chip">Mavi / Beyaz / Deniz Kenari</span><span class="hero-rule"></span><span class="hero-annotation">Erdek kiyisinda mavi beyaz bir butik konaklama ritmi</span></div><p class="kicker">Balikesir Erdek\'te ferah, zarif ve denizle ayni tonda bir otel deneyimi</p><h1 class="hero-title">' + Data.escapeHtml(state.content.heroTitle) + '</h1><p class="hero-text">' + Data.escapeHtml(state.content.heroText) + ' ' + Data.escapeHtml(state.hotel.description) + '</p><div class="hero-ribbon-row">' + state.content.highlights.slice(0, 3).map(function (item) { return '<span class="hero-ribbon">' + Data.escapeHtml(item) + '</span>'; }).join('') + '</div><div class="hero-actions"><a class="button button-primary" href="#rezervasyon">' + Data.escapeHtml(state.content.bookingLabel || 'Hemen Rezervasyon Yap') + '</a><a class="button button-secondary" href="#odalar">Odalari Incele</a></div><div class="hero-signature-grid">' + signatures.map(renderHeroSignatureCard).join('') + '</div><div class="hero-stats"><article class="metric-card"><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong><span>gecelik baslangic fiyati</span></article><article class="metric-card"><strong>' + Data.getTotalAvailableRooms(state) + '</strong><span>su an listelenen musait oda</span></article><article class="metric-card"><strong>' + state.content.highlights.length + '</strong><span>one cikan deneyim basligi</span></article></div><div class="hero-meta"><article class="detail-card"><h3>Neden burada kalmali?</h3><ul class="detail-list">' + state.content.highlights.slice(0, 4).map(function (item) { return '<li>' + Data.escapeHtml(item) + '</li>'; }).join('') + '</ul></article><article class="detail-card"><h3>Yakindaki musaitlik</h3><div class="availability-list">' + availability.map(function (item) { return '<div class="availability-item"><div><strong>' + Data.formatShortDate(item.date) + '</strong><span>' + Data.escapeHtml(item.note) + '</span></div><span class="status-pill status-' + item.status + '">' + Data.getAvailabilityLabel(item.status) + '</span></div>'; }).join('') + '</div></article></div></div><aside class="hero-aside"><div class="quick-booking"><div class="quick-booking-topline"><span class="quick-booking-badge">Concierge Secimi</span><span class="quick-booking-badge muted-badge">' + (promo ? '%' + promo.discount + ' web avantaji' : 'Direkt rezervasyon') + '</span></div><p class="card-kicker">Hizli Planlama</p><h2>Kacamak tarihinizi secin</h2><p class="quick-booking-note">Kisa sorgunuzu olusturun; detayli form alanina otomatik tasiyalim.</p><form class="quick-booking-form" id="quickBookingForm"><div class="form-grid two"><div class="field"><label for="quickCheckIn">Giris</label><input id="quickCheckIn" name="checkIn" type="date" /></div><div class="field"><label for="quickCheckOut">Cikis</label><input id="quickCheckOut" name="checkOut" type="date" /></div></div><div class="field"><label for="quickRoomType">Oda tipi</label><select id="quickRoomType" name="roomType"><option value="">Oda tipi secin</option>' + Data.getActiveRooms(state).map(function (room) { return '<option value="' + Data.escapeHtml(Data.getRoomKey(room)) + '">' + Data.escapeHtml(room.name) + '</option>'; }).join('') + '</select></div><div class="reservation-summary"><h3>' + (promo ? 'Kampanya Avantaji' : 'Rezervasyon Notu') + '</h3><p>' + (promo ? Data.escapeHtml(promo.note) : 'Rezervasyon talebiniz hizli geri donus icin ekibimize iletilir.') + '</p><div class="summary-line"><span>Check-in</span><strong>' + Data.escapeHtml(state.hotel.checkInTime) + '</strong></div><div class="summary-line"><span>Check-out</span><strong>' + Data.escapeHtml(state.hotel.checkOutTime) + '</strong></div><div class="summary-line"><span>WhatsApp</span><strong>' + Data.escapeHtml(state.hotel.whatsappNumber) + '</strong></div></div><button class="button button-dark" type="submit">Detayli Rezervasyona Gec</button></form></div></aside></div><div class="container hero-collector"><div class="hero-collector-card"><span>Curated Coastal Stay</span><strong>Mavi beyaz yuzeyler, gun batimi terasi ve sessiz deniz ritmi tek hikayede bulusuyor.</strong></div><div class="hero-collector-card"><span>Operasyon Notu</span><strong>' + (state.hotel.onlineBooking ? 'Rezervasyon akisi su an acik ve anlik fiyat ozetiyle destekleniyor.' : 'Rezervasyon talepleri ekip teyidi ile planlaniyor.') + '</strong></div><div class="hero-collector-card"><span>Butik Servis</span><strong>' + (state.hotel.airportTransfer ? 'Varis oncesi transfer ve karsilama planlamasi mevcut.' : 'Kisa ve sorunsuz check-in deneyimi planlandi.') + '</strong></div></div></section>';
  }

  function renderExperience() {
    var valueProps = [
      { title: 'Mavi Beyaz Tasarim Dili', text: 'Serin mavi tonlar, beyaz yuzeyler ve yumusak isik dagilimi ile daha ferah bir sahil atmosferi kurgulandi.' },
      { title: state.hotel.beachService ? 'Sahil Servisi Hazir' : 'Sahil Kiyisinda Sessizlik', text: state.hotel.beachService ? 'Plaj duzeni ve gun ici destek ile deniz kenari deneyimi kesintisiz ilerler.' : 'Kiyiya yakin ama kalabaligin biraz disinda kalan dengeli bir lokasyon.' },
      { title: state.hotel.airportTransfer ? 'Transfer Kolayligi' : 'Kolay Ulasim', text: state.hotel.airportTransfer ? 'Transfer talepleri icin operasyon ekibi rezervasyon asamasinda planlama saglar.' : 'Otele ulasim ve check-in sureci pratik sekilde yonetilir.' }
    ];

    return '<section class="section section-light" id="deneyim"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Marka Hikayesi</p><h2>Deniz kenarinda rafine, yalnizca sakinlik degil karakter de sunan bir otel</h2><p class="story-copy">' + Data.escapeHtml(state.hotel.description) + ' Kisa hafta sonlarindan uzun yaz kacamaklarina kadar, tasarim dili sade ama etkili kalacak sekilde kurgulandi.</p><ul class="highlight-list">' + state.content.highlights.map(function (item) { return '<li>' + Data.escapeHtml(item) + '</li>'; }).join('') + '</ul></article><div class="value-stack">' + valueProps.map(function (item) { return '<article class="value-prop"><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p></article>'; }).join('') + '</div></div></section>';
  }
  function renderRoomCard(room, index) {
    var media = Data.getRoomGallery(state, room.id)[0] || galleryItems[index] || null;
    return '<article class="room-card"><a class="room-media room-media-link" href="' + roomDetailHref(room) + '">' + renderMedia(media, room.name, { loading: 'lazy', fetchPriority: 'low' }) + '</a><div class="room-header"><div><span class="tag">' + (Number(room.availableRooms) > 0 ? room.availableRooms + ' oda musait' : 'Bekleme listesi') + '</span><h3>' + Data.escapeHtml(room.name) + '</h3></div><div class="room-price"><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong><span>/ gece</span></div></div><p class="room-meta">' + Data.escapeHtml(room.notes || room.story || '') + '</p><ul class="room-specs"><li>' + Data.escapeHtml(room.amenities || 'Oda detaylari duzenli olarak guncellenir.') + '</li><li>Hafta sonu ' + Data.formatMoney(state, room.weekendPrice || room.nightlyPrice) + ' seviyesinden baslar</li><li>' + room.capacityAdults + ' yetiskin / ' + room.capacityChildren + ' cocuk kapasitesi</li></ul><div class="room-actions"><a class="button button-dark" href="#rezervasyon" data-room-select="' + Data.escapeHtml(Data.getRoomKey(room)) + '">Bu Odayi Sec</a><a class="button button-soft" href="' + roomDetailHref(room) + '">Detaylari Incele</a></div></article>';
  }

  function renderRooms() {
    return '<section class="section section-light" id="odalar"><div class="container"><div class="section-header"><p class="section-kicker">Oda Secenekleri</p><h2 class="section-title">Her misafir profiline uygun, yeni oda envanterimiz</h2><p class="section-text">Standart odadan Sultan Keyfi odasina kadar tum aktif oda tiplerini mavi beyaz kimlige uygun, temiz ve net bir sunumla listeliyoruz.</p></div><div class="rooms-grid">' + Data.getFeaturedRooms(state).map(renderRoomCard).join('') + '</div></div></section>';
  }

  function roomSizeValue(room) {
    var match = String((room || {}).size || '').match(/(\d+(?:[.,]\d+)?)/);
    return match ? parseFloat(match[1].replace(',', '.')) : 0;
  }

  function roomGuestFit(room) {
    if (!room) return 'Dengeli sahil konaklamasi';
    if (room.id === 'tek-kisilik') return 'Solo konaklama ve kisa is seyahati';
    if (room.id === 'deniz-manzarali-delux') return 'Gun batimi odakli cift kacamaklari';
    if (room.id === 'sultan-keyfi') return 'Ozel gunler ve premium konaklama';
    if (room.id === 'standart-buyuk') return 'Aileler ve daha genis yasam ritmi';
    return 'Sahil ritmine dengeli bir giris';
  }

  function roomCapacityLabel(room) {
    return room.capacityAdults + ' yetiskin' + (Number(room.capacityChildren || 0) > 0 ? ' + ' + room.capacityChildren + ' cocuk' : '');
  }

  function renderComparisonSpotlight(label, room, detail) {
    if (!room) return '';
    return '<article class="comparison-spotlight">' +
      '<span>' + Data.escapeHtml(label) + '</span>' +
      '<strong>' + Data.escapeHtml(room.name) + '</strong>' +
      '<p>' + Data.escapeHtml(detail) + '</p>' +
      '</article>';
  }

  function renderRoomComparison() {
    var rooms = Data.getActiveRooms(state);
    if (!rooms.length) return '';
    var lowest = rooms.slice().sort(function (left, right) { return Number(left.nightlyPrice || 0) - Number(right.nightlyPrice || 0); })[0];
    var largest = rooms.slice().sort(function (left, right) { return roomSizeValue(right) - roomSizeValue(left); })[0];
    var seaView = rooms.find(function (room) { return /deniz/i.test(String(room.view || '')); }) || largest || lowest;
    var rows = [
      { label: 'Hafta ici', render: function (room) { return Data.formatMoney(state, room.nightlyPrice); } },
      { label: 'Hafta sonu', render: function (room) { return Data.formatMoney(state, room.weekendPrice || room.nightlyPrice); } },
      { label: 'Boyut', render: function (room) { return Data.escapeHtml(room.size); } },
      { label: 'Kapasite', render: function (room) { return Data.escapeHtml(roomCapacityLabel(room)); } },
      { label: 'Yatak', render: function (room) { return Data.escapeHtml(room.bed); } },
      { label: 'Gorunum', render: function (room) { return Data.escapeHtml(room.view); } },
      { label: 'En uygun profil', render: function (room) { return Data.escapeHtml(roomGuestFit(room)); } },
      { label: 'Musaitlik', render: function (room) { return Number(room.availableRooms || 0) > 0 ? room.availableRooms + ' oda musait' : 'Bekleme listesi'; } }
    ];

    return '<section class="section section-light section-compare" id="oda-karsilastirma"><div class="container">' +
      '<div class="section-header"><p class="section-kicker">Oda Karsilastirma</p><h2 class="section-title">Hangi oda size daha cok uyuyor, tek bakista gorun</h2><p class="section-text">Fiyat, boyut, gorunum ve konaklama profiline gore tum oda tiplerini ayni satirda karsilastirarak karar vermeyi hizlandirdik.</p></div>' +
      '<div class="compare-highlights">' +
      renderComparisonSpotlight('En avantajli baslangic', lowest, Data.formatMoney(state, lowest.nightlyPrice) + ' ile mavi beyaz deneyime en dengeli giris') +
      renderComparisonSpotlight('En genis yasam alani', largest, largest.size + ' ile uzun konaklamalarda daha rahat alan hissi') +
      renderComparisonSpotlight('En guclu manzara secimi', seaView, seaView.view + ' ile gun batimini deneyimin merkezine alir') +
      '</div>' +
      '<div class="comparison-table-shell"><table class="comparison-table"><thead><tr><th scope="col">Kriter</th>' +
      rooms.map(function (room) {
        return '<th scope="col"><div class="comparison-room-head"><span class="comparison-room-tag">' + Data.escapeHtml(room.short || room.name) + '</span><strong>' + Data.escapeHtml(room.name) + '</strong><span>' + Data.formatMoney(state, room.nightlyPrice) + ' / gece</span></div></th>';
      }).join('') +
      '</tr></thead><tbody>' +
      rows.map(function (row) {
        return '<tr><th scope="row">' + Data.escapeHtml(row.label) + '</th>' + rooms.map(function (room) {
          return '<td>' + row.render(room) + '</td>';
        }).join('') + '</tr>';
      }).join('') +
      '</tbody></table></div></div></section>';
  }

  function renderFeatures() {
    return '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Otel Deneyimi</p><h2 class="section-title">Sadece bir oda degil, tam bir konaklama ritmi</h2><p class="section-text">Deniz, servis, kahvalti, transfer ve gunluk operasyon kalitesi; iyi bir otel sitesinde yalnizca yazilmakla kalmamalidir, hissettirilmelidir.</p></div><div class="features-grid">' + featureLibrary.map(function (item) { return '<article class="feature-card"><div class="feature-icon">' + Data.escapeHtml(item.icon) + '</div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p></article>'; }).join('') + '</div></div></section>';
  }

  function buildSignaturePackages() {
    var deluxe = Data.getRoomByKey(state, 'deniz-manzarali-delux') || Data.getRoomByKey(state, 'sultan-keyfi') || Data.getActiveRooms(state)[0];
    var family = Data.getRoomByKey(state, 'standart-buyuk') || Data.getRoomByKey(state, 'standart') || deluxe;
    var solo = Data.getRoomByKey(state, 'tek-kisilik') || Data.getRoomByKey(state, 'standart') || family;
    var promo = Data.getPrimaryPromotion(state);

    return [
      {
        title: 'Sunset Escape',
        kicker: 'Imza Kacamak',
        room: deluxe,
        note: 'Gun batimi saatini manzara ve ozel servis hissiyle birlestiren daha rafine bir iki kisilik kacamak.',
        perks: ['Deniz odakli oda secimi', 'Gun batimi saatine uygun karsilama ritmi', 'Premium banyo seti ve yavas sabah akisi'],
        accent: true
      },
      {
        title: 'Aile Mavi Beyaz Paketi',
        kicker: 'Daha Genis Yasam',
        room: family,
        note: 'Ailece Erdek ritmine rahat bir giris yapmak isteyenler icin daha genis plan, daha sakin bir tempo.',
        perks: ['Daha rahat hareket alani', 'Cocuklu konaklamaya uygun duzen', 'Kahvalti ve sahil ritmi icin dengeli planlama'],
        accent: false
      },
      {
        title: 'Weekday Reset',
        kicker: promo ? 'Web Avantaji' : 'Yavas Konaklama',
        room: solo,
        note: promo ? 'Aktif web kampanyasi ile hafta ici daha sakin, daha hizli karar verilen bir konaklama alternatifi.' : 'Hafta ici daha sessiz bir ritimde calisma ve dinlenme dengesini koruyan sade bir kacis.',
        perks: ['Hafta ici daha sakin operasyon', 'Hizli check-in ve net fiyat akisi', promo ? promo.code + ' koduyla ek avantaj' : 'Kisa ve verimli konaklama kompozisyonu'],
        accent: false
      }
    ];
  }

  function renderSignaturePackages() {
    var packages = buildSignaturePackages();
    return '<section class="section section-light section-packages" id="imza-paketler"><div class="container">' +
      '<div class="section-header"><p class="section-kicker">Ozel Deneyim Paketleri</p><h2 class="section-title">Hazir kurgulanmis konaklama senaryolari ile secimi kolaylastirin</h2><p class="section-text">Her misafirin ihtiyaci ayni degil; bu nedenle odalari sadece fiyatla degil, konaklama niyetiyle birlikte paketledik.</p></div>' +
      '<div class="package-grid">' + packages.map(function (item) {
        var room = item.room;
        return '<article class="package-card' + (item.accent ? ' is-featured' : '') + '">' +
          '<div class="package-topline"><span class="package-kicker">' + Data.escapeHtml(item.kicker) + '</span><span class="tag">' + Data.escapeHtml(room.short || room.name) + '</span></div>' +
          '<h3>' + Data.escapeHtml(item.title) + '</h3>' +
          '<p>' + Data.escapeHtml(item.note) + '</p>' +
          '<div class="package-meta"><div><span>Oda</span><strong>' + Data.escapeHtml(room.name) + '</strong></div><div><span>Baslangic</span><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong></div></div>' +
          '<ul class="package-perks">' + item.perks.map(function (perk) { return '<li>' + Data.escapeHtml(perk) + '</li>'; }).join('') + '</ul>' +
          '<div class="package-actions"><a class="button button-dark" href="' + bookingHref(room) + '">Rezervasyona Git</a><a class="button button-soft" href="' + roomDetailHref(room) + '">Odayi Incele</a></div>' +
          '</article>';
      }).join('') + '</div></div></section>';
  }

  function renderEditorial() {
    var promo = Data.getPrimaryPromotion(state);
    return '<section class="section section-dark"><div class="container editorial-layout"><article class="editorial-card"><p class="section-kicker">Planlama Notlari</p><h2 class="editorial-title">Rezervasyon kararini hizlandiran net bilgiler</h2><ul class="booking-bullets"><li>Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + ' / Check-out ' + Data.escapeHtml(state.hotel.checkOutTime) + '</li><li>Kahvalti saati: ' + Data.escapeHtml(state.hotel.breakfastHours) + '</li><li>Iptal penceresi: ' + state.settings.cancellationWindow + ' gun</li><li>' + (state.hotel.onlineBooking ? 'Online rezervasyon su an acik.' : 'Online rezervasyon icin ekipten teyit alin.') + '</li></ul></article><article class="editorial-card"><p class="section-kicker">Fiyat Akisi</p><h2 class="editorial-title">Kampanya ve sezon kurallari gorunur olsun</h2><p>' + (promo ? Data.escapeHtml(promo.title) + ' kampanyasi su an aktif. Kod: ' + Data.escapeHtml(promo.code) + '.' : 'Aktif kampanya bulunmadiginda bile fiyat bloklari tutarli, net ve guven verici sekilde sunulmali.') + '</p><div class="inline-stats"><div class="inline-stat"><strong>' + state.seasonalPricing.length + '</strong><span>sezon kural seti</span></div><div class="inline-stat"><strong>' + state.promotions.length + '</strong><span>kampanya / kupon</span></div><div class="inline-stat"><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong><span>en dusuk gece fiyat</span></div></div></article></div></section>';
  }

  function formatSeasonWindow(item) {
    return Data.formatShortDate(item.start) + ' - ' + Data.formatShortDate(item.end);
  }

  function renderSeasonalOffers() {
    var promotions = state.promotions.slice(0, 3);
    var seasonal = state.seasonalPricing.slice(0, 3);
    return '<section class="section section-dark section-seasonal" id="sezon-firsatlari"><div class="container seasonal-grid">' +
      '<article class="seasonal-panel"><div class="section-header"><p class="section-kicker">Sezon Teklifleri</p><h2 class="section-title">Fiyat mantigi ve kampanya ritmi tek alanda toplansin</h2><p class="section-text">Misafir kararini guclendiren sey yalnizca dusuk fiyat degil; hangi avantajin ne zaman geldigini net gorebilmektir.</p></div>' +
      '<div class="seasonal-card-grid">' + seasonal.map(function (item, index) {
        var multiplier = Number(item.multiplier || 1);
        var change = Math.round(Math.abs(multiplier - 1) * 100);
        var label = multiplier >= 1 ? '%' + change + ' sezon etkisi' : '%' + change + ' web avantaji';
        return '<article class="seasonal-card' + (index === 0 ? ' is-accent' : '') + '">' +
          '<div class="seasonal-topline"><span class="tag">' + Data.escapeHtml(label) + '</span><span>' + Data.escapeHtml(item.channel || 'Tum Kanallar') + '</span></div>' +
          '<h3>' + Data.escapeHtml(item.title) + '</h3>' +
          '<p>' + Data.escapeHtml(item.note) + '</p>' +
          '<div class="seasonal-meta"><strong>' + Data.escapeHtml(formatSeasonWindow(item)) + '</strong><span>' + (multiplier >= 1 ? 'Talep yogunlugu fiyata yansir' : 'Web rezervasyonunda indirim ritmi') + '</span></div>' +
          '</article>';
      }).join('') + '</div></article>' +
      '<aside class="seasonal-brief"><p class="section-kicker">Aktif Promosyonlar</p><h3>Web uzerinden karar vermeyi kolaylastiran avantajlar</h3>' +
      '<div class="seasonal-promo-list">' + promotions.map(function (promo) {
        return '<article class="seasonal-promo-card"><div><span class="tag">%' + promo.discount + ' avantaj</span><h4>' + Data.escapeHtml(promo.title) + '</h4></div><p>' + Data.escapeHtml(promo.note) + '</p><div class="seasonal-meta"><strong>Kod: ' + Data.escapeHtml(promo.code) + '</strong><span>' + (promo.status === 'active' ? 'Su an kullanima acik' : 'Planlanan kampanya') + '</span></div></article>';
      }).join('') + '</div>' +
      '<div class="seasonal-note"><strong>Concierge Notu</strong><p>En dogru teklif genellikle oda secimi, kalis suresi ve sezon yogunlugunun birlikte okunmasiyla cikiyor. Bu alan, misafire fiyat mantigini saklamadan anlatmak icin tasarlandi.</p></div>' +
      '</aside></div></section>';
  }

  function renderBookingStep(step) {
    return '<article class="booking-step-card' + (step.index === 1 ? ' is-active' : '') + '" data-booking-step="' + step.index + '">' +
      '<span class="booking-step-index">0' + step.index + '</span>' +
      '<div><strong>' + Data.escapeHtml(step.title) + '</strong><span>' + Data.escapeHtml(step.text) + '</span></div>' +
      '</article>';
  }

  function renderBookingAvailabilityRail() {
    return Data.getUpcomingAvailability(state, 10).map(function (item) {
      return '<article class="booking-availability-pill status-' + item.status + '">' +
        '<strong>' + Data.formatShortDate(item.date) + '</strong>' +
        '<span>' + Data.getAvailabilityLabel(item.status) + '</span>' +
        '</article>';
    }).join('');
  }

  function renderBookingSection() {
    var promotions = state.promotions.slice(0, 2);
    var primaryPromo = Data.getPrimaryPromotion(state);
    return '<section class="section section-light" id="rezervasyon"><div class="container booking-layout"><article class="contact-card booking-shell"><div class="booking-shell-header"><div><p class="section-kicker">Rezervasyon Planlayici</p><h3>Profesyonel rezervasyon akisi</h3><p>Secimlerinizi adim adim tamamlayin; fiyat dokumu, uygunluk sinyalleri ve misafir bilgileri ayni akista toplansin.</p></div><div class="booking-shell-badges"><span class="tag">Anlik fiyat ozeti</span><span class="tag">Musaitlik kontrolu</span><span class="tag">Hizli geri donus</span></div></div><div class="booking-stepper">' + bookingSteps.map(renderBookingStep).join('') + '</div><div class="booking-availability-strip"><div><strong>Yaklasan musaitlik ritmi</strong><span>Onumuzdeki tarihlerde operasyon yogunlugu</span></div><div class="booking-availability-rail">' + renderBookingAvailabilityRail() + '</div></div><form class="booking-form booking-form-pro" id="bookingForm" novalidate><section class="booking-step-panel is-active" data-booking-panel="1"><div class="booking-panel-header"><p class="card-kicker">1. Adim</p><h3>Konaklamanizi planlayin</h3><p>Tarih, oda, misafir sayisi ve varsa kampanya kodunu secin.</p></div><div class="form-grid three"><div class="field"><label for="checkIn">Giris Tarihi</label><input id="checkIn" name="checkIn" type="date" /><div class="error-message" id="checkIn-error"></div></div><div class="field"><label for="checkOut">Cikis Tarihi</label><input id="checkOut" name="checkOut" type="date" /><div class="error-message" id="checkOut-error"></div></div><div class="field"><label for="roomType">Oda Tipi</label><select id="roomType" name="roomType"><option value="">Oda tipi secin</option>' + Data.getActiveRooms(state).map(function (room) { return '<option value="' + Data.escapeHtml(Data.getRoomKey(room)) + '">' + Data.escapeHtml(room.name) + '</option>'; }).join('') + '</select><div class="error-message" id="roomType-error"></div></div></div><div class="form-grid four"><div class="field"><label for="adults">Yetiskin</label><select id="adults" name="adults"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select><div class="error-message" id="adults-error"></div></div><div class="field"><label for="children">Cocuk</label><select id="children" name="children"><option selected>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select><div class="error-message" id="children-error"></div></div><div class="field"><label for="arrivalTime">Tahmini Varis</label><select id="arrivalTime" name="arrivalTime"><option value="">Saat secin</option><option>12:00 - 14:00</option><option>14:00 - 16:00</option><option>16:00 - 18:00</option><option>18:00 - 21:00</option><option>21:00 sonrasi</option></select></div><div class="field"><label for="promoCode">Kampanya Kodu</label><input id="promoCode" name="promoCode" type="text" placeholder="' + Data.escapeHtml(primaryPromo ? primaryPromo.code : 'KODUNUZ') + '" /></div></div><div class="booking-inline-note">' + (primaryPromo ? '<strong>Aktif web kampanyasi:</strong> ' + Data.escapeHtml(primaryPromo.title) + ' | Kod: ' + Data.escapeHtml(primaryPromo.code) : 'Aktif kampanya bulunmadiginda sistem standart fiyat uzerinden hesaplama yapar.') + '</div><div class="booking-step-actions"><div class="form-note">Fiyat ozeti sag tarafta, gece bazli olarak anlik hesaplanir.</div><button class="button button-dark" type="button" data-booking-next="2">Misafir Bilgilerine Gec</button></div></section><section class="booking-step-panel" data-booking-panel="2" aria-hidden="true"><div class="booking-panel-header"><p class="card-kicker">2. Adim</p><h3>Misafir ve iletisim bilgileri</h3><p>Ekibin size hizli donus yapabilmesi icin temel iletisim bilgilerini tamamlayin.</p></div><div class="form-grid two"><div class="field"><label for="guestName">Ad Soyad</label><input id="guestName" name="guestName" type="text" placeholder="Rezervasyon sahibi" /><div class="error-message" id="guestName-error"></div></div><div class="field"><label for="contactMethod">Donus Tercihi</label><select id="contactMethod" name="contactMethod"><option value="Telefon">Telefon</option><option value="WhatsApp">WhatsApp</option><option value="E-posta">E-posta</option></select></div></div><div class="form-grid two"><div class="field"><label for="guestPhone">Telefon</label><input id="guestPhone" name="guestPhone" type="tel" placeholder="05xx xxx xx xx" /><div class="error-message" id="guestPhone-error"></div></div><div class="field"><label for="guestEmail">E-posta</label><input id="guestEmail" name="guestEmail" type="email" placeholder="ornek@mail.com" /><div class="error-message" id="guestEmail-error"></div></div></div><div class="form-grid two"><label class="option-card"><input id="transferRequest" name="transferRequest" type="checkbox" /><div><strong>Transfer destegi iste</strong><span>' + (state.hotel.airportTransfer ? 'Otele gelis planlamasi icin ekip bilgilendirilsin.' : 'Ulasim ihtiyacinizi not olarak iletebilirsiniz.') + '</span></div></label><label class="option-card"><input id="lateArrival" name="lateArrival" type="checkbox" /><div><strong>Gec varis ihtimali</strong><span>Oda tutulumu ve operasyon planlamasi buna gore yapilsin.</span></div></label></div><div class="field"><label for="specialRequest">Ozel Notunuz</label><textarea id="specialRequest" name="specialRequest" placeholder="Erken giris, deniz goruslu tercih, cocuk yatagi, transfer talebi veya kutlama notu gibi detaylari yazabilirsiniz."></textarea></div><label class="consent-row"><input id="privacyConsent" name="privacyConsent" type="checkbox" /><span>Bilgilerimin rezervasyon talebimi yonetmek amaciyla islenmesini kabul ediyorum.</span></label><div class="error-message" id="privacyConsent-error"></div><div class="booking-step-actions"><button class="button button-soft" type="button" data-booking-prev="1">Geri Don</button><button class="button button-dark" type="button" data-booking-next="3">Onay Ekranina Gec</button></div></section><section class="booking-step-panel" data-booking-panel="3" aria-hidden="true"><div class="booking-panel-header"><p class="card-kicker">3. Adim</p><h3>Son kontrol ve talep gonderimi</h3><p>Oda, tarih, misafir bilgileri ve fiyat ozeti son kez kontrol edilir.</p></div><div class="booking-review-grid"><article class="booking-review-card"><h4>Konaklama Ozeti</h4><div class="review-lines" id="reviewStay"></div></article><article class="booking-review-card"><h4>Misafir Bilgileri</h4><div class="review-lines" id="reviewGuest"></div></article><article class="booking-review-card"><h4>Politika ve Operasyon</h4><div class="review-lines" id="reviewPolicy"></div></article></div><div class="booking-step-actions"><button class="button button-soft" type="button" data-booking-prev="2">Geri Don</button><div class="booking-submit-stack"><button class="button button-dark" type="submit">Rezervasyon Talebini Gonder</button><div class="status-message" id="bookingStatus" role="status" aria-live="polite"></div></div></div><div class="form-note">Talep gonderildiginde rezervasyon isteginiz iletilir ve referans numarasi olusturulur.</div></section></form></article><aside class="info-stack booking-sidebar"><article class="contact-card reservation-summary booking-summary-card" id="summaryCard"><p class="section-kicker">Canli Fiyat Ozeti</p><h3 id="summaryRoomName">Bir oda secin</h3><p id="summaryNote">Tarih ve oda secimi yaptiginizda tahmini toplam burada guncellenir.</p><div class="summary-badges"><span class="status-pill status-available" id="summaryStatus">Musaitlik bekleniyor</span><span class="tag" id="summaryGuests">0 misafir</span></div><div class="summary-line"><span>Konaklama</span><strong id="summaryDates">Tarih secilmedi</strong></div><div class="summary-line"><span>Gecelik baz</span><strong id="summaryBase">' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong></div><div class="summary-line"><span>Sezon etkisi</span><strong id="summarySeason">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-line"><span>Gece sayisi</span><strong id="summaryNights">0</strong></div><div class="summary-line"><span>Indirim</span><strong id="summaryDiscount">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-line"><span>Vergi</span><strong id="summaryTax">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-line summary-line-total"><span>Toplam</span><strong id="summaryTotal">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-promo" id="summaryPromotion">Aktif kampanya seciminize gore yansitilir.</div><div class="summary-divider"></div><div class="summary-breakdown" id="summaryBreakdown"><div class="summary-empty">Gece bazli fiyat dokumu burada listelenecek.</div></div></article><article class="contact-card booking-room-card"><p class="section-kicker">Secilen Oda</p><h3 id="selectedRoomLabel">Oda secimi bekleniyor</h3><p id="selectedRoomMeta">Kapasite, gorunum ve konfor detaylari secime gore burada gorunur.</p><div class="summary-line"><span>Musait oda</span><strong id="selectedRoomAvailability">-</strong></div><div class="summary-line"><span>Kapasite</span><strong id="selectedRoomCapacity">-</strong></div><div class="summary-line"><span>Yatak duzeni</span><strong id="selectedRoomBed">-</strong></div><div class="summary-line"><span>Artilar</span><strong id="selectedRoomHighlights">-</strong></div></article><article class="contact-card"><p class="section-kicker">Paketler ve Firsatlar</p><h3>Aktif kampanya ve garanti notlari</h3><div class="offer-strip compact-offers">' + promotions.map(function (promo) { return '<article class="offer-card"><span class="tag">%' + promo.discount + ' avantaj</span><h3>' + Data.escapeHtml(promo.title) + '</h3><p>' + Data.escapeHtml(promo.note) + '</p><div class="offer-meta">Kod: ' + Data.escapeHtml(promo.code) + '</div></article>'; }).join('') + '</div><ul class="booking-policy-list"><li>Iptal penceresi: ' + state.settings.cancellationWindow + ' gun</li><li>Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + ' / Check-out ' + Data.escapeHtml(state.hotel.checkOutTime) + '</li><li>Kahvalti ' + Data.escapeHtml(state.hotel.breakfastHours) + '</li></ul></article></aside></div></section>';
  }

  function renderGalleryCard(item) {
    return '<article class="gallery-card" data-gallery-card data-category="' + Data.escapeHtml(item.category || 'Galeri') + '" data-gallery-id="' + Data.escapeHtml(item.id) + '"><button class="gallery-card-button" type="button" data-gallery-open="' + Data.escapeHtml(item.id) + '"><div class="gallery-media">' + renderMedia(item, item.title, { loading: 'lazy', fetchPriority: 'low' }) + '</div><div class="gallery-caption"><h3>' + Data.escapeHtml(item.title) + '</h3><span>' + Data.escapeHtml(item.category || 'Galeri') + '</span></div></button></article>';
  }

  function renderGallery() {
    var categories = Data.getGalleryCategories(state);
    return '<section class="section section-light" id="galeri"><div class="container"><div class="gallery-heading"><div><p class="section-kicker">Galeri</p><h2>Otelin tonunu anlatan secili kareler</h2></div><p class="section-text">Filtrelenebilir bir galeri akisi ve buyutulmus goruntuleme ile ziyaretci odalar ile ortak alanlar arasinda rahatca gezebilir.</p></div><div class="gallery-filters" id="galleryFilters">' + categories.map(function (category, index) { return '<button class="filter-chip' + (index === 0 ? ' is-active' : '') + '" type="button" data-gallery-filter="' + Data.escapeHtml(category) + '">' + Data.escapeHtml(category) + '</button>'; }).join('') + '</div><div class="gallery-grid" id="galleryGrid">' + galleryItems.map(renderGalleryCard).join('') + '</div></div></section>';
  }
  function renderReviewsAndContact() {
    return '<section class="section section-light" id="iletisim"><div class="container contact-grid"><div><div class="section-header"><p class="section-kicker">Yorumlar</p><h2 class="section-title">Guven duygusu tasarimin kadar guclu olmali</h2><p class="section-text">Iyi bir otel sitesi, ziyaretciye yalnizca guzel gorunmek yerine karar vermek icin guven de verir.</p></div><div class="reviews-grid">' + testimonials.map(function (item) { return '<article class="review-card"><div class="review-score">' + Data.escapeHtml(item.score) + '</div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><span class="tag">' + Data.escapeHtml(item.guest) + '</span></article>'; }).join('') + '</div></div><div class="info-stack"><article class="contact-card"><p class="section-kicker">Iletisim</p><h3>Hizli ulasim bilgileri</h3><p>' + Data.escapeHtml(state.hotel.address) + '</p><p><a class="contact-link" href="tel:' + Data.escapeHtml(state.hotel.phone) + '">' + Data.escapeHtml(state.hotel.phone) + '</a></p><p><a class="contact-link" href="mailto:' + Data.escapeHtml(state.hotel.email) + '">' + Data.escapeHtml(state.hotel.email) + '</a></p><p><a class="contact-link" href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp: ' + Data.escapeHtml(state.hotel.whatsappNumber) + '</a></p><p>Instagram: ' + Data.escapeHtml(state.hotel.instagram) + '</p></article><article class="contact-card"><p class="section-kicker">Sik Sorulanlar</p><div class="faq-list">' + faqs.map(function (item) { return '<article class="faq-item"><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p></article>'; }).join('') + '</div></article></div></div></section>';
  }

  function renderFooter() {
    return '<footer class="footer"><div class="container footer-grid"><div class="footer-brand"><strong>' + Data.escapeHtml(state.hotel.name) + '</strong><span>' + Data.escapeHtml(state.hotel.description) + '</span></div><div><p class="section-kicker">Kisayollar</p><div class="footer-links"><a href="#deneyim">Deneyim</a><a href="#odalar">Odalar</a><a href="#rezervasyon">Rezervasyon</a><a href="#galeri">Galeri</a></div></div><div><p class="section-kicker">Operasyon</p><div class="footer-links"><a href="#">Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + '</a><a href="#">Check-out ' + Data.escapeHtml(state.hotel.checkOutTime) + '</a><a href="#">Kahvalti ' + Data.escapeHtml(state.hotel.breakfastHours) + '</a><a href="#iletisim">Iletisim Akisi</a></div></div><div><p class="section-kicker">Iletisim</p><div class="footer-links"><a href="tel:' + Data.escapeHtml(state.hotel.phone) + '">' + Data.escapeHtml(state.hotel.phone) + '</a><a href="mailto:' + Data.escapeHtml(state.hotel.email) + '">' + Data.escapeHtml(state.hotel.email) + '</a><a href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp</a></div></div></div><div class="container footer-note"><div class="footer-meta">Dogrudan rezervasyon, oda detaylari ve iletisim akisi tek bir sade deneyimde birlestirildi.</div><div class="footer-meta">Mavi Inci Park Otel | Erdek</div></div></footer><div class="toast" id="toast"></div><div class="lightbox hidden" id="lightbox" aria-hidden="true"><div class="lightbox-backdrop" data-lightbox-close></div><div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Galeri buyutme"><button class="lightbox-close" type="button" data-lightbox-close>Kapat</button><div class="lightbox-stage" id="lightboxStage"></div><div class="lightbox-meta"><div><strong id="lightboxTitle">Galeri</strong><span id="lightboxCaption"></span></div><div class="lightbox-controls"><button class="lightbox-nav" type="button" id="lightboxPrev">Onceki</button><span id="lightboxCounter">1 / 1</span><button class="lightbox-nav" type="button" id="lightboxNext">Sonraki</button></div></div></div></div>';
  }

  function renderFloatingActions() {
    var whatsapp = 'https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, ''));
    return '<div class="floating-actions" aria-label="Hizli rezervasyon ve iletisim aksiyonlari">' +
      '<a class="floating-button floating-button-secondary" href="' + whatsapp + '">' +
      '<span>WhatsApp</span><strong>Hizli Bilgi Al</strong></a>' +
      '<a class="floating-button floating-button-primary" href="#rezervasyon">' +
      '<span>Rezervasyon</span><strong>Hemen Basla</strong></a>' +
      '</div>';
  }

  function renderApp() {
    return '<div class="shell">' + renderTopStrip() + renderHeader() + '<main>' + renderHero() + renderExperience() + renderRooms() + renderRoomComparison() + renderFeatures() + renderSignaturePackages() + renderEditorial() + renderSeasonalOffers() + renderBookingSection() + renderGallery() + renderReviewsAndContact() + '</main>' + renderFooter() + renderFloatingActions() + '</div>';
  }

  function updateMeta() {
    var title = state.content.seoTitle || Data.fallbackState.content.seoTitle;
    var description = state.content.seoDescription || Data.fallbackState.content.seoDescription;
    var canonical = Data.getSiteUrl(state, '/');
    var image = Data.getSiteUrl(state, '/favicon.svg');
    var keywords = [
      state.hotel.name,
      'Erdek butik otel',
      'Balikesir sahil oteli'
    ].concat(state.content.highlights || []).join(', ');

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
    setStructuredData(buildHotelStructuredData());
  }

  function mount(savedSelection) {
    updateMeta();
    document.getElementById('root').innerHTML = renderApp();
    initializeNavigation();
    initializeRoomShortcuts();
    initializeForms();
    initializeGalleryFlow();
    initializeRevealAnimations();
    if (savedSelection) restoreBookingState(savedSelection);
    else applyInitialSelection();
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

  function initializeRoomShortcuts() {
    document.querySelectorAll('[data-room-select]').forEach(function (button) {
      button.addEventListener('click', function () {
        var roomValue = button.getAttribute('data-room-select');
        var roomField = document.getElementById('roomType');
        if (roomField) {
          roomField.value = roomValue;
          setBookingStep(1);
          updateSummary();
        }
      });
    });
  }

  function initializeForms() {
    var bookingForm = document.getElementById('bookingForm');
    var quickForm = document.getElementById('quickBookingForm');
    if (!bookingForm || !quickForm) return;

    var today = Data.normalizeDate(new Date());
    var minCheckIn = Data.formatDate(Data.addDays(today, 1));
    var minCheckOut = Data.formatDate(Data.addDays(today, 2));
    var mainCheckIn = document.getElementById('checkIn');
    var mainCheckOut = document.getElementById('checkOut');
    var quickCheckIn = document.getElementById('quickCheckIn');
    var quickCheckOut = document.getElementById('quickCheckOut');

    initializeBookingWizard();

    [mainCheckIn, quickCheckIn].forEach(function (input) {
      input.min = minCheckIn;
      input.addEventListener('change', function () {
        syncCheckoutMin(mainCheckIn, mainCheckOut, minCheckOut);
        syncCheckoutMin(quickCheckIn, quickCheckOut, minCheckOut);
        updateSummary();
      });
    });

    [mainCheckOut, quickCheckOut].forEach(function (input) {
      input.min = minCheckOut;
      input.addEventListener('change', updateSummary);
    });

    ['roomType', 'adults', 'children', 'arrivalTime', 'promoCode', 'guestName', 'guestPhone', 'guestEmail', 'specialRequest', 'contactMethod'].forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
      }
    });

    ['transferRequest', 'lateArrival', 'privacyConsent'].forEach(function (id) {
      var input = document.getElementById(id);
      if (input) input.addEventListener('change', updateSummary);
    });

    quickForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (quickCheckIn.value) mainCheckIn.value = quickCheckIn.value;
      if (quickCheckOut.value) mainCheckOut.value = quickCheckOut.value;
      var quickRoom = document.getElementById('quickRoomType');
      if (quickRoom.value) document.getElementById('roomType').value = quickRoom.value;
      syncCheckoutMin(mainCheckIn, mainCheckOut, minCheckOut);
      setBookingStep(1);
      updateSummary();
      document.getElementById('rezervasyon').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      clearErrors();
      var values = collectBookingValues();
      var errors = validateAllBookingValues(values);
      var keys = Object.keys(errors);
      if (keys.length) {
        showErrors(errors);
        setBookingStep(getFirstErrorStep(errors));
        return;
      }

      var estimate = Data.buildBookingEstimate(state, values);
      var room = Data.getRoomByKey(state, values.roomType);
      var reference = buildReservationReference();
      var payload = {
        id: 'web-' + Date.now(),
        reference: reference,
        guest: values.guestName,
        roomType: room ? room.short || room.name : values.roomType,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        adults: Number(values.adults),
        children: Number(values.children),
        status: 'pending',
        source: 'Web Sitesi',
        amount: estimate.total,
        subtotal: estimate.subtotal,
        taxAmount: estimate.taxAmount,
        discountAmount: estimate.discountAmount,
        promoCode: values.promoCode || (estimate.promotion ? estimate.promotion.code : ''),
        arrivalTime: values.arrivalTime,
        contactMethod: values.contactMethod,
        email: values.guestEmail,
        phone: values.guestPhone,
        transferRequest: values.transferRequest,
        lateArrival: values.lateArrival,
        note: [
          values.contactMethod ? 'Donus tercihi: ' + values.contactMethod : '',
          values.guestPhone ? 'Telefon: ' + values.guestPhone : '',
          values.guestEmail ? 'E-posta: ' + values.guestEmail : '',
          values.arrivalTime ? 'Varis: ' + values.arrivalTime : '',
          values.transferRequest ? 'Transfer talebi var' : '',
          values.lateArrival ? 'Gec varis notu iletildi' : '',
          values.specialRequest
        ].filter(Boolean).join(' | '),
        submittedAt: new Date().toISOString()
      };

      Data.saveWebReservation(payload);
      console.log('Booking Form Payload:', JSON.stringify(payload, null, 2));
      document.getElementById('bookingStatus').textContent = 'Talebiniz alindi. Referans numaraniz: ' + reference + '. Ekip size en kisa surede donus yapacak.';
      showToast('Rezervasyon talebiniz alindi. Ref: ' + reference);
      setBookingStep(3);
      updateSummary();
    });

    setBookingStep(bookingWizardState.step);
    updateSummary();
  }

  function syncCheckoutMin(checkInInput, checkOutInput, fallbackMin) {
    var min = checkInInput.value ? Data.formatDate(Data.addDays(Data.parseDate(checkInInput.value), 1)) : fallbackMin;
    checkOutInput.min = min;
    if (checkOutInput.value && Data.normalizeDate(Data.parseDate(checkOutInput.value)) < Data.normalizeDate(Data.parseDate(min))) {
      checkOutInput.value = '';
    }
  }

  function initializeBookingWizard() {
    document.querySelectorAll('[data-booking-next]').forEach(function (button) {
      button.addEventListener('click', function () {
        clearErrors();
        var targetStep = Number(button.getAttribute('data-booking-next'));
        var values = collectBookingValues();
        var errors = validateStepValues(targetStep - 1, values);
        if (Object.keys(errors).length) {
          showErrors(errors);
          setBookingStep(getFirstErrorStep(errors));
          return;
        }
        setBookingStep(targetStep);
      });
    });

    document.querySelectorAll('[data-booking-prev]').forEach(function (button) {
      button.addEventListener('click', function () {
        setBookingStep(Number(button.getAttribute('data-booking-prev')));
      });
    });
  }

  function setBookingStep(step) {
    bookingWizardState.step = Math.max(1, Math.min(3, Number(step) || 1));
    document.querySelectorAll('[data-booking-panel]').forEach(function (panel) {
      var panelStep = Number(panel.getAttribute('data-booking-panel'));
      var active = panelStep === bookingWizardState.step;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    document.querySelectorAll('[data-booking-step]').forEach(function (stepCard) {
      var stepIndex = Number(stepCard.getAttribute('data-booking-step'));
      stepCard.classList.toggle('is-active', stepIndex === bookingWizardState.step);
      stepCard.classList.toggle('is-completed', stepIndex < bookingWizardState.step);
    });
  }

  function collectBookingValues() {
    return {
      checkIn: document.getElementById('checkIn').value,
      checkOut: document.getElementById('checkOut').value,
      roomType: document.getElementById('roomType').value,
      adults: document.getElementById('adults').value,
      children: document.getElementById('children').value,
      arrivalTime: document.getElementById('arrivalTime').value,
      promoCode: document.getElementById('promoCode').value.trim(),
      contactMethod: document.getElementById('contactMethod').value,
      guestName: document.getElementById('guestName').value.trim(),
      guestPhone: document.getElementById('guestPhone').value.trim(),
      guestEmail: document.getElementById('guestEmail').value.trim(),
      specialRequest: document.getElementById('specialRequest').value.trim(),
      transferRequest: document.getElementById('transferRequest').checked,
      lateArrival: document.getElementById('lateArrival').checked,
      privacyConsent: document.getElementById('privacyConsent').checked
    };
  }

  function pickErrors(source, keys) {
    return keys.reduce(function (result, key) {
      if (source[key]) result[key] = source[key];
      return result;
    }, {});
  }

  function validateGuestValues(values) {
    var errors = {};
    var phoneDigits = values.guestPhone.replace(/\D/g, '');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.guestName) errors.guestName = 'Ad soyad alanini doldurun.';
    if (!values.guestPhone) errors.guestPhone = 'Telefon numaranizi girin.';
    else if (phoneDigits.length < 10) errors.guestPhone = 'Gecerli bir telefon numarasi girin.';
    if (values.contactMethod === 'E-posta' && !values.guestEmail) errors.guestEmail = 'E-posta ile donus istediginiz icin adres girmelisiniz.';
    else if (values.guestEmail && !emailPattern.test(values.guestEmail)) errors.guestEmail = 'Gecerli bir e-posta adresi girin.';
    if (!values.privacyConsent) errors.privacyConsent = 'Devam etmek icin bilgilendirme onayini verin.';
    return errors;
  }

  function validateStepValues(step, values) {
    var bookingErrors = pickErrors(Data.validateBooking(state, values), ['checkIn', 'checkOut', 'roomType', 'adults', 'children']);
    if (step === 1) return bookingErrors;
    if (step === 2) return validateGuestValues(values);
    return Object.assign({}, bookingErrors, validateGuestValues(values));
  }

  function validateAllBookingValues(values) {
    return Object.assign({}, validateStepValues(1, values), validateStepValues(2, values));
  }

  function clearErrors() {
    ['checkIn', 'checkOut', 'roomType', 'adults', 'children', 'guestName', 'guestPhone', 'guestEmail', 'privacyConsent'].forEach(function (key) {
      var target = document.getElementById(key + '-error');
      if (target) target.textContent = '';
    });
    document.getElementById('bookingStatus').textContent = '';
  }

  function showErrors(errors) {
    var firstKey = Object.keys(errors)[0];
    Object.keys(errors).forEach(function (key) {
      var target = document.getElementById(key + '-error');
      if (target) target.textContent = errors[key];
    });
    var firstField = firstKey ? document.getElementById(firstKey) : null;
    if (firstField && typeof firstField.focus === 'function') firstField.focus();
  }

  function getFirstErrorStep(errors) {
    var keys = Object.keys(errors);
    return keys.some(function (key) { return ['checkIn', 'checkOut', 'roomType', 'adults', 'children'].indexOf(key) >= 0; }) ? 1 : 2;
  }

  function buildReservationReference() {
    var dateToken = Data.formatDate(new Date()).replace(/-/g, '').slice(2);
    return 'MI-' + dateToken + '-' + String(Date.now()).slice(-4);
  }

  function formatSignedMoney(value) {
    var amount = Number(value) || 0;
    if (amount > 0) return '+' + Data.formatMoney(state, amount);
    if (amount < 0) return '-' + Data.formatMoney(state, Math.abs(amount));
    return Data.formatMoney(state, 0);
  }

  function renderReviewLines(lines) {
    return lines.map(function (line) {
      return '<div class="review-line"><span>' + Data.escapeHtml(line.label) + '</span><strong>' + Data.escapeHtml(line.value) + '</strong></div>';
    }).join('');
  }

  function renderNightlyBreakdown(estimate) {
    if (!estimate.nightlyBreakdown.length) {
      return '<div class="summary-empty">Gece bazli fiyat dokumu burada listelenecek.</div>';
    }

    return estimate.nightlyBreakdown.map(function (item) {
      return '<article class="night-row">' +
        '<div><strong>' + Data.escapeHtml(item.label) + '</strong><span>' + Data.escapeHtml(item.weekday) + (item.multiplier !== 1 ? ' | sezon x' + item.multiplier.toFixed(2) : '') + '</span></div>' +
        '<div class="night-row-meta"><span class="status-pill status-' + item.availabilityStatus + '">' + Data.getAvailabilityLabel(item.availabilityStatus) + '</span><strong>' + Data.formatMoney(state, item.total) + '</strong></div>' +
        '</article>';
    }).join('');
  }

  function snapshotBookingState() {
    var form = document.getElementById('bookingForm');
    if (!form) return null;
    var snapshot = collectBookingValues();
    snapshot.step = bookingWizardState.step;
    return snapshot;
  }

  function restoreBookingState(snapshot) {
    if (!snapshot) {
      applyInitialSelection();
      return;
    }

    [
      ['checkIn', snapshot.checkIn],
      ['checkOut', snapshot.checkOut],
      ['roomType', snapshot.roomType],
      ['adults', snapshot.adults],
      ['children', snapshot.children],
      ['arrivalTime', snapshot.arrivalTime],
      ['promoCode', snapshot.promoCode],
      ['contactMethod', snapshot.contactMethod],
      ['guestName', snapshot.guestName],
      ['guestPhone', snapshot.guestPhone],
      ['guestEmail', snapshot.guestEmail],
      ['specialRequest', snapshot.specialRequest]
    ].forEach(function (entry) {
      var field = document.getElementById(entry[0]);
      if (field && typeof entry[1] !== 'undefined') field.value = entry[1];
    });

    [
      ['transferRequest', snapshot.transferRequest],
      ['lateArrival', snapshot.lateArrival],
      ['privacyConsent', snapshot.privacyConsent]
    ].forEach(function (entry) {
      var field = document.getElementById(entry[0]);
      if (field) field.checked = Boolean(entry[1]);
    });

    var mainCheckIn = document.getElementById('checkIn');
    var mainCheckOut = document.getElementById('checkOut');
    if (mainCheckIn && mainCheckOut) syncCheckoutMin(mainCheckIn, mainCheckOut, mainCheckOut.min);
    setBookingStep(snapshot.step || 1);
    updateSummary();
  }

  function refreshStateFromStorage(showNotice) {
    var snapshot = snapshotBookingState();
    state = Data.resolveSiteData();
    galleryItems = Data.getGalleryItems(state);
    galleryState = { category: 'Tumu', currentItems: galleryItems.slice(), currentIndex: 0 };
    mount(snapshot);
    if (showNotice) showToast('Site verileri guncellendi.');
  }

  function updateSummary() {
    var summaryCard = document.getElementById('summaryCard');
    if (!summaryCard) return;
    var values = collectBookingValues();
    var estimate = Data.buildBookingEstimate(state, values);
    var room = estimate.room;
    var adults = Number(values.adults || 0);
    var children = Number(values.children || 0);
    var guestsLabel = adults + ' yetiskin' + (children ? ' + ' + children + ' cocuk' : '');
    var stayLabel = values.checkIn && values.checkOut ? Data.formatShortDate(values.checkIn) + ' - ' + Data.formatShortDate(values.checkOut) : 'Tarih secilmedi';
    var statusClass = 'status-available';
    var statusText = 'Musaitlik bekleniyor';

    if (room) {
      statusText = 'Musait gorunuyor';
      if (estimate.blockedRange) {
        statusClass = 'status-blocked';
        statusText = 'Kapali gun var';
      } else if (estimate.pendingRange) {
        statusClass = 'status-pending';
        statusText = 'Yogun talep';
      } else if (Number(room.availableRooms || 0) <= 2) {
        statusClass = 'status-pending';
        statusText = 'Son ' + room.availableRooms + ' oda';
      }
    }

    document.getElementById('summaryRoomName').textContent = room ? room.name : 'Bir oda secin';
    document.getElementById('summaryNote').textContent = estimate.note;
    document.getElementById('summaryStatus').className = 'status-pill ' + statusClass;
    document.getElementById('summaryStatus').textContent = statusText;
    document.getElementById('summaryGuests').textContent = guestsLabel;
    document.getElementById('summaryDates').textContent = stayLabel;
    document.getElementById('summaryBase').textContent = room ? Data.formatMoney(state, room.nightlyPrice) : Data.formatMoney(state, Data.getStartingPrice(state));
    document.getElementById('summarySeason').textContent = formatSignedMoney(estimate.seasonalAdjustment);
    document.getElementById('summaryNights').textContent = String(estimate.nights);
    document.getElementById('summaryDiscount').textContent = estimate.discountAmount ? '-' + Data.formatMoney(state, estimate.discountAmount) : Data.formatMoney(state, 0);
    document.getElementById('summaryTax').textContent = Data.formatMoney(state, estimate.taxAmount);
    document.getElementById('summaryTotal').textContent = Data.formatMoney(state, estimate.total);
    document.getElementById('summaryBreakdown').innerHTML = renderNightlyBreakdown(estimate);
    document.getElementById('summaryPromotion').textContent = estimate.promoStatus === 'valid'
      ? 'Kod uygulandi: ' + estimate.promotion.code + ' | %' + estimate.promotion.discount + ' avantaj'
      : estimate.promoStatus === 'auto'
      ? 'Web kampanyasi otomatik uygulandi: ' + estimate.promotion.code
      : estimate.promoStatus === 'invalid'
      ? 'Kod taninmadi; standart fiyat gosteriliyor.'
      : 'Aktif kampanya seciminize gore yansitilir.';

    document.getElementById('selectedRoomLabel').textContent = room ? room.name : 'Oda secimi bekleniyor';
    document.getElementById('selectedRoomMeta').textContent = room ? (room.story || room.notes || '') : 'Kapasite, gorunum ve konfor detaylari secime gore burada gorunur.';
    document.getElementById('selectedRoomAvailability').textContent = room ? room.availableRooms + ' / ' + room.totalRooms : '-';
    document.getElementById('selectedRoomCapacity').textContent = room ? room.capacityAdults + ' yetiskin / ' + room.capacityChildren + ' cocuk' : '-';
    document.getElementById('selectedRoomBed').textContent = room ? room.bed : '-';
    document.getElementById('selectedRoomHighlights').textContent = room
      ? ((room.highlights && room.highlights.length ? room.highlights : (room.includes && room.includes.length ? room.includes : [room.amenities])).slice(0, 2).join(' / '))
      : '-';

    document.getElementById('reviewStay').innerHTML = renderReviewLines([
      { label: 'Oda', value: room ? room.name : 'Secilmedi' },
      { label: 'Tarih', value: stayLabel },
      { label: 'Misafir', value: guestsLabel },
      { label: 'Toplam', value: Data.formatMoney(state, estimate.total) }
    ]);
    document.getElementById('reviewGuest').innerHTML = renderReviewLines([
      { label: 'Ad Soyad', value: values.guestName || 'Bekleniyor' },
      { label: 'Telefon', value: values.guestPhone || 'Bekleniyor' },
      { label: 'E-posta', value: values.guestEmail || 'Opsiyonel' },
      { label: 'Donus Tercihi', value: values.contactMethod || 'Telefon' }
    ]);
    document.getElementById('reviewPolicy').innerHTML = renderReviewLines([
      { label: 'Varis', value: values.arrivalTime || 'Bildirilmedi' },
      { label: 'Transfer', value: values.transferRequest ? 'Talep edildi' : 'Yok' },
      { label: 'Gec varis', value: values.lateArrival ? 'Bilgilendirildi' : 'Standart' },
      { label: 'Onay', value: values.privacyConsent ? 'Tamamlandi' : 'Bekleniyor' }
    ]);
  }

  function applyInitialSelection() {
    var params = new URLSearchParams(window.location.search);
    var room = params.get('room');
    var checkIn = params.get('checkIn');
    var checkOut = params.get('checkOut');
    var mainCheckIn = document.getElementById('checkIn');
    var mainCheckOut = document.getElementById('checkOut');
    var quickCheckIn = document.getElementById('quickCheckIn');
    var quickCheckOut = document.getElementById('quickCheckOut');
    if (room) {
      var roomField = document.getElementById('roomType');
      var quickRoom = document.getElementById('quickRoomType');
      if (roomField) roomField.value = room;
      if (quickRoom) quickRoom.value = room;
    }
    if (checkIn) {
      if (mainCheckIn) mainCheckIn.value = checkIn;
      if (quickCheckIn) quickCheckIn.value = checkIn;
    }
    if (checkOut) {
      if (mainCheckOut) mainCheckOut.value = checkOut;
      if (quickCheckOut) quickCheckOut.value = checkOut;
    }
    if (mainCheckIn && mainCheckOut) {
      syncCheckoutMin(mainCheckIn, mainCheckOut, mainCheckOut.min);
    }
    if (quickCheckIn && quickCheckOut) {
      syncCheckoutMin(quickCheckIn, quickCheckOut, quickCheckOut.min);
    }
    updateSummary();
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

  function initializeRevealAnimations() {
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.section-header, .hero-copy > *, .hero-aside, .hero-collector-card, .detail-card, .story-card, .value-prop, .room-card, .feature-card, .editorial-card, .booking-shell, .booking-sidebar > *, .gallery-card, .review-card, .faq-item'
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
      mount();
    } catch (error) {
      console.error(error);
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Site yuklenirken bir hata olustu. Lutfen sayfayi yenileyin.</div>';
    }
  });

  window.addEventListener('storage', function (event) {
    if (event.key === Data.storageKey) {
      refreshStateFromStorage(true);
    }
  });
})();

