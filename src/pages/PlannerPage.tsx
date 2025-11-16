import { collection, query, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../firebaseConfig'
import { TrackedGoal } from '../types/userData'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { ItemSelector } from '../components/ItemSelector'
import { GameItem } from '../types/gameData'
import styles from './PlannerPage.module.css'

export const PlannerPage = () => {
  const { user } = useAuth()
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null)
  const [goalType, setGoalType] = useState<'ITEM' | 'RECIPE' | 'UPGRADE'>('ITEM')
  const [goalQuantity, setGoalQuantity] = useState(10)

  // Fetch tracked goals
  const goalsRef = user
    ? collection(firestore, 'users', user.uid, 'userTrackedGoals')
    : null

  const [rawGoals, loadingGoals, errorGoals] = useCollectionData(
    goalsRef ? (query(goalsRef) as any) : null
  )

  // Map goals to include document IDs
  const goals = (rawGoals as any[])?.map((goal: any, index: number) => ({
    ...goal,
    id: goal.id || `goal-${index}`,
  })) as TrackedGoal[] | undefined

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalsRef || !selectedItemId || !selectedItem) return

    const newGoal: Omit<TrackedGoal, 'id'> = {
      type: goalType,
      targetId: selectedItemId,
      targetName: selectedItem.name,
      targetQuantity: goalQuantity,
      currentQuantity: 0,
      createdAt: new Date().toISOString(),
      priority: 'MEDIUM',
    }

    try {
      await addDoc(goalsRef, newGoal)
      setSelectedItemId(null)
      setSelectedItem(null)
      setGoalQuantity(10)
    } catch (err) {
      console.error('Error adding goal:', err)
    }
  }

  const handleItemSelect = (itemId: string, item: GameItem) => {
    setSelectedItemId(itemId)
    setSelectedItem(item)
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return
    try {
      const docRef = doc(
        firestore,
        'users',
        user.uid,
        'userTrackedGoals',
        goalId
      )
      await deleteDoc(docRef)
    } catch (err) {
      console.error('Error deleting goal:', err)
    }
  }

  return (
    <div className={styles.container}>
      <h1>🎯 Farming Planner</h1>

      {!user && <p>Please log in to track your goals.</p>}

      {user && (
        <>
          <form onSubmit={handleAddGoal} className={styles.form}>
            <h2>Add New Goal</h2>

            <ItemSelector
              value={selectedItemId}
              onChange={handleItemSelect}
              label="Select Item to Track"
            />

            {selectedItem && (
              <div className={styles.itemPreview}>
                <img src={selectedItem.iconUrl} alt={selectedItem.name} className={styles.previewIcon} />
                <div className={styles.previewInfo}>
                  <div className={styles.previewName}>{selectedItem.name}</div>
                  <div className={styles.previewDetails}>
                    {selectedItem.type} • {selectedItem.rarity}
                    {selectedItem.sellValue && ` • Sell: 💰${selectedItem.sellValue}`}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Goal Type</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as 'ITEM' | 'RECIPE' | 'UPGRADE')}
                >
                  <option value="ITEM">Obtain Item</option>
                  <option value="RECIPE">Learn Recipe</option>
                  <option value="UPGRADE">Complete Upgrade</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Target Quantity</label>
                <input
                  type="number"
                  value={goalQuantity}
                  onChange={(e) => setGoalQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!selectedItem}
            >
              Add Goal ✓
            </button>
          </form>

          <div className={styles.goalsSection}>
            {loadingGoals && <p>Loading goals...</p>}
            {errorGoals && <p>Error: {errorGoals.message}</p>}

            {goals && goals.length === 0 && (
              <p className={styles.empty}>You have no tracked goals. Create one above!</p>
            )}

            {goals && goals.length > 0 && (
              <>
                <h2>Tracked Goals ({goals.length})</h2>
                <ul className={styles.goalList}>
                  {goals.map((goal) => {
                    const progress = (
                      (goal.currentQuantity / goal.targetQuantity) *
                      100
                    ).toFixed(0)

                    return (
                      <li key={goal.id} className={styles.goalItem}>
                        <div className={styles.goalHeader}>
                          <strong>{goal.targetName}</strong>
                          <span className={styles.type}>{goal.type}</span>
                        </div>

                        <div className={styles.goalProgress}>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${Math.min(parseInt(progress), 100)}%` }}
                            />
                          </div>
                          <span className={styles.progressText}>
                            {goal.currentQuantity} / {goal.targetQuantity}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className={styles.deleteButton}
                        >
                          ✕ Delete
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
