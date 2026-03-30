import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const Subscriptions = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-display text-white">Subscriptions</h1>
        <Link to="/subscriptions/new" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
          + Add New
        </Link>
      </div>
      <Card className="h-64 flex items-center justify-center">
        <p className="text-gray-500">Subscriptions Grid Placeholder</p>
      </Card>
    </div>
  );
};
export default Subscriptions;
