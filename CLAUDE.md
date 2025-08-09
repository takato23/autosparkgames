# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📁 Documentation Structure

Key documentation files are located in the `docs/` directory:
- **ARCHITECTURE.md** - Complete file structure and data flows
- **FEATURES.md** - Feature roadmap and completion status
- **API.md** - WebSocket and REST API documentation
- **DEVELOPMENT_GUIDE.md** - Development workflow and best practices

## Development Commands

### Running the Application
```bash
# Start both Next.js and WebSocket server (default on port 3004)
npm run dev

# Start only Next.js (without WebSocket)
npm run dev:next

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

### Core Application Structure

This is an interactive presentation and gaming platform with three main user roles:

1. **Participant** - Join and interact with live presentations/games
2. **Presenter** - Create and manage interactive content
3. **Admin** - System management and analytics

### Technology Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, React 18
- **Styling**: Custom design system in `lib/design-system/` with Tailwind CSS
- **State Management**: Zustand stores in `lib/store/`
- **Real-time**: Socket.io WebSocket server in `server/websocket.js`
- **Database**: Firebase (Firestore, Auth, Storage)
- **UI Components**: Custom components + Shadcn/ui in `components/ui/`
- **Animations**: Framer Motion

### Key Architectural Patterns

#### Design System (`lib/design-system/`)
- **Tokens**: Design tokens for colors, spacing, typography, animations, shadows, radius
- **Components**: Accessible, reusable components (Button, Card, Input, Badge, Tooltip)
- **Hooks**: Custom hooks for accessibility and keyboard shortcuts

#### State Management (`lib/store/`)
- **presenter.ts**: Manages presentations, sessions, participants, and responses
- **ui.ts**: UI preferences, theme, layout, and onboarding state
- Uses Zustand with persistence and devtools

#### Real-time Features
- WebSocket server runs on same port as Next.js (3004)
- Handles session creation, participant joining, live voting, and real-time updates
- In-memory game state management

### Route Structure
```
/                       # Landing page
/auth/*                 # Authentication flows
/presenter/*            # Presenter dashboard and tools
  /presenter            # Main dashboard
  /presenter/new        # Create presentation
  /presenter/edit/[id]  # Edit presentation
  /presenter/session/*  # Live session control
  /presenter/templates  # Template gallery
/participant/*          # Participant interface
/admin/*                # Admin portal
/join                   # Join session page
/session/[code]         # Active session view
```

### Firebase Configuration
Requires both client and admin SDK configurations in `.env.local`:
- Client SDK: `NEXT_PUBLIC_FIREBASE_*` variables
- Admin SDK: `FIREBASE_*` variables (server-side only)

### Key Features Implementation

#### Auto-save System (`lib/hooks/useAutoSave.ts`)
- Automatic save every 30 seconds
- Version history (last 10 versions)
- Unsaved changes warning
- Version restoration

#### Command Palette
- Activated with Cmd+K
- Quick navigation and actions
- Context-aware suggestions

#### Live Preview
- Real-time preview while editing
- Presenter/audience view toggle
- Slide navigation

### WebSocket Events
Key events handled by the WebSocket server:
- `create-session`: Initialize new session
- `join-session`: Participant joins
- `next-slide`/`previous-slide`: Navigation
- `submit-answer`: Response handling
- `send-reaction`: Real-time reactions

### Content Types
- **Slides**: multiple-choice, poll, word-cloud, open-text, rating, qa, title
- **Games**: bingo, pictionary, question-race, team-challenge, word-puzzle, memory-game

### Testing Approach
Currently no test files present. When adding tests:
- Use Jest and React Testing Library
- Focus on component behavior and user interactions
- Test critical flows: session creation, joining, voting