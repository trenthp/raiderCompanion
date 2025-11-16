/**
 * Static game data types - based on Arc Raiders community data-mining
 * These are read-only from the client
 */

/**
 * Interface for a document in the /items collection.
 */
export interface GameItem {
  id: string // Document ID
  name: string
  description: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Junk'
  iconUrl: string
  sellValue?: number
  recycleValue?: Array<{ itemId: string; quantity: number }>
  stackSize: number
  type: 'Weapon' | 'Armor' | 'Material' | 'Consumable' | 'Trinket'

  // Weapon-specific stats (optional)
  stats?: {
    damage: number
    dps: number
    fireRate: number
    magSize: number
    ammoType: 'Light' | 'Medium' | 'Heavy' | 'Energy'
    armorPenetration: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong'
  }
}

/**
 * Interface for a document in the /recipes collection.
 */
export interface CraftingRecipe {
  id: string // Document ID
  name: string
  outputItemId: string // Ref to GameItem
  outputQuantity: number
  workshopLevel: number
  ingredients: Array<{
    itemId: string // Ref to GameItem
    quantity: number
  }>
}

/**
 * Interface for a document in the /quests collection.
 */
export interface Quest {
  id: string // Document ID
  name: string
  description: string
  faction: string // e.g., "Celeste", "Scrappy"
  objectives: Array<{
    description: string
    type: 'Collect' | 'Kill' | 'Deliver' | 'Visit'
    targetId?: string // ItemID, EnemyID, or LocationID
    quantity?: number
  }>
  rewards: {
    credits?: number
    xp?: number
    items?: Array<{
      itemId: string
      quantity: number
    }>
  }
}

/**
 * Interface for a document in the /workshopUpgrades collection.
 */
export interface WorkshopUpgrade {
  id: string
  name: string
  description: string
  level: number
  benefits: string[]
  requirements: {
    credits?: number
    itemsRequired?: Array<{
      itemId: string
      quantity: number
    }>
  }
}

/**
 * Interface for a document in the /projects collection.
 */
export interface Project {
  id: string
  name: string
  description: string
  type: 'Build' | 'Research' | 'Craft'
  duration: number // in minutes
  requirements: {
    credits?: number
    items?: Array<{
      itemId: string
      quantity: number
    }>
  }
  rewards: {
    items?: Array<{
      itemId: string
      quantity: number
    }>
    xp?: number
  }
}

/**
 * Interface for a document in the /enemyLootTables collection.
 */
export interface EnemyLootTable {
  id: string
  enemyName: string
  possibleDrops: Array<{
    itemId: string
    dropRate: number // 0-1, probability
    quantity: {
      min: number
      max: number
    }
  }>
}

/**
 * Community loadout (shared version of UserLoadout)
 */
export interface CommunityLoadout {
  id: string
  name: string
  description: string
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string

  weapon1: string
  weapon2: string
  helmet: string
  chest: string
  legs: string
  gloves: string
  trinket1: string
  trinket2: string

  upvotes: number
  downvotes: number
  comments: number
}
