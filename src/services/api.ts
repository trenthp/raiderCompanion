import type {
  Item,
  ItemsResponse,
  ItemsQueryParams,
  Arc,
  ArcsQueryParams,
  Quest,
  QuestsQueryParams,
  Trader,
} from '../types';

class ArcRaidersAPI {
  private baseURL = 'https://metaforge.app/api/arc-raiders';
  private githubBase = 'https://raw.githubusercontent.com/RaidTheory/arcraiders-data/main';

  /**
   * Generic fetch with fallback to GitHub
   */
  private async fetchWithFallback<T>(
    endpoint: string,
    githubPath: string,
    transform?: (data: any) => T
  ): Promise<T> {
    // Try MetaForge API first
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        return transform ? transform(data) : data;
      }
    } catch (error) {
      console.warn(`MetaForge API failed for ${endpoint}, trying GitHub fallback`, error);
    }

    // Fallback to GitHub
    try {
      const response = await fetch(`${this.githubBase}${githubPath}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch from GitHub: ${response.status}`);
      }
      const data = await response.json();
      return transform ? transform(data) : data;
    } catch (error) {
      throw new Error(`Failed to fetch from both sources: ${endpoint}`);
    }
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Get items with optional filtering
   */
  async getItems(params?: ItemsQueryParams): Promise<ItemsResponse> {
    const queryString = this.buildQueryString(params);
    return this.fetchWithFallback(
      `/items${queryString}`,
      '/items/weapons.json', // Note: GitHub has items split across files
      (data) => {
        // Transform GitHub data to match MetaForge structure if needed
        if (Array.isArray(data)) {
          return {
            items: data,
            pagination: {
              current_page: 1,
              total_pages: 1,
              total_items: data.length,
              per_page: data.length,
            },
          };
        }
        return data;
      }
    );
  }

  /**
   * Get a single item by ID
   */
  async getItem(itemId: string): Promise<Item | null> {
    try {
      const response = await this.getItems({ name: itemId });
      return response.items.find(item => item.id === itemId) || null;
    } catch (error) {
      console.error('Failed to fetch item:', error);
      return null;
    }
  }

  /**
   * Get ARCs with optional filtering
   */
  async getArcs(params?: ArcsQueryParams): Promise<Arc[]> {
    const queryString = this.buildQueryString(params);
    return this.fetchWithFallback(
      `/arcs${queryString}`,
      '/bots.json' // GitHub doesn't have a direct ARCs file, using bots as placeholder
    );
  }

  /**
   * Get quests
   */
  async getQuests(params?: QuestsQueryParams): Promise<Quest[]> {
    const queryString = this.buildQueryString(params);
    return this.fetchWithFallback(
      `/quests${queryString}`,
      '/quests/quests.json'
    );
  }

  /**
   * Get traders
   */
  async getTraders(): Promise<Trader[]> {
    return this.fetchWithFallback(
      '/traders',
      '/trades.json',
      (data) => {
        // Transform GitHub trades data if needed
        if (Array.isArray(data)) {
          return data.map((trade: any) => ({
            id: trade.id || trade.trader,
            name: trade.trader || trade.name,
            description: trade.description || '',
            location: trade.location || 'Unknown',
            inventory: [],
            buyRateModifier: 0.8,
            sellRateModifier: 1.2,
          }));
        }
        return data;
      }
    );
  }

  /**
   * Search items by name
   */
  async searchItems(query: string): Promise<Item[]> {
    try {
      const response = await this.getItems({ name: query });
      return response.items;
    } catch (error) {
      console.error('Failed to search items:', error);
      return [];
    }
  }

  /**
   * Get items by type
   */
  async getItemsByType(type: string): Promise<Item[]> {
    try {
      const response = await this.getItems({ type });
      return response.items;
    } catch (error) {
      console.error('Failed to get items by type:', error);
      return [];
    }
  }
}

// Export singleton instance
export const api = new ArcRaidersAPI();
