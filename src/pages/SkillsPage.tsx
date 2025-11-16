import { useState } from 'react';
import { Zap, Shield, Wind } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface Skill {
  id: string;
  name: string;
  category: 'combat' | 'survival' | 'utility';
  level: number;
  maxLevel: number;
  description: string;
  effects: string[];
  icon: React.ReactNode;
  unlocked: boolean;
  pointsCost: number;
}

const SKILL_CATEGORIES = ['combat', 'survival', 'utility'] as const;

const SKILLS: Skill[] = [
  // Combat Skills
  {
    id: 'precision_aim',
    name: 'Precision Aim',
    category: 'combat',
    level: 0,
    maxLevel: 5,
    description: 'Increase weapon accuracy and reduce recoil',
    effects: ['+5% accuracy', '-10% recoil', '+2% per level'],
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    unlocked: true,
    pointsCost: 1,
  },
  {
    id: 'rapid_fire',
    name: 'Rapid Fire',
    category: 'combat',
    level: 0,
    maxLevel: 5,
    description: 'Increase fire rate and magazine capacity',
    effects: ['+5% fire rate', '+3 magazine capacity'],
    icon: <Zap className="w-6 h-6 text-orange-400" />,
    unlocked: true,
    pointsCost: 1,
  },
  {
    id: 'critical_strike',
    name: 'Critical Strike',
    category: 'combat',
    level: 0,
    maxLevel: 3,
    description: 'Chance to deal critical damage',
    effects: ['+10% crit chance', '+30% crit damage'],
    icon: <Zap className="w-6 h-6 text-red-400" />,
    unlocked: false,
    pointsCost: 2,
  },
  // Survival Skills
  {
    id: 'thick_skin',
    name: 'Thick Skin',
    category: 'survival',
    level: 0,
    maxLevel: 5,
    description: 'Increase armor effectiveness',
    effects: ['+5% damage mitigation', '+10 armor'],
    icon: <Shield className="w-6 h-6 text-blue-400" />,
    unlocked: true,
    pointsCost: 1,
  },
  {
    id: 'quick_healing',
    name: 'Quick Healing',
    category: 'survival',
    level: 0,
    maxLevel: 4,
    description: 'Heal items work faster',
    effects: ['-30% heal time', '+20% heal amount'],
    icon: <Shield className="w-6 h-6 text-green-400" />,
    unlocked: true,
    pointsCost: 1,
  },
  {
    id: 'iron_lungs',
    name: 'Iron Lungs',
    category: 'survival',
    level: 0,
    maxLevel: 3,
    description: 'Hold your breath longer',
    effects: ['+50% breath duration', 'Underwater movement'],
    icon: <Shield className="w-6 h-6 text-cyan-400" />,
    unlocked: false,
    pointsCost: 2,
  },
  // Utility Skills
  {
    id: 'loot_finder',
    name: 'Loot Finder',
    category: 'utility',
    level: 0,
    maxLevel: 5,
    description: 'Find better loot and items',
    effects: ['+15% item quality', '+5% drop chance'],
    icon: <Wind className="w-6 h-6 text-purple-400" />,
    unlocked: true,
    pointsCost: 1,
  },
  {
    id: 'fast_learner',
    name: 'Fast Learner',
    category: 'utility',
    level: 0,
    maxLevel: 4,
    description: 'Gain experience faster',
    effects: ['+20% experience gain'],
    icon: <Wind className="w-6 h-6 text-pink-400" />,
    unlocked: true,
    pointsCost: 1,
  },
  {
    id: 'stealth_master',
    name: 'Stealth Master',
    category: 'utility',
    level: 0,
    maxLevel: 3,
    description: 'Become harder to detect',
    effects: ['-40% visibility', '+50% silenced damage'],
    icon: <Wind className="w-6 h-6 text-gray-400" />,
    unlocked: false,
    pointsCost: 2,
  },
];

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [selectedCategory, setSelectedCategory] = useState<'combat' | 'survival' | 'utility'>('combat');
  const [availablePoints, setAvailablePoints] = useState(10);

  const categorySkills = skills.filter(s => s.category === selectedCategory);

  const handleAddLevel = (skillId: string) => {
    setSkills(skills.map(skill => {
      if (skill.id === skillId && skill.level < skill.maxLevel && availablePoints >= skill.pointsCost) {
        setAvailablePoints(prev => prev - skill.pointsCost);
        return { ...skill, level: skill.level + 1 };
      }
      return skill;
    }));
  };

  const handleRemoveLevel = (skillId: string) => {
    setSkills(skills.map(skill => {
      if (skill.id === skillId && skill.level > 0) {
        setAvailablePoints(prev => prev + skill.pointsCost);
        return { ...skill, level: skill.level - 1 };
      }
      return skill;
    }));
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'combat': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'survival': return 'bg-blue-500/10 border-blue-500/30';
      case 'utility': return 'bg-purple-500/10 border-purple-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skill Tree</h1>
        <Card className="px-4 py-2">
          <p className="text-sm text-gray-400">Available Points: <span className="text-cyan-400 font-bold text-lg">{availablePoints}</span></p>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2">
        {SKILL_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded border capitalize transition-colors ${
              selectedCategory === category
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorySkills.map(skill => (
          <Card
            key={skill.id}
            className={`${getCategoryBg(skill.category)} border ${
              !skill.unlocked ? 'opacity-60' : ''
            }`}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {skill.icon}
                  <div>
                    <h3 className="font-semibold">{skill.name}</h3>
                    <p className="text-xs text-gray-400">
                      {skill.unlocked ? 'Unlocked' : 'Locked'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300">{skill.description}</p>

              {/* Effects */}
              <div className="bg-black/30 p-2 rounded text-xs space-y-1">
                {skill.effects.map((effect, i) => (
                  <p key={i} className="text-gray-300">{effect}</p>
                ))}
              </div>

              {/* Level */}
              <div className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                <span className="text-sm font-semibold">Level</span>
                <span className="text-lg font-bold">
                  {skill.level} / {skill.maxLevel}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveLevel(skill.id)}
                  disabled={skill.level === 0}
                  className="flex-1"
                >
                  -
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAddLevel(skill.id)}
                  disabled={!skill.unlocked || skill.level >= skill.maxLevel || availablePoints < skill.pointsCost}
                  className="flex-1"
                >
                  +
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
