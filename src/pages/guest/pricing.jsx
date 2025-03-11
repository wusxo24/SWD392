import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { getPricingPlans, subscribeToPlan } from "@/services/pricingService";

export const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPricingPlans();
        setPlans(data);
      } catch (error) {
        setError(error.message || "Failed to load pricing plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleSubscribe = async (plan) => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    try {
      const data = await subscribeToPlan(plan._id);
      const orderCode = data.data.orderCode;
      localStorage.setItem("orderCode", orderCode) || sessionStorage.setItem("orderCode", orderCode);
      window.location.href = data.data.checkoutUrl;
      toast.success(`Successfully subscribed to ${plan.name}!`);
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div id="pricing" className="flex flex-col min-h-screen items-center justify-center bg-[#2BC6FF26] p-6">
      <ToastContainer/>
      <h2 className="text-6xl font-bold text-gray-800 mb-10">
        Our Pricing <span className="text-[#0DBFFF]">Plans</span>
      </h2>
      <p className="mb-20 text-3xl max-w-[1000px] text-center">
        A list of service packages categorized by each package, accompanied by a
        transparent and clear pricing table.
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white shadow-lg rounded-2xl p-6 text-center transition-transform transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            <p className="text-3xl font-bold mt-4">₫{plan.price}</p>
            <div className="text-left">
            <ul className="mt-4 space-y-2 h-[200px]">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center justify-center gap-2 text-size-2 text-gray-600"
                >
                  <span>✔</span> {feature}
                </li>
              ))}
            </ul>
           </div>
            
            <div className="relative mt-[10px] flex items-center justify-center">
              <span className="absolute top-[-1px] right-[-1px] flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C54759] opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-[#C54759]"></span>
              </span>

              <motion.button
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubscribe(plan)}
              >
                Choose Plan
              </motion.button>
            </div>
          </div>
        ))}
      </motion.div>
       {/* Custom Login Modal */}
       {showLoginModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 bg-cover bg-center flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Login to buy
            </h3>
            <p className="text-gray-600">You need to be logged in to buy now. Do you want to log in now?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="py-2 px-6 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-6 bg-[#0DBFFF] text-white rounded-lg hover:bg-[#0a6999] transition"
                onClick={handleLoginRedirect}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
