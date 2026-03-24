(function () {
  var Data = window.MaviInciData;
  var Shell = window.MaviInciShell;
  if (!Data || !Shell) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Site cekirdek dosyalari yuklenemedi.</div>';
    return;
  }

  var state = Data.resolveSiteData();
  var galleryItems = Data.getGalleryItems(state);
  var testimonials = [
    { score: '9.6/10', title: 'Sakin ama ciddi derecede ozenli', text: 'Sahile yakinlik kadar hizmet ritmi de etkileyiciydi; her sey dusunulmus ve acele hissi yoktu.', guest: 'Elif & Can' },
    { score: 'Muthis', title: 'Tatil temposunu hemen degistiriyor', text: 'Mavi beyaz tasarim, sessiz kat akisi ve kahvalti duzeni otelin karakterini ilk gunden hissettiriyor.', guest: 'Murat D.' },
    { score: 'Tekrar geliriz', title: 'Kucuk olcekli ama premium hissi guclu', text: 'Karsilama, oda temizligi ve manzara secimi bir araya geldiginde daha ust segment bir deneyim cikiyor.', guest: 'Yildiz Ailesi' }
  ];

  function renderHomeHero() {
    var promo = Data.getPrimaryPromotion(state);
    var previewRooms = Data.getFeaturedRooms(state).slice(0, 3);
    return '<section class="hero hero-home" id="anasayfa"><div class="container hero-grid"><div class="hero-copy"><div class="hero-prelude"><span class="hero-chip">Mavi / Beyaz / Erdek Sahili</span><span class="hero-rule"></span><span class="hero-annotation">Sahil sessizligi, rafine servis ve ozenli mekan dili tek ritimde bulusuyor</span></div><p class="kicker">Erdek kiyisinda kisisel olcekte ama ust segment hissi guclu bir butik konaklama</p><h1 class="hero-title">' + Data.escapeHtml(state.hotel.name) + '</h1><p class="hero-text">' + Data.escapeHtml(state.content.heroText) + ' ' + Data.escapeHtml(state.hotel.description) + '</p><div class="hero-ribbon-row">' + state.content.highlights.slice(0, 4).map(function (item) { return '<span class="hero-ribbon">' + Data.escapeHtml(item) + '</span>'; }).join('') + '</div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Direkt Rezervasyon Talebi</a><a class="button button-secondary" href="' + Shell.pageHref('rooms') + '">Oda Koleksiyonunu Incele</a></div><div class="hero-signature-grid"><article class="hero-signature-card"><span>Direkt Hattiniz</span><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong></article><article class="hero-signature-card"><span>Kahvalti Akisi</span><strong>' + Data.escapeHtml(state.hotel.breakfastHours) + '</strong></article><article class="hero-signature-card"><span>Baslangic Fiyati</span><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong></article></div><div class="hero-meta"><article class="detail-card"><h3>Otelin karakteri</h3><ul class="detail-list"><li>Butik olcekte daha hizli ve kisilestirilmis servis</li><li>Sahil ritmine yakin ama yorucu olmayan bir tempo</li><li>Mavi beyaz tonlarda ferah ve dengeli bir mekan dili</li><li>Direkt rezervasyonla daha net fiyat ve iletisim akisi</li></ul></article><article class="detail-card"><h3>Konaklama koleksiyonundan secmeler</h3><div class="availability-list">' + previewRooms.map(function (room) { return '<div class="availability-item"><div><strong>' + Data.escapeHtml(room.name) + '</strong><span>' + Data.escapeHtml(room.view) + ' | ' + Data.escapeHtml(room.size) + '</span></div><span class="status-pill status-available">' + Data.formatMoney(state, room.nightlyPrice) + '</span></div>'; }).join('') + '</div></article></div></div><aside class="hero-aside"><div class="reservation-office-card"><div class="quick-booking-topline"><span class="quick-booking-badge">Direkt Rezervasyon Ofisi</span><span class="quick-booking-badge muted-badge">' + (promo ? '%' + promo.discount + ' web avantaji' : 'Hizli geri donus') + '</span></div><p class="card-kicker">Rezervasyon Konsiyerji</p><h2>Planlamayi daha profesyonel bir akisa tasiyin</h2><p class="quick-booking-note">Tarih, oda tercihi ve ozel taleplerinizi ayri rezervasyon sayfasinda paylasin. Ekip size telefon veya WhatsApp uzerinden hizla donus yapsin.</p><div class="reservation-office-meta"><div class="summary-line"><span>Telefon</span><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong></div><div class="summary-line"><span>WhatsApp</span><strong>' + Data.escapeHtml(state.hotel.whatsappNumber) + '</strong></div><div class="summary-line"><span>Check-in</span><strong>' + Data.escapeHtml(state.hotel.checkInTime) + '</strong></div><div class="summary-line"><span>Check-out</span><strong>' + Data.escapeHtml(state.hotel.checkOutTime) + '</strong></div></div><div class="reservation-office-actions"><a class="button button-dark" href="' + Shell.pageHref('booking') + '">Rezervasyon Sayfasina Gec</a><a class="button button-soft" href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp ile Yaz</a></div></div></aside></div><div class="container hero-collector"><div class="hero-collector-card"><span>Otel Hikayesi</span><strong>Sade, iyi olculmus ve denize yakin bir yasam hissi; bu yuzden ilk sayfa tamamen otelin atmosferini anlatir.</strong></div><div class="hero-collector-card"><span>Konaklama Yaklasimi</span><strong>Odalar, deneyimler ve rezervasyon adimi artik ayri sayfalarda; karar vermek daha net ve daha premium hissettirir.</strong></div><div class="hero-collector-card"><span>Direkt Iletisim</span><strong>Telefon ve WhatsApp hattiniz tek numaraya bagli; ' + Data.escapeHtml(state.hotel.phone) + ' uzerinden hizli geri donus verilir.</strong></div></div></section>';
  }

  function renderBrandStory() {
    return '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Marka Dili</p><h2>Denize bakan degil, denizle dogru iliski kuran bir butik otel</h2><p class="story-copy">' + Data.escapeHtml(state.hotel.description) + ' Mavi Inci Park Otel, kalabalik yaz otellerinin hizli ritmi yerine daha kisilestirilmis, daha net ve daha sakin bir konaklama duzeni sunmak icin kurgulandi.</p><ul class="highlight-list"><li>Sade ama ust segment hissi guclu mekan dili</li><li>Kucuk olcekte daha dikkatli servis koordinasyonu</li><li>Direkt rezervasyonda daha hizli karar ve iletisim akisi</li><li>Gunun ritmine gore yavaslayan kahvalti ve sahil deneyimi</li></ul></article><div class="value-stack"><article class="value-prop"><h3>Konum Dili</h3><p>Erdek sahiline yakin konum, gunu plaj ve otel arasinda dogal bir tempoda gecirmenizi saglar.</p></article><article class="value-prop"><h3>Tasarim Dili</h3><p>Mavi, beyaz ve kirik kum tonlari ile daha hafif, daha ferah ve fotografik bir atmosfer kuruldu.</p></article><article class="value-prop"><h3>Servis Dili</h3><p>Butik olcegin getirdigi avantajla kararsiz kalinan noktalarda daha hizli yonlendirme ve daha net geri donus saglanir.</p></article></div></div></section>';
  }

  function renderStayPreviewCard(room, index) {
    var media = Data.getRoomGallery(state, room.id)[0] || galleryItems[index] || null;
    return '<article class="stay-preview-card"><a class="room-media room-media-link" href="' + Shell.roomHref(room) + '">' + Shell.renderMedia(media, room.name, { loading: 'lazy', fetchPriority: 'low' }) + '</a><div class="stay-preview-body"><div class="room-header"><div><span class="tag">' + Data.escapeHtml(room.short || room.name) + '</span><h3>' + Data.escapeHtml(room.name) + '</h3></div><div class="room-price"><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong><span>/ gece</span></div></div><p>' + Data.escapeHtml(room.notes || room.story || '') + '</p><div class="stay-preview-meta"><span>' + Data.escapeHtml(room.view) + '</span><span>' + Data.escapeHtml(room.size) + '</span><span>' + room.capacityAdults + ' yetiskin' + (Number(room.capacityChildren || 0) ? ' + ' + room.capacityChildren + ' cocuk' : '') + '</span></div><div class="room-actions"><a class="button button-dark" href="' + Shell.roomHref(room) + '">Oda Detayi</a><a class="button button-soft" href="' + Shell.bookingHref(room) + '">Bu Odayi Ayir</a></div></div></article>';
  }

  function renderStayPreview() {
    var rooms = Data.getFeaturedRooms(state).slice(0, 3);
    return '<section class="section section-light section-stay-preview"><div class="container"><div class="section-header"><p class="section-kicker">Konaklama Koleksiyonu</p><h2 class="section-title">Tum oda tipleri ayri bir sayfada, ama ilk izlenim burada basliyor</h2><p class="section-text">Odalar artik asagi kayan ana sayfada degil; kendi sayfasinda listeleniyor. Burada ise koleksiyonun tonunu veren secili odalari goruyorsunuz.</p></div><div class="stay-preview-grid">' + rooms.map(renderStayPreviewCard).join('') + '</div><div class="section-cta-row"><a class="button button-primary" href="' + Shell.pageHref('rooms') + '">Tum Odalar Sayfasini Ac</a><a class="button button-secondary" href="' + Shell.pageHref('booking') + '">Rezervasyon Sayfasina Gec</a></div></div></section>';
  }

  function renderServicePreview() {
    var blocks = [
      { title: 'Yavas Kahvalti', text: 'Sabah saatlerini acele ettirmeyen, uzun oturuslara izin veren bir kahvalti ritmi.', stat: state.hotel.breakfastHours },
      { title: 'Sahil ve Gun Batimi', text: 'Plaj, teras ve aksam saatleri etrafinda kurulmus daha dingin bir gun akisi.', stat: state.hotel.beachService ? 'Sahil servisi var' : 'Sahil ritmi yakin' },
      { title: 'Ulasim ve Karsilama', text: 'Varis oncesi iletisim, transfer notlari ve check-in planlamasi ile daha net operasyon.', stat: state.hotel.airportTransfer ? 'Transfer notu alinabilir' : 'Pratik check-in' }
    ];
    return '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Otel Deneyimi</p><h2 class="section-title">Dunyanin iyi otel sitelerinde gordugunuz netlik burada da var</h2><p class="section-text">Gucu yalnizca fotografla degil, hizmet basliklarini okunur bicimde gosteren bir ana sayfa kurguladik: konaklama, deneyim, iletisim ve rezervasyon kendi yerinde duruyor.</p></div><div class="features-grid">' + blocks.map(function (item, index) { return '<article class="feature-card"><div class="feature-icon">0' + (index + 1) + '</div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><div class="feature-stat">' + Data.escapeHtml(item.stat) + '</div></article>'; }).join('') + '</div></div></section>';
  }

  function renderDestinationSection() {
    var cards = [
      { title: 'Gun Dogumu Yurumeleri', text: 'Sahilde gunun erken saatlerinde kalabalik olusmadan once daha dingin bir baslangic.', action: 'Sahil ritmine 5 dakika' },
      { title: 'Yavas Ogleden Sonralar', text: 'Odadan terasa, terastan sahile gecen rahat bir otel gunu icin tasarlanan sakin akis.', action: 'Mekanlar arasi yumusak gecis' },
      { title: 'Aksam Terasi', text: 'Gun batimina yakin saatlerde otelin tonunu en iyi hissettiren ortak alan deneyimi.', action: 'Gun batimi odakli atmosfer' }
    ];
    return '<section class="section section-light section-destination"><div class="container"><div class="section-header"><p class="section-kicker">Erdek Ruhu</p><h2 class="section-title">Ilk sayfa, yalnizca oteli ve otelin yasam ritmini anlatsin diye yeniden kuruldu</h2><p class="section-text">Asagi indikce kaybolan bir sayfa yerine, ilk sayfada otelin karakterini anlatan daha secici ve daha yavas bir kurgu olusturduk.</p></div><div class="destination-grid">' + cards.map(function (item) { return '<article class="destination-card"><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><span>' + Data.escapeHtml(item.action) + '</span></article>'; }).join('') + '</div></div></section>';
  }

  function renderTrustSection() {
    return '<section class="section section-light" id="iletisim"><div class="container contact-grid"><div><div class="section-header"><p class="section-kicker">Misafir Gorusleri</p><h2 class="section-title">Iyi ilk izlenim, guvenle tamamlanmali</h2><p class="section-text">Luks otel sitelerinde karar anini guclendiren sey yalnizca tasarim degil; misafirin otelin nasil bir his biraktigini anlamasidir.</p></div><div class="reviews-grid">' + testimonials.map(function (item) { return '<article class="review-card"><div class="review-score">' + Data.escapeHtml(item.score) + '</div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><span class="tag">' + Data.escapeHtml(item.guest) + '</span></article>'; }).join('') + '</div></div><div class="info-stack"><article class="contact-card"><p class="section-kicker">Direkt Iletisim</p><h3>Rezervasyon ofisi ve otel bilgileri</h3><p>' + Data.escapeHtml(state.hotel.address) + '</p><p><a class="contact-link" href="tel:' + Data.escapeHtml(state.hotel.phone) + '">' + Data.escapeHtml(state.hotel.phone) + '</a></p><p><a class="contact-link" href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp: ' + Data.escapeHtml(state.hotel.whatsappNumber) + '</a></p><p><a class="contact-link" href="mailto:' + Data.escapeHtml(state.hotel.email) + '">' + Data.escapeHtml(state.hotel.email) + '</a></p><p>Instagram: ' + Data.escapeHtml(state.hotel.instagram) + '</p></article><article class="contact-card"><p class="section-kicker">Hizli Yonlendirme</p><h3>Bir sonraki adim</h3><div class="footer-links"><a href="' + Shell.pageHref('rooms') + '">Odalar sayfasina gec</a><a href="' + Shell.pageHref('experiences') + '">Deneyimler ve teklifler</a><a href="' + Shell.pageHref('booking') + '">Rezervasyon formunu doldur</a><a href="' + Shell.roomHref(Data.getFeaturedRooms(state)[0]) + '">Ornek oda detay sayfasi</a></div></article></div></div></section>';
  }

  function renderApp() {
    return '<div class="shell">' +
      Shell.renderTopStrip(state) +
      Shell.renderHeader(state, 'home') +
      '<main>' + renderHomeHero() + renderBrandStory() + renderStayPreview() + renderServicePreview() + renderDestinationSection() + renderTrustSection() + '</main>' +
      Shell.renderFooter(state, 'home') +
      Shell.renderFloatingActions(state, { primaryHref: Shell.pageHref('booking'), primaryTitle: 'Rezervasyon', primaryLabel: 'Sayfaya Gec', secondaryLabel: 'WhatsApp ile Yaz' }) +
      '</div>';
  }

  function mount() {
    Shell.updateMeta(state, {
      title: state.hotel.name + ' | Erdek Butik Otel',
      description: 'Mavi Inci Park Otel ana sayfasi, otelin karakteri, servis dili ve direkt rezervasyon deneyimini premium bir duzenle sunar.',
      canonical: Data.getSiteUrl(state, '/'),
      keywords: ['Mavi Inci Park Otel', 'Erdek butik otel', 'Balikesir sahil oteli', 'direkt rezervasyon otel', 'Erdek deniz oteli']
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
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Ana sayfa yuklenirken bir hata olustu.</div>';
    }
  });
})();
