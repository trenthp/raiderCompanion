import type { Loadout, Goal } from '../types';

const STORAGE_VERSION = '1.0.0';
const STORAGE_KEYS = {
  VERSION: 'arc_raiders_version',
  LOADOUTS: 'arc_raiders_loadouts',
  GOALS: 'arc_raiders_goals',
  INVENTORY: 'arc_raiders_inventory',
  PREFERENCES: 'arc_raiders_preferences',
};

export interface StorageData {
  version: string;
  lastUpdated: number;
}

export interface InventoryState {
  [itemId: string]: {
    quantity: number;
    markedAsHave: boolean;
  };
}

export interface Preferences {
  theme: 'dark' | 'light';
  defaultMap?: string;
  notifications: boolean;
}

class StorageService {
  /**
   * Get item from localStorage with error handling
   */
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage with error handling
   */
  private setItem(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Initialize storage with version check
   */
  initialize(): void {
    const storedVersion = this.getItem(STORAGE_KEYS.VERSION, null);
    if (storedVersion !== STORAGE_VERSION) {
      console.log('Storage version mismatch, initializing...');
      this.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    }
  }

  /**
   * Loadouts
   */
  getLoadouts(): Loadout[] {
    return this.getItem(STORAGE_KEYS.LOADOUTS, []);
  }

  saveLoadout(loadout: Loadout): boolean {
    const loadouts = this.getLoadouts();
    const index = loadouts.findIndex(l => l.id === loadout.id);
    
    if (index >= 0) {
      loadouts[index] = { ...loadout, updatedAt: new Date().toISOString() };
    } else {
      loadouts.push(loadout);
    }
    
    return this.setItem(STORAGE_KEYS.LOADOUTS, loadouts);
  }

  deleteLoadout(loadoutId: string): boolean {
    const loadouts = this.getLoadouts().filter(l => l.id !== loadoutId);
    return this.setItem(STORAGE_KEYS.LOADOUTS, loadouts);
  }

  getLoadout(loadoutId: string): Loadout | null {
    const loadouts = this.getLoadouts();
    return loadouts.find(l => l.id === loadoutId) || null;
  }

  /**
   * Goals
   */
  getGoals(): Goal[] {
    return this.getItem(STORAGE_KEYS.GOALS, []);
  }

  saveGoal(goal: Goal): boolean {
    const goals = this.getGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    
    return this.setItem(STORAGE_KEYS.GOALS, goals);
  }

  deleteGoal(goalId: string): boolean {
    const goals = this.getGoals().filter(g => g.id !== goalId);
    return this.setItem(STORAGE_KEYS.GOALS, goals);
  }

  /**
   * Inventory
   */
  getInventory(): InventoryState {
    return this.getItem(STORAGE_KEYS.INVENTORY, {});
  }

  updateInventory(itemId: string, quantity: number, markedAsHave: boolean = false): boolean {
    const inventory = this.getInventory();
    inventory[itemId] = { quantity, markedAsHave };
    return this.setItem(STORAGE_KEYS.INVENTORY, inventory);
  }

  getItemQuantity(itemId: string): number {
    const inventory = this.getInventory();
    return inventory[itemId]?.quantity || 0;
  }

  /**
   * Preferences
   */
  getPreferences(): Preferences {
    return this.getItem(STORAGE_KEYS.PREFERENCES, {
      theme: 'dark',
      notifications: true,
    });
  }

  savePreferences(preferences: Partial<Preferences>): boolean {
    const current = this.getPreferences();
    return this.setItem(STORAGE_KEYS.PREFERENCES, { ...current, ...preferences });
  }

  /**
   * Clear all data
   */
  clearAll(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      this.initialize();
      return true;
    } catch (error) {
      console.error('Failed to clear storage', error);
      return false;
    }
  }

  /**
   * Export all data
   */
  exportData(): string {
    const data = {
      version: STORAGE_VERSION,
      loadouts: this.getLoadouts(),
      goals: this.getGoals(),
      inventory: this.getInventory(),
      preferences: this.getPreferences(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data
   */
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate data structure
      if (!data.version || !data.loadouts) {
        throw new Error('Invalid data format');
      }

      // Import data
      this.setItem(STORAGE_KEYS.LOADOUTS, data.loadouts);
      if (data.goals) this.setItem(STORAGE_KEYS.GOALS, data.goals);
      if (data.inventory) this.setItem(STORAGE_KEYS.INVENTORY, data.inventory);
      if (data.preferences) this.setItem(STORAGE_KEYS.PREFERENCES, data.preferences);

      return true;
    } catch (error) {
      console.error('Failed to import data', error);
      return false;
    }
  }
}

// Export singleton instance
export const storage = new StorageService();
