import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribeToPlan, getPricingPlans } from "@/services/pricingService";
import { toast } from "react-toastify";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plans = await getPricingPlans();
        const selectedPlan = plans.find((p) => p._id === id);
        if (selectedPlan) {
          setPlan(selectedPlan);
        } else {
          toast.error("Plan not found");
          navigate("/pricing");
        }
      } catch (error) {
        toast.error("Error fetching plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, navigate]);

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    try {
      const data = await subscribeToPlan(plan._id);
      const orderCode = data.data.orderCode;
      localStorage.setItem("orderCode", orderCode) ||
        sessionStorage.setItem("orderCode", orderCode);

      setTimeout(() => {
        window.location.href = data.data.checkoutUrl;
      }, 2000);
    } catch (error) {
      toast.error("Payment failed, please try again.");
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading details...
        </p>
      </div>
    );

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gray-900 p-6">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-[length:300%_300%]"
        ></motion.div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-32 h-32 bg-purple-500 opacity-30 blur-3xl rounded-full"
      ></motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-24 h-24 bg-blue-400 opacity-30 blur-3xl rounded-full"
      ></motion.div>

      {/* Glowing Particle Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-20 left-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
        ></motion.div>
      </div>

      {/* Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 max-w-lg w-full border border-gray-200 transform transition-all hover:scale-105 hover:shadow-3xl"
      >
        {/* Plan Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text"
        >
          {plan.name} Plan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-3 text-center text-lg text-gray-700"
        >
          {plan.description}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-3xl font-semibold text-gray-900 mt-4"
        >
          ₫{plan.price}{" "}
          <span className="text-lg text-gray-500">
            / {plan.duration} months
          </span>
        </motion.p>

        {/* Features List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            What's included:
          </h3>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-gray-700 text-base bg-gray-100 px-4 py-2 rounded-lg shadow-sm transition transform hover:scale-105"
              >
                <FaCheckCircle className="text-green-500" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: isProcessing ? 1 : 1.05 }}
            whileTap={{ scale: isProcessing ? 1 : 0.95 }}
            disabled={isProcessing}
            onClick={handleProceedToPayment}
            className={`w-full py-3 rounded-lg font-medium transition-all transform hover:shadow-lg ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Processing...
              </span>
            ) : (
              "Proceed to Payment"
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 text-blue-600 hover:underline text-sm transition hover:text-blue-800"
            onClick={() => navigate("/pricing")}
          >
            Back to Pricing
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanDetails;
