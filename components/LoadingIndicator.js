import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">
        Analyzing website accessibility...
      </p>
      <p className="mt-2 text-sm text-gray-500 max-w-md text-center">
        This may take a moment as we scan the website for accessibility issues and generate recommendations.
      </p>
    </div>
  );
};

export default LoadingIndicator;
