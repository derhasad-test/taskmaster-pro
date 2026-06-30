import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu, X, CheckCircle2, Calendar, Clock, Bell, Folder,
  Zap, Lock, Cloud, Brain, Play, ArrowRight, Star,
  ChevronDown, Github, Linkedin, Twitter, Facebook, Instagram,
  Mail, Phone, MapPin
} from 'lucide-react';
import styles from './PremiumLanding.module.css';
import { useAuth } from '../context/AuthContext';
export default function PremiumLanding() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqItems = [
    {
      question: 'Is TaskFlow free?',
      answer: 'Yes! TaskFlow offers a free plan with unlimited tasks, calendar view, and basic analytics. For advanced features, upgrade to Premium.'
    },
    {
      question: 'Can I use it on mobile?',
      answer: 'Absolutely! TaskFlow is fully responsive and works seamlessly on iOS, Android, tablets, and desktops.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption and secure authentication to protect your data. Your privacy is our priority.'
    },
    {
      question: 'Can I collaborate with teams?',
      answer: 'Yes! TaskFlow Premium supports team collaboration with shared workspaces, permissions, and real-time updates.'
    },
    {
      question: 'Does it support dark mode?',
      answer: 'Yes, TaskFlow has a beautiful dark mode that you can toggle anytime to match your preferences.'
    }
  ];

  const features = [
    { icon: '✅', title: 'Create Unlimited Tasks', desc: 'No limits on how many tasks you can create and organize' },
    { icon: '⭐', title: 'Smart Task Priorities', desc: 'Set priority levels and focus on what matters most' },
    { icon: '📊', title: 'Drag & Drop Kanban', desc: 'Organize tasks with intuitive drag-and-drop board' },
    { icon: '📅', title: 'Calendar View', desc: 'Visualize deadlines and schedule your week ahead' },
    { icon: '📝', title: 'Notes & Reminders', desc: 'Add detailed notes and get timely reminders' },
    { icon: '⏰', title: 'Due Dates', desc: 'Set and track task deadlines with ease' },
    { icon: '🔍', title: 'Search & Filter', desc: 'Find tasks instantly with powerful search' },
    { icon: '🏷️', title: 'Categories & Labels', desc: 'Organize tasks by custom labels and categories' },
    { icon: '📈', title: 'Progress Tracking', desc: 'View detailed analytics and productivity insights' },
    { icon: '🌙', title: 'Dark & Light Mode', desc: 'Choose your preferred theme for comfortable viewing' },
    { icon: '🔐', title: 'Secure Authentication', desc: 'Your account is protected with industry-standard security' },
    { icon: '📱', title: 'Fully Responsive', desc: 'Works perfectly on desktop, tablet, and mobile devices' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      text: 'TaskFlow transformed the way I organize my daily work. It\'s simple yet powerful.',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Johnson',
      role: 'Freelancer',
      text: 'Simple, elegant, and incredibly productive. Best task manager I\'ve used.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Wilson',
      role: 'Team Lead',
      text: 'TaskFlow helps our team stay organized and focused. Highly recommend it!',
      avatar: '👩‍🦰'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className={styles.premium}>
      {/* Navigation */}
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContainer}>
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className={styles.logoIcon}>✨</div>
            <span>TaskFlow</span>
          </motion.div>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ''}`}>
            {['Home', 'Features', 'About', 'Pricing', 'Testimonials', 'FAQ', 'Contact'].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className={styles.navLink}>
                {link}
              </a>
            ))}
          </div>

          <div className={styles.authButtons}>
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>
              Login
            </button>
            <motion.button
              className={styles.signupBtn}
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero} id="home">
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className={styles.heroTitle}>
            Stay Organized.<br />
            <span className={styles.highlight}>Achieve More</span> Every Day.
          </h1>
          <p className={styles.heroSubtitle}>
            Plan your day, manage projects, track your progress, and accomplish more with TaskFlow—the smart productivity companion designed for students, professionals, and teams.
          </p>
          <div className={styles.heroCTA}>
            <motion.button
              className={styles.primaryBtn}
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <ArrowRight size={20} />
            </motion.button>
            <motion.button
              className={styles.secondaryBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            //   onClick={async () => {
            //     const ok = await login("demo@taskflow.app", "demo1234");
            //     if (ok) {
            //       navigate('/dashboard');
            //     }
            //   }}
              onClick={async () => {
                // Try to login as demo user
                let ok = await login('demo@taskflow.app', 'demo1234');
                if (ok) {
                    navigate('/dashboard');
                }

                // If demo user doesn't exist, create it first
                if (!ok) {
                  await signup('Demo User', 'demo@taskflow.app', 'demo1234');
                  // Now login
                  ok = await login('demo@taskflow.app', 'demo1234');
                }
                if (ok) {
                  navigate('/dashboard');
                }
              }}
            >
              <Play size={20} /> Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Icons */}
        <div className={styles.floatingContainer}>
          <motion.div className={styles.floatingIcon} animate={{ y: [0, -20, 0] }} transition={{ duration: 3 }}>
            <Calendar size={40} />
          </motion.div>
          <motion.div className={styles.floatingIcon} animate={{ y: [0, -20, 0] }} transition={{ duration: 4 }}>
            <CheckCircle2 size={40} />
          </motion.div>
          <motion.div className={styles.floatingIcon} animate={{ y: [0, -20, 0] }} transition={{ duration: 3.5 }}>
            <Folder size={40} />
          </motion.div>
          <motion.div className={styles.floatingIcon} animate={{ y: [0, -20, 0] }} transition={{ duration: 4.5 }}>
            <Clock size={40} />
          </motion.div>
          <motion.div className={styles.floatingIcon} animate={{ y: [0, -20, 0] }} transition={{ duration: 3.2 }}>
            <Bell size={40} />
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          className={styles.dashboardPreview}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardHeader}>
              <span>📊 Dashboard</span>
              <div className={styles.dots}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
            </div>
            <div className={styles.dashboardContent}>
              <div className={styles.dashboardSection}>
                <h4>Today's Tasks</h4>
                <div className={styles.taskItem}>✓ Complete report</div>
                <div className={styles.taskItem}>○ Meeting at 2 PM</div>
                <div className={styles.taskItem}>✓ Review feedback</div>
              </div>
              <div className={styles.dashboardSection}>
                <h4>Progress</h4>
                <div className={styles.progressCircle}>
                  <div className={styles.progressFill} style={{ backgroundImage: 'conic-gradient(from 0deg, #ec4899 70%, transparent 0)' }}></div>
                  <span>70%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted Users Section */}
      <section className={styles.trusted} id="about">
        <motion.div
          className={styles.trustedContent}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className={styles.sectionTitle}>Trusted by Millions</h2>
          <div className={styles.trustedUsers}>
            {['Students', 'Developers', 'Freelancers', 'Teams', 'Businesses'].map((user, i) => (
              <motion.div key={i} variants={itemVariants} className={styles.trustedBadge}>
                {user}
              </motion.div>
            ))}
          </div>

          <div className={styles.statsGrid}>
            <motion.div variants={itemVariants} className={styles.statCard}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Tasks Managed</div>
            </motion.div>
            <motion.div variants={itemVariants} className={styles.statCard}>
              <div className={styles.statNumber}>10K+</div>
              <div className={styles.statLabel}>Active Users</div>
            </motion.div>
            <motion.div variants={itemVariants} className={styles.statCard}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Uptime</div>
            </motion.div>
            <motion.div variants={itemVariants} className={styles.statCard}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Productivity Gain</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Powerful Features
        </motion.h2>
        <motion.div
          className={styles.featuresGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={itemVariants} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsGrid}>
          {[
            { step: 1, title: 'Create Account', desc: 'Sign up for free and create your TaskFlow account' },
            { step: 2, title: 'Add Tasks', desc: 'Add and organize your tasks with priorities' },
            { step: 3, title: 'Track Progress', desc: 'Monitor your daily progress and achievements' },
            { step: 4, title: 'Stay Productive', desc: 'Complete goals and maintain productivity' }
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className={styles.stepNumber}>{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {i < 3 && <div className={styles.arrow}>↓</div>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why TaskFlow */}
      <section className={styles.whyTaskFlow}>
        <h2 className={styles.sectionTitle}>Why Choose TaskFlow?</h2>
        <motion.div
          className={styles.whyGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className={styles.whyCard}>
            <Zap size={40} />
            <h3>Fast Performance</h3>
            <p>Lightning-fast interface with instant sync across all devices</p>
          </motion.div>
          <motion.div variants={itemVariants} className={styles.whyCard}>
            <Lock size={40} />
            <h3>Secure Authentication</h3>
            <p>Industry-standard encryption protects your data</p>
          </motion.div>
          <motion.div variants={itemVariants} className={styles.whyCard}>
            <Cloud size={40} />
            <h3>Cloud Synchronization</h3>
            <p>Access your tasks from anywhere, anytime, any device</p>
          </motion.div>
          <motion.div variants={itemVariants} className={styles.whyCard}>
            <Brain size={40} />
            <h3>AI-Powered Productivity</h3>
            <p>Smart suggestions to help you work more efficiently</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials} id="testimonials">
        <h2 className={styles.sectionTitle}>What Users Say</h2>
        <motion.div
          className={styles.testimonialGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div key={i} variants={itemVariants} className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>{testimonial.avatar}</div>
                <div>
                  <div className={styles.authorName}>{testimonial.name}</div>
                  <div className={styles.authorRole}>{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing} id="pricing">
        <h2 className={styles.sectionTitle}>Simple Pricing</h2>
        <motion.div
          className={styles.pricingGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className={styles.pricingCard}>
            <h3>Free Plan</h3>
            <div className={styles.price}>$0</div>
            <ul className={styles.priceList}>
              <li>✓ Unlimited Tasks</li>
              <li>✓ Calendar View</li>
              <li>✓ Basic Analytics</li>
              <li>✗ Team Collaboration</li>
              <li>✗ AI Suggestions</li>
            </ul>
            <button className={styles.pricingBtnSecondary} onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.badge}>POPULAR</div>
            <h3>Premium Plan</h3>
            <div className={styles.price}>$9.99 <span className={styles.period}>/month</span></div>
            <ul className={styles.priceList}>
              <li>✓ Unlimited Tasks</li>
              <li>✓ Team Collaboration</li>
              <li>✓ Advanced Analytics</li>
              <li>✓ AI Suggestions</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className={styles.pricingBtnPrimary} onClick={() => navigate('/signup')}>
              Start Free Trial
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className={styles.pricingCard}>
            <h3>Enterprise</h3>
            <div className={styles.price}>Custom</div>
            <ul className={styles.priceList}>
              <li>✓ Everything in Premium</li>
              <li>✓ Unlimited Users</li>
              <li>✓ Custom Integrations</li>
              <li>✓ Dedicated Support</li>
              <li>✓ SLA Guarantee</li>
            </ul>
            <button className={styles.pricingBtnSecondary}>
              Contact Sales
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className={styles.faq} id="faq">
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <motion.div
          className={styles.faqContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`${styles.faqItem} ${expandedFaq === i ? styles.expanded : ''}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <span>{item.question}</span>
                <ChevronDown size={20} />
              </button>
              {expandedFaq === i && (
                <motion.div
                  className={styles.faqAnswer}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {item.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Boost Your Productivity?</h2>
          <p>Join thousands of users who organize their work smarter with TaskFlow</p>
          <div className={styles.ctaButtons}>
            <motion.button
              className={styles.ctaPrimaryBtn}
              onClick={() => navigate('/signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free <ArrowRight size={20} />
            </motion.button>
            <motion.button
              className={styles.ctaSecondaryBtn}
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#pricing">Careers</a>
            <a href="#features">Blog</a>
          </div>
          <div className={styles.footerColumn}>
            <h4>Resources</h4>
            <a href="#faq">Documentation</a>
            <a href="#faq">API</a>
            <a href="#faq">Help Center</a>
          </div>
          <div className={styles.footerColumn}>
            <h4>Legal</h4>
            <a href="#faq">Privacy Policy</a>
            <a href="#faq">Terms & Conditions</a>
          </div>
          <div className={styles.footerColumn}>
            <h4>Contact</h4>
            <a href="mailto:derhasad-hello@taskflow.com">derhasad-hello@taskflow.com</a>
            <a href="tel:+91 8822827513">+91 8822827513</a>
            <a href="#faq">Assam, INDIA</a>
          </div>
          <div className={styles.footerColumn}>
            <h4>Follow Us</h4>
            <div className={styles.socialIcons}>
              <motion.a href="#" whileHover={{ scale: 1.2 }}><Github size={20} /></motion.a>
              <motion.a href="https://www.linkedin.com/in/derhasad-b-568615258/" whileHover={{ scale: 1.2 }}><Linkedin size={20} /></motion.a>
              <motion.a href="https://x.com/DerhasadBa99140n" whileHover={{ scale: 1.2 }}><Twitter size={20} /></motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }}><Facebook size={20} /></motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }}><Instagram size={20} /></motion.a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 TaskFlow. All rights reserved. Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
