# Cinemart PWA - Quick Reference Card

## 🎯 Essential Files

| File | Purpose |
|------|---------|
| `public/manifest.json` | App configuration & metadata |
| `public/service-worker.js` | Offline caching & updates |
| `public/offline.html` | Offline fallback page |
| `public/icons/*` | All icon sizes |

## 📱 Required HTML Tags (Add to `<head>`)

```html
<!-- Manifest -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0A0A0F">

<!-- iOS -->
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Cinemart">

<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
```

## 🔧 Service Worker Registration

```typescript
// Add to src/index.tsx or src/main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ SW registered:', reg.scope);
    } catch (err) {
      console.error('❌ SW failed:', err);
    }
  });
}
```

## 📦 Install Prompt Handler

```typescript
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton(); // Your UI function
});

async function install() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(outcome);
  deferredPrompt = null;
}

window.addEventListener('appinstalled', () => {
  console.log('🎉 Installed');
});
```

## 🎨 Required Icon Sizes

Generate these PNG icons with 1:1 ratio:

| Size | Purpose |
|------|---------|
| 16×16 | Browser favicon |
| 32×32 | Browser favicon |
| 72×72 | Android (ldpi) |
| 96×96 | Android (mdpi) |
| 120×120 | iOS |
| 128×128 | Chrome |
| 144×144 | Android (hdpi) |
| 152×152 | iOS iPad |
| 180×180 | iOS (main) |
| 192×192 | Android (xhdpi) |
| 384×384 | Android (xxhdpi) |
| 512×512 | Splash screen |

**Tool:** Use `/icon-generator.html`

## 🧪 Testing Commands

```bash
# Run Lighthouse
npm run lighthouse

# Test on mobile (with ngrok)
npx ngrok http 3000

# Check manifest
https://manifest-validator.appspot.com/
```

## 🔍 DevTools Checks

1. **F12** → **Application** → **Manifest**
   - Verify all fields populated
   - Check icons load

2. **Application** → **Service Workers**
   - Should show "activated and running"

3. **Lighthouse** → **PWA**
   - Target: 90+ score

## 📊 Key Metrics to Track

```typescript
// Install prompt shown
gtag('event', 'pwa_install_prompt_shown');

// Installed
gtag('event', 'pwa_installed');

// Standalone launch
if (matchMedia('(display-mode: standalone)').matches) {
  gtag('event', 'pwa_standalone_launch');
}
```

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| SW not registering | Check HTTPS enabled |
| Install prompt missing | Wait 30s, check already installed |
| Icons not showing | Verify paths in manifest.json |
| Offline not working | Check fetch handler in SW |
| iOS install issue | Requires manual "Add to Home Screen" |

## 🎯 Lighthouse Targets

- ✅ PWA Score: 90+
- ✅ Performance: 90+
- ✅ Fast load: <2s
- ✅ Works offline: Yes
- ✅ Installable: Yes

## 🔔 Push Notifications (Optional)

```typescript
// Request permission
const permission = await Notification.requestPermission();

// Subscribe
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: PUBLIC_VAPID_KEY
});

// Send to server
await fetch('/api/notifications/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});
```

## 🎨 Cinemart Brand Colors

| Element | Color |
|---------|-------|
| Background | `#0A0A0F` |
| Gold Primary | `#C9A84C` |
| Gold Secondary | `#E8D5A3` |
| Text Primary | `#F5F0E8` |
| Text Secondary | `#A09070` |

## 📱 Installation Per Platform

### Android (Chrome)
1. Menu (⋮) → "Install app"
2. Confirm

### iOS (Safari)
1. Share (⬆️) → "Add to Home Screen"
2. Confirm

### Desktop (Chrome/Edge)
1. Click install icon (⊕) in address bar
2. Confirm

## 🔄 Update Service Worker

```typescript
// In service-worker.js
const CACHE_VERSION = 'v2'; // Increment this

// Check for updates
setInterval(() => {
  registration.update();
}, 60000);

// Handle update found
registration.addEventListener('updatefound', () => {
  const newWorker = registration.installing;
  newWorker?.addEventListener('statechange', () => {
    if (newWorker.state === 'installed') {
      showUpdatePrompt(); // Show UI
    }
  });
});
```

## 🎯 Manifest.json Key Fields

```json
{
  "name": "Cinemart - Premier Bollywood Memorabilia Auctions",
  "short_name": "Cinemart",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0A0A0F",
  "background_color": "#0A0A0F",
  "icons": [{ "src": "/icons/icon-192x192.png", "sizes": "192x192" }]
}
```

## ✅ Pre-Deploy Checklist

- [ ] All icons generated (16px - 512px)
- [ ] Service worker registered
- [ ] Manifest linked in HTML
- [ ] HTTPS enabled
- [ ] Offline page exists
- [ ] Tested on Android
- [ ] Tested on iOS
- [ ] Tested on Desktop
- [ ] Lighthouse PWA 90+
- [ ] Install prompt works
- [ ] Update mechanism tested

## 📚 Full Documentation

- **Complete Guide:** `PWA-SUMMARY.md`
- **Technical Details:** `PWA-README.md`
- **Installation Help:** `/pwa-install-guide.html`
- **Live Testing:** `/pwa-implementation.html`
- **Icon Generator:** `/icon-generator.html`

## 🆘 Quick Debug

```javascript
// Check if PWA
console.log('PWA?', window.matchMedia('(display-mode: standalone)').matches);

// Check SW
navigator.serviceWorker.ready.then(reg => {
  console.log('SW:', reg.active?.state);
});

// Check manifest
fetch('/manifest.json').then(r => r.json()).then(console.log);

// Check cache
caches.keys().then(console.log);

// Check notification permission
console.log('Notifications:', Notification.permission);
```

---

**Need Help?** Open `/pwa-implementation.html` for live testing dashboard.

**Where Cinema Becomes Legacy** ✦ ✦ ✦
