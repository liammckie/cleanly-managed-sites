
import React from 'react';

interface PeriodicalScheduleProps {
  site: any;
  refetchSite: () => void;
}

export default function PeriodicalSchedule({ site, refetchSite }: PeriodicalScheduleProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Periodical Schedule</h3>
      <div className="text-sm text-gray-500">
        Periodical schedule component - to be implemented
      </div>
    </div>
  );
}
