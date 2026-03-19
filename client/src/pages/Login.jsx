
import { useState } from "react";
import axios from "axios";
// import api from "../utils/api"
import { useNavigate } from "react-router-dom";


const API_URL = "http://localhost:8000/api/v1";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* SEND OTP */

  const sendOtp = async () => {
    setError("");
    setLoading(true);

    try {
       await axios.post(
         "http://localhost:8000/api/v1/auth/send-otp",
         { email: email.trim() },
         { withCredentials: true }
      );

      setOtpSent(true);
    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please try again.");
      } else {
        setError(err.response?.data?.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
     const response = await axios.post(
       "http://localhost:8000/api/v1/auth/verify-otp",
         {
            email: email.trim(),
            otp: otp.trim()
         },
         { withCredentials: true }
      );

      const { user, tokens } = response.data.data;
      
      localStorage.setItem("token", tokens.accessToken);
      localStorage.setItem("role", user.role);

      const routes = {
        super_admin: "/super-admin/dashboard",
        admin: "/admin/dashboard",
        employee: "/employee/dashboard",
        client: "/client/dashboard",
        partner: "/partner",
      };

      navigate(routes[user.role] || "/");

    } catch (err) {
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please try again.");
      } else if (err.response?.status === 401) {
        setError("Invalid OTP");
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
            <img
               src="/src/assets/partnerBridgeLogo.jpeg"
               alt="Partner Bridge Logo"
               style={{ width: "50px", height: "50px", objectFit: "contain" }}
            />
          <div>
             <h1>Partner Bridge</h1>
             <p style={{ fontSize: "0.85rem", color: "#667eea", marginTop: "-4px" }}>
                 by Kavach Cloud Enterprises
             </p>
          </div>
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

            {/* EMAIL */}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* OTP */}

            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                disabled={!otpSent || loading}
              />
            </div>

            {/* BUTTONS */}

          <div style={{display:"flex",gap:"10px"}}>

           <button
           type="button"
           className="login-button"
           onClick={sendOtp}
           disabled={loading}
           >
           {loading ? "Sending..." : "Send OTP"}

            </button>
 
            {/* LOGIN BUTTON */}

            <button
            type="button"
            className="login-button"
            onClick={handleSubmit}
            disabled={!otpSent || loading}
            >

            {loading ? "Verifying..." : "Verify & Login"}

            </button>
          </div>
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
         background: #f3f4f6; /* light grey background like image */
         display: flex;
         align-items: center;
         justify-content: center;
         padding: 1rem;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Background Shapes */
        .background,
        .shape {
          display: none;
        }

        /* Login Container */
       .login-container {
         width: 100%;
         max-width: 1200px;
         margin: 0 auto;
        }
         
       .login-card {
         background: #ffffff;
         border-radius: 16px;
         padding: 2.5rem;
         width: 100%;
         max-width: 420px;
         margin: 0 auto;
         box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
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