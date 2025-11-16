// API Type Definitions
export type ItemType = 
  | 'weapon'
  | 'attachment'
  | 'armor'
  | 'consumable'
  | 'material'
  | 'key'
  | 'quest_item'
  | 'utility';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: Rarity;
  
  // Stats
  weight: number;
  stackSize: number;
  value: number;
  
  // Visual
  image?: string;
  icon?: string;
  
  // Gameplay
  stats?: ItemStats;
  requirements?: ItemRequirements;
  
  // Relationships
  usedIn?: UsedIn[];
  craftedFrom?: CraftingRecipe;
  foundIn?: Location[];
  soldBy?: TraderInfo[];
  
  // Meta
  wikiUrl?: string;
  lastUpdated?: string;
}

export interface ItemStats {
  // Weapon Stats
  damage?: number;
  fireRate?: number;
  magazineSize?: number;
  reloadTime?: number;
  effectiveRange?: number;
  
  // Armor Stats
  protection?: number;
  durability?: number;
  
  // Consumable Stats
  healAmount?: number;
  duration?: number;
  effect?: string;
}

export interface ItemRequirements {
  level?: number;
  skills?: { [skillName: string]: number };
  prerequisites?: string[];
}

export interface UsedIn {
  type: 'quest' | 'craft' | 'hideout' | 'trade';
  id: string;
  name: string;
  quantity: number;
}

export interface CraftingRecipe {
  benchRequired: string;
  craftTime: number;
  materials: {
    itemId: string;
    quantity: number;
    name: string;
  }[];
}

export interface Location {
  map: string;
  area?: string;
  lootType: 'arc_loot' | 'world_spawn' | 'container';
  dropRate?: number;
}

export interface TraderInfo {
  traderId: string;
  traderName: string;
  price: number;
  currency: 'credits' | 'scraps';
  stockQuantity?: number;
}

export interface ItemsResponse {
  items: Item[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}

// ARC Types
export type ArcType = 
  | 'supply_drop'
  | 'facility'
  | 'extraction'
  | 'event'
  | 'boss';

export interface Arc {
  id: string;
  name: string;
  description: string;
  type: ArcType;
  difficulty: Difficulty;
  
  // Location
  map: string;
  coordinates?: { x: number; y: number };
  area: string;
  
  // Requirements
  requirements: {
    keys?: string[];
    recommendedLevel?: number;
    recommendedGear?: string[];
    minPlayers?: number;
    maxPlayers?: number;
  };
  
  // Rewards
  rewards: {
    credits: number;
    experience: number;
    guaranteedLoot?: string[];
    possibleLoot?: LootTable[];
  };
  
  // Gameplay
  estimatedDuration: number;
  respawnTime?: number;
  objectives?: Objective[];
  
  // Related
  relatedQuests?: string[];
  
  // Meta
  popularity?: number;
  lastUpdated?: string;
}

export interface LootTable {
  itemId: string;
  itemName: string;
  dropChance: number;
  minQuantity: number;
  maxQuantity: number;
}

export interface Objective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'activate' | 'defend' | 'extract';
  target?: string;
  quantity?: number;
  optional: boolean;
}

// Quest Types
export interface Quest {
  id: string;
  name: string;
  description: string;
  storyline?: string;
  
  // Quest Giver
  questGiver: {
    traderId: string;
    traderName: string;
  };
  
  // Requirements
  requirements: {
    level?: number;
    previousQuests?: string[];
    items?: QuestItemRequirement[];
  };
  
  // Objectives
  objectives: QuestObjective[];
  
  // Rewards
  rewards: {
    experience: number;
    credits: number;
    reputation?: { trader: string; amount: number };
    items?: RewardItem[];
    unlocksAccess?: string[];
  };
  
  // Meta
  isRepeatable: boolean;
  estimatedTime: number;
  difficulty: Difficulty;
  popularity?: number;
  
  // Progress
  progress?: {
    completed: boolean;
    objectivesCompleted: number;
    totalObjectives: number;
  };
}

export interface QuestItemRequirement {
  itemId: string;
  itemName: string;
  quantity: number;
  foundInRaid: boolean;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'collect' | 'kill' | 'survive' | 'extract' | 'locate';
  target?: string;
  quantity?: number;
  map?: string;
  completed?: boolean;
}

export interface RewardItem {
  itemId: string;
  itemName: string;
  quantity: number;
}

// Trader Types
export interface Trader {
  id: string;
  name: string;
  description: string;
  location: string;
  
  // Requirements
  unlockRequirements?: {
    level?: number;
    quests?: string[];
    reputation?: number;
  };
  
  // Inventory
  inventory: TraderInventoryItem[];
  
  // Buy/Sell
  buyRateModifier: number;
  sellRateModifier: number;
  
  // Reputation
  reputation?: {
    current: number;
    max: number;
    level: number;
    perks?: string[];
  };
  
  // Meta
  image?: string;
  lastUpdated?: string;
}

export interface TraderInventoryItem {
  itemId: string;
  itemName: string;
  price: number;
  currency: 'credits' | 'scraps';
  stockQuantity?: number;
  restockTime?: number;
  loyaltyLevelRequired?: number;
}

// API Query Parameters
export interface ItemsQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  name?: string;
  required_for?: string;
  includeComponents?: boolean;
}

export interface ArcsQueryParams {
  map?: string;
  difficulty?: string;
  includeLoot?: boolean;
}

export interface QuestsQueryParams {
  active?: boolean;
  completed?: boolean;
  trader?: string;
}
