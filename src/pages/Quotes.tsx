
import React from "react";
import { Helmet } from "react-helmet";

const Quotes: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Quotes | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quotes</h1>
        <p>Quote list will be displayed here</p>
      </div>
    </div>
  );
};

export default Quotes;
