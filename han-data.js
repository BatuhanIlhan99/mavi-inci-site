(function (window) {
  var STORAGE_KEY = 'han-otelcilik-state-v1';
  var LOGIN_KEY = 'han-otelcilik-admin-session-v1';

  function commons(fileName) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + fileName;
  }

  var defaults = {
    group: {
      name: 'Han Otelcilik',
      phone: '+90 537 696 30 30',
      email: 'iletisim@hanotelcilik.com',
      address: 'Erdek, Balikesir',
      city: 'Erdek / Balikesir',
      tagline: 'Erdek merkezli konaklama, lezzet ve deneyim grubu',
      description: 'Han Otelcilik; Erdek merkezli uc ayri konaklama markasi, bir hizli servis restoran markasi ve bir pub operasyonunu tek cati altinda toplayan premium deneyim grubudur.',
      reservationNote: 'Tum talepler merkez ofis tarafindan ilgili isletmeye yonlendirilir ve en gec ayni gun icinde geri donus planlanir.',
      whatsapp: '+90 537 696 30 30',
      manifesto: 'Biz, Erdek yolculugunu sadece konaklama olarak degil; hikayesi, ritmi, mutfagi ve sahil hafizasi ile birlikte tasarlanan butunsel bir deneyim olarak goruyoruz.',
      directBookingPromise: 'Dogrudan talep, hizli geri donus, net bilgi ve tek merkezden yonetilen guvenli planlama.',
      highlights: [
        '3 ayri konaklama markasi',
        'Smile Foodhouse ve pub ile tamamlanan yeme icme deneyimi',
        'Erdek odakli yerel rota, hikaye ve gezi kurgusu',
        'Merkezi operasyon ve tek cati marka dili'
      ]
    },
    guide: {
      title: 'Erdek Rehberi',
      introTitle: 'Kapidag Yarimadasi ile antik miras arasinda kurulan ritim',
      introText: 'Han Otelcilik icin Erdek yalnizca bir deniz kasabasi degil; antik liman tarihi, adalari, sahil ritmi ve koyleriyle derin bir rota. Bu rehber, misafirlerin konaklama kararini bir destinasyon tecrubesine donusturmek icin hazirlandi.',
      destinations: [
        {
          id: 'zeytinliada',
          name: 'Zeytinliada Arkeopark',
          category: 'Tarih ve simge',
          tagline: 'Erdek siluetinin en taninan adasi ve ruhani hafizasi',
          image: commons('Erdek%20Turkey.jpg'),
          imageAlt: 'Erdek sahili ve deniz gorunumu',
          duration: '60-90 dk',
          bestTime: 'Sabah erken saatler veya gun batimi',
          story: 'Erdek Kaymakamligi sayfasina gore Zeytinliada, ilcenin sembolu kabul edilir. M.S. 500 yillarinda insa edilen Meryem Ana Kilisesi, kutsal su ayazmasi ve Anadoludaki Ortodoks mimarisinin en buyuk vaftizhanesi bu adada tespit edilmistir.',
          whyGo: 'Erdek gezi dilinde kartpostal etkisi yaratan ilk durak burasidir; sahil yuruyusu, fotograf ve tarih katmani ayni anda hissedilir.',
          sourceLabel: 'Erdek Kaymakamligi',
          sourceUrl: 'https://www.erdek.gov.tr/tarihituristik'
        },
        {
          id: 'kyzikos',
          name: 'Kyzikos Antik Kenti',
          category: 'Antik miras',
          tagline: 'Erdek tarihinin antik liman hafizasini acan buyuk alan',
          image: commons('Kyzikos%20antik%20kenti%20kal%C4%B1nt%C4%B1lar%C4%B1.jpg'),
          imageAlt: 'Kyzikos antik kent kalintilari',
          duration: '2-3 saat',
          bestTime: 'Sabah veya ikindi',
          story: 'Kyzikos, Erdek Kaymakamligi metninde Anadolu sahillerinin onemli antik liman kentlerinden biri olarak anlatilir. Roma ve Bizans donemlerinde ticari ve dinsel bakimdan buyuk bir merkez olan kentte, Hadrian Tapinagi kalintilari en dikkat ceken odaklardan biridir.',
          whyGo: 'Erdekte kalirken bolgenin yalnizca denizle degil, antik Akdeniz ticaret rotalariyla da kurdugu iliskiyi gormek icin vazgecilmez bir duraktir.',
          sourceLabel: 'Erdek Kaymakamligi',
          sourceUrl: 'https://www.erdek.gov.tr/tarihituristik'
        },
        {
          id: 'kirazli-manastiri',
          name: 'Kirazli Manastiri',
          category: 'Tarih ve doga',
          tagline: 'Ballipinar yukselerinde sakli manastir kalintisi',
          image: commons('Kirazli_Manastiri.jpg'),
          imageAlt: 'Kirazli Manastiri kalintilari',
          duration: '90-120 dk',
          bestTime: 'Sabah serinligi',
          story: 'Balikesir Il Kultur ve Turizm Mudurlugu bilgisinde Kirazli Manastiri, Yukariyapici ile Ballipinar arasinda, 1895 tarihli oldugu belirtilen ve 99 odali olarak anilan buyuk bir dini yapi toplulugu olarak geciyor.',
          whyGo: 'Kapidag peyzaji icinde tarih, fotograf ve hafif doga yuruyusunu tek planda birlestiren en etkileyici noktalardan biridir.',
          sourceLabel: 'Balikesir Il Kultur ve Turizm Mudurlugu',
          sourceUrl: 'https://balikesir.ktb.gov.tr/tr-113501/kirazli-manastiri.html'
        },
        {
          id: 'apostol-cifte-oluk',
          name: 'Apostol ve Cifte Oluk',
          category: 'Yerel hafiza',
          tagline: 'Dilek, Hidirlez ve koy hafizasini tasiyan kutsal durak',
          image: commons('Sunset%20in%20Erdek.jpg'),
          imageAlt: 'Erdekte gun batimi gorunumu',
          duration: '45-60 dk',
          bestTime: 'Ikindi ve gun batimi',
          story: 'Erdek Kaymakamligi metninde Apostol, 1638 tarihli bir koy kilisesi ve buyuk cinar agaci ile anilir. Ayni metinde Cifte Oluk alani Hidirlez gelenekleri, dilek ritueli ve eski koy yasami ile bag kuran bir hafiza noktasi olarak aktarilir.',
          whyGo: 'Erdekin yalnizca plaj degil, gelenek ve mevsim ritueli ile de kimlik kazandigini hissettirir.',
          sourceLabel: 'Erdek Kaymakamligi',
          sourceUrl: 'https://www.erdek.gov.tr/tarihituristik'
        },
        {
          id: 'cugra-kurbagali',
          name: 'Cugra ve Kurbagali Sahil Hatti',
          category: 'Sahil ritmi',
          tagline: 'Altin kum, sig deniz ve aksam yuruyusleri icin klasik Erdek hatti',
          image: commons('Sunset%20in%20Erdek.jpg'),
          imageAlt: 'Erdekte sahil boyunca gun batimi',
          duration: 'Yarim gun',
          bestTime: 'Sabah deniz, aksam yuruyus',
          story: 'Erdek Kaymakamligi tanitiminda Cugra, ilcenin en bilinen ve en uzun plajlarindan biri olarak; Kurbagali ise Seyit Gazi eteklerine uzanan kordon, cay bahceleri ve restoranlariyla gunluk hayatla denizi birlestiren sahil alani olarak anilir.',
          whyGo: 'Denize giris, ailece zaman gecirme ve aksam ustu yavaslamak isteyen misafirler icin Erdekin en guvenli klasiklerinden biridir.',
          sourceLabel: 'Erdek Kaymakamligi',
          sourceUrl: 'https://www.erdek.gov.tr/tarihituristik'
        },
        {
          id: 'pasalimani',
          name: 'Pasalimani Adasi Rotasi',
          category: 'Ada kacisi',
          tagline: 'Erdekten bir gunlugune ayrilip deniz ritmini buyuten rota',
          image: commons('Pasalimani.JPG'),
          imageAlt: 'Pasalimani Adasi kiyisi',
          duration: 'Tam gun',
          bestTime: 'Ruzgarsiz yaz gunleri',
          story: 'Yerel gezi kaynaklarinda Pasalimani, Erdek cevresindeki en cekici gunluk deniz rotalarindan biri olarak onerilir. Ada etkisi, daha sakin koylar ve tekneyle gecen bir gun duygusu nedeniyle Erdek konaklamasini genisleten bir deneyim sunar.',
          whyGo: 'Konaklama tecrubesine mavi rota, deniz ustu zaman ve daha sakin koy hissi eklemek isteyen misafirler icin idealdir.',
          sourceLabel: 'Erdek.com',
          sourceUrl: 'https://www.erdek.com/kat3,pasalimani-adasi'
        }
      ],
      itinerary: [
        { day: '1. Gun', title: 'Erdek ile tanisma ve sahil ritmini kurma', morning: 'Otele yerlesme, sahil boyu yavas yuruyus ve Erdek merkez kahvesi.', afternoon: 'Zeytinliada manzarasi esliginde sahil hattini kesfetme ve fotograf molalari.', evening: 'Gunayimi veya gun batimi saatinde sahil restorani, ardindan otelde sakin aksama donus.' },
        { day: '2. Gun', title: 'Kyzikos ile antik Erdek katmanini acma', morning: 'Kyzikos Antik Kenti ve Hadrian Tapinagi kalintilarini gezme.', afternoon: 'Duzler cevresinde yerel ogle yemegi ve antik kent notlariyla sakin rota.', evening: 'Erdek merkeze donus, deniz kenari aksam kahvesi.' },
        { day: '3. Gun', title: 'Kirazli Manastiri ve Kapidag peyzaji', morning: 'Ballipinar yonunde doga manzarali yolculuk ve Kirazli Manastiri gezisi.', afternoon: 'Kirsal rota, fotograf duraklari ve zeytinlikler arasinda yavas gezi.', evening: 'Otele donus, deniz manzarali aksam ustu dinlenmesi.' },
        { day: '4. Gun', title: 'Apostol hafizasi ve koy ritueleri', morning: 'Apostol ve Cifte Oluk duraklarini kesfetme, koy hikayelerini dinleme.', afternoon: 'Kurbagali hattinda yuruyus, cay bahcesi ve sahil molasi.', evening: 'Cugra tarafinda hafif deniz keyfi ve gun batimi.' },
        { day: '5. Gun', title: 'Sahil gunu ve yavas tatil', morning: 'Cugra veya Kurbagali hattinda deniz, yuzme ve uzun plaj saati.', afternoon: 'Smile Foodhouse veya sahil cevresinde hizli ogle yemegi, otelde dinlenme.', evening: 'Pub veya sahil rotasinda daha sosyal bir aksam plani.' },
        { day: '6. Gun', title: 'Pasalimani veya tekne kacisi', morning: 'Ruzgar ve sezon uygunsa Pasalimani rotasi icin erken hareket.', afternoon: 'Ada veya tekne gunu, deniz ustu zaman ve sakin koy molalari.', evening: 'Otele donus, yavas aksama gecis ve ertesi gun icin serbest zaman.' },
        { day: '7. Gun', title: 'Erdek hafizasini tamamlayip donus', morning: 'Merkezde son kahvalti, sahil yuruyusu ve hediyelik alisverisi.', afternoon: 'Kisa bir son plaj molasi veya fotograf turu.', evening: 'Cikis oncesi sakin kapanis ve bir sonraki Erdek seyahati icin notlar.' }
      ]
    },
    businesses: [
      {
        id: 'mavi-inci-park-otel',
        type: 'hotel',
        name: 'Mavi Inci Park Otel',
        shortName: 'Mavi Inci',
        heroTag: 'Erdekte butik sehir oteli deneyimi',
        tagline: 'Erdek sahilinde modern, guven veren ve merkezi konaklama',
        location: 'Erdek / Balikesir',
        address: 'Yali Mah. Neyyire Sitki Cad. No:5, Erdek / Balikesir',
        phone: '+90 537 696 30 30',
        email: 'rezervasyon@maviinciparkotel.com',
        website: '',
        accent: '#2f6f8d',
        cover: 'linear-gradient(135deg, rgba(17,52,67,0.72) 0%, rgba(63,126,157,0.38) 54%, rgba(241,226,199,0.20) 100%), url(https://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20in%20Erdek.jpg) center/cover no-repeat',
        photo: commons('Sunset%20in%20Erdek.jpg'),
        photoAlt: 'Erdekte gun batimi ve sahil gorunumu',
        summary: 'Mavi Inci Park Otel; Erdek merkezde konumlanan, 13 odali, butik olcekte ve yuksek hizmet standardi hedefleyen bir sehir otelidir.',
        description: 'Mavi Inci Park Otel; merkezi konumu, 13 odali butik yapisi, profesyonel hizmet anlayisi ve dengeli oda kurgusuyla hem tatil hem is seyahati planlayan misafirler icin guven veren bir konaklama sunar. Erdek sahil ritmine yakin, ama kurumsal ciddiyetini koruyan bir deneyim vadediyoruz.',
        storyTitle: 'Guven, sadelik ve sahil ritmiyle sekillenen butik konaklama',
        story: 'Mavi Inci Park Otel, Erdekte konforu ve duzeni on planda tutan misafirler icin kurgulanan butik bir konaklama anlayisini temsil eder. Sahile yakin konumu, merkezi ulasim avantaji ve kontrollu oda envanteri sayesinde misafirlerine daha sakin, daha ozenli ve daha guvenilir bir deneyim sunar.',
        editorial: 'Bu markanin en guclu hissi; butik otel sicakligini kurumsal isletme ciddiyetiyle bir araya getirebilmesidir.',
        signatureMoments: ['Gune Erdek sahiline yakin bir konumda sakin bir baslangic yapmak', 'Gun icinde is veya tatil planini merkezde rahatca surdurebilmek', 'Aksam saatlerinde otelin huzurlu ritmine geri donebilmek'],
        nearby: ['zeytinliada', 'kyzikos', 'cugra-kurbagali'],
        highlights: ['13 odali butik konaklama olcegi', 'Erdek merkezde guclu konum avantaji', 'Modern oda tipleri ve profesyonel misafir deneyimi'],
        features: ['Yuksek hizli Wi-Fi, kahvalti ve merkezi lokasyon avantajlari', 'Tatil ve is seyahati icin dengeli oda yapisi', 'Dogrudan rezervasyon ile hizli geri donus ve net iletisim'],
        stats: [{ label: 'Oda Sayisi', value: '13 oda' }, { label: 'Oda Tipi', value: '5 farkli kategori' }, { label: 'Konum', value: 'Erdek merkez' }],
        rooms: [
          { name: 'Standart Oda', meta: '24 m2 | 2 yetiskin | 6 oda', price: '4.700 TL', note: 'Konforlu yatak duzeni, premium buklet malzemeleri ve gunluk kullanima uygun sade bir dinlenme alani sunar.' },
          { name: 'Standart Buyuk Oda', meta: '32 m2 | 3 yetiskin | 3 oda', price: '5.900 TL', note: 'Daha genis yerlesim, bagaj ve hareket rahatligi arayan misafirler icin ergonomik ve ferah bir alternatiftir.' },
          { name: 'Deniz Manzarali Delux Oda', meta: '34 m2 | 3 yetiskin | 1 oda', price: '7.600 TL', note: 'Erdek manzarasini konfora donusturen, ozel hissi yuksek ve premium deneyim odakli secenektir.' },
          { name: 'Sultan Keyfi Oda', meta: '36 m2 | 2-3 yetiskin | 2 oda', price: '8.200 TL', note: 'Ozel dekor detaylari, sakin atmosferi ve ayricalikli konaklama hissiyle one cikan premium kategori.' },
          { name: 'Tek Kisilik Oda', meta: '18 m2 | 1 yetiskin | 1 oda', price: '3.900 TL', note: 'Is seyahati veya kisa konaklama planlari icin tasarlanan; verimli, duzenli ve huzurlu bir oda kurgusu sunar.' }
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
        cover: 'linear-gradient(135deg, rgba(16,42,56,0.76) 0%, rgba(40,121,156,0.36) 54%, rgba(247,230,204,0.16) 100%), url(https://commons.wikimedia.org/wiki/Special:FilePath/Erdek%20Turkey.jpg) center/cover no-repeat',
        photo: commons('Erdek%20Turkey.jpg'),
        photoAlt: 'Erdek kiyisi ve deniz manzarasi',
        summary: 'Resmi sitesinde tum odalarin deniz gordugu, ozel plaj kullanimli ve aile yonetimli bir Erdek oteli olarak tanitiliyor.',
        description: 'Gulplaj Hotel; resmi sitesinde aile yonetimi, tum odalarin deniz gormesi ve denize sifir konumuyla one cikiyor. Balnet ve Etstur listelemelerinde ozel plaj, acik bufe kahvalti ve restoran operasyonu bilgileri yer aliyor. Han Otelcilik portfoyunde deniz tatili odakli aile oteli pozisyonunda kurgulaniyor.',
        storyTitle: 'Erdek hafizasinda yeri olan sahil oteli',
        story: 'Gulplaj Hotel resmi anlatiminda kendisini 1960 yilinda Erdekte kurulan ve Turkiyenin ilk turizm belgeli oteli olarak tanimlar. Aile yonetimi vurgusu ve 2014 ile 2020 yenilemeleri, markanin nostalji ile guncel konforu bir araya getirme cabasini netlestirir.',
        editorial: 'Bu markanin en guclu yani; deniz manzarasini sadece bir goruntu degil, butun konaklama deneyiminin omurgasi haline getirmesidir.',
        signatureMoments: ['Tum odalarda denizle goz temasi kuran yerlesim duzeni', 'Aile tatilinde plaj kullanimini kolaylastiran sahil temasi', 'Kusaklar boyunca geri donulebilecek tanidik yaz oteli hissi'],
        nearby: ['zeytinliada', 'cugra-kurbagali', 'apostol-cifte-oluk'],
        highlights: ['Tum odalar deniz goruyor', 'Denize sifir ve ozel plaj kullanimli', 'Aile yonetimi ve restoran destekli hizmet'],
        features: ['Acik bufe kahvalti ve restoran akisi', 'Sahil bandinda aile odakli konaklama deneyimi', 'Plaj kullanimi ve restoran operasyonu ile tumlesik model'],
        stats: [{ label: 'Konum', value: 'Sahil bandi' }, { label: 'Oda Yapisi', value: 'Tum odalar deniz gorur' }, { label: 'Temas', value: 'Aile yonetimi' }],
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
        cover: 'linear-gradient(135deg, rgba(32,63,57,0.78) 0%, rgba(80,149,134,0.34) 54%, rgba(241,224,196,0.16) 100%), url(https://commons.wikimedia.org/wiki/Special:FilePath/Narl%C4%B1%20Turkey%20-%20panoramio.jpg) center/cover no-repeat',
        photo: commons('Narl%C4%B1%20Turkey%20-%20panoramio.jpg'),
        photoAlt: 'Kapidag Yarimadasinda Narlidan deniz manzarasi',
        summary: 'Resmi sitede denize sifir, yarim pansiyon veya oda kahvalti secenekli ve merkez yurume mesafesinde bir pansiyon olarak sunuluyor.',
        description: 'Villa Ece Pansiyon; resmi sitesinde Erdek merkez yurume mesafesinde, denize sifir bir villa veya pansiyon olarak konumlaniyor. Iletisim sayfasinda kendi adresi ve telefonu yer aliyor; ana sayfasinda ise Gul Plaj Hotel ve Mavi Inci Park Otel diger tesislerimiz olarak gosteriliyor. Bu nedenle Han Otelcilik altindaki coklu portfoyun aile pansiyonu halkasini olusturuyor.',
        storyTitle: 'Portfoyun aile evi karakterini tasiyan sahil pansiyonu',
        story: 'Villa Ece Pansiyon resmi anlatiminda denize sifir, merkeze yurume mesafesinde ve yarim pansiyon veya oda kahvalti secenekleriyle sunuluyor. Ayni sitede diger tesislerimiz ifadesiyle Mavi Inci Park Otel ve Gulplaj Hotelin birlikte anilmasi, bu markayi Han Otelcilik portfoyunun bir bag dokusu haline getiriyor.',
        editorial: 'Villa Ece tarafinda one cikan his; daha yavas, daha ailevi ve daha yerel bir Erdek ritmine karisabilmek.',
        signatureMoments: ['Denize sifir karakteri daha sakin ve ev sicakliginda hissettiren pansiyon duzeni', 'Merkeze yurumelik konum sayesinde otomobilsiz tatil rahatligi', 'Aile odakli odalarda uzun konaklamaya uygun daha yavas seyir'],
        nearby: ['zeytinliada', 'kirazli-manastiri', 'pasalimani'],
        highlights: ['Denize sifir pansiyon karakteri', 'Merkeze yurumelik ve aile odakli yerlesim', 'Yarim pansiyon veya oda kahvalti secenekleri'],
        features: ['Standart, dort kisilik ve bes kisilik oda karmasi', 'Restoran, teras ve bahce kullanimi', 'Tek merkezden yonetilen aile konaklamasi modeli'],
        stats: [{ label: 'Konum', value: 'Denize sifir' }, { label: 'Model', value: 'Pansiyon / yarim pansiyon' }, { label: 'Baglanti', value: 'Diger tesislerle birlikte' }],
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
        photo: commons('Erdek%20Turkey.jpg'),
        photoAlt: 'Erdekte sahil ve merkez atmosferi',
        summary: 'Smile Foodhouse, Han Otelcilik icindeki hizli servis restoran markasi olarak konumlandirildi.',
        description: 'Smile Foodhouse, grubun konaklama disi yeme icme operasyonunu tasiyan hizli servis restoran markasidir. Erdek merkez akisi icinde paket servis, hizli masa devri ve otel misafirlerine capraz satis yapabilecek sekilde konumlandirildi.',
        storyTitle: 'Hizli servis ama marka disiplini yuksek',
        story: 'Smile Foodhouse, gruptaki konaklama markalarinin gun icindeki hizli yeme ihtiyacini ve sahil hattindaki sokak trafigini ayni anda yakalamak icin tasarlandi. Kisa bekleme suresi, net menu kurgusu ve paket servis kas yapisi markanin ana omurgasini olusturur.',
        editorial: 'Bu marka, Erdek merkezde gunu kesmeden dogru urune hizlica ulasmayi hedefleyen misafirler icin kurgulandi.',
        signatureMoments: ['Otele donmeden once hizli ogle veya gece atistirmasi', 'Paket servisle oda veya sahil rotasina eslik eden duzen', 'Gencler ve aileler icin kolay karar verilen menu yapisi'],
        nearby: ['zeytinliada', 'cugra-kurbagali'],
        highlights: ['Marka kimligi ve menu yapisi panelden yonetilebilir', 'Otel misafirlerine hizli servis entegrasyonu', 'Paket servis ve gece gec saat operasyonu kurgusu'],
        features: ['Burger, wrap, box menu ve gece paketi akisi', 'Merkezi operasyonla birden fazla tesise servis senaryosu', 'Kampanya ve menulerin panelden kolay guncellenmesi'],
        stats: [{ label: 'Tip', value: 'Fast Food' }, { label: 'Model', value: 'Hizli servis + paket' }, { label: 'Durum', value: 'Smile Foodhouse markasi aktif' }],
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
        photo: commons('Sunset%20in%20Erdek.jpg'),
        photoAlt: 'Erdekte aksam ustu sahil gorunumu',
        summary: 'Han Pub, Erdek aksamina sosyal ritim ve etkinlik kurgusu eklemek icin tasarlanan ayri bir yeme icme markasidir.',
        description: 'Han Pub, grubun yeme icme tarafini gece ekonomisi ve sosyal etkinliklerle genisletmek icin tasarlandi. Otel misafirlerinin aksam deneyimini grup icinde tutan, yerel ziyaretciyi de iceri ceken bir sosyal mekan olarak ele alindi.',
        storyTitle: 'Aksam ekonomisini grup icinde tutan sosyal alan',
        story: 'Pub birimi, Erdek gecelerinde otelden sonra devam edecek kontrollu ve karakterli bir sosyal deneyim yaratmak icin kurgulandi. Etkinlik geceleri, kokteyl secenekleri ve masa rezervasyonu akisi, bu markanin gece tarafindaki omurgasini kurar.',
        editorial: 'Konaklama deneyimini bir gece ritmi ile tamamlamak isteyen misafir icin pub, hatirlanan ikinci adres olur.',
        signatureMoments: ['Gun batimindan sonra yavasca canlanan sosyal ortam', 'Etkinlik geceleriyle tatili daha hatirlanir kilan program', 'Otel misafirine kolay gecis veren merkez konum'],
        nearby: ['zeytinliada', 'cugra-kurbagali'],
        highlights: ['Calisma adi panelden degistirilebilir', 'Otel konaklamasina gece hayati uzantisi kazandirir', 'Etkinlik, maca gunu ve akustik gece senaryolarina uygun'],
        features: ['Draft secenekleri, signature kokteyl ve etkinlik geceleri', 'Masa rezervasyonu ve otel misafirine oncelikli giris kurgusu', 'Merkez operasyondan kampanya ve etkinlik takvimi yonetimi'],
        stats: [{ label: 'Tip', value: 'Pub' }, { label: 'Model', value: 'Etkinlik + gece hayati' }, { label: 'Durum', value: 'Konsept marka aktif' }],
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

  function findDefaultEntry(id) {
    return defaults.businesses.find(function (item) { return item.id === id; }) || null;
  }

  function migrateLegacyEntry(entry) {
    if (!entry || entry.id !== 'han-fast-food') return entry;

    var next = Object.assign({}, entry);
    var current = findDefaultEntry('han-fast-food');
    next.name = current.name;
    next.shortName = current.shortName;

    if (typeof next.summary === 'string') {
      next.summary = next.summary.replace(/Han Fast Food/g, current.name);
    }

    if (typeof next.description === 'string') {
      next.description = next.description.replace(/Han Fast Food/g, current.name);
    }

    return next;
  }

  function hydrateEntry(entry) {
    entry = migrateLegacyEntry(entry);
    var base = findDefaultEntry(entry.id) || {};
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
      photo: '',
      photoAlt: '',
      summary: '',
      description: '',
      storyTitle: '',
      story: '',
      editorial: '',
      signatureMoments: [],
      nearby: [],
      highlights: [],
      features: [],
      stats: [],
      rooms: [],
      offerings: [],
      sources: []
    }, base, entry, {
      signatureMoments: listify((entry.signatureMoments && entry.signatureMoments.length ? entry.signatureMoments : base.signatureMoments) || []),
      nearby: listify((entry.nearby && entry.nearby.length ? entry.nearby : base.nearby) || []),
      highlights: listify(entry.highlights && entry.highlights.length ? entry.highlights : base.highlights || []),
      features: listify(entry.features && entry.features.length ? entry.features : base.features || []),
      stats: Array.isArray(entry.stats) && entry.stats.length ? entry.stats : clone(base.stats || []),
      rooms: Array.isArray(entry.rooms) && entry.rooms.length ? entry.rooms : clone(base.rooms || []),
      offerings: Array.isArray(entry.offerings) && entry.offerings.length ? entry.offerings : clone(base.offerings || []),
      sources: Array.isArray(entry.sources) && entry.sources.length ? entry.sources : clone(base.sources || [])
    });
  }

  function hydrateState(seed) {
    var next = clone(seed || defaults);
    next.group = Object.assign({}, defaults.group, next.group || {});
    next.group.highlights = listify(next.group.highlights || defaults.group.highlights);
    next.businesses = Array.isArray(next.businesses) && next.businesses.length ? next.businesses.map(hydrateEntry) : defaults.businesses.map(hydrateEntry);
    next.guide = Object.assign({}, defaults.guide, next.guide || {});
    next.guide.destinations = Array.isArray(next.guide.destinations) && next.guide.destinations.length ? next.guide.destinations : clone(defaults.guide.destinations);
    next.guide.itinerary = Array.isArray(next.guide.itinerary) && next.guide.itinerary.length ? next.guide.itinerary : clone(defaults.guide.itinerary);
    next.inquiries = Array.isArray(next.inquiries) ? next.inquiries : [];
    return next;
  }

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var next = hydrateState(raw ? JSON.parse(raw) : defaults);
      if (raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
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

  function getDestinationById(state, id) {
    var resolved = state || resolveState();
    return (resolved.guide.destinations || []).find(function (item) { return item.id === id; }) || null;
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
    getDestinationById: getDestinationById,
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
