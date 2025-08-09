# AudienceSpark Participant Flow Implementation

This document describes the participant flow implementation for AudienceSpark.

## Implemented Features

### 1. Join Page (`/join`)
- **Mobile-optimized design** with responsive layout
- **6-digit code input** with automatic formatting and validation
- **QR code scanner** using react-qr-scanner (camera permission required)
- **Privacy consent modal** that appears before joining a session
- **Name input** for participant identification
- **Error handling** for invalid codes and connection issues

### 2. Session View (`/session/[code]`)
- **Real-time sync** with presenter using Firebase Firestore subscriptions
- **Multiple slide types supported:**
  - Multiple Choice questions
  - Word Cloud responses
  - Poll questions
  - Open Text responses
  - Rating scales (including star ratings)
  - Q&A submissions
  - Title slides
- **Response submission** with validation and confirmation
- **Connection status indicator** showing online/offline state
- **Session persistence** using sessionStorage

### 3. Reaction Toolbar
- **Emoji reactions:** 👏 (Clap), ❤️ (Love), 🔥 (Fire), 😂 (Laugh)
- **Floating animations** using Framer Motion
- **Real-time sync** - reactions are sent to Firebase for presenter display
- **Mobile-friendly** touch interactions

## Technical Implementation

### Technologies Used
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Firebase Firestore** for real-time data sync
- **react-qr-scanner** for QR code scanning

### Key Components
1. **Join Page** (`/app/join/page.tsx`)
   - Handles session discovery and joining
   - Privacy consent workflow
   - QR code scanning capability

2. **Session Page** (`/app/session/[code]/page.tsx`)
   - Real-time session synchronization
   - Dynamic slide rendering based on type
   - Response submission handling

3. **Slide Components** (`/components/slides/`)
   - Individual components for each slide type
   - Consistent UI/UX across all slide types
   - Response validation and submission

4. **Reaction Toolbar** (`/components/participant/ReactionToolbar.tsx`)
   - Floating emoji animations
   - Touch-optimized interaction

### Firebase Integration
- **Session Management**: Join sessions, track participants
- **Real-time Updates**: Subscribe to slide changes and session status
- **Response Submission**: Submit and store participant responses
- **Reaction System**: Send and sync emoji reactions

## Usage Flow

1. **Joining a Session:**
   - Navigate to `/join`
   - Enter 6-digit code OR scan QR code
   - Accept privacy policy
   - Enter your name
   - Join the session

2. **During the Session:**
   - View current slide content
   - Submit responses based on slide type
   - Send emoji reactions
   - See confirmation after submission
   - Wait for next slide

3. **Connection Handling:**
   - Automatic reconnection on network issues
   - Connection status indicator
   - Persistent session data

## Mobile Optimization
- Touch-friendly buttons and inputs
- Responsive layouts for all screen sizes
- Optimized animations for mobile performance
- Camera access for QR scanning on mobile devices

## Security Considerations
- Session codes are validated server-side
- Participant IDs are generated securely
- Privacy consent required before joining
- Anonymous participation supported (no email required)

## Future Enhancements
- Offline support with data sync
- Push notifications for session updates
- Participant leaderboards
- More reaction types
- Session history for participants