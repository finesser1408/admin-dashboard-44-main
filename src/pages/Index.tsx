import { UsersList } from '@/components/UsersList';

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <UsersList />
      </div>
    </div>
  );
};

export default Index;
