// src/pages/LoginPage.jsx
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login to continue your journey 🚀</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="login-links">
          <a href="#">Forgot password?</a>
          <a href="#">Create account</a>
        </div>
      </div>
    </div>
  );
}







// src/LoginPage.jsx
// import React, { useState } from 'react';
// import '../styles/LoginPage.css';
// import { FaUser, FaLock } from 'react-icons/fa'; // Using react-icons for simple and modern icons

// function LoginPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!username || !password) {
//       setError('Please fill in all fields');
//       return;
//     }
//     // Simulate login logic (in a real app, integrate with API)
//     console.log('Logging in with:', { username, password });
//     setError('');
//     alert('Login successful!'); // Placeholder for successful login
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2 className="login-title">Welcome Back</h2>
//         <p className="login-subtitle">Sign in to your account</p>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <FaUser className="input-icon" />
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="input-field"
//             />
//           </div>
//           <div className="input-group">
//             <FaLock className="input-icon" />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="input-field"
//             />
//           </div>
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>
//         <div className="login-footer">
//           <a href="#" className="forgot-link">Forgot password?</a>
//           <p className="signup-text">
//             Don't have an account? <a href="#" className="signup-link">Sign up</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;