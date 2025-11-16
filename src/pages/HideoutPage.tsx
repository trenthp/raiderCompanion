import { useState } from 'react';
import { Lock, Unlock, Zap, Shield, Cpu } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface HideoutModule {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  icon: React.ReactNode;
  benefits: string[];
  craftTime?: number;
  requirements: {
    items: { name: string; quantity: number }[];
    credits?: number;
    level?: number;
  };
}

const HIDEOUT_MODULES: HideoutModule[] = [
  {
    id: 'med_station',
    name: 'Medical Station',
    description: 'Craft consumables and healing items',
    level: 1,
    maxLevel: 3,
    unlocked: true,
    icon: <Shield className="w-8 h-8 text-red-400" />,
    benefits: ['Craft healing items', 'Medical crafting recipes'],
    requirements: {
      items: [
        { name: 'Electronics', quantity: 5 },
        { name: 'Steel', quantity: 10 },
      ],
      credits: 2000,
      level: 5,
    },
  },
  {
    id: 'workshop',
    name: 'Workshop',
    description: 'Craft and upgrade weapons and armor',
    level: 1,
    maxLevel: 3,
    unlocked: true,
    icon: <Cpu className="w-8 h-8 text-yellow-400" />,
    benefits: ['Craft weapons', 'Upgrade weapons', 'Modify armor'],
    requirements: {
      items: [
        { name: 'Bolts', quantity: 20 },
        { name: 'Steel', quantity: 15 },
      ],
      credits: 5000,
      level: 10,
    },
  },
  {
    id: 'intel_center',
    name: 'Intelligence Center',
    description: 'Access advanced quests and intel',
    level: 1,
    maxLevel: 2,
    unlocked: false,
    icon: <Zap className="w-8 h-8 text-cyan-400" />,
    benefits: ['Advanced quests', 'Market intel', 'Trader info'],
    requirements: {
      items: [
        { name: 'Rare electronics', quantity: 8 },
        { name: 'Blueprint', quantity: 1 },
      ],
      credits: 10000,
      level: 20,
    },
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Increase your stash space',
    level: 2,
    maxLevel: 5,
    unlocked: true,
    icon: <Shield className="w-8 h-8 text-green-400" />,
    benefits: ['Increase item slots', 'Better organization'],
    requirements: {
      items: [
        { name: 'Wood', quantity: 30 },
        { name: 'Steel', quantity: 10 },
      ],
      credits: 1500,
      level: 1,
    },
  },
];

export function HideoutPage() {
  const [selectedModule, setSelectedModule] = useState<HideoutModule | null>(null);
  const unlockedCount = HIDEOUT_MODULES.filter(m => m.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hideout</h1>
        <div className="text-sm text-gray-400">
          {unlockedCount} / {HIDEOUT_MODULES.length} modules unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Module List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h2 className="text-lg font-bold mb-4">Modules</h2>
            <div className="space-y-2">
              {HIDEOUT_MODULES.map(module => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedModule?.id === module.id
                      ? 'bg-cyan-500/20 border-cyan-500/50'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  } ${!module.unlocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{module.name}</p>
                      <p className="text-xs text-gray-400">Level {module.level}/{module.maxLevel}</p>
                    </div>
                    {module.unlocked ? (
                      <Unlock className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Module Details */}
        <div className="lg:col-span-2">
          {selectedModule ? (
            <Card className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {selectedModule.icon}
                    <div>
                      <h2 className="text-2xl font-bold">{selectedModule.name}</h2>
                      <p className="text-gray-400">{selectedModule.description}</p>
                    </div>
                  </div>
                  {selectedModule.unlocked ? (
                    <Unlock className="w-6 h-6 text-green-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-red-400" />
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-800/50 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-1">Level</p>
                    <p className="text-lg font-semibold">
                      {selectedModule.level} / {selectedModule.maxLevel}
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-800/50 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className={`text-lg font-semibold ${
                      selectedModule.unlocked ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedModule.unlocked ? 'Unlocked' : 'Locked'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-bold mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {selectedModule.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-bold mb-3">
                  {selectedModule.unlocked ? 'Next Level Requirements' : 'Unlock Requirements'}
                </h3>
                <div className="space-y-3">
                  {selectedModule.requirements.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                      <span className="text-sm">{item.name}</span>
                      <span className="font-semibold">{item.quantity}</span>
                    </div>
                  ))}
                  {selectedModule.requirements.credits && (
                    <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                      <span className="text-sm">Credits</span>
                      <span className="font-semibold text-yellow-400">
                        {selectedModule.requirements.credits.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedModule.requirements.level && (
                    <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                      <span className="text-sm">Minimum Level</span>
                      <span className="font-semibold">{selectedModule.requirements.level}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-700 pt-4 flex gap-3">
                <Button disabled={!selectedModule.unlocked} className="flex-1">
                  {selectedModule.unlocked ? 'Upgrade' : 'Unlock'}
                </Button>
                <Button variant="secondary" className="flex-1">
                  View Wiki
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-400">Select a module to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
