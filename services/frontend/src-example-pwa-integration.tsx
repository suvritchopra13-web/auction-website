/**
 * EXAMPLE: PWA Integration for Cinemart
 *
 * This file shows how to integrate PWA features into your React application.
 * Copy the relevant sections to your actual source files.
 */

// ============================================================================
// FILE 1: src/utils/pwa.ts
// ============================================================================

/**
 * Service Worker Registration
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('✅ Service Worker registered:', registration.scope);

    // Check for updates every minute
    setInterval(() => {
      registration.update();
    }, 60000);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('🔄 New version available');
          // Trigger update notification
          window.dispatchEvent(new CustomEvent('sw-update-available'));
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Install Prompt Handler
 */
let deferredPrompt: any = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('💡 Install prompt available');

    // Dispatch event for UI to show install button
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  });

  window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA installed successfully');
    deferredPrompt = null;

    // Track with analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_installed', {
        event_category: 'PWA',
        event_label: 'App Installed'
      });
    }
  });
}

export async function installApp(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) {
    console.warn('Install prompt not available');
    return 'unavailable';
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  console.log(`Install outcome: ${outcome}`);
  deferredPrompt = null;

  // Hide install button
  window.dispatchEvent(new CustomEvent('pwa-install-completed'));

  return outcome;
}

/**
 * Check if app is running in standalone mode
 */
export function isStandalone(): boolean {
  // iOS
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isStandaloneiOS = (window.navigator as any).standalone === true;

  // Android & Desktop
  const isStandaloneOther = window.matchMedia('(display-mode: standalone)').matches;

  return isStandaloneiOS || isStandaloneOther;
}

/**
 * Network Status Detection
 */
export function setupNetworkHandlers(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener('online', () => {
    console.log('🌐 Back online');
    onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('📡 Gone offline');
    onOffline();
  });

  // Return current status
  return navigator.onLine;
}

/**
 * Push Notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  console.log(`Notification permission: ${permission}`);
  return permission;
}

export async function subscribeToPushNotifications(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    console.log('✅ Push subscription created');
    return subscription;
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

/**
 * Cache Management
 */
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) return;

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🗑️ All caches cleared');
}

export async function getCacheSize(): Promise<{ usage: number; quota: number; percentUsed: number } | null> {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
    return null;
  }

  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  const percentUsed = quota > 0 ? (usage / quota * 100) : 0;

  return {
    usage,
    quota,
    percentUsed: parseFloat(percentUsed.toFixed(2))
  };
}

// ============================================================================
// FILE 2: src/components/InstallPrompt.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import { installApp } from '../utils/pwa';

