# Mavi Inci Site Deploy Notlari

Bu proje artik GitHub Pages icin otomatik deploy akisina sahiptir.

## GitHub otomatik deploy akisi

1. Projeyi bir GitHub reposuna yukleyin.
2. Varsayilan branch adini `main` olarak kullanin.
3. Repo ayarlarinda `Pages` bolumune girin.
4. `Build and deployment` kaynagini `GitHub Actions` olarak secin.
5. Bundan sonra `main` branch'ine her push otomatik olarak yeni surumu yayina alir.

Workflow dosyasi:

- `.github/workflows/deploy-pages.yml`
- `scripts/publish-github.ps1`

## Bu makinede tek komutla yayin

GitHub girisi acildiktan sonra asagidaki komut repo olusturma, `origin` baglama, ilk push ve Pages'i `workflow` moduna alma isini birlikte yapar:

```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\publish-github.ps1"
```

## Canliya atmadan once

1. `admin.html` icinde son fiyat ve icerik guncellemelerini yapin.
2. Admin paneldeki `Deploy Icin JS Disa Aktar` baglantisina basin.
3. Inen dosyanin adini `site-state.override.js` olarak koruyun.
4. Inen dosyayi proje klasorundeki mevcut `site-state.override.js` dosyasinin yerine koyun.
5. Bu degisikligi GitHub reposuna push edin.

Bu adim, admin panelde sadece sizin tarayicinizda duran verileri canli siteye kalici olarak tasir.

## Alternatif platformlar

### Netlify

1. `https://app.netlify.com/drop` adresini acin.
2. `Mavi Inci Site` klasorunu surukleyip birakin.
3. Netlify size hemen bir canli link verir.

### Vercel

1. Vercel uzerinde yeni proje olusturun.
2. Bu klasoru yukleyin veya bir Git deposuna baglayin.
3. Build komutu gerekmez; proje dogrudan statik olarak yayinlanir.

Not: GitHub Pages alt klasorde yayin yaparsa site yine calisir; canonical ve ic link mantigi buna gore hazirlandi.
