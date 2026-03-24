(function () {
  var Data = window.MaviInciData;
  var Shell = window.MaviInciShell;
  if (!Data || !Shell) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Sayfa cekirdek dosyalari yuklenemedi.</div>';
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
    if (!room) return 'Dengeli sahil konaklamasi';
    if (room.id === 'tek-kisilik') return 'Solo konaklama ve kisa is seyahati';
    if (room.id === 'deniz-manzarali-delux') return 'Gun batimi odakli cift kacamaklari';
    if (room.id === 'sultan-keyfi') return 'Ozel gunler ve premium konaklama';
    if (room.id === 'standart-buyuk') return 'Aileler ve daha genis yasam ritmi';
    return 'Sahil ritmine dengeli bir giris';
  }

  function renderPageHero() {
    return '<section class="page-hero page-hero-rooms"><div class="container page-hero-grid"><div class="page-hero-copy"><div class="hero-prelude"><span class="hero-chip">Oda Koleksiyonu</span><span class="hero-rule"></span><span class="hero-annotation">Her oda tipi artik kendi sayfa mantiginda, daha net bir secim akisiyle sunuluyor</span></div><p class="kicker">Odalar sayfasi</p><h1 class="hero-title room-page-title">Mavi Inci Park Otel oda secenekleri</h1><p class="hero-text">Odalar artik asagi kayan ana sayfa bolumu degil; karsilastirabileceginiz, birbirinden ayirabileceginiz ve oda detayina gecebildiginiz ayri bir sayfa deneyimi olarak kurgulandi.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Rezervasyon Sayfasina Gec</a><a class="button button-secondary" href="#oda-karsilastirma">Karsilastirmayi Incele</a></div><div class="hero-signature-grid"><article class="hero-signature-card"><span>Toplam Oda</span><strong>' + Data.getActiveRooms(state).length + ' tip</strong></article><article class="hero-signature-card"><span>Musait Stok</span><strong>' + Data.getTotalAvailableRooms(state) + ' oda</strong></article><article class="hero-signature-card"><span>Baslangic</span><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong></article></div></div><aside class="page-hero-aside"><article class="contact-card"><p class="section-kicker">Secim Rehberi</p><h3>Oda secimini daha hizli yapin</h3><div class="summary-line"><span>Standart</span><strong>Dengeli fiyat / ferah atmosfer</strong></div><div class="summary-line"><span>Standart Buyuk</span><strong>Aile ve daha rahat plan</strong></div><div class="summary-line"><span>Delux</span><strong>Manzara ve balkon odagi</strong></div><div class="summary-line"><span>Sultan Keyfi</span><strong>Premium his ve ozel gunler</strong></div><div class="summary-line"><span>Tek Kisilik</span><strong>Solo seyahat ve sade konfor</strong></div></article></aside></div></section>';
  }

  function renderRoomCard(room, index) {
    var media = Data.getRoomGallery(state, room.id)[0] || galleryItems[index] || null;
    return '<article class="room-card"><a class="room-media room-media-link" href="' + Shell.roomHref(room) + '">' + Shell.renderMedia(media, room.name, { loading: 'lazy', fetchPriority: 'low' }) + '</a><div class="room-header"><div><span class="tag">' + (Number(room.availableRooms) > 0 ? room.availableRooms + ' oda musait' : 'Bekleme listesi') + '</span><h3>' + Data.escapeHtml(room.name) + '</h3></div><div class="room-price"><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong><span>/ gece</span></div></div><p class="room-meta">' + Data.escapeHtml(room.notes || room.story || '') + '</p><ul class="room-specs"><li>' + Data.escapeHtml(room.amenities) + '</li><li>' + Data.escapeHtml(room.view) + ' | ' + Data.escapeHtml(room.size) + '</li><li>' + Data.escapeHtml(roomCapacityLabel(room)) + '</li></ul><div class="room-actions"><a class="button button-dark" href="' + Shell.roomHref(room) + '">Detayli Incele</a><a class="button button-soft" href="' + Shell.bookingHref(room) + '">Bu Odayi Ayir</a></div></article>';
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

    return '<section class="section section-light section-compare" id="oda-karsilastirma"><div class="container"><div class="section-header"><p class="section-kicker">Oda Karsilastirma</p><h2 class="section-title">Tum oda tiplerini ayni satirda gorun</h2><p class="section-text">Dunyanin iyi otel sitelerinde odalar sadece listelenmez; fiyat, gorunum ve yasam alani birlikte okunur. Bu sayfa da tam olarak bunun icin tasarlandi.</p></div><div class="compare-highlights">' +
      renderComparisonSpotlight('En avantajli giris', lowest, Data.formatMoney(state, lowest.nightlyPrice) + ' ile koleksiyona dengeli bir baslangic') +
      renderComparisonSpotlight('En genis yasam alani', largest, largest.size + ' ile daha uzun ve rahat konaklama hissi') +
      renderComparisonSpotlight('En guclu manzara secimi', seaView, seaView.view + ' ile deneyimi sahile dogru acar') +
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
    return '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Tum Oda Tipleri</p><h2 class="section-title">Detay sayfalariyla birlikte tam oda koleksiyonu</h2><p class="section-text">Her oda karti artik kendi oda detay sayfasina gider; karar asamasi daha net, daha kurumsal ve daha premium hissedilir.</p></div><div class="rooms-grid">' + Data.getActiveRooms(state).map(renderRoomCard).join('') + '</div></div></section>';
  }

  function renderRoomGuide() {
    return '<section class="section section-dark"><div class="container editorial-layout"><article class="editorial-card"><p class="section-kicker">Secim Notlari</p><h2 class="editorial-title">Hangi odadan baslamali?</h2><ul class="booking-bullets"><li>Daha dengeli fiyat ve ferahlik icin Standart Oda</li><li>Aile veya daha genis yasam icin Standart Buyuk Oda</li><li>Manzara odakli kacamak icin Deniz Manzarali Delux Oda</li><li>Premium his ve ozel gunler icin Sultan Keyfi Oda</li><li>Solo seyahat icin Tek Kisilik Oda</li></ul></article><article class="editorial-card"><p class="section-kicker">Direkt Rezervasyon</p><h2 class="editorial-title">Oda seciminden sonra tek adimda rezervasyona gecin</h2><p>Her oda kartindan rezervasyon sayfasina dogrudan gecis sagladik. Oda bilgisi secili gelir; tarih ve misafir detaylarini ekleyip talebinizi daha hizli iletebilirsiniz.</p><div class="inline-stats"><div class="inline-stat"><strong>' + Data.getTotalAvailableRooms(state) + '</strong><span>musait oda</span></div><div class="inline-stat"><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong><span>baslangic fiyat</span></div><div class="inline-stat"><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong><span>rezervasyon hatti</span></div></div></article></div></section>';
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
      description: 'Standart, Standart Buyuk, Deniz Manzarali Delux, Sultan Keyfi ve Tek Kisilik oda tiplerini karsilastirabileceginiz oda koleksiyonu sayfasi.',
      canonical: Data.getSiteUrl(state, '/odalar.html'),
      keywords: ['Mavi Inci Park Otel odalar', 'Erdek otel oda secenekleri', 'butik otel oda karsilastirma', 'deniz manzarali oda Erdek']
    });
    document.getElementById('root').innerHTML = renderApp();
    Shell.initializeNavigation();
    Shell.initializeRevealAnimations();
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      mount();
    } catch (error) {
      console.error(error);
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Odalar sayfasi yuklenirken bir hata olustu.</div>';
    }
  });
})();
