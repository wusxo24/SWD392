import React from "react";

export const Pricing = () => {
  return (
    <div className="pricing flex flex-col items-center justify-center min-h-screen bg-[#2BC6FF26] p-6">
      <h2 className="text-6xl font-bold text-gray-800 mb-10">Our Pricing <span className="text-[#0DBFFF]">Plans</span> </h2>
      <p className="mb-20 text-3xl max-w-[1000px] text-center">
        A list of service packages categorized by each package, accompanied by a transparent and clear pricing table
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
        
        {/* Basic Plan */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Basic</h3>
          <p className="text-gray-600 mt-2">For individuals</p>
          <p className="text-3xl font-bold mt-4">$9/mo</p>
          <ul className="mt-4 space-y-2">
            <li>✔ 10 Projects</li>
            <li>✔ 5GB Storage</li>
            <li>✔ Email Support</li>
          </ul>
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
            Choose Plan
          </button>
        </div>
        
        {/* Standard Plan */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Standard</h3>
          <p className="text-gray-600 mt-2">For small teams</p>
          <p className="text-3xl font-bold mt-4">$19/mo</p>
          <ul className="mt-4 space-y-2">
            <li>✔ 50 Projects</li>
            <li>✔ 20GB Storage</li>
            <li>✔ Priority Support</li>
          </ul>
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
            Choose Plan
          </button>
        </div>
        
        {/* Premium Plan */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Premium</h3>
          <p className="text-gray-600 mt-2">For growing businesses</p>
          <p className="text-3xl font-bold mt-4">$49/mo</p>
          <ul className="mt-4 space-y-2">
            <li>✔ Unlimited Projects</li>
            <li>✔ 100GB Storage</li>
            <li>✔ Dedicated Support</li>
          </ul>
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
            Choose Plan
          </button>
        </div>
        
        {/* Enterprise Plan */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold">Enterprise</h3>
          <p className="text-gray-600 mt-2">For large organizations</p>
          <p className="text-3xl font-bold mt-4">$99/mo</p>
          <ul className="mt-4 space-y-2">
            <li>✔ Custom Solutions</li>
            <li>✔ 1TB Storage</li>
            <li>✔ 24/7 Premium Support</li>
          </ul>
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
            Choose Plan
          </button>
        </div>
        
      </div>
    </div>
  );
};

