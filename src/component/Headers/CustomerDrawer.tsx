"use client";

import { useState } from "react";
import { 
  Menu, 
  X, 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  ShoppingBag,
  Clock,
  Gift,
  MessageCircle,
  ChevronRight,
  Home
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  href: string;
}

const navigationItems: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/dashboard" },
  { id: "orders", label: "My Orders", icon: <Package className="w-5 h-5" />, badge: 2, href: "/dashboard/orders" },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" />, badge: 12, href: "/dashboard/wishlist" },
  { id: "track", label: "Track Order", icon: <Clock className="w-5 h-5" />, href: "/dashboard/track" },
  { id: "addresses", label: "Addresses", icon: <MapPin className="w-5 h-5" />, href: "/dashboard/addresses" },
  { id: "payment", label: "Payment Methods", icon: <CreditCard className="w-5 h-5" />, href: "/dashboard/payment" },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, badge: 5, href: "/dashboard/notifications" },
  { id: "rewards", label: "Rewards & Credits", icon: <Gift className="w-5 h-5" />, href: "/dashboard/rewards" },
  { id: "support", label: "Help & Support", icon: <MessageCircle className="w-5 h-5" />, href: "/dashboard/support" },
];

const CustomerDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("overview");
  const [userInfo] = useState({
    name: "Sarah Ahmed",
    email: "sarah.ahmed@email.com",
    avatar: "SA",
    memberSince: "Jan 2024"
  });

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            >
              {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <span className="font-serif text-xl font-semibold hidden sm:block">My Account</span>
            </div>

            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{userInfo.name}</p>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
              </div>
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userInfo.avatar}
              </div>
            </div>

            {/* Mobile User Avatar */}
            <div className="md:hidden w-9 h-9 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {userInfo.avatar}
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Drawer - Desktop */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-6">
            {/* User Profile Section */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {userInfo.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{userInfo.name}</h2>
                  <p className="text-sm text-gray-500">Member since {userInfo.memberSince}</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navigationItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition group ${
                    activeItem === item.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={activeItem === item.id ? "text-white" : "text-gray-600 group-hover:text-gray-900"}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      activeItem === item.id
                        ? "bg-white text-black"
                        : "bg-red-500 text-white"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-sm">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition text-red-600">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Overlay */}
        {isDrawerOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={`lg:hidden fixed top-0 left-0 w-80 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <span className="font-serif text-xl font-semibold">My Account</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile User Profile */}
            <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {userInfo.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{userInfo.name}</h2>
                  <p className="text-sm text-gray-600">{userInfo.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Member since {userInfo.memberSince}</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-1">
              {navigationItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                    activeItem === item.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={activeItem === item.id ? "text-white" : "text-gray-600"}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        activeItem === item.id
                          ? "bg-white text-black"
                          : "bg-red-500 text-white"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </div>
                </button>
              ))}
            </nav>

            {/* Mobile Bottom Actions */}
            <div className="p-4 pt-6 border-t border-gray-200 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-sm">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition text-red-600">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-serif font-semibold mb-2">
                {navigationItems.find(item => item.id === activeItem)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600">Manage your account and view your activity</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold">12</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-amber-600" />
                  <span className="text-2xl font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">In Transit</p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-8 h-8 text-red-600" />
                  <span className="text-2xl font-bold">12</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Wishlist Items</p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Gift className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold">৳45</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Reward Credits</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Order Delivered</p>
                    <p className="text-sm text-gray-600">Your order #SAK-10234 has been delivered</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Item Wishlisted</p>
                    <p className="text-sm text-gray-600">Added &quot;Modern Oak Dining Table&quot; to wishlist</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Rewards Earned</p>
                    <p className="text-sm text-gray-600">You earned ৳15 in reward credits</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;