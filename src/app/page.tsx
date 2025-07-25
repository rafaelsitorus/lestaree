'use client'; // This must be the very first line of the file

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Asumsi path untuk Button dari Shadcn UI
import HomePage from '../components/HomePage';
import MapPage from '../components/MapPage';
import AboutPage from '../components/AboutPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'map':
        return <MapPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation - Fixed at top */}
      <nav
        className="fixed top-0 left-0 right-0 flex items-center justify-between w-full px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-200"
        style={{ zIndex: 100 }}
      >
        <div className="text-2xl font-bold text-green-600">Lestaree</div>

        <div className="hidden md:flex items-center space-x-1 bg-gray-100/80 rounded-full px-2 py-2">
          <Button 
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            className={`rounded-full px-6 ${
              currentPage === 'home' 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                : 'text-gray-600 hover:text-green-600'
            }`}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </Button>
          <Button 
            variant={currentPage === 'map' ? 'default' : 'ghost'}
            className={`rounded-full px-6 ${
              currentPage === 'map' 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                : 'text-gray-600 hover:text-green-600'
            }`}
            onClick={() => setCurrentPage('map')}
          >
            Map
          </Button>
          <Button 
            variant={currentPage === 'about' ? 'default' : 'ghost'}
            className={`rounded-full px-6 ${
              currentPage === 'about' 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                : 'text-gray-600 hover:text-green-600'
            }`}
            onClick={() => setCurrentPage('about')}
          >
            About
          </Button>
        </div>

        <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 border-green-600 rounded-full px-6">
          Contact Us
        </Button>
      </nav>

      {/* Page Content */}
      {renderPage()}
    </div>
  );
}