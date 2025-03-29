
import React from "react";
import { Helmet } from "react-helmet";

const Help: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Help | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
        <p>Support resources and documentation will be displayed here</p>
      </div>
    </div>
  );
};

export default Help;
