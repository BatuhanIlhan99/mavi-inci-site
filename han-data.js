(function (window) {
  var STORAGE_KEY = 'han-otelcilik-state-v1';
  var LOGIN_KEY = 'han-otelcilik-admin-session-v1';

  var defaults = {
    group: {
      name: 'Han Otelcilik',
      phone: '+90 537 696 30 30',
      email: 'iletisim@hanotelcilik.com',
      address: 'Erdek, Balikesir',
      city: 'Erdek / Balikesir',
      tagline: 'Erdek merkezli coklu isletme ve konaklama grubu',
      description: 'Han Otelcilik; Erdek merkezde konaklama, yeme icme ve gece hayati operasyonlarini tek bir kurumsal cati altinda toplayan coklu isletme yapisidir.',
      reservationNote: 'Tum talepler merkez ofis tarafindan ilgili isletmeye yonlendirilir.',
      whatsapp: '+90 537 696 30 30',
      highlights: [
        '3 ayri konaklama markasi',
        '1 fast food restoran operasyonu',
        '1 pub ve gece hayati noktasi',
        'Merkezi operasyon ve tek cati yonetim'
      ]
    },
    businesses: [
      {
        id: 'mavi-inci-park-otel',
        type: 'hotel',
        name: 'Mavi Inci Park Otel',
        shortName: 'Mavi Inci',
        heroTag: 'Denize sifir butik sehir oteli',
        tagline: 'Erdek sahilinde modern, sakin ve merkezi konaklama',
        location: 'Erdek / Balikesir',
        address: 'Yali Mah. Neyyire Sitki Cad. No:5, Erdek / Balikesir',
        phone: '+90 537 696 30 30',
        email: 'rezervasyon@maviinciparkotel.com',
        website: '',
        accent: '#2f6f8d',
        cover: 'linear-gradient(135deg, #174055 0%, #4f93b3 48%, #f1e2c7 100%)',
        summary: 'Kaynaklarda 2015 cikisli, 13 odali ve Erdek merkezde denize sifir konumlanan bir butik otel olarak geciyor.',
        description: 'Mavi Inci Park Otel; Erdek merkezde deniz kiyisina yakin konumu, 13 odali butik yapisi ve merkezi operasyon kolayligi ile gruptaki sehir oteli karakterini temsil eder. Tatilhatti ve Etstur listelemelerinde denize sifir konumu, teras kullanimi ve secili odalarda sauna veya jakuzi detaylari one cikiyor.',
        highlights: [
          '13 odali butik konaklama olcegi',
          'Erdek merkezde sahile yurumelik konum',
          'Teras, kahvalti ve secili premium oda detaylari'
        ],
        features: [
          'Merkezi rezervasyon yonetimine uygun butik oda envanteri',
          'Denize sifir ve merkezle dogrudan iliskili lokasyon',
          'Standart, buyuk oda ve premium segment oda karmasi'
        ],
        stats: [
          { label: 'Oda Sayisi', value: '13 oda' },
          { label: 'Konum', value: 'Erdek merkez' },
          { label: 'Acik Bilgi', value: '2015 cikisli' }
        ],
        rooms: [
          { name: 'Standart Oda', meta: '24 m2 | 2 yetiskin', price: '4.700 TL', note: 'Butik olcekte dengeli fiyat segmenti' },
          { name: 'Standart Buyuk Oda', meta: '32 m2 | 3 yetiskin', price: '5.900 TL', note: 'Aile ve genis oda talebine uygun' },
          { name: 'Deniz Manzarali Delux', meta: '34 m2 | 3 yetiskin', price: '7.600 TL', note: 'Manzara ve premium konaklama odagi' }
        ],
        offerings: [],
        sources: [
          { label: 'Etstur', url: 'https://www.etstur.com/Mavi-Inci-Park-Otel' },
          { label: 'Tatilhatti', url: 'https://www.tatilhatti.com/balikesir/erdek/mavi-inci-park-otel' },
          { label: 'Kapidag Net', url: 'https://kapidag.net/yer/mavi-inci-park-otel/' }
        ]
      },
      {
        id: 'gulplaj-hotel',
        type: 'hotel',
        name: 'Gulplaj Hotel',
        shortName: 'Gulplaj',
        heroTag: 'Aile yonetimli sahil oteli',
        tagline: 'Denize sifir, tum odalari deniz goren Erdek oteli',
        location: 'Erdek / Balikesir',
        address: 'Erdek sahil bandi, Erdek / Balikesir',
        phone: '+90 537 527 49 59',
        email: 'info@hotelgulplaj.com',
        website: 'https://www.hotelgulplaj.com/',
        accent: '#1f5d7f',
        cover: 'linear-gradient(135deg, #163a4a 0%, #2f7ea6 46%, #f5e6cc 100%)',
        summary: 'Resmi sitesinde tum odalarin deniz gordugu, ozel plaj kullanimli ve aile yonetimli bir Erdek oteli olarak tanitiliyor.',
        description: 'Gulplaj Hotel; resmi sitesinde aile yonetimi, tum odalarin deniz gormesi ve denize sifir konumuyla one cikiyor. Balnet ve Etstur listelemelerinde ozel plaj, acik bufe kahvalti ve restoran operasyonu bilgileri yer aliyor. Han Otelcilik portfoyunde deniz tatili odakli aile oteli pozisyonunda kurgulaniyor.',
        highlights: [
          'Tum odalar deniz goruyor',
          'Denize sifir ve ozel plaj kullanimli',
          'Aile yonetimi ve restoran destekli hizmet'
        ],
        features: [
          'Acik bufe kahvalti ve restoran akisi',
          'Sahil bandinda aile odakli konaklama deneyimi',
          'Plaj kullanimi ve restoran operasyonu ile tumlesik model'
        ],
        stats: [
          { label: 'Konum', value: 'Sahil bandi' },
          { label: 'Oda Yapisi', value: 'Tum odalar deniz gorur' },
          { label: 'Temas', value: 'Aile yonetimi' }
        ],
        rooms: [
          { name: 'Standart Deniz Manzarali', meta: '16-18 m2 | 2 kisi', price: 'Panelden girilir', note: 'Tum odalarin deniz gormesi temel vaadi' },
          { name: 'Aile Oda', meta: '2+1 veya 3 kisi', price: 'Panelden girilir', note: 'Aile konaklamasi icin planlanir' },
          { name: 'Balkonlu Oda', meta: 'Deniz cephesi', price: 'Panelden girilir', note: 'Sahil deneyimini odanin icine tasir' }
        ],
        offerings: [],
        sources: [
          { label: 'Resmi Site', url: 'https://www.hotelgulplaj.com/' },
          { label: 'Balnet', url: 'https://balnet.net/hotel-gulplaj/' },
          { label: 'Etstur', url: 'https://www.etstur.com/Gulplaj-Hotel' }
        ]
      },
      {
        id: 'villa-ece-pansiyon',
        type: 'hotel',
        name: 'Villa Ece Pansiyon',
        shortName: 'Villa Ece',
        heroTag: 'Yarim pansiyon sahil pansiyonu',
        tagline: 'Erdek sahilde denize yakin pansiyon ve aile konaklamasi',
        location: 'Erdek / Balikesir',
        address: 'Sahil Mah. Sehit Mehmet Sok. No:1/1, Erdek / Balikesir',
        phone: '+90 538 068 58 99',
        email: 'erdekvillaece@gmail.com',
        website: 'https://www.villaece.com/',
        accent: '#3c6e61',
        cover: 'linear-gradient(135deg, #264c46 0%, #5da291 45%, #f1e0c4 100%)',
        summary: 'Resmi sitede denize sifir, yarim pansiyon veya oda kahvalti secenekli ve merkez yurume mesafesinde bir pansiyon olarak sunuluyor.',
        description: 'Villa Ece Pansiyon; resmi sitesinde Erdek merkez yurume mesafesinde, denize sifir bir villa veya pansiyon olarak konumlaniyor. Iletisim sayfasinda kendi adresi ve telefonu yer aliyor; ana sayfasinda ise Gul Plaj Hotel ve Mavi Inci Park Otel diger tesislerimiz olarak gosteriliyor. Bu nedenle Han Otelcilik altindaki coklu portfoyun aile pansiyonu halkasini olusturuyor.',
        highlights: [
          'Denize sifir pansiyon karakteri',
          'Merkeze yurumelik ve aile odakli yerlesim',
          'Yarim pansiyon veya oda kahvalti secenekleri'
        ],
        features: [
          'Standart, dort kisilik ve bes kisilik oda karmasi',
          'Restoran, teras ve bahce kullanimi',
          'Tek merkezden yonetilen aile konaklamasi modeli'
        ],
        stats: [
          { label: 'Konum', value: 'Denize sifir' },
          { label: 'Model', value: 'Pansiyon / yarim pansiyon' },
          { label: 'Baglanti', value: 'Diger tesislerle birlikte' }
        ],
        rooms: [
          { name: 'Standart Oda', meta: '15 m2 | 2 kisi', price: 'Panelden girilir', note: 'Kisa konaklama ve cift odakli' },
          { name: 'Dort Kisilik Oda', meta: 'Aile duzeni', price: 'Panelden girilir', note: 'Aileler icin daha islevsel kapasite' },
          { name: 'Bes Kisilik Oda', meta: 'Genis aile', price: 'Panelden girilir', note: 'Uzun tatil ve genis aile ihtiyaci' }
        ],
        offerings: [],
        sources: [
          { label: 'Resmi Site', url: 'https://www.villaece.com/' },
          { label: 'Iletisim Sayfasi', url: 'https://www.villaece.com/iletisim/' },
          { label: 'Etstur', url: 'https://www.etstur.com/Villa-Ece-Pansiyon' }
        ]
      },
      {
        id: 'han-fast-food',
        type: 'fastfood',
        name: 'Smile Foodhouse',
        shortName: 'Smile Foodhouse',
        heroTag: 'Erdek icin hizli servis restoran markasi',
        tagline: 'Otel misafirleri ve sehir trafigi icin modern hizli servis noktasi',
        location: 'Erdek / Balikesir',
        address: 'Erdek merkez operasyon noktasi - panelden guncellenebilir',
        phone: '+90 537 696 30 30',
        email: 'food@hanotelcilik.com',
        website: '',
        accent: '#c7642c',
        cover: 'linear-gradient(135deg, #5d2f16 0%, #c7642c 44%, #f5d9b9 100%)',
        summary: 'Smile Foodhouse, Han Otelcilik icindeki hizli servis restoran markasi olarak konumlandirildi.',
        description: 'Smile Foodhouse, grubun konaklama disi yeme icme operasyonunu tasiyan hizli servis restoran markasidir. Erdek merkez akisi icinde paket servis, hizli masa devri ve otel misafirlerine capraz satis yapabilecek sekilde konumlandirildi.',
        highlights: [
          'Marka kimligi ve menu yapisi panelden yonetilebilir',
          'Otel misafirlerine hizli servis entegrasyonu',
          'Paket servis ve gece gec saat operasyonu kurgusu'
        ],
        features: [
          'Burger, wrap, box menu ve gece paketi akisi',
          'Merkezi operasyonla birden fazla tesise servis senaryosu',
          'Kampanya ve menulerin panelden kolay guncellenmesi'
        ],
        stats: [
          { label: 'Tip', value: 'Fast Food' },
          { label: 'Model', value: 'Hizli servis + paket' },
          { label: 'Durum', value: 'Smile Foodhouse markasi aktif' }
        ],
        rooms: [],
        offerings: [
          { name: 'Signature Burger Menu', meta: 'Burger + patates + icecek', price: 'Panelden girilir', note: 'Acilis kampanyasi icin uygun lider urun' },
          { name: 'Wrap & Bowl', meta: 'Hafif menuler', price: 'Panelden girilir', note: 'Gunduz ve sahil trafigine uygun' },
          { name: 'Gece Menusu', meta: 'Gece acik paket servis', price: 'Panelden girilir', note: 'Pub cikis trafigi ile capraz satar' }
        ],
        sources: []
      },
      {
        id: 'han-pub',
        type: 'pub',
        name: 'Han Pub',
        shortName: 'Pub',
        heroTag: 'Calisma adi ile planlanan sosyal gece hayati noktasi',
        tagline: 'Erdek aksam akisi icin pub ve sosyal bulusma mekani',
        location: 'Erdek / Balikesir',
        address: 'Erdek merkez operasyon noktasi - panelden guncellenebilir',
        phone: '+90 537 696 30 30',
        email: 'pub@hanotelcilik.com',
        website: '',
        accent: '#5f3c74',
        cover: 'linear-gradient(135deg, #271831 0%, #5f3c74 44%, #e2d5ea 100%)',
        summary: 'Kullanici tarafindan isim verilmedigi icin marka adi gecici olarak Han Pub olarak kurgulandi; panelden kolayca guncellenebilir.',
        description: 'Han Pub, grubun yeme icme tarafini gece ekonomisi ve sosyal etkinliklerle genisletmek icin tasarlandi. Otel misafirlerinin aksam deneyimini grup icinde tutan, yerel ziyaretciyi de iceri ceken bir sosyal mekan olarak ele alindi.',
        highlights: [
          'Calisma adi panelden degistirilebilir',
          'Otel konaklamasina gece hayati uzantisi kazandirir',
          'Etkinlik, maca gunu ve akustik gece senaryolarina uygun'
        ],
        features: [
          'Draft secenekleri, signature kokteyl ve etkinlik geceleri',
          'Masa rezervasyonu ve otel misafirine oncelikli giris kurgusu',
          'Merkez operasyondan kampanya ve etkinlik takvimi yonetimi'
        ],
        stats: [
          { label: 'Tip', value: 'Pub' },
          { label: 'Model', value: 'Etkinlik + gece hayati' },
          { label: 'Durum', value: 'Calisma adi ile hazir' }
        ],
        rooms: [],
        offerings: [
          { name: 'Signature Cocktail List', meta: 'Aksam servisi', price: 'Panelden girilir', note: 'Marka kimligini tasiyan icim hatti' },
          { name: 'Draft & Tap Selection', meta: 'Mac gunu ve sosyal aksamlar', price: 'Panelden girilir', note: 'Yuksek devirli servis kalemi' },
          { name: 'Akustik / DJ Night', meta: 'Haftalik etkinlik akisi', price: 'Panelden girilir', note: 'Takvim panelden yonetilir' }
        ],
        sources: []
      }
    ],
    inquiries: []
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function listify(value) {
    if (Array.isArray(value)) return value.map(function (item) { return String(item).trim(); }).filter(Boolean);
    if (typeof value === 'string') {
      return value.split(/\r?\n|,/).map(function (item) { return item.trim(); }).filter(Boolean);
    }
    return [];
  }

  function migrateLegacyEntry(entry) {
    if (!entry || entry.id !== 'han-fast-food') return entry;

    var next = Object.assign({}, entry);
    var legacy = {
      name: 'Han Fast Food',
      shortName: 'Fast Food',
      heroTag: 'Calisma adi ile acilan hizli servis restoran birimi',
      tagline: 'Otel misafirleri ve sokak trafigi icin hizli servis noktasi',
      summary: 'Kullanici tarafindan isim verilmedigi icin marka adi gecici olarak Han Fast Food olarak kurgulandi; panelden kolayca guncellenebilir.',
      description: 'Han Fast Food, grubun konaklama disi yeme icme operasyonu icin hazirlanan calisma markasidir. Erdek merkez akisi icinde paket servis, hizli masa devri ve otel misafirlerine capraz satis yapabilecek sekilde konumlandirildi.',
      highlights: [
        'Calisma adi panelden degistirilebilir',
        'Otel misafirlerine hizli servis entegrasyonu',
        'Paket servis ve gece gec saat operasyonu kurgusu'
      ],
      stats: [
        { label: 'Tip', value: 'Fast Food' },
        { label: 'Model', value: 'Hizli servis + paket' },
        { label: 'Durum', value: 'Calisma adi ile hazir' }
      ]
    };
    var current = defaults.businesses[3];

    Object.keys(legacy).forEach(function (key) {
      if (!next[key] || next[key] === legacy[key]) {
        next[key] = current[key];
      }
    });

    if (JSON.stringify(next.highlights || []) === JSON.stringify(legacy.highlights || [])) {
      next.highlights = current.highlights.slice();
    }

    if (JSON.stringify(next.stats || []) === JSON.stringify(legacy.stats || [])) {
      next.stats = current.stats.slice();
    }

    return next;
  }

  function hydrateEntry(entry) {
    entry = migrateLegacyEntry(entry);
    return Object.assign({
      id: '',
      type: 'hotel',
      name: '',
      shortName: '',
      heroTag: '',
      tagline: '',
      location: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      accent: '#1f5d7f',
      cover: 'linear-gradient(135deg, #16394a 0%, #4f93b3 48%, #f1e2c7 100%)',
      summary: '',
      description: '',
      highlights: [],
      features: [],
      stats: [],
      rooms: [],
      offerings: [],
      sources: []
    }, entry, {
      highlights: listify(entry.highlights),
      features: listify(entry.features),
      stats: Array.isArray(entry.stats) ? entry.stats : [],
      rooms: Array.isArray(entry.rooms) ? entry.rooms : [],
      offerings: Array.isArray(entry.offerings) ? entry.offerings : [],
      sources: Array.isArray(entry.sources) ? entry.sources : []
    });
  }

  function hydrateState(seed) {
    var next = clone(seed || defaults);
    next.group = Object.assign({}, defaults.group, next.group || {});
    next.group.highlights = listify(next.group.highlights || defaults.group.highlights);
    next.businesses = Array.isArray(next.businesses) && next.businesses.length ? next.businesses.map(hydrateEntry) : defaults.businesses.map(hydrateEntry);
    next.inquiries = Array.isArray(next.inquiries) ? next.inquiries : [];
    return next;
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return hydrateState(raw ? JSON.parse(raw) : defaults);
    } catch (error) {
      return hydrateState(defaults);
    }
  }

  function saveState(state) {
    var next = hydrateState(state);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function resolveState() {
    return loadState();
  }

  function getBusinessById(state, id) {
    var resolved = state || resolveState();
    return resolved.businesses.find(function (item) { return item.id === id; }) || null;
  }

  function listBusinesses(state) {
    var resolved = state || resolveState();
    return resolved.businesses.slice();
  }

  function listHotels(state) {
    return listBusinesses(state).filter(function (item) { return item.type === 'hotel'; });
  }

  function listVenues(state) {
    return listBusinesses(state).filter(function (item) { return item.type !== 'hotel'; });
  }

  function updateGroup(patch) {
    var state = resolveState();
    state.group = Object.assign({}, state.group, patch || {});
    return saveState(state);
  }

  function updateBusiness(id, patch) {
    var state = resolveState();
    state.businesses = state.businesses.map(function (item) {
      if (item.id !== id) return item;
      return hydrateEntry(Object.assign({}, item, patch || {}));
    });
    return saveState(state);
  }

  function addInquiry(payload) {
    var state = resolveState();
    state.inquiries.unshift(Object.assign({
      id: 'inq-' + Date.now(),
      createdAt: new Date().toISOString()
    }, payload || {}));
    return saveState(state);
  }

  function setAdminSession(active) {
    if (active) {
      window.localStorage.setItem(LOGIN_KEY, 'true');
    } else {
      window.localStorage.removeItem(LOGIN_KEY);
    }
  }

  function hasAdminSession() {
    return window.localStorage.getItem(LOGIN_KEY) === 'true';
  }

  window.HanGroupData = {
    storageKey: STORAGE_KEY,
    defaults: defaults,
    resolveState: resolveState,
    saveState: saveState,
    getBusinessById: getBusinessById,
    listBusinesses: listBusinesses,
    listHotels: listHotels,
    listVenues: listVenues,
    updateGroup: updateGroup,
    updateBusiness: updateBusiness,
    addInquiry: addInquiry,
    setAdminSession: setAdminSession,
    hasAdminSession: hasAdminSession
  };
})(window);
