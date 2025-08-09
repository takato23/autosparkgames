import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  onSnapshot,
  Timestamp,
  Unsubscribe,
  writeBatch,
  increment,
  arrayUnion,
  orderBy,
  limit as qLimit
} from 'firebase/firestore'
import { db } from '../config'
import { 
  Session, 
  SessionStatus, 
  SessionParticipant, 
  ParticipantResponse,
  SlideResponses,
  SessionSettings,
  Participant,
  Reaction
} from '@/lib/types'

// Generate a unique 6-digit code
function generateSessionCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Check if a session code is already in use
async function isCodeInUse(code: string): Promise<boolean> {
  const q = query(
    collection(db, 'sessions'),
    where('code', '==', code),
    where('status', 'in', [SessionStatus.WAITING, SessionStatus.ACTIVE])
  )
  const snapshot = await getDocs(q)
  return !snapshot.empty
}

// Generate a unique session code
async function generateUniqueSessionCode(): Promise<string> {
  let code = generateSessionCode()
  let attempts = 0
  
  while (await isCodeInUse(code) && attempts < 10) {
    code = generateSessionCode()
    attempts++
  }
  
  if (attempts >= 10) {
    throw new Error('Could not generate unique session code')
  }
  
  return code
}

// Create a new session
export async function createSession(
  presentationId: string,
  settings?: Partial<SessionSettings>
): Promise<string> {
  try {
    const code = await generateUniqueSessionCode()
    const sessionRef = doc(collection(db, 'sessions'))
    
    const defaultSettings: SessionSettings = {
      lockLateJoining: false,
      showParticipantCount: true,
      showLeaderboard: true,
      anonymousNicknames: true,
      ...settings
    }
    
    const sessionData: Omit<Session, 'id'> = {
      presentationId,
      code,
      status: SessionStatus.WAITING,
      currentSlideIndex: 0,
      startedAt: serverTimestamp() as Timestamp,
      participants: {},
      responses: {},
      settings: defaultSettings
    }
    
    await setDoc(sessionRef, sessionData)
    return sessionRef.id
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

// Get session by ID
export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const sessionDoc = await getDoc(doc(db, 'sessions', sessionId))
    if (sessionDoc.exists()) {
      return {
        id: sessionDoc.id,
        ...sessionDoc.data()
      } as Session
    }
    return null
  } catch (error) {
    console.error('Error getting session:', error)
    throw error
  }
}

// Get session by code
export async function getSessionByCode(code: string): Promise<Session | null> {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('code', '==', code),
      where('status', 'in', [SessionStatus.WAITING, SessionStatus.ACTIVE])
    )
    
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data()
      } as Session
    }
    return null
  } catch (error) {
    console.error('Error getting session by code:', error)
    throw error
  }
}

