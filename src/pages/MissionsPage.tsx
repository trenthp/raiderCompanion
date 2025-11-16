import { Card } from '../components/common/Card';

export function MissionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mission Planner</h1>
      
      <Card>
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-4">Mission Planner Coming Soon</p>
          <p className="text-gray-500">
            Browse ARCs, plan missions, and see what you need to succeed
          </p>
        </div>
      </Card>
    </div>
  );
}
