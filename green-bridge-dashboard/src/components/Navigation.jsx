import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🌿</span>
            <h1 className="text-white text-xl font-bold">Green Bridge Monitor</h1>
          </div>
          <div className="flex items-center">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
            >
              View Stats
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 