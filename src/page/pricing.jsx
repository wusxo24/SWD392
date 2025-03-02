import React, { useEffect, useState } from "react";
import axios from "axios";

export const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://swd-392-api.vercel.app/api/services")
      .then((response) => {
        
        setPlans(response.data); // Store API response in state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pricing plans:", error);
        setError("Failed to load pricing plans");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-2xl font-semibold p-10">Loading pricing plans...</div>;
  }

  if (error) {
    return <div className="text-center text-2xl text-red-500 font-semibold p-10">{error}</div>;
  }

  return (
    <div className="pricing flex flex-col min-h-screen items-center justify-center bg-[#2BC6FF26] p-6">
      <h2 className="text-6xl font-bold text-gray-800 mb-10">
        Our Pricing <span className="text-[#0DBFFF]">Plans</span>
      </h2>
      <p className="mb-20 text-3xl max-w-[1000px] text-center">
        A list of service packages categorized by each package, accompanied by a transparent and clear pricing table
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-white shadow-lg rounded-2xl p-6 text-center">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            <p className="text-3xl font-bold mt-4">${plan.price}/mo</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index}>✔ {feature}</li>
              ))}
            </ul>
            <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
