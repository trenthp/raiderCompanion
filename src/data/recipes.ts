import { CraftingRecipe } from '../types/gameData';

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  // Weapon Modifications
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
    id: 'recipe_compensator_1',
    name: 'Compensator I',
    outputItemId: 'item_compensator_1',
    outputQuantity: 1,
    workshopLevel: 1,
    ingredients: [
      { itemId: 'mat_metal_parts', quantity: 6 },
      { itemId: 'mat_rubber_parts', quantity: 3 }
    ]
  },

  // Consumables
  {
    id: 'recipe_bandage',
    name: 'Bandage',
    outputItemId: 'item_bandage',
    outputQuantity: 5,
    workshopLevel: 1,
    ingredients: [
      { itemId: 'mat_fabric', quantity: 3 }
    ]
  },
  {
    id: 'recipe_medkit',
    name: 'Medical Kit',
    outputItemId: 'item_medkit',
    outputQuantity: 1,
    workshopLevel: 2,
    ingredients: [
      { itemId: 'mat_fabric', quantity: 10 },
      { itemId: 'mat_chemicals', quantity: 5 }
    ]
  },
  {
    id: 'recipe_vita_spray',
    name: 'Vita Spray',
    outputItemId: 'item_vita_spray',
    outputQuantity: 1,
    workshopLevel: 3,
    ingredients: [
      { itemId: 'mat_chemicals', quantity: 15 },
      { itemId: 'mat_fabric', quantity: 8 },
      { itemId: 'mat_metal_parts', quantity: 5 }
    ]
  }
];
