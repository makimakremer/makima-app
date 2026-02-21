# Makima — PWA Voice Chat App

## Overview
Makima is a premium PWA voice-chat client that connects to an **OpenClaw Gateway** for AI conversations. It supports text chat, voice input (STT via Whisper), and voice output (TTS via Piper). The design is dark, modern, and branded with Makima's orange identity.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 3+
- **PWA:** next-pwa or manual service worker + manifest.json
- **Markdown:** react-markdown + remark-gfm + rehype-highlight
- **Audio:** Web Audio API / MediaRecorder API
- **Storage:** localStorage with AES encryption (crypto-js)

## Design Tokens
```css
:root {
  --color-primary: #ff914d;
  --color-primary-hover: #ff7a2e;
  --color-bg-dark: #0d0d0d;
  --color-bg-card: #1a1a1a;
  --color-bg-input: #252525;
  --color-bg-light: #ffffff;
  --color-text-primary: #f0f0f0;
  --color-text-secondary: #888888;
  --color-text-light: #1a1a1a;
  --color-border: #2a2a2a;
  --color-success: #4ade80;
  --color-error: #f87171;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --font-family: 'Inter', system-ui, sans-serif;
}
```

## File Structure
```
makima-app/
├── public/
│   ├── manifest.json
│   ├── sw.js                    # Service Worker
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── makima-avatar.png    # Makima chat avatar
│   └── sounds/
│       └── send.mp3             # Optional send sound
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, theme provider, metadata)
│   │   ├── page.tsx             # Redirect to /chat
│   │   ├── chat/
│   │   │   └── page.tsx         # Main chat page
│   │   └── settings/
│   │       └── page.tsx         # Settings page
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatView.tsx        # Main chat container
│   │   │   ├── MessageBubble.tsx   # Single message (markdown, copy button)
│   │   │   ├── MessageInput.tsx    # Text input + send button
│   │   │   ├── VoiceButton.tsx     # Hold-to-record / tap-toggle mic button
│   │   │   ├── TypingIndicator.tsx # "Makima denkt..." animation
│   │   │   └── ChatHeader.tsx      # Makima avatar + name + online status
│   │   ├── Settings/
│   │   │   ├── SettingsView.tsx
│   │   │   ├── ConnectionSettings.tsx  # Gateway URL + Token
│   │   │   ├── AudioSettings.tsx       # TTS toggle, mic selection
│   │   │   └── ThemeSettings.tsx       # Dark/Light toggle
│   │   ├── Layout/
│   │   │   ├── BottomNav.tsx       # Mobile bottom navigation
│   │   │   ├── Sidebar.tsx         # Desktop sidebar
│   │   │   └── AppShell.tsx        # Responsive shell (sidebar on desktop, bottom nav on mobile)
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Toggle.tsx
│   │       └── Avatar.tsx
│   ├── hooks/
│   │   ├── useChat.ts            # Chat state management
│   │   ├── useVoiceRecorder.ts   # MediaRecorder hook
│   │   ├── useTTS.ts             # Text-to-speech playback hook
│   │   ├── useSTT.ts             # Speech-to-text hook
│   │   ├── useOpenClaw.ts        # OpenClaw API communication
│   │   ├── useSettings.ts        # Encrypted settings read/write
│   │   └── useAutoScroll.ts      # Auto-scroll to bottom
│   ├── lib/
│   │   ├── api.ts                # OpenClaw API client
│   │   ├── crypto.ts             # AES encrypt/decrypt for localStorage
│   │   ├── storage.ts            # Typed localStorage wrapper
│   │   └── constants.ts          # App constants
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── styles/
│       └── globals.css           # Tailwind base + custom styles
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## API Contracts

### OpenClaw Gateway API
**Base URL:** Configured by user in Settings (e.g. `https://gateway.example.com`)
**Auth:** Bearer token in `Authorization` header

#### Send Message
```
POST {gatewayUrl}/api/v1/chat
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Request:
{
  "message": "Hallo Makima!",
  "session_id": "optional-session-id"
}

Response (streaming or JSON):
{
  "response": "Hallo! Wie kann ich dir helfen?",
  "session_id": "abc123"
}
```

> **Note:** Check https://docs.openclaw.ai for the exact API contract. The gateway may support SSE streaming — implement streaming support if available.

### TTS Endpoint (Piper)
```
POST http://localhost:8787/tts
Content-Type: application/json

Request:
{
  "text": "Hallo, wie geht es dir?"
}

Response:
  Content-Type: audio/wav
  Body: WAV audio binary
```

### STT Endpoint (Whisper)
```
POST http://localhost:8788/transcribe
Content-Type: multipart/form-data

Form field: "audio" — WAV or WebM audio file

Response:
{
  "text": "Der transkribierte Text",
  "language": "de"
}
```

