import { useState } from 'react';
import { Zap, Users, Clock, Trophy } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useArcs } from '../hooks/useApi';
import { Skeleton } from '../components/common/Skeleton';

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  extreme: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function MissionsPage() {
  const { data: arcs = [], isLoading, error } = useArcs();
  const [selectedArc, setSelectedArc] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const filteredArcs = difficultyFilter
    ? arcs.filter(arc => arc.difficulty === difficultyFilter)
    : arcs;

  const selectedArcData = arcs.find(arc => arc.id === selectedArc);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mission Planner</h1>
        <Card className="border-red-500/30 bg-red-500/5">
          <p className="text-red-400">Failed to load missions. Please try again.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enemy Encounters</h1>
        <div className="text-sm text-gray-400">
          {filteredArcs.length} enemies
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Enemy List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold mb-3">Difficulty</h2>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={difficultyFilter === null ? 'primary' : 'secondary'}
                    onClick={() => setDifficultyFilter(null)}
                    className="w-full justify-start"
                  >
                    All ({arcs.length})
                  </Button>
                  <Button
                    variant={difficultyFilter === 'easy' ? 'primary' : 'secondary'}
                    onClick={() => setDifficultyFilter('easy')}
                    className="w-full justify-start"
                  >
                    Easy
                  </Button>
                  <Button
                    variant={difficultyFilter === 'medium' ? 'primary' : 'secondary'}
                    onClick={() => setDifficultyFilter('medium')}
                    className="w-full justify-start"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={difficultyFilter === 'hard' ? 'primary' : 'secondary'}
                    onClick={() => setDifficultyFilter('hard')}
                    className="w-full justify-start"
                  >
                    Hard
                  </Button>
                  <Button
                    variant={difficultyFilter === 'extreme' ? 'primary' : 'secondary'}
                    onClick={() => setDifficultyFilter('extreme')}
                    className="w-full justify-start"
                  >
                    Extreme
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-bold mb-3">Enemies ({filteredArcs.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </>
                  ) : (
                    filteredArcs.map(arc => (
                      <button
                        key={arc.id}
                        onClick={() => setSelectedArc(arc.id)}
                        className={`w-full text-left p-2 rounded border transition-colors ${
                          selectedArc === arc.id
                            ? 'bg-cyan-500/20 border-cyan-500/50'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <p className="font-semibold text-sm">{arc.name}</p>
                        <p className="text-xs text-gray-400">{arc.type}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card>
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </Card>
          ) : selectedArcData ? (
            <Card className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedArcData.name}</h2>
                    <div className={`inline-block mt-2 px-3 py-1 rounded border text-sm font-semibold ${
                      DIFFICULTY_COLORS[selectedArcData.difficulty as keyof typeof DIFFICULTY_COLORS]
                    }`}>
                      {selectedArcData.difficulty.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right text-gray-400 text-sm">
                    Type: <span className="text-cyan-400 font-semibold">{selectedArcData.type}</span>
                  </div>
                </div>
                <p className="text-gray-300">{selectedArcData.description}</p>
              </div>

              {/* Requirements */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-bold mb-3">Requirements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-1">Recommended Level</p>
                    <p className="text-lg font-semibold">{selectedArcData.requirements.recommendedLevel}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-1">Team Size</p>
                    <p className="text-lg font-semibold">
                      {selectedArcData.requirements.minPlayers}-{selectedArcData.requirements.maxPlayers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-bold mb-3">Rewards</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-400">Credits</p>
                      <p className="font-semibold">{selectedArcData.rewards.credits.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Experience</p>
                      <p className="font-semibold">{selectedArcData.rewards.experience.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-gray-700 pt-4 grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="font-semibold">{Math.round(selectedArcData.estimatedDuration / 60)}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 p-3 rounded">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">Map</p>
                    <p className="font-semibold">{selectedArcData.map}</p>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded">
                  <p className="text-xs text-gray-400">Type</p>
                  <p className="font-semibold capitalize">{selectedArcData.type}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-700 pt-4 flex gap-3">
                <Button className="flex-1">
                  Prepare Loadout
                </Button>
                <Button variant="secondary" className="flex-1">
                  View in Wiki
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-400">Select an enemy to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