// Join a session
export async function joinSession(
  sessionId: string,
  participantData: {
    name: string
    email?: string
    userId?: string
  }
): Promise<string> {
  try {
    const participantId = participantData.userId || 
      `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const participant: SessionParticipant = {
      id: participantId,
      userId: participantData.userId,
      name: participantData.name,
      email: participantData.email,
      joinedAt: serverTimestamp() as Timestamp,
      lastActiveAt: serverTimestamp() as Timestamp,
      isActive: true,
      score: 0,
      responses: {}
    }
    
    // Add participant to session
    const sessionRef = doc(db, 'sessions', sessionId)
    await updateDoc(sessionRef, {
      [`participants.${participantId}`]: participant
    })
    
    // Create participant document for real-time data
    const participantDocData: Omit<Participant, 'id'> = {
      sessionId,
      userId: participantData.userId,
      name: participantData.name,
      email: participantData.email,
      reactions: [],
      connectionStatus: 'connected',
      lastPingAt: serverTimestamp() as Timestamp
    }
    
    await setDoc(doc(db, 'participants', participantId), participantDocData)
    
    return participantId
  } catch (error) {
    console.error('Error joining session:', error)
    throw error
  }
}

// Update session status
export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus
): Promise<void> {
  try {
    const updates: any = { status }
    
    if (status === SessionStatus.ENDED) {
      updates.endedAt = serverTimestamp()
    }
    
    await updateDoc(doc(db, 'sessions', sessionId), updates)
  } catch (error) {
    console.error('Error updating session status:', error)
    throw error
  }
}

// Move to next/previous slide
export async function changeSlide(
  sessionId: string,
  direction: 'next' | 'previous'
): Promise<void> {
  try {
    const sessionDoc = await getDoc(doc(db, 'sessions', sessionId))
    if (!sessionDoc.exists()) {
      throw new Error('Session not found')
    }
    
    const session = sessionDoc.data() as Session
    const currentIndex = session.currentSlideIndex
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, Number.MAX_SAFE_INTEGER)
      : Math.max(currentIndex - 1, 0)
    
    await updateDoc(doc(db, 'sessions', sessionId), {
      currentSlideIndex: newIndex,
      currentSlideId: undefined // Will be set by presenter based on presentation slides
    })
  } catch (error) {
    console.error('Error changing slide:', error)
    throw error
  }
}

// Submit a response
export async function submitResponse(
  sessionId: string,
  participantId: string,
  response: ParticipantResponse
): Promise<void> {
  try {
    const batch = writeBatch(db)
    
    // Update participant's responses
    const sessionRef = doc(db, 'sessions', sessionId)
    batch.update(sessionRef, {
      [`participants.${participantId}.responses.${response.slideId}`]: response,
      [`participants.${participantId}.lastActiveAt`]: serverTimestamp()
    })
    
    // Add to slide responses
    const slideResponsesPath = `responses.${response.slideId}`
    batch.update(sessionRef, {
      [`${slideResponsesPath}.slideId`]: response.slideId,
      [`${slideResponsesPath}.responseCount`]: increment(1),
      [`${slideResponsesPath}.responses`]: arrayUnion(response as unknown)
    })

    // Si hay puntos, actualizamos el score del participante
    const points = (response as unknown as { points?: number }).points ?? (response as unknown as { pointsEarned?: number }).pointsEarned
    if (typeof points === 'number' && points > 0) {
      batch.update(sessionRef, {
        [`participants.${participantId}.score`]: increment(points)
      })
    }

    await batch.commit()

    // Recalcular leaderboard de forma simple (lectura después del commit)
    try {
      const sessionDoc = await getDoc(sessionRef)
      if (sessionDoc.exists()) {
        const sessionData = sessionDoc.data() as any
        const participants = sessionData.participants || {}
        const leaderboard = Object.values(participants)
          .filter((p: any) => p && p.isActive !== false)
          .map((p: any) => ({
            name: p.name as string,
            score: Number(p.score) || 0,
            participantId: p.id as string | undefined
          }))
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 10)
          .map((entry: any, idx: number) => ({
            name: entry.name,
            score: entry.score,
            participantId: entry.participantId,
            rank: idx + 1
          }))

        await updateDoc(sessionRef, { leaderboard })
      }
    } catch (e) {
      console.error('[Service] error al recalcular leaderboard', e)
    }
  } catch (error) {
    console.error('Error submitting response:', error)
    throw error
  }
}

// Subscribe to session updates
export function subscribeToSession(
  sessionId: string,
  callback: (session: Session | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'sessions', sessionId),
    (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Session)
      } else {
        callback(null)
      }
    },
    (error) => {
      console.error('Error subscribing to session:', error)
      callback(null)
    }
  )
}

// Subscribe to participant updates
export function subscribeToParticipant(
  participantId: string,
  callback: (participant: Participant | null) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'participants', participantId),
    (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Participant)
      } else {
        callback(null)
      }
    },
    (error) => {
      console.error('Error subscribing to participant:', error)
      callback(null)
    }
  )
}

// Send a reaction
export async function sendReaction(
  participantId: string,
  reaction: Reaction
): Promise<void> {
  try {
    const participantRef = doc(db, 'participants', participantId)
    const participantDoc = await getDoc(participantRef)
    
    if (!participantDoc.exists()) {
      throw new Error('Participant not found')
    }
    
    const participant = participantDoc.data() as Participant
    const updatedReactions = [...participant.reactions, reaction]
    
    // Keep only last 50 reactions
    if (updatedReactions.length > 50) {
      updatedReactions.splice(0, updatedReactions.length - 50)
    }
    
    await updateDoc(participantRef, {
      reactions: updatedReactions,
      lastPingAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error sending reaction:', error)
    throw error
  }
}

// Update participant connection status
export async function updateParticipantConnection(
  participantId: string,
  status: Participant['connectionStatus']
): Promise<void> {
  try {
    await updateDoc(doc(db, 'participants', participantId), {
      connectionStatus: status,
      lastPingAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating participant connection:', error)
    throw error
  }
}

// Get session analytics
export async function getSessionAnalytics(sessionId: string): Promise<any> {
  try {
    const session = await getSession(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    
    const participantCount = Object.keys(session.participants).length
    const activeParticipants = Object.values(session.participants)
      .filter(p => p.isActive).length
    
    const responseRates: Record<string, number> = {}
    Object.entries(session.responses).forEach(([slideId, slideResponses]) => {
      responseRates[slideId] = slideResponses.responseCount / participantCount
    })
    
    return {
      sessionId,
      participantCount,
      activeParticipants,
      responseRates,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.endedAt 
        ? session.endedAt.toMillis() - session.startedAt.toMillis() 
        : null
    }
  } catch (error) {
    console.error('Error getting session analytics:', error)
    throw error
  }
}

// Lista simple de sesiones para métricas de admin
export async function listSessions(limitCount: number = 50): Promise<any[]> {
  const col = collection(db, 'sessions')
  const q = query(col, orderBy('startedAt', 'desc'), qLimit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Agregador mínimo desde un doc de sesión
export function getSessionAnalyticsFromDoc(s: any) {
  const participantCount = Array.isArray(s.participants)
    ? s.participants.length
    : (s.participants ? Object.keys(s.participants).length : 0)

  let avgResponseRate: number | null = null
  if (s.responses && participantCount > 0) {
    const perSlide: number[] = Object.values(s.responses).map((r: any) => {
      const rc = (r && typeof (r as any).responseCount === 'number') ? (r as any).responseCount as number : 0
      return Math.min(1, rc / participantCount)
    })
    avgResponseRate = perSlide.length > 0 ? (perSlide.reduce((a, b) => a + b, 0) / perSlide.length) : 0
  }

  const toMillis = (v: any) => {
    if (!v) return null
    if (typeof v?.toDate === 'function') return v.toDate().getTime()
    if (v instanceof Timestamp) return v.toMillis()
    if (v instanceof Date) return v.getTime()
    return null
  }
  const started = toMillis(s.startedAt)
  const ended = toMillis(s.endedAt)
  const durationMs = (started && ended) ? (ended - started) : null

  return {
    sessionId: s.id as string,
    code: (s.code as string) ?? null,
    participants: participantCount,
    avgResponseRate,
    durationMs
  }
}