// const express = require('express');
// const cors = require('cors');
// const { pipeline } = require('@xenova/transformers');
// const { GoogleGenerativeAI } = require("@google/generative-ai")
// const { Feedback,sequelize } = require("./models")

// // Optional: sinkronisasi (jalankan sekali atau di bootstrap aplikasi)
// sequelize.authenticate();
// sequelize.sync({ alter: true }); // gunakan { force: true } hanya jika ingin drop+create
// console.log('Database connected and models synced');

// const API_KEY = "AIzaSyCUt934PSIt19DmdO8A3SO_ySBJaSba9MY"

// const genAI = new GoogleGenerativeAI(API_KEY)

// const model = genAI.getGenerativeModel({ 
//     model: "gemini-2.5-flash",
//     generationConfig: {
//       responseMimeType: "application/json",
//     },
//   });

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json());

// // Data: Array of documents. Add your documents here.
// let documents = require("./data.json")

// // Initialize embedding model (Xenova's MiniLM for semantic search).
// let embedder;
// async function initEmbedder() {
//   try {
//     embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//     console.log('Embedding model loaded successfully');
//   } catch (error) {
//     console.error('Failed to load embedding model:', error);
//     process.exit(1); // Exit if model fails to load
//   }
// }
// initEmbedder();

// // Convert text to embedding vector.
// async function getEmbedding(text) {
//   try {
//     const output = await embedder(text, { pooling: 'mean', normalize: true });
//     // Ensure output.data is an array (convert Float32Array if needed).
//     return Array.from(output.data);
//   } catch (error) {
//     console.error('Error generating embedding:', error);
//     throw new Error('Embedding generation failed');
//   }
// }

// // Compute cosine similarity between two vectors.
// function cosineSimilarity(vecA, vecB) {
//   // Validate inputs
//   if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
//     throw new Error('Invalid vectors for cosine similarity');
//   }

//   let dotProduct = 0;
//   for (let i = 0; i < vecA.length; i++) {
//     dotProduct += vecA[i] * vecB[i];
//   }

//   const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
//   const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
  
//   // Avoid division by zero
//   if (magA === 0 || magB === 0) return 0;
//   return dotProduct / (magA * magB);
// }

// // Search API endpoint.
// app.post('/search', async (req, res) => {
//   const { query } = req.body;
//   if (!query) {
//     return res.status(400).json({ error: 'Query required' });
//   }

//   try {
//     const queryEmbedding = await getEmbedding(query);
//     const results = await Promise.all(
//       documents.map(async (doc) => {
//         const docEmbedding = await getEmbedding(doc.text);
//         const similarity = cosineSimilarity(queryEmbedding, docEmbedding);
//         return { ...doc, similarity };
//       })
//     );

//     // Filter results with similarity > 0.5 and sort by relevance
//     const sorted = results
//       .filter((r) => r.similarity > 0.6)
//       .sort((a, b) => b.similarity - a.similarity)
    
//     let queryResult = "" 
    
//     if (sorted.length === 0) {
//       const queryResult = await model.generateContent(`
//             ${query}
//             Analisis itu dalam bahasa indonesia formal dan baik serta berikan output analisisnya berdasarkan JSON :
//             {
//               "analytics":{
//                 "result":"....",
//                 "isContainPositive":
//               }
//             }
//         `)
//         const result = JSON.parse(queryResult.response.text())
//         console.log(result.analytics)

//         await Feedback.create({
//           content: query,
//           analysis: result.analytics.result,
//           category: result.analytics.isContainPositive
//         })
//       return res.json({ message: 'No results found', results: "Masukkan anda telah kami proses. Terimakasih telah menggunakan chatbot ini" });
//     }
    
//     for (let i = 0; i < sorted.length; i++) {
//       // console.log(sorted[i].text)
//       queryResult = `${queryResult} ${sorted[i].text}`
//     }

//     console.log("queryResult",queryResult)

//     res.json({ results: queryResult });
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ error: 'Search failed' });
//   }
// });

// app.get('/analytics', async (req, res) => {
//   try {
//     const analytics = await Feedback.findAll({
//       // attributes: ['id', 'content', 'analysis', 'createdAt', 'updatedAt'],
//       order: [['createdAt', 'DESC']],
//     });
//     res.json({ success: true, data: analytics });
//   } catch (error) {
//     console.error('Fetch analytics error:', error);
//     res.status(500).json({ error: 'Failed to fetch analytics' });
//   }
// });

// app.listen(port, () => console.log(`Backend running on port ${port}`));

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatbotData = require('./chatbot-data');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simpan session chat (dalam production, gunakan database)
const chatSessions = new Map();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Chatbot Online Shop API is running!' });
});

// Endpoint untuk memulai chat
app.post('/api/chat/start', (req, res) => {
  const { sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID diperlukan' });
  }
  
  // Inisialisasi session baru
  chatSessions.set(sessionId, {
    currentStep: 'welcome',
    history: []
  });
  
  res.json({
    message: chatbotData.welcome.message,
    options: chatbotData.welcome.options,
    sessionId: sessionId
  });
});

// Endpoint untuk mengirim pesan
app.post('/api/chat/message', (req, res) => {
  const { sessionId, message, optionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID diperlukan' });
  }
  
  // Cek session
  const session = chatSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session tidak ditemukan' });
  }
  
  let response;
  
  // Jika memilih opsi
  if (optionId !== undefined) {
    if (optionId === 'main') {
      // Kembali ke menu utama
      response = {
        message: chatbotData.welcome.message,
        options: chatbotData.welcome.options
      };
      session.currentStep = 'welcome';
    } else if (chatbotData.responses[optionId]) {
      const selectedOption = chatbotData.responses[optionId];
      
      if (selectedOption.type === 'input') {
        // Menunggu input user
        session.currentStep = selectedOption.next;
        response = {
          message: selectedOption.message,
          requiresInput: true,
          inputType: selectedOption.type
        };
      } else {
        // Langsung memberikan respons
        response = {
          message: selectedOption.message,
          options: selectedOption.options
        };
        session.currentStep = optionId;
      }
    } else {
      response = {
        message: "Maaf, opsi tersebut belum tersedia. Silakan pilih opsi lain.",
        options: chatbotData.welcome.options
      };
    }
  } 
  // Jika mengirim pesan teks
  else if (message) {
    if (session.currentStep && session.currentStep !== 'welcome') {
      // Proses input khusus (seperti nomor order)
      const processedResponse = chatbotData.processInput(session.currentStep, message);
      response = {
        message: processedResponse.message,
        options: processedResponse.options
      };
      session.currentStep = 'welcome';
    } else {
      // Respons untuk pesan bebas
      response = {
        message: "Terima kasih atas pesan Anda! Untuk bantuan lebih cepat, silakan pilih salah satu opsi di bawah:",
        options: chatbotData.welcome.options
      };
    }
    
    // Simpan history
    session.history.push({
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
  } else {
    response = {
      message: "Silakan pilih opsi atau ketik pesan Anda.",
      options: chatbotData.welcome.options
    };
  }
  
  // Simpan history bot
  if (response.message) {
    session.history.push({
      type: 'bot',
      content: response.message,
      timestamp: new Date().toISOString()
    });
  }
  
  res.json(response);
});

// Endpoint untuk mendapatkan history chat
app.get('/api/chat/history/:sessionId', (req, res) => {
  const session = chatSessions.get(req.params.sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session tidak ditemukan' });
  }
  
  res.json({
    history: session.history,
    currentStep: session.currentStep
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});