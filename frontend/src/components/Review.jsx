import React, { useEffect, useState } from "react";
import { FaUser, FaRobot, FaChartBar, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { url } from "../scripts/url";

// Import react-icons untuk icon yang menarik

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Komponen grafik sederhana (pie chart) untuk statistik sentimen feedback
function SentimentChart({ feedback }) {
  console.log("feedback data", feedback)
  let positive = 0, negative = 0
  for (let i = 0; i < feedback.length; i++) {
    if (feedback[i].category) {
      // console.log("category positif")
      positive++
    } else {
      // console.log("category negatif")
      negative++
    }
  }
  console.log(negative, positive)

  const data = {
    labels: ['negative', 'green'],
    datasets: [
      {
        label: '# of Votes',
        data: [negative, positive],
        backgroundColor: [
          "red", "green"
        ],
        borderWidth: 1,
      },
    ],
  }

  // Pie chart dengan SVG
  return (
    <div style={{ width: 400, margin: "auto", minHeight: "20vh", maxHeight: "66vh", display:"flex",justifyContent:"center" }}>
      <Pie data={data} options={{ responsive: true }} />
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
          <div className="ai-summary">{feedback.analysis}</div>
          <div className="ai-tags">
            <span className="tag">
              #{feedback.category ? 'positif' : 'negatif'}
            </span>
          </div>
        </div>
        <div className="ai-sentiment">
          {feedback.category ? (
            <FaCheckCircle color="#22c55e" title="Positif" />
          ) : (
            <FaTimesCircle color="#ef4444" title="Negatif" />
          )}
        </div>
      </div>
      {/* Data asli chat pengguna */}
      <div className="user-section">
        <FaUser size={20} color="#22c55e" />
        <span className="user-question">{feedback.content}</span>
        <span className="feedback-date">{feedback.createdAt}</span>
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
          <div className="ai-summary">{feedback.analysis}</div>
          <div className="ai-tags">
            <span className="tag">
              #{feedback.category ? 'positif' : 'negatif'}
            </span>
          </div>
        </div>
        <div className="ai-sentiment">
          {feedback.category ? (
            <FaCheckCircle color="#22c55e" title="Positif" />
          ) : (
            <FaTimesCircle color="#ef4444" title="Negatif" />
          )}
        </div>
      </div>
    </div>
  );
}

// Komponen utama dashboard
export default function Review() {
  // Simulasi role user: "admin" atau "user"
  const [role, setRole] = useState("admin");

  const [analytics, setAnalytics] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  // Fetch analytics from server route "/analytics"
  useEffect(() => {
    let mounted = true;
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      setAnalyticsError(null);
      try {
        const res = await fetch(`${url}/analytics`, {
          method: "GET",
          headers: { "Accept": "application/json" },
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setAnalytics(json.data);
        console.log("data", json.data)
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
      <header className="dashboard-header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        minWidth: "390px",
        width: "100%"
      }}>
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
        {/* Link ke halaman chatbot */}
        <a
          href="/"
          className="chatbot-link"
          title="Go to Chatbot"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(90deg,#2563eb 0%,#22c55e 100%)",
            color: "#fff",
            borderRadius: "999px",
            padding: "8px 18px",
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: "0 2px 8px #2563eb33",
            textDecoration: "none",
            transition: "transform 0.15s, box-shadow 0.15s",
            marginLeft: "16px"
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = "scale(1.07)";
            e.currentTarget.style.boxShadow = "0 4px 16px #22c55e33";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "0 2px 8px #2563eb33";
          }}
        >
          <FaRobot size={22} style={{ filter: "drop-shadow(0 0 2px #fff)" }} />
          <span>Chatbot</span>
          <span
            style={{
              background: "#fff",
              color: "#22c55e",
              borderRadius: "50%",
              padding: "2px 7px",
              fontSize: "0.85rem",
              fontWeight: 800,
              marginLeft: "2px",
              boxShadow: "0 1px 4px #2563eb22"
            }}
          >
            &rarr;
          </span>
        </a>
      </header>
      {/* Statistik grafik untuk admin */}
      {role === "admin" && (
        <section className="dashboard-stats" style={{ margin: "auto"}}>
          <div className="stat-card">
            <SentimentChart feedback={analytics} />
            <div className="stat-label">Statistik Sentimen Feedback</div>
          </div>
        </section>
      )}

      {/* Daftar feedback */}
      <section className="dashboard-feedback-list">
        {role === "admin"
          ? analytics.map((value, key) => (
            <FeedbackCardAdmin feedback={value} key={key} />
          ))
          : analytics.map((value, key) => (
            <FeedbackCardUser feedback={value} key={key} />
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
          min-height: 98vh;
          max-height: 98vh;
          width: 100%;
          margin: 0 auto;
          padding: 24px 8px 0 8px;
        }
        .dashboard-header {
          gap: 16px;
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
          min-height: 20vh;
          max-height: 76vh;
          flex-wrap: wrap;
        }
        .stat-card {
          // position: fixed;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 8px 0 #0001;
          padding: 18px 24px;
          width: 100%;
          min-width: 200px;
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
          background-color:white;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          text-align: center;
          color: #64748b;
          font-size: 1rem;
          padding: 18px 0 18px 0;
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