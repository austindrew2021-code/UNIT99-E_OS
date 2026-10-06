# SR-LINK 3000

Cabin terminal for a **2025 Nissan Sentra SR** 8-inch display, driven by a **Samsung S23 Ultra** over USB Android Auto.

This repository is only the car hub. It does not contain, and must not be merged into, the strategy desk (`nightshift-desk`).

Live page: https://austindrew2021-code.github.io/

## What it does

- Phosphor / amber CRT layout sized for the Sentra's 8-inch screen and the phone
- Public KuCoin spot tape (BTC, ETH, SOL, KCS) and USDT-M futures (XBT, ETH, SOL)
- Miramichi recon chart, with an optional phone GPS fix
- Launch cards for KuCoin, YouTube, Spotify, and Google Maps
- Checklist for the S23 Ultra → Fermata / AABrowser bridge

No KuCoin password, API key, or order routing lives here. Trading stays in the KuCoin app on the phone.

## Bridge checklist

1. **Deploy (done).** Bookmark the Pages address above.
2. **S23 Ultra developer settings.** Settings → About phone → Software information → tap Build number 7 times. Then Android Auto → About → tap the version 10 times → Developer settings → Unknown sources.
3. **AAAD + Fermata.** Install AAAD only from [github.com/shmykelsa/AAAD](https://github.com/shmykelsa/AAAD). In AAAD, install Fermata Auto, Fermata Control, and AABrowser. Ignore unofficial APK sites.
4. **Sentra SR + KuCoin.** Data USB cable into the car. Accept Android Auto on the 8-inch screen. Sign into KuCoin on the phone.
5. **Bookmark + dual screen.** Open this page in AABrowser (or Fermata's browser) on the car display and bookmark it. Leave KuCoin on the phone. Pull over before placing an order.

## Market feed

The page calls KuCoin's public REST API from the browser. If the car browser blocks that (CORS), it retries through `api.allorigins.win`. Prices can lag. They are not a trading signal.
