const express = require('express');
const cors = require('cors');
const { pipeline } = require('@xenova/transformers');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Data: Array of documents. Add your documents here.
let documents = [
  { id: 1, text: 'Cara memperbaiki laptop yang overheat.' },
  { id: 2, text: 'Resep membuat martabak manis enak di rumah.' },
  { id: 3, text: 'Lirik lagu pop Indonesia terbaru tahun 2025.' },
  { id: 4, text: 'Tips menjaga kesehatan jantung dengan olahraga.' },
  { id: 5, text: 'Panduan belajar programming Python untuk pemula.' },
  { id: 6, text: 'Cara memasak rendang daging sapi asli Minang.' },
  { id: 7, text: 'Sejarah perkembangan AI dari tahun 1950 hingga sekarang.' },
  { id: 8, text: 'Manfaat minum air putih 8 gelas sehari.' },
  { id: 9, text: 'Tutorial install Windows 11 di PC lama.' },
  { id: 10, text: 'Resep smoothie buah segar untuk diet sehat.' },
  { id: 11, text: 'Lirik dan chord gitar lagu rock klasik.' },
  { id: 12, text: 'Cara mengatasi sakit kepala migrain secara alami.' },
  { id: 13, text: 'Belajar JavaScript dasar untuk web development.' },
  { id: 14, text: 'Masakan ayam geprek pedas ala rumahan.' },
  { id: 15, text: 'Perkembangan teknologi blockchain di 2025.' },
  { id: 16, text: 'Tips tidur nyenyak untuk orang sibuk.' },
  { id: 17, text: 'Cara setting router WiFi agar lebih cepat.' },
  { id: 18, text: 'Resep kue brownies coklat lezat.' },
  { id: 19, text: 'Lirik lagu dangdut koplo hits.' },
  { id: 20, text: 'Manfaat yoga untuk mengurangi stres.' },
  { id: 21, text: 'Panduan belajar SQL database untuk beginner.' },
  { id: 22, text: 'Cara membuat sate ayam bumbu kacang.' },
  { id: 23, text: 'Sejarah internet dari ARPANET hingga 5G.' },
  { id: 24, text: 'Tips menjaga mata sehat saat kerja di depan komputer.' },
  { id: 25, text: 'Tutorial edit video dengan CapCut di HP.' },
  { id: 26, text: 'Resep sup ayam kampung obat flu.' },
  { id: 27, text: 'Lirik lagu ballad romantis internasional.' },
  { id: 28, text: 'Cara mengobati batuk kering dengan bahan alami.' },
  { id: 29, text: 'Belajar React.js untuk frontend modern.' },
  { id: 30, text: 'Masakan ikan bakar sambal matah Bali.' },
  { id: 31, text: 'Perkembangan VR dan AR di gaming 2025.' },
  { id: 32, text: 'Manfaat meditasi harian untuk pikiran tenang.' },
  { id: 33, text: 'Cara hack password WiFi? (Hanya edukasi keamanan).' },
  { id: 34, text: 'Resep es campur segar musim panas.' },
  { id: 35, text: 'Lirik dan makna lagu hip-hop underground.' },
  { id: 36, text: 'Tips olahraga lari untuk pemula.' },
  { id: 37, text: 'Panduan belajar Node.js backend.' },
  { id: 38, text: 'Cara memasak mie goreng spesial.' },
  { id: 39, text: 'Sejarah smartphone dari Nokia hingga iPhone.' },
  { id: 40, text: 'Cara mengatasi insomnia tanpa obat.' },
  { id: 41, text: 'Tutorial desain grafis dengan Canva.' },
  { id: 42, text: 'Resep salad sayur sehat low kalori.' },
  { id: 43, text: 'Lirik lagu EDM party hits.' },
  { id: 44, text: 'Manfaat minyak esensial untuk relaksasi.' },
  { id: 45, text: 'Belajar cybersecurity dasar online.' },
  { id: 46, text: 'Masakan gulai kambing khas Jawa.' },
  { id: 47, text: 'Teknologi quantum computing masa depan.' },
  { id: 48, text: 'Tips diet intermittent fasting aman.' },
  { id: 49, text: 'Cara install Android app di PC.' },
  { id: 50, text: 'Resep pancake fluffy sarapan pagi.' },
  { id: 51, text: 'Cara menginstal Linux Ubuntu di laptop baru.' },
  { id: 52, text: 'Resep mie ayam bakso kuah gurih.' },
  { id: 53, text: 'Lirik lagu jazz klasik era 1950-an.' },
  { id: 54, text: 'Tips meningkatkan imunitas tubuh saat musim hujan.' },
  { id: 55, text: 'Panduan belajar HTML dan CSS untuk website sederhana.' },
  { id: 56, text: 'Masakan opor ayam Lebaran tradisional.' },
  { id: 57, text: 'Perkembangan metaverse di industri gaming 2025.' },
  { id: 58, text: 'Manfaat berjalan kaki 10.000 langkah sehari.' },
  { id: 59, text: 'Tutorial edit foto dengan Photoshop dasar.' },
  { id: 60, text: 'Resep jus detox sayur dan buah.' },
  { id: 61, text: 'Chord gitar lagu folk akustik populer.' },
  { id: 62, text: 'Cara mengatasi jerawat dengan skincare alami.' },
  { id: 63, text: 'Belajar machine learning dengan TensorFlow.' },
  { id: 64, text: 'Cara membuat pempek Palembang asli.' },
  { id: 65, text: 'Sejarah cryptocurrency dari Bitcoin hingga altcoins.' },
  { id: 66, text: 'Tips mengelola waktu kerja remote efektif.' },
  { id: 67, text: 'Cara memperbaiki HP Android yang lemot.' },
  { id: 68, text: 'Resep cake red velvet lembut.' },
  { id: 69, text: 'Lirik lagu reggae santai pantai.' },
  { id: 70, text: 'Manfaat pilates untuk postur tubuh.' },
  { id: 71, text: 'Panduan belajar Docker untuk containerization.' },
  { id: 72, text: 'Masakan sayur lodeh Jawa enak.' },
  { id: 73, text: 'Teknologi 6G dan masa depan konektivitas.' },
  { id: 74, text: 'Cara mengobati pilek dengan ramuan herbal.' },
  { id: 75, text: 'Tutorial animasi 2D dengan Blender.' },
  { id: 76, text: 'Resep bubur ayam Jakarta spesial.' },
  { id: 77, text: 'Lirik lagu metal heavy energik.' },
  { id: 78, text: 'Tips bersepeda aman di kota besar.' },
  { id: 79, text: 'Belajar AWS cloud computing untuk pemula.' },
  { id: 80, text: 'Cara memasak steak daging sapi medium rare.' },
  { id: 81, text: 'Sejarah e-commerce dari Amazon hingga sekarang.' },
  { id: 82, text: 'Manfaat sauna untuk detoks tubuh.' },
  { id: 83, text: 'Cara setting VPN di iPhone.' },
  { id: 84, text: 'Resep donat kentang empuk.' },
  { id: 85, text: 'Lirik lagu country western klasik.' },
  { id: 86, text: 'Tips latihan angkat beban di gym.' },
  { id: 87, text: 'Panduan belajar Git dan GitHub.' },
  { id: 88, text: 'Masakan rawon daging khas Surabaya.' },
  { id: 89, text: 'Perkembangan robotika di manufaktur 2025.' },
  { id: 90, text: 'Cara mengatasi stres kerja dengan mindfulness.' },
  { id: 91, text: 'Tutorial coding app mobile dengan Flutter.' },
  { id: 92, text: 'Resep es krim homemade vanila.' },
  { id: 93, text: 'Lirik lagu electronic dance music festival.' },
  { id: 94, text: 'Manfaat akupuntur untuk nyeri punggung.' },
  { id: 95, text: 'Belajar cybersecurity ethical hacking.' },
  { id: 96, text: 'Cara membuat gado-gado sayur segar.' },
  { id: 97, text: 'Teknologi biofuel ramah lingkungan.' },
  { id: 98, text: 'Tips diet keto untuk pemula.' },
  { id: 99, text: 'Cara backup data iCloud di Mac.' },
  { id: 100, text: 'Resep pasta carbonara Italia asli.' },
  { id: 101, text: 'Chord piano lagu klasik Beethoven.' },
  { id: 102, text: 'Cara mengobati luka bakar ringan.' },
  { id: 103, text: 'Panduan belajar C++ programming.' },
  { id: 104, text: 'Masakan soto ayam Lamongan.' },
  { id: 105, text: 'Sejarah space exploration NASA.' },
  { id: 106, text: 'Manfaat berpuasa untuk kesehatan.' },
  { id: 107, text: 'Tutorial desain UI/UX dengan Figma.' },
  { id: 108, text: 'Resep taco Mexico pedas.' },
  { id: 109, text: 'Lirik lagu blues soulful.' },
  { id: 110, text: 'Tips renang gaya bebas cepat.' },
  { id: 111, text: 'Belajar blockchain dengan Ethereum.' },
  { id: 112, text: 'Cara memasak nasi uduk Betawi.' },
  { id: 113, text: 'Perkembangan AI etika di 2025.' },
  { id: 114, text: 'Cara mengatasi alergi musiman.' },
  { id: 115, text: 'Tutorial video editing dengan Premiere Pro.' },
  { id: 116, text: 'Resep sup tom yam Thailand.' },
  { id: 117, text: 'Lirik lagu indie alternative.' },
  { id: 118, text: 'Manfaat jogging pagi hari.' },
  { id: 119, text: 'Panduan belajar Kubernetes orkestrasi.' },
  { id: 120, text: 'Masakan pecel sayur Jawa Timur.' },
  { id: 121, text: 'Teknologi drone pengiriman barang.' },
  { id: 122, text: 'Tips tidur siang efektif.' },
  { id: 123, text: 'Cara reset password Windows.' },
  { id: 124, text: 'Resep pie apel renyah.' },
  { id: 125, text: 'Lirik lagu K-pop hits 2025.' },
  { id: 126, text: 'Cara latihan cardio di rumah.' },
  { id: 127, text: 'Belajar data science dengan R.' },
  { id: 128, text: 'Cara membuat kerak telor Jakarta.' },
  { id: 129, text: 'Sejarah video game dari Atari.' },
  { id: 130, text: 'Manfaat aromaterapi lavender.' },
  { id: 131, text: 'Tutorial coding API dengan Postman.' },
  { id: 132, text: 'Resep sushi Jepang sederhana.' },
  { id: 133, text: 'Lirik lagu opera klasik.' },
  { id: 134, text: 'Tips hiking gunung aman.' },
  { id: 135, text: 'Panduan belajar Swift iOS app.' },
  { id: 136, text: 'Masakan sambal goreng ati ampela.' },
  { id: 137, text: 'Perkembangan electric vehicle 2025.' },
  { id: 138, text: 'Cara mengobati sakit gigi darurat.' },
  { id: 139, text: 'Tutorial 3D modeling dengan Maya.' },
  { id: 140, text: 'Resep milkshake strawberry creamy.' },
  { id: 141, text: 'Chord ukulele lagu Hawaii.' },
  { id: 142, text: 'Manfaat zumba untuk kebugaran.' },
  { id: 143, text: 'Belajar DevOps dengan Jenkins.' },
  { id: 144, text: 'Cara memasak capcay sayur sehat.' },
  { id: 145, text: 'Sejarah sosial media dari MySpace.' },
  { id: 146, text: 'Tips mengelola keuangan pribadi.' },
  { id: 147, text: 'Cara install app Android dari APK.' },
  { id: 148, text: 'Resep croissant butter flaky.' },
  { id: 149, text: 'Lirik lagu rap freestyle.' },
  { id: 150, text: 'Cara yoga asana pemula.' }
];