export const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleInstallAvailable = () => setShowPrompt(true);
    const handleInstallCompleted = () => setShowPrompt(false);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
    };
  }, []);

  const handleInstall = async () => {
    const outcome = await installApp();

    if (outcome === 'accepted') {
      console.log('User accepted install');
    } else if (outcome === 'dismissed') {
      console.log('User dismissed install');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-auto px-4">
      <div className="bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] rounded-xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-12 h-12 text-[#0A0A0F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-[#0A0A0F] font-bold text-lg mb-1">
              Install Cinemart
            </h3>
            <p className="text-[#0A0A0F] text-sm mb-4">
              Get instant access to live auctions and real-time bidding notifications
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 bg-[#0A0A0F] text-[#C9A84C] font-semibold py-2 px-4 rounded-lg hover:bg-[#141420] transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 bg-transparent border-2 border-[#0A0A0F] text-[#0A0A0F] font-semibold py-2 px-4 rounded-lg hover:bg-[#0A0A0F] hover:bg-opacity-10 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-[#0A0A0F] hover:text-opacity-70"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FILE 3: src/components/UpdateNotification.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';

export const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => setShowUpdate(true);
    window.addEventListener('sw-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleUpdate = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] py-4 px-6 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6 text-[#0A0A0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div>
            <p className="text-[#0A0A0F] font-bold">New version available!</p>
            <p className="text-[#0A0A0F] text-sm">Update now for the latest features and improvements</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            className="bg-[#0A0A0F] text-[#C9A84C] font-semibold py-2 px-6 rounded-lg hover:bg-[#141420] transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={handleDismiss}
            className="bg-transparent border-2 border-[#0A0A0F] text-[#0A0A0F] font-semibold py-2 px-4 rounded-lg hover:bg-[#0A0A0F] hover:bg-opacity-10 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FILE 4: src/components/NetworkStatus.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import { setupNetworkHandlers } from '../utils/pwa';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    setupNetworkHandlers(handleOnline, handleOffline);
  }, []);

  if (!showNotification) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${
      isOnline
        ? 'bg-[#2ECC71] border-[#27AE60]'
        : 'bg-[#E74C3C] border-[#C0392B]'
    } border-2 rounded-lg shadow-xl p-4 animate-slide-up`}>
      <div className="flex items-center gap-3">
        {isOnline ? (
          <>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-white font-bold">Back Online</p>
              <p className="text-white text-sm">Connection restored</p>
            </div>
          </>
        ) : (
          <>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <div>
              <p className="text-white font-bold">You're Offline</p>
              <p className="text-white text-sm">Some features may be limited</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// FILE 5: src/index.tsx (Main Entry Point)
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker, setupInstallPrompt, isStandalone } from './utils/pwa';
import './styles/globals.css';

// Register Service Worker
registerServiceWorker();

// Setup Install Prompt
setupInstallPrompt();

// Track standalone launch
if (isStandalone()) {
  console.log('🚀 Launched in standalone mode');

  // Track with analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_standalone_launch', {
      event_category: 'PWA'
    });
  }

  // Add class to body for standalone-specific styles
  document.body.classList.add('standalone-mode');
}

// Render app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ============================================================================
// FILE 6: src/App.tsx
// ============================================================================

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { InstallPrompt } from './components/InstallPrompt';
import { UpdateNotification } from './components/UpdateNotification';
import { NetworkStatus } from './components/NetworkStatus';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      {/* PWA Components */}
      <InstallPrompt />
      <UpdateNotification />
      <NetworkStatus />

      {/* Your app content */}
      <div className="app">
        {/* Routes, Layout, etc. */}
      </div>
    </BrowserRouter>
  );
}

export default App;

// ============================================================================
// FILE 7: src/hooks/usePWA.ts (Optional Custom Hook)
// ============================================================================

import { useState, useEffect } from 'react';
import { isStandalone, getCacheSize } from '../utils/pwa';

interface PWAStatus {
  isStandalone: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  cacheSize: number | null;
  hasNotificationPermission: boolean;
}

export function usePWA(): PWAStatus {
  const [status, setStatus] = useState<PWAStatus>({
    isStandalone: isStandalone(),
    isInstallable: false,
    isOnline: navigator.onLine,
    cacheSize: null,
    hasNotificationPermission: Notification.permission === 'granted'
  });

  useEffect(() => {
    // Listen for install availability
    const handleInstallAvailable = () => {
      setStatus(prev => ({ ...prev, isInstallable: true }));
    };

    const handleInstallCompleted = () => {
      setStatus(prev => ({ ...prev, isInstallable: false }));
    };

    // Network status
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get cache size
    getCacheSize().then(result => {
      if (result) {
        setStatus(prev => ({ ...prev, cacheSize: result.usage }));
      }
    });

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}

// Usage in component:
// const { isStandalone, isInstallable, isOnline } = usePWA();

// ============================================================================
// FILE 8: src/styles/globals.css (Add PWA-specific styles)
// ============================================================================

/**
 * PWA-specific styles
 */

/* Standalone mode adjustments */
.standalone-mode {
  /* Add extra padding for notch on mobile devices */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Animation for install prompt */
@keyframes slide-up {
  from {
    transform: translateX(-50%) translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Prevent pull-to-refresh in standalone mode */
.standalone-mode body {
  overscroll-behavior-y: contain;
}

/* Hide elements in standalone mode */
.standalone-mode .browser-only {
  display: none;
}

/* Show elements only in standalone mode */
.standalone-only {
  display: none;
}

.standalone-mode .standalone-only {
  display: block;
}

// ============================================================================
// USAGE NOTES
// ============================================================================

/**
 * 1. Copy the utility functions from pwa.ts to your src/utils directory
 * 2. Copy the React components to your src/components directory
 * 3. Import and use them in your App.tsx
 * 4. Add the service worker registration to your index.tsx
 * 5. Ensure all PWA files are in the public directory
 * 6. Test with Chrome DevTools and Lighthouse
 *
 * The PWA features will automatically activate when:
 * - Service worker registers successfully
 * - User visits the site multiple times
 * - Manifest is properly configured
 * - HTTPS is enabled
 */

export {};
