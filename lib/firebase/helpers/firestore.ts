import { 
  DocumentData,
  QueryConstraint,
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  FirestoreError
} from 'firebase/firestore'
import { db } from '../config'

// Generic error handler for Firestore operations
export function handleFirestoreError(error: unknown): never {
  if (error instanceof FirestoreError) {
    switch (error.code) {
      case 'permission-denied':
        throw new Error('You do not have permission to perform this action.')
      case 'not-found':
        throw new Error('The requested document was not found.')
      case 'already-exists':
        throw new Error('A document with this ID already exists.')
      case 'resource-exhausted':
        throw new Error('Too many requests. Please try again later.')
      case 'failed-precondition':
        throw new Error('Operation failed due to a precondition.')
      case 'aborted':
        throw new Error('Operation was aborted. Please try again.')
      case 'out-of-range':
        throw new Error('Operation was attempted past the valid range.')
      case 'unimplemented':
        throw new Error('This operation is not implemented or supported.')
      case 'internal':
        throw new Error('Internal server error. Please try again later.')
      case 'unavailable':
        throw new Error('Service is currently unavailable. Please try again later.')
      case 'data-loss':
        throw new Error('Unrecoverable data loss or corruption.')
      case 'unauthenticated':
        throw new Error('You must be authenticated to perform this action.')
      default:
        throw new Error(`Firestore error: ${error.message}`)
    }
  }
  throw error
}

// Safe document getter with error handling
export async function safeGetDoc<T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data() as DocumentData
      return ({ id: docSnap.id, ...data } as unknown) as T
    }
    return null
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Safe query executor with error handling
export async function safeQuery<T extends DocumentData>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...queryConstraints)
    const querySnapshot = await getDocs(q)
    
    const results: T[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData
      results.push(({ id: doc.id, ...data } as unknown) as T)
    })
    
    return results
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Safe document setter with error handling
export async function safeSetDoc<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = false
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge })
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Safe document updater with error handling
export async function safeUpdateDoc(
  collectionName: string,
  docId: string,
  updates: Partial<DocumentData>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Safe document deleter with error handling
export async function safeDeleteDoc(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, docId))
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Batch operations wrapper
export async function safeBatchOperation(
  operations: (batch: ReturnType<typeof writeBatch>) => void
): Promise<void> {
  try {
    const batch = writeBatch(db)
    operations(batch)
    await batch.commit()
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Check if document exists
export async function documentExists(
  collectionName: string,
  docId: string
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists()
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Get multiple documents by IDs
export async function getMultipleDocuments<T extends DocumentData>(
  collectionName: string,
  docIds: string[]
): Promise<(T | null)[]> {
  try {
    const promises = docIds.map(id => safeGetDoc<T>(collectionName, id))
    return await Promise.all(promises)
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Paginated query helper
export async function paginatedQuery<T extends DocumentData>(
  collectionName: string,
  pageSize: number,
  lastDoc?: DocumentData,
  ...queryConstraints: QueryConstraint[]
): Promise<{
  data: T[]
  hasMore: boolean
  lastDoc?: DocumentData
}> {
  try {
    const constraints = [...queryConstraints]
    
    // Add pagination constraints
    if (lastDoc) {
      constraints.push(startAfter(lastDoc))
    }
    constraints.push(limit(pageSize + 1))
    
    const results = await safeQuery<T>(collectionName, ...constraints)
    
    const hasMore = results.length > pageSize
    if (hasMore) {
      results.pop() // Remove the extra document
    }
    
    return {
      data: results,
      hasMore,
      lastDoc: results[results.length - 1]
    }
  } catch (error) {
    handleFirestoreError(error)
  }
}

// Import required functions
import { startAfter, limit } from 'firebase/firestore'