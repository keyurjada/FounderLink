import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SessionContext } from "../context/SessionProvider.jsx";
import loginimg from "../assets/loginimg.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const { loginUser } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrMessage("");
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrMessage(err.message || "Failed to authenticate");
    }
  };

  return (
    <section 
      className="page-fade-in"
      style={{ 
        backgroundColor: "#030706",
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 30%, transparent 60%),
          radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 30%, transparent 60%),
          radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)
        `,
        backgroundSize: "32px 32px, 100% 100%, 100% 100%, 100% 100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <div 
        style={{ 
          width: "100%", 
          maxWidth: "880px",
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          padding: "40px"
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="row align-items-center">
            <div className="col d-none d-md-block" style={{ paddingRight: "30px" }}>
              <img 
                src={loginimg} 
                alt="Form Graphic" 
                className="w-100 h-100" 
                style={{ 
                  objectFit: "cover", 
                  borderRadius: "16px",
                  filter: "brightness(0.95) contrast(1.05)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
                }} 
              />
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-4">
                <h1 className="text-center mb-2" style={{ color: "#ffffff", fontWeight: 800, letterSpacing: "-1px" }}>
                  Founder<span style={{ color: "#10b981" }}>Link</span>
                </h1>
                <p className="text-center" style={{ fontSize: "14px", marginBottom: "24px", color: "#94a3b8" }}>
                  Connect with matching co-founders today
                </p>

                {errMessage && (
                  <div className="alert alert-danger py-2" role="alert" style={{ fontSize: "14px", backgroundColor: "rgba(244, 63, 94, 0.1)", border: "1px solid #f43f5e", color: "#fca5a5", borderRadius: "8px" }}>
                    {errMessage}
                  </div>
                )}
                
                <label htmlFor="userEmail" className="form-label fw-medium" style={{ fontSize: "14px", color: "#e2e8f0" }}>
                  Email address
                </label>
                <input
                  type="email"
                  id="userEmail"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your E-mail"
                  required
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontSize: "15px",
                    color: "#f8fafc"
                  }}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="userPassword" className="form-label fw-medium" style={{ fontSize: "14px", color: "#e2e8f0" }}>
                  Password
                </label>
                <input
                  type="password"
                  id="userPassword"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontSize: "15px",
                    color: "#f8fafc"
                  }}
                />
              </div>
              <div className="text-center mt-4 d-flex justify-content-center gap-3">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    borderRadius: "10px", 
                    fontWeight: 600, 
                    padding: "10px 24px",
                    backgroundColor: "#f59e0b",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)"
                  }}
                >
                  Sign In
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => { setEmail(""); setPassword(""); setErrMessage(""); }}
                  style={{ 
                    borderRadius: "10px", 
                    fontWeight: 600, 
                    padding: "10px 24px",
                    color: "#94a3b8",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    backgroundColor: "transparent"
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="text-center mt-4">
                <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                  Don't have an account? <Link to="/register" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
