
(function () {
  const SharedData = window.MaviInciData || null;
  const STORAGE_KEY = SharedData ? SharedData.storageKey : 'mavi-inci-admin-state-v1';
  const LOGIN_KEY = 'mavi-inci-admin-session-v1';

  const defaults = {
    roomCatalogVersion: '2026-03-23-mavi-inci-blue-v1',
    hotel: {
      name: 'Mavi Inci Park Otel',
      phone: '+90 266 000 00 00',
      email: 'rezervasyon@maviinciparkotel.com',
      address: 'Erdek Sahil Yolu, Balikesir',
      description: 'Denize sifir butik otel deneyimi.',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      breakfastHours: '08:00 - 10:30',
      petFriendly: false,
      airportTransfer: true,
      beachService: true,
      onlineBooking: true,
      whatsappNumber: '+90 555 000 00 00',
      instagram: '@maviinciparkotel'
    },
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
        amenities: 'Bahce esintisi, klima, minibar, Wi-Fi',
        notes: 'Mavi beyaz dokularla sakin ve ferah bir konaklama.'
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
        amenities: 'Genis yasam alani, oturma kosesi, klima, Wi-Fi',
        notes: 'Daha acik hacim ve daha rahat bir aile akisi isteyenler icin.'
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
        amenities: 'Ozel balkon, deniz manzarasi, espresso kosesi',
        notes: 'Manzara odakli, daha ozel bir kacamak isteyenler icin.'
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
        amenities: 'Genis yatak, lounge kosesi, premium set-up',
        notes: 'Daha ozel ve daha zarif bir premium konaklama hissi sunar.'
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
        amenities: 'Akilli depolama, Wi-Fi, klima, calisma masasi',
        notes: 'Yalniz seyahat eden misafirler icin sade ve huzurlu.'
      }
    ],
    seasonalPricing: [
      { id: uid(), title: 'Yaz Sezonu', start: futureDate(10), end: futureDate(75), multiplier: 1.22, channel: 'Tum Kanallar', note: 'Okul tatili donemi talep artisi' },
      { id: uid(), title: 'Hafta Ici Avantaji', start: futureDate(1), end: futureDate(120), multiplier: 0.92, channel: 'Web Sitesi', note: 'Pzt-Per rezervasyonlari icin' }
    ],
    promotions: [
      { id: uid(), title: '3 Gece Kal 2 Gece Ode', code: 'MAVI3', discount: 33, status: 'active', note: 'Secili tarihlerde web rezervasyonuna ozel.' },
      { id: uid(), title: 'Erken Rezervasyon', code: 'ERDEK20', discount: 20, status: 'scheduled', note: 'Sezon oncesi kampanya' }
    ],
    gallery: [
      { id: uid(), title: 'Lobi', category: 'Mekan', alt: 'Otel lobisi', src: '', color: '#dce9ef' },
      { id: uid(), title: 'Deniz Manzarasi', category: 'Dis Mekan', alt: 'Deniz manzarasi', src: '', color: '#d8e6ee' },
      { id: uid(), title: 'Suit Oda', category: 'Oda', alt: 'Suit oda ic mekani', src: '', color: '#efe3d4' }
    ],
    reservations: [
      { id: uid(), guest: 'Ayse Demir', roomType: 'Standart Buyuk', checkIn: futureDate(7), checkOut: futureDate(10), adults: 2, children: 1, status: 'confirmed', source: 'Web Sitesi', amount: 17700, note: 'Bebek yatagi talebi' },
      { id: uid(), guest: 'Mert Kaya', roomType: 'Sultan Keyfi', checkIn: futureDate(14), checkOut: futureDate(16), adults: 2, children: 0, status: 'pending', source: 'Telefon', amount: 19000, note: 'Kutlama duzeni soruldu' },
      { id: uid(), guest: 'Selin Yildiz', roomType: 'Standart', checkIn: futureDate(3), checkOut: futureDate(5), adults: 1, children: 0, status: 'confirmed', source: 'Instagram', amount: 9000, note: 'Erken giris talebi' }
    ],
    availability: buildDefaultAvailability(),
    content: {
      heroTitle: 'Mavi Inci Park Otel',
      heroText: 'Denize sifir, mavi beyaz tonlarla zariflestirilmis ve huzurlu butik otel deneyimi.',
      bookingLabel: 'Hemen Rezervasyon Yap',
      seoTitle: 'Mavi Inci Park Otel | Erdek Butik Otel',
      seoDescription: 'Erdek sahilinde modern butik konaklama deneyimi.',
      highlights: ['Mavi beyaz tasarim dili', 'Denize sifir', 'Butik konfor', 'Yerel mutfak']
    },
    settings: {
      currency: 'TRY',
      taxRate: 10,
      minStay: 1,
      maxStay: 14,
      cancellationWindow: 3,
      automaticReply: true,
      maintenanceMode: false,
      showOnlyAvailable: true
    },
    activity: [
      { id: uid(), title: 'Deluxe fiyat guncellendi', time: 'Bugun 09:15', detail: 'Hafta sonu fiyatlari 7.100 TL olarak kaydedildi.' },
      { id: uid(), title: 'Yeni galeri gorseli hazirlandi', time: 'Bugun 10:30', detail: 'Lobi kategorisine yeni bir gorsel eklendi.' },
      { id: uid(), title: 'Rezervasyon onaylandi', time: 'Bugun 11:10', detail: 'Ayse Demir rezervasyonu confirmed olarak guncellendi.' }
    ]
  };

  let state = loadState();

  function uid() {
    return 'id-' + Math.random().toString(36).slice(2, 10);
  }

  function futureDate(offset) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return formatDate(date);
  }

  function formatDate(date) {
    return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-');
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function parseDate(value) {
    const parts = value.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: state.settings.currency || 'TRY',
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function buildDefaultAvailability() {
    const result = [];
    const statuses = ['available', 'available', 'pending', 'available', 'blocked', 'available', 'available', 'pending', 'available', 'available', 'available', 'blocked', 'available', 'pending'];
    for (let index = 0; index < 14; index += 1) {
      const date = futureDate(index + 1);
      const status = statuses[index];
      result.push({
        id: uid(),
        date: date,
        status: status,
        note: status === 'blocked' ? 'Bakim / kapali' : status === 'pending' ? 'Onay bekleyen talep' : 'Rezervasyona uygun'
      });
    }
    return result;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const seed = raw
        ? JSON.parse(raw)
        : SharedData && typeof SharedData.resolveSiteData === 'function'
        ? SharedData.resolveSiteData()
        : defaults;
      return hydrateState(seed);
    } catch (error) {
      return hydrateState(SharedData && typeof SharedData.resolveSiteData === 'function' ? SharedData.resolveSiteData() : defaults);
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function listify(value) {
    if (Array.isArray(value)) return value.map(function (item) { return String(item).trim(); }).filter(Boolean);
    if (typeof value === 'string') return value.split(/\r?\n|,/).map(function (item) { return item.trim(); }).filter(Boolean);
    return [];
  }

  function hydrateRoom(room) {
    const fallbackRooms = SharedData && SharedData.fallbackState ? SharedData.fallbackState.roomTypes || [] : [];
    const matched = fallbackRooms.find(function (item) {
      return item.id === room.id || item.short === room.short || item.name === room.name;
    }) || {};

    return Object.assign({
      id: room.id || matched.id || uid(),
      name: '',
      short: '',
      nightlyPrice: 0,
      weekendPrice: 0,
      capacityAdults: 2,
      capacityChildren: 0,
      totalRooms: 1,
      availableRooms: 1,
      status: 'active',
      featured: false,
      amenities: '',
      notes: '',
      size: '24 m2',
      bed: 'Queen bed',
      view: 'Ic avlu',
      bathroom: 'Standart banyo',
      story: '',
      highlights: [],
      includes: []
    }, matched, room, {
      id: room.id || matched.id || uid(),
      highlights: listify(room.highlights || matched.highlights),
      includes: listify(room.includes || matched.includes)
    });
  }

  function hydrateGalleryItem(item) {
    const fallbackGallery = SharedData && SharedData.fallbackState ? SharedData.fallbackState.gallery || [] : [];
    const matched = fallbackGallery.find(function (entry) {
      return entry.id === item.id || String(entry.title || '').toLowerCase() === String(item.title || '').toLowerCase();
    }) || {};

    return Object.assign({
      id: item.id || matched.id || uid(),
      title: '',
      category: 'Galeri',
      alt: '',
      src: '',
      color: '#dde8ef',
      roomIds: []
    }, matched, item, {
      id: item.id || matched.id || uid(),
      roomIds: listify(item.roomIds || matched.roomIds)
    });
  }

  function hydrateReservation(item) {
    return Object.assign({
      id: item.id || uid(),
      reference: '',
      guest: '',
      roomType: '',
      checkIn: futureDate(1),
      checkOut: futureDate(2),
      adults: 2,
      children: 0,
      status: 'pending',
      source: 'Web Sitesi',
      amount: 0,
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      promoCode: '',
      arrivalTime: '',
      contactMethod: 'Telefon',
      email: '',
      phone: '',
      transferRequest: false,
      lateArrival: false,
      note: '',
      submittedAt: ''
    }, item, {
      id: item.id || uid()
    });
  }

  function hydrateState(source) {
    const fallback = SharedData && SharedData.fallbackState ? clone(SharedData.fallbackState) : {};
    const incoming = source ? clone(source) : {};
    const base = clone(defaults);
    const roomCatalogVersion = (fallback.roomCatalogVersion || defaults.roomCatalogVersion);
    const roomCatalogMatches = incoming.roomCatalogVersion === roomCatalogVersion;

    base.hotel = Object.assign({}, fallback.hotel || {}, base.hotel, incoming.hotel || {});
    base.content = Object.assign({}, fallback.content || {}, base.content, incoming.content || {});
    base.settings = Object.assign({}, fallback.settings || {}, base.settings, incoming.settings || {});
    base.roomCatalogVersion = roomCatalogVersion;
    base.roomTypes = (
      roomCatalogMatches && Array.isArray(incoming.roomTypes) && incoming.roomTypes.length
        ? incoming.roomTypes
        : Array.isArray(fallback.roomTypes) && fallback.roomTypes.length
        ? fallback.roomTypes
        : base.roomTypes
    ).map(hydrateRoom);
    base.gallery = (
      roomCatalogMatches && Array.isArray(incoming.gallery) && incoming.gallery.length
        ? incoming.gallery
        : Array.isArray(fallback.gallery) && fallback.gallery.length
        ? fallback.gallery
        : base.gallery
    ).map(hydrateGalleryItem);
    base.promotions = Array.isArray(incoming.promotions) && incoming.promotions.length ? clone(incoming.promotions) : (Array.isArray(fallback.promotions) && fallback.promotions.length ? clone(fallback.promotions) : clone(base.promotions));
    base.seasonalPricing = Array.isArray(incoming.seasonalPricing) && incoming.seasonalPricing.length ? clone(incoming.seasonalPricing) : (Array.isArray(fallback.seasonalPricing) && fallback.seasonalPricing.length ? clone(fallback.seasonalPricing) : clone(base.seasonalPricing));
    base.availability = Array.isArray(incoming.availability) && incoming.availability.length ? clone(incoming.availability) : (Array.isArray(fallback.availability) && fallback.availability.length ? clone(fallback.availability) : clone(base.availability));
    base.reservations = (Array.isArray(incoming.reservations) ? incoming.reservations : base.reservations).map(hydrateReservation);
    base.activity = Array.isArray(incoming.activity) && incoming.activity.length ? incoming.activity : base.activity;
    return base;
  }

  function saveState(note) {
    if (note) {
      state.activity.unshift({ id: uid(), title: note, time: 'Simdi', detail: 'Admin panelinde yapilan guncelleme kaydedildi.' });
      state.activity = state.activity.slice(0, 8);
    }
    state = hydrateState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loggedIn() {
    return localStorage.getItem(LOGIN_KEY) === 'true';
  }

  function setLoggedIn(value) {
    localStorage.setItem(LOGIN_KEY, value ? 'true' : 'false');
  }

  function totalRevenue() {
    return state.reservations.reduce(function (sum, item) { return item.status === 'confirmed' ? sum + item.amount : sum; }, 0);
  }

  function occupancyRate() {
    const total = state.roomTypes.reduce(function (sum, room) { return sum + room.totalRooms; }, 0);
    const available = state.roomTypes.reduce(function (sum, room) { return sum + room.availableRooms; }, 0);
    if (!total) return 0;
    return Math.round(((total - available) / total) * 100);
  }

  function statusBadge(status) {
    const map = {
      confirmed: ['Onaylandi', 'status-confirmed'], pending: ['Beklemede', 'status-pending'], blocked: ['Kapali', 'status-blocked'],
      draft: ['Taslak', 'status-draft'], active: ['Aktif', 'status-confirmed'], scheduled: ['Planli', 'status-pending'],
      passive: ['Pasif', 'status-blocked'], available: ['Musait', 'status-confirmed']
    };
    const data = map[status] || [status, 'status-draft'];
    return '<span class="status-badge ' + data[1] + '">' + data[0] + '</span>';
  }

  function linkedRoomNames(roomIds) {
    const ids = listify(roomIds);
    if (!ids.length) return 'Tum alanlar';
    return ids.map(function (roomId) {
      const room = state.roomTypes.find(function (item) { return item.id === roomId; });
      return room ? (room.short || room.name) : roomId;
    }).join(', ');
  }

  function renderSidebar() {
    return `
      <aside class="sidebar">
        <div class="brand-box">
          <strong>${escapeHtml(state.hotel.name)}</strong>
          <span>Otel operasyonlari, fiyat, galeri, icerik ve rezervasyon yonetimi icin kapsamli admin paneli.</span>
        </div>
        <div class="sidebar-section">
          <p class="sidebar-title">Yonetim Alanlari</p>
          <nav class="nav-group" aria-label="Admin bolumleri">
            <a href="#dashboard">Genel Durum</a>
            <a href="#rooms">Odalar ve Fiyatlar</a>
            <a href="#availability">Musaitlik</a>
            <a href="#reservations">Rezervasyonlar</a>
            <a href="#gallery">Galeri</a>
            <a href="#promotions">Kampanyalar</a>
            <a href="#content">Icerik</a>
            <a href="#settings">Ayarlar</a>
          </nav>
        </div>
        <div class="sidebar-section">
          <p class="sidebar-title">Hizli Erisim</p>
          <div class="nav-group">
            <a class="quick-link" href="./index.html">On Yuzu Ac</a>
            <a class="quick-link" href="#" data-action="open-add-reservation">Yeni Rezervasyon Ekle</a>
            <a class="quick-link" href="#" data-action="export-state">Tum Veriyi Disa Aktar</a>
            <a class="quick-link" href="#" data-action="export-deploy-state">Deploy Icin JS Disa Aktar</a>
            <a class="quick-link" href="#" data-action="reset-demo">Demo Veriyi Yenile</a>
          </div>
        </div>
        <div class="sidebar-footer">
          <strong>Canli Not</strong>
          <div class="sidebar-note">Bu panel verileri tarayici uzerinde localStorage ile saklar. Canli linkte ayni veriyi gostermek icin "Deploy Icin JS Disa Aktar" secenegiyle site-state.override.js dosyasini uretip proje icine koyabilirsiniz.</div>
        </div>
      </aside>
    `;
  }

  function renderKPIs() {
    const pendingReservations = state.reservations.filter(function (item) { return item.status === 'pending'; }).length;
    const webReservations = state.reservations.filter(function (item) { return item.source === 'Web Sitesi'; }).length;
    return `
      <section id="dashboard" class="grid kpi-grid">
        <article class="kpi-card"><strong class="metric-value">${formatMoney(totalRevenue())}</strong><span class="metric-label">Onayli rezervasyonlardan beklenen gelir</span><span class="metric-pill">Gelir Takibi</span></article>
        <article class="kpi-card"><strong class="metric-value">%${occupancyRate()}</strong><span class="metric-label">Toplam oda kapasitesine gore doluluk</span><span class="metric-pill">Doluluk Orani</span></article>
        <article class="kpi-card"><strong class="metric-value">${pendingReservations}</strong><span class="metric-label">Onay bekleyen rezervasyon</span><span class="metric-pill">Aksiyon Gerekli</span></article>
        <article class="kpi-card"><strong class="metric-value">${webReservations}</strong><span class="metric-label">Web sitesi kaynakli rezervasyon / talep</span><span class="metric-pill">On Yuz Senkronu</span></article>
      </section>
    `;
  }
  function renderRooms() {
    return `
      <section id="rooms" class="panel-card">
        <div class="panel-header"><div class="section-heading"><h2>Oda, Fiyat ve Envanter Yonetimi</h2><p class="section-subtitle">Her oda tipi icin fiyat, kapasite, stok, ozel not ve odanin one cikip cikmayacagini duzenleyin.</p></div><div class="inline-actions"><button class="button button-accent" data-action="open-room-modal">Yeni Oda Tipi</button></div></div>
        <div class="room-grid grid">${state.roomTypes.map(renderRoomCard).join('')}</div>
      </section>
    `;
  }

  function renderRoomCard(room) {
    return `
      <article class="room-card">
        <div class="panel-header"><div><h3>${escapeHtml(room.name)}</h3><div class="room-meta">${escapeHtml(room.amenities)}</div></div>${statusBadge(room.status)}</div>
        <div class="price-line"><span>Hafta ici</span><strong>${formatMoney(room.nightlyPrice)}</strong></div>
        <div class="price-line"><span>Hafta sonu</span><strong>${formatMoney(room.weekendPrice)}</strong></div>
        <div class="price-line"><span>Toplam Oda</span><strong>${room.totalRooms}</strong></div>
        <div class="price-line"><span>Musait Oda</span><strong>${room.availableRooms}</strong></div>
        <div class="price-line"><span>Kapasite</span><strong>${room.capacityAdults} yetiskin / ${room.capacityChildren} cocuk</strong></div>
        <div class="price-line"><span>Detay</span><strong>${escapeHtml(room.size || '-')} | ${escapeHtml(room.view || '-')}</strong></div>
        <div class="price-line"><span>Yatak</span><strong>${escapeHtml(room.bed || '-')}</strong></div>
        <p class="room-meta">${escapeHtml(room.notes || 'Not bulunmuyor.')}</p>
        <div class="status-text">${escapeHtml((room.highlights || []).slice(0, 2).join(' | ') || room.story || '')}</div>
        <div class="table-actions"><button class="small-button" data-action="edit-room" data-id="${room.id}">Duzenle</button><button class="small-button" data-action="toggle-room-status" data-id="${room.id}">${room.status === 'active' ? 'Pasife Al' : 'Aktif Et'}</button></div>
      </article>
    `;
  }

  function renderAvailability() {
    return `
      <section id="availability" class="panel-card">
        <div class="panel-header"><div class="section-heading"><h2>Musaitlik Takvimi</h2><p class="section-subtitle">Gun bazli musait, beklemede veya kapali durumlarini yonetin.</p></div><div class="inline-actions"><button class="button button-secondary" data-action="mark-all-available">Tumunu Musait Yap</button></div></div>
        <div class="legend-row"><span class="legend-item"><span class="dot" style="color:#157347"></span> Musait</span><span class="legend-item"><span class="dot" style="color:#b26a00"></span> Beklemede</span><span class="legend-item"><span class="dot" style="color:#b42318"></span> Kapali</span></div>
        <div class="calendar-grid"><div class="calendar-head">Pzt</div><div class="calendar-head">Sal</div><div class="calendar-head">Car</div><div class="calendar-head">Per</div><div class="calendar-head">Cum</div><div class="calendar-head">Cmt</div><div class="calendar-head">Paz</div>${state.availability.map(renderAvailabilityCard).join('')}</div>
      </section>
    `;
  }

  function renderAvailabilityCard(item) {
    const map = { available: ['Musait', 'status-confirmed'], pending: ['Beklemede', 'status-pending'], blocked: ['Kapali', 'status-blocked'] };
    const label = map[item.status] || map.available;
    return `<article class="calendar-day"><strong>${formatShortDate(item.date)}</strong><span class="calendar-status ${label[1]}">${label[0]}</span><small>${escapeHtml(item.note)}</small><div class="table-actions" style="margin-top:12px;"><button class="small-button" data-action="cycle-availability" data-id="${item.id}">Durum Degistir</button></div></article>`;
  }

  function renderReservations() {
    return `
      <section id="reservations" class="panel-card">
        <div class="panel-header"><div class="section-heading"><h2>Rezervasyon ve Talep Yonetimi</h2><p class="section-subtitle">Kaynak, durum, konaklama tutari ve misafir notlariyla birlikte tum rezervasyonlari yonetin.</p></div><div class="inline-actions"><button class="button button-primary" data-action="open-add-reservation">Yeni Rezervasyon</button></div></div>
        <div class="table-note">Onay, bekleme, check-in planlama ve gelir takibini tek tabloda toplayin.</div>
        <table class="data-table"><thead><tr><th>Misafir</th><th>Konaklama</th><th>Kaynak</th><th>Tutar</th><th>Durum</th><th>Islem</th></tr></thead><tbody>${state.reservations.map(renderReservationRow).join('')}</tbody></table>
      </section>
    `;
  }

  function renderReservationRow(item) {
    return `<tr><td><strong>${escapeHtml(item.guest)}</strong><div class="status-text">${item.adults} yetiskin / ${item.children} cocuk</div><div class="status-text">${item.reference ? 'Ref: ' + escapeHtml(item.reference) : ''}</div><div class="status-text">${escapeHtml(item.phone || item.email || '')}</div><div class="status-text">${escapeHtml(item.note || '')}</div></td><td><strong>${escapeHtml(item.roomType)}</strong><div class="status-text">${formatShortDate(item.checkIn)} - ${formatShortDate(item.checkOut)}</div><div class="status-text">${item.arrivalTime ? 'Varis: ' + escapeHtml(item.arrivalTime) : ''}</div><div class="status-text">${item.promoCode ? 'Kod: ' + escapeHtml(item.promoCode) : ''}</div></td><td>${escapeHtml(item.source)}</td><td>${formatMoney(item.amount)}</td><td>${statusBadge(item.status)}</td><td><div class="table-actions"><button class="small-button" data-action="toggle-reservation" data-id="${item.id}">Durum Degistir</button><button class="small-button" data-action="delete-reservation" data-id="${item.id}">Sil</button></div></td></tr>`;
  }

  function renderGallery() {
    return `
      <section id="gallery" class="panel-card">
        <div class="panel-header"><div class="section-heading"><h2>Galeri ve Foto Yukleme</h2><p class="section-subtitle">Kategori, alt metin ve bagli oda bilgisi girilen gorseller on yuz galeri ve oda detay sayfalarina ayni anda yansir.</p></div></div>
        <div class="upload-box"><label class="file-button" for="gallery-upload">Foto Yukle</label><input id="gallery-upload" type="file" accept="image/*" multiple /><p class="helper-text">Bir veya birden fazla gorsel secin. Yuklenen gorseller admin panel galerisinde hemen gorunur; oda baglantisini daha sonra duzenleyebilirsiniz.</p></div>
        <div class="gallery-grid grid" style="margin-top:18px;">${state.gallery.map(renderGalleryCard).join('')}</div>
      </section>
    `;
  }

  function renderGalleryCard(item) {
    const thumb = item.src ? '<img class="gallery-thumb" src="' + item.src + '" alt="' + escapeHtml(item.alt || item.title) + '">' : '<div class="gallery-thumb" style="background:' + item.color + ';"></div>';
    return `<article class="gallery-card">${thumb}<h3>${escapeHtml(item.title)}</h3><div class="gallery-meta">${escapeHtml(item.category)} | Alt metin: ${escapeHtml(item.alt || '-')}</div><div class="gallery-meta">Bagli odalar: ${escapeHtml(linkedRoomNames(item.roomIds))}</div><div class="gallery-meta">${item.src ? 'Gercek gorsel yuklu' : 'Placeholder renk aktif'}</div><div class="table-actions" style="margin-top:12px;"><button class="small-button" data-action="edit-gallery" data-id="${item.id}">Duzenle</button><button class="small-button" data-action="delete-gallery" data-id="${item.id}">Sil</button></div></article>`;
  }

  function renderPromotions() {
    return `
      <section id="promotions" class="grid two-column">
        <article class="panel-card"><div class="panel-header"><div class="section-heading"><h2>Kampanya ve Kuponlar</h2><p class="section-subtitle">Indirim kodlari, kampanya notlari ve durum yonetimi.</p></div><button class="button button-accent" data-action="add-promo">Yeni Kampanya</button></div><div class="card-grid">${state.promotions.map(renderPromotionCard).join('')}</div></article>
        <article class="panel-card"><div class="panel-header"><div class="section-heading"><h2>Sezonluk Fiyat Kurallari</h2><p class="section-subtitle">Belirli tarih araliklarina carpani uygulayarak fiyatlari yonetin.</p></div><button class="button button-secondary" data-action="add-seasonal">Sezon Ekle</button></div><div class="card-grid">${state.seasonalPricing.map(renderSeasonCard).join('')}</div></article>
      </section>
    `;
  }

  function renderPromotionCard(item) {
    return `<article class="mini-card"><div class="panel-header"><div><h3>${escapeHtml(item.title)}</h3><div class="status-text">Kod: ${escapeHtml(item.code)}</div></div>${statusBadge(item.status)}</div><div class="price-line"><span>Indirim</span><strong>%${item.discount}</strong></div><p class="status-text">${escapeHtml(item.note)}</p><div class="table-actions"><button class="small-button" data-action="toggle-promo" data-id="${item.id}">Durum Degistir</button></div></article>`;
  }

  function renderSeasonCard(item) {
    return `<article class="mini-card"><h3>${escapeHtml(item.title)}</h3><div class="price-line"><span>Tarih</span><strong>${formatShortDate(item.start)} - ${formatShortDate(item.end)}</strong></div><div class="price-line"><span>Carpan</span><strong>x${item.multiplier}</strong></div><div class="price-line"><span>Kanal</span><strong>${escapeHtml(item.channel)}</strong></div><p class="status-text">${escapeHtml(item.note)}</p></article>`;
  }

  function renderContentSection() {
    return `
      <section id="content" class="panel-card">
        <div class="panel-header"><div class="section-heading"><h2>On Yuz Icerik Yonetimi</h2><p class="section-subtitle">Hero metinleri, SEO alanlari ve one cikan vurgulari duzenleyin.</p></div></div>
        <form id="content-form" class="form-grid two">
          <div class="field"><label for="heroTitle">Hero Baslik</label><input id="heroTitle" name="heroTitle" value="${escapeAttr(state.content.heroTitle)}" /></div>
          <div class="field"><label for="bookingLabel">Rezervasyon Buton Metni</label><input id="bookingLabel" name="bookingLabel" value="${escapeAttr(state.content.bookingLabel)}" /></div>
          <div class="field" style="grid-column:1 / -1;"><label for="heroText">Hero Aciklama</label><textarea id="heroText" name="heroText">${escapeHtml(state.content.heroText)}</textarea></div>
          <div class="field"><label for="seoTitle">SEO Title</label><input id="seoTitle" name="seoTitle" value="${escapeAttr(state.content.seoTitle)}" /></div>
          <div class="field"><label for="seoDescription">SEO Description</label><input id="seoDescription" name="seoDescription" value="${escapeAttr(state.content.seoDescription)}" /></div>
          <div class="field" style="grid-column:1 / -1;"><label for="highlights">One Cikan Ozellikler</label><textarea id="highlights" name="highlights">${escapeHtml(state.content.highlights.join('\n'))}</textarea><div class="form-hint">Her satira bir ozellik yazin.</div></div>
          <div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Icerigi Kaydet</button></div>
        </form>
      </section>
    `;
  }
  function renderSettings() {
    return `
      <section id="settings" class="grid two-column">
        <article class="panel-card">
          <div class="panel-header"><div class="section-heading"><h2>Otel ve Iletisim Bilgileri</h2><p class="section-subtitle">Temel marka ve operasyon bilgilerini guncelleyin.</p></div></div>
          <form id="hotel-form" class="form-grid two">
            <div class="field"><label for="hotelName">Otel Adi</label><input id="hotelName" name="name" value="${escapeAttr(state.hotel.name)}" /></div>
            <div class="field"><label for="hotelPhone">Telefon</label><input id="hotelPhone" name="phone" value="${escapeAttr(state.hotel.phone)}" /></div>
            <div class="field"><label for="hotelEmail">E-posta</label><input id="hotelEmail" name="email" value="${escapeAttr(state.hotel.email)}" /></div>
            <div class="field"><label for="whatsappNumber">WhatsApp</label><input id="whatsappNumber" name="whatsappNumber" value="${escapeAttr(state.hotel.whatsappNumber)}" /></div>
            <div class="field" style="grid-column:1 / -1;"><label for="hotelAddress">Adres</label><input id="hotelAddress" name="address" value="${escapeAttr(state.hotel.address)}" /></div>
            <div class="field" style="grid-column:1 / -1;"><label for="hotelDescription">Kisa Aciklama</label><textarea id="hotelDescription" name="description">${escapeHtml(state.hotel.description)}</textarea></div>
            <div class="field"><label for="checkInTime">Check-in</label><input id="checkInTime" name="checkInTime" value="${escapeAttr(state.hotel.checkInTime)}" /></div>
            <div class="field"><label for="checkOutTime">Check-out</label><input id="checkOutTime" name="checkOutTime" value="${escapeAttr(state.hotel.checkOutTime)}" /></div>
            <div class="field"><label for="breakfastHours">Kahvalti Saatleri</label><input id="breakfastHours" name="breakfastHours" value="${escapeAttr(state.hotel.breakfastHours)}" /></div>
            <div class="field"><label for="instagram">Instagram</label><input id="instagram" name="instagram" value="${escapeAttr(state.hotel.instagram)}" /></div>
            <div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Otel Bilgilerini Kaydet</button></div>
          </form>
        </article>
        <article class="panel-card">
          <div class="panel-header"><div class="section-heading"><h2>Sistem Ayarlari</h2><p class="section-subtitle">Rezervasyon, iptal ve gorunum tercihlerini kontrol edin.</p></div></div>
          <form id="settings-form" class="form-grid three">
            <div class="field"><label for="currency">Para Birimi</label><select id="currency" name="currency"><option value="TRY">TRY</option><option value="EUR">EUR</option><option value="USD">USD</option></select></div>
            <div class="field"><label for="taxRate">Vergi Orani (%)</label><input id="taxRate" name="taxRate" type="number" min="0" max="100" value="${state.settings.taxRate}" /></div>
            <div class="field"><label for="minStay">Minimum Gece</label><input id="minStay" name="minStay" type="number" min="1" value="${state.settings.minStay}" /></div>
            <div class="field"><label for="maxStay">Maksimum Gece</label><input id="maxStay" name="maxStay" type="number" min="1" value="${state.settings.maxStay}" /></div>
            <div class="field"><label for="cancellationWindow">Iptal Suresi (gun)</label><input id="cancellationWindow" name="cancellationWindow" type="number" min="0" value="${state.settings.cancellationWindow}" /></div>
            <div class="field"><label for="onlineBooking">Online Rezervasyon</label><select id="onlineBooking" name="onlineBooking"><option value="true">Acik</option><option value="false">Kapali</option></select></div>
            <div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Sistem Ayarlarini Kaydet</button></div>
          </form>
          <div class="settings-grid grid" style="margin-top:22px;">${renderToggleRow('petFriendly', 'Evcil hayvan kabul edilsin', state.hotel.petFriendly)}${renderToggleRow('airportTransfer', 'Transfer hizmeti aktif', state.hotel.airportTransfer)}${renderToggleRow('beachService', 'Plaj servisi aktif', state.hotel.beachService)}${renderToggleRow('automaticReply', 'Otomatik e-posta yaniti', state.settings.automaticReply)}${renderToggleRow('maintenanceMode', 'Bakim modu', state.settings.maintenanceMode)}${renderToggleRow('showOnlyAvailable', 'Sitede sadece musait odalar gosterilsin', state.settings.showOnlyAvailable)}</div>
        </article>
      </section>
    `;
  }

  function renderToggleRow(key, label, active) {
    return `<div class="mini-card settings-row"><div><strong>${label}</strong></div><button class="toggle ${active ? 'active' : ''}" type="button" data-action="toggle-setting" data-key="${key}" aria-pressed="${active}"></button></div>`;
  }

  function renderActivity() {
    return `
      <section class="panel-card">
        <div class="panel-header"><div class="section-heading"><h2>Son Islemler ve Operasyon Akisi</h2><p class="section-subtitle">Ekibin son guncellemeleri ve oncelikli isler.</p></div></div>
        <div class="grid two-column">
          <div class="timeline">${state.activity.map(function (item) { return '<article class="timeline-item"><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.detail) + '</p><div class="badge-row"><span class="badge">' + escapeHtml(item.time) + '</span></div></article>'; }).join('')}</div>
          <div class="card-grid"><article class="mini-card"><h3>Bugunku Oncelikler</h3><p class="helper-text">Bekleyen rezervasyonlari onayla, kapali gunleri kontrol et, hafta sonu fiyatlarini gozden gecir.</p></article><article class="mini-card"><h3>Kanal Performansi</h3><p class="helper-text">Web sitesi, telefon ve sosyal medya kaynakli talepleri karsilastirip donusum oranini takip et.</p></article><article class="mini-card"><h3>Operasyon Hatirlatmasi</h3><p class="helper-text">Check-in saati, housekeeping blokajlari ve transfer notlari gunluk olarak guncellenmeli.</p></article></div>
        </div>
      </section>
    `;
  }

  function renderDashboard() {
    return `${renderSidebar()}<div class="main-panel"><div class="topbar"><div><h1>Otel Admin Paneli</h1><p>Fiyat guncelleme, musaitlik, foto yukleme, rezervasyon takibi, kampanyalar ve on yuz icerik yonetimi tek merkezde. Acik site sekmeleri veri guncellemelerini otomatik algilar.</p></div><div class="topbar-actions"><button class="button button-secondary" data-action="save-all">Tum Degisiklikleri Kaydet</button><button class="button button-danger" data-action="logout">Cikis Yap</button></div></div><div class="grid">${renderKPIs()}${renderRooms()}${renderAvailability()}${renderReservations()}${renderGallery()}${renderPromotions()}${renderContentSection()}${renderSettings()}${renderActivity()}</div></div>`;
  }

  function renderLogin() {
    return `<div class="login-overlay"><div class="login-card"><h1>Mavi Inci Admin Girisi</h1><p class="login-note">Panel tarayicida yerel olarak calisir. Demo giris icin kullanici adini ve sifreyi girmeniz yeterli.</p><form id="login-form" class="form-grid" style="margin-top:20px;"><div class="field"><label for="username">Kullanici Adi</label><input id="username" name="username" autocomplete="username" value="admin" /></div><div class="field"><label for="password">Sifre</label><input id="password" name="password" type="password" autocomplete="current-password" value="1234" /></div><div class="form-actions"><button class="button button-primary" type="submit">Panele Gir</button><span class="helper-text">Demo giris: <strong>admin / 1234</strong></span></div><div class="error-message hidden" id="login-error">Giris bilgileri hatali.</div></form></div></div>`;
  }

  function render() {
    const root = document.getElementById('root');
    root.innerHTML = loggedIn() ? '<div class="admin-shell">' + renderDashboard() + '</div>' : renderLogin();
    bindEvents();
  }

  function bindEvents() {
    bindLogin();
    bindGeneralActions();
    bindForms();
    bindUpload();
  }

  function bindLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const username = form.username.value.trim();
      const password = form.password.value.trim();
      if (username === 'admin' && password === '1234') { setLoggedIn(true); render(); return; }
      document.getElementById('login-error').classList.remove('hidden');
    });
  }

  function bindGeneralActions() {
    document.querySelectorAll('[data-action]').forEach(function (button) { button.addEventListener('click', handleAction); });
  }

  function handleAction(event) {
    const action = event.currentTarget.getAttribute('data-action');
    const id = event.currentTarget.getAttribute('data-id');
    const key = event.currentTarget.getAttribute('data-key');
    if (action === 'logout') { setLoggedIn(false); render(); return; }
    if (action === 'save-all') { saveState('Tum panel verileri kaydedildi'); render(); return; }
    if (action === 'export-state') { exportState(); return; }
    if (action === 'export-deploy-state') { exportDeployState(); return; }
    if (action === 'reset-demo') { if (confirm('Tum panel verileri varsayilan demo durumuna donsun mu?')) { state = clone(defaults); saveState('Demo veri yenilendi'); render(); } return; }
    if (action === 'toggle-room-status') { const room = state.roomTypes.find(function (item) { return item.id === id; }); if (room) { room.status = room.status === 'active' ? 'passive' : 'active'; saveState(room.name + ' durum bilgisi guncellendi'); render(); } return; }
    if (action === 'edit-room') { openRoomModal(id); return; }
    if (action === 'open-room-modal') { openRoomModal(); return; }
    if (action === 'cycle-availability') { const item = state.availability.find(function (entry) { return entry.id === id; }); if (item) { item.status = nextAvailability(item.status); item.note = item.status === 'blocked' ? 'Bakim / kapali' : item.status === 'pending' ? 'Onay bekleyen talep' : 'Rezervasyona uygun'; saveState('Musaitlik takvimi guncellendi'); render(); } return; }
    if (action === 'mark-all-available') { state.availability.forEach(function (item) { item.status = 'available'; item.note = 'Rezervasyona uygun'; }); saveState('Tum takvim gunleri musait olarak guncellendi'); render(); return; }
    if (action === 'toggle-reservation') { const reservation = state.reservations.find(function (item) { return item.id === id; }); if (reservation) { reservation.status = reservation.status === 'pending' ? 'confirmed' : reservation.status === 'confirmed' ? 'blocked' : 'pending'; saveState(reservation.guest + ' rezervasyon durumu guncellendi'); render(); } return; }
    if (action === 'delete-reservation') { state.reservations = state.reservations.filter(function (item) { return item.id !== id; }); saveState('Rezervasyon kaydi silindi'); render(); return; }
    if (action === 'open-add-reservation') { openReservationModal(); return; }
    if (action === 'delete-gallery') { state.gallery = state.gallery.filter(function (item) { return item.id !== id; }); saveState('Galeri ogesi silindi'); render(); return; }
    if (action === 'edit-gallery') { openGalleryModal(id); return; }
    if (action === 'toggle-promo') { const promo = state.promotions.find(function (item) { return item.id === id; }); if (promo) { promo.status = promo.status === 'active' ? 'scheduled' : promo.status === 'scheduled' ? 'passive' : 'active'; saveState('Kampanya durumu guncellendi'); render(); } return; }
    if (action === 'add-promo') { openPromotionModal(); return; }
    if (action === 'add-seasonal') { openSeasonalModal(); return; }
    if (action === 'toggle-setting') { if (key in state.hotel) state.hotel[key] = !state.hotel[key]; else if (key in state.settings) state.settings[key] = !state.settings[key]; saveState('Ayar durumu degisti'); render(); }
  }
  function bindForms() {
    const hotelForm = document.getElementById('hotel-form');
    if (hotelForm) {
      hotelForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(hotelForm);
        Object.keys(state.hotel).forEach(function (key) { if (data.has(key)) state.hotel[key] = data.get(key); });
        saveState('Otel iletisim bilgileri guncellendi');
        render();
      });
    }

    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.currency.value = state.settings.currency;
      settingsForm.onlineBooking.value = String(state.hotel.onlineBooking);
      settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(settingsForm);
        state.settings.currency = data.get('currency');
        state.settings.taxRate = Number(data.get('taxRate'));
        state.settings.minStay = Number(data.get('minStay'));
        state.settings.maxStay = Number(data.get('maxStay'));
        state.settings.cancellationWindow = Number(data.get('cancellationWindow'));
        state.hotel.onlineBooking = data.get('onlineBooking') === 'true';
        saveState('Sistem ayarlari guncellendi');
        render();
      });
    }

    const contentForm = document.getElementById('content-form');
    if (contentForm) {
      contentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        state.content.heroTitle = contentForm.heroTitle.value.trim();
        state.content.bookingLabel = contentForm.bookingLabel.value.trim();
        state.content.heroText = contentForm.heroText.value.trim();
        state.content.seoTitle = contentForm.seoTitle.value.trim();
        state.content.seoDescription = contentForm.seoDescription.value.trim();
        state.content.highlights = contentForm.highlights.value.split('\n').map(function (item) { return item.trim(); }).filter(Boolean);
        saveState('On yuz icerikleri guncellendi');
        render();
      });
    }
  }

  function bindUpload() {
    const upload = document.getElementById('gallery-upload');
    if (!upload) return;
    upload.addEventListener('change', function (event) {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;
      let remaining = files.length;
      files.forEach(function (file) {
          const reader = new FileReader();
          reader.onload = function () {
          state.gallery.unshift({ id: uid(), title: file.name.replace(/\.[^.]+$/, ''), category: 'Yeni Yukleme', alt: file.name, src: String(reader.result), color: '#dde8ef', roomIds: [] });
          remaining -= 1;
          if (remaining === 0) { saveState('Galeriye yeni fotograflar yuklendi'); render(); }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  function openRoomModal(id) {
    const room = state.roomTypes.find(function (item) { return item.id === id; }) || hydrateRoom({ id: '', name: '', short: '', nightlyPrice: 0, weekendPrice: 0, capacityAdults: 2, capacityChildren: 0, totalRooms: 1, availableRooms: 1, status: 'active', featured: false, amenities: '', notes: '' });
    openModal('Oda Tipi Duzenle', `<form id="room-modal-form" class="form-grid two"><div class="field"><label>Baslik</label><input name="name" value="${escapeAttr(room.name)}" required /></div><div class="field"><label>Kisa Ad</label><input name="short" value="${escapeAttr(room.short)}" required /></div><div class="field"><label>Hafta Ici Fiyati</label><input name="nightlyPrice" type="number" min="0" value="${room.nightlyPrice}" /></div><div class="field"><label>Hafta Sonu Fiyati</label><input name="weekendPrice" type="number" min="0" value="${room.weekendPrice}" /></div><div class="field"><label>Yetiskin Kapasitesi</label><input name="capacityAdults" type="number" min="1" value="${room.capacityAdults}" /></div><div class="field"><label>Cocuk Kapasitesi</label><input name="capacityChildren" type="number" min="0" value="${room.capacityChildren}" /></div><div class="field"><label>Toplam Oda</label><input name="totalRooms" type="number" min="1" value="${room.totalRooms}" /></div><div class="field"><label>Musait Oda</label><input name="availableRooms" type="number" min="0" value="${room.availableRooms}" /></div><div class="field"><label>Durum</label><select name="status"><option value="active">Aktif</option><option value="passive">Pasif</option></select></div><div class="field"><label>One Cikan Oda</label><select name="featured"><option value="false">Hayir</option><option value="true">Evet</option></select></div><div class="field"><label>Oda Boyutu</label><input name="size" value="${escapeAttr(room.size)}" placeholder="24 m2" /></div><div class="field"><label>Yatak Duzeni</label><input name="bed" value="${escapeAttr(room.bed)}" placeholder="Queen bed" /></div><div class="field"><label>Gorunum</label><input name="view" value="${escapeAttr(room.view)}" placeholder="Kismi deniz" /></div><div class="field"><label>Banyo</label><input name="bathroom" value="${escapeAttr(room.bathroom)}" placeholder="Yagmur dusu" /></div><div class="field" style="grid-column:1 / -1;"><label>Kisa Teknik Ozellikler</label><input name="amenities" value="${escapeAttr(room.amenities)}" /></div><div class="field" style="grid-column:1 / -1;"><label>Karti Aciklama Notu</label><textarea name="notes">${escapeHtml(room.notes)}</textarea></div><div class="field" style="grid-column:1 / -1;"><label>Oda Hikayesi</label><textarea name="story">${escapeHtml(room.story || '')}</textarea></div><div class="field"><label>One Cikan Basliklar</label><textarea name="highlights">${escapeHtml((room.highlights || []).join('\n'))}</textarea><div class="form-hint">Her satira bir vurgu yazin.</div></div><div class="field"><label>Dahil Hizmetler</label><textarea name="includes">${escapeHtml((room.includes || []).join('\n'))}</textarea><div class="form-hint">Her satira bir hizmet yazin.</div></div><div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Kaydet</button></div></form>`, function () {
      const form = document.getElementById('room-modal-form');
      form.status.value = room.status;
      form.featured.value = String(room.featured);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const totalRooms = Number(data.get('totalRooms'));
        const payload = hydrateRoom({
          id: room.id || data.get('short').trim().toLowerCase().replace(/\s+/g, '-'),
          name: data.get('name').trim(),
          short: data.get('short').trim(),
          nightlyPrice: Number(data.get('nightlyPrice')),
          weekendPrice: Number(data.get('weekendPrice')),
          capacityAdults: Number(data.get('capacityAdults')),
          capacityChildren: Number(data.get('capacityChildren')),
          totalRooms: totalRooms,
          availableRooms: Math.min(Number(data.get('availableRooms')), totalRooms),
          status: data.get('status'),
          featured: data.get('featured') === 'true',
          size: data.get('size').trim(),
          bed: data.get('bed').trim(),
          view: data.get('view').trim(),
          bathroom: data.get('bathroom').trim(),
          amenities: data.get('amenities').trim(),
          notes: data.get('notes').trim(),
          story: data.get('story').trim(),
          highlights: data.get('highlights'),
          includes: data.get('includes')
        });
        const index = state.roomTypes.findIndex(function (item) { return item.id === room.id; });
        if (index >= 0) state.roomTypes[index] = payload; else state.roomTypes.unshift(payload);
        saveState('Oda tipi kaydedildi'); closeModal(); render();
      });
    });
  }

  function openReservationModal() {
    openModal('Yeni Rezervasyon', `<form id="reservation-modal-form" class="form-grid two"><div class="field"><label>Misafir</label><input name="guest" required /></div><div class="field"><label>Kaynak</label><input name="source" value="Web Sitesi" /></div><div class="field"><label>Oda Tipi</label><select name="roomType">${state.roomTypes.map(function (room) { return '<option>' + escapeHtml(room.short || room.name) + '</option>'; }).join('')}</select></div><div class="field"><label>Durum</label><select name="status"><option value="pending">Beklemede</option><option value="confirmed">Onaylandi</option><option value="blocked">Kapali</option></select></div><div class="field"><label>Giris</label><input name="checkIn" type="date" value="${futureDate(2)}" /></div><div class="field"><label>Cikis</label><input name="checkOut" type="date" value="${futureDate(4)}" /></div><div class="field"><label>Yetiskin</label><input name="adults" type="number" min="1" value="2" /></div><div class="field"><label>Cocuk</label><input name="children" type="number" min="0" value="0" /></div><div class="field"><label>Tutar</label><input name="amount" type="number" min="0" value="5000" /></div><div class="field" style="grid-column:1 / -1;"><label>Not</label><textarea name="note"></textarea></div><div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Rezervasyon Ekle</button></div></form>`, function () {
      document.getElementById('reservation-modal-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        state.reservations.unshift({ id: uid(), guest: data.get('guest').trim(), roomType: data.get('roomType'), checkIn: data.get('checkIn'), checkOut: data.get('checkOut'), adults: Number(data.get('adults')), children: Number(data.get('children')), status: data.get('status'), source: data.get('source').trim(), amount: Number(data.get('amount')), note: data.get('note').trim() });
        saveState('Yeni rezervasyon eklendi'); closeModal(); render();
      });
    });
  }

  function openGalleryModal(id) {
    const item = state.gallery.find(function (entry) { return entry.id === id; });
    if (!item) return;
    openModal('Galeri Ogesi Duzenle', `<form id="gallery-modal-form" class="form-grid two"><div class="field"><label>Baslik</label><input name="title" value="${escapeAttr(item.title)}" /></div><div class="field"><label>Kategori</label><input name="category" value="${escapeAttr(item.category)}" /></div><div class="field"><label>Alt Metin</label><input name="alt" value="${escapeAttr(item.alt)}" /></div><div class="field"><label>Placeholder Renk</label><input name="color" value="${escapeAttr(item.color || '#dde8ef')}" /></div><div class="field" style="grid-column:1 / -1;"><label>Gorsel Kaynagi</label><input name="src" value="${escapeAttr(item.src || '')}" placeholder="data:image/... veya harici gorsel yolu" /></div><div class="field" style="grid-column:1 / -1;"><label>Bagli Oda ID / Kisa Adlari</label><textarea name="roomIds">${escapeHtml(listify(item.roomIds).join('\n'))}</textarea><div class="form-hint">Her satira bir oda id yazin. Ornek: standart, deluxe, suit</div></div><div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Kaydet</button></div></form>`, function () {
      document.getElementById('gallery-modal-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        item.title = data.get('title').trim();
        item.category = data.get('category').trim();
        item.alt = data.get('alt').trim();
        item.color = data.get('color').trim() || '#dde8ef';
        item.src = data.get('src').trim();
        item.roomIds = listify(data.get('roomIds'));
        saveState('Galeri bilgileri guncellendi'); closeModal(); render();
      });
    });
  }

  function openPromotionModal() {
    openModal('Yeni Kampanya', `<form id="promo-modal-form" class="form-grid two"><div class="field"><label>Kampanya Basligi</label><input name="title" required /></div><div class="field"><label>Kod</label><input name="code" required /></div><div class="field"><label>Indirim (%)</label><input name="discount" type="number" min="1" max="100" value="10" /></div><div class="field"><label>Durum</label><select name="status"><option value="active">Aktif</option><option value="scheduled">Planli</option><option value="passive">Pasif</option></select></div><div class="field" style="grid-column:1 / -1;"><label>Not</label><textarea name="note"></textarea></div><div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Kampanyayi Kaydet</button></div></form>`, function () {
      document.getElementById('promo-modal-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        state.promotions.unshift({ id: uid(), title: data.get('title').trim(), code: data.get('code').trim(), discount: Number(data.get('discount')), status: data.get('status'), note: data.get('note').trim() });
        saveState('Yeni kampanya olusturuldu'); closeModal(); render();
      });
    });
  }

  function openSeasonalModal() {
    openModal('Sezonluk Fiyat Kurali', `<form id="season-modal-form" class="form-grid two"><div class="field"><label>Baslik</label><input name="title" required /></div><div class="field"><label>Kanal</label><input name="channel" value="Tum Kanallar" /></div><div class="field"><label>Baslangic</label><input name="start" type="date" value="${futureDate(1)}" /></div><div class="field"><label>Bitis</label><input name="end" type="date" value="${futureDate(30)}" /></div><div class="field"><label>Carpan</label><input name="multiplier" type="number" step="0.01" min="0.5" value="1.10" /></div><div class="field" style="grid-column:1 / -1;"><label>Not</label><textarea name="note"></textarea></div><div class="form-actions" style="grid-column:1 / -1;"><button class="button button-primary" type="submit">Kurali Kaydet</button></div></form>`, function () {
      document.getElementById('season-modal-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        state.seasonalPricing.unshift({ id: uid(), title: data.get('title').trim(), start: data.get('start'), end: data.get('end'), multiplier: Number(data.get('multiplier')), channel: data.get('channel').trim(), note: data.get('note').trim() });
        saveState('Sezonluk fiyat kurali eklendi'); closeModal(); render();
      });
    });
  }

  function openModal(title, content, onReady) {
    closeModal();
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-overlay'; wrapper.id = 'modal-root';
    wrapper.innerHTML = `<div class="modal-card"><div class="panel-header"><h3>${title}</h3><button class="button button-secondary" type="button" data-close-modal>Kapat</button></div>${content}</div>`;
    document.body.appendChild(wrapper);
    wrapper.addEventListener('click', function (event) { if (event.target === wrapper || event.target.hasAttribute('data-close-modal')) closeModal(); });
    if (typeof onReady === 'function') onReady();
  }

  function closeModal() { const modal = document.getElementById('modal-root'); if (modal) modal.remove(); }
  function nextAvailability(status) { if (status === 'available') return 'pending'; if (status === 'pending') return 'blocked'; return 'available'; }
  function exportState() { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'mavi-inci-admin-data.json'; link.click(); URL.revokeObjectURL(url); }
  function exportDeployState() {
    const payload = 'window.MaviInciStaticState = ' + JSON.stringify(state, null, 2) + ';\n';
    const blob = new Blob([payload], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'site-state.override.js';
    link.click();
    URL.revokeObjectURL(url);
  }
  function formatShortDate(value) { const date = parseDate(value); return pad(date.getDate()) + '.' + pad(date.getMonth() + 1) + '.' + date.getFullYear(); }
  function escapeHtml(value) { return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;'); }
  function escapeAttr(value) { return escapeHtml(value).replace(/\n/g, ' '); }
  document.addEventListener('DOMContentLoaded', render);
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) {
      state = loadState();
      if (loggedIn()) render();
    }
  });
})();
