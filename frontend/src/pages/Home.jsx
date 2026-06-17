import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Sparkles, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div style={styles.container}>
      <header style={styles.hero}>
        <div style={styles.badge}>
          <Sparkles size={14} color="var(--secondary)" /> Connecting Talents & Founders
        </div>
        <h1 style={styles.title}>
          Find Your Perfect <br />
          <span style={styles.gradientText}>Startup Co-Founder</span>
        </h1>
        <p style={styles.subtitle}>
          FounderLink bridges the gap between visionaries, developers, designers, and marketers. Build the next big thing, together.
        </p>
        <div style={styles.heroActions}>
          <Link to="/register" className="btn btn-primary" style={styles.actionBtn}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={styles.actionBtn}>
            Learn More
          </Link>
        </div>
      </header>

      <section style={styles.features}>
        <div className="glass-card" style={styles.card}>
          <Users size={32} color="var(--primary)" />
          <h3 style={styles.cardTitle}>Co-Founder Matching</h3>
          <p style={styles.cardDesc}>Find co-founders with complementary technical or business skillsets.</p>
        </div>
        <div className="glass-card" style={styles.card}>
          <Code size={32} color="var(--secondary)" />
          <h3 style={styles.cardTitle}>Workspace Board</h3>
          <p style={styles.cardDesc}>Collaborate in shared workspaces using integrated task management.</p>
        </div>
        <div className="glass-card" style={styles.card}>
          <Award size={32} color="var(--accent)" />
          <h3 style={styles.cardTitle}>SaaS Tools</h3>
          <p style={styles.cardDesc}>Manage applications, sign equity agreements, and track growth metrics.</p>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-full)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary)'
  },
  title: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.1',
    letterSpacing: '-1.5px',
    color: 'var(--text-primary)'
  },
  gradientText: {
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '600px'
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px'
  },
  actionBtn: {
    padding: '12px 28px',
    fontSize: '16px'
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
    gap: '16px',
    alignItems: 'flex-start'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  cardDesc: {
    color: 'var(--text-secondary)',
    fontSize: '15px',
    lineHeight: '1.5'
  }
};

export default Home;
