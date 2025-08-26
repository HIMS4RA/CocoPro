import React from 'react';
import PropTypes from 'prop-types';
import { CocoPro } from '../CocoPro';
import { ArrowLeftIcon } from 'lucide-react';

export function ForgotLayout({ children, onBack, title, description }) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-amber-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div
          className="absolute inset-0 bg-[url('')] bg-cover bg-center"
        />
        <div className="relative z-10 text-white text-center">
          <CocoPro className="w-72 h-auto mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">
            Automated Coconut Husk Processing
          </h2>
          <p className="text-lg max-w-md">
            Welcome to the future of coconut processing. Efficient, sustainable, and intelligent.
          </p>
        </div>
      </div>
      {/* Right side - Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Login
          </button>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
            {description && <p className="text-gray-600 mb-6">{description}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

ForgotLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onBack: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};
