# Makima Voice AI PWA 🔗

Premium Dark iOS-Style Voice Chat PWA — eine moderne Next.js App mit Voice-Recording-Funktionalität.

## ✨ Features

- **Premium Dark iOS Design** — Moderne, elegante UI im Apple-Stil
- **Voice Recording** — Hold-to-Record Funktionalität mit Waveform-Visualisierung
- **PWA-Ready** — Kann als App auf dem Homescreen installiert werden
- **TypeScript Strict** — Volle TypeScript-Unterstützung ohne Fehler
- **Mobile-First** — Optimiert für iPhone Safari mit Safe-Area-Support
- **Responsive Chat UI** — Message Bubbles, Typing Indicator, Auto-Scroll

## 🚀 Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## 🔧 Technologie-Stack

- **Next.js 16** (App Router)
- **TypeScript** (Strict Mode)
- **Tailwind CSS** (Utility-First Styling)
- **MediaRecorder API** (Voice Recording)
- **PWA** (Progressive Web App)

## 📱 PWA Installation

### iOS (Safari)
1. Öffne die App im Browser
2. Tippe auf das Share-Icon
3. Wähle "Zum Home-Bildschirm"

### Android (Chrome)
1. Öffne die App im Browser
2. Tippe auf das Menü (⋮)
3. Wähle "App installieren"

## 🎨 Design

### Farbschema
- Background: `#0a0a0a`
- Surface: `#1a1a1a`
- Accent: `#ff914d` (Orange)
- Text: `#ffffff`

### Komponenten
- **Header** — Status-Anzeige und Logo
- **ChatView** — Scrollbarer Message-Container
- **MessageBubble** — User/Makima Nachrichten mit Timestamps
- **TypingIndicator** — Animierte Dots während Antwort
- **InputBar** — Text-Input + Voice-Button + Send-Button
- **VoiceButton** — Hold-to-Record mit pulsierender Animation
- **RecordingBanner** — Live-Recording-Anzeige mit Timer und Waveform

## 🔗 API Routes

### `/api/chat` (POST)
Sendet Text-Nachricht und erhält Antwort.

```typescript
// Request
{ message: string }

// Response
{ reply: string }
```

### `/api/voice` (POST)
Sendet Voice-Recording (FormData mit Audio-Blob).

```typescript
// Response
{
  transcript: string,
  reply: string
}
```

**Hinweis:** Aktuell Mock-Responses für MVP. Integration mit OpenClaw oder einem Voice-API-Provider steht noch aus.

## 📦 Build

```bash
# Production Build
npm run build

# Production Start
npm start
```

## 🌐 GitHub Pages Export (Optional)

Für statisches Hosting:

1. `next.config.ts` anpassen:
```typescript
const nextConfig = {
  output: 'export',
  basePath: '/makima-app',
  images: { unoptimized: true },
};
```

2. Build:
```bash
npm run build
```

3. Deploy `out/` Verzeichnis zu GitHub Pages.

## 📄 Lizenz

MIT

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
