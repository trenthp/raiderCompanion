import type { Item } from './api';

export type LoadoutType = 'solo_pve' | 'squad_pve' | 'pvp' | 'stealth' | 'farming' | 'boss_hunting';

export interface ItemSlot {
  item: Item;
  quantity?: number;
  notes?: string;
}

export interface WeaponSlot extends ItemSlot {
  attachments: {
    optic?: ItemSlot;
    barrel?: ItemSlot;
    grip?: ItemSlot;
    magazine?: ItemSlot;
    stock?: ItemSlot;
    other?: ItemSlot;
  };
}

export interface Loadout {
  id: string;
  name: string;
  type: LoadoutType;
  createdAt: string;
  updatedAt: string;
  
  slots: {
    primaryWeapon?: WeaponSlot;
    secondaryWeapon?: WeaponSlot;
    melee?: ItemSlot;
    armor?: {
      helmet?: ItemSlot;
      vest?: ItemSlot;
      backpack?: ItemSlot;
    };
    utilities: ItemSlot[];
    consumables: ItemSlot[];
  };
  
  stats: LoadoutStats;
  tags?: string[];
}

export interface LoadoutStats {
  totalWeight: number;
  maxWeight: number;
  totalValue: number;
  estimatedDPS?: number;
  armor?: number;
  mobility?: number;
  carryCapacity?: number;
}

export interface Goal {
  id: string;
  type: 'quest' | 'hideout_module' | 'craft' | 'trader_unlock' | 'skill_unlock';
  targetId: string;
  targetName: string;
  priority: number;
  addedAt: string;
  
  requirements: GoalRequirement[];
  progress?: GoalProgress;
}

export interface GoalRequirement {
  type: 'item' | 'credits' | 'level' | 'quest_completion';
  targetId?: string;
  targetName: string;
  quantityNeeded: number;
  quantityHave: number;
  completed: boolean;
}

export interface GoalProgress {
  percentComplete: number;
  estimatedTimeToComplete?: number;
  blockedBy?: string[];
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  
  items: ShoppingListItem[];
  
  summary: {
    totalItems: number;
    itemsCollected: number;
    totalValue: number;
    estimatedFarmTime: number;
  };
}

export interface ShoppingListItem {
  item: Item;
  quantityNeeded: number;
  quantityHave: number;
  priority: number;
  
  sources: ItemSource[];
  
  markedAsCollected: boolean;
  notes?: string;
}

export interface ItemSource {
  type: 'arc_loot' | 'trader' | 'craft' | 'world_spawn';
  location?: string;
  dropRate?: number;
  price?: number;
  craftTime?: number;
  efficiency: number;
}
