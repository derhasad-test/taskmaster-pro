import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X, CheckCircle2 } from 'lucide-react';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={styles.landing}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>✨</div>
            <span>TaskFlow</span>
          </div>
          <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ''}`}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#why" className={styles.navLink}>Why TaskFlow</a>
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            A simple to-do list<br />
            <span className={styles.highlight}>to manage it all</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Easily manage your personal tasks, projects, and goals all in one place.<br />
            Trusted by thousands of productive users worldwide.
          </p>

          <div className={styles.trustBadges}>
            <div className={styles.badge}>⭐ Editor's Choice</div>
            <div className={styles.badge}>✨ Highly Rated</div>
            <div className={styles.badge}>🏆 Best App</div>
          </div>

          <button className={styles.ctaButton} onClick={() => navigate('/signup')}>
            Get Started. It's FREE <ArrowRight size={20} />
          </button>
          
          <p className={styles.guarantee}>
            FREE FOREVER. NO CREDIT CARD.
          </p>
        </div>

        {/* Product Mockup */}
        <div className={styles.mockup}>
          <div className={styles.mockupFrame}>
            <div className={styles.mockupHeader}>
              <div className={styles.mockupTitle}>📋 My Tasks</div>
              <div className={styles.mockupActions}>
                <div className={styles.mockupDot}></div>
                <div className={styles.mockupDot}></div>
                <div className={styles.mockupDot}></div>
              </div>
            </div>
            <div className={styles.mockupContent}>
              <div className={styles.mockupColumn}>
                <div className={styles.columnTitle}>To Do</div>
                <div className={styles.mockupCard}>Complete project proposal</div>
                <div className={styles.mockupCard}>Review team feedback</div>
              </div>
              <div className={styles.mockupColumn}>
                <div className={styles.columnTitle}>Doing</div>
                <div className={styles.mockupCard}>Design new features</div>
                <div className={styles.mockupCard}>Update documentation</div>
              </div>
              <div className={styles.mockupColumn}>
                <div className={styles.columnTitle}>Done</div>
                <div className={styles.mockupCard}>✓ Launch website</div>
                <div className={styles.mockupCard}>✓ Create presentations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>Powerful Features For Your Productivity</h2>
          <p>Everything you need to stay organized and focused</p>
        </div>
        <div className={styles.featuresGrid}>
          {[
            { icon: '✅', title: 'Create Unlimited Tasks', desc: 'Never worry about hitting limits' },
            { icon: '📅', title: 'Organize by Date', desc: 'Plan your week and month ahead' },
            { icon: '⭐', title: 'Set Priorities', desc: 'Focus on what matters most' },
            { icon: '🔍', title: 'Smart Search', desc: 'Find tasks instantly' },
            { icon: '📊', title: 'Track Progress', desc: 'Visualize your productivity' },
            { icon: '🌙', title: 'Dark & Light Mode', desc: 'Choose your perfect view' },
          ].map((feature, idx) => (
            <div key={idx} className={styles.featureItem}>
              <div className={styles.featureEmoji}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section id="why" className={styles.whySection}>
        <div className={styles.sectionHeader}>
          <h2>Why Choose TaskFlow?</h2>
        </div>
        <div className={styles.whyGrid}>
          {[
            'Simple & Intuitive Interface',
            'Zero Learning Curve',
            'Works on All Devices',
            'Fast & Reliable',
            'Privacy Focused',
            'Beautiful Design',
          ].map((reason, idx) => (
            <div key={idx} className={styles.whyItem}>
              <CheckCircle2 size={20} />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2>Ready to boost your productivity?</h2>
        <p>Join thousands of users managing their tasks with TaskFlow</p>
        <button className={styles.finalCtaButton} onClick={() => navigate('/signup')}>
          Start For Free Today <ArrowRight size={20} />
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 TaskFlow. Manage tasks, not stress.</p>
          <div className={styles.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="mailto:support@taskflow.app">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

