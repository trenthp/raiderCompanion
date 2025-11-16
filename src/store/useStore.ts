import { create } from 'zustand';
import type { Loadout, Goal, ItemSlot, LoadoutType } from '../types';
import { storage } from '../services/storage';

interface AppState {
  // Loadout State
  loadouts: Loadout[];
  currentLoadout: Loadout | null;
  
  // Goals State
  goals: Goal[];
  
  // UI State
  sidebarOpen: boolean;
  searchQuery: string;
  
  // Actions
  setLoadouts: (loadouts: Loadout[]) => void;
  setCurrentLoadout: (loadout: Loadout | null) => void;
  createLoadout: (name: string, type: LoadoutType) => Loadout;
  updateLoadout: (loadout: Loadout) => void;
  deleteLoadout: (loadoutId: string) => void;
  
  addItemToLoadout: (slot: string, item: ItemSlot) => void;
  removeItemFromLoadout: (slot: string) => void;
  
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  removeGoal: (goalId: string) => void;
  updateGoal: (goal: Goal) => void;
  
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  // Initialize from storage
  initialize: () => void;
}

// Helper to calculate loadout stats
function calculateLoadoutStats(loadout: Loadout) {
  let totalWeight = 0;
  const maxWeight = 60; // Default max weight
  
  // Calculate weight from all slots
  if (loadout.slots.primaryWeapon) {
    totalWeight += loadout.slots.primaryWeapon.item.weight;
    Object.values(loadout.slots.primaryWeapon.attachments).forEach(attachment => {
      if (attachment) totalWeight += attachment.item.weight;
    });
  }
  
  if (loadout.slots.secondaryWeapon) {
    totalWeight += loadout.slots.secondaryWeapon.item.weight;
  }
  
  if (loadout.slots.melee) {
    totalWeight += loadout.slots.melee.item.weight;
  }
  
  if (loadout.slots.armor) {
    Object.values(loadout.slots.armor).forEach(armor => {
      if (armor) totalWeight += armor.item.weight;
    });
  }
  
  loadout.slots.utilities.forEach(util => {
    totalWeight += util.item.weight * (util.quantity || 1);
  });
  
  loadout.slots.consumables.forEach(consumable => {
    totalWeight += consumable.item.weight * (consumable.quantity || 1);
  });
  
  return {
    ...loadout.stats,
    totalWeight,
    maxWeight,
  };
}

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  loadouts: [],
  currentLoadout: null,
  goals: [],
  sidebarOpen: true,
  searchQuery: '',
  
  // Initialize from localStorage
  initialize: () => {
    const loadouts = storage.getLoadouts();
    const goals = storage.getGoals();
    set({ loadouts, goals });
  },
  
  // Loadout Actions
  setLoadouts: (loadouts) => set({ loadouts }),
  
  setCurrentLoadout: (loadout) => set({ currentLoadout: loadout }),
  
  createLoadout: (name, type) => {
    const newLoadout: Loadout = {
      id: `loadout_${Date.now()}`,
      name,
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slots: {
        utilities: [],
        consumables: [],
        armor: {},
      },
      stats: {
        totalWeight: 0,
        maxWeight: 60,
        totalValue: 0,
      },
    };
    
    const loadouts = [...get().loadouts, newLoadout];
    set({ loadouts, currentLoadout: newLoadout });
    storage.saveLoadout(newLoadout);
    
    return newLoadout;
  },
  
  updateLoadout: (updatedLoadout) => {
    // Recalculate stats
    updatedLoadout.stats = calculateLoadoutStats(updatedLoadout);
    updatedLoadout.updatedAt = new Date().toISOString();
    
    const loadouts = get().loadouts.map(l => 
      l.id === updatedLoadout.id ? updatedLoadout : l
    );
    
    set({ 
      loadouts,
      currentLoadout: get().currentLoadout?.id === updatedLoadout.id ? updatedLoadout : get().currentLoadout
    });
    
    storage.saveLoadout(updatedLoadout);
  },
  
  deleteLoadout: (loadoutId) => {
    const loadouts = get().loadouts.filter(l => l.id !== loadoutId);
    const currentLoadout = get().currentLoadout?.id === loadoutId ? null : get().currentLoadout;
    
    set({ loadouts, currentLoadout });
    storage.deleteLoadout(loadoutId);
  },
  
  addItemToLoadout: (slot, item) => {
    const currentLoadout = get().currentLoadout;
    if (!currentLoadout) return;
    
    const updatedLoadout = { ...currentLoadout };
    
    // Handle different slot types
    // This is a simplified version - you'd expand this based on slot naming
    if (slot === 'primaryWeapon' || slot === 'secondaryWeapon') {
      (updatedLoadout.slots as any)[slot] = {
        ...item,
        attachments: {},
      };
    } else if (slot.startsWith('utility')) {
      updatedLoadout.slots.utilities.push(item);
    } else if (slot.startsWith('consumable')) {
      updatedLoadout.slots.consumables.push(item);
    }
    
    get().updateLoadout(updatedLoadout);
  },
  
  removeItemFromLoadout: (slot) => {
    const currentLoadout = get().currentLoadout;
    if (!currentLoadout) return;
    
    const updatedLoadout = { ...currentLoadout };
    
    // Remove item from specified slot
    if (slot === 'primaryWeapon' || slot === 'secondaryWeapon' || slot === 'melee') {
      (updatedLoadout.slots as any)[slot] = undefined;
    }
    
    get().updateLoadout(updatedLoadout);
  },
  
  // Goal Actions
  setGoals: (goals) => set({ goals }),
  
  addGoal: (goal) => {
    const goals = [...get().goals, goal];
    set({ goals });
    storage.saveGoal(goal);
  },
  
  removeGoal: (goalId) => {
    const goals = get().goals.filter(g => g.id !== goalId);
    set({ goals });
    storage.deleteGoal(goalId);
  },
  
  updateGoal: (updatedGoal) => {
    const goals = get().goals.map(g => 
      g.id === updatedGoal.id ? updatedGoal : g
    );
    set({ goals });
    storage.saveGoal(updatedGoal);
  },
  
  // UI Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
