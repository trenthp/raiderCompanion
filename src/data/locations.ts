import { GameItem } from '../types/gameData';

/**
 * Arc Raiders game locations
 * Defines areas where players can farm loot, find enemies, and complete missions
 */

export interface Location {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Legendary';
  recommendedLevel: number;
  commonEnemies: string[]; // Enemy type IDs
  rareEnemies?: string[];
  lootTable: {
    itemId: string;
    dropChance: number; // 0-100
    quantityMin: number;
    quantityMax: number;
  }[];
  environmentalHazards?: string[];
  secrets?: number; // Number of hidden caches
}

export const LOCATIONS: Location[] = [
  {
    id: 'location_industrial_zone',
    name: 'Industrial Zone',
    description: 'Sprawling factory complex with heavy machinery and structural hazards',
    difficulty: 'Normal',
    recommendedLevel: 5,
    commonEnemies: ['enemy_wasp', 'enemy_hornet'],
    rareEnemies: ['enemy_sentinel'],
    lootTable: [
      { itemId: 'mat_metal_parts', dropChance: 80, quantityMin: 2, quantityMax: 5 },
      { itemId: 'mat_rubber_parts', dropChance: 60, quantityMin: 1, quantityMax: 3 },
      { itemId: 'mat_mechanical_components', dropChance: 30, quantityMin: 1, quantityMax: 2 },
      { itemId: 'mat_wasp_driver', dropChance: 40, quantityMin: 1, quantityMax: 2 },
      { itemId: 'ammo_rifle_standard', dropChance: 50, quantityMin: 10, quantityMax: 25 },
    ],
    environmentalHazards: ['Toxic Gas Vents', 'Electrical Surges'],
    secrets: 3,
  },
  {
    id: 'location_medical_facility',
    name: 'Medical Facility',
    description: 'Abandoned research lab filled with chemical compounds and biohazards',
    difficulty: 'Hard',
    recommendedLevel: 10,
    commonEnemies: ['enemy_hornet', 'enemy_snitch'],
    rareEnemies: ['enemy_leaper'],
    lootTable: [
      { itemId: 'mat_chemical_parts', dropChance: 75, quantityMin: 2, quantityMax: 4 },
      { itemId: 'mat_plastic_parts', dropChance: 55, quantityMin: 1, quantityMax: 3 },
      { itemId: 'item_medical_kit', dropChance: 45, quantityMin: 1, quantityMax: 1 },
      { itemId: 'item_vita_spray', dropChance: 25, quantityMin: 1, quantityMax: 1 },
      { itemId: 'mat_tech_chip', dropChance: 15, quantityMin: 1, quantityMax: 1 },
    ],
    environmentalHazards: ['Biohazard Zones', 'Radiation'],
    secrets: 4,
  },
  {
    id: 'location_central_command',
    name: 'Central Command',
    description: 'Heavily fortified military installation with advanced security systems',
    difficulty: 'Hard',
    recommendedLevel: 12,
    commonEnemies: ['enemy_sentinel', 'enemy_wasp'],
    rareEnemies: ['enemy_alpha_sentinel'],
    lootTable: [
      { itemId: 'mat_advanced_tech', dropChance: 60, quantityMin: 1, quantityMax: 2 },
      { itemId: 'mat_mechanical_components', dropChance: 70, quantityMin: 2, quantityMax: 3 },
      { itemId: 'item_extended_mag_2', dropChance: 20, quantityMin: 1, quantityMax: 1 },
      { itemId: 'item_compensator_2', dropChance: 15, quantityMin: 1, quantityMax: 1 },
      { itemId: 'mat_tech_chip', dropChance: 40, quantityMin: 1, quantityMax: 2 },
      { itemId: 'ammo_sniper_rounds', dropChance: 35, quantityMin: 5, quantityMax: 15 },
    ],
    environmentalHazards: ['Automated Defenses', 'Lockdown Zones'],
    secrets: 5,
  },
  {
    id: 'location_outpost_alpha',
    name: 'Outpost Alpha',
    description: 'Remote military outpost with moderate defenses and supply caches',
    difficulty: 'Normal',
    recommendedLevel: 7,
    commonEnemies: ['enemy_wasp', 'enemy_snitch'],
    lootTable: [
      { itemId: 'mat_metal_parts', dropChance: 70, quantityMin: 1, quantityMax: 3 },
      { itemId: 'mat_fabric', dropChance: 50, quantityMin: 1, quantityMax: 2 },
      { itemId: 'ammo_rifle_standard', dropChance: 60, quantityMin: 15, quantityMax: 30 },
      { itemId: 'item_bandage', dropChance: 40, quantityMin: 1, quantityMax: 2 },
      { itemId: 'mat_wasp_driver', dropChance: 30, quantityMin: 1, quantityMax: 1 },
    ],
    environmentalHazards: ['Dust Storms'],
    secrets: 2,
  },
  {
    id: 'location_underground_cavern',
    name: 'Underground Cavern',
    description: 'Deep cave system with rare minerals and dangerous creatures',
    difficulty: 'Legendary',
    recommendedLevel: 15,
    commonEnemies: ['enemy_leaper', 'enemy_sentinel'],
    rareEnemies: ['enemy_apex_leaper', 'enemy_alpha_sentinel'],
    lootTable: [
      { itemId: 'mat_synthetic_polymer', dropChance: 70, quantityMin: 1, quantityMax: 2 },
      { itemId: 'mat_advanced_tech', dropChance: 65, quantityMin: 1, quantityMax: 3 },
      { itemId: 'mat_tech_chip', dropChance: 55, quantityMin: 1, quantityMax: 2 },
      { itemId: 'special_blueprint_fragment', dropChance: 40, quantityMin: 1, quantityMax: 1 },
      { itemId: 'special_field_upgrade_module', dropChance: 10, quantityMin: 1, quantityMax: 1 },
    ],
    environmentalHazards: ['Extreme Darkness', 'Unstable Terrain', 'Radiation Zones'],
    secrets: 6,
  },
  {
    id: 'location_city_ruins',
    name: 'City Ruins',
    description: 'Sprawling urban area with multiple buildings and diverse loot',
    difficulty: 'Normal',
    recommendedLevel: 8,
    commonEnemies: ['enemy_hornet', 'enemy_snitch'],
    rareEnemies: ['enemy_wasp'],
    lootTable: [
      { itemId: 'mat_plastic_parts', dropChance: 75, quantityMin: 1, quantityMax: 4 },
      { itemId: 'mat_fabric', dropChance: 65, quantityMin: 1, quantityMax: 3 },
      { itemId: 'ammo_smg_rounds', dropChance: 45, quantityMin: 20, quantityMax: 50 },
      { itemId: 'special_cache_key', dropChance: 15, quantityMin: 1, quantityMax: 1 },
      { itemId: 'mat_rubber_parts', dropChance: 55, quantityMin: 1, quantityMax: 2 },
    ],
    environmentalHazards: ['Collapsing Structures', 'Unstable Ground'],
    secrets: 4,
  },
  {
    id: 'location_research_lab',
    name: 'Research Lab',
    description: 'State-of-the-art research facility with experimental equipment and data',
    difficulty: 'Hard',
    recommendedLevel: 11,
    commonEnemies: ['enemy_sentinel', 'enemy_leaper'],
    rareEnemies: ['enemy_alpha_sentinel'],
    lootTable: [
      { itemId: 'mat_advanced_tech', dropChance: 80, quantityMin: 1, quantityMax: 3 },
      { itemId: 'mat_mechanical_components', dropChance: 65, quantityMin: 1, quantityMax: 2 },
      { itemId: 'mat_tech_chip', dropChance: 50, quantityMin: 1, quantityMax: 2 },
      { itemId: 'quest_item_data_drive', dropChance: 5, quantityMin: 1, quantityMax: 1 },
      { itemId: 'special_blueprint_fragment', dropChance: 30, quantityMin: 1, quantityMax: 1 },
    ],
    environmentalHazards: ['Electrical Hazards', 'Lockdown Zones'],
    secrets: 3,
  },
  {
    id: 'location_desert_plateau',
    name: 'Desert Plateau',
    description: 'Arid highlands with extreme weather conditions and minimal shelter',
    difficulty: 'Easy',
    recommendedLevel: 3,
    commonEnemies: ['enemy_wasp', 'enemy_hornet'],
    lootTable: [
      { itemId: 'mat_metal_parts', dropChance: 50, quantityMin: 1, quantityMax: 2 },
      { itemId: 'mat_rubber_parts', dropChance: 40, quantityMin: 1, quantityMax: 1 },
      { itemId: 'ammo_pistol_rounds', dropChance: 30, quantityMin: 10, quantityMax: 20 },
      { itemId: 'mat_wasp_driver', dropChance: 20, quantityMin: 1, quantityMax: 1 },
    ],
    environmentalHazards: ['Sandstorms', 'Extreme Heat'],
    secrets: 1,
  },
];

/**
 * Helper functions for location queries
 */

export const getLocationById = (locationId: string): Location | undefined => {
  return LOCATIONS.find(loc => loc.id === locationId);
};

export const getLocationByName = (name: string): Location | undefined => {
  return LOCATIONS.find(loc => loc.name.toLowerCase() === name.toLowerCase());
};

export const getLocationsByDifficulty = (difficulty: string): Location[] => {
  return LOCATIONS.filter(loc => loc.difficulty === difficulty);
};

export const getLocationsByEnemyType = (enemyType: string): Location[] => {
  return LOCATIONS.filter(loc =>
    loc.commonEnemies.includes(enemyType) ||
    (loc.rareEnemies && loc.rareEnemies.includes(enemyType))
  );
};

export const getLocationsWithLootItem = (itemId: string): Location[] => {
  return LOCATIONS.filter(loc =>
    loc.lootTable.some(loot => loot.itemId === itemId)
  );
};

export const getLootChanceForItem = (locationId: string, itemId: string): number | null => {
  const location = getLocationById(locationId);
  if (!location) return null;

  const lootEntry = location.lootTable.find(loot => loot.itemId === itemId);
  return lootEntry ? lootEntry.dropChance : null;
};
