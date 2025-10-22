// Data pertanyaan dan jawaban untuk chatbot
const chatbotData = {
  welcome: {
    message: "Halo! Selamat datang di Online Shop kami. Ada yang bisa saya bantu?",
    options: [
      { id: 1, text: "📦 Status Pemesanan" },
      { id: 2, text: "🛍️ Produk Terbaru" },
      { id: 3, text: "💰 Promo dan Diskon" },
      { id: 4, text: "📞 Hubungi Customer Service" },
      { id: 5, text: "❓ Bantuan Lainnya" }
    ]
  },
  responses: {
    1: {
      message: "Untuk mengecek status pemesanan, saya butuh beberapa informasi:",
      options: [
        { id: 1.1, text: "Saya sudah memiliki nomor order" },
        { id: 1.2, text: "Saya lupa nomor order" },
        { id: 1.3, text: "Kembali ke menu utama" }
      ]
    },
    1.1: {
      message: "Silakan masukkan nomor order Anda (contoh: ORD123456):",
      type: "input",
      next: "checkOrder"
    },
    1.2: {
      message: "Silakan masukkan email yang digunakan untuk pemesanan:",
      type: "input",
      next: "findOrder"
    },
    2: {
      message: "Berikut adalah kategori produk terbaru kami:",
      options: [
        { id: 2.1, text: "👕 Fashion" },
        { id: 2.2, text: "📱 Elektronik" },
        { id: 2.3, text: "🏠 Home & Living" },
        { id: 2.4, text: "💄 Beauty" },
        { id: 2.5, text: "Kembali ke menu utama" }
      ]
    },
    2.1: {
      message: "Kategori Fashion:\n• Pakaian Pria\n• Pakaian Wanita\n• Aksesoris\n• Sepatu\n\nProduk terbaru:\n✅ Kemeja Casual - Rp 199.000\n✅ Dress Summer - Rp 299.000\n✅ Sneaker Limited Edition - Rp 599.000",
      options: [
        { id: 2.11, text: "Lihat detail produk" },
        { id: 2.12, text: "Kembali ke kategori" }
      ]
    },
    3: {
      message: "🛍️ PROMO SPESIAL HARI INI! 🛍️\n\n🔥 Diskon hingga 70%\n📦 Gratis Ongkir Min. Belanja Rp 200.000\n🎁 Cashback 10% untuk Member\n\nPromo berlaku hingga 31 Desember 2024",
      options: [
        { id: 3.1, text: "Syarat dan Ketentuan" },
        { id: 3.2, text: "Cara Klaim Promo" },
        { id: 3.3, text: "Kembali ke menu utama" }
      ]
    },
    4: {
      message: "📞 Hubungi Customer Service kami:\n\n• Telepon: 1500-123\n• WhatsApp: +62 812-3456-7890\n• Email: support@onlineshop.com\n• Jam Operasional: Senin-Minggu, 08:00-22:00 WIB",
      options: [
        { id: 4.1, text: "Chat dengan CS Langsung" },
        { id: 4.2, text: "Kembali ke menu utama" }
      ]
    },
    5: {
      message: "Apa yang bisa saya bantu?",
      options: [
        { id: 5.1, text: "Cara Pembayaran" },
        { id: 5.2, text: "Kebijakan Pengembalian" },
        { id: 5.3, text: "Info Pengiriman" },
        { id: 5.4, text: "Kembali ke menu utama" }
      ]
    }
  },
  // Fungsi untuk memproses input khusus
  processInput: function(type, input) {
    switch(type) {
      case "checkOrder":
        // Simulasi pencarian order
        const orders = {
          "ORD123456": { status: "Dalam Pengiriman", estimasi: "2-3 hari", kurir: "JNE" },
          "ORD789012": { status: "Diproses", estimasi: "1-2 hari", kurir: "J&T" },
          "ORD345678": { status: "Selesai", estimasi: "Terkirim", kurir: "SiCepat" }
        };
        
        if (orders[input]) {
          const order = orders[input];
          return {
            message: `📦 Status Order: ${input}\nStatus: ${order.status}\nEstimasi: ${order.estimasi}\nKurir: ${order.kurir}`,
            options: [
              { id: "main", text: "Kembali ke menu utama" }
            ]
          };
        } else {
          return {
            message: "❌ Nomor order tidak ditemukan. Silakan cek kembali nomor order Anda.",
            options: [
              { id: 1, text: "Coba lagi" },
              { id: "main", text: "Kembali ke menu utama" }
            ]
          };
        }
      
      case "findOrder":
        // Simulasi pencarian berdasarkan email
        return {
          message: `📧 Order ditemukan untuk email: ${input}\n\nNomor Order: ORD123456\nStatus: Dalam Pengiriman\n\nDetail telah dikirim ke email Anda.`,
          options: [
            { id: "main", text: "Kembali ke menu utama" }
          ]
        };
      
      default:
        return {
          message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          options: [
            { id: "main", text: "Kembali ke menu utama" }
          ]
        };
    }
  }
};

module.exports = chatbotData;