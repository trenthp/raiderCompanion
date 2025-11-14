#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Game data
const RECIPES = [
  {
    id: 'recipe_vertical_grip_1',
    name: 'Vertical Grip I',
    outputItemId: 'item_vertical_grip_1',
    outputQuantity: 1,
    workshopLevel: 1,
    ingredients: [
      { itemId: 'mat_plastic_parts', quantity: 6 },
      { itemId: 'mat_fabric', quantity: 2 }
    ]
  },
  {
    id: 'recipe_vertical_grip_2',
    name: 'Vertical Grip II',
    outputItemId: 'item_vertical_grip_2',
    outputQuantity: 1,
    workshopLevel: 2,
    ingredients: [
      { itemId: 'mat_plastic_parts', quantity: 10 },
      { itemId: 'mat_mechanical_components', quantity: 3 }
    ]
  },
  {
    id: 'recipe_compensator_1',
    name: 'Compensator I',
    outputItemId: 'item_compensator_1',
    outputQuantity: 1,
    workshopLevel: 1,
    ingredients: [
      { itemId: 'mat_metal_parts', quantity: 8 },
      { itemId: 'mat_rubber_parts', quantity: 4 }
    ]
  },
  {
    id: 'recipe_compensator_2',
    name: 'Compensator II',
    outputItemId: 'item_compensator_2',
    outputQuantity: 1,
    workshopLevel: 2,
    ingredients: [
      { itemId: 'mat_metal_parts', quantity: 12 },
      { itemId: 'mat_mechanical_components', quantity: 2 }
    ]
  },
  {
    id: 'recipe_extended_mag_1',
    name: 'Extended Magazine I',
    outputItemId: 'item_extended_mag_1',
    outputQuantity: 1,
    workshopLevel: 1,
    ingredients: [
      { itemId: 'mat_plastic_parts', quantity: 8 },
      { itemId: 'mat_metal_parts', quantity: 5 }
    ]
  },
  {
    id: 'recipe_extended_mag_2',
    name: 'Extended Magazine II',
    outputItemId: 'item_extended_mag_2',
    outputQuantity: 1,
    workshopLevel: 2,
    ingredients: [
      { itemId: 'mat_plastic_parts', quantity: 15 },
      { itemId: 'mat_metal_parts', quantity: 10 },
      { itemId: 'mat_mechanical_components', quantity: 2 }
    ]
  },
  {
    id: 'recipe_bandage',
    name: 'Bandage',
    outputItemId: 'item_bandage',
    outputQuantity: 3,
    workshopLevel: 0,
    ingredients: [
      { itemId: 'mat_fabric', quantity: 2 }
    ]
  },
  {
    id: 'recipe_medical_kit',
    name: 'Medical Kit',
    outputItemId: 'item_medical_kit',
    outputQuantity: 1,
    workshopLevel: 1,
    ingredients: [
      { itemId: 'mat_fabric', quantity: 5 },
      { itemId: 'mat_chemical_parts', quantity: 3 }
    ]
  },
  {
    id: 'recipe_vita_spray',
    name: 'Vita Spray',
    outputItemId: 'item_vita_spray',
    outputQuantity: 1,
    workshopLevel: 2,
    ingredients: [
      { itemId: 'mat_chemical_parts', quantity: 8 },
      { itemId: 'mat_fabric', quantity: 4 },
      { itemId: 'mat_advanced_tech', quantity: 2 }
    ]
  },
  {
    id: 'recipe_stim_pack',
    name: 'Combat Stim Pack',
    outputItemId: 'item_stim_pack',
    outputQuantity: 1,
    workshopLevel: 2,
    ingredients: [
      { itemId: 'mat_chemical_parts', quantity: 6 },
      { itemId: 'mat_synthetic_polymer', quantity: 2 }
    ]
  }
];

