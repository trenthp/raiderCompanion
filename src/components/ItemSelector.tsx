import { useState, useMemo } from 'react'
import { ITEMS, searchItems, getItemById, getItemsByType } from '../data/items'
import { GameItem } from '../types/gameData'
import styles from './ItemSelector.module.css'

interface ItemSelectorProps {
  value: string | null
  onChange: (itemId: string, item: GameItem) => void
  filter?: 'Weapon' | 'Armor' | 'Material' | 'Consumable' | 'Trinket'
  label?: string
}

export const ItemSelector = ({ value, onChange, filter, label }: ItemSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Get filtered items based on type filter
  const availableItems = useMemo(() => {
    if (filter) {
      return getItemsByType(filter)
    }
    return ITEMS
  }, [filter])

  // Search items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableItems
    }
    return availableItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, availableItems])

  const selectedItem = value ? getItemById(value) : null

  const handleSelect = (itemId: string) => {
    const item = getItemById(itemId)
    if (item) {
      onChange(itemId, item)
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.selector}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedItem ? (
            <div className={styles.selectedItem}>
              <img src={selectedItem.iconUrl} alt={selectedItem.name} className={styles.icon} />
              <div>
                <div className={styles.itemName}>{selectedItem.name}</div>
                <div className={styles.itemRarity}>{selectedItem.rarity}</div>
              </div>
            </div>
          ) : (
            <span className={styles.placeholder}>Select an item...</span>
          )}
          <span className={styles.arrow}>▼</span>
        </button>

        {isOpen && (
          <div className={styles.dropdown}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />

            <div className={styles.itemList}>
              {filteredItems.length === 0 ? (
                <div className={styles.empty}>No items found</div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.itemOption} ${
                      selectedItem?.id === item.id ? styles.selected : ''
                    }`}
                    onClick={() => handleSelect(item.id)}
                  >
                    <img src={item.iconUrl} alt={item.name} className={styles.optionIcon} />
                    <div className={styles.itemInfo}>
                      <div className={styles.optionName}>{item.name}</div>
                      <div className={styles.optionDetails}>
                        {item.type} • {item.rarity}
                        {item.stackSize > 1 && ` • Stack: ${item.stackSize}`}
                      </div>
                    </div>
                    {item.sellValue && (
                      <div className={styles.sellValue}>💰 {item.sellValue}</div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
