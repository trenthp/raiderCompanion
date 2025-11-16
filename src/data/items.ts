import { GameItem } from '../types/gameData';

/**
 * Comprehensive Arc Raiders item definitions
 * Organized by category for easier maintenance and querying
 */

// WEAPONS
const WEAPONS: GameItem[] = [
  {
    id: 'weapon_assault_rifle_standard',
    name: 'Standard Assault Rifle',
    type: 'Weapon',
    rarity: 'Common',
    description: 'Reliable mid-range weapon with steady rate of fire',
    iconUrl: 'https://via.placeholder.com/80?text=AssaultRifle',
    stackSize: 1,
    stats: { damage: 24, dps: 204, fireRate: 8.5, magSize: 30, ammoType: 'Medium', armorPenetration: 'Moderate' },
    sellValue: 100,
  },
  {
    id: 'weapon_sniper_rifle_precision',
    name: 'Precision Sniper Rifle',
    type: 'Weapon',
    rarity: 'Rare',
    description: 'High damage, low rate of fire. Perfect for long-range engagements',
    iconUrl: 'https://via.placeholder.com/80?text=SniperRifle',
    stackSize: 1,
    stats: { damage: 95, dps: 114, fireRate: 1.2, magSize: 5, ammoType: 'Heavy', armorPenetration: 'Very Strong' },
    sellValue: 500,
  },
  {
    id: 'weapon_shotgun_combat',
    name: 'Combat Shotgun',
    type: 'Weapon',
    rarity: 'Uncommon',
    description: 'Close-range devastation with wide spread',
    iconUrl: 'https://via.placeholder.com/80?text=Shotgun',
    stackSize: 1,
    stats: { damage: 65, dps: 130, fireRate: 2, magSize: 8, ammoType: 'Heavy', armorPenetration: 'Strong' },
    sellValue: 250,
  },
  {
    id: 'weapon_smg_standard',
    name: 'Submachine Gun',
    type: 'Weapon',
    rarity: 'Common',
    description: 'High fire rate, lower damage per shot',
    iconUrl: 'https://via.placeholder.com/80?text=SMG',
    stackSize: 1,
    stats: { damage: 14, dps: 210, fireRate: 15, magSize: 25, ammoType: 'Light', armorPenetration: 'Weak' },
    sellValue: 150,
  },
  {
    id: 'weapon_pistol_sidearm',
    name: 'Combat Pistol',
    type: 'Weapon',
    rarity: 'Common',
    description: 'Standard sidearm with good handling',
    iconUrl: 'https://via.placeholder.com/80?text=Pistol',
    stackSize: 1,
    stats: { damage: 18, dps: 108, fireRate: 6, magSize: 12, ammoType: 'Light', armorPenetration: 'Weak' },
    sellValue: 75,
  },
];

// ARMOR
const ARMOR: GameItem[] = [
  {
    id: 'armor_chest_tactical',
    name: 'Tactical Chest Plate',
    type: 'Armor',
    rarity: 'Uncommon',
    description: 'Reinforced chest protection with balanced mobility',
    iconUrl: 'https://via.placeholder.com/80?text=ChestArmor',
    stackSize: 1,
    sellValue: 200,
  },
  {
    id: 'armor_head_reinforced',
    name: 'Reinforced Helmet',
    type: 'Armor',
    rarity: 'Uncommon',
    description: 'Protects against headshots and critical hits',
    iconUrl: 'https://via.placeholder.com/80?text=Helmet',
    stackSize: 1,
    sellValue: 150,
  },
  {
    id: 'armor_legs_padded',
    name: 'Padded Leg Guards',
    type: 'Armor',
    rarity: 'Common',
    description: 'Flexible leg protection without restricting movement',
    iconUrl: 'https://via.placeholder.com/80?text=Legs',
    stackSize: 1,
    sellValue: 100,
  },
  {
    id: 'armor_gloves_tactical',
    name: 'Tactical Gloves',
    type: 'Armor',
    rarity: 'Common',
    description: 'Improved grip and hand protection',
    iconUrl: 'https://via.placeholder.com/80?text=Gloves',
    stackSize: 1,
    sellValue: 75,
  },
  {
    id: 'armor_boots_reinforced',
    name: 'Reinforced Boots',
    type: 'Armor',
    rarity: 'Common',
    description: 'Durable footwear for harsh terrain',
    iconUrl: 'https://via.placeholder.com/80?text=Boots',
    stackSize: 1,
    sellValue: 80,
  },
];

