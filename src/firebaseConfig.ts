import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// TODO: Replace with your actual Firebase configuration from Firebase Console
// Go to: Project Settings > Your apps > Web > Copy config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'arc-raiders-companion',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Services
const auth = getAuth(app)
const firestore = getFirestore(app)
const functions = getFunctions(app)
const googleProvider = new GoogleAuthProvider()

// Note: Emulators can be started with `npm run dev:emulators`
// To enable emulator connection, uncomment below:
/*
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
    console.log('✓ Connected to Firebase Emulators')
  } catch (error) {
    console.log('✓ Using production Firebase')
  }
}
*/

export { app, auth, firestore, functions, googleProvider }
