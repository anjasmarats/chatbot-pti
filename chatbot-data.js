// Data pertanyaan dan jawaban untuk chatbot
// const chatbotData = {
//   welcome: {
//     message: "Halo! Selamat datang di Online Shop kami. Ada yang bisa saya bantu?",
//     options: [
//       { id: 1, text: "📦 Status Pemesanan" },
//       { id: 2, text: "🛍️ Produk Terbaru" },
//       { id: 3, text: "💰 Promo dan Diskon" },
//       { id: 4, text: "📞 Hubungi Customer Service" },
//       { id: 5, text: "❓ Bantuan Lainnya" }
//     ]
//   },
//   responses: {
//     1: {
//       message: "Untuk mengecek status pemesanan, saya butuh beberapa informasi:",
//       options: [
//         { id: 1.1, text: "Saya sudah memiliki nomor order" },
//         { id: 1.2, text: "Saya lupa nomor order" },
//         { id: 1.3, text: "Kembali ke menu utama" }
//       ]
//     },
//     1.1: {
//       message: "Silakan masukkan nomor order Anda (contoh: ORD123456):",
//       type: "input",
//       next: "checkOrder"
//     },
//     1.2: {
//       message: "Silakan masukkan email yang digunakan untuk pemesanan:",
//       type: "input",
//       next: "findOrder"
//     },
//     2: {
//       message: "Berikut adalah kategori produk terbaru kami:",
//       options: [
//         { id: 2.1, text: "👕 Fashion" },
//         { id: 2.2, text: "📱 Elektronik" },
//         { id: 2.3, text: "🏠 Home & Living" },
//         { id: 2.4, text: "💄 Beauty" },
//         { id: 2.5, text: "Kembali ke menu utama" }
//       ]
//     },
//     2.1: {
//       message: "Kategori Fashion:\n• Pakaian Pria\n• Pakaian Wanita\n• Aksesoris\n• Sepatu\n\nProduk terbaru:\n✅ Kemeja Casual - Rp 199.000\n✅ Dress Summer - Rp 299.000\n✅ Sneaker Limited Edition - Rp 599.000",
//       options: [
//         { id: 2.11, text: "Lihat detail produk" },
//         { id: 2.12, text: "Kembali ke kategori" }
//       ]
//     },
//     3: {
//       message: "🛍️ PROMO SPESIAL HARI INI! 🛍️\n\n🔥 Diskon hingga 70%\n📦 Gratis Ongkir Min. Belanja Rp 200.000\n🎁 Cashback 10% untuk Member\n\nPromo berlaku hingga 31 Desember 2024",
//       options: [
//         { id: 3.1, text: "Syarat dan Ketentuan" },
//         { id: 3.2, text: "Cara Klaim Promo" },
//         { id: 3.3, text: "Kembali ke menu utama" }
//       ]
//     },
//     4: {
//       message: "📞 Hubungi Customer Service kami:\n\n• Telepon: 1500-123\n• WhatsApp: +62 812-3456-7890\n• Email: support@onlineshop.com\n• Jam Operasional: Senin-Minggu, 08:00-22:00 WIB",
//       options: [
//         { id: 4.1, text: "Chat dengan CS Langsung" },
//         { id: 4.2, text: "Kembali ke menu utama" }
//       ]
//     },
//     5: {
//       message: "Apa yang bisa saya bantu?",
//       options: [
//         { id: 5.1, text: "Cara Pembayaran" },
//         { id: 5.2, text: "Kebijakan Pengembalian" },
//         { id: 5.3, text: "Info Pengiriman" },
//         { id: 5.4, text: "Kembali ke menu utama" }
//       ]
//     }
//   },
//   // Fungsi untuk memproses input khusus
//   processInput: function(type, input) {
//     switch(type) {
//       case "checkOrder":
//         // Simulasi pencarian order
//         const orders = {
//           "ORD123456": { status: "Dalam Pengiriman", estimasi: "2-3 hari", kurir: "JNE" },
//           "ORD789012": { status: "Diproses", estimasi: "1-2 hari", kurir: "J&T" },
//           "ORD345678": { status: "Selesai", estimasi: "Terkirim", kurir: "SiCepat" }
//         };
        
//         if (orders[input]) {
//           const order = orders[input];
//           return {
//             message: `📦 Status Order: ${input}\nStatus: ${order.status}\nEstimasi: ${order.estimasi}\nKurir: ${order.kurir}`,
//             options: [
//               { id: "main", text: "Kembali ke menu utama" }
//             ]
//           };
//         } else {
//           return {
//             message: "❌ Nomor order tidak ditemukan. Silakan cek kembali nomor order Anda.",
//             options: [
//               { id: 1, text: "Coba lagi" },
//               { id: "main", text: "Kembali ke menu utama" }
//             ]
//           };
//         }
      