const WORKSHOPS = [
  {
    id: 'upgrade_gunsmith_1',
    name: 'Gunsmith Level 1',
    description: 'Unlock basic weapon attachments',
    level: 1,
    benefits: ['Vertical Grip I', 'Compensator I', 'Extended Magazine I'],
    requirements: {
      itemsRequired: [
        { itemId: 'mat_metal_parts', quantity: 20 },
        { itemId: 'mat_rubber_parts', quantity: 30 }
      ]
    }
  },
  {
    id: 'upgrade_gunsmith_2',
    name: 'Gunsmith Level 2',
    description: 'Unlock advanced weapon attachments',
    level: 2,
    benefits: ['Vertical Grip II', 'Compensator II', 'Extended Magazine II', 'Scope 2x', 'Red Dot Sight'],
    requirements: {
      itemsRequired: [
        { itemId: 'mat_wasp_driver', quantity: 8 },
        { itemId: 'mat_mechanical_components', quantity: 5 }
      ]
    }
  },
  {
    id: 'upgrade_gunsmith_3',
    name: 'Gunsmith Level 3',
    description: 'Unlock elite weapon attachments',
    level: 3,
    benefits: ['Scope 4x Tactical', 'Advanced Optics'],
    requirements: {
      itemsRequired: [
        { itemId: 'mat_advanced_tech', quantity: 10 },
        { itemId: 'mat_tech_chip', quantity: 5 }
      ]
    }
  },
  {
    id: 'upgrade_medical_lab_1',
    name: 'Medical Lab Level 1',
    description: 'Unlock basic healing items',
    level: 1,
    benefits: ['Bandage', 'Medical Kit'],
    requirements: {
      itemsRequired: [
        { itemId: 'mat_fabric', quantity: 15 },
        { itemId: 'mat_chemical_parts', quantity: 10 }
      ]
    }
  },
  {
    id: 'upgrade_medical_lab_2',
    name: 'Medical Lab Level 2',
    description: 'Unlock advanced healing items',
    level: 2,
    benefits: ['Vita Spray', 'Combat Stim Pack'],
    requirements: {
      itemsRequired: [
        { itemId: 'mat_chemical_parts', quantity: 20 },
        { itemId: 'mat_advanced_tech', quantity: 5 }
      ]
    }
  },
  {
    id: 'upgrade_medical_lab_3',
    name: 'Medical Lab Level 3',
    description: 'Unlock elite healing items',
    level: 3,
    benefits: ['Adrenaline Shot', 'Regeneration Kit'],
    requirements: {
      itemsRequired: [
        { itemId: 'mat_synthetic_polymer', quantity: 8 },
        { itemId: 'mat_tech_chip', quantity: 3 }
      ]
    }
  }
];

const QUESTS = [
  {
    id: 'quest_prologue_extraction',
    name: 'Extraction Protocol',
    description: 'Escape the initial crash site and reach the safehouse',
    faction: 'Celeste',
    objectives: [
      { description: 'Reach the extraction point', type: 'Visit', targetId: 'location_desert_plateau' },
      { description: 'Eliminate initial threats', type: 'Kill', quantity: 5 },
      { description: 'Secure your loadout', type: 'Collect', targetId: 'weapon_pistol_sidearm' }
    ],
    rewards: {
      xp: 100,
      items: [
        { itemId: 'weapon_pistol_sidearm', quantity: 1 },
        { itemId: 'ammo_pistol_rounds', quantity: 50 }
      ]
    }
  },
  {
    id: 'quest_industrial_zone_incursion',
    name: 'Industrial Zone Incursion',
    description: 'Clear the Industrial Zone and recover critical components',
    faction: 'Celeste',
    objectives: [
      { description: 'Navigate the factory floors', type: 'Visit', targetId: 'location_industrial_zone' },
      { description: 'Eliminate Wasp swarms', type: 'Kill', quantity: 15 },
      { description: 'Recover the data core', type: 'Collect', targetId: 'mat_tech_chip' },
      { description: 'Escape before lockdown', type: 'Visit', targetId: 'location_industrial_zone' }
    ],
    rewards: {
      xp: 400,
      items: [
        { itemId: 'mat_mechanical_components', quantity: 8 },
        { itemId: 'mat_wasp_driver', quantity: 10 }
      ]
    }
  }
];

async function seedGameData() {
  console.log('🌱 Seeding game data to Firebase...\n');

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

    // Seed recipes
    console.log('📝 Seeding recipes...');
    for (const recipe of RECIPES) {
      const docRef = db.collection('recipes').doc(recipe.id);
      batch.set(docRef, recipe);
      count++;
    }
    console.log(`  ✓ ${RECIPES.length} recipes queued\n`);

    // Seed workshops
    console.log('🔧 Seeding workshop upgrades...');
    for (const workshop of WORKSHOPS) {
      const docRef = db.collection('workshopUpgrades').doc(workshop.id);
      batch.set(docRef, workshop);
      count++;
    }
    console.log(`  ✓ ${WORKSHOPS.length} workshops queued\n`);

    // Seed quests
    console.log('⚔️  Seeding quests...');
    for (const quest of QUESTS) {
      const docRef = db.collection('quests').doc(quest.id);
      batch.set(docRef, quest);
      count++;
    }
    console.log(`  ✓ ${QUESTS.length} quests queued\n`);

    // Commit batch
    await batch.commit();
    console.log(`✅ Successfully seeded ${count} documents to production Firebase!\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding game data:', error.message);
    process.exit(1);
  }
}

seedGameData();
