
import React from "react";
import { Helmet } from "react-helmet";

const Reports: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Reports | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <p>Reports and analytics will be displayed here</p>
      </div>
    </div>
  );
};

export default Reports;
