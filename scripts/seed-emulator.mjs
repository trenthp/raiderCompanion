#!/usr/bin/env node

import https from 'https';
import http from 'http';

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

// POST data to Firestore emulator REST API
function writeToFirestore(projectId, collection, docId, data) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:8080/v1/projects/${projectId}/databases/(default)/documents/${collection}/${docId}`;

    const jsonData = JSON.stringify({
      fields: Object.keys(data).reduce((acc, key) => {
        const value = data[key];
        if (typeof value === 'string') {
          acc[key] = { stringValue: value };
        } else if (typeof value === 'number') {
          if (Number.isInteger(value)) {
            acc[key] = { integerValue: String(value) };
          } else {
            acc[key] = { doubleValue: value };
          }
        } else if (typeof value === 'object' && value !== null) {
          acc[key] = { mapValue: { fields: Object.keys(value).reduce((m, k) => {
            const v = value[k];
            if (typeof v === 'number') {
              m[k] = { integerValue: String(v) };
            } else {
              m[k] = { stringValue: String(v) };
            }
            return m;
          }, {}) } };
        }
        return acc;
      }, {})
    });

    const options = {
      hostname: '127.0.0.1',  // Use IPv4 explicitly instead of localhost
      port: 8080,
      path: `/v1/projects/${projectId}/databases/(default)/documents/${collection}/${docId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.write(jsonData);
    req.end();
  });
}

async function seedEmulator() {
  try {
    const projectId = 'arc-raiders-companion';

    console.log('Fetching Arc Raiders game data...\n');

    // Fetch items from MetaForge API
    const itemsResponse = await fetchData('https://metaforge.app/api/arc-raiders/items');
    const items = itemsResponse.data || [];

    console.log(`✓ Fetched ${items.length} items\n`);

    if (items.length === 0) {
      console.warn('No items fetched. API might be unavailable.');
      process.exit(1);
    }

    // Write items to Firestore
    console.log('Writing items to Firestore emulator at 127.0.0.1:8080...\n');
    let count = 0;

    for (const item of items) {
      try {
        const docData = {
          id: item.id,
          name: item.name,
          description: item.description || '',
          rarity: item.rarity || 'Common',
          type: item.item_type || 'Material',
          iconUrl: item.icon || 'https://via.placeholder.com/150',
          stackSize: item.stackSize || 1,
          sellValue: item.value || 0,
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

        await writeToFirestore(projectId, 'items', item.id, docData);
        count++;

        if (count % 10 === 0) {
          console.log(`  ✓ Wrote ${count}/${items.length} items...`);
        }
      } catch (err) {
        console.error(`Failed to write item ${item.id}:`, err.message);
      }
    }

    console.log(`\n✓ Successfully wrote ${count} items to Firestore emulator!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding emulator:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Set a timeout to prevent hanging
setTimeout(() => {
  console.error('Script timeout - emulator took too long to respond');
  process.exit(1);
}, 60000); // 60 second timeout

// Run the seed function
seedEmulator();
