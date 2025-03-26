
import React from 'react';

interface NotesPanelProps {
  site: any;
  refetchSite: () => void;
}

export default function NotesPanel({ site, refetchSite }: NotesPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Notes</h3>
      <div className="text-sm text-gray-500">
        Notes panel component - to be implemented
      </div>
    </div>
  );
}
