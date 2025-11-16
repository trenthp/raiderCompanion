import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'

// Simple profanity filter - extend this as needed
const profanityList = ['badword1', 'badword2']

/**
 * A Firestore trigger that runs whenever a new document is created
 * in the `communityComments` collection.
 *
 * 1. Reads the text content of the new comment.
 * 2. (Future) Passes it through a sanitization/moderation filter.
 * 3. (Future) If it fails, updates the document (e.g., deletes or flags for review).
 */
export const onCommentPosted = onDocumentCreated(
  '/communityComments/{commentId}',
  async (event) => {
    const snapshot = event.data
    if (!snapshot) {
      logger.info('No data associated with the event.')
      return
    }

    const data = snapshot.data()
    const text = data.text || ''

    logger.info(`New comment posted (ID: ${snapshot.id}), checking for profanity...`)

    // --- STUBBED LOGIC FOR MODERATION ---
    const containsProfanity = profanityList.some((word) =>
      text.toLowerCase().includes(word)
    )

    if (containsProfanity) {
      logger.warn(`Profanity detected in comment ${snapshot.id}. Flagging...`)
      try {
        const db = getFirestore()
        await db.collection('communityComments').doc(snapshot.id).update({
          isModerated: true,
          text: '[This comment was removed due to community guidelines]',
          moderatedAt: new Date().toISOString(),
        })
      } catch (error) {
        logger.error(`Failed to moderate comment ${snapshot.id}:`, error)
      }
    } else {
      logger.info(`Comment ${snapshot.id} is clean.`)
    }
    // --- END STUBBED LOGIC ---
  }
)
