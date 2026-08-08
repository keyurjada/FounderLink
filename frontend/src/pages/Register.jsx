import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SessionContext } from '../context/SessionProvider.jsx';
import registerimg from "../assets/registerimg.png";

const Register = () => {
  const [vals, setVals] = useState({
    firstName: '',
    lastName: '',
    role: 'Talent',
    phone: '',
    email: '',
    password: ''
  });

  const [errMessage, setErrMessage] = useState('');
  const { registerUser, currentUser, setGlobalLoading } = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const targetRoute = currentUser.role === 'Founder' ? '/dashboard' : '/coder/dashboard';
      navigate(targetRoute, { replace: true });
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    setVals({ ...vals, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrMessage('');
    setGlobalLoading(true);

    const nameVal = `${vals.firstName} ${vals.lastName}`.trim();
    
    // Intentional delay for aesthetic loader
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      await registerUser(nameVal, vals.email, vals.password, vals.role, vals.phone);
      setGlobalLoading(false);
      alert('Registration Successful!');
      const targetRoute = vals.role === 'Founder' ? '/dashboard' : '/coder/dashboard';
      navigate(targetRoute);
    } catch (err) {
      setGlobalLoading(false);
      setErrMessage(err.message || 'Error occurred during registration');
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
        padding: "20px 10px"
      }}
    >
      <div 
        style={{ 
          width: "100%", 
          maxWidth: "920px",
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
            <div className="col-12 col-md-6">
              <h1 className="text-center mb-2" style={{ color: "#ffffff", fontWeight: 800, letterSpacing: "-1px" }}>
                Founder<span style={{ color: "#10b981" }}>Link</span>
              </h1>
              <p className="text-center" style={{ fontSize: "14px", marginBottom: "24px", color: "#94a3b8" }}>
                Join the co-founder matching network
              </p>

              {errMessage && (
                <div className="alert alert-danger py-2" role="alert" style={{ fontSize: "14px", backgroundColor: "rgba(244, 63, 94, 0.1)", border: "1px solid #f43f5e", color: "#fca5a5", borderRadius: "8px" }}>
                  {errMessage}
                </div>
              )}
              
              <div className="row">
                <div className="col-6 mb-2">
                  <label htmlFor="firstName" className="form-label fw-medium" style={{ fontSize: "13px", color: "#e2e8f0" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    id="firstName"
                    value={vals.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      color: "#f8fafc"
                    }}
                  />
                </div>
                <div className="col-6 mb-2">
                  <label htmlFor="lastName" className="form-label fw-medium" style={{ fontSize: "13px", color: "#e2e8f0" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    id="lastName"
                    value={vals.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      color: "#f8fafc"
                    }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="role" className="form-label fw-medium" style={{ fontSize: "13px", color: "#e2e8f0" }}>
                  Platform Role
                </label>
                <select
                  name="role"
                  className="form-select"
                  id="role"
                  value={vals.role}
                  onChange={handleInputChange}
                  required
                  style={{
                    backgroundColor: "rgba(17, 26, 22, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: "#f8fafc",
                    colorScheme: "dark"
                  }}
                >
                  <option value="Talent" style={{ backgroundColor: "#111a16", color: "#f8fafc" }}>Coder / Developer / Designer</option>
                  <option value="Founder" style={{ backgroundColor: "#111a16", color: "#f8fafc" }}>Investor / Founder</option>
                </select>
              </div>

              <div className="mb-2">
                <label htmlFor="phone" className="form-label fw-medium" style={{ fontSize: "13px", color: "#e2e8f0" }}>
                  Mobile No.
                </label>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  minLength={10}
                  className="form-control"
                  id="phone"
                  value={vals.phone}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit Number"
                  required
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: "#f8fafc"
                  }}
                />
              </div>

              <div className="mb-2">
                <label htmlFor="email" className="form-label fw-medium" style={{ fontSize: "13px", color: "#e2e8f0" }}>
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  value={vals.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  required
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    color: "#f8fafc"
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium" style={{ fontSize: "13px", color: "#e2e8f0" }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  value={vals.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  required
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "14px",
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
                  Register
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setVals({ firstName: '', lastName: '', role: 'Talent', phone: '', email: '', password: '' });
                    setErrMessage('');
                  }}
                  className="btn btn-outline-secondary" 
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
              <div className="text-center mt-3">
                <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: 0 }}>
                  Already have an account? <Link to="/login" style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
                </p>
              </div>
            </div>
            
            <div className="col d-none d-md-block" style={{ paddingLeft: "30px" }}>
              <img 
                src={registerimg} 
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
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
