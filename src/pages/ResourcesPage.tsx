import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useItems } from '../hooks/useApi';
import { Skeleton } from '../components/common/Skeleton';

interface TrackedItem {
  id: string;
  itemId: string;
  itemName: string;
  targetQuantity: number;
  currentQuantity: number;
  rarity: string;
  icon?: string;
}

export function ResourcesPage() {
  const { data: itemsResponse, isLoading } = useItems({ limit: 20 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>(() => {
    const saved = localStorage.getItem('trackedItems');
    return saved ? JSON.parse(saved) : [];
  });

  const items = itemsResponse?.items || [];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddGoal = () => {
    if (!selectedItemId) return;

    const item = items.find(i => i.id === selectedItemId);
    if (!item) return;

    const trackedItem: TrackedItem = {
      id: crypto.randomUUID(),
      itemId: item.id,
      itemName: item.name,
      targetQuantity: quantity,
      currentQuantity: 0,
      rarity: item.rarity,
      icon: item.icon,
    };

    const updated = [...trackedItems, trackedItem];
    setTrackedItems(updated);
    localStorage.setItem('trackedItems', JSON.stringify(updated));

    setShowAddModal(false);
    setSelectedItemId(null);
    setQuantity(1);
  };

  const handleRemoveItem = (id: string) => {
    const updated = trackedItems.filter(item => item.id !== id);
    setTrackedItems(updated);
    localStorage.setItem('trackedItems', JSON.stringify(updated));
  };

  const handleUpdateQuantity = (id: string, currentQuantity: number) => {
    const updated = trackedItems.map(item =>
      item.id === id ? { ...item, currentQuantity } : item
    );
    setTrackedItems(updated);
    localStorage.setItem('trackedItems', JSON.stringify(updated));
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'text-gray-400',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400',
    };
    return colors[rarity.toLowerCase()] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resource Tracker</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Resource Goal</h2>

            <div className="space-y-4">
              <Input
                label="Search Items"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="border border-gray-700 rounded max-h-48 overflow-y-auto">
                  {filteredItems.length === 0 ? (
                    <p className="p-3 text-gray-400 text-center">No items found</p>
                  ) : (
                    filteredItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`w-full text-left p-3 border-b border-gray-700 hover:bg-gray-800/50 transition-colors ${
                          selectedItemId === item.id ? 'bg-cyan-500/20' : ''
                        }`}
                      >
                        <p className="font-semibold">{item.name}</p>
                        <p className={`text-sm ${getRarityColor(item.rarity)}`}>
                          {item.rarity} • {item.type}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {selectedItemId && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Quantity
                  </label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddGoal}
                  disabled={!selectedItemId}
                  className="flex-1"
                >
                  Add Goal
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tracked Items */}
      {trackedItems.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">No items tracked yet</p>
            <p className="text-gray-500 mb-6">
              Add items you need to track for quests, crafts, and hideout upgrades
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create First Goal
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trackedItems.map(item => {
            const progress = (item.currentQuantity / item.targetQuantity) * 100;
            const isComplete = item.currentQuantity >= item.targetQuantity;

            return (
              <Card key={item.id} className={isComplete ? 'border-green-500/30' : ''}>
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.itemName}</h3>
                      <p className={`text-sm ${getRarityColor(item.rarity)}`}>
                        {item.rarity}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.currentQuantity} / {item.targetQuantity}
                      </p>
                    </div>
                    {isComplete && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isComplete ? 'bg-green-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  {/* Progress */}
                  <p className="text-xs text-gray-400">
                    {Math.round(progress)}% collected
                  </p>

                  {/* Quantity Input */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={item.currentQuantity}
                      onChange={(e) => {
                        handleUpdateQuantity(item.id, Math.max(0, parseInt(e.target.value) || 0));
                      }}
                      className="input flex-1 h-8 text-sm"
                      min="0"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.currentQuantity + 1)
                      }
                      className="px-3"
                    >
                      +
                    </Button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Goal
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
