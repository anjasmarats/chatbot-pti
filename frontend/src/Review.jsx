import React, { useState } from "react";
import { FaUser, FaRobot, FaChartBar, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Import react-icons untuk icon yang menarik

// Contoh data feedback (biasanya diambil dari API/backend)
const feedbackData = [
  {
    id: 1,
    user: "Budi",
    question: "Bagaimana cara memperbaiki error pada aplikasi?",
    aiResult: {
      summary: "Pengguna mengalami error pada aplikasi. Disarankan untuk memeriksa koneksi internet dan mengupdate aplikasi ke versi terbaru.",
      sentiment: "positive",
      tags: ["error", "update", "internet"]
    },
    date: "2024-06-01"
  },
  {
    id: 2,
    user: "Siti",
    question: "Aplikasi sering crash saat dibuka.",
    aiResult: {
      summary: "Pengguna melaporkan aplikasi sering crash. Disarankan untuk reinstall aplikasi dan menghapus cache.",
      sentiment: "negative",
      tags: ["crash", "reinstall", "cache"]
    },
    date: "2024-06-02"
  },
  {
    id: 3,
    user: "Andi",
    question: "Fitur baru sangat membantu pekerjaan saya.",
    aiResult: {
      summary: "Pengguna merasa fitur baru sangat membantu.",
      sentiment: "positive",
      tags: ["fitur baru", "pujian"]
    },
    date: "2024-06-03"
  }
];

// Komponen grafik sederhana (pie chart) untuk statistik sentimen feedback
function SentimentChart({ data }) {
  // Hitung jumlah sentimen
  const sentimentCount = data.reduce(
    (acc, item) => {
      acc[item.aiResult.sentiment]++;
      return acc;
    },
    { positive: 0, negative: 0 }
  );
  const total = sentimentCount.positive + sentimentCount.negative;
  const positivePercent = (sentimentCount.positive / total) * 100;
  const negativePercent = (sentimentCount.negative / total) * 100;

  // Pie chart dengan SVG
  return (
    <div style={{ width: 120, height: 120, margin: "0 auto" }}>
      <svg width="120" height="120" viewBox="0 0 32 32">
        {/* Positive (Hijau) */}
        <circle
          r="16"
          cx="16"
          cy="16"
          fill="transparent"
          stroke="#22c55e"
          strokeWidth="8"
          strokeDasharray={`${positivePercent} ${100 - positivePercent}`}
          strokeDashoffset="25"
        />
        {/* Negative (Merah) */}
        <circle
          r="16"
          cx="16"
          cy="16"
          fill="transparent"
          stroke="#ef4444"
          strokeWidth="8"
          strokeDasharray={`${negativePercent} ${100 - negativePercent}`}
          strokeDashoffset={25 + (positivePercent / 100) * 100}
        />
      </svg>
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <span style={{ color: "#22c55e", fontWeight: 600 }}>
          {sentimentCount.positive} Positif
        </span>
        {" | "}
        <span style={{ color: "#ef4444", fontWeight: 600 }}>
          {sentimentCount.negative} Negatif
        </span>
      </div>
    </div>
  );
}

// Komponen feedback card untuk admin
function FeedbackCardAdmin({ feedback }) {
  return (
    <div className="feedback-card-admin">
      {/* Bagian hasil olahan AI */}
      <div className="ai-section">
        <FaRobot size={28} color="#2563eb" />
        <div>
          <div className="ai-summary">{feedback.aiResult.summary}</div>
          <div className="ai-tags">
            {feedback.aiResult.tags.map((tag, idx) => (
              <span className="tag" key={idx}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {/* <div className="ai-sentiment">
          {feedback.aiResult.sentiment === "positive" ? (
            <FaCheckCircle color="#22c55e" title="Positif" />
          ) : (
            <FaTimesCircle color="#ef4444" title="Negatif" />
          )}
        </div> */}
      </div>
      {/* Data asli chat pengguna */}
      <div className="user-section">
        <FaUser size={20} color="#22c55e" />
        <span className="user-question">{feedback.question}</span>
        <span className="feedback-date">{feedback.date}</span>
      </div>
    </div>
  );
}

// Komponen feedback card untuk user biasa
function FeedbackCardUser({ feedback }) {
  return (
    <div className="feedback-card-user">
      <div className="ai-section">
        <FaRobot size={24} color="#2563eb" />
        <div>
          <div className="ai-summary">{feedback.aiResult.summary}</div>
          <div className="ai-tags">
            {feedback.aiResult.tags.map((tag, idx) => (
              <span className="tag" key={idx}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {/* <div className="ai-sentiment">
          {feedback.aiResult.sentiment === "positive" ? (
            <FaCheckCircle color="#22c55e" title="Positif" />
          ) : (
            <FaTimesCircle color="#ef4444" title="Negatif" />
          )}
        </div> */}
      </div>
    </div>
  );
}

// Komponen utama dashboard
export default function Review() {
  // Simulasi role user: "admin" atau "user"
  const [role, setRole] = useState("admin");

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  // Fetch analytics from server route "/analytics"
  useEffect(() => {
    let mounted = true;
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        const res = await fetch("/analytics", {
          method: "GET",
          headers: { "Accept": "application/json" },
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setAnalytics(json);
      } catch (err) {
        if (mounted) setAnalyticsError(err.message || "Failed to load analytics");
      } finally {
        if (mounted) setLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <FaChartBar size={32} color="#2563eb" />
        <h1>
          Dashboard Feedback{" "}
          <span style={{ color: "#22c55e" }}>
            {role === "admin" ? "Admin" : "User"}
          </span>
        </h1>
        {/* Switch role untuk demo */}
        <div className="role-switch">
          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
          <button
            className={role === "user" ? "active" : ""}
            onClick={() => setRole("user")}
          >
            User
          </button>
        </div>
      </header>

      {/* Statistik grafik untuk admin */}
      {role === "admin" && (
        <section className="dashboard-stats">
          <div className="stat-card">
            <SentimentChart data={feedbackData} />
            <div className="stat-label">Statistik Sentimen Feedback</div>
          </div>
        </section>
      )}

      {/* Daftar feedback */}
      <section className="dashboard-feedback-list">
        {role === "admin"
          ? feedbackData.map((fb) => (
              <FeedbackCardAdmin feedback={fb} key={fb.id} />
            ))
          : feedbackData.map((fb) => (
              <FeedbackCardUser feedback={fb} key={fb.id} />
            ))}
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>
          &copy; 2024 Dashboard Feedback |{" "}
          <span style={{ color: "#2563eb" }}>ReactJS</span>
        </span>
      </footer>

      {/* Styling langsung di file ini agar mudah dicoba */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
          background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%);
        }
        .dashboard-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px 8px 0 8px;
        }
        .dashboard-header {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: space-between;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px 0 #0001;
          padding: 18px 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          flex: 1;
        }
        .role-switch {
          display: flex;
          gap: 8px;
        }
        .role-switch button {
          background: #e0e7ff;
          color: #2563eb;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .role-switch button.active,
        .role-switch button:hover {
          background: #2563eb;
          color: #fff;
        }
        .dashboard-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .stat-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 8px 0 #0001;
          padding: 18px 24px;
          flex: 1;
          min-width: 260px;
          text-align: center;
        }
        .stat-label {
          margin-top: 12px;
          font-weight: 600;
          color: #2563eb;
        }
        .dashboard-feedback-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .feedback-card-admin,
        .feedback-card-user {
          background: linear-gradient(90deg, #f0fdf4 0%, #e0f2fe 100%);
          border-radius: 16px;
          box-shadow: 0 1px 8px 0 #0001;
          padding: 18px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .feedback-card-admin:hover,
        .feedback-card-user:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 4px 16px 0 #0002;
        }
        .ai-section {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #fff;
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 1px 4px 0 #0001;
        }
        .ai-summary {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2563eb;
        }
        .ai-tags {
          margin-top: 4px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .tag {
          background: #e0f2fe;
          color: #2563eb;
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 0.85rem;
        }
        .ai-sentiment {
          margin-left: auto;
          font-size: 1.5rem;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f0fdf4;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.98rem;
          color: #16a34a;
        }
        .user-question {
          font-weight: 500;
        }
        .user-name {
          color: #2563eb;
          font-weight: 600;
        }
        .feedback-date {
          margin-left: auto;
          color: #64748b;
          font-size: 0.9rem;
        }
        .dashboard-footer {
          margin-top: 40px;
          text-align: center;
          color: #64748b;
          font-size: 1rem;
          padding: 18px 0 8px 0;
        }
        /* Responsive Design */
        @media (max-width: 700px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .dashboard-container {
            padding: 8px 2px 0 2px;
          }
          .stat-card {
            min-width: 180px;
            padding: 12px 8px;
          }
        }
        @media (max-width: 480px) {
          .dashboard-header h1 {
            font-size: 1.2rem;
          }
          .feedback-card-admin,
          .feedback-card-user {
            padding: 10px 6px;
          }
          .ai-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .user-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
}

/*
Penjelasan kode:
- Data feedback disimulasikan dalam array feedbackData.
- Komponen SentimentChart menampilkan pie chart statistik sentimen feedback (hijau=positif, merah=negatif).
- Komponen FeedbackCardAdmin menampilkan hasil olahan AI (lebih menonjol, biru/hijau/merah) dan data asli chat user (terselip tapi jelas).
- Komponen FeedbackCardUser hanya menampilkan hasil olahan AI.
- Terdapat switch role (admin/user) untuk demo.
- Warna utama: hijau (#22c55e), biru (#2563eb), merah (#ef4444).
- Desain sangat responsif, modern, interaktif, dan berbeda dari tampilan chatbot pada umumnya.
- Semua icon menggunakan react-icons.
- CSS langsung di file agar mudah dicoba, bisa dipindah ke file CSS terpisah jika diinginkan.
*/