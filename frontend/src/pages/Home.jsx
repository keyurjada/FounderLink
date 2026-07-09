import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Sparkles, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <section className="page-fade-in" style={styles.section}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <div style={styles.badge}>
            <Sparkles size={14} color="#10b981" style={{ marginRight: '8px' }} /> 
            Connecting Talents & Founders
          </div>
          <h1 style={styles.title}>
            Find Your Perfect <br />
            <span style={styles.gradientText}>Startup Co-Founder</span>
          </h1>
          <p style={styles.subtitle}>
            FounderLink bridges the gap between visionaries, developers, designers, and investors. Build the next big thing, together.
          </p>
          <div style={styles.heroActions}>
            <Link to="/register" style={styles.btnPrimary}>
              Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="/login" style={styles.btnSecondary}>
              Sign In
            </Link>
          </div>
        </header>

        <section style={styles.features}>
          <div style={styles.card}>
            <Users size={32} color="#f59e0b" style={{ marginBottom: '16px' }} />
            <h3 style={styles.cardTitle}>Co-Founder Matching</h3>
            <p style={styles.cardDesc}>Find co-founders with complementary technical or business skillsets based on matching algorithms.</p>
          </div>
          <div style={styles.card}>
            <Code size={32} color="#10b981" style={{ marginBottom: '16px' }} />
            <h3 style={styles.cardTitle}>Workspace Board</h3>
            <p style={styles.cardDesc}>Collaborate in shared workspaces using integrated Kanban boards and task management.</p>
          </div>
          <div style={styles.card}>
            <Award size={32} color="#6366f1" style={{ marginBottom: '16px' }} />
            <h3 style={styles.cardTitle}>Match Pipelines</h3>
            <p style={styles.cardDesc}>Manage matching applications, review sent pitches, and check co-founder responses.</p>
          </div>
        </section>
      </div>
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: "#030706",
    backgroundImage: `
      radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 30%, transparent 60%),
      radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.06) 30%, transparent 60%)
    `,
    backgroundSize: "32px 32px, 100% 100%, 100% 100%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "80px 20px"
  },
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '80px'
  },
  hero: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    maxWidth: '800px'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '999px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#94a3b8'
  },
  title: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-1.5px',
    color: '#ffffff',
    margin: 0
  },
  gradientText: {
    background: 'linear-gradient(135deg, #10b981, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '18px',
    color: '#94a3b8',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: 0
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px'
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: 600,
    borderRadius: '10px',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
    transition: 'all 0.2s ease',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: 600,
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    width: '100%'
  },
  card: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    background: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    transition: 'all 0.2s ease'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px'
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: 0
  }
};

export default Home;
