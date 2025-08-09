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
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '../config'
import type { Presentation, Slide, PresentationSettings } from '@/lib/types/presentation'

// Create a new presentation
export async function createPresentation(
  userId: string,
  title: string,
  description?: string
): Promise<string> {
  try {
    const presentationRef = doc(collection(db, 'presentations'))
    
    const defaultSettings: PresentationSettings = {
      allowAnonymous: true,
      requireEmail: false,
      showResults: true,
      allowSkip: true,
      randomizeQuestions: false,
      showCorrectAnswers: true
    }
    
    const presentationData: Omit<Presentation, 'id'> = {
      title,
      description,
      userId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      slides: [],
      settings: defaultSettings,
      status: 'draft'
    }
    
    await setDoc(presentationRef, presentationData)
    
    // Update user's presentations array
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      const presentations = userDoc.data().presentations || []
      await updateDoc(userRef, {
        presentations: [...presentations, presentationRef.id]
      })
    }
    
    return presentationRef.id
  } catch (error) {
    console.error('Error creating presentation:', error)
    throw error
  }
}

// Get a presentation by ID
export async function getPresentation(presentationId: string): Promise<Presentation | null> {
  try {
    const presentationDoc = await getDoc(doc(db, 'presentations', presentationId))
    if (presentationDoc.exists()) {
      return {
        id: presentationDoc.id,
        ...presentationDoc.data()
      } as Presentation
    }
    return null
  } catch (error) {
    console.error('Error getting presentation:', error)
    throw error
  }
}

// Get all presentations for a user
export async function getUserPresentations(
  userId: string,
  limitCount: number = 50
): Promise<Presentation[]> {
  try {
    const q = query(
      collection(db, 'presentations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const presentations: Presentation[] = []
    
    querySnapshot.forEach((doc) => {
      presentations.push({
        id: doc.id,
        ...doc.data()
      } as Presentation)
    })
    
    return presentations
  } catch (error: any) {
    const msg = String(error?.message || '')
    if (msg.includes('The query requires an index')) {
      // La UI mostrará banner con el link del índice
      throw error
    }
    console.error('[getUserPresentations]', error)
    throw error
  }
}

// Update presentation
export async function updatePresentation(
  presentationId: string,
  updates: Partial<Presentation>
): Promise<void> {
  try {
    const presentationRef = doc(db, 'presentations', presentationId)
    await updateDoc(presentationRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating presentation:', error)
    throw error
  }
}

// Delete presentation
export async function deletePresentation(
  presentationId: string,
  userId: string
): Promise<void> {
  try {
    const batch = writeBatch(db)
    
    // Delete presentation
    batch.delete(doc(db, 'presentations', presentationId))
    
    // Remove from user's presentations array
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      const presentations = userDoc.data().presentations || []
      const updatedPresentations = presentations.filter((id: string) => id !== presentationId)
      batch.update(userRef, { presentations: updatedPresentations })
    }
    
    await batch.commit()
  } catch (error) {
    console.error('Error deleting presentation:', error)
    throw error
  }
}

// Add slide to presentation
export async function addSlide(
  presentationId: string,
  slide: Omit<Slide, 'id' | 'order'>
): Promise<void> {
  try {
    const presentationRef = doc(db, 'presentations', presentationId)
    const presentationDoc = await getDoc(presentationRef)
    
    if (!presentationDoc.exists()) {
      throw new Error('Presentation not found')
    }
    
    const presentation = presentationDoc.data() as Presentation
    const newSlide: Slide = {
      ...slide,
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: presentation.slides.length
    } as Slide
    
    await updateDoc(presentationRef, {
      slides: [...presentation.slides, newSlide],
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error adding slide:', error)
    throw error
  }
}

// Update slide in presentation
export async function updateSlide(
  presentationId: string,
  slideId: string,
  updates: Partial<Slide>
): Promise<void> {
  try {
    const presentationRef = doc(db, 'presentations', presentationId)
    const presentationDoc = await getDoc(presentationRef)
    
    if (!presentationDoc.exists()) {
      throw new Error('Presentation not found')
    }
    
    const presentation = presentationDoc.data() as Presentation
    const updatedSlides = presentation.slides.map(slide => 
      slide.id === slideId ? { ...slide, ...updates } : slide
    )
    
    await updateDoc(presentationRef, {
      slides: updatedSlides,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating slide:', error)
    throw error
  }
}

// Delete slide from presentation
export async function deleteSlide(
  presentationId: string,
  slideId: string
): Promise<void> {
  try {
    const presentationRef = doc(db, 'presentations', presentationId)
    const presentationDoc = await getDoc(presentationRef)
    
    if (!presentationDoc.exists()) {
      throw new Error('Presentation not found')
    }
    
    const presentation = presentationDoc.data() as Presentation
    const filteredSlides = presentation.slides
      .filter(slide => slide.id !== slideId)
      .map((slide, index) => ({ ...slide, order: index })) // Reorder slides
    
    await updateDoc(presentationRef, {
      slides: filteredSlides,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error deleting slide:', error)
    throw error
  }
}

// Reorder slides in presentation
export async function reorderSlides(
  presentationId: string,
  slideIds: string[]
): Promise<void> {
  try {
    const presentationRef = doc(db, 'presentations', presentationId)
    const presentationDoc = await getDoc(presentationRef)
    
    if (!presentationDoc.exists()) {
      throw new Error('Presentation not found')
    }
    
    const presentation = presentationDoc.data() as Presentation
    const slideMap = new Map(presentation.slides.map(slide => [slide.id, slide]))
    
    const reorderedSlides = slideIds
      .map((id, index) => {
        const slide = slideMap.get(id)
        if (!slide) throw new Error(`Slide ${id} not found`)
        return { ...slide, order: index }
      })
    
    await updateDoc(presentationRef, {
      slides: reorderedSlides,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error reordering slides:', error)
    throw error
  }
}