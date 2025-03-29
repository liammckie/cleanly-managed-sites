
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Sites</h2>
          <p className="text-gray-600">Manage your cleaning sites</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Clients</h2>
          <p className="text-gray-600">Manage your clients</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Work Orders</h2>
          <p className="text-gray-600">Track work orders and tasks</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
