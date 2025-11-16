#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create directories if they don't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

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
          reject(new Error(`Failed to parse JSON from ${endpoint}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Convert MetaForge item to Firebase Firestore format
function convertItemToFirebase(item) {
  const stats = item.stat_block ? {
    mapValue: {}
  } : undefined;

  if (item.stat_block) {
    const statBlock = item.stat_block;
    if (statBlock.damage !== undefined) {
      stats.mapValue.damage = { integerValue: String(statBlock.damage) };
    }
    if (statBlock.fireRate !== undefined) {
      stats.mapValue.fireRate = { integerValue: String(statBlock.fireRate) };
    }
    if (statBlock.magSize !== undefined) {
      stats.mapValue.magSize = { integerValue: String(statBlock.magSize) };
    }
    if (statBlock.range !== undefined) {
      stats.mapValue.range = { integerValue: String(statBlock.range) };
    }
    // Add more stat mappings as needed
  }

  const result = {
    '__key': {
      'path': ['items', item.id]
    },
    'name': { stringValue: item.name },
    'description': { stringValue: item.description || '' },
    'rarity': { stringValue: item.rarity || 'Common' },
    'type': { stringValue: item.item_type || 'Material' },
    'iconUrl': { stringValue: item.icon || 'https://via.placeholder.com/150' },
    'stackSize': { integerValue: String(item.stackSize || 1) },
    'sellValue': { integerValue: String(item.value || 0) }
  };

  if (stats && Object.keys(stats.mapValue).length > 0) {
    result.stats = stats;
  }

  return result;
}

// Create Firebase emulator export format
async function createFirebaseExport(items) {
  const baseDir = path.join(__dirname, '..', 'fb-emulator-data', 'firestore_export');
  const dataDir = path.join(baseDir, 'firestore_data');

  ensureDir(dataDir);

  // Create metadata.json
  const metadata = {
    version: '14.25.0',
    firestore: {
      version: '1.19.8',
      path: 'firestore_export',
      metadata_file: 'firestore_export/firestore_export.overall_export_metadata'
    },
    auth: {
      version: '14.25.0',
      path: 'auth_export'
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'fb-emulator-data', 'firebase-export-metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  // Create overall_export_metadata
  fs.writeFileSync(
    path.join(baseDir, 'firestore_export.overall_export_metadata'),
    '{"version":"1.19.8","collectionIds":["items","recipes","quests","workshopUpgrades","projects","enemyLootTables"]}'
  );

  // Convert items to Firebase format - key indexed by document ID
  const firebaseItems = {};
  items.forEach(item => {
    const firebaseItem = convertItemToFirebase(item);
    firebaseItems[item.id] = firebaseItem;
  });

  fs.writeFileSync(
    path.join(dataDir, 'items.json'),
    JSON.stringify(firebaseItems, null, 2)
  );

  console.log(`✓ Created ${items.length} items in Firebase emulator format`);
}

// Main function
async function main() {
  try {
    console.log('Fetching Arc Raiders game data...\n');

    // Fetch items from MetaForge API
    const itemsResponse = await fetchData('https://metaforge.app/api/arc-raiders/items');
    const items = itemsResponse.data || [];

    console.log(`✓ Fetched ${items.length} items\n`);

    if (items.length === 0) {
      console.warn('No items fetched. API might be unavailable.');
      process.exit(1);
    }

    // Create Firebase emulator export
    await createFirebaseExport(items);

    console.log('\n✓ Successfully created Firebase emulator data!');
    console.log('You can now restart your development server with: npm run dev');
  } catch (error) {
    console.error('Error fetching game data:', error.message);
    process.exit(1);
  }
}

main();
