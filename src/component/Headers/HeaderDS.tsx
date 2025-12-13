'use client';

import { useState } from 'react';
import { Search, Menu, User, ChevronDown, ShoppingBag, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navItems = [
    'New!', 'Gifts', 'Holiday', 'Furniture', 'Décor & Pillows', 
    'Lighting', 'Rugs', 'Art & Mirrors', 'Kitchen & Dining', 
    'Candles', 'Bedding', 'Bath', 'Outdoor', 'Sale'
  ];

  const promoBanner = {
    title: "Holiday Home Event: UP TO 50% OFF",
    cta: "shop now",
    details: "see details"
  };

  return (
    <header className="font-sans">
      {/* Promo Banner */}
      <div className="bg-amber-50 text-gray-900 py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <h2 className="text-lg sm:text-xl font-serif font-semibold mb-2 sm:mb-0">
            {promoBanner.title}
          </h2>
          <div className="flex items-center gap-4">
            <button className="underline font-medium hover:text-amber-700 transition-colors">
              {promoBanner.cta}
            </button>
            <button className="underline font-medium hover:text-amber-700 transition-colors">
              {promoBanner.details}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Top Row - Logo, Search, User Actions */}
          <div className="flex items-center justify-between mb-4">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-wider">
              SAKIGAI
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.slice(0, 7).map((item) => (
                <a 
                  key={item}
                  href="#"
                  className="text-gray-700 hover:text-amber-700 transition-colors text-sm font-medium"
                >
                  {item}
                </a>
              ))}
              <button className="flex items-center text-gray-700 hover:text-amber-700 transition-colors">
                More <ChevronDown size={16} className="ml-1" />
              </button>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="bg-transparent border-none outline-none px-3 text-sm w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* User Actions */}
              <div className="flex items-center gap-4">
                <button className="text-gray-700 hover:text-amber-700 transition-colors">
                  <User size={20} />
                </button>
                <button className="text-gray-700 hover:text-amber-700 transition-colors">
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mb-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="bg-transparent border-none outline-none px-3 text-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Full Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
            {navItems.map((item) => (
              <a 
                key={item}
                href="#"
                className={`text-gray-700 hover:text-amber-700 transition-colors text-sm font-medium ${
                  item === 'Furniture' ? 'font-semibold text-amber-700' : ''
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-white">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-serif font-bold">Menu</h2>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="block py-3 text-gray-700 hover:text-amber-700 border-b border-gray-100 text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <button className="flex items-center gap-2 text-gray-700">
                    <User size={20} />
                    {isLoggedIn ? 'Account' : 'Sign In / Sign Up'}
                  </button>
                  <button className="flex items-center gap-2 text-gray-700">
                    <ShoppingBag size={20} />
                    Shopping Bag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner for smaller screens */}
      <div className="lg:hidden bg-amber-50 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium">UP TO 50% OFF</span>
          <div className="flex gap-4">
            <button className="text-sm underline">shop now</button>
            <button className="text-sm underline">see details</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;