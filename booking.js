(function () {
  var Data = window.MaviInciData;
  var Shell = window.MaviInciShell;
  if (!Data || !Shell) {
    document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Rezervasyon altyapisi yuklenemedi.</div>';
    return;
  }

  var state = Data.resolveSiteData();
  var bookingWizardState = { step: 1 };
  var bookingSteps = [
    { index: 1, title: 'Konaklama', text: 'Tarih, oda ve fiyat akisi' },
    { index: 2, title: 'Misafir', text: 'Iletisim ve ozel talepler' },
    { index: 3, title: 'Onay', text: 'Kontrol et ve talebi gonder' }
  ];

  function roomCapacityLabel(room) {
    return room.capacityAdults + ' yetiskin' + (Number(room.capacityChildren || 0) > 0 ? ' + ' + room.capacityChildren + ' cocuk' : '');
  }

  function renderPageHero() {
    var selected = Data.getRoomByKey(state, new URLSearchParams(window.location.search).get('room'));
    return '<section class="page-hero page-hero-booking"><div class="container page-hero-grid"><div class="page-hero-copy"><div class="hero-prelude"><span class="hero-chip">Direkt Rezervasyon</span><span class="hero-rule"></span><span class="hero-annotation">Mini bir alan yerine kendi profesyonel rezervasyon sayfasinda planlama yapin</span></div><p class="kicker">Rezervasyon sayfasi</p><h1 class="hero-title room-page-title">Konaklama talebinizi planlayin</h1><p class="hero-text">Tarih, oda, misafir bilgileri ve operasyon notlari tek yerde toplansin; ekibimiz size telefon veya WhatsApp uzerinden daha hizli ve net bir donus yapsin.</p><div class="hero-actions"><a class="button button-primary" href="#rezervasyon-formu">Formu Doldurmaya Basla</a><a class="button button-secondary" href="https://wa.me/' + Data.escapeHtml(state.hotel.whatsappNumber.replace(/[^\d]/g, '')) + '">WhatsApp ile Yaz</a></div><div class="hero-signature-grid"><article class="hero-signature-card"><span>Direkt Hat</span><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong></article><article class="hero-signature-card"><span>Cevap Kanali</span><strong>Telefon veya WhatsApp</strong></article><article class="hero-signature-card"><span>Baslangic Fiyat</span><strong>' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong></article></div></div><aside class="page-hero-aside"><article class="contact-card"><p class="section-kicker">Rezervasyon Ofisi</p><h3>Planlama notlari</h3><div class="summary-line"><span>Check-in</span><strong>' + Data.escapeHtml(state.hotel.checkInTime) + '</strong></div><div class="summary-line"><span>Check-out</span><strong>' + Data.escapeHtml(state.hotel.checkOutTime) + '</strong></div><div class="summary-line"><span>Kahvalti</span><strong>' + Data.escapeHtml(state.hotel.breakfastHours) + '</strong></div><div class="summary-line"><span>Donus</span><strong>Ayni gun teyit hedefi</strong></div>' + (selected ? '<div class="summary-divider"></div><div class="summary-line"><span>Secili oda</span><strong>' + Data.escapeHtml(selected.name) + '</strong></div><div class="summary-line"><span>Kapasite</span><strong>' + Data.escapeHtml(roomCapacityLabel(selected)) + '</strong></div>' : '') + '</article></aside></div></section>';
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
    return '<section class="section section-light" id="rezervasyon-formu"><div class="container booking-layout"><article class="contact-card booking-shell"><div class="booking-shell-header"><div><p class="section-kicker">Direkt Rezervasyon Formu</p><h3>Profesyonel rezervasyon akisi</h3><p>Oda secimi, tarih planlamasi, misafir bilgileri ve operasyon notlari; dogrudan otel ekibine iletilecek net bir akista toplanir.</p></div><div class="booking-shell-badges"><span class="tag">Canli fiyat ozeti</span><span class="tag">Musaitlik sinyali</span><span class="tag">Telefon / WhatsApp donusu</span></div></div><div class="booking-stepper">' + bookingSteps.map(renderBookingStep).join('') + '</div><div class="booking-availability-strip"><div><strong>Yaklasan musaitlik ritmi</strong><span>Onumuzdeki tarihlerde operasyon yogunlugu</span></div><div class="booking-availability-rail">' + renderBookingAvailabilityRail() + '</div></div><form class="booking-form booking-form-pro" id="bookingForm" novalidate><section class="booking-step-panel is-active" data-booking-panel="1"><div class="booking-panel-header"><p class="card-kicker">1. Adim</p><h3>Konaklamanizi planlayin</h3><p>Tarih, oda ve misafir sayisini secin. Eski anasayfa mini formunun yerine daha profesyonel bir sayfa akisi sunduk.</p></div><div class="form-grid three"><div class="field"><label for="checkIn">Giris Tarihi</label><input id="checkIn" name="checkIn" type="date" /><div class="error-message" id="checkIn-error"></div></div><div class="field"><label for="checkOut">Cikis Tarihi</label><input id="checkOut" name="checkOut" type="date" /><div class="error-message" id="checkOut-error"></div></div><div class="field"><label for="roomType">Oda Tipi</label><select id="roomType" name="roomType"><option value="">Oda tipi secin</option>' + Data.getActiveRooms(state).map(function (room) { return '<option value="' + Data.escapeHtml(Data.getRoomKey(room)) + '">' + Data.escapeHtml(room.name) + '</option>'; }).join('') + '</select><div class="error-message" id="roomType-error"></div></div></div><div class="form-grid four"><div class="field"><label for="adults">Yetiskin</label><select id="adults" name="adults"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select><div class="error-message" id="adults-error"></div></div><div class="field"><label for="children">Cocuk</label><select id="children" name="children"><option selected>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select><div class="error-message" id="children-error"></div></div><div class="field"><label for="arrivalTime">Tahmini Varis</label><select id="arrivalTime" name="arrivalTime"><option value="">Saat secin</option><option>12:00 - 14:00</option><option>14:00 - 16:00</option><option>16:00 - 18:00</option><option>18:00 - 21:00</option><option>21:00 sonrasi</option></select></div><div class="field"><label for="promoCode">Kampanya Kodu</label><input id="promoCode" name="promoCode" type="text" placeholder="' + Data.escapeHtml(primaryPromo ? primaryPromo.code : 'KODUNUZ') + '" /></div></div><div class="booking-inline-note">' + (primaryPromo ? '<strong>Aktif web kampanyasi:</strong> ' + Data.escapeHtml(primaryPromo.title) + ' | Kod: ' + Data.escapeHtml(primaryPromo.code) : 'Aktif kampanya bulunmadiginda sistem standart fiyat uzerinden hesaplama yapar.') + '</div><div class="booking-step-actions"><div class="form-note">Fiyat ozeti sag tarafta, gece bazli olarak anlik hesaplanir.</div><button class="button button-dark" type="button" data-booking-next="2">Misafir Bilgilerine Gec</button></div></section><section class="booking-step-panel" data-booking-panel="2" aria-hidden="true"><div class="booking-panel-header"><p class="card-kicker">2. Adim</p><h3>Misafir ve iletisim bilgileri</h3><p>Ekibin size hizli donus yapabilmesi icin ad, telefon ve varsa e-posta bilgisini ekleyin.</p></div><div class="form-grid two"><div class="field"><label for="guestName">Ad Soyad</label><input id="guestName" name="guestName" type="text" placeholder="Rezervasyon sahibi" /><div class="error-message" id="guestName-error"></div></div><div class="field"><label for="contactMethod">Donus Tercihi</label><select id="contactMethod" name="contactMethod"><option value="Telefon">Telefon</option><option value="WhatsApp">WhatsApp</option><option value="E-posta">E-posta</option></select></div></div><div class="form-grid two"><div class="field"><label for="guestPhone">Telefon</label><input id="guestPhone" name="guestPhone" type="tel" placeholder="' + Data.escapeHtml(state.hotel.phone) + '" /><div class="error-message" id="guestPhone-error"></div></div><div class="field"><label for="guestEmail">E-posta</label><input id="guestEmail" name="guestEmail" type="email" placeholder="ornek@mail.com" /><div class="error-message" id="guestEmail-error"></div></div></div><div class="form-grid two"><label class="option-card"><input id="transferRequest" name="transferRequest" type="checkbox" /><div><strong>Transfer destegi iste</strong><span>' + (state.hotel.airportTransfer ? 'Varis planlamasi icin ekip bilgilendirilsin.' : 'Ulasim ihtiyacinizi not olarak iletebilirsiniz.') + '</span></div></label><label class="option-card"><input id="lateArrival" name="lateArrival" type="checkbox" /><div><strong>Gec varis ihtimali</strong><span>Oda tutulumu ve operasyon planlamasi buna gore yapilsin.</span></div></label></div><div class="field"><label for="specialRequest">Ozel Notunuz</label><textarea id="specialRequest" name="specialRequest" placeholder="Erken giris, deniz goruslu tercih, kutlama notu veya transfer talebi gibi detaylari yazabilirsiniz."></textarea></div><label class="consent-row"><input id="privacyConsent" name="privacyConsent" type="checkbox" /><span>Bilgilerimin rezervasyon talebimi yonetmek amaciyla islenmesini kabul ediyorum.</span></label><div class="error-message" id="privacyConsent-error"></div><div class="booking-step-actions"><button class="button button-soft" type="button" data-booking-prev="1">Geri Don</button><button class="button button-dark" type="button" data-booking-next="3">Onay Ekranina Gec</button></div></section><section class="booking-step-panel" data-booking-panel="3" aria-hidden="true"><div class="booking-panel-header"><p class="card-kicker">3. Adim</p><h3>Son kontrol ve talep gonderimi</h3><p>Oda, tarih, misafir bilgileri ve fiyat ozeti son kez kontrol edilir. Gonderim sonrasinda referans numarasi olusturulur.</p></div><div class="booking-review-grid"><article class="booking-review-card"><h4>Konaklama Ozeti</h4><div class="review-lines" id="reviewStay"></div></article><article class="booking-review-card"><h4>Misafir Bilgileri</h4><div class="review-lines" id="reviewGuest"></div></article><article class="booking-review-card"><h4>Politika ve Operasyon</h4><div class="review-lines" id="reviewPolicy"></div></article></div><div class="booking-step-actions"><button class="button button-soft" type="button" data-booking-prev="2">Geri Don</button><div class="booking-submit-stack"><button class="button button-dark" type="submit">Rezervasyon Talebini Gonder</button><div class="status-message" id="bookingStatus" role="status" aria-live="polite"></div></div></div><div class="form-note">Talebiniz dogrudan otel ekibine iletilir ve ekibimiz size secili kanaldan geri donus yapar.</div></section></form></article><aside class="info-stack booking-sidebar"><article class="contact-card reservation-summary booking-summary-card" id="summaryCard"><p class="section-kicker">Canli Fiyat Ozeti</p><h3 id="summaryRoomName">Bir oda secin</h3><p id="summaryNote">Tarih ve oda secimi yaptiginizda tahmini toplam burada guncellenir.</p><div class="summary-badges"><span class="status-pill status-available" id="summaryStatus">Musaitlik bekleniyor</span><span class="tag" id="summaryGuests">0 misafir</span></div><div class="summary-line"><span>Konaklama</span><strong id="summaryDates">Tarih secilmedi</strong></div><div class="summary-line"><span>Gecelik baz</span><strong id="summaryBase">' + Data.formatMoney(state, Data.getStartingPrice(state)) + '</strong></div><div class="summary-line"><span>Sezon etkisi</span><strong id="summarySeason">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-line"><span>Gece sayisi</span><strong id="summaryNights">0</strong></div><div class="summary-line"><span>Indirim</span><strong id="summaryDiscount">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-line"><span>Vergi</span><strong id="summaryTax">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-line summary-line-total"><span>Toplam</span><strong id="summaryTotal">' + Data.formatMoney(state, 0) + '</strong></div><div class="summary-promo" id="summaryPromotion">Aktif kampanya seciminize gore yansitilir.</div><div class="summary-divider"></div><div class="summary-breakdown" id="summaryBreakdown"><div class="summary-empty">Gece bazli fiyat dokumu burada listelenecek.</div></div></article><article class="contact-card booking-room-card"><p class="section-kicker">Secilen Oda</p><h3 id="selectedRoomLabel">Oda secimi bekleniyor</h3><p id="selectedRoomMeta">Kapasite, gorunum ve konfor detaylari secime gore burada gorunur.</p><div class="summary-line"><span>Musait oda</span><strong id="selectedRoomAvailability">-</strong></div><div class="summary-line"><span>Kapasite</span><strong id="selectedRoomCapacity">-</strong></div><div class="summary-line"><span>Yatak duzeni</span><strong id="selectedRoomBed">-</strong></div><div class="summary-line"><span>Artilar</span><strong id="selectedRoomHighlights">-</strong></div></article><article class="contact-card"><p class="section-kicker">Rezervasyon Destegi</p><h3>Direkt iletisim notlari</h3><ul class="booking-policy-list"><li>Telefon: ' + Data.escapeHtml(state.hotel.phone) + '</li><li>WhatsApp: ' + Data.escapeHtml(state.hotel.whatsappNumber) + '</li><li>Check-in ' + Data.escapeHtml(state.hotel.checkInTime) + ' / Check-out ' + Data.escapeHtml(state.hotel.checkOutTime) + '</li><li>Kahvalti ' + Data.escapeHtml(state.hotel.breakfastHours) + '</li></ul></article></aside></div></section>';
  }

  function renderBookingSupport() {
    return '<section class="section section-dark"><div class="container editorial-layout"><article class="editorial-card"><p class="section-kicker">Direkt Rezervasyon Avantaji</p><h2 class="editorial-title">Neden bu sayfadan ilerlemelisiniz?</h2><ul class="booking-bullets"><li>Oda secimi, misafir bilgisi ve ozel talep ayni akista toplanir</li><li>Telefon ve WhatsApp uzerinden daha hizli teyit verilir</li><li>Aktif promosyonlar toplam ozetinde hemen gorunur</li><li>Referans numarasi ile takip etmek daha kolay olur</li></ul></article><article class="editorial-card"><p class="section-kicker">Operasyon Notu</p><h2 class="editorial-title">Ekibin sizi daha iyi yonlendirmesi icin</h2><p>Varis saati, transfer, gec giris veya ozel oda tercihi gibi notlari erken paylasmaniz; ozellikle yogun yaz donemlerinde daha net bir planlama saglar.</p><div class="inline-stats"><div class="inline-stat"><strong>' + Data.escapeHtml(state.hotel.phone) + '</strong><span>rezervasyon hatti</span></div><div class="inline-stat"><strong>' + Data.getActiveRooms(state).length + '</strong><span>aktif oda tipi</span></div><div class="inline-stat"><strong>' + state.settings.cancellationWindow + ' gun</strong><span>iptal penceresi</span></div></div></article></div></section>';
  }

  function renderApp() {
    return '<div class="shell">' +
      Shell.renderTopStrip(state) +
      Shell.renderHeader(state, 'booking') +
      '<main>' + renderPageHero() + renderBookingSection() + renderBookingSupport() + '</main>' +
      Shell.renderFooter(state, 'booking') +
      Shell.renderFloatingActions(state, { primaryHref: '#rezervasyon-formu', primaryTitle: 'Rezervasyon', primaryLabel: 'Forma Git', secondaryLabel: 'Hizli WhatsApp' }) +
      '</div>';
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
      return '<article class="night-row"><div><strong>' + Data.escapeHtml(item.label) + '</strong><span>' + Data.escapeHtml(item.weekday) + (item.multiplier !== 1 ? ' | sezon x' + item.multiplier.toFixed(2) : '') + '</span></div><div class="night-row-meta"><span class="status-pill status-' + item.availabilityStatus + '">' + Data.getAvailabilityLabel(item.availabilityStatus) + '</span><strong>' + Data.formatMoney(state, item.total) + '</strong></div></article>';
    }).join('');
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
    document.getElementById('selectedRoomCapacity').textContent = room ? roomCapacityLabel(room) : '-';
    document.getElementById('selectedRoomBed').textContent = room ? room.bed : '-';
    document.getElementById('selectedRoomHighlights').textContent = room ? ((room.highlights && room.highlights.length ? room.highlights : (room.includes && room.includes.length ? room.includes : [room.amenities])).slice(0, 2).join(' / ')) : '-';

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
    if (room) {
      var roomField = document.getElementById('roomType');
      if (roomField) roomField.value = room;
    }
    if (checkIn && mainCheckIn) mainCheckIn.value = checkIn;
    if (checkOut && mainCheckOut) mainCheckOut.value = checkOut;
    if (mainCheckIn && mainCheckOut) syncCheckoutMin(mainCheckIn, mainCheckOut, mainCheckOut.min);
    updateSummary();
  }

  function initializeForms() {
    var bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    var today = Data.normalizeDate(new Date());
    var minCheckIn = Data.formatDate(Data.addDays(today, 1));
    var minCheckOut = Data.formatDate(Data.addDays(today, 2));
    var mainCheckIn = document.getElementById('checkIn');
    var mainCheckOut = document.getElementById('checkOut');

    initializeBookingWizard();

    mainCheckIn.min = minCheckIn;
    mainCheckOut.min = minCheckOut;
    mainCheckIn.addEventListener('change', function () {
      syncCheckoutMin(mainCheckIn, mainCheckOut, minCheckOut);
      updateSummary();
    });
    mainCheckOut.addEventListener('change', updateSummary);

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

    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      clearErrors();
      var values = collectBookingValues();
      var errors = validateAllBookingValues(values);
      if (Object.keys(errors).length) {
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
      Shell.showToast('Rezervasyon talebiniz alindi. Ref: ' + reference);
      setBookingStep(3);
      updateSummary();
    });

    setBookingStep(bookingWizardState.step);
    applyInitialSelection();
  }

  function mount() {
    Shell.updateMeta(state, {
      title: state.hotel.name + ' | Rezervasyon',
      description: 'Mavi Inci Park Otel rezervasyon sayfasi; tarih, oda, misafir ve ozel talepleri profesyonel bir akista dogrudan otel ekibine iletir.',
      canonical: Data.getSiteUrl(state, '/rezervasyon.html'),
      keywords: ['Mavi Inci Park Otel rezervasyon', 'Erdek otel rezervasyon', 'direkt rezervasyon butik otel', 'otel booking page']
    });
    document.getElementById('root').innerHTML = renderApp();
    Shell.initializeNavigation();
    initializeForms();
    Shell.initializeRevealAnimations();
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      mount();
    } catch (error) {
      console.error(error);
      document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:Arial,sans-serif;">Rezervasyon sayfasi yuklenirken bir hata olustu.</div>';
    }
  });

  window.addEventListener('storage', function (event) {
    if (event.key === Data.storageKey) {
      state = Data.resolveSiteData();
    }
  });
})();