//       case "findOrder":
//         // Simulasi pencarian berdasarkan email
//         return {
//           message: `📧 Order ditemukan untuk email: ${input}\n\nNomor Order: ORD123456\nStatus: Dalam Pengiriman\n\nDetail telah dikirim ke email Anda.`,
//           options: [
//             { id: "main", text: "Kembali ke menu utama" }
//           ]
//         };
      
//       default:
//         return {
//           message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
//           options: [
//             { id: "main", text: "Kembali ke menu utama" }
//           ]
//         };
//     }
//   }
// };

const chatbotData = {
  welcome: {
    message: "Halo! Selamat datang di chatbot informatika. Ada yang bisa saya bantu?",
    // options: [
    //   { id: 1, text: "Informasi seputar Program Studi (Prodi) Informatika" },
    //   { id: 2, text: "🛍️ Produk Terbaru" },
    //   { id: 3, text: "💰 Promo dan Diskon" },
    //   { id: 4, text: "📞 Hubungi Customer Service" },
    //   { id: 5, text: "❓ Bantuan Lainnya" }
    // ]
    options: [
        { id: 1.1, text: "Profil & Akreditasi" },
        { id: 1.2, text: "Kurikulum & Mata Kuliah" },
        { id: 1.3, text: "Prospek Karir & Alumni" },
        { id: 1.4, text: "Fasilitas Laboratorium" },
        { id: 1.5, text: "Proses Pembelajaran & Akademik" },
      ]
  },
  responses: {
    // 1: {
    //   message: "Apa yang ingin kamu ketahui tentang Prodi Informatika?",
    //   options: [
    //     { id: 1.1, text: "Profil & Akreditasi" },
    //     { id: 1.2, text: "Kurikulum & Mata Kuliah" },
    //     { id: 1.3, text: "Prospek Karir & Alumni" },
    //     { id: 1.4, text: "Fasilitas Laboratorium" },
    //     { id: 1.5, text: "Proses Pembelajaran & Akademik" },
    //   ]
    // },
    1.1: {
      message: `Program Studi Teknik Informatika di Universitas Sarjanawiyata Tamansiswa (UST) Yogyakarta terakreditasi B dengan nilai 343, berlaku selama lima tahun. Akreditasi ini ditetapkan oleh Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT) berdasarkan Surat Keputusan yang berlaku. 
Peringkat Akreditasi: B
Nilai: 343
Masa Berlaku: 5 tahun sejak tanggal penetapan
Institusi Penilai: Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT)
`
    },
    1.2: {
      message: `Mata kuliah wajib:
Pancasila 
Agama 
Bahasa Indonesia 
Organisasi dan Arsitektur Komputer 

Mata kuliah inti (teknis):
Algoritma dan Pemrograman 
Sistem Basis Data 
Sistem Operasi 

Mata kuliah pilihan:
Jaringan Komputer 
Rekayasa Perangkat Lunak (seperti Analisis dan Pengembangan Perangkat Lunak) `,
    },
    1.3: {
      message: `Pengembang Perangkat Lunak (Software Developer): Menciptakan dan memelihara program komputer, baik untuk situs web (Web Developer) maupun aplikasi seluler (Mobile App Developer).
Spesialis Keamanan Siber (Cybersecurity Specialist): Melindungi data dan sistem dari serangan siber.
Ilmuwan Data (Data Scientist): Menganalisis data dalam jumlah besar untuk menemukan wawasan yang berguna.
Insinyur Kecerdasan Buatan (AI/Machine Learning Engineer): Mengembangkan teknologi berbasis kecerdasan buatan.
Insinyur Jaringan (Network Engineer): Merancang, mengimplementasikan, dan mengelola jaringan komputer.
Administrator Basis Data (Database Administrator): Bertanggung jawab atas pengelolaan basis data suatu perusahaan.
Wirausahawan Teknologi (Technopreneur): Membangun bisnis rintisan (startup) di bidang teknologi. 

Jejak prestasi mahasiswa: Tim mahasiswa dan dosen Informatika UST pernah terpilih menjadi semifinalis 5 besar dalam kompetisi UI/UX yang diadakan oleh Dinas Kesehatan Kota Semarang pada tahun 2023.
Jejaring alumni:
UST memiliki Biro Kemahasiswaan dan Alumni (BKA) yang aktif dan bisa dihubungi melalui media sosial, seperti Instagram (@alumni.ustjogja).
Melalui BKA, lulusan dapat mengisi formulir data alumni untuk membangun jaringan.
UST juga memiliki akun LinkedIn resmi, yang dapat digunakan untuk melihat jejak alumni secara umum.
Informasi kelulusan wisudawan secara umum, termasuk dari prodi Informatika, diumumkan melalui kanal media sosial UST. 
`,
    },
    1.4: {
      message: `Fasilitas laboratorium yang digunakan oleh mahasiswa Informatika Universitas Sarjanawiyata Tamansiswa (UST) terpusat di Unit Pelaksana Teknis (UPT) Lab Terpadu UST. 
Lokasi fasilitas Laboratorium Terpadu UST
UPT Lab Terpadu yang dikelola oleh UST secara keseluruhan terletak di Kampus Pusat, yaitu di Jalan Batikan UH III No.1043, Tahunan, Umbulharjo, Kota Yogyakarta.
Fakultas Teknik UST, yang menaungi Program Studi Informatika, memiliki gedung sendiri di Jalan Miliran No. 16 Yogyakarta yang dilengkapi dengan berbagai laboratorium dan terhubung dengan Laboratorium Terpadu.
Terdapat juga fasilitas di lokasi lain seperti yang terdaftar di Google Maps dengan nama "INTEGRATED LAB UST" di daerah Wirogunan, yang memiliki tiga lantai dan dilengkapi dengan berbagai ruang lab, termasuk lab komputer. 
Untuk informasi yang lebih spesifik mengenai fasilitas di laboratorium informatika, disarankan untuk menghubungi Fakultas Teknik UST secara langsung. Anda dapat melihat informasi kontak mereka di situs web resmi. `,
    },
    1.5: {
      message: `Proses pembelajaran akademik Program Studi Informatika di Universitas Sarjanawiyata Tamansiswa (UST) Yogyakarta menerapkan pendekatan sistem berbasis luaran atau Outcome-based Education (OBE). Berikut adalah rincian prosesnya: 
Kurikulum
Fokus pada kompetensi: Kurikulum disusun untuk menghasilkan lulusan yang tidak hanya menguasai teori, tetapi juga memiliki kemampuan praktis yang dapat diterapkan di dunia kerja.
Mata kuliah inti: Mahasiswa akan mempelajari mata kuliah fundamental di bidang informatika, seperti:
Pemrograman (dasar dan lanjut)
Algoritma dan Struktur Data
Jaringan Komputer
Basis Data
Sistem Operasi
Rekayasa Perangkat Lunak
Kecerdasan Buatan (AI)
Keamanan Siber 
Metode Pembelajaran
Proses belajar mengajar di Informatika UST dirancang untuk bersifat fleksibel dan inovatif, dengan beberapa metode utama: 
Pembelajaran tatap muka: Perkuliahan di kelas dengan bimbingan langsung dari dosen yang memiliki kualifikasi minimal magister.
Pembelajaran jarak jauh (PJJ): Memanfaatkan berbagai media komunikasi untuk memungkinkan pembelajaran dari jarak jauh.
Praktikum: Pembelajaran berbasis praktik langsung di laboratorium untuk mengaplikasikan teori yang telah dipelajari.
Sistem informasi akademik: Menggunakan portal akademik online (SIPeDar) sebagai sarana komunikasi dan akses materi perkuliahan bagi sivitas akademika. 
Evaluasi hasil studi
Evaluasi dilakukan secara berkala dan ketat untuk memastikan standar kualitas lulusan:
Evaluasi semester: Penilaian hasil belajar dilakukan setiap akhir semester.
Evaluasi berkala: Penilaian khusus juga dilakukan pada akhir tahun kedua dan keempat, serta menjelang akhir masa studi.
Syarat kelulusan: Untuk menyelesaikan program, mahasiswa wajib memenuhi syarat yang telah ditentukan, termasuk publikasi tugas akhir. 
Pengalaman praktis dan non-akademik
UST juga mendorong pengembangan diri mahasiswa di luar ruang kelas melalui:
Penelitian: Dosen dan mahasiswa dapat berpartisipasi dalam penelitian internal universitas yang dikelola oleh Lembaga Penelitian dan Pengabdian kepada Masyarakat (LP2M).
Pengabdian masyarakat: Sebagai bagian dari Caturdharma Perguruan Tinggi, mahasiswa juga terlibat dalam kegiatan yang bermanfaat bagi masyarakat.
Mahasiswa baru: Informasi terkait penerimaan mahasiswa baru dapat diakses melalui laman resmi pmb.ustjogja.ac.id. `,
    },
  },
};

module.exports = chatbotData;