const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Login } = require('./controllers/AuthController');
const { verifyToken, cekAuth } = require('./manageSession');
const { message, startChat } = require('./controllers/ChatController');
const { deleteDataAnalytics, getAnalytics } = require('./controllers/AnalyticsController');
const { sendQuestion, allQuestions } = require('./controllers/QuestionController');

// // Optional: sinkronisasi (jalankan sekali atau di bootstrap aplikasi)
// sequelize.authenticate();
// sequelize.sync({ alter: true }); // gunakan { force: true } hanya jika ingin drop+create
// console.log('Database connected and models synced');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint untuk memulai chat
app.post('/api/chat/start', verifyToken, startChat);

// Endpoint untuk mengirim pesan
app.post('/api/chat/message', verifyToken, message);

app.get('/api/analytics', verifyToken, getAnalytics);

app.post('/api/login',Login)

app.get('/api/auth',cekAuth)

app.delete('/api/delete/analytics/:id', verifyToken,deleteDataAnalytics)

app.post('/api/question/add', sendQuestion);

app.get('/api/data/all',allQuestions)

// // Endpoint untuk mendapatkan history chat
// app.get('/api/chat/history/:sessionId', (req, res) => {
//   const session = chatSessions.get(req.params.sessionId);
  
//   if (!session) {
//     return res.status(404).json({ error: 'Session tidak ditemukan' });
//   }
  
//   res.json({
//     history: session.history,
//     currentStep: session.currentStep
//   });
// });

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});