(function () {
  var Boot = window.MaviInciBoot;
  var Data = window.MaviInciData;
  var Shell = window.MaviInciShell;
  if (!Data || !Shell) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Site cekirdek dosyalari yuklenemedi.</div>';
    if (Boot && typeof Boot.fail === 'function') Boot.fail('Ana sayfa cekirdek dosyalari yuklenemedi.');
    return;
  }

  var state = Data.resolveSiteData();
  var galleryItems = Data.getGalleryItems(state);
  var testimonials = [
    { score: '9.6/10', title: 'Duzenli ve guven veren hizmet', text: 'Merkezi konum, oda temizligi ve hizli geri donus sureci bir araya geldiginde son derece rahat bir konaklama deneyimi yasadik.', guest: 'Elif & Can' },
    { score: 'Muthis', title: 'Konfor ve sakinlik dengesi guclu', text: 'Mavi beyaz tasarim, kahvalti duzeni ve genel atmosfer otelin profesyonel cizgisini ilk andan itibaren hissettiriyor.', guest: 'Murat D.' },
    { score: 'Tekrar geliriz', title: 'Butik olcekte yuksek memnuniyet', text: 'Karsilama, oda duzeni ve iletisim kalitesi sayesinde Erdekte guvenle tercih edilebilecek bir otel deneyimi sundu.', guest: 'Yildiz Ailesi' }
  ];

  function getInventoryStats() {
    return state.roomTypes.reduce(function (summary, room) {
      summary.roomTypes += 1;
      summary.totalRooms += Number(room.totalRooms || 0);
      summary.availableRooms += Number(room.availableRooms || 0);
      return summary;
    }, { roomTypes: 0, totalRooms: 0, availableRooms: 0 });
  }

  function getStayPositionLabel(room, index) {
    var labels = {
      'standart': 'En cok tercih edilen',
      'standart-buyuk': 'Daha genis plan',
      'deniz-manzarali-delux': 'Manzara secimi',
      'sultan-keyfi': 'Premium secenek',
      'tek-kisilik': 'Solo konaklama'
    };
    return labels[room.id] || ['Secili oda', 'Butik tercih', 'One cikan secenek'][index] || 'Secili oda';
  }

  function getStayAudienceCopy(room) {
    var copy = {
      'standart': 'Erdek merkezde duzenli, bakimli ve dengeli bir oda arayan misafirler icin guclu bir ilk tercih sunar.',
      'standart-buyuk': 'Daha rahat yerlesim, ekstra hareket alani ve ailece daha ferah bir konaklama beklentisi icin ideal bir secenektir.',
      'deniz-manzarali-delux': 'Manzara, balkon ve daha rafine bir oda atmosferi bekleyen misafirler icin planlandi.',
      'sultan-keyfi': 'Ozel gunler, daha uzun konaklamalar ve premium atmosfer arayan misafir profiline hitap eder.',
      'tek-kisilik': 'Tek basina seyahat eden, pratik ama ozenli bir oda duzeni bekleyen misafirler icin verimli bir secenektir.'
    };
    return copy[room.id] || room.story || '';
  }

  function renderHomeHero() {
    var inventory = getInventoryStats();
    var promo = Data.getPrimaryPromotion(state);
    var previewRooms = Data.getFeaturedRooms(state).slice(0, 3);
    return '<section class="hero hero-home" id="anasayfa"><div class="container hero-grid"><div class="hero-copy"><div class="hero-prelude"><span class="hero-chip">Mavi / Beyaz / Erdek Sahili</span><span class="hero-rule"></span><span class="hero-annotation">Merkezi konum, sakin atmosfer ve ozenli hizmet ayni deneyimde bulusuyor</span></div><p class="kicker">Erdek merkezde, denize yakin, modern ve profesyonel bir butik sehir oteli</p><h1 class="hero-title">' + Data.escapeHtml(state.hotel.name) + '</h1><p class="hero-text">' + Data.escapeHtml(state.content.heroText) + ' ' + Data.escapeHtml(state.hotel.description) + '</p><div class="hero-spotlight-grid"><article class="hero-spotlight-card"><span>Konaklama Koleksiyonu</span><strong>' + inventory.roomTypes + ' oda tipi, ' + inventory.totalRooms + ' oda</strong><p>Butik olcegi korurken farkli konaklama beklentilerine cevap veren secili bir oda duzeni sunuyoruz.</p></article><article class="hero-spotlight-card"><span>Direkt Planlama</span><strong>' + inventory.availableRooms + ' oda icin hizli geri donus</strong><p>Telefon, WhatsApp ve web formu uzerinden gelen talepleri ayni gun icinde net bir rezervasyon akisina donusturuyoruz.</p></article><article class="hero-spotlight-card"><span>Merkezi Rota</span><strong>Sahil, merkez ve kahvalti ritmi ayni cizgide</strong><p>Erdek yasam akisi icinde hem dinlenmeye hem de kolay ulasima uygun bir konum avantaji sunuyoruz.</p></article></div><div class="hero-ribbon-row">' + state.content.highlights.slice(0, 4).map(function (item) { return '<span class="hero-ribbon">' + Data.escapeHtml(item) + '</span>'; }).join('') + '</div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Rezervasyon Talebi Olustur</a><a class="button button-secondary" href="' + Shell.pageHref('rooms') + '">Odalarimizi Inceleyin</a></div><div class="hero-signature-grid"><article class="hero-signature-card"><span>Rezervasyon Hatti</span><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong></article><article class="hero-signature-card"><span>Kahvalti Saati</span><strong>' + Data.escapeHtml(state.hotel.breakfastHours) + '</strong></article><article class="hero-signature-card"><span>Baslangic Fiyati</span><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong></article></div><div class="hero-meta"><article class="detail-card"><h3>Neden Mavi Inci Park Otel?</h3><ul class="detail-list"><li>Erdek merkezde, sahile ve sosyal alanlara kolay erisim</li><li>Modern, bakimli ve huzurlu konaklama alanlari</li><li>Misafir memnuniyetine odakli hizli geri donus sureci</li><li>Direkt rezervasyonda net fiyat ve iletisim avantajlari</li></ul></article><article class="detail-card"><h3>One cikan oda tipleri</h3><div class="availability-list">' + previewRooms.map(function (room) { return '<div class="availability-item"><div><strong>' + Data.escapeHtml(room.name) + '</strong><span>' + Data.escapeHtml(room.view) + ' | ' + Data.escapeHtml(room.size) + '</span></div><span class="status-pill status-available">' + Data.formatMoney(state, room.nightlyPrice) + '</span></div>'; }).join('') + '</div></article></div></div><aside class="hero-aside"><div class="reservation-office-card"><div class="quick-booking-topline"><span class="quick-booking-badge">Direkt Rezervasyon</span><span class="quick-booking-badge muted-badge">' + (promo ? '%' + promo.discount + ' web avantaji' : 'Hizli geri donus') + '</span></div><p class="card-kicker">Rezervasyon Ofisi</p><h2>Konaklamanizi guvenle planlayin</h2><p class="quick-booking-note">Giris ve cikis tarihinizi, oda tercihinizi ve ozel taleplerinizi rezervasyon sayfamizdan bize iletin. Ekibimiz size telefon veya WhatsApp uzerinden kisa surede donus saglasin.</p><div class="reservation-office-meta"><div class="summary-line"><span>Telefon</span><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong></div><div class="summary-line"><span>WhatsApp</span><strong>' + Data.escapeHtml(state.hotel.whatsappNumber) + '</strong></div><div class="summary-line"><span>Check-in</span><strong>' + Data.escapeHtml(state.hotel.checkInTime) + '</strong></div><div class="summary-line"><span>Check-out</span><strong>' + Data.escapeHtml(state.hotel.checkOutTime) + '</strong></div></div><div class="reservation-office-actions"><a class="button button-dark" href="' + Shell.pageHref('booking') + '">Rezervasyon Sayfasini Ac</a><a class="button button-soft" href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp Destegi</a></div></div></aside></div><div class="container hero-collector"><div class="hero-collector-card"><span>Otel Hikayesi</span><strong>Erdekte modern sehir oteli konforunu, sakin atmosfer ve ozenli hizmet anlayisiyla bir araya getiriyoruz.</strong></div><div class="hero-collector-card"><span>Konaklama Yaklasimi</span><strong>Ana sayfa otelimizi tanitir; odalar, deneyimler ve rezervasyon adimlari kendi sayfalarinda daha net ilerler.</strong></div><div class="hero-collector-card"><span>Direkt Iletisim</span><strong>Telefon ve WhatsApp hattimiz uzerinden rezervasyon surecini hizli ve dogrudan yonetiyoruz.</strong></div></div></section>';
  }

  function renderBrandStory() {
    return '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Hakkimizda</p><h2>Erdekte sakin, profesyonel ve davetkar bir konaklama anlayisi</h2><p class="story-copy">' + Data.escapeHtml(state.hotel.description) + ' Mavi Inci Park Otel olarak, butik olcekte daha dikkatli hizmet veriyor; misafirlerimize huzurlu bir atmosfer, duzenli yasam alanlari ve merkezi konum avantajini birlikte sunuyoruz.</p><ul class="highlight-list"><li>Merkezi konumla kolay ulasim</li><li>Modern ve bakimli oda duzeni</li><li>Misafir memnuniyeti odakli hizmet anlayisi</li><li>Direkt rezervasyonda hizli iletisim ve destek</li></ul></article><div class="value-stack"><article class="value-prop"><h3>Konum Avantaji</h3><p>Erdek sahiline, restoranlara ve gunluk ihtiyac noktalarina yakin konumumuz sayesinde konaklamanizi daha verimli planlayabilirsiniz.</p></article><article class="value-prop"><h3>Tasarim Yaklasimimiz</h3><p>Mavi, beyaz ve bej tonlariyla kurgulanan mekan dili; ferah, yalin ve profesyonel bir atmosfer olusturur.</p></article><article class="value-prop"><h3>Hizmet Anlayisimiz</h3><p>Misafirlerimizin beklentilerine hizli ve net yanit vermeyi, temiz ve duzenli bir konaklama standardiyla birlestiriyoruz.</p></article></div></div></section>';
  }

  function renderStayPreviewCard(room, index) {
    var media = Data.getRoomGallery(state, room.id)[0] || galleryItems[index] || null;
    return '<article class="stay-preview-card"><a class="room-media room-media-link" href="' + Shell.roomHref(room) + '">' + Shell.renderMedia(media, room.name, { loading: 'lazy', fetchPriority: 'low' }) + '<div class="stay-preview-badges"><span class="stay-preview-badge">' + Data.escapeHtml(getStayPositionLabel(room, index)) + '</span><span class="stay-preview-badge stay-preview-badge-muted">' + room.availableRooms + '/' + room.totalRooms + ' oda</span></div></a><div class="stay-preview-body"><div class="stay-preview-intro"><span class="tag">' + Data.escapeHtml(room.short || room.name) + '</span><span class="stay-preview-note">' + Data.escapeHtml(room.highlights && room.highlights[0] ? room.highlights[0] : room.view) + '</span></div><div class="room-header"><div><h3>' + Data.escapeHtml(room.name) + '</h3><p class="stay-preview-caption">' + Data.escapeHtml(room.view) + ' | ' + Data.escapeHtml(room.size) + '</p></div><div class="room-price"><strong>' + Data.formatMoney(state, room.nightlyPrice) + '</strong><span>/ gece</span></div></div><p>' + Data.escapeHtml(room.notes || room.story || '') + '</p><div class="stay-preview-highlights">' + (room.highlights || []).slice(0, 2).map(function (item) { return '<span>' + Data.escapeHtml(item) + '</span>'; }).join('') + '</div><div class="stay-preview-guidance"><strong>Kimler icin ideal?</strong><p>' + Data.escapeHtml(getStayAudienceCopy(room)) + '</p></div><div class="stay-preview-meta"><span>' + room.capacityAdults + ' yetiskin' + (Number(room.capacityChildren || 0) ? ' + ' + room.capacityChildren + ' cocuk' : '') + '</span><span>' + Data.escapeHtml(room.bed) + '</span><span>Musait: ' + room.availableRooms + '/' + room.totalRooms + '</span></div><div class="room-actions"><a class="button button-dark" href="' + Shell.roomHref(room) + '">Oda Detayini Incele</a><a class="button button-soft" href="' + Shell.bookingHref(room) + '">Rezervasyon Yap</a></div></div></article>';
  }

  function renderStayPreview() {
    var rooms = Data.getFeaturedRooms(state).slice(0, 3);
    return '<section class="section section-light section-stay-preview"><div class="container"><div class="section-header"><p class="section-kicker">Odalarimiz</p><h2 class="section-title">Konfor, hacim ve atmosfer dengesiyle secilen oda koleksiyonumuz</h2><p class="section-text">Her oda tipimizi farkli misafir profillerine daha net hitap edecek sekilde kurguladik. Oda sayfamizdan tum kategorileri karsilastirabilir, size en uygun secenegi daha profesyonel bir akista belirleyebilirsiniz.</p></div><div class="stay-preview-grid">' + rooms.map(renderStayPreviewCard).join('') + '</div><div class="section-cta-row"><a class="button button-primary" href="' + Shell.pageHref('rooms') + '">Tum Oda Tiplerini Gorun</a><a class="button button-secondary" href="' + Shell.pageHref('booking') + '">Rezervasyon Planlayin</a></div></div></section>';
  }

  function renderServicePreview() {
    var blocks = [
      { title: 'Kahvalti Servisi', text: 'Gune keyifli ve duzenli bir baslangic yapmaniz icin ozenle hazirlanan kahvalti sunumu.', stat: state.hotel.breakfastHours },
      { title: 'Konforlu Altyapi', text: 'Tesis genelinde kablosuz internet, klima, duzenli oda bakimi ve temel konfor detaylari sunuyoruz.', stat: 'Wi-Fi ve oda ici konfor' },
      { title: 'Merkezi Konum ve Ulasim', text: 'Sahile, yuruyus alanlarina ve gunluk ihtiyac noktalarina kolay erisim saglayan bir yerlesime sahibiz.', stat: state.hotel.airportTransfer ? 'Ulasim destegi notu alinabilir' : 'Erdek merkezde konum' }
    ];
    return '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Hizmetler ve Olanaklar</p><h2 class="section-title">Konforu destekleyen temel hizmetlerimizi ozenle planliyoruz</h2><p class="section-text">Kahvalti, baglanti altyapisi, merkezi konum ve misafir destek surecimizi; konaklamaniz boyunca rahatlik ve guven hissi olusturacak bicimde sunuyoruz.</p></div><div class="features-grid">' + blocks.map(function (item, index) { return '<article class="feature-card"><div class="feature-icon">0' + (index + 1) + '</div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><div class="feature-stat">' + Data.escapeHtml(item.stat) + '</div></article>'; }).join('') + '</div></div></section>';
  }

  function renderDestinationSection() {
    var cards = [
      { title: 'Sahil Hatti', text: 'Otelimizden kisa bir yuruyusle deniz, gun batimi ve sahil keyfine kolayca ulasabilirsiniz.', action: 'Sahile yakin konum' },
      { title: 'Merkez Avantaji', text: 'Restoranlar, kafeler ve gunluk ihtiyac noktalarina rahat erisim sayesinde planlamanizi zorlanmadan yapabilirsiniz.', action: 'Erdek merkezde' },
      { title: 'Kolay Ulasim', text: 'Kisa tatillerde ya da uzun konaklamalarda pratik varis, hizli yerlesim ve net yonlendirme sunuyoruz.', action: 'Planlamasi rahat konaklama' }
    ];
    return '<section class="section section-light section-destination"><div class="container"><div class="section-header"><p class="section-kicker">Konum ve Erdek Avantaji</p><h2 class="section-title">Erdek merkezde, sahile ve sehir hayatina yakin bir konumdayiz</h2><p class="section-text">Konumumuzu yalnizca bir adres olarak degil; tatilinizi daha rahat, erisilebilir ve keyifli hale getiren bir avantaj olarak sunuyoruz.</p></div><div class="destination-grid">' + cards.map(function (item) { return '<article class="destination-card"><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><span>' + Data.escapeHtml(item.action) + '</span></article>'; }).join('') + '</div></div></section>';
  }

  function renderTrustSection() {
    return '<section class="section section-light" id="iletisim"><div class="container contact-grid"><div><div class="section-header"><p class="section-kicker">Misafir Memnuniyeti</p><h2 class="section-title">Misafir deneyimini guven veren bir hizmet anlayisiyla tamamliyoruz</h2><p class="section-text">Konforlu bir konaklamanin en guclu tamamlayicisi, misafirin kendisini guvende ve iyi karsilanmis hissetmesidir. Geri bildirimlerimiz, bu anlayisin sahadaki karsiligini yansitir.</p></div><div class="reviews-grid">' + testimonials.map(function (item) { return '<article class="review-card"><div class="review-score">' + Data.escapeHtml(item.score) + '</div><h3>' + Data.escapeHtml(item.title) + '</h3><p>' + Data.escapeHtml(item.text) + '</p><span class="tag">' + Data.escapeHtml(item.guest) + '</span></article>'; }).join('') + '</div></div><div class="info-stack"><article class="contact-card"><p class="section-kicker">Iletisim ve Konum</p><h3>Rezervasyon ofisi ve otel bilgileri</h3><p>Erdek merkezde yer alan otelimiz, sahil hattina ve sosyal yasama kolay erisim saglayan bir noktadadir.</p><p>' + Data.escapeHtml(state.hotel.address) + '</p><p><a class="contact-link" href="tel:' + Data.escapeHtml(state.hotel.phone) + '">' + Data.escapeHtml(state.hotel.phone) + '</a></p><p><a class="contact-link" href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp: ' + Data.escapeHtml(state.hotel.whatsappNumber) + '</a></p><p><a class="contact-link" href="mailto:' + Data.escapeHtml(state.hotel.email) + '">' + Data.escapeHtml(state.hotel.email) + '</a></p><p>Instagram: ' + Data.escapeHtml(state.hotel.instagram) + '</p></article><article class="contact-card"><p class="section-kicker">Rezervasyon Cagrisi</p><h3>Bir sonraki adim</h3><p>Erdekte merkezi konum, ozenli hizmet ve konforlu odalarla planlanan konaklamaniz icin bizimle hemen iletisime gecin.</p><div class="footer-links"><a href="' + Shell.pageHref('rooms') + '">Odalar sayfasina gec</a><a href="' + Shell.pageHref('experiences') + '">Deneyimler ve teklifler</a><a href="' + Shell.pageHref('booking') + '">Rezervasyon formunu doldur</a><a href="' + Shell.roomHref(Data.getFeaturedRooms(state)[0]) + '">Ornek oda detay sayfasi</a></div></article></div></div></section>';
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
      description: 'Mavi Inci Park Otel ana sayfasi; hakkimizda, odalarimiz, hizmetlerimiz ve Erdek merkez konum avantajimizi profesyonel bir dille sunar.',
      canonical: Data.getSiteUrl(state, '/'),
      keywords: ['Mavi Inci Park Otel', 'Erdek butik otel', 'Balikesir sahil oteli', 'direkt rezervasyon otel', 'Erdek deniz oteli']
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
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Ana sayfa yuklenirken bir hata olustu.</div>';
      if (Boot && typeof Boot.fail === 'function') Boot.fail('Ana sayfa yuklenirken teknik bir sorun olustu.');
    }
  });
})();
