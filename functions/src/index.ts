import { initializeApp } from 'firebase-admin/app'

// Initialize the Firebase Admin SDK
initializeApp()

// Export all functions from their respective files
export * from './auth'
export * from './callable'
export * from './triggers'
export * from './scheduled'
