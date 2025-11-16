import { Quest } from '../types/gameData';

/**
 * Arc Raiders quests and missions
 * Defines the main campaign quests, side missions, and optional objectives
 */

export const QUESTS: Quest[] = [
  {
    id: 'quest_prologue_extraction',
    name: 'Extraction Protocol',
    description: 'Escape the initial crash site and reach the safehouse',
    faction: 'Celeste',
    objectives: [
      { description: 'Reach the extraction point', type: 'Visit', targetId: 'location_desert_plateau' },
      { description: 'Eliminate initial threats', type: 'Kill', quantity: 5 },
      { description: 'Secure your loadout', type: 'Collect', targetId: 'weapon_pistol_sidearm' },
    ],
    rewards: {
      xp: 100,
      items: [
        { itemId: 'weapon_pistol_sidearm', quantity: 1 },
        { itemId: 'ammo_pistol_rounds', quantity: 50 },
      ],
    },
  },
  {
    id: 'quest_outpost_alpha_operation',
    name: 'Outpost Alpha Operation',
    description: 'Investigate and secure Outpost Alpha',
    faction: 'Celeste',
    objectives: [
      { description: 'Breach the outer perimeter', type: 'Visit', targetId: 'location_outpost_alpha' },
      { description: 'Clear the compound', type: 'Kill', quantity: 10 },
      { description: 'Secure the command center', type: 'Visit', targetId: 'location_outpost_alpha' },
      { description: 'Collect intelligence data', type: 'Collect', targetId: 'quest_item_data_drive' },
    ],
    rewards: {
      xp: 350,
      items: [
        { itemId: 'weapon_assault_rifle_standard', quantity: 1 },
        { itemId: 'mat_mechanical_components', quantity: 5 },
      ],
    },
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
      { description: 'Escape before lockdown', type: 'Visit', targetId: 'location_industrial_zone' },
    ],
    rewards: {
      xp: 400,
      items: [
        { itemId: 'mat_mechanical_components', quantity: 8 },
        { itemId: 'mat_wasp_driver', quantity: 10 },
      ],
    },
  },
  {
    id: 'quest_medical_facility_breach',
    name: 'Medical Facility Breach',
    description: 'Infiltrate the Medical Facility and recover research data',
    faction: 'Celeste',
    objectives: [
      { description: 'Bypass security systems', type: 'Visit', targetId: 'location_medical_facility' },
      { description: 'Locate the research lab', type: 'Visit', targetId: 'location_research_lab' },
      { description: 'Obtain encrypted data', type: 'Collect', targetId: 'quest_item_data_drive' },
      { description: 'Eliminate facility commander', type: 'Kill', quantity: 1 },
    ],
    rewards: {
      xp: 600,
      items: [
        { itemId: 'quest_item_data_drive', quantity: 1 },
        { itemId: 'mat_chemical_parts', quantity: 15 },
        { itemId: 'mat_tech_chip', quantity: 3 },
      ],
    },
  },
  {
    id: 'quest_central_command_assault',
    name: 'Central Command Assault',
    description: 'Launch an assault on Central Command headquarters',
    faction: 'Celeste',
    objectives: [
      { description: 'Breach the outer gates', type: 'Visit', targetId: 'location_central_command' },
      { description: 'Disable automated defenses', type: 'Kill', quantity: 5 },
      { description: 'Reach the command center', type: 'Visit', targetId: 'location_central_command' },
      { description: 'Eliminate command staff', type: 'Kill', quantity: 3 },
    ],
    rewards: {
      xp: 800,
      items: [
        { itemId: 'quest_item_prototype_key', quantity: 1 },
        { itemId: 'mat_advanced_tech', quantity: 10 },
      ],
    },
  },
  {
    id: 'quest_cave_expedition',
    name: 'Abyssal Expedition',
    description: 'Explore the Underground Cavern and retrieve ancient technology',
    faction: 'Celeste',
    objectives: [
      { description: 'Descend into the cavern', type: 'Visit', targetId: 'location_underground_cavern' },
      { description: 'Survive apex predator encounters', type: 'Kill', quantity: 8 },
      { description: 'Locate the artifact chamber', type: 'Visit', targetId: 'location_underground_cavern' },
      { description: 'Retrieve the ancient technology', type: 'Collect', targetId: 'special_field_upgrade_module' },
    ],
    rewards: {
      xp: 1500,
      items: [
        { itemId: 'mat_synthetic_polymer', quantity: 20 },
        { itemId: 'mat_advanced_tech', quantity: 15 },
        { itemId: 'special_field_upgrade_module', quantity: 2 },
      ],
    },
  },
  {
    id: 'quest_city_ruins_salvage',
    name: 'Urban Salvage Operation',
    description: 'Scavenge the City Ruins for valuable equipment and supplies',
    faction: 'Scrappy',
    objectives: [
      { description: 'Collect 5 supply caches', type: 'Collect', quantity: 5 },
      { description: 'Eliminate local threats', type: 'Kill', quantity: 8 },
      { description: 'Recover lost equipment', type: 'Collect', targetId: 'special_cache_key' },
    ],
    rewards: {
      xp: 250,
      items: [
        { itemId: 'special_cache_key', quantity: 2 },
        { itemId: 'mat_plastic_parts', quantity: 12 },
      ],
    },
  },
  {
    id: 'quest_research_lab_heist',
    name: 'Research Lab Heist',
    description: 'Break into the Research Lab and steal experimental blueprints',
    faction: 'Scrappy',
    objectives: [
      { description: 'Avoid detection systems', type: 'Visit', targetId: 'location_research_lab' },
      { description: 'Locate the secure vault', type: 'Visit', targetId: 'location_research_lab' },
      { description: 'Extract blueprints', type: 'Collect', targetId: 'special_blueprint_fragment' },
      { description: 'Escape without triggering alarms', type: 'Visit', targetId: 'location_research_lab' },
    ],
    rewards: {
      xp: 500,
      items: [
        { itemId: 'special_blueprint_fragment', quantity: 5 },
        { itemId: 'mat_tech_chip', quantity: 5 },
      ],
    },
  },
  {
    id: 'quest_wasp_extermination',
    name: 'Wasp Nest Extermination',
    description: 'Eliminate a Wasp colony and retrieve materials',
    faction: 'Scrappy',
    objectives: [
      { description: 'Locate the nest', type: 'Visit', targetId: 'location_industrial_zone' },
      { description: 'Eliminate all Wasps', type: 'Kill', quantity: 20 },
      { description: 'Collect Wasp Drivers', type: 'Collect', targetId: 'mat_wasp_driver', quantity: 15 },
    ],
    rewards: {
      xp: 200,
      items: [
        { itemId: 'mat_wasp_driver', quantity: 15 },
      ],
    },
  },
  {
    id: 'quest_gather_rare_materials',
    name: 'Rare Materials Expedition',
    description: 'Gather rare crafting materials for workshop upgrades',
    faction: 'Celeste',
    objectives: [
      { description: 'Collect Synthetic Polymer', type: 'Collect', targetId: 'mat_synthetic_polymer', quantity: 8 },
      { description: 'Collect Advanced Tech', type: 'Collect', targetId: 'mat_advanced_tech', quantity: 8 },
      { description: 'Collect Tech Chips', type: 'Collect', targetId: 'mat_tech_chip', quantity: 5 },
    ],
    rewards: {
      xp: 400,
      items: [
        { itemId: 'mat_synthetic_polymer', quantity: 8 },
        { itemId: 'mat_advanced_tech', quantity: 8 },
      ],
    },
  },
];

