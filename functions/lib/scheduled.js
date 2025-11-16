"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLiveEventTimers = exports.aggregateMetaStats = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-admin/firestore");
const firebase_functions_1 = require("firebase-functions");
/**
 * A scheduled function that runs every 24 hours.
 *
 * 1. Queries the entire `communityLoadouts` collection.
 * 2. Aggregates stats (e.g., weapon pick rates, upvotes).
 * 3. Writes the results to a single document (`metaStats/dashboard`)
 *    for the frontend to display as a "Meta Dashboard".
 */
exports.aggregateMetaStats = (0, scheduler_1.onSchedule)('every 24 hours', async (event) => {
    firebase_functions_1.logger.info('Running scheduled job: aggregateMetaStats');
    const db = (0, firestore_1.getFirestore)();
    const loadoutsSnapshot = await db.collection('communityLoadouts').get();
    const weaponPickRate = {};
    let totalLoadouts = 0;
    loadoutsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.weapon1) {
            weaponPickRate[data.weapon1] = (weaponPickRate[data.weapon1] || 0) + 1;
        }
        if (data.weapon2) {
            weaponPickRate[data.weapon2] = (weaponPickRate[data.weapon2] || 0) + 1;
        }
        totalLoadouts++;
    });
    const metaData = {
        totalLoadouts,
        weaponPickRate,
        lastUpdated: new Date().toISOString(),
    };
    try {
        await db.collection('metaStats').doc('dashboard').set(metaData);
        firebase_functions_1.logger.info('Successfully aggregated and saved meta stats.');
    }
    catch (error) {
        firebase_functions_1.logger.error('Error saving aggregated meta stats:', error);
    }
});
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
exports.updateLiveEventTimers = (0, scheduler_1.onSchedule)('every 15 minutes', async (event) => {
    firebase_functions_1.logger.info('Running scheduled job: updateLiveEventTimers');
    const db = (0, firestore_1.getFirestore)();
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
    firebase_functions_1.logger.warn('updateLiveEventTimers called. Live data fetching not implemented.');
});
//# sourceMappingURL=scheduled.js.map