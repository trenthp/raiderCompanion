import { collection, doc, query } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore } from '../firebaseConfig'
import { CommunityLoadout } from '../types/gameData'
import styles from './LoadoutsPage.module.css'

interface MetaStats {
  totalLoadouts: number
  lastUpdated: string
  weaponPickRate: { [key: string]: number }
}

export const LoadoutsPage = () => {
  // Query the public 'communityLoadouts' collection
  const loadoutsRef = collection(firestore, 'communityLoadouts')
  const [loadouts, loadingLoadouts, errorLoadouts] = useCollectionData<CommunityLoadout>(
    query(loadoutsRef) as any
  )

  // Query the 'metaStats/dashboard' document
  const metaRef = doc(firestore, 'metaStats', 'dashboard') as any
  const [metaStats, loadingMeta, errorMeta] = useDocumentData<MetaStats>(metaRef)

  return (
    <div className={styles.container}>
      <h1>⚔️ Community Loadouts & Meta</h1>

      {/* Meta Stats Dashboard Section */}
      <section className={styles.metaSection}>
        <h2>Meta Dashboard</h2>
        {loadingMeta && <p>Loading meta stats...</p>}
        {errorMeta && <p className={styles.error}>Error: {errorMeta.message}</p>}

        {metaStats && (
          <div className={styles.metaCard}>
            <div className={styles.metaStat}>
              <span className={styles.label}>Total Loadouts Analyzed</span>
              <span className={styles.value}>{metaStats.totalLoadouts}</span>
            </div>

            <div className={styles.metaStat}>
              <span className={styles.label}>Last Updated</span>
              <span className={styles.value}>
                {new Date(metaStats.lastUpdated).toLocaleString()}
              </span>
            </div>

            <div className={styles.metaStat}>
              <h3>Weapon Pick Rates</h3>
              <ul className={styles.weaponList}>
                {Object.entries(metaStats.weaponPickRate)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([weaponId, count]) => {
                    const pickRate = ((count / (metaStats.totalLoadouts * 2)) * 100).toFixed(1)
                    return (
                      <li key={weaponId} className={styles.weaponItem}>
                        <span>{weaponId}</span>
                        <span className={styles.percentage}>{pickRate}%</span>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        )}
      </section>

      <hr className={styles.divider} />

      {/* Community Loadouts Section */}
      <section className={styles.loadoutsSection}>
        <h2>Community Loadouts</h2>
        <p className={styles.description}>
          Discover loadouts created by other players. Create your own loadout to share with
          the community!
        </p>

        {loadingLoadouts && <p>Loading loadouts...</p>}
        {errorLoadouts && <p className={styles.error}>Error: {errorLoadouts.message}</p>}

        {loadouts && loadouts.length === 0 && (
          <p className={styles.empty}>No loadouts yet. Be the first to create one!</p>
        )}

        {loadouts && loadouts.length > 0 && (
          <div className={styles.loadoutGrid}>
            {loadouts.map((loadout) => (
              <div key={loadout.id} className={styles.loadoutCard}>
                <div className={styles.loadoutHeader}>
                  <h3>{loadout.name}</h3>
                  <span className={styles.author}>by {loadout.authorName}</span>
                </div>

                <p className={styles.description}>{loadout.description}</p>

                <div className={styles.weaponSlots}>
                  <div className={styles.slot}>
                    <span className={styles.slotLabel}>Primary</span>
                    <span className={styles.slotValue}>{loadout.weapon1}</span>
                  </div>
                  <div className={styles.slot}>
                    <span className={styles.slotLabel}>Secondary</span>
                    <span className={styles.slotValue}>{loadout.weapon2}</span>
                  </div>
                </div>

                <div className={styles.armorSlots}>
                  <div className={styles.slot}>
                    <span className={styles.slotLabel}>Helmet</span>
                    <span className={styles.slotValue}>{loadout.helmet}</span>
                  </div>
                  <div className={styles.slot}>
                    <span className={styles.slotLabel}>Chest</span>
                    <span className={styles.slotValue}>{loadout.chest}</span>
                  </div>
                </div>

                <div className={styles.stats}>
                  <button className={styles.upvote}>👍 {loadout.upvotes || 0}</button>
                  <button className={styles.downvote}>👎 {loadout.downvotes || 0}</button>
                  <button className={styles.comments}>💬 {loadout.comments || 0}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
