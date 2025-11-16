import { collection, query, where, orderBy } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../firebaseConfig'
import { GameItem } from '../types/gameData'
import { useState, useMemo } from 'react'
import styles from './DatabasePage.module.css'

export const DatabasePage = () => {
  const [filter, setFilter] = useState('')
  const [rarity, setRarity] = useState('All')

  // 1. Define the base query against the static 'items' collection
  const itemsCollectionRef = collection(firestore, 'items')

  // 2. Build a query with rarity filter if selected
  let q = query(itemsCollectionRef, orderBy('name')) as any
  if (rarity !== 'All') {
    q = query(itemsCollectionRef, where('rarity', '==', rarity), orderBy('name')) as any
  }

  // 3. Use the hook to fetch and subscribe to data
  const [items, loading, error] = useCollectionData<GameItem>(q as any)

  // 4. Client-side filtering for search
  const filteredItems = useMemo(() => {
    if (!items) return []
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [items, filter])

  return (
    <div className={styles.container}>
      <h1>⚙️ Item Database</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className={styles.raritySelect}
        >
          <option value="All">All Rarities</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Epic">Epic</option>
          <option value="Legendary">Legendary</option>
          <option value="Junk">Junk</option>
        </select>
      </div>

      {loading && <p className={styles.loading}>Loading items...</p>}
      {error && <p className={styles.error}>Error: {error.message}</p>}

      {!loading && filteredItems.length === 0 && (
        <p className={styles.noResults}>No items found.</p>
      )}

      <ul className={styles.itemList}>
        {filteredItems &&
          filteredItems.map((item) => (
            <li key={item.id} className={`${styles.item} ${styles[item.rarity]}`}>
              <div className={styles.itemHeader}>
                <strong>{item.name}</strong>
                <span className={styles.rarity}>{item.rarity}</span>
              </div>
              <p className={styles.description}>{item.description}</p>
              <div className={styles.itemMeta}>
                <span>{item.type}</span>
                {item.stats && <span>⚔️ Damage: {item.stats.damage}</span>}
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
