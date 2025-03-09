import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch pricing plans");
        }
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
        setError(error.message || "Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    try {
      const { data } = await axios.post(`/api/payments/${plan._id}`); // Fixed template literal

      const orderCode = data.data.orderCode; // Ensure backend returns orderCode

      // Store orderCode in localStorage
      localStorage.setItem("orderCode", orderCode) || sessionStorage.setItem("orderCode", orderCode);

      // Redirect to PayOS payment page
      window.location.href = data.data.checkoutUrl;
      alert(`Successfully subscribed to ${plan.name}!`);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  if (loading) {
    return (
      <div aria-live="polite" className="text-center text-2xl font-semibold p-10">
        Loading pricing plans...
      </div>
    );
  }

  if (error) {
    return (
      <div aria-live="polite" className="text-center text-2xl text-red-500 font-semibold p-10">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div id="pricing" className="flex flex-col min-h-screen items-center justify-center bg-[#2BC6FF26] p-6">
      <h2 className="text-6xl font-bold text-gray-800 mb-10">
        Our Pricing <span className="text-[#0DBFFF]">Plans</span>
      </h2>
      <p className="mb-20 text-3xl max-w-[1000px] text-center">
        A list of service packages categorized by each package, accompanied by a transparent and clear pricing table.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white shadow-lg rounded-2xl p-6 text-center transition-transform transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            <p className="text-3xl font-bold mt-4">${plan.price}/mo</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center justify-center gap-2">
                  <span>✔</span> {feature}
                </li>
              ))}
            </ul>
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              onClick={() => handleSubscribe(plan)}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
