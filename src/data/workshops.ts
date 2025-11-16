import { WorkshopUpgrade } from '../types/gameData';

export const WORKSHOP_UPGRADES: WorkshopUpgrade[] = [
  // Gunsmith
  {
    id: 'upgrade_gunsmith_1',
    name: 'Gunsmith Level 1',
    description: 'Unlock Tier I weapon modifications',
    level: 1,
    benefits: ['Vertical Grip I', 'Compensator I', 'Extended Mag I'],
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
    description: 'Unlock Tier II weapon modifications',
    level: 2,
    benefits: ['Vertical Grip II', 'Compensator II', 'Extended Mag II'],
    requirements: {
      itemsRequired: [
        { itemId: 'arc_wasp_driver', quantity: 8 },
        { itemId: 'mat_mechanical_comp', quantity: 5 }
      ]
    }
  },
  {
    id: 'upgrade_gunsmith_3',
    name: 'Gunsmith Level 3',
    description: 'Unlock Tier III weapon modifications',
    level: 3,
    benefits: ['Vertical Grip III', 'Compensator III', 'Silencer II'],
    requirements: {
      itemsRequired: [
        { itemId: 'arc_sentinel_core', quantity: 4 },
        { itemId: 'mat_mechanical_comp', quantity: 5 }
      ]
    }
  },

  // Medical Lab
  {
    id: 'upgrade_medical_1',
    name: 'Medical Lab Level 1',
    description: 'Craft basic healing items',
    level: 1,
    benefits: ['Bandage'],
    requirements: {
      itemsRequired: [
        { itemId: 'mat_fabric', quantity: 50 }
      ]
    }
  },
  {
    id: 'upgrade_medical_2',
    name: 'Medical Lab Level 2',
    description: 'Craft advanced healing items',
    level: 2,
    benefits: ['Medical Kit', 'Adrenaline Shot'],
    requirements: {
      itemsRequired: [
        { itemId: 'arc_hornet_driver', quantity: 5 },
        { itemId: 'mat_chemicals', quantity: 10 }
      ]
    }
  },
  {
    id: 'upgrade_medical_3',
    name: 'Medical Lab Level 3',
    description: 'Craft elite healing items',
    level: 3,
    benefits: ['Vita Spray', 'Shield Recharger'],
    requirements: {
      itemsRequired: [
        { itemId: 'arc_leaper_pulse', quantity: 3 },
        { itemId: 'mat_chemicals', quantity: 15 }
      ]
    }
  }
];
