import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Item, ItemsResponse, Arc, Quest, Trader, ItemsQueryParams, ArcsQueryParams } from '../types';

/**
 * Hook to fetch all items with optional filtering
 */
export function useItems(params?: ItemsQueryParams): UseQueryResult<ItemsResponse> {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => api.getItems(params),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    retry: 2,
    retryDelay: 1000,
  });
}

/**
 * Hook to fetch a single item by ID
 */
export function useItem(itemId: string): UseQueryResult<Item | null> {
  return useQuery({
    queryKey: ['item', itemId],
    queryFn: () => api.getItem(itemId),
    enabled: !!itemId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook to search items by name
 */
export function useSearchItems(query: string): UseQueryResult<Item[]> {
  return useQuery({
    queryKey: ['items', 'search', query],
    queryFn: () => api.searchItems(query),
    enabled: query.length >= 2, // Only search with 2+ characters
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch items by type
 */
export function useItemsByType(type: string): UseQueryResult<Item[]> {
  return useQuery({
    queryKey: ['items', 'type', type],
    queryFn: () => api.getItemsByType(type),
    enabled: !!type,
    staleTime: 1000 * 60 * 60,
  });
}

/**
 * Hook to fetch ARCs
 */
export function useArcs(params?: ArcsQueryParams): UseQueryResult<Arc[]> {
  return useQuery({
    queryKey: ['arcs', params],
    queryFn: () => api.getArcs(params),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook to fetch quests
 */
export function useQuests(): UseQueryResult<Quest[]> {
  return useQuery({
    queryKey: ['quests'],
    queryFn: () => api.getQuests(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook to fetch traders
 */
export function useTraders(): UseQueryResult<Trader[]> {
  return useQuery({
    queryKey: ['traders'],
    queryFn: () => api.getTraders(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Hook to fetch weapons specifically
 */
export function useWeapons(): UseQueryResult<Item[]> {
  return useItemsByType('weapon');
}

/**
 * Hook to fetch attachments specifically
 */
export function useAttachments(): UseQueryResult<Item[]> {
  return useItemsByType('attachment');
}

/**
 * Hook to fetch armor specifically
 */
export function useArmor(): UseQueryResult<Item[]> {
  return useItemsByType('armor');
}

/**
 * Hook to fetch consumables specifically
 */
export function useConsumables(): UseQueryResult<Item[]> {
  return useItemsByType('consumable');
}
