import { CRAFTING_RECIPES } from '../data/recipes';
import { WORKSHOP_UPGRADES } from '../data/workshops';
import { ENEMY_LOOT_TABLES, LOCATION_LOOT_MAPPING } from '../data/enemies';
import { CraftingRecipe, WorkshopUpgrade, EnemyLootTable, GameItem } from '../types/gameData';

/**
 * Custom hook to access game data relationships
 * Provides methods to find recipes, ingredients, sources, etc.
 */
export function useGameData() {
  // Find all recipes that use a specific item as an ingredient
  const findRecipesUsingItem = (itemId: string): CraftingRecipe[] => {
    return CRAFTING_RECIPES.filter(recipe =>
      recipe.ingredients.some(ing => ing.itemId === itemId)
    );
  };

  // Find all ingredients needed for a recipe
  const getRecipeIngredients = (recipeId: string): any[] => {
    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    return recipe?.ingredients || [];
  };

  // Find what a specific workshop upgrade requires
  const findUpgradesRequiringItem = (itemId: string): WorkshopUpgrade[] => {
    return WORKSHOP_UPGRADES.filter(upgrade =>
      upgrade.requirements.itemsRequired?.some(req => req.itemId === itemId)
    );
  };

  // Find what enemies drop a specific item
  const findEnemiesDroppingItem = (itemId: string): EnemyLootTable[] => {
    return ENEMY_LOOT_TABLES.filter(enemy =>
      enemy.possibleDrops.some(drop => drop.itemId === itemId)
    );
  };

  // Find best locations for a loot type
  const findLocationsForLootType = (lootType: string): string[] => {
    return LOCATION_LOOT_MAPPING[lootType] || [];
  };

  // Get all items needed for a goal (item + all its ingredient chains)
  const getCompleteIngredientTree = (itemId: string, depth = 0, maxDepth = 3): Map<string, number> => {
    const ingredients = new Map<string, number>();

    if (depth > maxDepth) return ingredients;

    // Find recipes that create this item
    const recipesCreatingItem = CRAFTING_RECIPES.filter(r => r.outputItemId === itemId);

    if (recipesCreatingItem.length === 0) {
      // Base item, not crafted
      ingredients.set(itemId, 1);
      return ingredients;
    }

    // Get the first recipe (simplified - could choose best/cheapest)
    const recipe = recipesCreatingItem[0];

    // Add all ingredients
    recipe.ingredients.forEach(ing => {
      const subTree = getCompleteIngredientTree(ing.itemId, depth + 1, maxDepth);
      subTree.forEach((qty, itemId) => {
        ingredients.set(itemId, (ingredients.get(itemId) || 0) + (qty * ing.quantity));
      });
    });

    return ingredients;
  };

  return {
    recipes: CRAFTING_RECIPES,
    workshopUpgrades: WORKSHOP_UPGRADES,
    enemyLootTables: ENEMY_LOOT_TABLES,
    findRecipesUsingItem,
    getRecipeIngredients,
    findUpgradesRequiringItem,
    findEnemiesDroppingItem,
    findLocationsForLootType,
    getCompleteIngredientTree
  };
}
