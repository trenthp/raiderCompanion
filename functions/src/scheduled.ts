import { onSchedule } from 'firebase-functions/v2/scheduler'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'

/**
 * A scheduled function that runs every 24 hours.
 *
 * 1. Queries the entire `communityLoadouts` collection.
 * 2. Aggregates stats (e.g., weapon pick rates, upvotes).
 * 3. Writes the results to a single document (`metaStats/dashboard`)
 *    for the frontend to display as a "Meta Dashboard".
 */
export const aggregateMetaStats = onSchedule('every 24 hours', async (event) => {
  logger.info('Running scheduled job: aggregateMetaStats')
  const db = getFirestore()
  const loadoutsSnapshot = await db.collection('communityLoadouts').get()

  const weaponPickRate: { [key: string]: number } = {}
  let totalLoadouts = 0

  loadoutsSnapshot.forEach((doc) => {
    const data = doc.data()
    if (data.weapon1) {
      weaponPickRate[data.weapon1] = (weaponPickRate[data.weapon1] || 0) + 1
    }
    if (data.weapon2) {
      weaponPickRate[data.weapon2] = (weaponPickRate[data.weapon2] || 0) + 1
    }
    totalLoadouts++
  })

  const metaData = {
    totalLoadouts,
    weaponPickRate,
    lastUpdated: new Date().toISOString(),
  }

  try {
    await db.collection('metaStats').doc('dashboard').set(metaData)
    logger.info('Successfully aggregated and saved meta stats.')
  } catch (error) {
    logger.error('Error saving aggregated meta stats:', error)
  }
})

/**
 * A scheduled function that runs every 15 minutes.
 *
 * 1. (Future) Fetches live event timer data from a third-party API or source
 *    (e.g., MetaForge API).
 * 2. (Future) Parses the live data.
 * 3. Overwrites the documents in the `liveEventTimers` collection.
 *
 * This ensures our app always displays the correct, up-to-date event schedule,
 * which is known to change frequently.
 */
export const updateLiveEventTimers = onSchedule(
  'every 15 minutes',
  async (event) => {
    logger.info('Running scheduled job: updateLiveEventTimers')
    const db = getFirestore()

    // --- STUBBED LOGIC FOR LIVE DATA FETCH ---
    // try {
    //   const response = await fetch("https://metaforge.app/api/arc-raiders/events");
    //   const events = await response.json();
    //
    //   const batch = db.batch();
    //   const collectionRef = db.collection("liveEventTimers");
    //
    //   // Clear collection and add new events
    //   events.forEach(event => {
    //     const docRef = collectionRef.doc(event.id);
    //     batch.set(docRef, {
    //       name: event.name,
    //       location: event.location,
    //       startTime: event.startTime,
    //       endTime: event.endTime,
    //     });
    //   });
    //   await batch.commit();
    //   logger.info(`Successfully updated ${events.length} live event timers.`);
    //
    // } catch (error) {
    //   logger.error("Error updating live event timers:", error);
    // }
    // --- END STUBBED LOGIC ---

    logger.warn('updateLiveEventTimers called. Live data fetching not implemented.')
  }
)

/**
 * A scheduled function that runs every 12 hours.
 *
 * 1. Fetches the latest game item data from MetaForge API
 * 2. Updates the `items` collection with the latest data
 * 3. Keeps the app's game data in sync with Arc Raiders updates
 */
export const syncGameData = onSchedule('every 12 hours', async (event) => {
  logger.info('Running scheduled job: syncGameData')
  const db = getFirestore()

  try {
    // Fetch items from MetaForge API
    logger.info('Fetching items from MetaForge API...')
    const response = await fetch('https://metaforge.app/api/arc-raiders/items')

    if (!response.ok) {
      throw new Error(`MetaForge API returned ${response.status}`)
    }

    const data = await response.json()
    const items = data.data || []

    if (items.length === 0) {
      logger.warn('No items returned from MetaForge API')
      return
    }

    logger.info(`Fetched ${items.length} items from MetaForge API`)

    // Update items collection in batches (Firestore batch limit is 500)
    const batch = db.batch()
    let batchCount = 0
    let totalWritten = 0

    for (const item of items) {
      const docData = {
        id: item.id,
        name: item.name,
        description: item.description || '',
        rarity: item.rarity || 'Common',
        type: item.item_type || 'Material',
        iconUrl: item.icon || 'https://via.placeholder.com/150',
        stackSize: item.stackSize || 1,
        sellValue: item.value || 0,
        updatedAt: new Date().toISOString(),
      }

      // Add stats if available
      if (item.stat_block) {
        const stats: { [key: string]: number } = {}
        if (item.stat_block.damage !== undefined) stats.damage = item.stat_block.damage
        if (item.stat_block.fireRate !== undefined) stats.fireRate = item.stat_block.fireRate
        if (item.stat_block.magSize !== undefined) stats.magSize = item.stat_block.magSize
        if (item.stat_block.range !== undefined) stats.range = item.stat_block.range
        if (Object.keys(stats).length > 0) {
          docData.stats = stats
        }
      }

      const docRef = db.collection('items').doc(item.id)
      batch.set(docRef, docData, { merge: true })
      batchCount++
      totalWritten++

      // Commit batch every 500 documents
      if (batchCount === 500) {
        await batch.commit()
        logger.info(`Committed batch of 500 items (total: ${totalWritten})`)
        batchCount = 0
      }
    }

    // Commit remaining items
    if (batchCount > 0) {
      await batch.commit()
      logger.info(`Committed final batch of ${batchCount} items (total: ${totalWritten})`)
    }

    logger.info(`Successfully synced ${totalWritten} items to Firestore`)
  } catch (error) {
    logger.error('Error syncing game data:', error)
  }
})