// TRINKETS (Weapon Attachments & Upgrades categorized as Trinkets)
const TRINKETS: GameItem[] = [
  // Grips
  {
    id: 'item_vertical_grip_1',
    name: 'Vertical Grip I',
    type: 'Trinket',
    rarity: 'Common',
    description: 'Reduces vertical recoil by 10%',
    iconUrl: 'https://via.placeholder.com/80?text=Grip1',
    stackSize: 1,
    sellValue: 50,
  },
  {
    id: 'item_vertical_grip_2',
    name: 'Vertical Grip II',
    type: 'Trinket',
    rarity: 'Uncommon',
    description: 'Reduces vertical recoil by 20%',
    iconUrl: 'https://via.placeholder.com/80?text=Grip2',
    stackSize: 1,
    sellValue: 150,
  },
  // Muzzles
  {
    id: 'item_compensator_1',
    name: 'Compensator I',
    type: 'Trinket',
    rarity: 'Common',
    description: 'Reduces horizontal recoil by 8%',
    iconUrl: 'https://via.placeholder.com/80?text=Comp1',
    stackSize: 1,
    sellValue: 45,
  },
  {
    id: 'item_compensator_2',
    name: 'Compensator II',
    type: 'Trinket',
    rarity: 'Uncommon',
    description: 'Reduces horizontal recoil by 15%',
    iconUrl: 'https://via.placeholder.com/80?text=Comp2',
    stackSize: 1,
    sellValue: 120,
  },
  // Magazines
  {
    id: 'item_extended_mag_1',
    name: 'Extended Magazine I',
    type: 'Trinket',
    rarity: 'Common',
    description: 'Increases magazine capacity by 20%',
    iconUrl: 'https://via.placeholder.com/80?text=Mag1',
    stackSize: 1,
    sellValue: 60,
  },
  {
    id: 'item_extended_mag_2',
    name: 'Extended Magazine II',
    type: 'Trinket',
    rarity: 'Uncommon',
    description: 'Increases magazine capacity by 40%',
    iconUrl: 'https://via.placeholder.com/80?text=Mag2',
    stackSize: 1,
    sellValue: 180,
  },
  // Optics
  {
    id: 'item_scope_2x',
    name: '2x Scope',
    type: 'Trinket',
    rarity: 'Common',
    description: '2x magnification for better range accuracy',
    iconUrl: 'https://via.placeholder.com/80?text=Scope2x',
    stackSize: 1,
    sellValue: 100,
  },
  {
    id: 'item_scope_4x',
    name: '4x Tactical Scope',
    type: 'Trinket',
    rarity: 'Uncommon',
    description: '4x magnification with tactical reticle',
    iconUrl: 'https://via.placeholder.com/80?text=Scope4x',
    stackSize: 1,
    sellValue: 250,
  },
  {
    id: 'item_red_dot_sight',
    name: 'Red Dot Sight',
    type: 'Trinket',
    rarity: 'Common',
    description: 'Quick target acquisition at close range',
    iconUrl: 'https://via.placeholder.com/80?text=RedDot',
    stackSize: 1,
    sellValue: 80,
  },
];

// CONSUMABLES
const CONSUMABLES: GameItem[] = [
  {
    id: 'item_bandage',
    name: 'Bandage',
    type: 'Consumable',
    rarity: 'Common',
    description: 'Restores 25 health points when used',
    iconUrl: 'https://via.placeholder.com/80?text=Bandage',
    stackSize: 10,
    sellValue: 15,
  },
  {
    id: 'item_medical_kit',
    name: 'Medical Kit',
    type: 'Consumable',
    rarity: 'Common',
    description: 'Restores 50 health points when used',
    iconUrl: 'https://via.placeholder.com/80?text=MedKit',
    stackSize: 5,
    sellValue: 50,
  },
  {
    id: 'item_vita_spray',
    name: 'Vita Spray',
    type: 'Consumable',
    rarity: 'Uncommon',
    description: 'Restores 100 health points and provides 20s regeneration',
    iconUrl: 'https://via.placeholder.com/80?text=VitaSpray',
    stackSize: 3,
    sellValue: 150,
  },
  {
    id: 'item_stim_pack',
    name: 'Combat Stim Pack',
    type: 'Consumable',
    rarity: 'Uncommon',
    description: 'Increases damage by 15% for 30 seconds',
    iconUrl: 'https://via.placeholder.com/80?text=StimPack',
    stackSize: 3,
    sellValue: 120,
  },
  {
    id: 'item_adrenaline_shot',
    name: 'Adrenaline Shot',
    type: 'Consumable',
    rarity: 'Rare',
    description: 'Increases fire rate by 20% and reload speed by 25% for 20s',
    iconUrl: 'https://via.placeholder.com/80?text=Adrenaline',
    stackSize: 2,
    sellValue: 250,
  },
];

