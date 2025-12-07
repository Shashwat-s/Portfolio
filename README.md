# AI Portfolio

An immersive, voice-controlled portfolio website featuring an interactive 3D particle sphere that responds to speech and mouse movement.

![Particle Sphere Demo](/Users/shashwatsharma/.gemini/antigravity/brain/a6208022-e13b-47e0-ba6e-b25be59c8184/improved_particles_1765033065856.png)

## Features

- **3D Particle Sphere** - 12,000 particles in a galaxy-like formation using Three.js
- **Voice Control** - Navigate and ask questions using natural voice commands
- **AI Conversations** - Talk to "AI Shashwat" about projects, education, and experience
- **Reactive Particles** - Particles respond to mouse movement and pulse when AI speaks
- **Smooth Animations** - Framer Motion transitions for content overlays

## Tech Stack

**Frontend:**
- React + TypeScript (Vite)
- Three.js / React Three Fiber
- TailwindCSS
- Framer Motion
- Web Speech API

**Backend:**
- Node.js + Express
- Google Cloud Vertex AI
- Firebase Firestore

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- GCP account with Vertex AI enabled (optional for AI features)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/ai-portfolio.git
cd ai-portfolio

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Run development servers
npm run dev
```

### Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Description |
|----------|-------------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON |
| `FIREBASE_PROJECT_ID` | Firebase project for data storage |

## Project Structure

```
ai-portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # ParticleSphere, VoiceController
│   │   ├── features/       # home, projects, education, chat
│   │   └── store/          # Zustand state management
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Firebase, Vertex AI setup
│   │   ├── routes/         # API endpoints
│   │   └── services/       # RAG, embeddings
└── shared/                 # Shared TypeScript types
```

## Voice Commands

| Command | Action |
|---------|--------|
| "Show projects" | Display projects overlay |
| "Tell me about your education" | Show education timeline |
| "Go back" | Return to previous view |
| "Go home" | Return to particle sphere |
| Ask any question | AI responds about portfolio |

## Development

```bash
# Run frontend only
npm run dev:client

# Run backend only  
npm run dev:server

# Run both
npm run dev
```

## Deployment

The app is designed for:
- **Frontend**: Vercel, Netlify, or Firebase Hosting
- **Backend**: Google Cloud Run

## License

MIT
