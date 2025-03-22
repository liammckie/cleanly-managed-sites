
import React from 'react';

export const ImportExportHeader: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Data Import & Export</h2>
      <p className="text-muted-foreground mb-6">
        Export your data for backup or import data from another system.
        Use the cards below to manage your data.
      </p>
    </div>
  );
};
