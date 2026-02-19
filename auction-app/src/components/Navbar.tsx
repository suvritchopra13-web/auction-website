import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/useAppStore';

const NAV_LINKS = [
  { label: 'Browse', to: '/listings' },
  { label: 'Sell', to: '/sell' },
  { label: 'Dashboard', to: '/dashboard', auth: true },
];

function getInitials(
  profile: { first_name?: string; last_name?: string; username?: string } | null,
  username: string | undefined,
  email: string | undefined
): string {
  if (profile && profile.first_name && profile.last_name) {
    return (profile.first_name[0] + profile.last_name[0]).toUpperCase();
  }
  if (profile && profile.first_name) {
    return profile.first_name[0].toUpperCase();
  }
  if (username && username.length > 0) {
    return username[0].toUpperCase();
  }
  if (email && email.length > 0) {
    return email[0].toUpperCase();
  }
  return 'U';
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { isDemoMode, toggleDemoMode, navScrolled, setNavScrolled } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setNavScrolled]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  const initials = getInitials(
    profile,
    profile ? profile.username : undefined,
    user ? user.email : undefined
  );

  const visibleLinks = NAV_LINKS.filter((link) => !link.auth || !!user);

  const displayName = profile
    ? (profile.first_name && profile.last_name
        ? profile.first_name + ' ' + profile.last_name
        : profile.username)
    : (user ? (user.email ? user.email.split('@')[0] : 'Account') : 'Account');

  return (
    <>
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: var(--z-nav);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: box-shadow var(--transition-slow), border-color var(--transition-slow);
        }
        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 var(--space-6);
          height: 64px;
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-mark {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.125rem;
          color: #fff;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .logo-text {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: var(--text-lg);
          color: var(--color-neutral-900);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .logo-text-accent {
          color: var(--color-primary-500);
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          margin-left: var(--space-4);
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-neutral-600);
          text-decoration: none;
          transition: color var(--transition-fast), background var(--transition-fast);
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--color-primary-600);
          background: var(--color-primary-50);
        }
        .nav-link-active {
          color: var(--color-primary-600) !important;
          background: var(--color-primary-50) !important;
          font-weight: 600;
        }
        .nav-spacer {
          flex: 1;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-shrink: 0;
        }
        .demo-toggle {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: 5px var(--space-3);
          border-radius: var(--radius-full);
          border: 1.5px solid var(--color-neutral-200);
          background: var(--color-neutral-0);
          font-family: var(--font-body);
          font-size: var(--text-xs);
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-neutral-500);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .demo-toggle:hover {
          border-color: var(--color-accent-300);
          color: var(--color-accent-700);
          background: var(--color-accent-50);
        }
        .demo-toggle-active {
          border-color: var(--color-accent-400) !important;
          background: var(--color-accent-50) !important;
          color: var(--color-accent-700) !important;
        }
        .demo-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--color-accent-500);
          flex-shrink: 0;
        }
        .btn-signin {
          display: inline-flex;
          align-items: center;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          border: 1.5px solid var(--color-neutral-200);
          background: transparent;
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-neutral-700);
          cursor: pointer;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .btn-signin:hover {
          border-color: var(--color-primary-300);
          color: var(--color-primary-600);
          background: var(--color-primary-50);
        }
        .btn-getstarted {
          display: inline-flex;
          align-items: center;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          border: none;
          background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          text-decoration: none;
          transition: opacity var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
          box-shadow: 0 1px 3px rgba(79, 94, 247, 0.35);
        }
        .btn-getstarted:hover {
          opacity: 0.9;
          box-shadow: 0 4px 12px rgba(79, 94, 247, 0.4);
          transform: translateY(-1px);
        }
        .avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          border: 2px solid var(--color-primary-200);
          background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--color-primary-700);
          cursor: pointer;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          flex-shrink: 0;
        }
        .avatar-btn:hover,
        .avatar-btn-open {
          border-color: var(--color-primary-400);
          box-shadow: 0 0 0 3px var(--color-primary-100);
        }
        .avatar-wrap {
          position: relative;
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 210px;
          background: var(--color-neutral-0);
          border: 1px solid var(--color-neutral-200);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: fade-in 150ms ease both;
          z-index: var(--z-overlay);
        }
        .dropdown-header {
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--color-neutral-100);
          background: var(--color-neutral-50);
        }
        .dropdown-name {
          font-family: var(--font-display);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-neutral-900);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-email {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-neutral-700);
          text-decoration: none;
          transition: background var(--transition-fast), color var(--transition-fast);
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: var(--font-body);
        }
        .dropdown-item:hover {
          background: var(--color-neutral-50);
          color: var(--color-primary-600);
        }
        .dropdown-divider {
          height: 1px;
          background: var(--color-neutral-100);
          margin: var(--space-1) 0;
        }
        .dropdown-item-danger:hover {
          background: var(--color-error-50) !important;
          color: var(--color-error-600) !important;
        }
        .hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: 1px solid var(--color-neutral-200);
          background: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          color: var(--color-neutral-600);
          transition: background var(--transition-fast), border-color var(--transition-fast);
          flex-shrink: 0;
        }
        .hamburger:hover {
          background: var(--color-neutral-100);
          border-color: var(--color-neutral-300);
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          z-index: calc(var(--z-nav) - 2);
        }
        .mobile-panel {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          z-index: calc(var(--z-nav) - 1);
          background: var(--color-neutral-0);
          border-bottom: 1px solid var(--color-neutral-200);
          box-shadow: var(--shadow-lg);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          animation: fade-in 200ms ease both;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--color-neutral-700);
          text-decoration: none;
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .mobile-nav-link:hover,
        .mobile-nav-link-active {
          background: var(--color-primary-50);
          color: var(--color-primary-600);
        }
        .mobile-divider {
          height: 1px;
          background: var(--color-neutral-100);
          margin: var(--space-2) 0;
        }
        .mobile-auth-row {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-1) 0;
        }
        .mobile-auth-row .btn-signin,
        .mobile-auth-row .btn-getstarted {
          flex: 1;
          justify-content: center;
        }
        .mobile-signout-btn {
          display: flex;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--color-error-600);
          text-decoration: none;
          transition: background var(--transition-fast);
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: var(--font-body);
        }
        .mobile-signout-btn:hover {
          background: var(--color-error-50);
        }
        @media (max-width: 767px) {
          .nav-links-desktop { display: none !important; }
          .nav-actions { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
          .mobile-overlay { display: none !important; }
          .mobile-panel { display: none !important; }
        }
      `}</style>

      <header
        className="site-header"
        style={{
          borderBottom: navScrolled ? '1px solid var(--color-neutral-200)' : '1px solid transparent',
          boxShadow: navScrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="logo-mark">A</div>
            <div className="logo-text">
              Auction<span className="logo-text-accent">Web</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="nav-links-desktop">
            {visibleLinks.map((link) => {
              const isActive =
                location.pathname === link.to ||
                location.pathname.startsWith(link.to + '/');
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={'nav-link' + (isActive ? ' nav-link-active' : '')}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="nav-spacer" />

          {/* Desktop actions */}
          <div className="nav-actions">
            {/* Demo mode toggle */}
            <button
              className={'demo-toggle' + (isDemoMode ? ' demo-toggle-active' : '')}
              onClick={toggleDemoMode}
              title={isDemoMode ? 'Disable demo mode' : 'Enable demo mode'}
            >
              {isDemoMode ? (
                <>
                  <span className="demo-dot pulse-dot" />
                  LIVE DEMO
                </>
              ) : (
                'Demo'
              )}
            </button>

            {user ? (
              /* Authenticated: avatar + dropdown */
              <div className="avatar-wrap" ref={dropdownRef}>
                <button
                  className={'avatar-btn' + (dropdownOpen ? ' avatar-btn-open' : '')}
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {initials}
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{displayName}</div>
                      <div className="dropdown-email">{user.email ? user.email : ''}</div>
                    </div>
                    <Link to="/dashboard" className="dropdown-item">
                      Dashboard
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      Settings
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item dropdown-item-danger"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated */
              <>
                <Link to="/auth/signin" className="btn-signin">
                  Sign In
                </Link>
                <Link to="/auth/signup" className="btn-getstarted">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 4L16 16M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-panel">
            {visibleLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={'mobile-nav-link' + (isActive ? ' mobile-nav-link-active' : '')}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mobile-divider" />

            <button
              className={'demo-toggle' + (isDemoMode ? ' demo-toggle-active' : '')}
              onClick={toggleDemoMode}
              style={{ alignSelf: 'flex-start' }}
            >
              {isDemoMode ? (
                <>
                  <span className="demo-dot pulse-dot" />
                  LIVE DEMO
                </>
              ) : (
                'Demo Mode'
              )}
            </button>

            {user ? (
              <>
                <div className="mobile-divider" />
                <Link to="/settings" className="mobile-nav-link">
                  Settings
                </Link>
                <button className="mobile-signout-btn" onClick={handleSignOut}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="mobile-divider" />
                <div className="mobile-auth-row">
                  <Link to="/auth/signin" className="btn-signin">
                    Sign In
                  </Link>
                  <Link to="/auth/signup" className="btn-getstarted">
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
