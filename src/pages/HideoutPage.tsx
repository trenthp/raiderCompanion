import { Card } from '../components/common/Card';

export function HideoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hideout Tracker</h1>
      
      <Card>
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-4">Hideout Tracker Coming Soon</p>
          <p className="text-gray-500">
            Plan your hideout upgrades and track required materials
          </p>
        </div>
      </Card>
    </div>
  );
}
