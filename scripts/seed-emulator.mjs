#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, query, limit, getDocs, connectFirestoreEmulator } from 'firebase/firestore';

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

async function waitForEmulator(maxAttempts = 30) {
  const firebaseConfig = { projectId: 'raidercompanion' };
  const app = initializeApp(firebaseConfig, { name: 'checker' });
  const db = getFirestore(app);
  
  // Connect explicitly to 127.0.0.1 (IPv4)
  connectFirestoreEmulator(db, '127.0.0.1', 8080);

  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`Attempting to connect to emulator (${i + 1}/${maxAttempts})...`);
      await getDocs(query(collection(db, '_dummy'), limit(1)));
      console.log('✓ Emulator is ready!\n');
      return db;
    } catch (error) {
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  throw new Error('Emulator failed to start after 30 seconds');
}

async function seedEmulator() {
  console.log('🌱 Seeding Firestore emulator with sample items...\n');

  try {
    // Wait for emulator to be ready
    const db = await waitForEmulator();

    // Check if items already exist
    const itemsRef = collection(db, 'items');
    const q = query(itemsRef, limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      console.log('✓ Items already seeded. Skipping.\n');
      process.exit(0);
    }

    // Write items
    let count = 0;
    console.log('Writing items to emulator...\n');
    for (const item of SAMPLE_ITEMS) {
      const docRef = doc(itemsRef, item.id);
      await setDoc(docRef, {
        ...item,
        updatedAt: new Date().toISOString(),
      });
      count++;
      process.stdout.write(`\r✓ Seeded ${count}/${SAMPLE_ITEMS.length} items`);
    }

    console.log(`\n\n✅ Successfully seeded ${count} items to emulator!\n`);
    console.log('Items are now available at http://localhost:5173/database\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding emulator:', error.message);
    console.error('\nMake sure:');
    console.error('1. Firebase emulator is running (npm run dev:emulators)');
    console.error('2. Port 8080 is available');
    console.error('3. Ports are not blocked by firewall');
    process.exit(1);
  }
}

seedEmulator();
