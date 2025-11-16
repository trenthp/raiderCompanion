import { Card } from '../components/common/Card';

export function ResourcesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resource Tracker</h1>
      
      <Card>
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-4">Resource Tracker Coming Soon</p>
          <p className="text-gray-500">
            Track items you need for quests, crafts, and hideout upgrades
          </p>
        </div>
      </Card>
    </div>
  );
}
