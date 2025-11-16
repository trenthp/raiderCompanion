import { useState, useMemo } from 'react'
import { ITEMS, getItemById, searchItems } from '../data/items'
import { getLocationsWithLootItem, LOCATIONS } from '../data/locations'
import { getQuestsByTargetItem, QUESTS } from '../data/quests'
import { CRAFTING_RECIPES } from '../data/recipes'
import { WORKSHOP_UPGRADES } from '../data/workshops'
import styles from './ItemLookupPage.module.css'

export const ItemLookupPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Search items
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return ITEMS.slice(0, 20) // Show first 20 by default
    return searchItems(searchQuery)
  }, [searchQuery])

  const selectedItem = selectedItemId ? getItemById(selectedItemId) : null

  // Find where item is located
  const itemLocations = selectedItem
    ? getLocationsWithLootItem(selectedItem.id)
    : []

  // Find recipes that use this item
  const recipesUsingItem = selectedItem
    ? CRAFTING_RECIPES.filter(recipe =>
        recipe.ingredients.some(ing => ing.itemId === selectedItem.id)
      )
    : []

  // Find recipes that produce this item
  const recipesProducingItem = selectedItem
    ? CRAFTING_RECIPES.filter(recipe => recipe.outputItemId === selectedItem.id)
    : []

  // Find upgrades that require this item
  const upgradesRequiringItem = selectedItem
    ? WORKSHOP_UPGRADES.filter(upgrade =>
        upgrade.requirements.itemsRequired?.some(
          item => item.itemId === selectedItem.id
        )
      )
    : []

  // Find quests that involve this item
  const questsWithItem = selectedItem
    ? getQuestsByTargetItem(selectedItem.id)
    : []

  return (
    <div className={styles.container}>
      <h1>🔍 Item Lookup</h1>
      <p className={styles.subtitle}>
        Find where to get items, what they're used for, and their stats
      </p>

      <div className={styles.searchSection}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSelectedItemId(null)
          }}
          placeholder="Search items by name or description..."
          className={styles.searchInput}
          autoFocus
        />
      </div>

      <div className={styles.mainContent}>
        {/* Search Results / Item List */}
        <div className={styles.searchResults}>
          <h3>Items ({searchResults.length})</h3>
          <div className={styles.itemGrid}>
            {searchResults.map((item) => (
              <button
                key={item.id}
                className={`${styles.itemButton} ${
                  selectedItemId === item.id ? styles.selected : ''
                }`}
                onClick={() => setSelectedItemId(item.id)}
              >
                <img src={item.iconUrl} alt={item.name} className={styles.buttonIcon} />
                <div className={styles.buttonText}>
                  <div className={styles.buttonName}>{item.name}</div>
                  <div className={styles.buttonRarity}>{item.rarity}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Item Details */}
        {selectedItem && (
          <div className={styles.itemDetails}>
            <div className={styles.detailsHeader}>
              <img
                src={selectedItem.iconUrl}
                alt={selectedItem.name}
                className={styles.detailsIcon}
              />
              <div>
                <h2>{selectedItem.name}</h2>
                <p className={styles.itemMeta}>
                  <span className={styles.type}>{selectedItem.type}</span>
                  <span className={styles.rarity}>{selectedItem.rarity}</span>
                  {selectedItem.stackSize > 1 && (
                    <span className={styles.stackSize}>Stack: {selectedItem.stackSize}</span>
                  )}
                </p>
              </div>
            </div>

            <p className={styles.description}>{selectedItem.description}</p>

            {selectedItem.sellValue && (
              <div className={styles.stat}>
                <strong>Sell Value:</strong> 💰 {selectedItem.sellValue}
              </div>
            )}

            {selectedItem.stats && (
              <div className={styles.statsSection}>
                <h3>Stats</h3>
                <div className={styles.statsGrid}>
                  {Object.entries(selectedItem.stats).map(([key, value]) => (
                    <div key={key} className={styles.statItem}>
                      <span className={styles.statLabel}>{key}</span>
                      <span className={styles.statValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WHERE TO GET */}
            <div className={styles.section}>
              <h3>📍 Where to Get</h3>
              {itemLocations.length > 0 ? (
                <div className={styles.locationList}>
                  {itemLocations.map((location) => {
                    const lootEntry = location.lootTable.find(
                      (l) => l.itemId === selectedItem.id
                    )
                    return (
                      <div key={location.id} className={styles.locationCard}>
                        <div className={styles.locationName}>{location.name}</div>
                        <div className={styles.locationDetails}>
                          <span className={styles.difficulty}>
                            Difficulty: {location.difficulty}
                          </span>
                          {lootEntry && (
                            <>
                              <span className={styles.dropChance}>
                                Drop: {lootEntry.dropChance}%
                              </span>
                              <span className={styles.quantity}>
                                Qty: {lootEntry.quantityMin}-{lootEntry.quantityMax}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className={styles.empty}>Not found in any location</p>
              )}
            </div>

            {/* CRAFTING */}
            {(recipesProducingItem.length > 0 || recipesUsingItem.length > 0) && (
              <div className={styles.section}>
                <h3>🔧 Crafting</h3>

                {recipesProducingItem.length > 0 && (
                  <div className={styles.subsection}>
                    <h4>Produces This Item</h4>
                    {recipesProducingItem.map((recipe) => (
                      <div key={recipe.id} className={styles.recipeCard}>
                        <div className={styles.recipeName}>{recipe.name}</div>
                        <div className={styles.recipeDetails}>
                          <span>Output: {recipe.outputQuantity}x</span>
                          <span>Workshop Level: {recipe.workshopLevel}</span>
                        </div>
                        <div className={styles.ingredients}>
                          <strong>Requires:</strong>
                          {recipe.ingredients.map((ing) => {
                            const ingredientItem = getItemById(ing.itemId)
                            return (
                              <div key={ing.itemId} className={styles.ingredient}>
                                {ingredientItem?.name || ing.itemId} x{ing.quantity}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {recipesUsingItem.length > 0 && (
                  <div className={styles.subsection}>
                    <h4>Used In Recipes</h4>
                    {recipesUsingItem.map((recipe) => {
                      const ingredient = recipe.ingredients.find(
                        (ing) => ing.itemId === selectedItem.id
                      )
                      return (
                        <div key={recipe.id} className={styles.recipeCard}>
                          <div className={styles.recipeName}>{recipe.name}</div>
                          <div className={styles.recipeDetails}>
                            <span>Output: {recipe.outputQuantity}x</span>
                            <span>Requires: {ingredient?.quantity}x {selectedItem.name}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* UPGRADES */}
            {upgradesRequiringItem.length > 0 && (
              <div className={styles.section}>
                <h3>⬆️ Upgrades</h3>
                <div className={styles.upgradeList}>
                  {upgradesRequiringItem.map((upgrade) => {
                    const requirement = upgrade.requirements.itemsRequired?.find(
                      (r) => r.itemId === selectedItem.id
                    )
                    return (
                      <div key={upgrade.id} className={styles.upgradeCard}>
                        <div className={styles.upgradeName}>{upgrade.name}</div>
                        <div className={styles.upgradeDetails}>
                          Level {upgrade.level} - Requires {requirement?.quantity}x{' '}
                          {selectedItem.name}
                        </div>
                        {upgrade.benefits.length > 0 && (
                          <div className={styles.benefits}>
                            <strong>Benefits:</strong>
                            {upgrade.benefits.map((benefit) => (
                              <span key={benefit} className={styles.benefit}>
                                {benefit}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* QUESTS */}
            {questsWithItem.length > 0 && (
              <div className={styles.section}>
                <h3>⚔️ Quests</h3>
                <div className={styles.questList}>
                  {questsWithItem.map((quest) => (
                    <div key={quest.id} className={styles.questCard}>
                      <div className={styles.questName}>{quest.name}</div>
                      <div className={styles.questDetails}>
                        Faction: {quest.faction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
