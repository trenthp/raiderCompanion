import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'

/**
 * A callable function to process a base64 encoded image of a user's stash.
 *
 * 1. Receives the image from the client.
 * 2. (Future) Sends to Firebase ML Kit Vision API for Text Recognition (OCR).
 * 3. (Future) Receives raw text blocks.
 * 4. (Future) Parses text to identify item names and quantities.
 * 5. (Future) Batch-writes the recognized items to the user's private /userStash collection.
 *
 * NOTE: OCR is handled client-side using Tesseract.js for privacy and cost reasons.
 * This function can be used for future server-side processing if needed.
 */
export const processStashImage = onCall(async (request) => {
  const { imageBase64, parsedItems } = request.data
  const uid = request.auth?.uid

  if (!uid) {
    throw new HttpsError(
      'unauthenticated',
      'You must be logged in to process a stash image.'
    )
  }

  if (!imageBase64 && !parsedItems) {
    throw new HttpsError(
      'invalid-argument',
      'The function must be called with either "imageBase64" or "parsedItems" argument.'
    )
  }

  logger.info(`Received stash image from user ${uid} for processing.`)

  // --- STUBBED LOGIC FOR ML KIT OCR ---
  // In a full implementation, this is where you would:
  // 1. Initialize the Cloud Vision client.
  // 2. Send the imageBase64 data to the textDetection endpoint.
  // 3. Get a list of text annotations.
  // const ocrTextBlocks = await runTextRecognition(imageBase64);

  // 4. Parse the text blocks to get structured { itemId, quantity } data.
  // const masterItemList = await getFirestore().collection('items').get();
  // const parsedItems = parseOCRResults(ocrTextBlocks, masterItemList);

  // 5. Batch-write to the user's stash.
  // const db = getFirestore();
  // const stashRef = db.collection("users").doc(uid).collection("userStash");
  // const batch = db.batch();
  // parsedItems.forEach(item => {
  //   const docRef = stashRef.doc(item.itemId);
  //   batch.set(docRef, { quantity: item.quantity }, { merge: true });
  // });
  // await batch.commit();
  // --- END STUBBED LOGIC ---

  logger.warn(`processStashImage called by ${uid}. OCR server-side processing not implemented.`)

  return {
    status: 'success',
    message: 'Image received (server-side OCR processing is stubbed).',
    itemsProcessed: parsedItems?.length || 0,
  }
})
