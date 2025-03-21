import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-700 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};
