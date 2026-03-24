(function () {
  var Boot = window.MaviInciBoot;
  var Data = window.MaviInciData;
  var Shell = window.MaviInciShell;
  if (!Data || !Shell) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Sayfa cekirdek dosyalari yuklenemedi.</div>';
    if (Boot && typeof Boot.fail === 'function') Boot.fail('Odalar sayfasi cekirdek dosyalari yuklenemedi.');
    return;
  }

  var state = Data.resolveSiteData();
  var galleryItems = Data.getGalleryItems(state);

  function roomSizeValue(room) {
    var match = String((room || {}).size || '').match(/(\d+(?:[.,]\d+)?)/);
    return match ? parseFloat(match[1].replace(',', '.')) : 0;
  }

  function roomCapacityLabel(room) {
    return room.capacityAdults + ' yetiskin' + (Number(room.capacityChildren || 0) > 0 ? ' + ' + room.capacityChildren + ' cocuk' : '');
  }

  function roomGuestFit(room) {
    if (!room) return 'Dengeli sehir ve sahil konaklamasi';
    if (room.id === 'tek-kisilik') return 'Tek basina seyahat ve is odakli konaklama';
    if (room.id === 'deniz-manzarali-delux') return 'Manzara odakli ozel konaklama';
    if (room.id === 'sultan-keyfi') return 'Premium beklentiler ve ozel gunler';
    if (room.id === 'standart-buyuk') return 'Aileler ve daha genis yasam alani';
    return 'Merkezi konumda dengeli konaklama';
  }

  function renderPageHero() {
    return '<section class="page-hero page-hero-rooms"><div class="container page-hero-grid"><div class="page-hero-copy"><div class="hero-prelude"><span class="hero-chip">Oda Koleksiyonu</span><span class="hero-rule"></span><span class="hero-annotation">Her oda tipi kendi detay sayfasiyla daha net bir secim deneyimi sunuyor</span></div><p class="kicker">Odalarimiz</p><h1 class="hero-title room-page-title">Mavi Inci Park Otel Oda Koleksiyonu</h1><p class="hero-text">Farkli konaklama beklentilerine uygun oda tiplerimizi; temizlik, modern donanim ve konfor odagiyla tek bir sayfada inceleyebilirsiniz. Her oda, misafir ihtiyacina gore profesyonel bir dille tanitilir.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Rezervasyon Sayfasina Gec</a><a class="button button-secondary" href="#oda-karsilastirma">Karsilastirmayi Incele</a></div><div class="hero-signature-grid"><article class="hero-signature-card"><span>Oda Tipi</span><strong>' + Data.getActiveRooms(state).length + ' secenek</strong></article><article class="hero-signature-card"><span>Musait Stok</span><strong>' + Data.getTotalAvailableRooms(state) + ' oda</strong></article><article class="hero-signature-card"><span>Baslangic</span><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong></article></div></div><aside class="page-hero-aside"><article class="contact-card"><p class="section-kicker">Secim Rehberi</p><h3>Size uygun oda tipini kolayca belirleyin</h3><div class="summary-line"><span>Standart</span><strong>Dengeli fiyat ve ferah atmosfer</strong></div><div class="summary-line"><span>Standart Buyuk</span><strong>Aileler icin daha genis alan</strong></div><div class="summary-line"><span>Delux</span><strong>Manzara ve balkon ayricaligi</strong></div><div class="summary-line"><span>Sultan Keyfi</span><strong>Yuksek konfor ve premium his</strong></div><div class="summary-line"><span>Tek Kisilik</span><strong>Solo seyahat icin verimli duzen</strong></div></article></aside></div></section>';
  }

  function renderRoomCard(room, index) {
    var media = Data.getRoomGallery(state, room.id)[0] || galleryItems[index] || null;
    return '<article class="room-card"><a class="room-media room-media-link" href="' + Shell.roomHref(room) + '">' + Shell.renderMedia(media, room.name, { loading: 'lazy', fetchPriority: 'low' }) + '</a><div class="room-header"><div><span class="tag">' + (Number(room.availableRooms) > 0 ? room.availableRooms + ' oda musait' : 'Bekleme listesi') + '</span><h3>' + Data.escapeHtml(room.name) + '</h3></div><div class="room-price"><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong><span>/ gece</span></div></div><p class="room-meta">' + Data.escapeHtml(room.notes || room.story || '') + '</p><ul class="room-specs"><li>' + Data.escapeHtml(room.amenities) + '</li><li>' + Data.escapeHtml(room.view) + ' | ' + Data.escapeHtml(room.size) + '</li><li>' + Data.escapeHtml(roomCapacityLabel(room)) + '</li></ul><div class="room-actions"><a class="button button-dark" href="' + Shell.roomHref(room) + '">Detaylari Incele</a><a class="button button-soft" href="' + Shell.bookingHref(room) + '">Rezervasyon Yap</a></div></article>';
  }

  function renderComparisonSpotlight(label, room, detail) {
    return '<article class="comparison-spotlight"><span>' + Data.escapeHtml(label) + '</span><strong>' + Data.escapeHtml(room.name) + '</strong><p>' + Data.escapeHtml(detail) + '</p></article>';
  }

  function renderRoomComparison() {
    var rooms = Data.getActiveRooms(state);
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
      { label: 'Misafir profili', render: function (room) { return Data.escapeHtml(roomGuestFit(room)); } },
      { label: 'Musaitlik', render: function (room) { return Number(room.availableRooms || 0) > 0 ? room.availableRooms + ' oda musait' : 'Bekleme listesi'; } }
    ];

    return '<section class="section section-light section-compare" id="oda-karsilastirma"><div class="container"><div class="section-header"><p class="section-kicker">Oda Karsilastirma</p><h2 class="section-title">Tum oda tiplerini karsilastirarak karar verin</h2><p class="section-text">Fiyat, boyut, kapasite ve gorunum bilgilerini ayni tabloda sunarak karar surecini kolaylastiriyoruz. Boylece ihtiyaciniza en uygun oda tipini daha rahat belirleyebilirsiniz.</p></div><div class="compare-highlights">' +
      renderComparisonSpotlight('En avantajli giris', lowest, Data.formatMoney(state, lowest.nightlyPrice) + ' ile dengeli bir baslangic secenegi') +
      renderComparisonSpotlight('En genis yasam alani', largest, largest.size + ' ile daha rahat ve uzun konaklama hissi') +
      renderComparisonSpotlight('En guclu manzara secimi', seaView, seaView.view + ' ile manzara odakli konaklama avantaji') +
      '</div><div class="comparison-table-shell"><table class="comparison-table"><thead><tr><th scope="col">Kriter</th>' +
      rooms.map(function (room) {
        return '<th scope="col"><div class="comparison-room-head"><span class="comparison-room-tag">' + Data.escapeHtml(room.short || room.name) + '</span><strong>' + Data.escapeHtml(room.name) + '</strong><span>' + Data.formatMoney(state, room.nightlyPrice) + ' / gece</span></div></th>';
      }).join('') +
      '</tr></thead><tbody>' +
      rows.map(function (row) {
        return '<tr><th scope="row">' + Data.escapeHtml(row.label) + '</th>' + rooms.map(function (room) { return '<td>' + row.render(room) + '</td>'; }).join('') + '</tr>';
      }).join('') +
      '</tbody></table></div></div></section>';
  }

  function renderRoomGridSection() {
    return '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Tum Oda Tipleri</p><h2 class="section-title">Modern ve bakimli oda seceneklerimiz</h2><p class="section-text">Odalarimizi temiz, islevsel ve konforlu bir konaklama standardi sunacak sekilde hazirliyoruz. Her karttan oda detayina gecebilir, size uygun secenek icin rezervasyon talebi olusturabilirsiniz.</p></div><div class="rooms-grid">' + Data.getActiveRooms(state).map(renderRoomCard).join('') + '</div></div></section>';
  }

  function renderRoomGuide() {
    return '<section class="section section-dark"><div class="container editorial-layout"><article class="editorial-card"><p class="section-kicker">Secim Notlari</p><h2 class="editorial-title">Hangi odadan baslamalisiniz?</h2><ul class="booking-bullets"><li>Dengeli fiyat ve ferah atmosfer icin Standart Oda</li><li>Aile konaklamasi ve ek alan icin Standart Buyuk Oda</li><li>Manzara odakli daha ozel bir deneyim icin Deniz Manzarali Delux Oda</li><li>Yuksek konfor beklentisi icin Sultan Keyfi Oda</li><li>Tek basina seyahatlerde sade ve islevsel plan icin Tek Kisilik Oda</li></ul></article><article class="editorial-card"><p class="section-kicker">Direkt Rezervasyon</p><h2 class="editorial-title">Oda seciminden sonra rezervasyonunuzu hizla tamamlayin</h2><p>Her oda kartindan rezervasyon sayfasina dogrudan gecis sagladik. Oda bilgisi secili gelir; tarih ve misafir detaylarini ekleyerek talebinizi otel ekibimize kolayca iletebilirsiniz.</p><div class="inline-stats"><div class="inline-stat"><strong>' + Data.getTotalAvailableRooms(state) + '</strong><span>musait oda</span></div><div class="inline-stat"><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong><span>baslangic fiyat</span></div><div class="inline-stat"><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong><span>rezervasyon hatti</span></div></div></article></div></section>';
  }

  function renderApp() {
    return '<div class="shell">' +
      Shell.renderTopStrip(state) +
      Shell.renderHeader(state, 'rooms') +
      '<main>' + renderPageHero() + renderRoomComparison() + renderRoomGridSection() + renderRoomGuide() + '</main>' +
      Shell.renderFooter(state, 'rooms') +
      Shell.renderFloatingActions(state, { primaryHref: Shell.pageHref('booking'), primaryTitle: 'Rezervasyon', primaryLabel: 'Oda Secerek Devam Et', secondaryLabel: 'Oda Icin Yaz' }) +
      '</div>';
  }

  function mount() {
    Shell.updateMeta(state, {
      title: state.hotel.name + ' | Oda Koleksiyonu',
      description: 'Standart, Standart Buyuk, Deniz Manzarali Delux, Sultan Keyfi ve Tek Kisilik oda tiplerini profesyonel aciklamalarla inceleyebileceginiz oda koleksiyonu sayfasi.',
      canonical: Data.getSiteUrl(state, '/odalar.html'),
      keywords: ['Mavi Inci Park Otel odalar', 'Erdek otel oda secenekleri', 'butik otel oda karsilastirma', 'deniz manzarali oda Erdek']
    });
    document.getElementById('root').innerHTML = renderApp();
    Shell.initializeNavigation();
    Shell.initializeRevealAnimations();
    if (Boot && typeof Boot.markMounted === 'function') Boot.markMounted();
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      mount();
    } catch (error) {
      console.error(error);
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Odalar sayfasi yuklenirken bir hata olustu.</div>';
      if (Boot && typeof Boot.fail === 'function') Boot.fail('Odalar sayfasi yuklenirken teknik bir sorun olustu.');
    }
  });
})();
