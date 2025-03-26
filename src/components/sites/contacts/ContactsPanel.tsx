
import React from 'react';

interface ContactsPanelProps {
  site: any;
  refetchSite: () => void;
}

export default function ContactsPanel({ site, refetchSite }: ContactsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Contacts</h3>
      <div className="text-sm text-gray-500">
        Contacts panel component - to be implemented
      </div>
    </div>
  );
}
