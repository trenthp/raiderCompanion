#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const SAMPLE_ITEMS = [
  {
    id: 'assault-rifle-01',
    name: 'Standard Assault Rifle',
    description: 'Reliable mid-range weapon with steady rate of fire',
    rarity: 'Common',
    type: 'Weapon',
    iconUrl: 'https://via.placeholder.com/150?text=Assault+Rifle',
    stackSize: 1,
    sellValue: 100,
    stats: { damage: 24, fireRate: 8.5, magSize: 30, range: 40 },
  },
  {
    id: 'sniper-rifle-01',
    name: 'Precision Sniper',
    description: 'High damage, low rate of fire. Perfect for long-range engagements',
    rarity: 'Rare',
    type: 'Weapon',
    iconUrl: 'https://via.placeholder.com/150?text=Sniper',
    stackSize: 1,
    sellValue: 500,
    stats: { damage: 95, fireRate: 1.2, magSize: 5, range: 90 },
  },
  {
    id: 'shotgun-01',
    name: 'Combat Shotgun',
    description: 'Close-range devastation',
    rarity: 'Uncommon',
    type: 'Weapon',
    iconUrl: 'https://via.placeholder.com/150?text=Shotgun',
    stackSize: 1,
    sellValue: 250,
    stats: { damage: 65, fireRate: 2, magSize: 8, range: 15 },
  },
  {
    id: 'smg-01',
    name: 'Submachine Gun',
    description: 'High fire rate, lower damage per shot',
    rarity: 'Common',
    type: 'Weapon',
    iconUrl: 'https://via.placeholder.com/150?text=SMG',
    stackSize: 1,
    sellValue: 150,
    stats: { damage: 14, fireRate: 15, magSize: 25, range: 25 },
  },
  {
    id: 'epic-rifle-01',
    name: 'Overclocked Plasma Rifle',
    description: 'Experimental weapon with unstable but powerful plasma rounds',
    rarity: 'Epic',
    type: 'Weapon',
    iconUrl: 'https://via.placeholder.com/150?text=Plasma',
    stackSize: 1,
    sellValue: 2000,
    stats: { damage: 78, fireRate: 6, magSize: 20, range: 50 },
  },
  {
    id: 'legendary-rifle-01',
    name: 'Void Striker',
    description: 'Legendary weapon forged in the depths of an alien world',
    rarity: 'Legendary',
    type: 'Weapon',
    iconUrl: 'https://via.placeholder.com/150?text=Void',
    stackSize: 1,
    sellValue: 5000,
    stats: { damage: 150, fireRate: 7.5, magSize: 15, range: 70 },
  },
  {
    id: 'armor-plating-01',
    name: 'Reinforced Armor Plating',
    description: 'Upgrades your suit defense by 15%',
    rarity: 'Uncommon',
    type: 'Armor',
    iconUrl: 'https://via.placeholder.com/150?text=Armor',
    stackSize: 3,
    sellValue: 75,
  },
  {
    id: 'ammunition-rifle-01',
    name: 'Rifle Ammunition',
    description: 'Standard ammunition for rifle weapons',
    rarity: 'Common',
    type: 'Ammo',
    iconUrl: 'https://via.placeholder.com/150?text=Ammo',
    stackSize: 999,
    sellValue: 5,
  },
  {
    id: 'ammunition-shotgun-01',
    name: 'Shotgun Shells',
    description: 'Ammunition for shotgun weapons',
    rarity: 'Common',
    type: 'Ammo',
    iconUrl: 'https://via.placeholder.com/150?text=Shells',
    stackSize: 50,
    sellValue: 10,
  },
  {
    id: 'health-pack-01',
    name: 'Medical Kit',
    description: 'Restores 50 health points when used',
    rarity: 'Common',
    type: 'Consumable',
    iconUrl: 'https://via.placeholder.com/150?text=Health',
    stackSize: 5,
    sellValue: 50,
  },
  {
    id: 'power-cell-01',
    name: 'Energy Cell',
    description: 'Powers advanced equipment and gadgets',
    rarity: 'Uncommon',
    type: 'Resource',
    iconUrl: 'https://via.placeholder.com/150?text=Energy',
    stackSize: 20,
    sellValue: 100,
  },
  {
    id: 'rare-alloy-01',
    name: 'Titanium Alloy',
    description: 'Rare material used in crafting rare-tier items',
    rarity: 'Rare',
    type: 'Material',
    iconUrl: 'https://via.placeholder.com/150?text=Alloy',
    stackSize: 10,
    sellValue: 300,
  },
  {
    id: 'blueprint-01',
    name: 'Enhanced Rifle Blueprint',
    description: 'Craft an enhanced assault rifle with better stats',
    rarity: 'Rare',
    type: 'Blueprint',
    iconUrl: 'https://via.placeholder.com/150?text=Blueprint',
    stackSize: 1,
    sellValue: 1000,
  },
  {
    id: 'junk-01',
    name: 'Broken Circuit Board',
    description: 'Salvageable for parts, minimal value',
    rarity: 'Junk',
    type: 'Junk',
    iconUrl: 'https://via.placeholder.com/150?text=Junk',
    stackSize: 15,
    sellValue: 5,
  },
  {
    id: 'junk-02',
    name: 'Rusty Metal Scrap',
    description: 'Old metal, not worth much',
    rarity: 'Junk',
    type: 'Junk',
    iconUrl: 'https://via.placeholder.com/150?text=Scrap',
    stackSize: 99,
    sellValue: 2,
  },
];

async function seedProduction() {
  console.log('🌱 Seeding production Firebase with sample items...\n');

  try {
    // Try to load service account from environment or file
    let credential;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      credential = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('Using service account from environment variable\n');
    } else {
      // Try to find service account file
      const serviceAccountPath = path.resolve('./serviceAccountKey.json');
      if (fs.existsSync(serviceAccountPath)) {
        credential = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        console.log('Using service account from serviceAccountKey.json\n');
      } else {
        console.error('❌ Error: No Firebase credentials found!');
        console.error('\nTo seed production Firebase, you need to:');
        console.error('1. Get a service account key from Firebase Console:');
        console.error('   Project Settings > Service Accounts > Generate new private key');
        console.error('2. Save it as serviceAccountKey.json in the project root');
        console.error('3. Add serviceAccountKey.json to .gitignore (already done)');
        console.error('4. Run: npm run seed:production\n');
        process.exit(1);
      }
    }

    const app = initializeApp({
      credential: cert(credential),
      projectId: 'raidercompanion',
    });

    const db = getFirestore(app);
    console.log('Connected to production Firebase\n');

    // Check if items already exist
    const itemsRef = db.collection('items');
    const snapshot = await itemsRef.limit(1).get();

    if (!snapshot.empty) {
      console.log('✓ Items already exist in production Firebase.');
      console.log('Skipping seed to avoid duplicates.\n');
      process.exit(0);
    }

    // Write items in batches
    const batch = db.batch();
    let count = 0;

    for (const item of SAMPLE_ITEMS) {
      const docRef = itemsRef.doc(item.id);
      batch.set(docRef, {
        ...item,
        updatedAt: new Date().toISOString(),
      });
      count++;
    }

    await batch.commit();

    console.log(`✅ Successfully seeded ${count} items to production Firebase!\n`);
    console.log('Items are now visible at http://localhost:5173/database\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding production Firebase:', error.message);
    process.exit(1);
  }
}

seedProduction();
