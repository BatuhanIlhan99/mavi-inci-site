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
    },
    groupTrust: {
      title: 'Guven Metrikleri',
      addLabel: 'Yeni guven metrik karti',
      fields: [
        { key: 'label', label: 'Baslik', placeholder: 'Ayni gun geri donus' },
        { key: 'value', label: 'Deger', placeholder: 'Merkezi ekip' }
      ]
    },
    pillars: {
      title: 'Marka Pillarlari',
      addLabel: 'Yeni pillar ekle',
      fields: [
        { key: 'title', label: 'Baslik', placeholder: 'Yerel uzmanlik' },
        { key: 'text', label: 'Aciklama', placeholder: 'Erdek ve Kapidag ritmini bilen ekip' }
      ]
    },
    offers: {
      title: 'Teklif ve Kampanyalar',
      addLabel: 'Yeni teklif ekle',
      fields: [
        { key: 'title', label: 'Baslik', placeholder: 'Erken rezervasyon' },
        { key: 'meta', label: 'Meta', placeholder: 'Secili tarihler' },
        { key: 'note', label: 'Not', placeholder: 'Avantaj ve kosul ozeti' }
      ]
    },
    testimonials: {
      title: 'Yorum ve Sosyal Kanit',
      addLabel: 'Yeni yorum ekle',
      fields: [
        { key: 'name', label: 'Ad', placeholder: 'Misafir tipi' },
        { key: 'meta', label: 'Meta', placeholder: 'Aile konaklamasi' },
        { key: 'quote', label: 'Yorum', placeholder: 'Kisa guven verici yorum' }
      ]
    },
    faq: {
      title: 'Sik Sorulan Sorular',
      addLabel: 'Yeni SSS ekle',
      fields: [
        { key: 'question', label: 'Soru', placeholder: 'Giris saati nedir?' },
        { key: 'answer', label: 'Cevap', placeholder: 'Operasyon cevabi' }
      ]
    },
    access: {
      title: 'Ulasim ve Konum Notlari',
      addLabel: 'Yeni ulasim karti ekle',
      fields: [
        { key: 'title', label: 'Baslik', placeholder: 'Istanbul cikisli ulasim' },
        { key: 'text', label: 'Aciklama', placeholder: 'Kisa ulasim notu' }
      ]
    },
    gallery: {
      title: 'Galeri Gorselleri',
      addLabel: 'Yeni gorsel ekle',
      fields: [
        { key: 'image', label: 'Gorsel URL', placeholder: 'https://...' },
        { key: 'alt', label: 'Alt metin', placeholder: 'Gorsel aciklamasi' }
      ]
    }
  };

  var DEFAULT_GROUP_TRUST = [
    { label: 'Merkezi Geri Donus', value: 'Ayni gun icinde' },
    { label: 'Portfoy Yapisi', value: '3 otel + 2 yeme icme' },
    { label: 'Yerel Uzmanlik', value: 'Erdek odakli rota bilgisi' }
  ];

  var DEFAULT_GROUP_PILLARS = [
    { title: 'Tek merkezden planlama', text: 'Talepler, marka fark etmeksizin merkezi ekipte toplanir ve dogru isletmeye yonlendirilir.' },
    { title: 'Yerel deneyim bilgisi', text: 'Erdegi yalnizca bir konaklama lokasyonu olarak degil, rota ve hikaye destinasyonu olarak ele aliyoruz.' },
    { title: 'Konfor + ritim dengesi', text: 'Butik konaklama, sahil hafizasi, yeme icme ve gezi katmanlarini tek cati altinda dengeliyoruz.' }
  ];

  var DEFAULT_GROUP_OFFERS = [
    { title: 'Erken Rezervasyon Avantaji', meta: 'Secili yaz tarihleri', note: 'Dogrudan talepte erken planlama yapan misafirler icin fiyat avantaji ve daha esnek secim alani.' },
    { title: 'Hafta Ici Erdek Kacamagi', meta: 'Pazar-Persembe', note: 'Kisa sureli deniz ve rahatlama odakli konaklamalar icin daha sakin operasyon ve hizli geri donus.' },
    { title: 'Aile ve Cift Segmentleri', meta: 'Otele gore yonlendirme', note: 'Aile, cift ve sakin konaklama beklentisine gore uygun otel tonuna yonlendirme.' }
  ];

  var DEFAULT_GROUP_TESTIMONIALS = [
    { name: 'Aile Konaklamasi', meta: 'Portfoy misafiri', quote: 'Tek merkezden iletisim almak, hangi otelin bize daha uygun oldugunu anlamayi ciddi bicimde kolaylastirdi.' },
    { name: 'Yaz Kacamagi', meta: 'Cift segmenti', quote: 'Sadece oda degil, Erdekte ne yapacagimizi da planlayabildigimiz icin site daha guven veren bir deneyim sundu.' },
    { name: 'Kisa Sureli Tatil', meta: 'Hafta ici talep', quote: 'Merkezi geri donus hizi ve WhatsApp uzerinden net bilgi almak, karar surecini cok hizlandirdi.' }
  ];

  var DEFAULT_GROUP_FAQ = [
    { question: 'Dogrudan talep gonderdigimde ne olur?', answer: 'Talep merkezi hat tarafindan ilgili isletmeye yonlendirilir, uygunluk ve detaylar kontrol edilerek ayni gun icinde geri donus planlanir.' },
    { question: 'Hangi otelin bana uygun oldugunu nasil anlarim?', answer: 'Oteller sayfasindaki karsilastirma ve isletme detaylarindaki uygun misafir profilleri bu secimi kolaylastirir; gerekirse ekibimiz de yonlendirir.' },
    { question: 'WhatsApp uzerinden rezervasyon sureci ilerler mi?', answer: 'Evet. On bilgi, uygunluk, tarih netlestirme ve geri donus tercihine gore WhatsApp hatti aktif olarak kullanilabilir.' }
  ];

  var DEFAULT_GROUP_ACCESS = [
    { title: 'Istanbul ve Bursa cikisli ulasim', text: 'Erdege ozel arac, otobus veya bolgesel ulasim kombinasyonlariyla rahat ulasilabilir; en dogru rota sezon ve cikis sehrine gore degisir.' },
    { title: 'Merkez odakli konaklama avantaji', text: 'Erdek merkez ve sahil bandi odakli tesisler sayesinde yuruyerek veya kisa arac kullanimi ile deneyim noktalarina ulasim kolaylasir.' },
    { title: 'TR / EN destek', text: 'Talep formu ve merkezi iletisim hatti yerli ve yabanci misafirler icin acik, kisa ve anlasilir bilgi akisi saglayacak sekilde kurgulandi.' }
  ];

  var TRAVEL_PROFILES = [
    { title: 'Ciftler Icin Erdek', text: 'Gun batimi, sahil yuruyusu, butik konaklama ve daha yavas bir tempo arayan misafirlere uygun.' },
    { title: 'Aileler Icin Erdek', text: 'Plaj odagi, kolay ulasim, genis oda secenekleri ve gunu bolmeden ilerleyen bir gezi ritmi sunar.' },
    { title: 'Tarih ve Foto Odakli Rota', text: 'Zeytinliada, Kyzikos ve Kirazli Manastiri gibi duraklarla Kapidag hafizasini one cikarir.' }
  ];

  var CORPORATE_STANDARDS = [
    { icon: '01', title: 'Merkezi talep yonetimi', text: 'Tum talepler tek merkezde toplanir, ilgili isletmeye yonlendirilir ve geri donus sureci ortak bir dille ilerletilir.' },
    { icon: '02', title: 'Dogrudan rezervasyon netligi', text: 'Misafir, hangi isletmeye yonlendirildigini, hangi kanaldan donus alacagini ve bir sonraki adimi en basindan gorur.' },
    { icon: '03', title: 'Yerel destinasyon uzmanligi', text: 'Konaklama secimini Erdek rehberi, rota onerileri ve yakin deneyim katmanlariyla destekliyoruz.' }
  ];

  var DIRECT_BOOKING_STEPS = [
    { title: 'Dogru isletmeye hizli yonlendirme', meta: 'Portfoy icin merkezi on eleme', note: 'Talep tipi, tarih ve misafir beklentisi ayristirilarak en uygun isletme secimi kolaylastirilir.' },
    { title: 'WhatsApp, telefon veya e-posta ile geri donus', meta: 'Misafir tercihine uygun kanal', note: 'Geri donus tercihine gore operasyon ekibi daha net ve daha hizli iletisim kurar.' },
    { title: 'Konaklama + rota birlikteligi', meta: 'Satin almadan once tam resim', note: 'Misafir yalnizca oda degil, gezi akisini da gorebildigi icin daha guvenli karar verir.' }
  ];

  var LEGAL_AND_SERVICE_NOTES = [
    { icon: 'KV', title: 'Gizlilik ve veri hassasiyeti', text: 'Paylasilan bilgiler yalnizca iletisim ve planlama icin kullanilir; statik demo kurgusunda form verileri tarayici icinde tutulur.' },
    { icon: 'EN', title: 'TR / EN bilgilendirme hazirligi', text: 'Metin yapisi, yabanci misafir iletisimine uyarlanabilecek kadar acik ve profesyonel kurgulanmistir.' },
    { icon: 'OP', title: 'Operasyon seffafligi', text: 'Telefon, WhatsApp, e-posta ve isletme bazli panel yapisi ile tum akisin gorunur ve yonetilebilir olmasi hedeflenmistir.' }
  ];

  var CORPORATE_MISSION_VISION = [
    {
      icon: 'fa-solid fa-bullseye',
      title: 'Misyonumuz',
      lead: 'Erdeki ziyaret eden tum misafirlerimize, uluslararasi hizmet standartlarini yerel misafirperverlikle harmanlayarak sunmak.',
      text: 'Hijyen, guvenlik ve konfordan odun vermeden; hem tatil hem is seyahati planlayan misafirlerimize beklentilerin otesinde bir konaklama tecrubesi yasatmayi hedefliyoruz.'
    },
    {
      icon: 'fa-solid fa-eye',
      title: 'Vizyonumuz',
      lead: 'Bolgede, kurumsal yonetim kalitesi ve misafir memnuniyetiyle referans gosterilen lider butik otel markalarindan biri olmak.',
      text: 'Surdurulebilir turizm ilkeleriyle hem misafirlerimize hem de sektore deger katmaya devam eden, guven veren ve estetik bir konaklama markasi insa ediyoruz.'
    }
  ];

  var CORPORATE_FEATURES = [
    {
      icon: 'fa-solid fa-map-location-dot',
      title: 'Merkezi Konum',
      text: 'Erdek merkezinde; sahile, gunluk yasam noktalarina ve ulasim akslarina sadece birkac adim uzaklikta konumlaniyoruz.'
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Hijyen ve Guvenlik',
      text: '7/24 takip edilen operasyon anlayisimiz ve yuksek hijyen hassasiyetimizle misafirlerimize huzurlu bir ortam sunuyoruz.'
    },
    {
      icon: 'fa-solid fa-award',
      title: 'Profesyonel Hizmet',
      text: 'Egitimli ekibimiz ve kurumsal yaklasimimiz sayesinde her ihtiyaca hizli, nitelikli ve cozum odakli destek veriyoruz.'
    },
    {
      icon: 'fa-solid fa-mug-hot',
      title: 'Zengin Kahvalti',
      text: 'Gune, yerel ve taze urunlerle hazirlanan; enerji veren ve tatil ritmine yakisan bir kahvalti deneyimi ile baslamanizi hedefliyoruz.'
    }
  ];

  var CORPORATE_DOCUMENTS = [
    {
      icon: 'fa-solid fa-file-lines',
      title: 'Turizm Isletme Belgeleri',
      text: 'Resmi belge, ruhsat ve yasal uyum basliklari icin profesyonel dokuman alani hazirlandi.'
    },
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Kalite ve Hijyen Standartlari',
      text: 'Temizlik, guvenlik ve operasyon sureclerini gosteren kalite basliklari bu bolumde sergilenecek sekilde planlandi.'
    },
    {
      icon: 'fa-solid fa-file-signature',
      title: 'Kurumsal Politika ve KVKK',
      text: 'Gizlilik, rezervasyon sureci ve misafir iletisimine dair politika metinleri icin ayrilan kurumsal placeholder alanidir.'
    }
  ];

  var HOME_QUICK_FEATURES = [
    { icon: '01', title: 'Yuksek Hizli Wi-Fi', text: 'Tatil ve is seyahatlerinde kesintisiz baglanti sunan guvenilir altyapi.' },
    { icon: '02', title: 'Merkezi Konum', text: 'Erdek merkez, sahil ve gunluk yasam noktalarina kolay ulasim avantaji.' },
    { icon: '03', title: '7/24 Guvenlik', text: 'Misafirlerin kendini guvende hissetmesini destekleyen duzenli operasyon takibi.' }
  ];

  var ROOM_EXPERIENCE_FEATURES = [
    { icon: 'A1', title: 'Ergonomik calisma alani', text: 'Ozellikle hafta ici konaklamalarda verimli calismayi destekleyen duzenli ve sakin alanlar.' },
    { icon: 'A2', title: 'Premium buklet malzemeleri', text: 'Kisisel bakim detaylarini yukselten ozenli oda ici urun secimi.' },
    { icon: 'A3', title: 'Konforlu dinlenme atmosferi', text: 'Gunun yorgunlugunu atmaya yardimci olan sessiz, dengeli ve rafine bir ic mekan duzeni.' },
    { icon: 'A4', title: 'Gunluk ihtiyaca cevap veren altyapi', text: 'Klima, TV, depolama ve baglanti altyapisi ile eksiksiz sehir oteli deneyimi.' }
  ];

  var BUSINESS_ENHANCEMENTS = {
    'mavi-inci-park-otel': {
      audience: ['Merkezde kalmak isteyen ciftler', 'Kisa hafta ici kacamaklari', 'Sahile dogrudan yakin butik otel arayan misafirler'],
      gallery: [
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20in%20Erdek.jpg', alt: 'Mavi Inci Park Otel icin Erdek sahil gun batimi atmosferi' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erdek%20Turkey.jpg', alt: 'Erdek sahil ve kiyi gorunumu' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erdek%20Turkey.jpg', alt: 'Erdek silueti ve sahil hatti' }
      ],
      offerCards: [
        { title: 'Merkezde Hizli Kacis', meta: '2 gece - butik deneyim', note: 'Merkez tempo ve sahil yakinligi arayan misafirler icin tasarlandi.' },
        { title: 'Gun Batimi Odakli Konaklama', meta: 'Cift segmenti', note: 'Aksam ritmini otel ve sahil yuruyusleriyle birlestiren kisa plan.' }
      ],
      faq: [
        { question: 'Bu otel kimler icin daha uygun?', answer: 'Merkeze yakin olmak, sahil bandina hizli cikmak ve butik olcekte daha kontrollu bir deneyim yasamak isteyen misafirler icin.' },
        { question: 'Kisa konaklama icin uygun mu?', answer: 'Evet. Butik olcegi ve merkez konumu sayesinde 1-3 gecelik kisa planlarda verimli calisir.' }
      ]
    },
    'gulplaj-hotel': {
      audience: ['Deniz manzarasi oncelikli aileler', 'Klasik yaz oteli hafizasini seven misafirler', 'Plaj kullanimi oncelikli konaklamalar'],
      gallery: [
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erdek%20Turkey.jpg', alt: 'Gulplaj Hotel icin Erdek sahil gorunumu' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20in%20Erdek.jpg', alt: 'Erdekte gun batimi' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pasalimani.JPG', alt: 'Erdek deniz rotalari' }
      ],
      offerCards: [
        { title: 'Aile Yaz Paketi', meta: 'Deniz manzarali plan', note: 'Tum odalari deniz goren yerlesim yapisi ile aile tatiline uygun senaryo.' },
        { title: 'Plaj Odakli Erdek', meta: 'Sahil kullanim avantaji', note: 'Denize sifir konum ve klasik yaz oteli ritmi isteyen misafirler icin.' }
      ],
      faq: [
        { question: 'Gulplaj hangi konaklama tonunu sunar?', answer: 'Deniz manzarasi, aile yonetimi ve yaz oteli hafizasi guclu olan daha klasik bir sahil deneyimi sunar.' },
        { question: 'Aileler icin uygun mu?', answer: 'Evet. Plaj temasi ve oda yerlesimi nedeniyle aile segmentinde guclu bir alternatiftir.' }
      ]
    },
    'villa-ece-pansiyon': {
      audience: ['Daha sakin ritim arayan aileler', 'Uzun konaklama planlayan misafirler', 'Pansiyon sicakligi ve yerel his arayanlar'],
      gallery: [
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Narl%C4%B1%20Turkey%20-%20panoramio.jpg', alt: 'Villa Ece Pansiyon icin Kapidag ve deniz gorunumu' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erdek%20Turkey.jpg', alt: 'Erdek sahil hatti' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kirazli_Manastiri.jpg', alt: 'Kirazli Manastiri ve doga rotasi' }
      ],
      offerCards: [
        { title: 'Ailevi Erdek Rotasi', meta: 'Pansiyon ritmi', note: 'Daha yavas tempolu ve aile odakli bir Erdek deneyimi icin kurgulandi.' },
        { title: 'Uzun Konaklama Rahatligi', meta: 'Yarim pansiyon avantaji', note: 'Merkeze yurunecek mesafe ve denize sifir karakter ile birlikte sunulur.' }
      ],
      faq: [
        { question: 'Villa Ece hangi misafir tipine daha uygun?', answer: 'Aileler, daha yerel his arayanlar ve konaklamayi yavas ritimle yasamak isteyen misafirler icin daha uygundur.' },
        { question: 'Merkeze uzak mi?', answer: 'Hayir. Resmi bilgilerde merkeze yurume mesafesinde ve denize sifir karakterde oldugu aktarilir.' }
      ]
    },
    'han-fast-food': {
      audience: ['Hizli servis arayan otel misafirleri', 'Sahil arasinda pratik ogle yemegi isteyenler', 'Paket servis ve gece atistirmasi arayan ziyaretciler'],
      gallery: [
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erdek%20Turkey.jpg', alt: 'Smile Foodhouse icin Erdek merkez atmosferi' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20in%20Erdek.jpg', alt: 'Erdek merkez aksami' }
      ],
      offerCards: [
        { title: 'Otel Misafirine Hizli Menu', meta: 'Paket veya gel al', note: 'Konaklama ile yeme icmeyi ayni grup icinde tutacak hizli servis senaryosu.' },
        { title: 'Gunun Ortasi Pratik Servis', meta: 'Sahil arasi kullanim', note: 'Merkezde zamani bolmeden dogru urune hizli ulasmayi hedefler.' }
      ],
      faq: [
        { question: 'Smile Foodhouse ne vaat ediyor?', answer: 'Kisa bekleme suresi, net menu kurgusu ve otel misafirine kolay entegre olan hizli servis yapisi.' },
        { question: 'Paket servis mantigina uygun mu?', answer: 'Evet. Marka omurgasi, paket servis ve hizli masa devri ile kurgulandi.' }
      ]
    },
    'han-pub': {
      audience: ['Aksam programini otelden sonra surdurmek isteyen misafirler', 'Sosyal bulusma ve etkinlik gecesi arayan ziyaretciler', 'Tatilde gece ritmini de planlayan cift ve arkadas gruplari'],
      gallery: [
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20in%20Erdek.jpg', alt: 'Han Pub icin Erdek aksami' },
        { image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erdek%20Turkey.jpg', alt: 'Erdek merkez gecesi' }
      ],
      offerCards: [
        { title: 'Aksam Ritmi Paketi', meta: 'Etkinlik geceleri', note: 'Gun batimi sonrasi sosyal deneyimi grup icinde tutan pub kurgusu.' },
        { title: 'Mac Gunu ve Sosyal Masa', meta: 'Draft ve etkinlik odagi', note: 'Yerel ziyaretci ile otel misafirini ayni atmosferde bulusturur.' }
      ],
      faq: [
        { question: 'Han Pub nasil bir deneyim sunar?', answer: 'Etkinlik, kokteyl ve masa rezervasyonu akisini bir arada tutan kontrollu bir aksam deneyimi sunar.' },
        { question: 'Otel misafirleri icin uygun mu?', answer: 'Evet. Otele kolay gecis, aksam programi ve daha sosyal bir tatil ritmi icin kurgulandi.' }
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

  function queryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
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
    var sidePhone = options.sidePhone || state.group.phone;
    var sideEmail = options.sideEmail || state.group.email;
    var sideLocation = options.sideLocation || state.group.city;
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
      '<div class="summary-line"><span>Telefon</span><strong>' + safe(sidePhone) + '</strong></div>' +
      '<div class="summary-line"><span>E-Posta</span><strong>' + safe(sideEmail) + '</strong></div>' +
      '<div class="summary-line"><span>Konum</span><strong>' + safe(sideLocation) + '</strong></div>' +
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
    return '<div class="shell">' + Shell.renderHeader(state, activePage) + '<main>' + main + '</main>' + Shell.renderFooter(state) + (activePage ? renderFloatingBar(state) : '') + '</div>';
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

  function useRows(value, fallback) {
    return Array.isArray(value) && value.length ? value : fallback;
  }

  function useTexts(value, fallback) {
    return Array.isArray(value) && value.length ? value : fallback;
  }

  function groupTrustStats(state) {
    return useRows(state.group.trustStats, DEFAULT_GROUP_TRUST);
  }

  function groupPillars(state) {
    return useRows(state.group.pillars, DEFAULT_GROUP_PILLARS);
  }

  function groupOffers(state) {
    return useRows(state.group.offers, DEFAULT_GROUP_OFFERS);
  }

  function groupTestimonials(state) {
    return useRows(state.group.testimonials, DEFAULT_GROUP_TESTIMONIALS);
  }

  function groupFaq(state) {
    return useRows(state.group.faq, DEFAULT_GROUP_FAQ);
  }

  function groupAccess(state) {
    return useRows(state.group.access, DEFAULT_GROUP_ACCESS);
  }

  function businessEnhancements(state, business) {
    var base = BUSINESS_ENHANCEMENTS[business.id] || {};
    var nearby = relatedDestinations(state, business).slice(0, 2).map(function (item) {
      return { image: item.image, alt: item.imageAlt || item.name };
    });
    var fallbackGallery = [{ image: business.photo, alt: business.photoAlt || business.name }].concat(nearby).filter(function (item) {
      return item && item.image;
    });

    return {
      audience: useTexts(business.audience, base.audience || []),
      gallery: useRows(business.gallery, base.gallery || fallbackGallery),
      faq: useRows(business.faq, base.faq || []),
      offerCards: useRows(business.offerCards, base.offerCards || [])
    };
  }

  function trustCards(items) {
    return (items || []).map(function (item) {
      return '<article class="feature-card han-trust-card"><div class="feature-icon">TR</div><h3>' + safe(item.label) + '</h3><div class="feature-stat">' + safe(item.value) + '</div></article>';
    }).join('');
  }

  function quoteCards(items) {
    return (items || []).map(function (item) {
      return '<article class="contact-card han-quote-card"><p class="section-kicker">' + safe(item.name) + '</p><h3>' + safe(item.meta) + '</h3><p>"' + safe(item.quote) + '"</p></article>';
    }).join('');
  }

  function promoCards(items) {
    return (items || []).map(function (item) {
      return '<article class="feature-card han-offer-card"><div class="feature-icon">OF</div><h3>' + safe(item.title || item.name) + '</h3><p>' + safe(item.meta || '') + '</p><div class="feature-stat">' + safe(item.note || item.price || '') + '</div></article>';
    }).join('');
  }

  function faqCards(items) {
    return (items || []).map(function (item) {
      return '<article class="contact-card han-faq-card"><p class="section-kicker">Sik Sorulan</p><h3>' + safe(item.question) + '</h3><p>' + safe(item.answer) + '</p></article>';
    }).join('');
  }

  function accessCards(items) {
    return (items || []).map(function (item) {
      return '<article class="feature-card han-access-card"><div class="feature-icon">GO</div><h3>' + safe(item.title) + '</h3><p>' + safe(item.text) + '</p></article>';
    }).join('');
  }

  function galleryCards(items) {
    return (items || []).map(function (item) {
      return '<article class="contact-card han-gallery-card"><div class="han-gallery-frame"><img src="' + safe(item.image) + '" alt="' + safe(item.alt || '') + '" loading="lazy" /></div></article>';
    }).join('');
  }

  function audienceCards(items) {
    return (items || []).map(function (item) {
      return '<article class="feature-card han-audience-card"><div class="feature-icon">FIT</div><p>' + safe(item) + '</p></article>';
    }).join('');
  }

  function compareTable(hotels, state) {
    return '' +
      '<div class="han-compare-shell"><div class="han-compare-row han-compare-head"><span>Baslik</span>' +
      hotels.map(function (hotel) { return '<strong>' + safe(hotel.shortName) + '</strong>'; }).join('') +
      '</div>' +
      '<div class="han-compare-row"><span>Konum tonu</span>' + hotels.map(function (hotel) { return '<div>' + safe(hotel.location) + '</div>'; }).join('') + '</div>' +
      '<div class="han-compare-row"><span>One cikan vaat</span>' + hotels.map(function (hotel) { return '<div>' + safe(hotel.heroTag) + '</div>'; }).join('') + '</div>' +
      '<div class="han-compare-row"><span>Kimler icin uygun</span>' + hotels.map(function (hotel) { return '<div>' + safe((businessEnhancements(state, hotel).audience || [])[0] || '-') + '</div>'; }).join('') + '</div>' +
      '<div class="han-compare-row"><span>Segment notu</span>' + hotels.map(function (hotel) { return '<div>' + safe((hotel.highlights || [])[0] || '-') + '</div>'; }).join('') + '</div>' +
      '</div>';
  }

  function renderFloatingBar(state) {
    return '' +
      '<div class="han-floating-bar" aria-label="Hizli iletisim kisayollari">' +
      '<a href="tel:' + safe(state.group.phone.replace(/\s+/g, '')) + '">Ara</a>' +
      '<a href="https://wa.me/' + safe(state.group.whatsapp.replace(/[^\d]/g, '')) + '">WhatsApp</a>' +
      '<a href="' + safe(Shell.pageHref('booking')) + '">Talep</a>' +
      '</div>';
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

  function primaryHotel(state) {
    return Data.getBusinessById(state, 'mavi-inci-park-otel') || Data.listHotels(state)[0];
  }

  function hotelRoomCards(hotel) {
    return (hotel.rooms || []).map(function (item) {
      return '' +
        '<article class="feature-card han-tone-card han-room-card">' +
        '<div class="feature-icon">RM</div>' +
        '<h3>' + safe(item.name) + '</h3>' +
        '<p>' + safe(item.meta) + '</p>' +
        '<div class="feature-stat">' + safe(item.price) + '</div>' +
        '<p class="han-note">' + safe(item.note) + '</p>' +
        '<div class="hero-actions">' +
        '<a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id) + '&room=' + encodeURIComponent(item.name) + '">Rezervasyon Yap</a>' +
        '</div>' +
        '</article>';
    }).join('');
  }

  function renderHome(state) {
    var hotel = primaryHotel(state);
    var moodboard = [
      { image: hotel.photo, alt: hotel.photoAlt || hotel.name }
    ].concat((state.guide.destinations || []).slice(0, 3).map(function (item) {
      return { image: item.image, alt: item.imageAlt || item.name };
    }));

    return publicShell(state, 'home',
      hero(state, {
        chip: 'Mavi Inci Park Otel',
        kicker: 'Erdegin Kalbinde',
        title: 'Konfor ve guvenin kesisim noktasi',
        text: '13 ozel odamizda; profesyonel hizmet, merkezi konum ve butik otel sicakligini bir arada sunuyoruz. Mavi Inci Park Otel, hem tatil hem is seyahati planlayan misafirler icin ozenli bir konaklama deneyimi vadeder.',
        primaryLabel: 'Odalarimizi Incele',
        primaryHref: Shell.pageHref('hotels'),
        secondaryLabel: 'Hemen Rezervasyon Yap',
        secondaryHref: Shell.pageHref('booking'),
        statsHtml: statCards([
          { label: 'Oda Sayisi', value: '13 oda' },
          { label: 'Konum', value: 'Erdek merkez' },
          { label: 'Hizmet', value: '7/24 guvenlik' }
        ]),
        sideTitle: 'Dogrudan Rezervasyon Avantaji',
        sideText: 'Hizli geri donus, net fiyatlandirma ve dogrudan iletisim ile rezervasyon surecini daha guvenli ve daha kolay hale getiriyoruz.',
        sidePhone: hotel.phone,
        sideEmail: hotel.email,
        sideLocation: hotel.location
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">One Cikan Hizmetlerimiz</p><h2 class="section-title">Mavi Inci deneyimini guclendiren temel avantajlar</h2><p class="section-text">Kurumsal netlik ile butik konforu bir araya getiren ana hizmet basliklarimizi ilk ekranda acikca sunuyoruz.</p></div><div class="features-grid">' +
      infoCards(HOME_QUICK_FEATURES) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Mavi Inci Park Otel</p><h2>Butik olcekte, profesyonel cizgide konaklama</h2><p class="story-copy">Mavi Inci Park Otel; Erdegin merkezinde yer alan, 13 odali butik yapisini modern hizmet anlayisiyla destekleyen bir sehir otelidir. Hedefimiz; misafirlerimizin hem tatil planlarinda hem de is seyahatlerinde guven, duzen ve konfor duygusunu ayni anda hissedebilmesidir.</p><p class="han-editorial-note">Kisa sureli konaklamalardan yaz tatili planlarina kadar her misafir yolculugunu daha sade, daha sicak ve daha profesyonel hale getiriyoruz.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('corporate') + '">Kurumsal Sayfayi Ac</a><a class="button button-secondary" href="' + Shell.pageHref('contact') + '">Iletisim Bilgileri</a></div></article><div class="value-stack"><article class="value-prop"><h3>Neden tercih ediliyor?</h3>' + momentList(hotel.highlights) + '</article><article class="value-prop"><h3>Hizli Iletisim</h3><p><a class="contact-link" href="tel:' + safe((hotel.phone || '').replace(/\s+/g, '')) + '">' + safe(hotel.phone) + '</a></p><p><a class="contact-link" href="mailto:' + safe(hotel.email) + '">' + safe(hotel.email) + '</a></p><p><a class="contact-link" href="https://wa.me/905376963030">WhatsApp ile hizli ulasin</a></p></article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Oda Tiplerimiz</p><h2 class="section-title">Farkli konaklama ihtiyaclarina uygun 5 ayri oda kategorisi</h2><p class="section-text">Standart odalardan premium deneyim sunan ozel kategorilere kadar tum odalarimizda konfor, temizlik ve islevsellik on plandadir.</p></div><div class="features-grid">' +
      hotelRoomCards({ id: hotel.id, rooms: (hotel.rooms || []).slice(0, 3) }) +
      '</div><div class="hero-actions han-section-actions"><a class="button button-primary" href="' + Shell.pageHref('hotels') + '">Tum Oda Tiplerini Goster</a><a class="button button-secondary" href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id) + '">Rezervasyon Talebi Olustur</a></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Erdek Rehberi</p><h2 class="section-title">Konaklamanizi guclendiren sehir ve sahil rotalari</h2><p class="section-text">Mavi Inci Park Otelde konaklarken Erdegin tarihi, sahili ve gezi duraklarini tek bir rehberden planlayabilirsiniz.</p></div><div class="han-gallery-grid">' +
      galleryCards(moodboard) +
      '</div><div class="hero-actions han-section-actions"><a class="button button-primary" href="' + Shell.pageHref('guide') + '">Erdek Rehberini Kesfet</a><a class="button button-secondary" href="' + Shell.pageHref('contact') + '">Bize Ulasin</a></div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Misafir Guveni</p><h2 class="section-title">Dogrudan guven uyandiran net bir konaklama deneyimi</h2><p class="section-text">Misafir yorumlari, hizli iletisim ve seffaf bilgi akisi; rezervasyon kararini kolaylastiran temel unsurlardir.</p></div><div class="contact-grid">' +
      quoteCards(groupTestimonials(state)) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container"><article class="contact-card han-cta-banner"><div><p class="section-kicker">Rezervasyon Cagrisi</p><h2>Erdekte guven veren, merkezi ve konforlu bir konaklama icin yerinizi ayirtin</h2><p class="lead text-muted">Mavi Inci Park Otel ile hem tatil hem is seyahati planlariniz icin size uygun odayi birlikte belirleyelim.</p></div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id) + '">Hemen Rezervasyon Yap</a><a class="button button-secondary" href="' + Shell.pageHref('contact') + '">Iletisime Gecin</a></div></article></div></section>');
  }

  function renderHotels(state) {
    var hotel = primaryHotel(state);
    return publicShell(state, 'hotels',
      hero(state, {
        chip: 'Mavi Inci Park Otel / Odalar',
        kicker: 'Odalarimiz',
        title: 'Her konaklama senaryosu icin ozenle kurgulanmis oda secenekleri',
        text: 'Standart, buyuk, deniz manzarali deluxe, Sultan Keyfi ve tek kisilik oda tiplerimiz; konfor, islevsellik ve profesyonel hizmet standardi ekseninde hazirlandi.',
        primaryLabel: 'Hemen Rezervasyon Yap',
        primaryHref: Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id),
        secondaryLabel: 'Kurumsal Sayfa',
        secondaryHref: Shell.pageHref('corporate'),
        statsHtml: statCards([
          { label: 'Toplam Oda', value: '13 oda' },
          { label: 'Kategori', value: '5 oda tipi' },
          { label: 'Misafir Profili', value: 'Tatil + is seyahati' }
        ]),
        sideTitle: 'Oda Yaklasimimiz',
        sideText: 'Mavi Inci Park Otelde her oda; rahat bir dinlenme, duzenli bir kullanim ve guven veren bir konaklama hissi sunacak sekilde ele alinmistir.',
        sidePhone: hotel.phone,
        sideEmail: hotel.email,
        sideLocation: hotel.location
      }) +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Oda Katalogu</p><h2 class="section-title">Ihtiyaciniza uygun oda tipini secin</h2><p class="section-text">Oda kartlarimizda sadece teknik ozellikleri degil, konaklamayi daha degerli hale getiren deneyim dilini de one cikariyoruz.</p></div><div class="features-grid">' +
      hotelRoomCards(hotel) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Odada Sizi Neler Bekliyor?</p><h2 class="section-title">Konforu destekleyen detaylar</h2><p class="section-text">Mavi Inci Park Otel odalari; islevsel, temiz ve guven veren bir konaklama ortamini destekleyen detaylarla tamamlanir.</p></div><div class="features-grid">' +
      infoCards(ROOM_EXPERIENCE_FEATURES) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Oda Anlatimi</p><h2>Ev rahatligini otel profesyonelligi ile birlestiren duzen</h2><p class="story-copy">Her oda kategorimiz; farkli misafir beklentilerine cevap verecek sekilde planlandi. Bazilari daha genis yasam alani sunarken, bazilari daha ozel bir konaklama hissi veya daha verimli bir sehir oteli kurgusu saglar.</p><p class="han-editorial-note">Temizlik, duzen, ergonomik kullanim ve sakin atmosfer; tum oda tiplerimizde ortak kalite vaadidir.</p></article><div class="value-stack"><article class="value-prop"><h3>Kimler icin uygun?</h3>' + momentList(['Tatil ciftleri ve aileler', 'Kisa sureli is seyahatleri', 'Merkezi konumda rahat bir oda arayan misafirler']) + '</article><article class="value-prop"><h3>Rezervasyon Icin</h3><p>Oda tipinizi secip rezervasyon formu uzerinden dogrudan talep olusturabilirsiniz.</p><div class="footer-links"><a href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id) + '">Rezervasyon Formunu Ac</a><a href="' + Shell.pageHref('contact') + '">Iletisime Gecin</a></div></article></div></div></section>' +
      '<section class="section section-dark"><div class="container"><article class="contact-card han-cta-banner"><div><p class="section-kicker">Oda Rezervasyonu</p><h2>Mavi Inci Park Otelde size en uygun odayi birlikte planlayalim</h2><p class="lead text-muted">Konfor, merkezi konum ve guven veren hizmet standardi ile Erdek konaklamanizi bir adim yukariya tasiyin.</p></div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id) + '">Rezervasyon Yap</a><a class="button button-secondary" href="' + Shell.pageHref('corporate') + '">Kurumsal Bilgiler</a></div></article></div></section>');
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
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Imza Teklifler</p><h2 class="section-title">Yeme icme tarafini ticarilestiren iki net teklif kurgusu</h2><p class="section-text">Her birimin hizli anlasilan ticari vaadini ve kullanim zamanini ayrik kartlar halinde gosterdik.</p></div><div class="features-grid">' +
      venues.map(function (business) { return promoCards(businessEnhancements(state, business).offerCards); }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Marka Rolleri</p><h2 class="section-title">Her birim gunun farkli bir anina cevap verir</h2></div><div class="han-editorial-grid">' +
      venues.map(function (business) {
        return '<article class="story-card han-editorial-card"><p class="section-kicker">' + safe(business.name) + '</p><h3>' + safe(business.storyTitle) + '</h3><p class="story-copy">' + safe(business.story) + '</p><p class="han-editorial-note">' + safe(business.editorial) + '</p>' + momentList(business.signatureMoments) + '</article>';
      }).join('') +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Atmosfer</p><h2 class="section-title">Gunun farkli saatlerine eslik eden yeme icme dili</h2></div><div class="han-gallery-grid">' +
      venues.map(function (business) { return galleryCards(businessEnhancements(state, business).gallery); }).join('') +
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
        chip: 'Mavi Inci Park Otel / Erdek Rehberi',
        kicker: 'Destinasyon Rehberi',
        title: state.guide.title,
        text: state.guide.introText,
        primaryLabel: 'Rezervasyon Formu',
        primaryHref: Shell.pageHref('booking'),
        secondaryLabel: 'Otelleri Incele',
        secondaryHref: Shell.pageHref('hotels'),
        statsHtml: statCards([
          { label: 'Secili Durak', value: String((state.guide.destinations || []).length) },
          { label: 'Planlanan Gun', value: String((state.guide.itinerary || []).length) },
          { label: 'Otel Onerisi', value: String(hotels.length) }
        ]),
        sideTitle: 'Neden bu rehber?',
        sideText: 'Konaklama karari, iyi bir destinasyon kurgusu ile birlikte anlam kazanir. Bu sayfa, misafirin Erdek tatilini bastan sona planlayabilmesi icin olusturuldu.',
        sidePhone: primaryHotel(state).phone,
        sideEmail: primaryHotel(state).email,
        sideLocation: primaryHotel(state).location
      }) +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Editoryal Giris</p><h2>' + safe(state.guide.introTitle) + '</h2><p class="story-copy">' + safe(state.guide.introText) + '</p><p class="han-editorial-note">Tarihi alanlar, sahil hafizasi ve tekne rotalari ayni rehberde birlestirilerek misafirin yalnizca oda degil, tam bir Erdek deneyimi satin almasi hedeflendi.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '">Merkezi Talep Formu</a><a class="button button-secondary" href="' + Shell.pageHref('hotels') + '">Konaklama Portfoyu</a></div></article><div class="value-stack"><article class="value-prop"><h3>Bu sayfada ne var?</h3>' + momentList(['Tarihi ve fotografik duraklar', 'Hafta bazli gezi planlamasi', 'Otele gore rota onerisi', 'Kaynakli destinasyon notlari']) + '</article><article class="value-prop"><h3>Kimler icin ideal?</h3><p>Erdege ilk kez gelenler, sahil ile tarihi ayni tatilde birlestirmek isteyenler ve ailece planlama yapmak isteyen misafirler icin hazirlandi.</p></article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Mutlaka Gorulmeli</p><h2 class="section-title">Erdegin tarihi, sahili ve ada ritmini bir araya getiren secili duraklar</h2><p class="section-text">Her kartta, lokasyonun hikayesi, en iyi ziyaret zamani ve resmi ya da yerel kaynaga giden referans baglantisi yer alir.</p></div><div class="han-destination-grid">' +
      destinationCards(state.guide.destinations) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Rota Tipleri</p><h2 class="section-title">Farkli misafir tipleri icin uc farkli Erdek kurgusu</h2><p class="section-text">Rehberi sadece tek rota gibi degil, farkli seyahat motivasyonlari icin esnek bir destinasyon plani olarak ele aldik.</p></div><div class="features-grid">' +
      infoCards(TRAVEL_PROFILES.map(function (item, index) { return { icon: 'P' + (index + 1), title: item.title, text: item.text }; })) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">7 Gunluk Gezi Plani</p><h2 class="section-title">Erdekte bir haftayi dogru tempo ile planlayan premium rota</h2><p class="section-text">Konaklama, tarih, deniz ve aksami dengeleyen; hem ilk kez gelenler hem de tekrar gelenler icin uygulanabilir bir program.</p></div><div class="features-grid han-itinerary-grid">' +
      itineraryCards(state.guide.itinerary) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Nerede Konaklamali?</p><h2 class="section-title">Bu rehberin ritmine uyumlu uc farkli konaklama tonu</h2><p class="section-text">Rehberdeki rotalara gore merkez temposu, klasik yaz oteli hafizasi veya daha sakin aile pansiyonu karakteri arasindan tercih yapabilirsiniz.</p></div><div class="stay-preview-grid han-business-grid">' +
      hotels.map(function (business) { return Shell.renderBusinessCard(business, { actionLabel: 'Bu Oteli Incele', secondaryLabel: 'Bu Otel Icin Talep' }); }).join('') +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Ulasim ve Hazirlik</p><h2 class="section-title">Rotaya cikmadan once temel plan notlari</h2></div><div class="features-grid">' +
      accessCards(groupAccess(state)) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container contact-grid"><article class="contact-card"><p class="section-kicker">Kaynaklar</p><h3>Rehber hangi bilgilerle hazirlandi?</h3><div class="footer-links han-source-list">' +
      sources.map(function (source) { return '<a href="' + safe(source.url) + '">' + safe(source.label) + '</a>'; }).join('') +
      '</div></article><article class="contact-card"><p class="section-kicker">Planlama Destegi</p><h3>Rotayi birlikte netlestirelim</h3><p>Hangi otelin hangi rota ile daha uyumlu oldugunu netlestirmek, tarih secmek ve aile yapiniza uygun plan olusturmak icin merkezi talep formunu kullanabilirsiniz.</p><div class="footer-links"><a href="' + Shell.pageHref('booking') + '">Talep Formunu Ac</a><a href="https://wa.me/905376963030">WhatsApp ile Yaz</a></div></article></div></section>');
  }

  function renderCorporate(state) {
    var maviInci = Data.getBusinessById(state, 'mavi-inci-park-otel') || Data.listHotels(state)[0];
    var photo = maviInci && maviInci.photo ? maviInci.photo : state.guide.destinations[0].image;
    var photoAlt = maviInci && maviInci.photoAlt ? maviInci.photoAlt : 'Mavi Inci Park Otel';

    return publicShell(state, 'corporate',
      '<section class="page-hero han-corporate-hero"><div class="han-corporate-hero-media"><img src="' + safe(photo) + '" alt="' + safe(photoAlt) + '" loading="eager" /></div><div class="han-corporate-hero-overlay"></div><div class="container han-corporate-hero-grid"><div class="han-corporate-hero-copy"><p class="kicker">Mavi Inci Park Otel</p><h1 class="hero-title">Erdekin Kalbinde, Guven ve Konforun Adresi</h1><p class="lead han-corporate-lead">Mavi Inci Park Otel, geleneksel misafirperverligi modern hizmet anlayisiyla bulusturuyor.</p><p class="hero-text">Prestijli bir kurumsal durus ile sahil kasabasi sicakligini bulusturan yapimiz; hem dinlenmek isteyen tatil misafirlerine hem de planli, guvenli ve rahat bir konaklama arayan kurumsal ziyaretcilere hitap eder.</p><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=mavi-inci-park-otel">Hemen Rezervasyon Yapin</a><a class="button button-secondary" href="https://wa.me/905376963030">WhatsApp ile Ulasin</a></div></div><aside class="contact-card han-corporate-summary"><p class="section-kicker">Kurumsal Ozet</p><h3>Mavi Inci Park Otel</h3><p class="text-muted">Erdek merkezde, denize ve gunluk yasam aksina yakin; guven verici, profesyonel ve butik olcekte bir konaklama deneyimi.</p><div class="summary-line"><span>Konum</span><strong>' + safe(maviInci ? maviInci.location : state.group.city) + '</strong></div><div class="summary-line"><span>Telefon</span><strong>' + safe(maviInci ? maviInci.phone : state.group.phone) + '</strong></div><div class="summary-line"><span>E-Posta</span><strong>' + safe(maviInci ? maviInci.email : state.group.email) + '</strong></div></aside></div></section>' +
      '<section class="section section-light py-5"><div class="container"><div class="section-header"><p class="section-kicker">Hakkimizda</p><h2 class="section-title">Degerlerimizle Insa Edilen Bir Konaklama Deneyimi</h2><p class="section-text lead text-muted">Mavi Inci Park Otel, Erdek deneyimini guven, konfor ve ozenli hizmet ekseninde yeniden yorumlar.</p></div><div class="story-grid"><article class="story-card"><p class="story-copy lead">Mavi Inci Park Otel olarak, Erdegin essiz dogasi ve tarihi dokusu icinde, misafirlerimize sadece bir konaklama degil; huzur ve guven dolu bir deneyim sunmak amaciyla yola ciktik.</p><p class="text-muted">Kuruldugumuz gunden bu yana once misafir ilkesini merkeze aliyor; butik otel sicakligini kurumsal bir yonetim anlayisiyla birlestiriyoruz. Hem is seyahatlerinizde ihtiyaciniz olan profesyonel ortami hem de tatil planlarinizda aradiginiz konforu tek bir cati altinda sunuyoruz.</p><p class="text-muted mb-0">Sehrin kalbindeki konumumuz, modern mimarimiz ve guler yuzlu ekibimizle Mavi Incide her detayi sizin icin dusunuyoruz. Bizim icin her misafir, ozenle agirlanmasi gereken bir inci degerindedir.</p></article><div class="value-stack"><article class="value-prop"><h3>Temel Degerlerimiz</h3>' + momentList(['Misafir odakli butik hizmet anlayisi', 'Kurumsal duzende net, zamaninda ve guvenilir iletisim', 'Tatil ve is seyahati ihtiyacina birlikte cevap veren esnek yapi']) + '</article><article class="value-prop"><h3>Iletisim ve Rezervasyon</h3><p class="mb-2">' + safe(maviInci ? maviInci.address : state.group.address) + '</p><p class="mb-2"><a class="contact-link" href="tel:' + safe(((maviInci ? maviInci.phone : state.group.phone) || '').replace(/\s+/g, '')) + '">' + safe(maviInci ? maviInci.phone : state.group.phone) + '</a></p><p class="mb-0"><a class="contact-link" href="mailto:' + safe(maviInci ? maviInci.email : state.group.email) + '">' + safe(maviInci ? maviInci.email : state.group.email) + '</a></p></article></div></div></div></section>' +
      '<section class="section section-dark py-5"><div class="container"><div class="section-header"><p class="section-kicker">Misyon ve Vizyon</p><h2 class="section-title">Mavi Incinin hizmet anlayisini belirleyen iki temel ilke</h2><p class="section-text text-muted">Kurumsal kimligimizi ve misafir deneyimimizi sekillendiren temel bakis acimizi burada ozetliyoruz.</p></div><div class="row g-4 align-items-stretch">' +
      CORPORATE_MISSION_VISION.map(function (item) {
        return '<div class="col-lg-6"><article class="contact-card han-corporate-card h-100"><div class="han-corporate-icon"><i class="' + safe(item.icon) + '" aria-hidden="true"></i></div><h3>' + safe(item.title) + '</h3><p class="lead">' + safe(item.lead) + '</p><p class="text-muted mb-0">' + safe(item.text) + '</p></article></div>';
      }).join('') +
      '</div></div></section>' +
      '<section class="section section-light py-5"><div class="container"><div class="section-header"><p class="section-kicker">Neden Mavi Inci?</p><h2 class="section-title">Sizi dusunen detaylar</h2><p class="section-text lead text-muted">Kurumsal netlik ve butik konforu bir araya getiren temel farklarimizi acik bir yapiyla sunuyoruz.</p></div><div class="row g-4 align-items-stretch">' +
      CORPORATE_FEATURES.map(function (item) {
        return '<div class="col-md-6 col-xl-3"><article class="feature-card han-standard-card h-100"><div class="han-corporate-icon"><i class="' + safe(item.icon) + '" aria-hidden="true"></i></div><h3>' + safe(item.title) + '</h3><p class="text-muted mb-0">' + safe(item.text) + '</p></article></div>';
      }).join('') +
      '</div></div></section>' +
      '<section class="section section-dark py-5"><div class="container"><article class="contact-card han-trust-strip"><div><p class="section-kicker">Kurumsal Degerler ve Belgeler</p><h2>Kurumsal misafirlerimiz icin guvenilir bir is ortagiyiz</h2><p class="text-muted mb-0">Seffaf yonetim anlayisimiz ve yasal gerekliliklere tam uyumumuzla, is seyahati planlayan misafirlerimiz icin guven veren bir konaklama zemini sunuyoruz.</p></div><div class="row g-3 han-document-row">' +
      CORPORATE_DOCUMENTS.map(function (item) {
        return '<div class="col-md-4"><article class="han-document-card h-100"><div class="han-corporate-icon"><i class="' + safe(item.icon) + '" aria-hidden="true"></i></div><h3>' + safe(item.title) + '</h3><p class="text-muted">' + safe(item.text) + '</p><span class="han-document-placeholder">Placeholder</span></article></div>';
      }).join('') +
      '</div></article></div></section>' +
      '<section class="section section-light py-5"><div class="container"><div class="section-header"><p class="section-kicker">Kurumsal Standartlar</p><h2 class="section-title">Dogrudan rezervasyon ve profesyonel konaklama deneyimini guclendiren yapi</h2><p class="section-text">Misafirin karar surecini kolaylastiran ve kurumsal algiyi destekleyen operasyon katmanlarini burada topluyoruz.</p></div><div class="features-grid">' +
      infoCards(CORPORATE_STANDARDS) +
      '</div></div></section>' +
      '<section class="section section-light py-5"><div class="container"><div class="section-header"><p class="section-kicker">Dogrudan Rezervasyon Avantajlari</p><h2 class="section-title">Araci yerine dogrudan iletisim kurmanin profesyonel faydalari</h2><p class="section-text">Net bilgi, hizli geri donus ve dogru yonlendirme sayesinde rezervasyon sureci daha sade ve daha guven veren bir yapida ilerler.</p></div><div class="features-grid">' +
      promoCards(DIRECT_BOOKING_STEPS) +
      '</div></div></section>' +
      '<section class="section section-light py-5"><div class="container"><div class="section-header"><p class="section-kicker">Gizlilik ve Hazirlik</p><h2 class="section-title">Kurumsal guveni tamamlayan destek katmanlari</h2><p class="section-text">Uluslararasi hazirlik, veri hassasiyeti ve seffaf operasyon dili, Mavi Inci Park Otelin kurumsal yuzunu destekler.</p></div><div class="features-grid">' +
      infoCards(LEGAL_AND_SERVICE_NOTES) +
      '</div></div></section>' +
      '<section class="section section-dark py-5"><div class="container"><article class="contact-card han-cta-banner"><div><p class="section-kicker">Rezervasyon Cagrisi</p><h2>Unutulmaz bir Erdek deneyimi icin yerinizi ayirtin</h2><p class="lead text-muted">Hem is hem tatil rezervasyonlariniz icin size ozel tekliflerimizi kesfedin.</p></div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=mavi-inci-park-otel">Hemen Rezervasyon Yapin</a><a class="button button-secondary" href="' + Shell.businessHref(maviInci) + '">Otel Detayini Incele</a></div></article></div></section>');
  }

  function renderBusiness(state, business) {
    if (!business) {
      return publicShell(state, 'home',
        '<section class="section section-light"><div class="container"><div class="booking-shell"><div class="booking-shell-header"><h3>Isletme bulunamadi</h3><p>Baglanti gecersiz gorunuyor. Lutfen ana portfoy sayfalarindan ilgili isletmeyi tekrar secin.</p></div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('home') + '">Ana Sayfa</a><a class="button button-secondary" href="' + Shell.pageHref('hotels') + '">Oteller</a></div></div></div></section>');
    }

    var nearby = relatedDestinations(state, business);
    var enhancements = businessEnhancements(state, business);
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
        sideText: business.summary,
        sidePhone: business.phone,
        sideEmail: business.email,
        sideLocation: business.location
      }) +
      '<section class="section section-light"><div class="container han-business-spotlight"><div class="han-business-photo"><img src="' + safe(business.photo ? business.photo : state.guide.destinations[0].image) + '" alt="' + safe(business.photoAlt || business.name) + '" loading="eager" /></div><div class="han-business-spotlight-copy"><p class="section-kicker">Genel Bakis</p><h2>' + safe(business.tagline) + '</h2><p class="story-copy">' + safe(business.summary) + '</p>' + momentList(business.highlights) + '<div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(business.id) + '">Bu Isletme Icin Talep</a><a class="button button-secondary" href="' + Shell.pageHref('guide') + '">Erdek Rehberi</a></div></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Kime Uygun?</p><h2 class="section-title">' + safe(business.name) + ' icin uygun misafir profilleri</h2><p class="section-text">Karar verme surecini kolaylastirmak icin bu isletmenin en guclu oldugu konaklama veya kullanim profillerini ayri kartlarda gosterdik.</p></div><div class="features-grid">' +
      audienceCards(enhancements.audience) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Marka Hikayesi</p><h2>' + safe(business.storyTitle) + '</h2><p class="story-copy">' + safe(business.story) + '</p><p class="han-editorial-note">' + safe(business.editorial) + '</p></article><div class="value-stack"><article class="value-prop"><h3>Iletisim</h3><p>' + safe(business.address) + '</p><p><a class="contact-link" href="tel:' + safe((business.phone || '').replace(/\s+/g, '')) + '">' + safe(business.phone) + '</a></p><p><a class="contact-link" href="mailto:' + safe(business.email) + '">' + safe(business.email) + '</a></p>' + (business.website ? '<p><a class="contact-link" href="' + safe(business.website) + '">Resmi web sitesi</a></p>' : '') + '</article><article class="value-prop"><h3>Imza Anlari</h3>' + momentList(business.signatureMoments) + '</article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Galeri</p><h2 class="section-title">' + safe(business.name) + ' atmosferini tasiyan secili kareler</h2></div><div class="han-gallery-grid">' +
      galleryCards(enhancements.gallery) +
      '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">' + safe(business.type === 'hotel' ? 'Oda Kurgusu' : 'Menu ve Servis') + '</p><h2 class="section-title">' + safe(business.name) + ' ana kalemleri</h2><p class="section-text">Bu liste ilgili isletmenin kendi panelinden duzenlenebilir.</p></div><div class="stay-preview-grid han-business-grid">' + collectionCards(business) + '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Teklifler</p><h2 class="section-title">' + safe(business.name) + ' icin imza teklif kurgulari</h2></div><div class="features-grid">' +
      promoCards(enhancements.offerCards) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Yakindaki Deneyimler</p><h2 class="section-title">' + safe(business.name) + ' konaklamasini buyuten Erdek duraklari</h2><p class="section-text">Bu isletmeden hareketle planlanabilecek en guclu rota duraklari, Erdek rehberinden secildi.</p></div><div class="han-destination-grid">' + destinationCards(nearby) + '</div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Sik Sorulan Sorular</p><h2 class="section-title">' + safe(business.name) + ' hakkinda hizli cevaplar</h2></div><div class="contact-grid">' +
      faqCards(enhancements.faq) +
      '</div></div></section>' +
      '<section class="section section-dark"><div class="container contact-grid"><article class="contact-card"><p class="section-kicker">Bilgi Kaynaklari</p><div class="footer-links">' + (business.sources.length ? business.sources.map(function (source) { return '<a href="' + safe(source.url) + '">' + safe(source.label) + '</a>'; }).join('') : '<a href="' + Shell.pageHref('corporate') + '">Bu birim icin kaynak ve kurumsal notlari incele</a>') + '</div></article><article class="contact-card"><p class="section-kicker">Panel Erisimi</p><h3>Ayrik admin paneli hazir</h3><p>Bu isletme icin ayri bir panel olusturuldu; tanitim metinleri, oda veya menu kalemleri ve metrikler bu panelden bagimsiz yonetilebilir.</p><div class="footer-links"><a href="./panel-' + safe(panelSlug(business.id)) + '.html">Panele Git</a><a href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(business.id) + '">Talep Olustur</a></div></article></div></section>');
  }

  function renderContact(state) {
    var hotel = primaryHotel(state);
    return publicShell(state, 'contact',
      hero(state, {
        chip: 'Mavi Inci Park Otel / Iletisim',
        kicker: 'Iletisim',
        title: 'Rezervasyon oncesi ve sonrasinda her zaman ulasilabilir bir ekip',
        text: 'Adres, telefon, e-posta ve rota bilgilerini tek yerde toplayarak hem bireysel hem kurumsal misafirlerimiz icin net bir iletisim akisi sunuyoruz.',
        primaryLabel: 'Hemen Rezervasyon Yap',
        primaryHref: Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id),
        secondaryLabel: 'WhatsApp ile Yaz',
        secondaryHref: 'https://wa.me/905376963030',
        statsHtml: statCards([
          { label: 'Adres', value: 'Erdek merkez' },
          { label: 'Telefon', value: hotel.phone },
          { label: 'E-Posta', value: hotel.email }
        ]),
        sideTitle: 'Kurumsal Ulasim',
        sideText: 'Mavi Inci Park Otel ile dogrudan iletisime gecerek fiyat, tarih, oda tipi ve grup talepleri icin hizli bilgi alabilirsiniz.',
        sidePhone: hotel.phone,
        sideEmail: hotel.email,
        sideLocation: hotel.location
      }) +
      '<section class="section section-light"><div class="container story-grid"><article class="story-card"><p class="section-kicker">Acik Iletisim Bilgileri</p><h2>Misafirlerimiz icin net, guvenilir ve kolay ulasilabilir iletisim</h2><p class="story-copy">Mavi Inci Park Otel; rezervasyon, on bilgi alma, grup konaklamasi ve ozel talepler icin dogrudan iletisime acik bir operasyon dili benimser. Misafirlerimizin otel ile dogrudan temas kurabilmesini, guven ve seffaflik acisindan onemsiyoruz.</p><div class="footer-links"><a href="tel:' + safe((hotel.phone || '').replace(/\s+/g, '')) + '">' + safe(hotel.phone) + '</a><a href="mailto:' + safe(hotel.email) + '">' + safe(hotel.email) + '</a><a href="https://wa.me/905376963030">WhatsApp Hatti</a></div></article><div class="value-stack"><article class="value-prop"><h3>Adres</h3><p>' + safe(hotel.address) + '</p><p>' + safe(hotel.location) + '</p></article><article class="value-prop"><h3>Calisma ve Donus Duzeni</h3>' + momentList(['Dogrudan rezervasyon taleplerine hizli geri donus', 'Telefon, e-posta ve WhatsApp uzerinden iletisim', 'Kurumsal ve bireysel konaklamalar icin destek']) + '</article></div></div></section>' +
      '<section class="section section-light"><div class="container"><div class="section-header"><p class="section-kicker">Konum</p><h2 class="section-title">Mavi Inci Park Otele kolay ulasim</h2><p class="section-text">Erdek merkezdeki konumumuz sayesinde sahile, gunluk yasam noktalarina ve temel ulasim akslarina kolayca erisebilirsiniz.</p></div><div class="han-map-shell"><iframe title="Mavi Inci Park Otel konumu" src="https://www.google.com/maps?q=Yali%20Mah.%20Neyyire%20Sitki%20Cad.%20No%3A5%2C%20Erdek%20Balikesir&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Yasal Bilgilendirme</p><h2 class="section-title">Kurumsal ve hukuki bilgilendirme alanlari</h2><p class="section-text">Bu alanlar, yasal metinlerinizi ve rezervasyon sureci kosullarinizi profesyonel bir yapida sunabilmeniz icin placeholder olarak hazirlandi.</p></div><div class="contact-grid"><article class="contact-card" id="kvkk-placeholder"><p class="section-kicker">Placeholder</p><h3>KVKK Aydinlatma Metni</h3><p>Kisisel verilerin islenmesi ve misafir iletisim sureclerine dair metin bu bolume eklenebilir.</p></article><article class="contact-card" id="iptal-iade-placeholder"><p class="section-kicker">Placeholder</p><h3>Iptal ve Iade Kosullari</h3><p>Rezervasyon iptal, degisiklik ve iade kosullarina dair resmi aciklamalar icin alan ayrildi.</p></article><article class="contact-card" id="mesafeli-satis-placeholder"><p class="section-kicker">Placeholder</p><h3>Mesafeli Satis ve Hizmet Kosullari</h3><p>Online rezervasyon ve hizmet kosullarina yonelik kurumsal metinler burada konumlandirilabilir.</p></article></div></div></section>' +
      '<section class="section section-light"><div class="container"><article class="contact-card han-cta-banner"><div><p class="section-kicker">Rezervasyon Destegi</p><h2>Mavi Inci Park Otelde konaklamanizi bir telefon kadar yakina getirin</h2><p class="lead text-muted">Fiyat, uygunluk, oda tipi ve grup talepleri icin hemen bizimle iletisime gecin veya rezervasyon formunu doldurun.</p></div><div class="hero-actions"><a class="button button-primary" href="' + Shell.pageHref('booking') + '?business=' + encodeURIComponent(hotel.id) + '">Rezervasyon Formu</a><a class="button button-secondary" href="tel:' + safe((hotel.phone || '').replace(/\s+/g, '')) + '">Telefonla Ulasin</a></div></article></div></section>');
  }

  function renderBooking(state) {
    var hotel = primaryHotel(state);
    return publicShell(state, 'booking',
      hero(state, {
        chip: 'Mavi Inci Park Otel / Rezervasyon',
        kicker: 'Rezervasyon',
        title: 'Dogrudan rezervasyon ile daha guvenli ve daha net bir planlama',
        text: 'Rezervasyon formumuzu; tarih, oda tipi, misafir sayisi ve iletisim beklentilerinizi tek ekranda kolayca iletebilmeniz icin yeniden kurguladik.',
        primaryLabel: 'WhatsApp ile Yaz',
        primaryHref: 'https://wa.me/905376963030',
        secondaryLabel: 'Iletisim Bilgileri',
        secondaryHref: Shell.pageHref('contact'),
        statsHtml: statCards([
          { label: 'Otel', value: 'Mavi Inci Park Otel' },
          { label: 'Oda Tipi', value: '5 kategori' },
          { label: 'Iletisim', value: hotel.phone }
        ]),
        sideTitle: 'Rezervasyon Yaklasimimiz',
        sideText: 'Dogrudan iletisim, net tarih akisi, seffaf bilgi ve kisa surede geri donus. Misafirlerimizin karar surecini mumkun oldugunca sade hale getiriyoruz.',
        sidePhone: hotel.phone,
        sideEmail: hotel.email,
        sideLocation: hotel.location
      }) +
      '<section class="section section-light"><div class="container story-grid"><article class="booking-shell"><div class="booking-shell-header"><h3>Rezervasyon formu</h3><p>Mavi Inci Park Otel icin tarih, oda tipi ve misafir bilgilerinizi tek formdan iletebilir; hem tatil hem is seyahati planlariniz icin hizli geri donus alabilirsiniz.</p></div><form id="groupInquiryForm" class="form-grid two"><label class="field"><span>Otel</span><select id="inquiryBusiness"><option value="' + safe(hotel.id) + '">' + safe(hotel.name) + '</option></select></label><label class="field"><span>Talep Tipi</span><select id="inquiryType"><option value="konaklama">Konaklama</option><option value="bilgi">Genel bilgi</option></select></label><label class="field"><span>Giris Tarihi</span><input id="inquiryCheckIn" type="date" /></label><label class="field"><span>Cikis Tarihi</span><input id="inquiryCheckOut" type="date" /></label><label class="field"><span>Oda Tipi</span><select id="inquiryRoomType"><option value="">Oda tipi secin</option>' + (hotel.rooms || []).map(function (item) { return '<option value="' + safe(item.name) + '">' + safe(item.name) + '</option>'; }).join('') + '</select></label><label class="field"><span>Yetiskin</span><input id="inquiryAdults" type="number" min="1" value="2" /></label><label class="field"><span>Cocuk</span><input id="inquiryChildren" type="number" min="0" value="0" /></label><label class="field"><span>Ad Soyad</span><input id="inquiryName" type="text" required /></label><label class="field"><span>Telefon</span><input id="inquiryPhone" type="text" required /></label><label class="field"><span>E-Posta</span><input id="inquiryEmail" type="email" /></label><label class="field"><span>Donus Tercihi</span><select id="inquiryChannel"><option value="telefon">Telefon</option><option value="whatsapp">WhatsApp</option><option value="eposta">E-Posta</option></select></label><label class="field field-span-2"><span>Not</span><textarea id="inquiryNote" rows="5" placeholder="Varis saatiniz, oda tercihiniz veya ozel taleplerinizi yazabilirsiniz."></textarea></label><div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Rezervasyon Talebini Gonder</button><span class="price-note" id="inquiryStatus"></span></div></form></article><div class="value-stack"><article class="value-prop"><h3>Rezervasyon neden daha kolay?</h3>' + momentList(['Otel ve oda tipi secimi ayni ekranda yapilir', 'Tarih uygunlugu hizli kontrol edilir', 'Telefon, WhatsApp veya e-posta ile geri donus tercih edilebilir']) + '</article><article class="value-prop"><h3>Dogrudan iletisim</h3><p>Araci yerine dogrudan iletisim, daha net fiyat bilgisi ve daha guvenli bir planlama saglar.</p><div class="footer-links"><a href="https://wa.me/905376963030">WhatsApp ile yaz</a><a href="tel:905376963030">+90 537 696 30 30</a></div></article><article class="value-prop"><h3>Kurumsal konaklamalar</h3><p>Is seyahati, hafta ici planlar ve kurumsal misafir talepleri icin de ayni form uzerinden destek alabilirsiniz.</p><div class="footer-links"><a href="' + Shell.pageHref('corporate') + '">Kurumsal Bilgileri Incele</a></div></article></div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-header"><p class="section-kicker">Guven ve Hazirlik</p><h2 class="section-title">Rezervasyon oncesi en cok sorulan konular</h2></div><div class="contact-grid">' +
      faqCards(groupFaq(state)) +
      '</div></div></section>');
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
      '<section class="section section-light"><div class="container">' + flashBanner(flash) + '<div class="han-admin-grid"><article class="booking-shell han-settings-card"><div class="booking-shell-header"><h3>Grup Bilgileri</h3><p>Ust marka, iletisim, manifesto ve dogrudan rezervasyon mesajlari burada yonetilir.</p></div><form id="groupSettingsForm" class="form-grid two"><label class="field"><span>Grup Adi</span><input name="name" type="text" value="' + safe(state.group.name) + '" required /></label><label class="field"><span>Telefon</span><input name="phone" type="text" value="' + safe(state.group.phone) + '" required /></label><label class="field"><span>WhatsApp</span><input name="whatsapp" type="text" value="' + safe(state.group.whatsapp) + '" required /></label><label class="field"><span>E-Posta</span><input name="email" type="email" value="' + safe(state.group.email) + '" /></label><label class="field"><span>Sehir</span><input name="city" type="text" value="' + safe(state.group.city) + '" /></label><label class="field field-span-2"><span>Adres</span><input name="address" type="text" value="' + safe(state.group.address) + '" /></label><label class="field field-span-2"><span>Slogan</span><input name="tagline" type="text" value="' + safe(state.group.tagline) + '" /></label><label class="field field-span-2"><span>Aciklama</span><textarea name="description" rows="4">' + safe(state.group.description) + '</textarea></label><label class="field field-span-2"><span>Manifesto</span><textarea name="manifesto" rows="4">' + safe(state.group.manifesto || '') + '</textarea></label><label class="field field-span-2"><span>Dogrudan Rezervasyon Mesaji</span><textarea name="directBookingPromise" rows="3">' + safe(state.group.directBookingPromise || '') + '</textarea></label><label class="field field-span-2"><span>Rezervasyon Notu</span><textarea name="reservationNote" rows="3">' + safe(state.group.reservationNote) + '</textarea></label><label class="field field-span-2"><span>One Cikanlar</span><textarea name="highlights" rows="5">' + safe(joinLines(state.group.highlights)) + '</textarea></label>' +
      rowEditor('groupTrust', 'groupTrust', groupTrustStats(state)) +
      rowEditor('groupPillars', 'pillars', groupPillars(state)) +
      rowEditor('groupOffers', 'offers', groupOffers(state)) +
      rowEditor('groupTestimonials', 'testimonials', groupTestimonials(state)) +
      rowEditor('groupFaq', 'faq', groupFaq(state)) +
      rowEditor('groupAccess', 'access', groupAccess(state)) +
      '<div class="booking-step-actions field-span-2"><button class="button button-primary" type="submit">Grup Bilgilerini Kaydet</button><button class="button button-secondary" type="button" data-admin-logout>Oturumu Kapat</button><span class="price-note" id="groupSettingsStatus"></span></div></form></article><article class="contact-card han-panel-links"><p class="section-kicker">Panel Gecisleri</p><h3>Her isletme icin ayri yonetim sayfasi</h3><p>Oteller, Smile Foodhouse ve pub icin ayrik paneller burada listelenir.</p><div class="han-mini-links">' + businessLinks(state) + '</div></article></div></div></section>' +
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
    var enhancements = businessEnhancements(state, business);

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
      '<section class="section section-light"><div class="container">' + flashBanner(flash) + '<div class="han-admin-grid"><article class="booking-shell han-settings-card"><div class="booking-shell-header"><h3>' + safe(business.name) + ' ayarlari</h3><p>Tanitim dili, hikaye katmani, gorseller, kaynaklar ve urun kalemleri bu panelden yonetilir.</p></div><form id="businessPanelForm" class="form-grid two"><label class="field"><span>Isletme Adi</span><input name="name" type="text" value="' + safe(business.name) + '" required /></label><label class="field"><span>Kisa Ad</span><input name="shortName" type="text" value="' + safe(business.shortName) + '" /></label><label class="field field-span-2"><span>Hero Etiketi</span><input name="heroTag" type="text" value="' + safe(business.heroTag) + '" /></label><label class="field field-span-2"><span>Tagline</span><input name="tagline" type="text" value="' + safe(business.tagline) + '" /></label><label class="field"><span>Lokasyon</span><input name="location" type="text" value="' + safe(business.location) + '" /></label><label class="field"><span>Vurgu Rengi</span><input name="accent" type="text" value="' + safe(business.accent) + '" /></label><label class="field field-span-2"><span>Adres</span><input name="address" type="text" value="' + safe(business.address) + '" /></label><label class="field"><span>Telefon</span><input name="phone" type="text" value="' + safe(business.phone) + '" /></label><label class="field"><span>E-Posta</span><input name="email" type="email" value="' + safe(business.email) + '" /></label><label class="field field-span-2"><span>Web Sitesi</span><input name="website" type="text" value="' + safe(business.website) + '" /></label><label class="field field-span-2"><span>Kapak Gradient</span><input name="cover" type="text" value="' + safe(business.cover) + '" /></label><label class="field field-span-2"><span>Foto URL</span><input name="photo" type="text" value="' + safe(business.photo || '') + '" /></label><label class="field field-span-2"><span>Foto Alt Metni</span><input name="photoAlt" type="text" value="' + safe(business.photoAlt || '') + '" /></label><label class="field field-span-2"><span>Kisa Ozet</span><textarea name="summary" rows="4">' + safe(business.summary) + '</textarea></label><label class="field field-span-2"><span>Uzun Aciklama</span><textarea name="description" rows="5">' + safe(business.description) + '</textarea></label><label class="field field-span-2"><span>Hikaye Basligi</span><input name="storyTitle" type="text" value="' + safe(business.storyTitle || '') + '" /></label><label class="field field-span-2"><span>Hikaye Metni</span><textarea name="story" rows="5">' + safe(business.story || '') + '</textarea></label><label class="field field-span-2"><span>Editoryal Not</span><textarea name="editorial" rows="4">' + safe(business.editorial || '') + '</textarea></label><label class="field field-span-2"><span>Imza Anlari</span><textarea name="signatureMoments" rows="5">' + safe(joinLines(business.signatureMoments || [])) + '</textarea></label><label class="field field-span-2"><span>Hedef Misafir Profilleri</span><textarea name="audience" rows="4">' + safe(joinLines(enhancements.audience)) + '</textarea></label><label class="field field-span-2"><span>Yakin Rota ID' + "'" + 'leri</span><textarea name="nearby" rows="4" placeholder="zeytinliada, kyzikos, cugra-kurbagali">' + safe(joinLines(business.nearby || [])) + '</textarea></label><label class="field field-span-2"><span>One Cikanlar</span><textarea name="highlights" rows="5">' + safe(joinLines(business.highlights)) + '</textarea></label><label class="field field-span-2"><span>Operasyon Notlari</span><textarea name="features" rows="5">' + safe(joinLines(business.features)) + '</textarea></label>' +
      rowEditor('stats', 'stats', business.stats) +
      rowEditor('collection', collectionKey, collectionItems) +
      rowEditor('businessOffers', 'offers', enhancements.offerCards) +
      rowEditor('businessGallery', 'gallery', enhancements.gallery) +
      rowEditor('businessFaq', 'faq', enhancements.faq) +
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
        highlights: splitLines(form.elements.highlights.value),
        trustStats: collectRows('groupTrust'),
        pillars: collectRows('groupPillars'),
        offers: collectRows('groupOffers'),
        testimonials: collectRows('groupTestimonials'),
        faq: collectRows('groupFaq'),
        access: collectRows('groupAccess')
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
        audience: splitLines(form.elements.audience.value),
        nearby: splitLines(form.elements.nearby.value),
        highlights: splitLines(form.elements.highlights.value),
        features: splitLines(form.elements.features.value),
        stats: collectRows('stats'),
        sources: collectRows('sources'),
        gallery: collectRows('businessGallery'),
        faq: collectRows('businessFaq'),
        offerCards: collectRows('businessOffers')
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
    var roomTypeField = document.getElementById('inquiryRoomType');
    var status = document.getElementById('inquiryStatus');
    var preferredBusiness = businessId();
    var preferredRoom = queryParam('room');

    if (checkInField) checkInField.min = today();
    if (checkOutField) checkOutField.min = today();

    if (businessField && Data.getBusinessById(state, preferredBusiness)) {
      businessField.value = preferredBusiness;
    }

    if (roomTypeField && preferredRoom) {
      roomTypeField.value = preferredRoom;
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
        roomType: document.getElementById('inquiryRoomType') ? document.getElementById('inquiryRoomType').value : '',
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
      console.log('Mavi Inci Park Otel talep JSON:', JSON.stringify(payload, null, 2));
      status.textContent = 'Talep kaydedildi ve ilgili panele yonlendirildi.';
      form.reset();
      document.getElementById('inquiryAdults').value = '2';
      document.getElementById('inquiryChildren').value = '0';
      if (Data.getBusinessById(state, preferredBusiness)) {
        businessField.value = preferredBusiness;
      }
      if (roomTypeField && preferredRoom) {
        roomTypeField.value = preferredRoom;
      }
      syncInquiryMode();
    });
  }

  function applyMeta(state, currentPage, business) {
    var baseUrl = currentPage === 'home'
      ? Shell.pageHref('home')
      : currentPage === 'hotels'
      ? Shell.pageHref('hotels')
      : currentPage === 'contact'
      ? Shell.pageHref('contact')
      : currentPage === 'guide'
      ? Shell.pageHref('guide')
      : currentPage === 'corporate'
      ? Shell.pageHref('corporate')
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

    var primary = primaryHotel(state) || {};
    var title = 'Mavi Inci Park Otel | Erdek butik sehir oteli';
    var description = 'Mavi Inci Park Otel; Erdek merkezde konfor, guven ve profesyonel hizmet odakli butik konaklama deneyimi sunar.';
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      name: primary.name || 'Mavi Inci Park Otel',
      description: primary.description || description,
      telephone: primary.phone || state.group.phone,
      email: primary.email || state.group.email,
      address: primary.address || state.group.address,
      areaServed: primary.location || state.group.city
    };

    if (currentPage === 'hotels') {
      title = 'Mavi Inci Park Otel | Odalarimiz';
      description = 'Mavi Inci Park Otel oda tipleri; standart, buyuk, deluxe, Sultan Keyfi ve tek kisilik oda secenekleriyle Erdek konaklamanizi guclendirir.';
    } else if (currentPage === 'contact') {
      title = 'Mavi Inci Park Otel | Iletisim';
      description = 'Mavi Inci Park Otel acik adresi, telefon, e-posta, harita ve kurumsal iletisim bilgileri.';
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name: 'Mavi Inci Park Otel',
        telephone: '+90 537 696 30 30',
        email: 'rezervasyon@maviinciparkotel.com',
        address: 'Yali Mah. Neyyire Sitki Cad. No:5, Erdek / Balikesir',
        url: baseUrl
      };
    } else if (currentPage === 'corporate') {
      title = 'Mavi Inci Park Otel | Erdek Butik Otel ve Kurumsal Konaklama';
      description = 'Mavi Inci Park Otel icin Erdek butik otel, kurumsal konaklama, guven, konfor ve profesyonel hizmet odakli kurumsal sayfa.';
      schema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Mavi Inci Park Otel Kurumsal Sayfa',
        description: 'Erdek merkezde butik otel deneyimi, kurumsal konaklama uygunlugu ve dogrudan rezervasyon avantajlari.',
        about: {
          '@type': 'Hotel',
          name: 'Mavi Inci Park Otel',
          telephone: '+90 537 696 30 30',
          email: 'rezervasyon@maviinciparkotel.com'
        }
      };
    } else if (currentPage === 'guide') {
      title = 'Mavi Inci Park Otel | ' + state.guide.title;
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
      title = 'Mavi Inci Park Otel | Deneyim ve Yeme Icme';
      description = 'Han Otelcilik catisindaki fast food restoran ve pub operasyonlari.';
    } else if (currentPage === 'booking') {
      title = 'Mavi Inci Park Otel | Rezervasyon';
      description = 'Mavi Inci Park Otel rezervasyon formu; tarih, oda tipi ve misafir bilgilerinizi dogrudan iletebilmeniz icin hazirlandi.';
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
    } else if (currentPage === 'contact') {
      html = renderContact(state);
    } else if (currentPage === 'corporate') {
      html = renderCorporate(state);
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
