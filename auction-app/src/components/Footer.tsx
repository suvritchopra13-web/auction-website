import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { label: 'Browse Auctions', to: '/listings' },
  { label: 'Sell an Item', to: '/sell' },
  { label: 'Sign In', to: '/auth/signin' },
  { label: 'Create Account', to: '/auth/signup' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        .site-footer {
          background: var(--color-neutral-0);
          border-top: 1px solid var(--color-neutral-200);
          margin-top: auto;
          font-family: var(--font-body);
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: var(--space-12) var(--space-6) var(--space-8);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.5fr;
          gap: var(--space-10);
          padding-bottom: var(--space-10);
          border-bottom: 1px solid var(--color-neutral-100);
        }
        @media (max-width: 767px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
        }
        .footer-logo-wrap {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
        }
        .footer-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1rem;
          color: #fff;
          flex-shrink: 0;
          box-shadow: var(--shadow-xs);
        }
        .footer-logo-text {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: var(--text-lg);
          color: var(--color-neutral-900);
          letter-spacing: -0.02em;
        }
        .footer-logo-text-accent {
          color: var(--color-primary-500);
        }
        .footer-tagline {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
          line-height: var(--leading-normal);
          max-width: 260px;
        }
        .footer-col-title {
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-neutral-900);
          margin-bottom: var(--space-4);
          letter-spacing: -0.01em;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .footer-link {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
          text-decoration: none;
          transition: color var(--transition-fast);
          width: fit-content;
        }
        .footer-link:hover {
          color: var(--color-primary-600);
        }
        .footer-newsletter {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .footer-newsletter-desc {
          font-size: var(--text-sm);
          color: var(--color-neutral-500);
          line-height: var(--leading-normal);
        }
        .footer-newsletter-row {
          display: flex;
          gap: var(--space-2);
        }
        .footer-newsletter-input {
          flex: 1;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          border: 1.5px solid var(--color-neutral-200);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--color-neutral-900);
          background: var(--color-neutral-50);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .footer-newsletter-input:focus {
          border-color: var(--color-primary-400);
          box-shadow: 0 0 0 3px var(--color-primary-100);
          background: var(--color-neutral-0);
        }
        .footer-newsletter-input::placeholder {
          color: var(--color-neutral-400);
        }
        .footer-newsletter-btn {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          border: none;
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: opacity var(--transition-fast);
          white-space: nowrap;
        }
        .footer-newsletter-btn:hover {
          opacity: 0.88;
        }
        .footer-bottom {
          padding-top: var(--space-6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .footer-copyright {
          font-size: var(--text-xs);
          color: var(--color-neutral-400);
        }
        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .footer-bottom-link {
          font-size: var(--text-xs);
          color: var(--color-neutral-400);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer-bottom-link:hover {
          color: var(--color-neutral-600);
        }
      `}</style>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Column 1: Logo + tagline */}
            <div className="footer-logo-wrap">
              <Link to="/" className="footer-logo">
                <div className="footer-logo-mark">A</div>
                <div className="footer-logo-text">
                  Auction<span className="footer-logo-text-accent">Web</span>
                </div>
              </Link>
              <p className="footer-tagline">
                The modern auction platform for collectors, enthusiasts, and professionals. Bid with confidence.
              </p>
            </div>

            {/* Column 2: Quick links */}
            <div>
              <div className="footer-col-title">Quick Links</div>
              <nav className="footer-links">
                {QUICK_LINKS.map((link) => (
                  <Link key={link.to} to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Column 3: Newsletter hint */}
            <div className="footer-newsletter">
              <div className="footer-col-title">Stay in the Loop</div>
              <p className="footer-newsletter-desc">
                Get notified about new listings, closing auctions, and platform updates.
              </p>
              <div className="footer-newsletter-row">
                <input
                  type="email"
                  className="footer-newsletter-input"
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                />
                <button className="footer-newsletter-btn">Notify Me</button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              &copy; {year} AuctionWeb. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
