#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import https from 'https';

// Fetch data from MetaForge API
function fetchData(endpoint) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching from ${endpoint}...`);
    https.get(endpoint, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function syncGameData() {
  try {
    console.log('Initializing Firebase Admin SDK...');

    // Get credentials from environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error(
        'Missing Firebase credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL'
      );
    }

    // Initialize Firebase Admin SDK
    const app = initializeApp({
      credential: cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });

    const db = getFirestore(app);
    console.log(`Connected to Firestore project: ${projectId}\n`);

    console.log('Fetching Arc Raiders game data from MetaForge API...\n');

    // Fetch items from MetaForge API
    const itemsResponse = await fetchData('https://metaforge.app/api/arc-raiders/items');
    const items = itemsResponse.data || [];

    console.log(`✓ Fetched ${items.length} items\n`);

    if (items.length === 0) {
      console.warn('No items fetched. API might be unavailable.');
      process.exit(1);
    }

    // Update items collection in batches (Firestore batch limit is 500)
    console.log('Writing items to Firestore...\n');
    const batch = db.batch();
    let batchCount = 0;
    let totalWritten = 0;

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
      };

      // Add stats if available
      if (item.stat_block) {
        const stats = {};
        if (item.stat_block.damage !== undefined) stats.damage = item.stat_block.damage;
        if (item.stat_block.fireRate !== undefined) stats.fireRate = item.stat_block.fireRate;
        if (item.stat_block.magSize !== undefined) stats.magSize = item.stat_block.magSize;
        if (item.stat_block.range !== undefined) stats.range = item.stat_block.range;
        if (Object.keys(stats).length > 0) {
          docData.stats = stats;
        }
      }

      const docRef = db.collection('items').doc(item.id);
      batch.set(docRef, docData, { merge: true });
      batchCount++;
      totalWritten++;

      // Commit batch every 500 documents
      if (batchCount === 500) {
        await batch.commit();
        console.log(`  ✓ Committed batch of 500 items (total: ${totalWritten})`);
        batchCount = 0;
      }
    }

    // Commit remaining items
    if (batchCount > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch of ${batchCount} items (total: ${totalWritten})`);
    }

    console.log(`\n✓ Successfully synced ${totalWritten} items to Firestore!`);
    process.exit(0);
  } catch (error) {
    console.error('Error syncing game data:', error.message);
    console.error(error);
    process.exit(1);
  }
}

syncGameData();
