
import React from 'react';
import type { ContractActivity } from '@/types/models';

interface ContractActivityFeedProps {
  activities: ContractActivity[];
}

const ContractActivityFeed: React.FC<ContractActivityFeedProps> = ({ activities }) => {
  return (
    <div>
      {activities.map((activity) => (
        <div key={activity.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
          <div>Action: {activity.action}</div>
          <div>Time: {activity.timestamp}</div>
          <div>User: {activity.userName}</div>
          <div>Details: {activity.details}</div>
        </div>
      ))}
    </div>
  );
};

export default ContractActivityFeed;