// MATERIALS (since we can't have a separate "Ammunition" type, use Material)
const MATERIALS: GameItem[] = [
  // Basic Ammo/Materials
  {
    id: 'ammo_rifle_standard',
    name: 'Rifle Ammunition',
    type: 'Material',
    rarity: 'Common',
    description: 'Standard ammunition for rifle weapons',
    iconUrl: 'https://via.placeholder.com/80?text=RifleAmmo',
    stackSize: 999,
    sellValue: 5,
  },
  {
    id: 'ammo_shotgun_shells',
    name: 'Shotgun Shells',
    type: 'Material',
    rarity: 'Common',
    description: 'Ammunition for shotgun weapons',
    iconUrl: 'https://via.placeholder.com/80?text=ShotgunAmmo',
    stackSize: 100,
    sellValue: 10,
  },
  {
    id: 'ammo_sniper_rounds',
    name: 'Sniper Rounds',
    type: 'Material',
    rarity: 'Uncommon',
    description: 'High-penetration ammunition for sniper rifles',
    iconUrl: 'https://via.placeholder.com/80?text=SniperAmmo',
    stackSize: 50,
    sellValue: 25,
  },
  {
    id: 'ammo_smg_rounds',
    name: 'SMG Rounds',
    type: 'Material',
    rarity: 'Common',
    description: 'High-capacity ammunition for submachine guns',
    iconUrl: 'https://via.placeholder.com/80?text=SMGAmmo',
    stackSize: 500,
    sellValue: 3,
  },
  {
    id: 'ammo_pistol_rounds',
    name: 'Pistol Rounds',
    type: 'Material',
    rarity: 'Common',
    description: 'Standard ammunition for pistols',
    iconUrl: 'https://via.placeholder.com/80?text=PistolAmmo',
    stackSize: 300,
    sellValue: 2,
  },
  // Crafting Materials
  {
    id: 'mat_metal_parts',
    name: 'Metal Parts',
    type: 'Material',
    rarity: 'Common',
    description: 'Scrap metal and components used in crafting',
    iconUrl: 'https://via.placeholder.com/80?text=MetalParts',
    stackSize: 99,
    sellValue: 10,
  },
  {
    id: 'mat_plastic_parts',
    name: 'Plastic Parts',
    type: 'Material',
    rarity: 'Common',
    description: 'Polymer and plastic components',
    iconUrl: 'https://via.placeholder.com/80?text=PlasticParts',
    stackSize: 99,
    sellValue: 8,
  },
  {
    id: 'mat_rubber_parts',
    name: 'Rubber Parts',
    type: 'Material',
    rarity: 'Common',
    description: 'Rubber seals and grips',
    iconUrl: 'https://via.placeholder.com/80?text=RubberParts',
    stackSize: 99,
    sellValue: 6,
  },
  {
    id: 'mat_fabric',
    name: 'Fabric Material',
    type: 'Material',
    rarity: 'Common',
    description: 'Cloth and synthetic fibers',
    iconUrl: 'https://via.placeholder.com/80?text=Fabric',
    stackSize: 50,
    sellValue: 5,
  },
  {
    id: 'mat_chemical_parts',
    name: 'Chemical Components',
    type: 'Material',
    rarity: 'Uncommon',
    description: 'Refined chemicals for medical and tech items',
    iconUrl: 'https://via.placeholder.com/80?text=ChemComponents',
    stackSize: 30,
    sellValue: 30,
  },
  {
    id: 'mat_mechanical_components',
    name: 'Mechanical Components',
    type: 'Material',
    rarity: 'Uncommon',
    description: 'Gears, springs, and mechanical parts',
    iconUrl: 'https://via.placeholder.com/80?text=MechComponents',
    stackSize: 20,
    sellValue: 40,
  },
  {
    id: 'mat_advanced_tech',
    name: 'Advanced Tech Materials',
    type: 'Material',
    rarity: 'Rare',
    description: 'Rare technological components',
    iconUrl: 'https://via.placeholder.com/80?text=AdvTech',
    stackSize: 10,
    sellValue: 100,
  },
  {
    id: 'mat_synthetic_polymer',
    name: 'Synthetic Polymer',
    type: 'Material',
    rarity: 'Rare',
    description: 'Advanced polymer used in high-tier crafting',
    iconUrl: 'https://via.placeholder.com/80?text=Polymer',
    stackSize: 15,
    sellValue: 80,
  },
  {
    id: 'mat_wasp_driver',
    name: 'Wasp Driver',
    type: 'Material',
    rarity: 'Uncommon',
    description: 'Component dropped by Wasps, used in various recipes',
    iconUrl: 'https://via.placeholder.com/80?text=WaspDriver',
    stackSize: 50,
    sellValue: 35,
  },
  {
    id: 'mat_tech_chip',
    name: 'Tech Chip',
    type: 'Material',
    rarity: 'Rare',
    description: 'Microprocessor used in advanced equipment',
    iconUrl: 'https://via.placeholder.com/80?text=TechChip',
    stackSize: 20,
    sellValue: 150,
  },
  // Special Materials (Quest Items converted to Materials)
  {
    id: 'quest_item_briefcase',
    name: 'Mysterious Briefcase',
    type: 'Material',
    rarity: 'Rare',
    description: 'Contents unknown. Required for "The Vault" mission.',
    iconUrl: 'https://via.placeholder.com/80?text=Briefcase',
    stackSize: 1,
    sellValue: 0,
  },
  {
    id: 'quest_item_data_drive',
    name: 'Encrypted Data Drive',
    type: 'Material',
    rarity: 'Rare',
    description: 'Contains critical intelligence. Part of "Signal Down" mission.',
    iconUrl: 'https://via.placeholder.com/80?text=DataDrive',
    stackSize: 1,
    sellValue: 0,
  },
  {
    id: 'quest_item_prototype_key',
    name: 'Prototype Access Key',
    type: 'Material',
    rarity: 'Epic',
    description: 'Unlocks the prototype weapons facility.',
    iconUrl: 'https://via.placeholder.com/80?text=ProtoKey',
    stackSize: 1,
    sellValue: 0,
  },
  {
    id: 'special_cache_key',
    name: 'Cache Key',
    type: 'Material',
    rarity: 'Rare',
    description: 'Unlocks hidden caches in various locations',
    iconUrl: 'https://via.placeholder.com/80?text=CacheKey',
    stackSize: 10,
    sellValue: 200,
  },
  {
    id: 'special_field_upgrade_module',
    name: 'Field Upgrade Module',
    type: 'Material',
    rarity: 'Epic',
    description: 'Permanently upgrades a piece of equipment by one level',
    iconUrl: 'https://via.placeholder.com/80?text=UpgradeModule',
    stackSize: 5,
    sellValue: 500,
  },
  {
    id: 'special_blueprint_fragment',
    name: 'Blueprint Fragment',
    type: 'Material',
    rarity: 'Rare',
    description: 'Collect 5 fragments to unlock new crafting recipes',
    iconUrl: 'https://via.placeholder.com/80?text=BlueprintFrag',
    stackSize: 99,
    sellValue: 100,
  },
];

// Combine all items
export const ITEMS: GameItem[] = [
  ...WEAPONS,
  ...ARMOR,
  ...TRINKETS,
  ...CONSUMABLES,
  ...MATERIALS,
];

// Export by type for easier querying
export const getItemsByType = (type: string): GameItem[] => {
  return ITEMS.filter(item => item.type === type);
};

export const getItemsByRarity = (rarity: string): GameItem[] => {
  return ITEMS.filter(item => item.rarity === rarity);
};

export const getItemById = (itemId: string): GameItem | undefined => {
  return ITEMS.find(item => item.id === itemId);
};

export const getItemByName = (name: string): GameItem | undefined => {
  return ITEMS.find(item => item.name.toLowerCase() === name.toLowerCase());
};

export const searchItems = (query: string): GameItem[] => {
  const lowerQuery = query.toLowerCase();
  return ITEMS.filter(
    item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
};
