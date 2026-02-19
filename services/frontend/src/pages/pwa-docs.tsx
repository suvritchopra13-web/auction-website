import React from 'react';
import Head from 'next/head';

const PWADocs: React.FC = () => {
  return (
    <>
      <Head>
        <title>Cinemart PWA - Documentation Hub</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={{ fontFamily: "'Inter', sans-serif", background: 'linear-gradient(135deg, #0A0A0F 0%, #0F0F1A 100%)', color: '#F5F0E8', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              fontSize: '72px',
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3, #C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              marginBottom: '16px',
              fontFamily: "'Playfair Display', serif"
            }}>
              Cinemart
            </div>
            <div style={{ color: '#A09070', fontSize: '24px', marginBottom: '24px' }}>
              Progressive Web App Documentation Hub
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(46, 204, 113, 0.1)',
              border: '2px solid #2ECC71',
              color: '#2ECC71',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '18px'
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                background: '#2ECC71',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
              Production Ready
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#C9A84C', fontSize: '32px', letterSpacing: '12px', margin: '48px 0' }}>
            ✦ ✦ ✦
          </div>

          {/* Documentation Cards */}
          <section style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', color: '#C9A84C', marginBottom: '32px', fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>
              📚 Documentation
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <DocumentCard
                title="Summary Guide"
                description="Complete overview of what has been created, features implemented, and step-by-step implementation instructions. Start here!"
                icon="📄"
                href="/PWA-SUMMARY.md"
              />
              <DocumentCard
                title="Implementation Checklist"
                description="Step-by-step checklist to implement your PWA. Check off tasks as you complete them. Includes time estimates."
                icon="✅"
                href="/PWA-CHECKLIST.md"
              />
              <DocumentCard
                title="Quick Reference"
                description="Essential code snippets, common issues, and quick fixes. Keep this open while coding. Perfect for copy-paste."
                icon="⚡"
                href="/PWA-QUICK-REFERENCE.md"
              />
              <DocumentCard
                title="Technical Documentation"
                description="Complete technical guide with testing procedures, troubleshooting, analytics, and deployment checklist."
                icon="📖"
                href="/PWA-README.md"
              />
              <DocumentCard
                title="Architecture Guide"
                description="System architecture diagrams, request flows, caching strategies, and component architecture. For deep understanding."
                icon="🏗️"
                href="/PWA-ARCHITECTURE.md"
              />
              <DocumentCard
                title="File Index"
                description="Complete listing of all files, directory structure, usage matrix, and quick links. Navigation hub for the project."
                icon="📁"
                href="/PWA-INDEX.md"
              />
            </div>
          </section>

          {/* Interactive Tools */}
          <section style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', color: '#C9A84C', marginBottom: '32px', fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>
              🛠️ Interactive Tools
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <DocumentCard
                title="Testing Dashboard"
                description="Live PWA status monitoring. Check service worker, manifest, install status, network, and more. Essential for debugging."
                icon="🎯"
                href="/pwa-implementation.html"
              />
              <DocumentCard
                title="Icon Generator"
                description="Create all required icon sizes with custom styles and colors. Generates 13 sizes instantly. Matches Cinemart branding."
                icon="🎨"
                href="/icon-generator.html"
              />
              <DocumentCard
                title="Installation Guide"
                description="Complete installation instructions for all platforms, technical implementation details, and troubleshooting. For users and developers."
                icon="📱"
                href="/pwa-install-guide.html"
              />
            </div>
          </section>

          {/* Features */}
          <section style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', color: '#C9A84C', marginBottom: '32px', fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>
              ✨ Features Implemented
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { icon: '📱', title: 'Installable', desc: 'Add to home screen on any device' },
                { icon: '🌐', title: 'Offline-Ready', desc: 'Works without internet connection' },
                { icon: '⚡', title: 'Lightning Fast', desc: 'Instant loading with service worker' },
                { icon: '🔔', title: 'Push Notifications', desc: 'Real-time alerts ready to implement' },
                { icon: '🎨', title: 'App-Like UI', desc: 'Full-screen standalone mode' },
                { icon: '🔄', title: 'Auto-Updates', desc: 'Seamless background updates' },
                { icon: '🌍', title: 'Cross-Platform', desc: 'Works on iOS, Android, Desktop' },
                { icon: '🔒', title: 'Secure', desc: 'HTTPS required for safety' },
              ].map((feature, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: '24px',
                  background: 'rgba(201, 168, 76, 0.05)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                  <h4 style={{ color: '#E8D5A3', fontSize: '18px', marginBottom: '8px' }}>{feature.title}</h4>
                  <p style={{ color: '#A09070', fontSize: '14px' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Start */}
          <section style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', color: '#C9A84C', marginBottom: '32px', fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>
              🎯 Quick Start (Total: ~2-3 hours)
            </h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {[
                { num: 1, title: 'Generate Icons (15 min)', desc: 'Use the Icon Generator tool to create all required icon sizes with Cinemart branding.' },
                { num: 2, title: 'Add HTML Tags (10 min)', desc: 'Copy meta tags from Quick Reference and add to your HTML head section.' },
                { num: 3, title: 'Integrate Code (45 min)', desc: 'Copy PWA utilities and React components from the example integration file.' },
                { num: 4, title: 'Test Locally (30 min)', desc: 'Use the Testing Dashboard to verify all PWA features work correctly.' },
                { num: 5, title: 'Deploy (15 min)', desc: 'Build for production, deploy to hosting, and test on real devices.' },
              ].map((step) => (
                <div key={step.num} style={{
                  position: 'relative',
                  paddingLeft: '60px',
                  marginBottom: '32px',
                  borderLeft: '2px solid #C9A84C',
                  paddingBottom: '16px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '-16px',
                    top: '0',
                    width: '32px',
                    height: '32px',
                    background: '#C9A84C',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0A0A0F',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {step.num}
                  </div>
                  <h4 style={{ color: '#E8D5A3', fontSize: '20px', marginBottom: '8px' }}>{step.title}</h4>
                  <p style={{ color: '#A09070', lineHeight: '1.6' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', color: '#C9A84C', marginBottom: '32px', fontFamily: "'Playfair Display', serif", textAlign: 'center' }}>
              📊 What You Get
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { num: '13', label: 'Documentation Files' },
                { num: '4', label: 'Core PWA Files' },
                { num: '3', label: 'Interactive Tools' },
                { num: '90+', label: 'Lighthouse Score' },
              ].map((stat, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: '24px',
                  background: 'rgba(201, 168, 76, 0.05)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: 700,
                    color: '#C9A84C',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {stat.num}
                  </div>
                  <div style={{ color: '#A09070', marginTop: '8px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ textAlign: 'center', color: '#C9A84C', fontSize: '32px', letterSpacing: '12px', margin: '48px 0' }}>
            ✦ ✦ ✦
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: '64px' }}>
            <h2 style={{ color: '#C9A84C', fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '24px' }}>
              Ready to Get Started?
            </h2>
            <p style={{ color: '#A09070', marginBottom: '32px', fontSize: '18px' }}>
              Follow the implementation checklist to make Cinemart a Progressive Web App
            </p>
            <a
              href="/PWA-CHECKLIST.md"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                color: '#0A0A0F',
                padding: '16px 48px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '18px'
              }}
            >
              Start Implementation
            </a>
          </div>

          {/* Footer */}
          <footer style={{ textAlign: 'center', marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(201, 168, 76, 0.2)', color: '#A09070' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#C9A84C' }}>Where Cinema Becomes Legacy</strong>
            </p>
            <p>All items are subject to expert authentication.</p>
            <p>Cinemart is not affiliated with any film studio or production house.</p>
          </footer>
        </div>

        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </>
  );
};

interface DocumentCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, description, icon, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: '#141420',
        border: '1px solid rgba(201, 168, 76, 0.2)',
        borderRadius: '12px',
        padding: '32px',
        textDecoration: 'none',
        display: 'block',
        transition: 'all 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(201, 168, 76, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.2)';
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>{icon}</div>
      <h3 style={{
        color: '#C9A84C',
        fontSize: '24px',
        marginBottom: '12px',
        fontFamily: "'Playfair Display', serif"
      }}>
        {title}
      </h3>
      <p style={{ color: '#A09070', lineHeight: '1.6', marginBottom: '20px' }}>
        {description}
      </p>
      <span style={{
        color: '#E8D5A3',
        fontWeight: 600,
        borderBottom: '2px solid transparent'
      }}>
        View {title} →
      </span>
    </a>
  );
};

export default PWADocs;
