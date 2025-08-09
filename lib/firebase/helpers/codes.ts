import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

type EventCode = {
  code: string
  expiresAt?: string
  maxParticipants?: number
}

export async function createEventCode(data: EventCode): Promise<void> {
  if (!data.code) throw new Error('Código requerido')
  const ref = doc(collection(db, 'sessionsMeta'), data.code)
  await setDoc(ref, data)
}

export async function listEventCodes(): Promise<EventCode[]> {
  const snap = await getDocs(collection(db, 'sessionsMeta'))
  return snap.docs.map((d) => d.data() as EventCode)
}


