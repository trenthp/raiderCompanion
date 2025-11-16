import { useState, useCallback } from 'react'
import Tesseract from 'tesseract.js'
import { ParsedOCRItem, OCRCorrection } from '../types/userData'
import { GameItem } from '../types/gameData'
import { collection, addDoc } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'

/**
 * Fuzzy string matching - simple Levenshtein distance implementation
 * for matching OCR text to actual item names
 */
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null))

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      )
    }
  }

  return track[str2.length][str1.length]
}

/**
 * Calculate similarity score (0-1) between two strings
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length)
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase())
  return Math.max(0, 1 - distance / maxLen)
}

/**
 * Parse OCR text to extract item names and quantities
 * Simple regex-based approach: "ItemName x5" or "ItemName 5"
 */
function parseOCRText(text: string): Array<{ name: string; quantity: number }> {
  const items: Array<{ name: string; quantity: number }> = []

  // Split by common delimiters (newlines, commas)
  const lines = text.split(/[\n,]/g)

  lines.forEach((line) => {
    line = line.trim()
    if (!line) return

    // Try to match "ItemName x5" or "ItemName 5"
    const match = line.match(/^(.+?)\s*x?(\d+)?\s*$/)
    if (match) {
      const name = match[1].trim()
      const quantity = match[2] ? parseInt(match[2], 10) : 1

      if (name.length > 0) {
        items.push({ name, quantity })
      }
    }
  })

  return items
}

/**
 * Match OCR-parsed items against the actual game items database
 * Returns high-confidence matches and flags uncertain ones
 */
function fuzzyMatchItems(
  parsedItems: Array<{ name: string; quantity: number }>,
  gameItems: GameItem[],
  confidenceThreshold: number = 0.7
): ParsedOCRItem[] {
  const results: ParsedOCRItem[] = []

  parsedItems.forEach(({ name, quantity }) => {
    let bestMatch: GameItem | null = null
    let bestScore = 0

    // Find the closest matching game item
    gameItems.forEach((item) => {
      const score = calculateSimilarity(name, item.name)
      if (score > bestScore) {
        bestScore = score
        bestMatch = item
      }
    })

    results.push({
      text: name,
      quantity,
      matchedItemId: bestMatch?.id,
      confidence: bestScore,
      requiresManualConfirmation: bestScore < confidenceThreshold,
    })
  })

  return results
}

interface UseStashOCRReturn {
  processing: boolean
  error: Error | null
  results: ParsedOCRItem[]
  processImage: (imageFile: File, gameItems: GameItem[]) => Promise<void>
  logCorrection: (
    userId: string,
    originalText: string,
    correctedItemId: string
  ) => Promise<void>
}

/**
 * Custom hook for OCR processing with Tesseract.js
 * Includes intelligent parsing and user correction tracking
 */
export const useStashOCR = (): UseStashOCRReturn => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [results, setResults] = useState<ParsedOCRItem[]>([])

  const processImage = useCallback(
    async (imageFile: File, gameItems: GameItem[]) => {
      setProcessing(true)
      setError(null)
      setResults([])

      try {
        // Step 1: Extract text from image using Tesseract.js
        const {
          data: { text },
        } = await Tesseract.recognize(imageFile, 'eng')

        // Step 2: Parse the text to identify items and quantities
        const parsedItems = parseOCRText(text)

        // Step 3: Fuzzy-match against game items
        const matchedItems = fuzzyMatchItems(parsedItems, gameItems)

        setResults(matchedItems)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        console.error('OCR processing failed:', error)
      } finally {
        setProcessing(false)
      }
    },
    []
  )

  /**
   * Log a user correction for an OCR result
   * This helps build a dataset for future improvements
   */
  const logCorrection = useCallback(
    async (userId: string, originalText: string, correctedItemId: string) => {
      try {
        const correctionsRef = collection(
          firestore,
          'users',
          userId,
          'ocrCorrections'
        )

        const correction: Omit<OCRCorrection, 'id'> = {
          originalText,
          correctedItemId,
          confidence: 0.5, // Default: user had to correct it
          timestamp: new Date().toISOString(),
          approved: false,
        }

        await addDoc(correctionsRef, correction)
        console.log('OCR correction logged:', originalText, '->', correctedItemId)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        console.error('Failed to log correction:', error)
        throw error
      }
    },
    []
  )

  return {
    processing,
    error,
    results,
    processImage,
    logCorrection,
  }
}
