"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminDrawer } from "@/context/AdminContext";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  HelpCircle,
  Settings,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/utils/mergeTailwind";

const iconButtonClass = cn(
  "p-2 rounded-lg text-gray-600 transition-colors duration-200",
  "hover:text-gray-900 hover:bg-gray-100",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
);

const AdminHeader = () => {
  const { isAdminOpen, toggleAdminDrawer, isMobile } = useAdminDrawer();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getPageTitle = (): string => {
    if (pathname?.includes("/admin/dashboard")) return "Dashboard";
    if (pathname?.includes("/admin/products")) return "Products";
    if (pathname?.includes("/admin/orders")) return "Orders";
    if (pathname?.includes("/admin/customers")) return "Customers";
    if (pathname?.includes("/admin/reports")) return "Reports";
    if (pathname?.includes("/admin/settings")) return "Settings";
    return "Overview";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleAdminDrawer}
              className={cn(iconButtonClass, "shrink-0")}
              aria-label={
                isAdminOpen
                  ? isMobile
                    ? "Close menu"
                    : "Collapse menu"
                  : isMobile
                    ? "Open menu"
                    : "Expand menu"
              }
              aria-expanded={isAdminOpen}
            >
              {isAdminOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeftOpen size={20} />
              )}
            </button>

            <div className="hidden md:block h-6 w-px bg-gray-200" />

            {/* Page Title - Desktop */}
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-900 leading-none">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder-gray-500"
              />
              <span className="text-xs text-gray-400 border-l border-gray-300 pl-2">
                ⌘K
              </span>
            </div>

            <button className={cn(iconButtonClass, "sm:hidden")} aria-label="Search">
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={iconButtonClass}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <button className={cn(iconButtonClass, "relative")} aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Help */}
            <button className={cn(iconButtonClass, "hidden sm:block")} aria-label="Help">
              <HelpCircle size={18} />
            </button>

            <div className="hidden lg:block h-6 w-px bg-gray-200 mx-1" />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={cn(
                  "flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg transition-colors duration-200 hover:bg-gray-100",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                )}
                aria-label="Open user menu"
                aria-expanded={showUserMenu}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SA</span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900">Ondorkotha Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <ChevronDown size={16} className="text-gray-500 hidden lg:block" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Ondorkotha Admin
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        admin@ondorkotha.com
                      </p>
                    </div>
                    
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="text-gray-500" />
                      Profile
                    </Link>
                    
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} className="text-gray-500" />
                      Settings
                    </Link>
                    
                    <Link
                      href="/admin/security"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Shield size={16} className="text-gray-500" />
                      Security
                    </Link>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => {
                        // Handle logout
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm flex-1 placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;