import React from "react";
import { AlertCircle, Home, RotateCcw } from "lucide-react";

const FallbackPage = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Something went wrong
          </h1>
          <p className="text-gray-600 leading-relaxed">
            We're experiencing a temporary issue. Please try refreshing the page
            or return to the homepage.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try again</span>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Go to homepage</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            If the problem continues, contact{" "}
            <a
              href="mailto:support@company.com"
              className="text-blue-950 hover:text-blue-800"
            >
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FallbackPage;
