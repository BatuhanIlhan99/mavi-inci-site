(function (window) {
  var STORAGE_KEY = 'mavi-inci-admin-state-v1';

  var fallbackState = {
    hotel: {
      name: 'Mavi Inci Park Otel',
      phone: '+905376963030',
      email: 'rezervasyon@maviinciparkotel.com',
      address: 'Erdek Sahil Yolu No:12, Balikesir',
      description: 'Erdek merkezde, sahile ve gunluk yasama yakin konumumuzla; modern konforu, sakin atmosferi ve ozenli hizmet anlayisini bir araya getiriyoruz.',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      breakfastHours: '08:00 - 10:30',
      whatsappNumber: '+905376963030',
      instagram: '@maviinciparkotel',
      petFriendly: false,
      airportTransfer: true,
      beachService: true,
      onlineBooking: true
    },
    content: {
      heroTitle: 'Mavi Inci Park Otel',
      heroText: 'Mavi beyaz tasarim dili, merkezi konum avantajimiz ve misafir memnuniyeti odakli hizmet anlayisimizla Erdekte davetkar bir butik sehir oteli deneyimi sunuyoruz.',
      bookingLabel: 'Hemen Rezervasyon Yap',
      seoTitle: 'Mavi Inci Park Otel | Erdek Butik Otel',
      seoDescription: 'Mavi Inci Park Otel, Erdek merkezde sahile yakin konumu, modern odalari ve ozenli hizmet anlayisiyla profesyonel butik otel deneyimi sunar.',
      highlights: ['Erdek merkezde avantajli konum', 'Mavi beyaz modern tasarim', 'Ozenli kahvalti ve konfor', 'Direkt rezervasyonda hizli destek']
    },
    settings: {
      currency: 'TRY',
      taxRate: 10,
      minStay: 1,
      maxStay: 14,
      cancellationWindow: 3,
      showOnlyAvailable: false
    },
    roomCatalogVersion: '2026-03-24-corporate-copy-v1',
    roomTypes: [
      {
        id: 'standart',
        name: 'Standart Oda',
        short: 'Standart',
        nightlyPrice: 4700,
        weekendPrice: 5400,
        capacityAdults: 2,
        capacityChildren: 1,
        totalRooms: 6,
        availableRooms: 6,
        status: 'active',
        featured: true,
        amenities: 'Minibar, yuksek hizli Wi-Fi, klima ve gunluk oda duzeni',
        notes: 'Bakimli, ferah ve modern detaylarla tamamlanan dengeli bir konaklama alani.',
        size: '24 m2',
        bed: 'Queen bed',
        view: 'Ic avlu ve bahce',
        bathroom: 'Yagmur dusu',
        story: 'Standart Oda, Erdekte merkezi konaklama avantajini; temiz, duzenli ve dinlendirici bir yasam alaniyla birlestirir.',
        highlights: ['Ferah mavi beyaz atmosfer', 'Gunluk konfor icin dengeli plan', 'Kisa ve uzun konaklamaya uygun'],
        includes: ['Klima ve minibar', 'Yuksek hizli Wi-Fi', 'Gunluk oda bakimi', 'Oda ici kahve-cay seti']
      },
      {
        id: 'standart-buyuk',
        name: 'Standart Buyuk Oda',
        short: 'Standart Buyuk',
        nightlyPrice: 5900,
        weekendPrice: 6600,
        capacityAdults: 3,
        capacityChildren: 1,
        totalRooms: 3,
        availableRooms: 3,
        status: 'active',
        featured: true,
        amenities: 'Genis yasam alani, oturma kosesi, yuksek hizli Wi-Fi ve klima',
        notes: 'Daha genis hareket alani ve rahat bir konaklama duzeni arayan misafirler icin ideal bir secenek.',
        size: '32 m2',
        bed: 'Queen bed + tekli oturma alani',
        view: 'Bahce ve yan cephe',
        bathroom: 'Genis dus alani',
        story: 'Standart Buyuk Oda, aileler ve daha fazla yasam alani bekleyen misafirlerimiz icin konforu ferahlikla bir araya getirir.',
        highlights: ['Genis plan ve rahat yerlesim', 'Aile konaklamasina uygun hacim', 'Ferah ve aydinlik oda kurgusu'],
        includes: ['Oturma alani', 'Nitelikli tekstil secimi', 'Gunluk oda bakimi', 'Oda ici kahve-cay seti']
      },
      {
        id: 'deniz-manzarali-delux',
        name: 'Deniz Manzarali Delux Oda',
        short: 'Deniz Manzarali Delux',
        nightlyPrice: 7600,
        weekendPrice: 8400,
        capacityAdults: 3,
        capacityChildren: 1,
        totalRooms: 1,
        availableRooms: 1,
        status: 'active',
        featured: true,
        amenities: 'Ozel balkon, tam deniz manzarasi, espresso kosesi ve klima',
        notes: 'Deniz manzarasini on planda yasamak ve daha ozel bir konaklama deneyimi tercih eden misafirlerimiz icin tasarlandi.',
        size: '34 m2',
        bed: 'King bed',
        view: 'Tam deniz manzarasi',
        bathroom: 'Premium dus alani',
        story: 'Deniz Manzarali Delux Oda, gun isigi, acik manzara ve secili detaylariyla konaklama deneyimini daha ayri bir seviyeye tasir.',
        highlights: ['Tam deniz manzarasi', 'Balkonlu ozel yasam alani', 'Seckin ve sakin konaklama'],
        includes: ['Espresso kosesi', 'Premium banyo seti', 'Balkon oturumu', 'Oncelikli oda hazirlama']
      },
      {
        id: 'sultan-keyfi',
        name: 'Sultan Keyfi Oda',
        short: 'Sultan Keyfi',
        nightlyPrice: 8600,
        weekendPrice: 9500,
        capacityAdults: 3,
        capacityChildren: 1,
        totalRooms: 2,
        availableRooms: 2,
        status: 'active',
        featured: true,
        amenities: 'Genis yatak, lounge kosesi, premium karsilama duzeni ve klima',
        notes: 'Daha ozel, daha sakin ve zarif bir atmosferde premium konaklama beklentisine yanit verir.',
        size: '42 m2',
        bed: 'King bed + lounge kosesi',
        view: 'Panoramik deniz ve acik cephe',
        bathroom: 'Genis premium banyo',
        story: 'Sultan Keyfi Oda, genis yasam hissi ve seckin detaylariyla ozel gunler ve daha yuksek konfor beklentileri icin hazirlandi.',
        highlights: ['Premium mavi beyaz tasarim', 'Genis ve sakin yasam hissi', 'Ozel gunler icin guclu atmosfer'],
        includes: ['Premium karsilama seti', 'Lounge oturumu', 'Yuksek tekstil kalitesi', 'Oncelikli misafir destegi']
      },
      {
        id: 'tek-kisilik',
        name: 'Tek Kisilik Oda',
        short: 'Tek Kisilik',
        nightlyPrice: 3900,
        weekendPrice: 4300,
        capacityAdults: 1,
        capacityChildren: 0,
        totalRooms: 1,
        availableRooms: 1,
        status: 'active',
        featured: true,
        amenities: 'Akilli depolama, yuksek hizli Wi-Fi, klima ve calisma masasi',
        notes: 'Tek basina seyahat eden misafirlerimiz icin sade, fonksiyonel ve huzurlu bir konaklama secenegi sunar.',
        size: '18 m2',
        bed: 'Single bed',
        view: 'Ic avlu',
        bathroom: 'Kompakt modern banyo',
        story: 'Tek Kisilik Oda, pratik kullanim, duzenli yerlesim ve dingin atmosfer arayan misafirlerimiz icin verimli bir yasam alani sunar.',
        highlights: ['Solo konaklamaya uygun plan', 'Sessiz ve duzenli atmosfer', 'Calisma ve dinlenme dengesi'],
        includes: ['Calisma masasi', 'Yuksek hizli Wi-Fi', 'Gunluk oda bakimi', 'Oda ici su seti']
      }
    ],
    gallery: [
      { id: 'g1', title: 'Otel Genel Gorunumu', category: 'Dis Mekan', alt: 'Mavi Inci Park Otel genel gorunumu', src: 'https://images.odamax.com/imgproxy/img/1024x768/odamax/image/upload/bzd8dfdyuoea56cewetw.jpg', color: 'linear-gradient(135deg, #3d7b95 0%, #e4cfad 100%)', roomIds: [] },
      { id: 'g2', title: 'Otel Atmosferi', category: 'Mekan', alt: 'Mavi Inci Park Otel genel atmosferi', src: 'https://images.odamax.com/imgproxy/img/1024x768/odamax/image/upload/kaf6z55lc69o6xmzzbzb.jpg', color: 'linear-gradient(135deg, #d7e4ea 0%, #f2e7d7 100%)', roomIds: [] },
      { id: 'g3', title: 'Standart Oda 01', category: 'Standart Oda', alt: 'Standart oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/uwyiobsrkxitpi1hm5zt.jpg', color: 'linear-gradient(135deg, #d5ecf7 0%, #ffffff 100%)', roomIds: ['standart'] },
      { id: 'g4', title: 'Standart Oda 02', category: 'Standart Oda', alt: 'Standart oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/bhh68swged32ilt0bxvb.jpg', color: 'linear-gradient(135deg, #cfe6f3 0%, #eef8fc 100%)', roomIds: ['standart'] },
      { id: 'g5', title: 'Standart Oda 03', category: 'Standart Oda', alt: 'Standart oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/bq91sznaoirgyqrmhihq.jpg', color: 'linear-gradient(135deg, #9fd0e7 0%, #f6fcff 100%)', roomIds: ['standart'] },
      { id: 'g6', title: 'Standart Oda 04', category: 'Standart Oda', alt: 'Standart oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/oucenwedy8qodmhnxikf.jpg', color: 'linear-gradient(135deg, #f1d7b6 0%, #1d5265 100%)', roomIds: ['standart'] },
      { id: 'g7', title: 'Standart Oda 05', category: 'Standart Oda', alt: 'Standart oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/hspjrq1wpdutattmlgni.jpg', color: 'linear-gradient(135deg, #f4e3c8 0%, #7ba3b7 100%)', roomIds: ['standart'] },
      { id: 'g8', title: 'Standart Buyuk Oda 01', category: 'Standart Buyuk Oda', alt: 'Standart buyuk oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/uwyiobsrkxitpi1hm5zt.jpg', color: 'linear-gradient(135deg, #7fb9d6 0%, #f7fdff 100%)', roomIds: ['standart-buyuk'] },
      { id: 'g9', title: 'Standart Buyuk Oda 02', category: 'Standart Buyuk Oda', alt: 'Standart buyuk oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/bhh68swged32ilt0bxvb.jpg', color: 'linear-gradient(135deg, #d9eef8 0%, #f8fdff 100%)', roomIds: ['standart-buyuk'] },
      { id: 'g10', title: 'Standart Buyuk Oda 03', category: 'Standart Buyuk Oda', alt: 'Standart buyuk oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/bq91sznaoirgyqrmhihq.jpg', color: 'linear-gradient(135deg, #c3e1f1 0%, #ffffff 100%)', roomIds: ['standart-buyuk'] },
      { id: 'g11', title: 'Standart Buyuk Oda 04', category: 'Standart Buyuk Oda', alt: 'Standart buyuk oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/oucenwedy8qodmhnxikf.jpg', color: 'linear-gradient(135deg, #dfeff6 0%, #ffffff 100%)', roomIds: ['standart-buyuk'] },
      { id: 'g12', title: 'Standart Buyuk Oda 05', category: 'Standart Buyuk Oda', alt: 'Standart buyuk oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/hspjrq1wpdutattmlgni.jpg', color: 'linear-gradient(135deg, #d8edf5 0%, #f7fbfd 100%)', roomIds: ['standart-buyuk'] },
      { id: 'g13', title: 'Tek Kisilik Oda 01', category: 'Tek Kisilik Oda', alt: 'Tek kisilik oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/cebd2dz7djzagexlkobq.jpg', color: 'linear-gradient(135deg, #dcecf4 0%, #ffffff 100%)', roomIds: ['tek-kisilik'] },
      { id: 'g14', title: 'Tek Kisilik Oda 02', category: 'Tek Kisilik Oda', alt: 'Tek kisilik oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/kjxyumi1mnntf1bgdsbm.jpg', color: 'linear-gradient(135deg, #d2e8f0 0%, #f9fcff 100%)', roomIds: ['tek-kisilik'] },
      { id: 'g15', title: 'Tek Kisilik Oda 03', category: 'Tek Kisilik Oda', alt: 'Tek kisilik oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/rbhth2frpyywgrtc7kf0.jpg', color: 'linear-gradient(135deg, #d9edf6 0%, #ffffff 100%)', roomIds: ['tek-kisilik'] },
      { id: 'g16', title: 'Tek Kisilik Oda 04', category: 'Tek Kisilik Oda', alt: 'Tek kisilik oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/or7clrjpnw8biwwclewi.jpg', color: 'linear-gradient(135deg, #e5f1f6 0%, #ffffff 100%)', roomIds: ['tek-kisilik'] },
      { id: 'g17', title: 'Deniz Manzarali Delux 01', category: 'Deniz Manzarali Delux', alt: 'Deniz manzarali delux oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/mxdifodi0sq0zfnd4bel.jpg', color: 'linear-gradient(135deg, #b3dcef 0%, #f7fdff 100%)', roomIds: ['deniz-manzarali-delux'] },
      { id: 'g18', title: 'Deniz Manzarali Delux 02', category: 'Deniz Manzarali Delux', alt: 'Deniz manzarali delux oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/bs5epedbocccjqvyltay.jpg', color: 'linear-gradient(135deg, #c4e7f3 0%, #fbfdff 100%)', roomIds: ['deniz-manzarali-delux'] },
      { id: 'g19', title: 'Deniz Manzarali Delux 03', category: 'Deniz Manzarali Delux', alt: 'Deniz manzarali delux oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/cuqp5auyyuiqlahyvxg0.jpg', color: 'linear-gradient(135deg, #a8d8ec 0%, #f7fcff 100%)', roomIds: ['deniz-manzarali-delux'] },
      { id: 'g20', title: 'Deniz Manzarali Delux 04', category: 'Deniz Manzarali Delux', alt: 'Deniz manzarali delux oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/fkq5vmzck9mkdpborpmj.jpg', color: 'linear-gradient(135deg, #d9eef8 0%, #ffffff 100%)', roomIds: ['deniz-manzarali-delux'] },
      { id: 'g21', title: 'Deniz Manzarali Delux 05', category: 'Deniz Manzarali Delux', alt: 'Deniz manzarali delux oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/bu30brpmuyec2ruwomoy.jpg', color: 'linear-gradient(135deg, #c8e7f5 0%, #ffffff 100%)', roomIds: ['deniz-manzarali-delux'] },
      { id: 'g22', title: 'Sultan Keyfi 01', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/fhzngvktdfsxpzzdm9qg.jpg', color: 'linear-gradient(135deg, #7fb9d6 0%, #f7fdff 100%)', roomIds: ['sultan-keyfi'] },
      { id: 'g23', title: 'Sultan Keyfi 02', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/lsy5egi8h0sk6hcax3ja.jpg', color: 'linear-gradient(135deg, #8bc4de 0%, #f7fdff 100%)', roomIds: ['sultan-keyfi'] },
      { id: 'g24', title: 'Sultan Keyfi 03', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/xutylg9z5jgne6cm8ohr.jpg', color: 'linear-gradient(135deg, #8fd1e6 0%, #fbfeff 100%)', roomIds: ['sultan-keyfi'] },
      { id: 'g25', title: 'Sultan Keyfi 04', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/wsdqc1lvusgatjghfsq5.jpg', color: 'linear-gradient(135deg, #a1d9eb 0%, #fcfeff 100%)', roomIds: ['sultan-keyfi'] },
      { id: 'g26', title: 'Sultan Keyfi 05', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/va3dbkkfbsxbnx5scnpr.jpg', color: 'linear-gradient(135deg, #96d1e5 0%, #fbfdff 100%)', roomIds: ['sultan-keyfi'] },
      { id: 'g27', title: 'Sultan Keyfi 06', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/bk1pbsokida1c9ibetpj.jpg', color: 'linear-gradient(135deg, #b5e0ef 0%, #ffffff 100%)', roomIds: ['sultan-keyfi'] },
      { id: 'g28', title: 'Sultan Keyfi 07', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/hlivxkwibkcdqf6q1vbi.jpg', color: 'linear-gradient(135deg, #c4e7f4 0%, #ffffff 100%)', roomIds: ['sultan-keyfi'] },
      { id: 'g29', title: 'Sultan Keyfi 08', category: 'Sultan Keyfi', alt: 'Sultan keyfi oda detaylari', src: 'https://images.odamax.com/imgproxy/img/800x600/odamax/image/upload/k7r4ia5tx2xw8yazeu7l.jpg', color: 'linear-gradient(135deg, #d2edf8 0%, #ffffff 100%)', roomIds: ['sultan-keyfi'] }
    ],
    promotions: [
      { id: 'p1', title: 'Erken Rezervasyon Ayricaligi', code: 'MAVI20', discount: 20, status: 'active', note: 'Web sitesine ozel, secili tarihlerde aninda indirim.' },
      { id: 'p2', title: 'Hafta Ici Dinlenme Paketi', code: 'ERDEK10', discount: 10, status: 'scheduled', note: 'Pzt-Per gecelerinde oda kahvalti avantaji.' }
    ],
    seasonalPricing: [
      { id: 's1', title: 'Yuksek Sezon', start: futureDate(15), end: futureDate(75), multiplier: 1.18, channel: 'Tum Kanallar', note: 'Yaz talebine gore fiyat guncellemesi.' },
      { id: 's2', title: 'Hafta Ici Web Firsati', start: futureDate(2), end: futureDate(120), multiplier: 0.94, channel: 'Web Sitesi', note: 'Online rezervasyonlarda sinirli sureli avantaj.' }
    ],
    availability: buildAvailability(),
    reservations: []
  };

  fallbackState = applyStaticState(fallbackState, loadStaticState());

  function futureDate(offset) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return formatDate(date);
  }

  function buildAvailability() {
    var statuses = ['available', 'available', 'pending', 'available', 'available', 'blocked', 'available', 'available', 'pending', 'available', 'available', 'blocked', 'available', 'available'];
    return statuses.map(function (status, index) {
      return {
        id: 'a-' + index,
        date: futureDate(index + 1),
        status: status,
        note: status === 'blocked' ? 'Bakim veya kapali gun' : status === 'pending' ? 'Onay bekleyen talep' : 'Rezervasyona uygun'
      };
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadStaticState() {
    try {
      var source = window.MaviInciStaticState;
      if (!source || typeof source !== 'object') return null;
      return clone(source);
    } catch (error) {
      return null;
    }
  }

  function applyStaticState(base, source) {
    var next = clone(base);
    if (!source || typeof source !== 'object') return next;

    if (source.hotel) next.hotel = Object.assign({}, next.hotel, source.hotel);
    if (source.content) next.content = Object.assign({}, next.content, source.content);
    if (source.settings) next.settings = Object.assign({}, next.settings, source.settings);
    if (source.roomCatalogVersion) next.roomCatalogVersion = source.roomCatalogVersion;
    if (Array.isArray(source.roomTypes) && source.roomTypes.length) next.roomTypes = clone(source.roomTypes);
    if (Array.isArray(source.gallery) && source.gallery.length) next.gallery = clone(source.gallery);
    if (Array.isArray(source.promotions) && source.promotions.length) next.promotions = clone(source.promotions);
    if (Array.isArray(source.seasonalPricing) && source.seasonalPricing.length) next.seasonalPricing = clone(source.seasonalPricing);
    if (Array.isArray(source.availability) && source.availability.length) next.availability = clone(source.availability);
    if (Array.isArray(source.reservations)) next.reservations = clone(source.reservations);

    return next;
  }

  function loadAdminState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function formatDate(date) {
    return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-');
  }

  function parseDate(value) {
    var parts = String(value).split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function normalizeDate(date) {
    var next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
  }

  function addDays(date, days) {
    var next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function diffDays(start, end) {
    return Math.round((normalizeDate(end).getTime() - normalizeDate(start).getTime()) / 86400000);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'oda';
  }

  function getMetaContent(name) {
    if (!window.document || !document.head) return '';
    var element = document.head.querySelector('meta[name="' + name + '"]');
    return element ? String(element.getAttribute('content') || '').trim() : '';
  }

  function normalizeSiteRoot(value) {
    var source = String(value || '').trim();
    if (!source || !/^https?:\/\//i.test(source)) return '';
    return source.replace(/\/+$/, '') + '/';
  }

  function getConfiguredSiteRoot(state) {
    var candidates = [
      window.MaviInciSiteUrl,
      getMetaContent('site-url'),
      (state && state.hotel && state.hotel.siteUrl) || '',
      (state && state.settings && state.settings.siteUrl) || ''
    ];

    for (var index = 0; index < candidates.length; index += 1) {
      var normalized = normalizeSiteRoot(candidates[index]);
      if (normalized) return normalized;
    }
    return '';
  }

  function getRuntimeSiteRoot() {
    var location = window.location || {};
    if (!/^https?:$/i.test(String(location.protocol || ''))) return '';
    if (!location.origin) return '';

    var pathname = String(location.pathname || '/');
    if (/\/[^\/?#]+\.[a-z0-9]+$/i.test(pathname)) {
      pathname = pathname.replace(/\/[^\/?#]+\.[a-z0-9]+$/i, '/');
    }
    if (pathname.charAt(pathname.length - 1) !== '/') pathname += '/';

    return normalizeSiteRoot(location.origin + pathname);
  }

  function getFallbackSiteRoot(state) {
    var email = String(((state || {}).hotel || {}).email || fallbackState.hotel.email || '');
    var match = email.match(/@([^@\s]+)/);
    var domain = match ? match[1] : 'maviinciparkotel.com';
    return normalizeSiteRoot('https://www.' + domain.replace(/^www\./, ''));
  }

  function getSiteOrigin(state) {
    return (getConfiguredSiteRoot(state) || getRuntimeSiteRoot() || getFallbackSiteRoot(state)).replace(/\/+$/, '');
  }

  function getSiteUrl(state, path) {
    var base = getConfiguredSiteRoot(state) || getRuntimeSiteRoot() || getFallbackSiteRoot(state);
    if (!path || path === '/') return base;
    if (/^https?:\/\//i.test(path)) return path;
    var normalizedPath = String(path).trim().replace(/^\.\//, '').replace(/^\/+/, '');
    if (!normalizedPath) return base;
    if (normalizedPath.charAt(0) === '#') return base + normalizedPath;
    return base + normalizedPath;
  }

  function getInstagramUrl(handle) {
    var value = String(handle || '').trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return 'https://www.instagram.com/' + value.replace(/^@/, '');
  }

  function mergeRoom(room) {
    var base = fallbackState.roomTypes.find(function (item) { return item.id === room.id; }) || {};
    return Object.assign({}, base, room);
  }

  function roomCatalogMatches(source) {
    if (!source || source.roomCatalogVersion !== fallbackState.roomCatalogVersion) return false;
    if (!Array.isArray(source.roomTypes) || !source.roomTypes.length) return false;
    var incomingIds = source.roomTypes.map(function (room) { return room.id; }).sort().join('|');
    var fallbackIds = fallbackState.roomTypes.map(function (room) { return room.id; }).sort().join('|');
    return incomingIds === fallbackIds;
  }

  function upgradeGallerySource(src) {
    var value = String(src || '');
    if (value.indexOf('images.odamax.com/imgproxy/img/800x600/') >= 0) {
      return value.replace('images.odamax.com/imgproxy/img/800x600/', 'images.odamax.com/imgproxy/img/1024x768/');
    }
    return value;
  }

  function normalizeGallery(items) {
    var fallback = clone(fallbackState.gallery);
    var incoming = Array.isArray(items) ? clone(items) : [];
    var combined = incoming.concat(fallback.filter(function (fallbackItem) {
      return !incoming.some(function (item) {
        return String(item.title || '').toLowerCase() === String(fallbackItem.title || '').toLowerCase();
      });
    }));

    return combined.map(function (item, index) {
      return Object.assign({
        id: item.id || 'gallery-' + index,
        title: item.title || 'Galeri Ogesi',
        category: item.category || 'Galeri',
        alt: item.alt || item.title || 'Galeri',
        src: upgradeGallerySource(item.src || ''),
        color: item.color || 'linear-gradient(135deg, #4c8ca9 0%, #e4cfad 100%)',
        roomIds: Array.isArray(item.roomIds) ? item.roomIds : []
      }, item);
    });
  }

  function resolveSiteData() {
    var admin = loadAdminState();
    var state = clone(fallbackState);
    if (!admin) return state;

    state.hotel = Object.assign(state.hotel, admin.hotel || {});
    state.content = Object.assign(state.content, admin.content || {});
    state.settings = Object.assign(state.settings, admin.settings || {});
    state.roomCatalogVersion = fallbackState.roomCatalogVersion;
    if (roomCatalogMatches(admin)) {
      state.roomTypes = admin.roomTypes.map(mergeRoom);
    } else {
      state.roomTypes = state.roomTypes.map(mergeRoom);
    }
    state.gallery = normalizeGallery(roomCatalogMatches(admin) ? admin.gallery : fallbackState.gallery);
    if (Array.isArray(admin.promotions) && admin.promotions.length) state.promotions = clone(admin.promotions);
    if (Array.isArray(admin.seasonalPricing) && admin.seasonalPricing.length) state.seasonalPricing = clone(admin.seasonalPricing);
    if (Array.isArray(admin.availability) && admin.availability.length) state.availability = clone(admin.availability);
    if (Array.isArray(admin.reservations)) state.reservations = clone(admin.reservations);
    return state;
  }

  function getActiveRooms(state) {
    return state.roomTypes.filter(function (room) {
      return room.status !== 'passive' && (!state.settings.showOnlyAvailable || Number(room.availableRooms || 0) > 0);
    });
  }

  function getFeaturedRooms(state) {
    var rooms = getActiveRooms(state);
    var featured = rooms.filter(function (room) { return room.featured; });
    return (featured.length ? featured : rooms).slice(0, 6);
  }

  function getRoomKey(room) {
    return room.id || String(room.short || room.name).toLowerCase();
  }

  function getRoomByKey(state, key) {
    return getActiveRooms(state).find(function (room) {
      return getRoomKey(room) === key || room.id === key || String(room.short || '').toLowerCase() === String(key || '').toLowerCase();
    }) || null;
  }

  function getPrimaryPromotion(state) {
    return state.promotions.find(function (promo) { return promo.status === 'active'; }) || null;
  }

  function getPromotionByCode(state, code) {
    var normalized = String(code || '').trim().toUpperCase();
    if (!normalized) return null;
    return state.promotions.find(function (promo) {
      return promo.status === 'active' && String(promo.code || '').trim().toUpperCase() === normalized;
    }) || null;
  }

  function getStartingPrice(state) {
    var rooms = getActiveRooms(state);
    if (!rooms.length) return 0;
    return rooms.reduce(function (lowest, room) {
      return Math.min(lowest, Number(room.nightlyPrice || 0));
    }, Number(rooms[0].nightlyPrice || 0));
  }

  function getTotalAvailableRooms(state) {
    return getActiveRooms(state).reduce(function (sum, room) {
      return sum + Number(room.availableRooms || 0);
    }, 0);
  }

  function getUpcomingAvailability(state, count) {
    var total = Math.max(1, Number(count) || 7);
    var today = formatDate(normalizeDate(new Date()));
    return state.availability.filter(function (item) {
      return item.date >= today;
    }).slice(0, total);
  }

  function formatMoney(state, value) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: state.settings.currency || 'TRY',
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function formatShortDate(value) {
    var date = parseDate(value);
    return pad(date.getDate()) + '.' + pad(date.getMonth() + 1) + '.' + date.getFullYear();
  }

  function getGalleryItems(state) {
    return normalizeGallery(state.gallery);
  }

  function getGalleryCategories(state) {
    var categories = getGalleryItems(state).map(function (item) { return item.category || 'Galeri'; });
    return ['Tumu'].concat(categories.filter(function (category, index) { return categories.indexOf(category) === index; }));
  }

  function roomMatchesGallery(item, room) {
    var roomId = room && room.id ? room.id : String(room || '');
    var roomName = room && room.name ? String(room.name).toLowerCase() : roomId;
    var roomShort = room && room.short ? String(room.short).toLowerCase() : roomId;
    var text = [item.title, item.category, item.alt].join(' ').toLowerCase();
    if (Array.isArray(item.roomIds) && item.roomIds.indexOf(roomId) >= 0) return true;
    if (roomId && text.indexOf(roomId) >= 0) return true;
    if (roomShort && text.indexOf(roomShort) >= 0) return true;
    if (roomName && text.indexOf(roomName) >= 0) return true;
    return false;
  }

  function getRoomGallery(state, roomId) {
    var items = getGalleryItems(state);
    var room = getRoomByKey(state, roomId) || { id: roomId, name: roomId, short: roomId };
    var roomItems = items.filter(function (item) { return roomMatchesGallery(item, room); });
    var ambientItems = items.filter(function (item) {
      return !roomMatchesGallery(item, room) && ['Dis Mekan', 'Mekan', 'Deneyim'].indexOf(item.category) >= 0;
    }).slice(0, 2);
    var combined = roomItems.concat(ambientItems);
    return combined.length ? combined : items.slice(0, 4);
  }

  function getAvailabilityLabel(status) {
    if (status === 'pending') return 'Beklemede';
    if (status === 'blocked') return 'Kapali';
    return 'Musait';
  }

  function seasonalMultiplier(state, date) {
    var iso = formatDate(normalizeDate(date));
    var rule = state.seasonalPricing.find(function (item) {
      return iso >= item.start && iso <= item.end;
    });
    return rule ? Number(rule.multiplier || 1) : 1;
  }

  function buildBookingEstimate(state, values) {
    var room = getRoomByKey(state, values.roomType);
    var taxRate = Number(state.settings.taxRate || 0);
    var enteredCode = String(values.promoCode || '').trim().toUpperCase();
    if (!room || !values.checkIn || !values.checkOut) {
      return {
        room: room,
        nights: 0,
        baseTotal: 0,
        seasonalAdjustment: 0,
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        total: 0,
        pendingRange: false,
        blockedRange: false,
        nightlyBreakdown: [],
        promotion: enteredCode ? getPromotionByCode(state, enteredCode) : getPrimaryPromotion(state),
        promoStatus: enteredCode ? (getPromotionByCode(state, enteredCode) ? 'valid' : 'invalid') : (getPrimaryPromotion(state) ? 'auto' : 'none'),
        note: 'Tarih ve oda secimi yaptiginizda tahmini toplam burada guncellenir.'
      };
    }

    var start = parseDate(values.checkIn);
    var end = parseDate(values.checkOut);
    var nights = diffDays(start, end);
    if (nights <= 0) {
      return {
        room: room,
        nights: 0,
        baseTotal: 0,
        seasonalAdjustment: 0,
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        total: 0,
        pendingRange: false,
        blockedRange: false,
        nightlyBreakdown: [],
        promotion: enteredCode ? getPromotionByCode(state, enteredCode) : getPrimaryPromotion(state),
        promoStatus: enteredCode ? (getPromotionByCode(state, enteredCode) ? 'valid' : 'invalid') : (getPrimaryPromotion(state) ? 'auto' : 'none'),
        note: 'Gecerli bir tarih araligi secin.'
      };
    }

    var baseTotal = 0;
    var seasonalAdjustment = 0;
    var pendingRange = false;
    var blockedRange = false;
    var nightlyBreakdown = [];
    for (var index = 0; index < nights; index += 1) {
      var current = addDays(start, index);
      var weekend = current.getDay() === 0 || current.getDay() === 6;
      var nightly = weekend ? Number(room.weekendPrice || room.nightlyPrice || 0) : Number(room.nightlyPrice || 0);
      var multiplier = seasonalMultiplier(state, current);
      var adjustedNightly = Math.round(nightly * multiplier);
      seasonalAdjustment += adjustedNightly - nightly;
      baseTotal += adjustedNightly;
      var availability = state.availability.find(function (item) { return item.date === formatDate(current); });
      if (availability) {
        if (availability.status === 'pending') pendingRange = true;
        if (availability.status === 'blocked') blockedRange = true;
      }
      nightlyBreakdown.push({
        date: formatDate(current),
        label: formatShortDate(formatDate(current)),
        weekday: current.toLocaleDateString('tr-TR', { weekday: 'short' }),
        weekend: weekend,
        baseRate: nightly,
        multiplier: multiplier,
        total: adjustedNightly,
        availabilityStatus: availability ? availability.status : 'available'
      });
    }

    var promo = enteredCode ? getPromotionByCode(state, enteredCode) : getPrimaryPromotion(state);
    var promoStatus = enteredCode ? (promo ? 'valid' : 'invalid') : (promo ? 'auto' : 'none');
    var discountAmount = promo ? Math.round(baseTotal * (Number(promo.discount || 0) / 100)) : 0;
    var subtotal = Math.max(0, Math.round(baseTotal - discountAmount));
    var taxAmount = Math.round(subtotal * (taxRate / 100));
    var note = blockedRange
      ? 'Secilen tarih araliginda kapali gun bulunuyor.'
      : pendingRange
      ? 'Bazi gunlerde yogun talep var, kesin teyit onerilir.'
      : promoStatus === 'invalid'
      ? 'Kod gecersiz; standart web fiyati gosteriliyor.'
      : promoStatus === 'valid'
      ? 'Kod basariyla uygulandi, toplam fiyat guncellendi.'
      : promoStatus === 'auto'
      ? 'Aktif web kampanyasi toplam fiyata otomatik yansitildi.'
      : 'Tahmini toplam fiyat ekibimizin teyidi ile netlesir.';

    return {
      room: room,
      nights: nights,
      baseTotal: Math.round(baseTotal),
      seasonalAdjustment: Math.round(seasonalAdjustment),
      subtotal: subtotal,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      total: subtotal + taxAmount,
      pendingRange: pendingRange,
      blockedRange: blockedRange,
      nightlyBreakdown: nightlyBreakdown,
      promotion: promo,
      promoStatus: promoStatus,
      note: note
    };
  }

  function validateBooking(state, values) {
    var errors = {};
    var today = normalizeDate(new Date());
    var room = getRoomByKey(state, values.roomType);

    if (!values.checkIn) errors.checkIn = 'Giris tarihi secmelisiniz.';
    else if (normalizeDate(parseDate(values.checkIn)) <= today) errors.checkIn = 'Giris tarihi bugunden sonraki bir gun olmalidir.';

    if (!values.checkOut) errors.checkOut = 'Cikis tarihi secmelisiniz.';
    else if (values.checkIn && normalizeDate(parseDate(values.checkOut)) <= normalizeDate(parseDate(values.checkIn))) errors.checkOut = 'Cikis tarihi giris tarihinden sonra olmalidir.';

    if (!values.roomType) errors.roomType = 'Lutfen bir oda tipi secin.';
    if (Number(values.adults) < 1) errors.adults = 'En az 1 yetiskin secmelisiniz.';
    if (Number(values.children) < 0) errors.children = 'Cocuk sayisi negatif olamaz.';

    if (values.checkIn && values.checkOut) {
      var nights = diffDays(parseDate(values.checkIn), parseDate(values.checkOut));
      if (nights < Number(state.settings.minStay || 1)) errors.checkOut = 'Minimum konaklama suresi ' + state.settings.minStay + ' gece.';
      if (nights > Number(state.settings.maxStay || 14)) errors.checkOut = 'Maksimum konaklama suresi ' + state.settings.maxStay + ' gece.';
    }

    if (room) {
      if (Number(values.adults) > Number(room.capacityAdults || 0)) errors.adults = 'Bu oda en fazla ' + room.capacityAdults + ' yetiskin kabul ediyor.';
      if (Number(values.children) > Number(room.capacityChildren || 0)) errors.children = 'Bu oda en fazla ' + room.capacityChildren + ' cocuk kabul ediyor.';
      if (Number(room.availableRooms || 0) <= 0) errors.roomType = 'Bu oda tipi su an on talep listesinde.';
    }

    if (buildBookingEstimate(state, values).blockedRange) errors.checkOut = 'Secilen tarih araliginda kapali gun var.';
    return errors;
  }

  function saveWebReservation(payload) {
    var adminState = loadAdminState() || {};
    adminState.reservations = Array.isArray(adminState.reservations) ? adminState.reservations : [];
    adminState.reservations.unshift(payload);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(adminState));
  }

  window.MaviInciData = {
    storageKey: STORAGE_KEY,
    fallbackState: fallbackState,
    resolveSiteData: resolveSiteData,
    formatDate: formatDate,
    parseDate: parseDate,
    normalizeDate: normalizeDate,
    addDays: addDays,
    diffDays: diffDays,
    escapeHtml: escapeHtml,
    slugify: slugify,
    getSiteOrigin: getSiteOrigin,
    getSiteUrl: getSiteUrl,
    getInstagramUrl: getInstagramUrl,
    formatMoney: formatMoney,
    formatShortDate: formatShortDate,
    getActiveRooms: getActiveRooms,
    getFeaturedRooms: getFeaturedRooms,
    getRoomKey: getRoomKey,
    getRoomByKey: getRoomByKey,
    getPrimaryPromotion: getPrimaryPromotion,
    getPromotionByCode: getPromotionByCode,
    getStartingPrice: getStartingPrice,
    getTotalAvailableRooms: getTotalAvailableRooms,
    getUpcomingAvailability: getUpcomingAvailability,
    getGalleryItems: getGalleryItems,
    getGalleryCategories: getGalleryCategories,
    getRoomGallery: getRoomGallery,
    getAvailabilityLabel: getAvailabilityLabel,
    buildBookingEstimate: buildBookingEstimate,
    validateBooking: validateBooking,
    saveWebReservation: saveWebReservation
  };
})(window);