// Initialize embedding model (Xenova's MiniLM for semantic search).
let embedder;
async function initEmbedder() {
  try {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding model loaded successfully');
  } catch (error) {
    console.error('Failed to load embedding model:', error);
    process.exit(1); // Exit if model fails to load
  }
}
initEmbedder();

// Convert text to embedding vector.
async function getEmbedding(text) {
  try {
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    // Ensure output.data is an array (convert Float32Array if needed).
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Embedding generation failed');
  }
}

// Compute cosine similarity between two vectors.
function cosineSimilarity(vecA, vecB) {
  // Validate inputs
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
    throw new Error('Invalid vectors for cosine similarity');
  }

  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
  
  // Avoid division by zero
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

// Search API endpoint.
app.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }

  try {
    const queryEmbedding = await getEmbedding(query);
    const results = await Promise.all(
      documents.map(async (doc) => {
        const docEmbedding = await getEmbedding(doc.text);
        const similarity = cosineSimilarity(queryEmbedding, docEmbedding);
        return { ...doc, similarity };
      })
    );

    // Filter results with similarity > 0.5 and sort by relevance
    const sorted = results
      .filter((r) => r.similarity > 0.5)
      .sort((a, b) => b.similarity - a.similarity);

    if (sorted.length === 0) {
      return res.json({ message: 'No results found', results: [] });
    }
    res.json({ results: sorted });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));