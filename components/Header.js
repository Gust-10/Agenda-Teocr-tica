import React from 'react';
import AnimatedLogo from './AnimatedLogo.js';
import DownloadIcon from './icons/DownloadIcon.js';

const Header = ({ installPrompt, handleInstallClick }) => (
  <header className="relative text-center p-4 md:p-6">
    <div className="flex flex-col items-center justify-center">
      <AnimatedLogo />
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-3">
        Agenda Teocráticas
      </h1>
    </div>

    {installPrompt && (
      <button
        onClick={handleInstallClick}
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-110"
        aria-label="Instalar aplicación"
        title="Instalar aplicación"
      >
        <DownloadIcon className="h-6 w-6"/>
      </button>
    )}
  </header>
);

export default Header;