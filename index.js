const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatbotData = require('./chatbot-data');

const { GoogleGenerativeAI } = require("@google/generative-ai")
// const { Feedback,sequelize } = require("./models");
const { default: supabase } = require('./supabase');

// // Optional: sinkronisasi (jalankan sekali atau di bootstrap aplikasi)
// sequelize.authenticate();
// sequelize.sync({ alter: true }); // gunakan { force: true } hanya jika ingin drop+create
// console.log('Database connected and models synced');

const API_KEY = "AIzaSyCUt934PSIt19DmdO8A3SO_ySBJaSba9MY"

const genAI = new GoogleGenerativeAI(API_KEY)

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

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
app.post('/api/chat/message', async(req, res) => {
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
          options: chatbotData.welcome.options
        };
        session.currentStep = optionId;
      }
    } else {
          const queryResult = await model.generateContent(`
            ${message}
            Analisis itu dalam bahasa indonesia formal dan baik serta berikan output analisisnya berdasarkan JSON :
            {
              "analytics":{
                "result":"....",
                "isContainPositive":
              }
            }
        `)
        const result = JSON.parse(queryResult.response.text())
        console.log(result.analytics)

        const { error } = await supabase.from("feedback").insert([{
          content: message,
          analysis: result.analytics.result,
          category: result.analytics.isContainPositive
        }]).select()

        if (error) {
          console.error("error insert database",error)
          return res.status(500).json()
        }

        // await Feedback.create({
        //   content: message,
        //   analysis: result.analytics.result,
        //   category: result.analytics.isContainPositive
        // })
      response = {
        message: "Masukkan anda telah kami proses. Terimakasih telah menggunakan chatbot ini. Ada lagi yang bisa kami bantu",
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

app.get('/api/analytics', async (req, res) => {
  try {
    // const analytics = await Feedback.findAll({
    //   // attributes: ['id', 'content', 'analysis', 'createdAt', 'updatedAt'],
    //   order: [['createdAt', 'DESC']],
    // });

    const {data: analytics,error} = await supabase
    .from("feedback")
    .select('id')
    .select('content')
    .select('analysis')
    .select('createdAt')
    .select('updatedAt')
    
    if (error) {
      console.error("error select data feedback analytics",error)
      return res.status(500).json()
    }

    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
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

// app.post('/api/login',)

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});