/**
 * User data types - private, owner-only collections
 */

/**
 * Interface for a document in the /users/{userID}/userStash collection.
 * Document ID is the ItemID.
 */
export interface UserStashItem {
  quantity: number
  addedAt?: string
}

/**
 * Interface for a document in the /users/{userID}/userLearnedBlueprints collection.
 * Document ID is the RecipeID.
 */
export interface UserLearnedBlueprint {
  learnedAt: string // ISO timestamp
}

/**
 * Interface for a document in the /users/{userID}/userTrackedGoals collection.
 */
export interface TrackedGoal {
  id: string // Document ID
  type: 'ITEM' | 'RECIPE' | 'UPGRADE'
  targetId: string // The ID of the item, recipe, or upgrade being tracked
  targetName: string // Denormalized for easy display
  targetQuantity: number

  // This value would be updated by a scheduled function that
  // cross-references the goal with the user's stash.
  currentQuantity: number

  createdAt?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'
}

/**
 * Interface for a document in the /users/{userID}/userLoadouts collection.
 */
export interface UserLoadout {
  id: string // Document ID
  name: string
  description: string
  isPublic: boolean // If true, a copy is also in /communityLoadouts
  createdAt: string
  updatedAt?: string

  // Refs to GameItem IDs
  weapon1: string
  weapon2: string
  helmet: string
  chest: string
  legs: string
  gloves: string
  trinket1: string
  trinket2: string

  notes?: string
}

/**
 * Interface for a document in the /users collection.
 */
export interface UserProfile {
  uid: string
  username: string
  joinDate: string
  email?: string
  displayName?: string
  photoURL?: string
}

/**
 * OCR Correction entry - user feedback on unrecognized items
 * Stored in /users/{userID}/ocrCorrections
 */
export interface OCRCorrection {
  id: string
  originalText: string // What OCR detected
  correctedItemId: string // What the user corrected it to
  confidence: number // User confidence (0-1)
  timestamp: string
  approved?: boolean // For future moderation
}

/**
 * Parsed item from OCR processing
 */
export interface ParsedOCRItem {
  text: string // Original OCR text
  quantity: number
  matchedItemId?: string // If fuzzy-matched
  confidence: number // 0-1 confidence score
  requiresManualConfirmation: boolean
}
