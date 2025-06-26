// Memuat library
require('dotenv').config(); // Load konfigurasi dari file .env
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// Ambil variabel dari file .env
const telegramToken = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.API_KEY;
const yourAddress = process.env.YOUR_ADDRESS;
const dAppAddress = process.env.DAPP_ADDRESS;
const chatIdReminder = process.env.CHAT_ID;

// Inisialisasi bot
const bot = new TelegramBot(telegramToken, { polling: true });

// Respon /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '✅ Bot InkChain aktif!\nKetik /onchaingm, /ratedapp, /merits, /tokens, atau /txhistory.');
});

// Respon /onchaingm
bot.onText(/\/onchaingm/, async (msg) => {
  try {
    const balance = await getBalance(yourAddress);
    const ethBalance = balance ? balance / 1e18 : 0;
    bot.sendMessage(msg.chat.id, `🟢 OnchainGM!\nSaldo ETH: ${ethBalance} ETH`);
  } catch (err) {
    bot.sendMessage(msg.chat.id, `❌ Gagal mengambil saldo ETH.`);
  }
});

// Respon /ratedapp
bot.onText(/\/ratedapp/, async (msg) => {
  try {
    const txs = await getTransactions(dAppAddress);
    const rating = txs.length > 0 ? `Rating: ${Math.min(txs.length, 10)}/10` : 'Rating tidak tersedia';
    bot.sendMessage(msg.chat.id, `📊 Rating dApp:\n${rating} (berdasarkan ${txs.length} transaksi)`);
  } catch (err) {
    bot.sendMessage(msg.chat.id, `❌ Gagal mengambil rating.`);
  }
});

// Respon /merits
bot.onText(/\/merits/, (msg) => {
  const now = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta' });
  const nextClaim = now > '07:00:00' ? 'Besok 07:00 WIB' : 'Hari ini 07:00 WIB';
  bot.sendMessage(msg.chat.id, `🏅 Merits Info:\nLihat: https://explorer.inkonchain.com/account/merits\nNext claim: ${nextClaim}`);
});

// Respon /tokens
bot.onText(/\/tokens/, async (msg) => {
  try {
    const tokens = await getTokenBalance(yourAddress);
    const list = tokens.map(t => `${t.tokenSymbol}: ${t.value / (10 ** (t.tokenDecimal || 18))}`).join('\n') || 'Tidak ada token';
    bot.sendMessage(msg.chat.id, `💰 Token:\n${list}`);
  } catch (err) {
    bot.sendMessage(msg.chat.id, `❌ Gagal mengambil token.`);
  }
});

// Respon /txhistory
bot.onText(/\/txhistory/, async (msg) => {
  try {
    const txs = await getTransactions(yourAddress);
    const list = txs.map(tx => `🔸 ${tx.hash}\nValue: ${tx.value / 1e18} ETH\nWaktu: ${new Date(tx.timeStamp * 1000).toLocaleString('id-ID')}`).slice(0, 5).join('\n\n');
    bot.sendMessage(msg.chat.id, `📜 Riwayat Transaksi:\n${list || 'Tidak ada transaksi.'}`);
  } catch (err) {
    bot.sendMessage(msg.chat.id, `❌ Gagal mengambil transaksi.`);
  }
});

// Pengingat Merits tiap hari jam 06:30 - 07:30
setInterval(() => {
  const now = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta' });
  if (now >= '06:30:00' && now < '07:30:00') {
    bot.sendMessage(chatIdReminder, '⏰ Waktu klaim Merits hampir tiba!\nCek: https://explorer.inkonchain.com/account/merits');
  }
}, 60 * 1000);

// Fungsi ambil saldo ETH
async function getBalance(address) {
  const res = await axios.get('https://explorer.inkonchain.com/api', {
    params: { module: 'account', action: 'balance', address, tag: 'latest', apikey: apiKey }
  });
  return res.data.result;
}

// Fungsi ambil transaksi
async function getTransactions(address) {
  const res = await axios.get('https://explorer.inkonchain.com/api', {
    params: { module: 'account', action: 'txlist', address, apikey: apiKey }
  });
  return res.data.result || [];
}

// Fungsi ambil token
async function getTokenBalance(address) {
  const res = await axios.get('https://explorer.inkonchain.com/api', {
    params: { module: 'account', action: 'tokentx', address, apikey: apiKey }
  });
  return res.data.result || [];
}

console.log('🚀 Bot InkChain berjalan...');