## Feature Specifications

### 1. Chat Interface
- Messages displayed in bubble style: user (right, orange bg), Makima (left, dark card bg)
- Makima messages show avatar on left
- Markdown rendering: **bold**, *italic*, `code`, ```code blocks``` with syntax highlighting, lists, links (clickable, open in new tab)
- Copy button on each message (copies text content)
- Auto-scroll to newest message; stop auto-scroll when user scrolls up; resume when scrolled to bottom
- Session persistence: messages stored in memory only (cleared on app close for security)

### 2. Voice Recording
- **Primary mode:** Hold-to-record (press and hold mic button, release to send)
- **Secondary mode:** Tap-toggle (tap to start, tap again to stop and send)
- User can switch mode in Settings
- Visual feedback: pulsing red ring while recording, duration counter
- Audio format: WebM/Opus or WAV (MediaRecorder API)
- Flow: Record → send audio to STT endpoint → get text → send text to OpenClaw → get response → optionally play via TTS

### 3. TTS Playback
- Toggle in Settings (default: ON)
- When enabled, every Makima response is sent to TTS endpoint
- Audio plays inline using Web Audio API or `<audio>` element
- Small speaker icon on each Makima message to replay audio
- Visual indicator while audio is playing

### 4. Connection & Auth
- Settings page with:
  - Gateway URL input (validated)
  - API Token input (password field)
  - "Test Connection" button
  - Connection status indicator (green/red dot)
- Token encrypted with AES before storing in localStorage (use a device-derived key or static key)
- Auto-reconnect: if a request fails, retry 3x with exponential backoff, show "Verbindung verloren..." banner

### 5. UI Components

#### ChatHeader
- Makima avatar (circular, 40px)
- Name: "Makima"
- Status dot: green (connected) / red (disconnected)
- Subtitle: "Online" / "Offline"

#### MessageInput
- Full-width text input with rounded corners
- Send button (arrow icon) on right, orange when text is present
- Mic button on right (replaces send when input is empty)
- Shift+Enter for newline, Enter to send

#### BottomNav (Mobile)
- Two tabs: Chat (chat bubble icon), Settings (gear icon)
- Active tab highlighted with orange

#### Sidebar (Desktop, >768px)
- Left sidebar, 60px wide, icon-only
- Same tabs as bottom nav
- Makima logo/avatar at top

### 6. PWA Configuration

#### manifest.json
```json
{
  "name": "Makima",
  "short_name": "Makima",
  "description": "Your personal AI voice assistant",
  "start_url": "/chat",
  "display": "standalone",
  "background_color": "#0d0d0d",
  "theme_color": "#ff914d",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

#### Service Worker
- Cache app shell and static assets
- Network-first for API calls
- Offline page: "Makima ist gerade nicht erreichbar"

### 7. Responsive Design
- **Mobile (< 768px):** Full-screen chat, bottom nav, no sidebar
- **Tablet (768px–1024px):** Same as mobile but wider message bubbles
- **Desktop (> 1024px):** Sidebar on left, chat in center (max-width 800px, centered)

### 8. Theme
- **Dark mode (default):** `--color-bg-dark` background, light text
- **Light mode:** White background, dark text
- Toggle in Settings, persisted in localStorage
- System preference detection on first visit

## Implementation Notes

### State Management
- Use React Context or Zustand for:
  - `messages: Message[]`
  - `isConnected: boolean`
  - `isRecording: boolean`
  - `isThinking: boolean` (typing indicator)
  - `settings: Settings`

### Message Type
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  audioUrl?: string; // TTS audio blob URL
}

interface Settings {
  gatewayUrl: string;
  apiToken: string; // encrypted
  ttsEnabled: boolean;
  voiceMode: 'hold' | 'toggle';
  theme: 'dark' | 'light' | 'system';
  micDeviceId?: string;
}
```

### Security
- API token AES-encrypted in localStorage
- No messages persisted to disk/localStorage
- Clear audio blob URLs on unmount (URL.revokeObjectURL)
- CSP headers configured in next.config.ts

### Error Handling
- Network errors → toast notification + retry
- TTS/STT endpoint errors → graceful fallback (show text only)
- Invalid token → redirect to Settings with error message

## Getting Started
```bash
npx create-next-app@latest makima-app --typescript --tailwind --app --src-dir
cd makima-app
npm install react-markdown remark-gfm rehype-highlight crypto-js
npm install -D @types/crypto-js
```

## Priority Order
1. Basic chat UI (text send/receive with OpenClaw)
2. Settings page (connection config)
3. Markdown rendering
4. Voice recording + STT
5. TTS playback
6. PWA (manifest, service worker)
7. Polish (animations, sounds, theme toggle)
