
import React from "react";
import { Helmet } from "react-helmet";

const Invoices: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Invoices | CleanMap</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Invoices</h1>
        <p>Invoice list will be displayed here</p>
      </div>
    </div>
  );
};

export default Invoices;
