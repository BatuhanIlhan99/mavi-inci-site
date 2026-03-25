(function (window, document) {
  var mounted = false;
  var fallbackTimer = null;

  function getRoot() {
    return document.getElementById('root');
  }

  function renderFallback(message) {
    var root = getRoot();
    if (!root || mounted) return;
    root.innerHTML = '' +
      '<section style="min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(180deg,#f5fbfd 0%,#e7f3f9 48%,#f6efe4 100%);font-family:Arial,sans-serif;color:#143646;">' +
      '<div style="width:min(100%,720px);padding:32px;border:1px solid rgba(20,54,70,0.12);border-radius:28px;background:rgba(255,255,255,0.94);box-shadow:0 28px 70px rgba(11,36,47,0.12);">' +
      '<p style="margin:0 0 12px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#5f8ea2;">Han Otelcilik</p>' +
      '<h1 style="margin:0;font-size:clamp(2rem,5vw,3.3rem);line-height:1.02;">Sayfa gecici olarak otomatik yuklenemedi</h1>' +
      '<p style="margin:16px 0 0;font-size:17px;line-height:1.8;color:#355465;">' + message + '</p>' +
      '<p style="margin:12px 0 0;font-size:16px;line-height:1.75;color:#4b6877;">Otel, fast food veya pub birimlerimiz icin telefon ya da WhatsApp hattimizdan bize hemen ulasabilirsiniz.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:24px;">' +
      '<a href="./index.html" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;background:#143646;color:#fff;text-decoration:none;font-weight:700;">Ana Sayfa</a>' +
      '<a href="./odalar.html" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;background:#ffffff;color:#143646;text-decoration:none;font-weight:700;border:1px solid rgba(20,54,70,0.16);">Oteller</a>' +
      '<a href="./deneyimler.html" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;background:#ffffff;color:#143646;text-decoration:none;font-weight:700;border:1px solid rgba(20,54,70,0.16);">Fast Food & Pub</a>' +
      '<a href="./rezervasyon.html" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;background:#ffffff;color:#143646;text-decoration:none;font-weight:700;border:1px solid rgba(20,54,70,0.16);">Talep Formu</a>' +
      '<a href="tel:+905376963030" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;background:#eef7fa;color:#143646;text-decoration:none;font-weight:700;border:1px solid rgba(20,54,70,0.08);">+90 537 696 30 30</a>' +
      '<a href="https://wa.me/905376963030" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;background:#eef7fa;color:#143646;text-decoration:none;font-weight:700;border:1px solid rgba(20,54,70,0.08);">WhatsApp</a>' +
      '</div>' +
      '</div>' +
      '</section>';
  }

  function scheduleFallback() {
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(function () {
      if (!mounted) {
        renderFallback('Sayfa beklenenden uzun surdugu icin guvenli gorunum acildi. Lutfen sayfayi yenileyin ya da asagidaki baglantilardan devam edin.');
      }
    }, 2800);
  }

  window.MaviInciBoot = {
    markMounted: function () {
      mounted = true;
      clearTimeout(fallbackTimer);
    },
    fail: function (message) {
      if (mounted) return;
      clearTimeout(fallbackTimer);
      renderFallback(message || 'Sayfa yuklenirken teknik bir sorun olustu.');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleFallback, { once: true });
  } else {
    scheduleFallback();
  }

  window.addEventListener('error', function () {
    if (!mounted) {
      window.MaviInciBoot.fail('Sayfa yuklenirken teknik bir sorun olustu. Koruyucu gorunum devreye alindi.');
    }
  });
})(window, document);
