import React, { useRef, useState, useEffect } from "react";
import { FaRobot, FaUserCircle, FaPaperPlane, FaRegSmile } from "react-icons/fa";
import axios from 'axios'
import { url } from "../scripts/url.js";
// App.jsx
// Import icons from react-icons

// Main App Component
export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading,setLoading] = useState(false)
  const [feedback,setFeedback] = useState(false)

    const chatRef = useRef(null);

  // Custom hook to auto-scroll chat to bottom
  function useAutoScroll(ref, deps) {
    useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, deps);
  }

  // Auto-scroll to bottom when messages change
  useAutoScroll(chatRef, [messages]);

  // Generate session ID unik
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Memulai chat session
  useEffect(() => {
    const startChat = async () => {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      
      try {
        setIsLoading(true);
        const response = await axios.post('/api/chat/start', {
          sessionId: newSessionId
        });
        
        setMessages([{
          id: Date.now(),
          type: 'bot',
          content: response.data.message,
          options: response.data.options
        }]);
      } catch (error) {
        console.error('Error starting chat:', error);
        setMessages([{
          id: Date.now(),
          type: 'bot',
          content: 'Maaf, terjadi kesalahan. Silakan refresh halaman.'
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    startChat();
  }, []);

  // Mengirim pesan
  const sendMessage = async (message = null, optionId = null) => {
    if (!sessionId) return;

    setIsLoading(true);

    try {
      // Tambah pesan user ke state
      if (message) {
        const userMessage = {
          id: Date.now(),
          type: 'user',
          content: message
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
      }

      // Kirim ke backend
      const response = await axios.post('/api/chat/message', {
        sessionId,
        message: message,
        optionId: optionId
      });

      // Tambah respons bot ke state
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.message,
        options: response.data.options,
        requiresInput: response.data.requiresInput
      };

      setMessages(prev => [...prev, botMessage]);
      setWaitingForInput(response.data.requiresInput || false);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage.trim());
    }
  };

  // Handle klik opsi
  const handleOptionClick = (optionId) => {
    sendMessage(null, optionId);
  };

  // Format pesan dengan line breaks
  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  // Responsive, beautiful, interactive, and accessible UI
  return (
    <div className="chat-bg">
      {/* Chat container */}
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <FaRobot size={32} className="header-icon" />
          <div>
            <h1 className="chat-title">AI Chatbot</h1>
            <p className="chat-desc">Selamat datang! Chatbot siap membantu Anda.</p>
          </div>
          <a
            href="/dashboard"
            className="dashboard-link"
            title="Review Dashboard Analytics & Feedback"
            aria-label="Review Dashboard Analytics & Feedback"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              background: "linear-gradient(90deg, #3a8dde 0%, #ff5858 100%)",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "1.2rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px 0 rgba(58, 141, 222, 0.12)",
              transition: "background 0.2s, transform 0.1s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"}
            onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #3a8dde 0%, #ff5858 100%)"}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="10" rx="2" fill="#fff" opacity="0.18"/>
              <rect x="6" y="10" width="3" height="4" rx="1" fill="#fff"/>
              <rect x="10.5" y="8" width="3" height="6" rx="1" fill="#fff"/>
              <rect x="15" y="12" width="3" height="2" rx="1" fill="#fff"/>
              <circle cx="20" cy="6" r="2" fill="#ff5858"/>
              <circle cx="4" cy="6" r="2" fill="#43e97b"/>
            </svg>
            <span style={{fontSize: "0.98rem"}}>analisis</span>
          </a>
        </header>
        {/* Chat messages */}
        <main className="chat-main" ref={chatRef} tabIndex={0} aria-label="Chat messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${message.type}`}
              aria-live="polite"
            >
              <div className="bubble-header">
                {message.type === "user" ? (
                  <FaUserCircle className="bubble-icon user" />
                ) : (
                  <FaRobot className="bubble-icon bot" />
                )}
                <span className="bubble-sender">
                  {message.type === "user" ? "Anda" : "Bot"}
                </span>
                <span className="bubble-time">{message.time}</span>
              </div>
              <div className="bubble-text mb-2">{formatMessage(message.content)}</div>
              <div className="m-4">
                {message.options && (
                  <div className="message-options">
                    {message.options.map((option) => (
                      <div
                        role="button"
                        key={option.id}
                        className="w-100 p-2 border-top border-bottom border-light"
                        onClick={() => handleOptionClick(option.id)}
                        disabled={isLoading}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                )}
                <div
                  role="button"
                  className="w-100 p-2 border-top border-bottom border-light"
                  onClick={() => setFeedback(!feedback)}
                  disabled={isLoading}
                >
                  Ingin menyampaikan masukkan?
                </div>
              </div>
            </div>
          ))}
          {(loading 
          // || message
        ) && (<div
              className={`chat-bubble bot`}
              aria-live="polite"
            >
              <div className="bubble-header">
                <FaRobot className="bubble-icon bot" />
                <span className="bubble-sender">
                  Bot
                </span>
                <span className="bubble-time">&nbsp;</span>
              </div>
              <div className="bubble-text">{message||"Please Wait"}</div>
            </div>)}
        </main>
        {/* Input form */}
        <form className="chat-input-form" onSubmit={handleSubmit} autoComplete="off">
          <button
            type="button"
            className="emoji-btn"
            tabIndex={-1}
            aria-label="Emoji"
            title="Emoji"
            onClick={() => setInputMessage((i) => i + "😊")}
          >
            <FaRegSmile size={22} />
          </button>
          {/* <div>
          </div> */}
            {feedback&&(
                <span style={{ borderRadius:"50px"}} className="bg-primary p-2 text-light">feedback</span>
            )}
            <input
              className="chat-input"
              type="text"
              placeholder="Ketik pesan..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              aria-label="Ketik pesan"
            />
          <button
            className="send-btn"
            type="submit"
            aria-label="Kirim"
            disabled={!inputMessage.trim()}
          >
            <FaPaperPlane size={22} />
          </button>
        </form>
      </div>
      {/* Responsive & modern CSS */}
      <style>{`
        /* Background gradient with green, blue, red */
        .chat-bg {
          width: 100%;
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 40%, #3a8dde 70%, #ff5858 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          max-height: 100vh;
        }
        /* Chat container */
        .chat-container {
          background: rgba(255,255,255,0.95);
          border-radius: 2rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
          max-width: 420px;
          width: 100%;
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .chat-container:focus-within {
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.25);
        }
        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
          padding: 1.2rem 1.5rem;
          border-bottom: 2px solid #3a8dde33;
        }
        .header-icon {
          color: #fff;
          background: #3a8dde;
          border-radius: 50%;
          padding: 0.4rem;
        }
        .chat-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a3a4a;
        }
        .chat-desc {
          margin: 0;
          font-size: 0.95rem;
          color: #1a3a4a99;
        }
        /* Chat main (messages) */
        .chat-main {
          flex: 1;
          overflow-y: auto;
          min-height: 70vh;
          max-height: 70vh;
          padding: 1.2rem;
          background: linear-gradient(120deg, #f8fff8 0%, #f0f8ff 100%);
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          scroll-behavior: smooth;
        }
        /* Chat bubble */
        .chat-bubble {
          max-width: 85%;
          padding: 0.8rem 1.1rem;
          border-radius: 1.2rem;
          box-shadow: 0 2px 8px 0 rgba(58, 141, 222, 0.07);
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          animation: fadeIn 0.4s;
        }
        .chat-bubble.user {
          align-self: flex-end;
          background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
          color: #fff;
          border-bottom-right-radius: 0.3rem;
        }
        .chat-bubble.bot {
          align-self: flex-start;
          background: linear-gradient(90deg, #3a8dde 0%, #ff5858 100%);
          color: #fff;
          border-bottom-left-radius: 0.3rem;
        }
        .bubble-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.92rem;
        }
        .bubble-icon {
          border-radius: 50%;
          background: #fff;
          padding: 0.1rem;
        }
        .bubble-icon.user {
          color: #43e97b;
        }
        .bubble-icon.bot {
          color: #3a8dde;
        }
        .bubble-sender {
          font-weight: 600;
        }
        .bubble-time {
          margin-left: auto;
          font-size: 0.8rem;
          color: #fff9;
        }
        .bubble-text {
          margin-left: 2.1rem;
          font-size: 1.05rem;
          word-break: break-word;
        }
        /* Input form */
        .chat-input-form {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 1rem 1.5rem;
          background: #fff;
          border-top: 2px solid #3a8dde33;
        }
        .chat-input {
          flex: 1;
          border: none;
          outline: none;
          background: #f0f8ff;
          border-radius: 1.2rem;
          padding: 0.7rem 1.1rem;
          font-size: 1.08rem;
          color: #1a3a4a;
          transition: background 0.2s;
        }
        .chat-input:focus {
          background: #e6f7ff;
        }
        .emoji-btn, .send-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #3a8dde;
          transition: color 0.2s, transform 0.1s;
          padding: 0.3rem;
          border-radius: 50%;
        }
        .emoji-btn:hover, .send-btn:hover {
          color: #ff5858;
          transform: scale(1.15);
        }
        .send-btn:disabled {
          color: #bbb;
          cursor: not-allowed;
        }
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        /* Responsive design */
        @media (max-width: 600px) {
          .chat-container {
            max-width: 100vw;
            min-height: 100vh;
            border-radius: 0;
            box-shadow: none;
          }
          .chat-header, .chat-input-form {
            padding: 1rem 0.7rem;
          }
          .chat-main {
            padding: 0.7rem;
          }
        }
        @media (max-width: 400px) {
          .chat-title { font-size: 1.1rem; }
          .chat-desc { font-size: 0.8rem; }
          .bubble-text { font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
}

/*
Penjelasan kode:
- Menggunakan React functional component dengan hooks (useState, useRef, useEffect).
- Menggunakan react-icons untuk ikon bot, user, kirim, dan emoji.
- Chat bubble untuk user dan bot dibedakan warna (gradient hijau-biru untuk user, biru-merah untuk bot).
- Header dengan gradient hijau-biru, sangat menarik dan modern.
- Input form dengan tombol emoji dan kirim, interaktif dan mudah digunakan.
- CSS sangat responsif, nyaman di semua device, dan menggunakan warna hijau, biru, merah.
- Efek animasi fadeIn pada setiap pesan baru.
- Auto-scroll ke bawah setiap ada pesan baru.
- Aksesibilitas: label ARIA, tabIndex, dan kontras warna yang baik.
- Kode CSS di-embed langsung agar mudah diintegrasikan dan diubah.
*/