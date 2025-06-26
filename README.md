# Inkchain-API-Bot

API Bot otomatis untuk OnchainGM, rating dApps di InkChain, dan notifikasi klaim Merits selama Ink Week (23–29 Juni 2025), dengan integrasi Telegram.

## Deskripsi
Bot ini dirancang untuk berinteraksi dengan jaringan InkChain melalui Blockscout API, menyediakan fitur seperti salam "OnchainGM", rating dApps berdasarkan transaksi, dan pengingat klaim Merits harian. Bot ini menggunakan Telegram sebagai antarmuka pengguna.

## Prasyarat
- Node.js (versi 14.x atau lebih baru)
- Akun Telegram dan token bot dari @BotFather
- API Key dari Blockscout (https://explorer.inkonchain.com)
- Alamat dompet InkChain (contoh: `0x8ca06Ed2Cf3b31248b3B7C091864980041322284`)

## Instalasi

**Kloning Repository**

    git clone https://github.com/dy6z/Inkchain-API-Bot.git
    cd Inkchain-API-Bot

1. Install

       npm install

2.  Konfigurasi
- Buat file .env di direktori root dengan isi:

TELEGRAM_TOKEN=YOUR_TOKEN
API_KEY=YOUR_API_KEY
YOUR_ADDRESS=0xYOurWallet_Address
DAPP_ADDRESS=0xYourDAppAddress
CHAT_ID=YOUR_CHAT_ID
- Ganti placeholder dengan nilai Anda.

3. Jalankan Bot

       node bot.js

Perintah Bot
- /start: “Selamat datang! Bot OnchainGM aktif. Ketik /onchaingm, /ratedapp, /merits, /tokens, atau /txhistory.”
- /onchaingm: “OnchainGM! Saldo ETH: [nilai] ETH” (misalnya, “OnchainGM! Saldo ETH: 0.00042876 ETH”).
- /ratedapp: “Rating dApp: [rating] (berdasarkan [jumlah] transaksi)” (misalnya, “Rating dApp: 5/10 (berdasarkan 5 transaksi)” atau “Rating dApp: Tidak tersedia (berdasarkan 0 transaksi)”).
- /merits: “Merits Anda: Lihat di https://explorer.inkonchain.com/account/merits\nNext claim sekitar 07:00:00 WIB!” (atau waktu berikutnya).
- /tokens: “Saldo Token:\n[iETH: 0.208263178825793]\n[WETH: 0.31]\n” (atau “Saldo Token:\nTidak ada token”).
- /txhistory: “Riwayat Transaksi Anda:\nHash: [hash], Value: [nilai] ETH, Time: [waktu]\n” (misalnya, “Riwayat Transaksi Anda:\nHash: 0xf29658211a4da4687fa2647f49811d670f500c3f2e513871b4ba5c64ba9780ca, Value: 0.00015 ETH, Time: 18 Feb 2025 18:28:24”).

Fitur Tambahan
- Pengingat Klaim Merits: Bot akan mengirim notifikasi antara 06:30–07:30 AM WIB setiap hari untuk mengingatkan Anda mengklaim Merits di https://explorer.inkonchain.com/account/merits.

Lisensi
MIT License