/**
 * Helper functions for quest queries
 */

export const getQuestById = (questId: string): Quest | undefined => {
  return QUESTS.find(quest => quest.id === questId);
};

export const getQuestByName = (name: string): Quest | undefined => {
  return QUESTS.find(quest => quest.name.toLowerCase() === name.toLowerCase());
};

export const getQuestsByFaction = (faction: string): Quest[] => {
  return QUESTS.filter(quest => quest.faction === faction);
};

export const getQuestsByObjectiveType = (type: 'Collect' | 'Kill' | 'Deliver' | 'Visit'): Quest[] => {
  return QUESTS.filter(quest =>
    quest.objectives.some(obj => obj.type === type)
  );
};

export const getQuestsByTargetItem = (itemId: string): Quest[] => {
  return QUESTS.filter(quest =>
    quest.objectives.some(obj => obj.targetId === itemId)
  );
};

export const getQuestsByTargetLocation = (locationId: string): Quest[] => {
  return QUESTS.filter(quest =>
    quest.objectives.some(obj => obj.targetId === locationId)
  );
};

export const getAllCelesteQuests = (): Quest[] => {
  return getQuestsByFaction('Celeste');
};

export const getAllScrappyQuests = (): Quest[] => {
  return getQuestsByFaction('Scrappy');
};

export const getQuestTotalXpReward = (questId: string): number => {
  const quest = getQuestById(questId);
  return quest?.rewards.xp ?? 0;
};

export const getQuestItemRewards = (questId: string): Array<{ itemId: string; quantity: number }> => {
  const quest = getQuestById(questId);
  return quest?.rewards.items ?? [];
};
