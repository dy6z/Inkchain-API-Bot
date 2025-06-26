const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config(); // Memuat variabel dari .env

// Mengambil konfigurasi dari .env
const telegramToken = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(telegramToken, { polling: true });

const apiKey = process.env.API_KEY || 'YOUR_API_KEY';
const yourAddress = process.env.YOUR_ADDRESS || 'YOUR_WALLET_ADDRESS';

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Selamat datang! Bot OnchainGM aktif. Ketik /onchaingm, /ratedapp, /merits, /tokens, atau /txhistory.');
});

bot.onText(/\/onchaingm/, async (msg) => {
  const chatId = msg.chat.id;
  const balance = await getBalance(yourAddress);
  const ethBalance = balance ? balance / 1e18 : 0;
  bot.sendMessage(chatId, `OnchainGM! Saldo ETH: ${ethBalance} ETH`);
});

bot.onText(/\/ratedapp/, async (msg) => {
  const chatId = msg.chat.id;
  const dAppAddress = process.env.DAPP_ADDRESS || '0xYourDAppAddress'; // Ganti dengan alamat dApp
  const transactions = await getTransactions(dAppAddress);
  const rating = transactions.length > 0 ? `Rating: ${Math.min(transactions.length, 10)}/10` : 'Rating: Tidak tersedia';
  bot.sendMessage(chatId, `Rating dApp: ${rating} (berdasarkan ${transactions.length} transaksi)`);
});

bot.onText(/\/merits/, (msg) => {
  const chatId = msg.chat.id;
  const nextClaimTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta' }) > '07:00:00'
    ? new Date(new Date().setHours(31, 0, 0, 0)).toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta' })
    : '07:00:00';
  bot.sendMessage(chatId, `Merits Anda: Lihat di https://explorer.inkonchain.com/account/merits\nNext claim sekitar ${nextClaimTime} WIB!`);
});

bot.onText(/\/tokens/, async (msg) => {
  const chatId = msg.chat.id;
  const tokens = await getTokenBalance(yourAddress);
  const tokenList = tokens.map(t => `${t.tokenSymbol}: ${t.value / Math.pow(10, t.tokenDecimal || 18)}`).join('\n') || 'Tidak ada token';
  bot.sendMessage(chatId, `Saldo Token:\n${tokenList}`);
});

bot.onText(/\/txhistory/, async (msg) => {
  const chatId = msg.chat.id;
  const transactions = await getTransactions(yourAddress);
  const txList = transactions.map(tx => `Hash: ${tx.hash}, Value: ${tx.value / 1e18} ETH, Time: ${new Date(tx.timeStamp * 1000).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })}`).join('\n') || 'Tidak ada transaksi';
  bot.sendMessage(chatId, `Riwayat Transaksi Anda:\n${txList}`);
});

// Pengingat klaim
setInterval(() => {
  const now = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta' });
  if (now >= '06:30:00' && now < '07:30:00') {
    bot.sendMessage(process.env.CHAT_ID || 'YOUR_CHAT_ID', 'Waktu klaim Merits hampir tiba! Klaim di https://explorer.inkonchain.com/account/merits');
  }
}, 60 * 1000); // Cek setiap menit

async function getBalance(address) {
  const response = await axios.get('https://explorer.inkonchain.com/api', {
    params: { module: 'account', action: 'balance', address, tag: 'latest', apikey: apiKey }
  });
  return response.data.result;
}

async function getTransactions(address) {
  const response = await axios.get('https://explorer.inkonchain.com/api', {
    params: { module: 'account', action: 'txlist', address, apikey: apiKey }
  });
  return response.data.result || [];
}

async function getTokenBalance(address) {
  const response = await axios.get('https://explorer.inkonchain.com/api', {
    params: { module: 'account', action: 'tokentx', address, apikey: apiKey }
  });
  return response.data.result || [];
}

console.log('Bot is running...');
