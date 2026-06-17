import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { Mail, Lock, User, UserPlus, AlertCircle, Briefcase, Rocket } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Talent');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.formCard}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join FounderLink to connect and collaborate</p>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.roleSelection}>
            <div
              style={{
                ...styles.roleOption,
                borderColor: role === 'Talent' ? 'var(--secondary)' : 'var(--border-color)',
                background: role === 'Talent' ? 'rgba(6, 182, 212, 0.05)' : 'transparent'
              }}
              onClick={() => setRole('Talent')}
            >
              <Briefcase size={20} color={role === 'Talent' ? 'var(--secondary)' : 'var(--text-muted)'} />
              <div>
                <div style={styles.roleTitle}>I am a Developer/Designer</div>
                <div style={styles.roleDesc}>Looking for startup matches</div>
              </div>
            </div>

            <div
              style={{
                ...styles.roleOption,
                borderColor: role === 'Founder' ? 'var(--primary)' : 'var(--border-color)',
                background: role === 'Founder' ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
              }}
              onClick={() => setRole('Founder')}
            >
              <Rocket size={20} color={role === 'Founder' ? 'var(--primary)' : 'var(--text-muted)'} />
              <div>
                <div style={styles.roleTitle}>I am a Startup Founder</div>
                <div style={styles.roleDesc}>Looking to build a core team</div>
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.icon} />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.icon} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.icon} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
            <UserPlus size={18} /> Sign Up
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '40px 20px'
  },
  formCard: {
    width: '100%',
    maxWidth: '480px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginTop: '-12px'
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--danger)',
    color: '#fca5a5',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  roleSelection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '10px'
  },
  roleOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 20px',
    border: '1.5px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)'
  },
  roleTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  roleDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)'
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 42px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color var(--transition-fast)'
  },
  submitBtn: {
    marginTop: '10px',
    width: '100%'
  },
  footerText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginTop: '10px'
  }
};

export default Register;
