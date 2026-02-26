// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:8000/api/v1";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { 
          email: email.trim(), 
          password: password.trim() 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { user, tokens } = response.data.data;
      
      localStorage.setItem("token", tokens.accessToken);
      localStorage.setItem("role", user.role);

      const routes = {
        admin: "/admin",
        employee: "/employee",
        client: "/client",
        partner: "/partner",
      };

      navigate(routes[user.role] || "/");

    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Decoration */}
      <div className="background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Login Container */}
      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <div className="logo">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1>Partner Bridge</h1>
          </div>

          <p className="subtitle">Welcome back! Please login to your account.</p>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className={error ? "error" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className={error ? "error" : ""}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          
          {/* Footer */}
          <p className="footer">
            © 2024 Partner Bridge. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        /* Background Shapes */
        .background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          right: -100px;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          left: -50px;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          bottom: 30%;
          right: 10%;
        }

        /* Login Container */
        .login-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          padding: clamp(1.5rem, 5vw, 3rem);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          transition: transform 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .logo h1 {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: #666;
          margin-bottom: 2rem;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          line-height: 1.5;
        }

        /* Error Message */
        .error-message {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #333;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .form-group input {
          padding: 0.875rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
          width: 100%;
        }

        .form-group input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input.error {
          border-color: #c33;
        }

        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        /* Login Button */
        .login-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Test Credentials */
        .test-creds {
          margin-top: 2rem;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.25rem;
          border: 1px solid #e9ecef;
        }

        .test-creds-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .creds-grid {
          display: grid;
          gap: 0.75rem;
        }

        .creds-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.5rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .creds-label {
          font-weight: 600;
          color: #667eea;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .creds-value {
          color: #333;
          font-size: 0.9rem;
          font-family: monospace;
          word-break: break-all;
        }

        /* Footer */
        .footer {
          margin-top: 2rem;
          text-align: center;
          color: #999;
          font-size: 0.85rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-card {
            max-width: 100%;
            padding: 1.5rem;
          }

          .shape-1 {
            width: 200px;
            height: 200px;
            top: -100px;
            right: -50px;
          }

          .shape-2 {
            width: 150px;
            height: 150px;
          }

          .creds-item {
            padding: 0.4rem;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.25rem;
          }

          .logo h1 {
            font-size: 1.5rem;
          }

          .form-group input {
            padding: 0.75rem;
          }

          .login-button {
            padding: 0.875rem;
          }

          .creds-grid {
            gap: 0.5rem;
          }

          .creds-value {
            font-size: 0.8rem;
          }
        }

        /* Tablet Landscape */
        @media (min-width: 769px) and (max-width: 1024px) {
          .login-card {
            max-width: 450px;
          }
        }

        /* Large Screens */
        @media (min-width: 1440px) {
          .login-card {
            max-width: 550px;
            padding: 3.5rem;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .login-page {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          }

          .login-card {
            background: #1e1e2f;
          }

          .logo h1 {
            background: linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .subtitle {
            color: #a0a0a0;
          }

          .form-group label {
            color: #e0e0e0;
          }

          .form-group input {
            background: #2d2d3a;
            border-color: #3d3d4a;
            color: white;
          }

          .form-group input:focus {
            border-color: #a5b4fc;
          }

          .test-creds {
            background: #2d2d3a;
            border-color: #3d3d4a;
          }

          .creds-item {
            background: #1e1e2f;
            border-color: #3d3d4a;
          }

          .creds-value {
            color: #e0e0e0;
          }

          .footer {
            color: #666;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;