import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config'
import { User } from '@/lib/types'

// Sign up a new user
export async function signUp(
  email: string, 
  password: string, 
  name: string, 
  role: User['role'] = 'participant'
): Promise<UserCredential> {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = userCredential
    
    // Update display name
    await updateProfile(user, { displayName: name })
    
    // Create user document in Firestore
    const userData: Omit<User, 'id'> = {
      email,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      presentations: []
    }
    
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return userCredential
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

// Sign out current user
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Get current user data from Firestore
export async function getCurrentUserData(user: FirebaseUser): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as User
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    throw error
  }
}

// Check if user has required role
export function hasRole(user: User | null, requiredRole: User['role']): boolean {
  if (!user) return false
  
  const roleHierarchy = {
    admin: 3,
    presenter: 2,
    participant: 1
  }
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

// Format Firebase auth errors for display
export function formatAuthError(error: any): string {
  const errorCode = error?.code || ''
  
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/missing-password': 'Please enter a password.',
  }
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.'
}