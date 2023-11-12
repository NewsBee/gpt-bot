export const midtransClient = require("midtrans-client");

// Inisialisasi Snap API dengan konfigurasi
export const snap = new midtransClient.Snap({
  isProduction: false, // Atur ke 'true' jika ingin mode produksi
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
