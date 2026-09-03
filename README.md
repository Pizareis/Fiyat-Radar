# Fiyat Radar

Kripto ve döviz kurlarını periyodik olarak izleyen, istatistiksel anomali tespiti yapan ve
web dashboard + mobil push bildirimleriyle uyaran bir sistem.

## Mimari

- **backend/** — FastAPI + APScheduler. Binance public API (kripto) ve open.er-api.com (döviz)
  üzerinden fiyat çeker, SQLite/Postgres'e zaman serisi olarak yazar, rolling z-score ile
  anomali tespiti yapar, anomali olduğunda Expo Push API üzerinden mobil bildirim gönderir.
- **web/** — React + Vite + Recharts dashboard. Fiyat trend grafiği ve anomali listesi.
- **mobile/** — Expo (React Native) uygulaması. Varlık listesi, anomali listesi, push bildirim kaydı.

Veri akışı: `scheduler (her N dakika)` → `collectors.py (Binance/döviz API)` → `PriceTick (DB)`
→ `anomaly.py (z-score)` → anomali varsa `Anomaly (DB)` + `push.py (Expo push)`.

## Backend'i çalıştırma

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Varsayılan olarak SQLite kullanır (`backend/fiyatradar.db`), hiçbir ek kurulum gerektirmez.
Postgres'e geçmek için `docker-compose up -d` çalıştırıp `.env` içindeki `DATABASE_URL`'i
Postgres satırıyla değiştir.

API `http://localhost:8000/api` altında yayında olur. Sunucu açılınca scheduler otomatik
başlar ve ilk veri çekimini hemen yapar.

**Not:** Bu geliştirme ortamının network'ü Binance/CoinGecko gibi bazı domainlere erişimi
kısıtlıyordu (SSL handshake hatası) — döviz API'si (open.er-api.com) buradan test edildi ve
çalıştı. Kendi makinende (normal internet erişimiyle) kripto tarafı da sorunsuz çalışmalı;
eğer Binance senin ağından da engelliyse (bazı ülkelerde IP bazlı kısıtlama var), `collectors.py`
içindeki `fetch_crypto_prices` fonksiyonunu CoinGecko API'sine çevirebiliriz.

## Web dashboard'u çalıştırma

Node.js gerekli (bu makinede kurulu değildi, kurulum sonrası):

```bash
cd web
npm install
npm run dev
```

`http://localhost:5173` — Vite dev server `/api` isteklerini backend'e proxy'ler
(bkz. `vite.config.js`), bu yüzden backend'in `localhost:8000`'de ayakta olması gerekiyor.

## Mobil uygulamayı çalıştırma

```bash
cd mobile
npm install
npx expo start
```

- Fiziksel cihazda Expo Go ile test ederken `src/config.js` içindeki `API_BASE_URL`'i
  `localhost` yerine bilgisayarının LAN IP'sine çevir (örn. `http://192.168.1.23:8000/api`).
- Push bildirimleri fiziksel cihaz gerektirir (emulator/simulator'da çalışmaz).
- Expo push token'ı otomatik olarak backend'e (`POST /api/devices`) kaydedilir; anomali
  tespit edildiğinde backend bu token'lara Expo Push API üzerinden bildirim gönderir.

## Sonraki adımlar / genişletme fikirleri

- Anomali modelini z-score'dan Isolation Forest gibi bir ML modeline taşımak
- Daha fazla varlık eklemek (`.env` içindeki `CRYPTO_SYMBOLS` / `FOREX_PAIRS`)
- Kullanıcı bazlı takip listesi ve eşik ayarları (şu an global eşik)
- Postgres + TimescaleDB ile prodüksiyon ölçekli zaman serisi saklama
