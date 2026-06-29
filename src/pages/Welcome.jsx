import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X, CheckCircle2, ChevronDown } from 'lucide-react';
import styles from './Welcome.module.css';

export default function Welcome() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.welcome}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>✨</div>
            <span className={styles.logoText}>TaskFlow</span>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links */}
          <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ''}`}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <a href="#about" className={styles.navLink}>About</a>
            
            {/* More Dropdown */}
            <div className={styles.dropdownContainer}>
              <button 
                className={styles.navLink}
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              >
                More <ChevronDown size={16} />
              </button>
              {moreDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <a href="#blog" className={styles.dropdownItem}>Blog</a>
                  <a href="#faq" className={styles.dropdownItem}>FAQ</a>
                  <a href="#contact" className={styles.dropdownItem}>Contact Us</a>
                  <a href="#privacy" className={styles.dropdownItem}>Privacy Policy</a>
                  <a href="#terms" className={styles.dropdownItem}>Terms of Service</a>
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className={styles.authButtons}>
            <button 
              className={styles.loginBtn}
              onClick={() => handleNavigation('/login')}
            >
              Sign In
            </button>
            <button 
              className={styles.signupBtn}
              onClick={() => handleNavigation('/signup')}
            >
              Sign Up
            </button>
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

          <div className={styles.heroCTA}>
            <button 
              className={styles.ctaButton}
              onClick={() => handleNavigation('/signup')}
            >
              Get Started. It's FREE <ArrowRight size={20} />
            </button>
            <button 
              className={styles.tryDemoBtn}
              onClick={() => handleNavigation('/login')}
            >
              Try Demo <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Product Mockup */}
        <div className={styles.mockup}>
          <div className={styles.mockupFrame}>
            <div className={styles.mockupHeader}>
              <span className={styles.mockupTitle}>📋 My Tasks</span>
              <div className={styles.mockupActions}>
                <div className={styles.mockupDot}></div>
                <div className={styles.mockupDot}></div>
                <div className={styles.mockupDot}></div>
              </div>
            </div>
            <div className={styles.mockupContent}>
              <div className={styles.mockupColumn}>
                <div className={styles.columnTitle}>To Do</div>
                <div className={styles.mockupCard}>Complete project report</div>
                <div className={styles.mockupCard}>Review team feedback</div>
              </div>
              <div className={styles.mockupColumn}>
                <div className={styles.columnTitle}>Doing</div>
                <div className={styles.mockupCard}>Fix homepage design</div>
                <div className={styles.mockupCard}>Update documentation</div>
              </div>
              <div className={styles.mockupColumn}>
                <div className={styles.columnTitle}>Done</div>
                <div className={styles.mockupCard}>✓ Deploy v2.0</div>
                <div className={styles.mockupCard}>✓ Client meeting</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>Powerful Features</h2>
          <p>Everything you need to stay productive</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureEmoji}>✅</div>
            <h3>Create Unlimited Tasks</h3>
            <p>No limits on how many tasks you can create and organize</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureEmoji}>📅</div>
            <h3>Organize by Date</h3>
            <p>Set due dates and get reminders for important tasks</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureEmoji}>⭐</div>
            <h3>Set Priorities</h3>
            <p>Mark tasks as high, medium, or low priority</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureEmoji}>🔍</div>
            <h3>Smart Search</h3>
            <p>Find any task instantly with our powerful search</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureEmoji}>📊</div>
            <h3>Track Progress</h3>
            <p>View analytics and track your productivity</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureEmoji}>🌙</div>
            <h3>Dark & Light Mode</h3>
            <p>Choose your preferred theme for comfortable viewing</p>
          </div>
        </div>
      </section>

      {/* Why TaskFlow Section */}
      <section id="why" className={styles.whySection}>
        <div className={styles.sectionHeader}>
          <h2>Why Choose TaskFlow?</h2>
          <p>Built for productivity and ease of use</p>
        </div>
        <div className={styles.whyGrid}>
          <div className={styles.whyItem}>
            <CheckCircle2 size={24} />
            <span>Simple & Intuitive Interface</span>
          </div>
          <div className={styles.whyItem}>
            <CheckCircle2 size={24} />
            <span>Zero Learning Curve</span>
          </div>
          <div className={styles.whyItem}>
            <CheckCircle2 size={24} />
            <span>Works on All Devices</span>
          </div>
          <div className={styles.whyItem}>
            <CheckCircle2 size={24} />
            <span>Fast & Reliable</span>
          </div>
          <div className={styles.whyItem}>
            <CheckCircle2 size={24} />
            <span>Privacy Focused</span>
          </div>
          <div className={styles.whyItem}>
            <CheckCircle2 size={24} />
            <span>Beautiful Design</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricingSection}>
        <div className={styles.sectionHeader}>
          <h2>Simple Pricing</h2>
          <p>Choose the plan that works for you</p>
        </div>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <h3>Free</h3>
            <div className={styles.price}><span className={styles.currency}>$</span>0</div>
            <p className={styles.period}>/month</p>
            <div className={styles.features}>
              <div className={styles.feature}>✓ Basic Tasks</div>
              <div className={styles.feature}>✓ Simple Categories</div>
              <div className={styles.feature}>✓ Mobile Access</div>
              <div className={styles.feature}>✗ Advanced Analytics</div>
              <div className={styles.feature}>✗ Priority Support</div>
            </div>
            <button className={styles.pricingBtnSecondary} onClick={() => handleNavigation('/signup')}>
              Get Started
            </button>
          </div>

          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.badge}>Most Popular</div>
            <h3>Pro</h3>
            <div className={styles.price}><span className={styles.currency}>$</span>9<span className={styles.small}>.99</span></div>
            <p className={styles.period}>/month</p>
            <div className={styles.features}>
              <div className={styles.feature}>✓ Unlimited Tasks</div>
              <div className={styles.feature}>✓ Advanced Categories</div>
              <div className={styles.feature}>✓ Analytics Dashboard</div>
              <div className={styles.feature}>✓ Priority Support</div>
              <div className={styles.feature}>✓ Cloud Sync</div>
            </div>
            <button className={styles.pricingBtnPrimary} onClick={() => handleNavigation('/signup')}>
              Start Free Trial
            </button>
          </div>

          <div className={styles.pricingCard}>
            <h3>Enterprise</h3>
            <div className={styles.price}>Custom</div>
            <p className={styles.period}>for teams</p>
            <div className={styles.features}>
              <div className={styles.feature}>✓ Everything in Pro</div>
              <div className={styles.feature}>✓ Team Collaboration</div>
              <div className={styles.feature}>✓ Advanced Security</div>
              <div className={styles.feature}>✓ Dedicated Account Manager</div>
              <div className={styles.feature}>✓ Custom Integration</div>
            </div>
            <button className={styles.pricingBtnSecondary}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <h2>Ready to boost your productivity?</h2>
        <p>Join thousands of users who are already managing their tasks better with TaskFlow</p>
        <button 
          className={styles.finalCtaButton}
          onClick={() => handleNavigation('/signup')}
        >
          Get Started Now <ArrowRight size={20} />
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>TaskFlow</h4>
            <p>Your simple to-do list to manage it all.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 TaskFlow. All rights reserved. Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
