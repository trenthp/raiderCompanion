import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { ItemCard } from '../components/common/ItemCard';
import { ItemCardSkeleton } from '../components/common/Skeleton';
import { useStore } from '../store/useStore';
import { useItems } from '../hooks/useApi';
import type { LoadoutType } from '../types';

export function LoadoutPage() {
  const { loadouts, createLoadout, currentLoadout, setCurrentLoadout } = useStore();
  const { data, isLoading } = useItems({ limit: 12 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLoadoutName, setNewLoadoutName] = useState('');
  const [newLoadoutType, setNewLoadoutType] = useState<LoadoutType>('solo_pve');

  const handleCreateLoadout = () => {
    if (!newLoadoutName.trim()) return;
    const loadout = createLoadout(newLoadoutName, newLoadoutType);
    setCurrentLoadout(loadout);
    setShowCreateModal(false);
    setNewLoadoutName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loadout Builder</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Loadout
        </Button>
      </div>

      {/* Create Loadout Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Loadout</h2>
            
            <div className="space-y-4">
              <Input
                label="Loadout Name"
                value={newLoadoutName}
                onChange={(e) => setNewLoadoutName(e.target.value)}
                placeholder="My Awesome Loadout"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Loadout Type
                </label>
                <select
                  value={newLoadoutType}
                  onChange={(e) => setNewLoadoutType(e.target.value as LoadoutType)}
                  className="input w-full"
                >
                  <option value="solo_pve">Solo PvE</option>
                  <option value="squad_pve">Squad PvE</option>
                  <option value="pvp">PvP</option>
                  <option value="stealth">Stealth</option>
                  <option value="farming">Farming</option>
                  <option value="boss_hunting">Boss Hunting</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateLoadout} className="flex-1">
                  Create
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Loadout Slots */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <h2 className="text-xl font-bold mb-4">Loadout Slots</h2>
            
            {currentLoadout ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{currentLoadout.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">
                    {currentLoadout.type.replace('_', ' ')}
                  </p>
                </div>

                {/* Weight Display */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Weight</span>
                    <span>
                      {currentLoadout.stats.totalWeight.toFixed(1)} / {currentLoadout.stats.maxWeight}kg
                    </span>
                  </div>
                  <div className="w-full bg-dark-400 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        currentLoadout.stats.totalWeight > currentLoadout.stats.maxWeight
                          ? 'bg-danger'
                          : 'bg-primary'
                      }`}
                      style={{
                        width: `${Math.min(
                          (currentLoadout.stats.totalWeight / currentLoadout.stats.maxWeight) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Weapon Slots */}
                <div className="space-y-2">
                  <div className="bg-dark-300 p-4 rounded border-2 border-dashed border-dark-400">
                    <p className="text-sm text-gray-400">Primary Weapon</p>
                    <p className="text-xs text-gray-500 mt-1">Drag item here</p>
                  </div>
                  
                  <div className="bg-dark-300 p-4 rounded border-2 border-dashed border-dark-400">
                    <p className="text-sm text-gray-400">Secondary Weapon</p>
                    <p className="text-xs text-gray-500 mt-1">Drag item here</p>
                  </div>

                  <div className="bg-dark-300 p-4 rounded border-2 border-dashed border-dark-400">
                    <p className="text-sm text-gray-400">Melee</p>
                    <p className="text-xs text-gray-500 mt-1">Drag item here</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Create a loadout to get started</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Item Browser */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Item Browser</h2>
              <Input
                placeholder="Search items..."
                className="max-w-xs"
              />
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {isLoading ? (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ItemCardSkeleton key={i} />
                  ))}
                </>
              ) : data?.items && data.items.length > 0 ? (
                data.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onSelect={(item) => {
                      console.log('Selected item:', item);
                      // TODO: Add to loadout
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <p>No items found</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* My Loadouts */}
      {loadouts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Loadouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadouts.map((loadout) => (
              <Card
                key={loadout.id}
                hover
                onClick={() => setCurrentLoadout(loadout)}
                className={currentLoadout?.id === loadout.id ? 'border-primary' : ''}
              >
                <h3 className="font-semibold text-lg mb-2">{loadout.name}</h3>
                <p className="text-sm text-gray-400 capitalize mb-3">
                  {loadout.type.replace('_', ' ')}
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Weight:</span>{' '}
                    <span className="font-semibold">
                      {loadout.stats.totalWeight.toFixed(1)}kg
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Updated:</span>{' '}
                    <span className="font-semibold">
                      {new Date(loadout.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
