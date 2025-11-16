#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test user ID - update this to match a real user in your Firebase
const TEST_USER_ID = 'test-user-001';

// Sample stash items
const SAMPLE_STASH_ITEMS = [
  { itemId: 'item_assault_rifle', quantity: 2 },
  { itemId: 'item_shotgun', quantity: 1 },
  { itemId: 'item_sniper_rifle', quantity: 1 },
  { itemId: 'mat_metal_parts', quantity: 45 },
  { itemId: 'mat_plastic_parts', quantity: 30 },
  { itemId: 'mat_fabric', quantity: 25 },
  { itemId: 'mat_chemical_parts', quantity: 18 },
  { itemId: 'item_bandage', quantity: 10 },
  { itemId: 'item_medical_kit', quantity: 3 },
  { itemId: 'item_helmet_tactical', quantity: 1 },
  { itemId: 'item_chest_tactical', quantity: 1 },
  { itemId: 'item_stim_pack', quantity: 5 },
];

// Sample tracked goals
const SAMPLE_GOALS = [
  {
    type: 'ITEM',
    targetId: 'item_vertical_grip_1',
    targetName: 'Vertical Grip I',
    targetQuantity: 3,
    currentQuantity: 1,
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
  {
    type: 'RECIPE',
    targetId: 'recipe_extended_mag_1',
    targetName: 'Extended Magazine I',
    targetQuantity: 5,
    currentQuantity: 2,
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
  },
  {
    type: 'UPGRADE',
    targetId: 'upgrade_gunsmith_1',
    targetName: 'Gunsmith Level 1',
    targetQuantity: 1,
    currentQuantity: 0,
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
];

async function seedTestUserData() {
  console.log(`🌱 Seeding test data for user: ${TEST_USER_ID}\n`);

  try {
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      credential = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('Using service account from environment variable\n');
    } else {
      const serviceAccountPath = path.resolve(path.join(__dirname, '..', 'serviceAccountKey.json'));
      if (fs.existsSync(serviceAccountPath)) {
        credential = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        console.log('Using service account from serviceAccountKey.json\n');
      } else {
        console.error('❌ Error: No Firebase credentials found!');
        process.exit(1);
      }
    }

    const app = initializeApp({
      credential: cert(credential),
      projectId: 'raidercompanion',
    });

    const db = getFirestore(app);
    console.log('Connected to production Firebase\n');

    const batch = db.batch();
    let count = 0;

    // Seed stash items
    console.log('🎒 Seeding stash items...');
    for (const item of SAMPLE_STASH_ITEMS) {
      const docRef = db.collection('users').doc(TEST_USER_ID).collection('userStash').doc(item.itemId);
      batch.set(docRef, {
        quantity: item.quantity,
        addedAt: new Date().toISOString(),
      });
      count++;
    }
    console.log(`  ✓ ${SAMPLE_STASH_ITEMS.length} stash items queued\n`);

    // Seed tracked goals
    console.log('🎯 Seeding tracked goals...');
    for (const goal of SAMPLE_GOALS) {
      const docRef = db.collection('users').doc(TEST_USER_ID).collection('userTrackedGoals').doc();
      batch.set(docRef, goal);
      count++;
    }
    console.log(`  ✓ ${SAMPLE_GOALS.length} goals queued\n`);

    // Commit batch
    await batch.commit();
    console.log(`✅ Successfully seeded ${count} documents for test user!\n`);
    console.log(`Test user ID: ${TEST_USER_ID}`);
    console.log(`Make sure to log in with this user ID to see the test data.\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test data:', error.message);
    process.exit(1);
  }
}

seedTestUserData();
