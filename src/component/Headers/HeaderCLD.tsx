import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, ChevronLeft, ChevronRight, User } from 'lucide-react';

const SakigaiHeaders = () => {
  const [activeView, setActiveView] = useState('large');

  // Desktop/Large Header
  const LargeHeader = () => (
    <div className="w-full">
      {/* Promo Banner */}
      <div className="bg-emerald-800 text-white py-2 px-4 flex items-center justify-between">
        <ChevronLeft className="w-5 h-5 cursor-pointer" />
        <div className="flex items-center gap-4">
          <span className="text-sm">Winter Sale: UP TO 40% OFF</span>
          <button className="underline text-sm font-medium">shop now</button>
          <button className="underline text-sm">see details</button>
        </div>
        <ChevronRight className="w-5 h-5 cursor-pointer" />
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="text-3xl font-light tracking-wide">
              <span className="text-emerald-800">SAKIGAI</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-600"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Icons */}
              <div className="flex items-center gap-1 text-emerald-800 cursor-pointer hover:text-emerald-900">
                <User className="w-5 h-5" />
                <span className="text-sm">Sign In / Sign Up</span>
              </div>
              <Heart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-emerald-800" />
              <div className="relative cursor-pointer">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-emerald-800" />
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">2</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8 text-sm">
            <a href="#" className="text-gray-700 hover:text-emerald-800 font-medium">New!</a>
            <a href="#" className="text-emerald-800 hover:text-emerald-900 font-medium border-b-2 border-emerald-800 pb-1">Gifts</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Living Room</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Bedroom</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Dining</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Office</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Storage</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Lighting</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Outdoor</a>
            <a href="#" className="text-red-600 hover:text-red-700 font-medium">Sale</a>
          </nav>
        </div>
      </div>
    </div>
  );

  // Tablet Header
  const TabletHeader = () => (
    <div className="w-full">
      {/* Promo Banner */}
      <div className="bg-emerald-800 text-white py-2 px-4 flex items-center justify-between">
        <ChevronLeft className="w-5 h-5 cursor-pointer" />
        <div className="flex items-center gap-3">
          <span className="text-sm">Winter Sale: UP TO 40% OFF</span>
          <button className="underline text-sm font-medium">shop now</button>
          <button className="underline text-sm">see details</button>
        </div>
        <ChevronRight className="w-5 h-5 cursor-pointer" />
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div className="text-2xl font-light tracking-wide">
              <span className="text-emerald-800">sakigai</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-emerald-800 cursor-pointer text-sm">
                <User className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </div>
              <Heart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-emerald-800" />
              <div className="relative cursor-pointer">
                <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-emerald-800" />
                <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-600"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Navigation - Two Rows */}
          <nav className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="text-gray-700 hover:text-emerald-800 font-medium">New!</a>
            <a href="#" className="text-emerald-800 hover:text-emerald-900 font-medium border-b-2 border-emerald-800">Gifts</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Living Room</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Bedroom</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Dining</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Office</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Storage</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Lighting</a>
            <a href="#" className="text-gray-700 hover:text-emerald-800">Outdoor</a>
            <a href="#" className="text-red-600 hover:text-red-700 font-medium">Sale</a>
          </nav>
        </div>
      </div>
    </div>
  );

  // Mobile Header
  const MobileHeader = () => (
    <div className="w-full">
      {/* Promo Banner */}
      <div className="bg-emerald-800 text-white py-2 px-3 flex items-center justify-between text-xs">
        <ChevronLeft className="w-4 h-4 cursor-pointer" />
        <div className="flex items-center gap-2">
          <span>Winter Sale: UP TO 40% OFF</span>
          <button className="underline font-medium">shop now</button>
          <button className="underline">see details</button>
        </div>
        <ChevronRight className="w-4 h-4 cursor-pointer" />
      </div>

      {/* Main Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div className="text-xl font-light tracking-wide flex-1">
              <span className="text-red-600">Sakigai</span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-600 cursor-pointer" />
              <div className="relative cursor-pointer">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
              </div>
              <Menu className="w-6 h-6 text-gray-700 cursor-pointer" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Sakigai Furniture - Responsive Headers</h1>
          
          {/* View Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveView('large')}
              className={`px-4 py-2 rounded-md ${activeView === 'large' ? 'bg-emerald-800 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Desktop
            </button>
            <button
              onClick={() => setActiveView('tablet')}
              className={`px-4 py-2 rounded-md ${activeView === 'tablet' ? 'bg-emerald-800 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Tablet
            </button>
            <button
              onClick={() => setActiveView('mobile')}
              className={`px-4 py-2 rounded-md ${activeView === 'mobile' ? 'bg-emerald-800 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Header Display */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeView === 'large' && <LargeHeader />}
          {activeView === 'tablet' && <TabletHeader />}
          {activeView === 'mobile' && <MobileHeader />}
        </div>

        {/* Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Features:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Responsive design adapting to different screen sizes</li>
            <li>• Promotional banner with navigation arrows</li>
            <li>• Search functionality across all breakpoints</li>
            <li>• Shopping cart with item count badge</li>
            <li>• Full navigation menu for desktop, hamburger for mobile</li>
            <li>• Wishlist/favorites icon</li>
            <li>• User account sign in/sign up</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SakigaiHeaders;