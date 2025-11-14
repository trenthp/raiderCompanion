import { collection, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../firebaseConfig'
import { UserStashItem } from '../types/userData'
import { GameItem } from '../types/gameData'
import { useAuth } from '../hooks/useAuth'
import { useStashOCR } from '../hooks/useStashOCR'
import { useState, useRef } from 'react'
import styles from './MyStashPage.module.css'

export const MyStashPage = () => {
  const { user } = useAuth()
  const [showOCRModal, setShowOCRModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { processing, error: ocrError, results, processImage, logCorrection } = useStashOCR()

  // Fetch user's stash
  const stashRef = user
    ? collection(firestore, 'users', user.uid, 'userStash')
    : null

  const [stash, loadingStash, errorStash] = useCollectionData<UserStashItem>(
    stashRef ? (query(stashRef) as any) : null
  )

  // Fetch all game items for OCR matching
  const itemsRef = collection(firestore, 'items')
  const [gameItems, loadingItems] = useCollectionData<GameItem>(query(itemsRef) as any)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleProcessImage = async () => {
    if (!selectedImage || !gameItems) return

    await processImage(selectedImage, gameItems)
  }

  const handleConfirmOCRItem = async (itemId: string) => {
    if (!user) return

    try {
      // Log the correction for future learning
      const ocrResult = results.find((r) => r.matchedItemId === itemId)
      if (ocrResult) {
        await logCorrection(user.uid, ocrResult.text, itemId)
      }

      // TODO: Add the item to user's stash
      // This would involve updating the userStash subcollection

      console.log('Item confirmed:', itemId)
    } catch (err) {
      console.error('Failed to confirm OCR item:', err)
    }
  }

  const handleManualEntry = (originalText: string) => {
    // TODO: Open a modal to let user manually search and select the correct item
    console.log('Manual entry needed for:', originalText)
  }

  return (
    <div className={styles.container}>
      <h1>🎒 My Stash</h1>

      {!user && <p>Please log in to see your stash.</p>}

      {user && (
        <>
          <div className={styles.ocrSection}>
            <button
              onClick={() => setShowOCRModal(true)}
              disabled={processing}
              className={styles.ocrButton}
            >
              📸 Upload Stash Screenshot (OCR)
            </button>
            <p className={styles.hint}>
              Automatically extract items from a screenshot of your in-game inventory
            </p>
          </div>

          {showOCRModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Extract Items from Screenshot</h2>

                <div className={styles.fileUpload}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className={styles.fileInput}
                  />
                  {selectedImage && (
                    <p className={styles.selectedFile}>✓ {selectedImage.name}</p>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={processing}
                  >
                    Choose Image
                  </button>
                </div>

                {selectedImage && !results.length && !processing && (
                  <button onClick={handleProcessImage} disabled={processing}>
                    {processing ? 'Processing...' : 'Extract Items'}
                  </button>
                )}

                {processing && <p>Processing image with OCR...</p>}

                {ocrError && <p className={styles.error}>Error: {ocrError.message}</p>}

                {results.length > 0 && (
                  <div className={styles.ocrResults}>
                    <h3>Detected Items</h3>
                    <ul>
                      {results.map((result, idx) => (
                        <li key={idx} className={styles.ocrResult}>
                          <div className={styles.resultInfo}>
                            <strong>{result.text}</strong>
                            <span>x{result.quantity}</span>
                            <span className={styles.confidence}>
                              Confidence: {(result.confidence * 100).toFixed(0)}%
                            </span>
                          </div>

                          {!result.requiresManualConfirmation && result.matchedItemId ? (
                            <button
                              onClick={() => handleConfirmOCRItem(result.matchedItemId!)}
                              className={styles.confirmButton}
                            >
                              ✓ Add
                            </button>
                          ) : (
                            <button
                              onClick={() => handleManualEntry(result.text)}
                              className={styles.manualButton}
                            >
                              ✏️ Manual Entry
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowOCRModal(false)
                    setSelectedImage(null)
                  }}
                  className={styles.closeButton}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className={styles.stashContent}>
            {loadingStash && <p>Loading stash...</p>}
            {errorStash && <p>Error: {errorStash.message}</p>}

            {stash && stash.length === 0 && (
              <p>Your stash is empty. Upload a screenshot to get started!</p>
            )}

            {stash && stash.length > 0 && (
              <div>
                <h2>Items ({stash.length})</h2>
                <ul className={styles.itemList}>
                  {stash.map((item: any) => (
                    <li key={item.itemId} className={styles.stashItem}>
                      <strong>Item ID: {item.itemId}</strong>
                      <span className={styles.quantity}>x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
