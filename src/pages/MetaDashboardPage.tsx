import { collection, query, limit, orderBy } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../firebaseConfig'
import { CommunityLoadout } from '../types/gameData'
import { getItemById } from '../data/items'
import { useMemo } from 'react'
import styles from './MetaDashboardPage.module.css'

export const MetaDashboardPage = () => {
  // Fetch community loadouts sorted by upvotes
  const loadoutsRef = collection(firestore, 'communityLoadouts')
  const loadoutsQuery = query(loadoutsRef, orderBy('upvotes', 'desc'), limit(12))

  const [rawLoadouts, loadingLoadouts, errorLoadouts] = useCollectionData<CommunityLoadout>(
    loadoutsQuery as any
  )

  // Map loadouts to include document IDs
  const loadouts = (rawLoadouts as any[])?.map((loadout: any, index: number) => ({
    ...loadout,
    id: loadout.id || `loadout-${index}`,
  })) as (CommunityLoadout & { id: string })[] | undefined

  // Calculate most used items across loadouts
  const itemStats = useMemo(() => {
    if (!loadouts) return new Map<string, number>()

    const stats = new Map<string, number>()

    loadouts.forEach(loadout => {
      const itemIds = [
        loadout.weapon1,
        loadout.weapon2,
        loadout.helmet,
        loadout.chest,
        loadout.legs,
        loadout.gloves,
        loadout.trinket1,
        loadout.trinket2,
      ].filter(Boolean)

      itemIds.forEach(itemId => {
        stats.set(itemId, (stats.get(itemId) || 0) + 1)
      })
    })

    return stats
  }, [loadouts])

  // Get top items
  const topItems = useMemo(() => {
    const sorted = Array.from(itemStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([itemId, count]) => ({
        itemId,
        count,
        item: getItemById(itemId),
      }))

    return sorted
  }, [itemStats])

  return (
    <div className={styles.container}>
      <h1>📊 Meta Dashboard</h1>
      <p className={styles.subtitle}>Community trends and popular gear combinations</p>

      <div className={styles.grid}>
        {/* Stats Cards */}
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{loadouts?.length || 0}</div>
            <div className={styles.statLabel}>Community Loadouts</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{topItems.length}</div>
            <div className={styles.statLabel}>Top Items</div>
          </div>
        </div>

        {/* Top Items Section */}
        <div className={styles.section}>
          <h2>🎯 Most Used Items</h2>
          {topItems.length === 0 ? (
            <p className={styles.empty}>No data available yet</p>
          ) : (
            <div className={styles.itemsGrid}>
              {topItems.map(({ itemId, count, item }) => (
                <div key={itemId} className={styles.itemCard}>
                  {item && (
                    <img
                      src={item.iconUrl}
                      alt={item.name}
                      className={styles.itemIcon}
                    />
                  )}
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item?.name || itemId}</div>
                    <div className={styles.itemStat}>Used in {count} loadouts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Loadouts Section */}
        <div className={styles.section}>
          <h2>⭐ Top Community Loadouts</h2>
          {loadingLoadouts && <p className={styles.loading}>Loading loadouts...</p>}
          {errorLoadouts && <p className={styles.error}>Error loading loadouts</p>}
          {loadouts && loadouts.length === 0 && (
            <p className={styles.empty}>No community loadouts yet</p>
          )}
          {loadouts && loadouts.length > 0 && (
            <div className={styles.loadoutList}>
              {loadouts.slice(0, 12).map((loadout) => (
                <div key={loadout.id} className={styles.loadoutCard}>
                  <div className={styles.loadoutHeader}>
                    <div>
                      <h3 className={styles.loadoutName}>{loadout.name}</h3>
                      <p className={styles.loadoutAuthor}>by {loadout.authorName}</p>
                    </div>
                    <div className={styles.loadoutStats}>
                      <span className={styles.upvotes}>👍 {loadout.upvotes}</span>
                      <span className={styles.downvotes}>👎 {loadout.downvotes}</span>
                    </div>
                  </div>

                  {loadout.description && (
                    <p className={styles.loadoutDescription}>{loadout.description}</p>
                  )}

                  <div className={styles.loadoutItems}>
                    {[
                      { label: 'Weapon 1', id: loadout.weapon1 },
                      { label: 'Weapon 2', id: loadout.weapon2 },
                      { label: 'Head', id: loadout.helmet },
                      { label: 'Chest', id: loadout.chest },
                      { label: 'Legs', id: loadout.legs },
                      { label: 'Gloves', id: loadout.gloves },
                      { label: 'Trinket 1', id: loadout.trinket1 },
                      { label: 'Trinket 2', id: loadout.trinket2 },
                    ]
                      .filter(({ id }) => id)
                      .map(({ label, id }) => {
                        const item = getItemById(id)
                        return (
                          <div key={`${loadout.id}-${label}`} className={styles.loadoutSlot}>
                            {item && (
                              <img
                                src={item.iconUrl}
                                alt={item.name}
                                className={styles.slotIcon}
                                title={item.name}
                              />
                            )}
                            <span className={styles.slotLabel}>{label}</span>
                          </div>
                        )
                      })}
                  </div>

                  {loadout.comments > 0 && (
                    <div className={styles.comments}>
                      💬 {loadout.comments} comment{loadout.comments !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
