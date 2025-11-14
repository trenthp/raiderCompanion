import { EnemyLootTable } from '../types/gameData';

export const ENEMY_LOOT_TABLES: EnemyLootTable[] = [
  {
    id: 'enemy_wasp',
    enemyName: 'Wasp',
    possibleDrops: [
      { itemId: 'arc_wasp_driver', dropRate: 0.8, quantity: { min: 1, max: 2 } },
      { itemId: 'mat_metal_parts', dropRate: 0.5, quantity: { min: 5, max: 10 } },
      { itemId: 'mat_rubber_parts', dropRate: 0.3, quantity: { min: 3, max: 6 } }
    ]
  },
  {
    id: 'enemy_hornet',
    enemyName: 'Hornet',
    possibleDrops: [
      { itemId: 'arc_hornet_driver', dropRate: 0.8, quantity: { min: 1, max: 1 } },
      { itemId: 'mat_plastic_parts', dropRate: 0.6, quantity: { min: 8, max: 15 } }
    ]
  },
  {
    id: 'enemy_snitch',
    enemyName: 'Snitch',
    possibleDrops: [
      { itemId: 'arc_snitch_scanner', dropRate: 0.7, quantity: { min: 1, max: 2 } },
      { itemId: 'mat_chemicals', dropRate: 0.4, quantity: { min: 5, max: 10 } }
    ]
  },
  {
    id: 'enemy_leaper',
    enemyName: 'Leaper',
    possibleDrops: [
      { itemId: 'arc_leaper_pulse', dropRate: 0.75, quantity: { min: 1, max: 1 } },
      { itemId: 'mat_rubber_parts', dropRate: 0.5, quantity: { min: 10, max: 20 } }
    ]
  },
  {
    id: 'enemy_sentinel',
    enemyName: 'Sentinel',
    possibleDrops: [
      { itemId: 'arc_sentinel_core', dropRate: 0.7, quantity: { min: 1, max: 1 } },
      { itemId: 'mat_chemicals', dropRate: 0.4, quantity: { min: 5, max: 10 } }
    ]
  }
];

export const LOCATION_LOOT_MAPPING: Record<string, string[]> = {
  'Industrial': ['mat_metal_parts', 'mat_rubber_parts', 'arc_wasp_driver'],
  'Medical': ['mat_chemicals', 'mat_fabric'],
  'Nature': ['mat_plastic_parts', 'mat_chemicals'],
  'Residential': ['mat_fabric', 'mat_plastic_parts'],
  'Mechanical': ['mat_metal_parts', 'arc_hornet_driver']
};
