import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Target, ClipboardList, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { useStore } from '../store/useStore';

interface FeatureCardProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureCard({ to, icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Link to={to}>
      <Card hover className="h-full">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400 mb-4">{description}</p>
          <div className="flex items-center gap-2 text-primary font-semibold mt-auto">
            Start <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function HomePage() {
  const { loadouts } = useStore();
  const recentLoadouts = loadouts.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">Arc Raiders</span> Loadout Helper
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Plan your raids. Optimize your loadouts. Dominate the battlefield.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          to="/loadout"
          icon={Package}
          title="Loadout Builder"
          description="Create and customize your perfect loadout for any situation"
        />
        <FeatureCard
          to="/missions"
          icon={Target}
          title="Mission Planner"
          description="Plan your raids and see what you need to succeed"
        />
        <FeatureCard
          to="/resources"
          icon={ClipboardList}
          title="Resource Tracker"
          description="Track items you need for quests, crafts, and upgrades"
        />
      </div>

      {/* Recent Loadouts */}
      {recentLoadouts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Recent Loadouts</h2>
            <Link to="/loadout" className="text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentLoadouts.map((loadout) => (
              <Link key={loadout.id} to={`/loadout/${loadout.id}`}>
                <Card hover>
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
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats or Tips */}
      <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Pro Tip</h3>
            <p className="text-gray-300">
              Start by creating a loadout template for your playstyle, then customize it for specific missions. 
              Use the Resource Tracker to efficiently farm materials for your upgrades.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
