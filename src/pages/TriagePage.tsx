import { collection, query, QueryConstraint } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../firebaseConfig'
import { UserStashItem, TrackedGoal } from '../types/userData'
import { useAuth } from '../hooks/useAuth'
import { getItemById } from '../data/items'
import { CRAFTING_RECIPES } from '../data/recipes'
import { useMemo } from 'react'
import styles from './TriagePage.module.css'

type TriageStatus = 'KEEP' | 'RECYCLE' | 'SELL'

interface StashItemWithId extends UserStashItem {
  id: string // document ID = itemId
}

interface TriageItem extends StashItemWithId {
  status: TriageStatus
  reason: string
  neededFor: string[]
}

export const TriagePage = () => {
  const { user } = useAuth()

  // Fetch user's stash
  const stashRef = user
    ? collection(firestore, 'users', user.uid, 'userStash')
    : null

  const stashQuery = stashRef ? query(stashRef) : null
  const [rawStashData, loadingStash, errorStash] = useCollectionData<UserStashItem>(
    stashQuery as any
  )

  // Map stash data to include document IDs
  const stashItems = (rawStashData as any[])?.map((item: any, index: number) => ({
    ...item,
    id: item.id || `item-${index}`,
  })) as StashItemWithId[] | undefined

  // Fetch user's tracked goals
  const goalsRef = user
    ? collection(firestore, 'users', user.uid, 'userTrackedGoals')
    : null

  const goalsQuery = goalsRef ? query(goalsRef) : null
  const [rawGoals, loadingGoals, errorGoals] = useCollectionData<TrackedGoal>(
    goalsQuery as any
  )

  // Map goals to include document IDs
  const goals = (rawGoals as any[])?.map((goal: any, index: number) => ({
    ...goal,
    id: goal.id || `goal-${index}`,
  })) as TrackedGoal[] | undefined

  // Calculate needed items based on goals
  const neededItems = useMemo(() => {
    if (!goals) return new Map<string, number>()

    const needed = new Map<string, number>()
    const visited = new Set<string>()

    const addIngredients = (itemId: string, quantity: number) => {
      if (visited.has(itemId)) return
      visited.add(itemId)

      const recipes = CRAFTING_RECIPES.filter(r => r.outputItemId === itemId)
      if (recipes.length === 0) {
        needed.set(itemId, (needed.get(itemId) || 0) + quantity)
        return
      }

      recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          addIngredients(
            ingredient.itemId,
            ingredient.quantity * quantity
          )
        })
      })
    }

    // For each goal, add ingredients to needed items
    goals.forEach(goal => {
      addIngredients(goal.targetId, goal.targetQuantity - goal.currentQuantity)
    })

    return needed
  }, [goals])

  // Triage the stash
  const triageItems = useMemo(() => {
    if (!stashItems) return []

    return stashItems
      .map(item => {
        const gameItem = getItemById(item.id) // item.id is the itemId
        if (!gameItem) return null

        const needed = neededItems.get(item.id) || 0
        const excess = item.quantity - Math.max(0, needed)
        const neededFor: string[] = []

        // Find which goals need this item
        goals?.forEach(goal => {
          if (CRAFTING_RECIPES.some(r => r.outputItemId === goal.targetId)) {
            // Check if this item is used in any recipe that leads to the goal
            if (neededItems.has(item.id)) {
              neededFor.push(goal.targetName)
            }
          }
        })

        let status: TriageStatus = 'SELL'
        let reason = 'Not needed'

        if (needed > 0 && item.quantity <= needed) {
          status = 'KEEP'
          reason = `Keep all (${needed - item.quantity} more needed)`
        } else if (needed > 0) {
          status = 'KEEP'
          reason = `Keep ${needed} (for goals)`
        } else if (gameItem.type === 'Consumable') {
          status = 'KEEP'
          reason = 'Consumables are useful'
        } else if (gameItem.type === 'Weapon' || gameItem.type === 'Armor') {
          status = 'KEEP'
          reason = 'Equipment piece'
        } else if (gameItem.recycleValue && gameItem.recycleValue.length > 0) {
          status = 'RECYCLE'
          reason = 'Recyclable material'
        }

        return {
          ...item,
          status,
          reason,
          neededFor,
        } as TriageItem
      })
      .filter((item): item is TriageItem => item !== null)
  }, [stashItems, neededItems, goals])

  const keepItems = triageItems.filter(i => i.status === 'KEEP')
  const recycleItems = triageItems.filter(i => i.status === 'RECYCLE')
  const sellItems = triageItems.filter(i => i.status === 'SELL')

  const calculateTotalValue = (items: TriageItem[]) => {
    return items.reduce((total, item) => {
      const gameItem = getItemById(item.id)
      return total + (gameItem?.sellValue || 0) * item.quantity
    }, 0)
  }

  const isLoading = loadingStash || loadingGoals
  const hasError = errorStash || errorGoals

  return (
    <div className={styles.container}>
      <h1>♻️ Inventory Triage</h1>
      <p className={styles.subtitle}>
        Organize your inventory based on your tracked goals
      </p>

      {!user && <p className={styles.message}>Please log in to triage your inventory.</p>}

      {user && (
        <>
          {isLoading && <p className={styles.message}>Loading inventory...</p>}
          {hasError && <p className={styles.error}>Error loading data</p>}

          {!isLoading && triageItems.length === 0 && (
            <p className={styles.message}>Your stash is empty. Complete some missions to get items!</p>
          )}

          {!isLoading && triageItems.length > 0 && (
            <>
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{keepItems.length}</div>
                  <div className={styles.statLabel}>Items to Keep</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{recycleItems.length}</div>
                  <div className={styles.statLabel}>Items to Recycle</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{sellItems.length}</div>
                  <div className={styles.statLabel}>Items to Sell</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>💰 {calculateTotalValue(sellItems)}</div>
                  <div className={styles.statLabel}>Total Sell Value</div>
                </div>
              </div>

              {/* KEEP Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  ✅ Keep ({keepItems.length} items)
                </h2>
                {keepItems.length === 0 ? (
                  <p className={styles.empty}>No items to keep</p>
                ) : (
                  <div className={styles.itemGrid}>
                    {keepItems.map(item => {
                      const gameItem = getItemById(item.id)
                      return (
                        <div key={item.id} className={`${styles.itemCard} ${styles.keep}`}>
                          {gameItem && (
                            <img
                              src={gameItem.iconUrl}
                              alt={gameItem.name}
                              className={styles.itemIcon}
                            />
                          )}
                          <div className={styles.itemContent}>
                            <div className={styles.itemName}>
                              {gameItem?.name || item.id}
                            </div>
                            <div className={styles.itemQuantity}>
                              Qty: {item.quantity}
                            </div>
                            <div className={styles.itemReason}>{item.reason}</div>
                            {item.neededFor.length > 0 && (
                              <div className={styles.neededFor}>
                                For: {item.neededFor.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* RECYCLE Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  🔄 Recycle ({recycleItems.length} items)
                </h2>
                {recycleItems.length === 0 ? (
                  <p className={styles.empty}>No items to recycle</p>
                ) : (
                  <div className={styles.itemGrid}>
                    {recycleItems.map(item => {
                      const gameItem = getItemById(item.id)
                      return (
                        <div key={item.id} className={`${styles.itemCard} ${styles.recycle}`}>
                          {gameItem && (
                            <img
                              src={gameItem.iconUrl}
                              alt={gameItem.name}
                              className={styles.itemIcon}
                            />
                          )}
                          <div className={styles.itemContent}>
                            <div className={styles.itemName}>
                              {gameItem?.name || item.id}
                            </div>
                            <div className={styles.itemQuantity}>
                              Qty: {item.quantity}
                            </div>
                            <div className={styles.itemReason}>{item.reason}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* SELL Section */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  💰 Sell ({sellItems.length} items)
                </h2>
                <p className={styles.sectionSubtitle}>
                  Total value: 💰 {calculateTotalValue(sellItems)}
                </p>
                {sellItems.length === 0 ? (
                  <p className={styles.empty}>No items to sell</p>
                ) : (
                  <div className={styles.itemGrid}>
                    {sellItems.map(item => {
                      const gameItem = getItemById(item.id)
                      const itemValue = (gameItem?.sellValue || 0) * item.quantity
                      return (
                        <div key={item.id} className={`${styles.itemCard} ${styles.sell}`}>
                          {gameItem && (
                            <img
                              src={gameItem.iconUrl}
                              alt={gameItem.name}
                              className={styles.itemIcon}
                            />
                          )}
                          <div className={styles.itemContent}>
                            <div className={styles.itemName}>
                              {gameItem?.name || item.id}
                            </div>
                            <div className={styles.itemQuantity}>
                              Qty: {item.quantity}
                            </div>
                            {itemValue > 0 && (
                              <div className={styles.itemValue}>
                                💰 {itemValue}
                              </div>
                            )}
                            <div className={styles.itemReason}>{item.reason}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
