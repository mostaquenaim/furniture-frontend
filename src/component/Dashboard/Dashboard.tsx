"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  User, 
  Settings, 
  Package, 
  Star, 
  Bell, 
  Gift, 
  Clock, 
  TrendingUp,
  MessageSquare,
  Shield,
  LogOut,
  ChevronRight,
  DollarSign,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Truck,
  Home,
  ShoppingCart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  bgColor: string;
  badge?: number | string;
  isNew?: boolean;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivity {
  id: number;
  type: 'order' | 'review' | 'wishlist' | 'address' | 'payment';
  title: string;
  description: string;
  time: string;
  status?: 'completed' | 'pending' | 'processing';
}

const DashboardComp = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    loyaltyPoints: 1250,
    memberSince: '2022',
    tier: 'Gold',
    nextTierPoints: 250,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  };

  // Dashboard cards for navigation
  const dashboardCards: DashboardCard[] = [
    {
      id: 'orders',
      title: 'My Orders',
      description: 'View, track, and manage all your orders',
      icon: <ShoppingBag className="w-6 h-6" />,
      href: '/customer/orders',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      badge: 3
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      description: 'Your saved items and favorite products',
      icon: <Heart className="w-6 h-6" />,
      href: '/customer/wishlist',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      badge: 12
    },
    {
      id: 'tracking',
      title: 'Track Orders',
      description: 'Real-time tracking for your deliveries',
      icon: <Package className="w-6 h-6" />,
      href: '/track-order',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      isNew: true
    },
    {
      id: 'addresses',
      title: 'Addresses',
      description: 'Manage your shipping and billing addresses',
      icon: <MapPin className="w-6 h-6" />,
      href: '/customer/addresses',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Your saved cards and payment options',
      icon: <CreditCard className="w-6 h-6" />,
      href: '/customer/payment',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      description: 'Reviews you\'ve written for products',
      icon: <Star className="w-6 h-6" />,
      href: '/customer/reviews',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alerts and updates about your account',
      icon: <Bell className="w-6 h-6" />,
      href: '/customer/notifications',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      badge: 5
    },
    {
      id: 'loyalty',
      title: 'Loyalty Program',
      description: 'Points, rewards, and exclusive benefits',
      icon: <Gift className="w-6 h-6" />,
      href: '/customer/loyalty',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'recent',
      title: 'Recently Viewed',
      description: 'Items you\'ve recently browsed',
      icon: <Clock className="w-6 h-6" />,
      href: '/customer/recent',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      description: 'Personalized picks just for you',
      icon: <TrendingUp className="w-6 h-6" />,
      href: '/customer/recommendations',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'support',
      title: 'Help & Support',
      description: 'Contact us or browse FAQs',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/help/help-center',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'settings',
      title: 'Account Settings',
      description: 'Manage your profile and preferences',
      icon: <Settings className="w-6 h-6" />,
      href: '/customer/settings',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100'
    }
  ];

  // Stats cards
  const statCards: StatCard[] = [
    {
      title: 'Total Orders',
      value: '24',
      change: '+12%',
      isPositive: true,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Total Spent',
      value: '$4,890',
      change: '+8%',
      isPositive: true,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Avg. Order Value',
      value: '$203',
      change: '-3%',
      isPositive: false,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-yellow-600'
    },
    {
      title: 'Items in Wishlist',
      value: '12',
      change: '+4',
      isPositive: true,
      icon: <Heart className="w-5 h-5" />,
      color: 'text-pink-600'
    }
  ];

  // Recent activity
  const recentActivity: RecentActivity[] = [
    {
      id: 1,
      type: 'order',
      title: 'Order Delivered',
      description: 'Teak Wood Lounge Chair • SAK-2024-00123',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'review',
      title: 'Review Submitted',
      description: '5 stars for Minimal Side Table',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'wishlist',
      title: 'Item Added',
      description: 'Modern Sofa Set added to wishlist',
      time: '2 days ago',
      status: 'pending'
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Shipped',
      description: 'Dining Table • On its way',
      time: '3 days ago',
      status: 'processing'
    },
    {
      id: 5,
      type: 'address',
      title: 'Address Updated',
      description: 'Primary shipping address changed',
      time: '4 days ago',
      status: 'completed'
    }
  ];

  // Active orders
  const activeOrders = [
    {
      id: 'SAK-2024-00122',
      items: ['Modern Sofa Set'],
      status: 'shipped',
      estimatedDelivery: 'Jan 18, 2024',
      total: 1299.99
    },
    {
      id: 'SAK-2024-00121',
      items: ['Dining Table', '4x Upholstered Chairs'],
      status: 'processing',
      estimatedDelivery: 'Jan 25, 2024',
      total: 1399.95
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const getStatusIcon = (type: RecentActivity['type']) => {
    switch(type) {
      case 'order': return <Package className="w-5 h-5" />;
      case 'review': return <Star className="w-5 h-5" />;
      case 'wishlist': return <Heart className="w-5 h-5" />;
      case 'address': return <MapPin className="w-5 h-5" />;
      case 'payment': return <CreditCard className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
                <p className="text-gray-300">{user.email}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="px-3 py-1 bg-yellow-500 text-black text-sm font-medium rounded-full">
                    {user.tier} Member
                  </div>
                  <span className="text-sm text-gray-300">
                    {user.loyaltyPoints} points • {user.nextTierPoints} to Platinum
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleNavigation('/shop')}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
              <div className={`flex items-center gap-2 mt-4 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span className="text-sm font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('navigation')}
            className={`px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === 'navigation'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Quick Navigation
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active Orders
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="mb-8">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Dashboard Cards Grid */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dashboardCards.slice(0, 6).map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleNavigation(card.href)}
                      className="bg-white rounded-xl shadow p-5 text-left hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg ${card.bgColor}`}>
                          <div className={card.color}>{card.icon}</div>
                        </div>
                        {card.badge && (
                          <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                            {card.badge}
                          </span>
                        )}
                        {card.isNew && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                        <span>View details</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="bg-white rounded-2xl shadow p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                        <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleNavigation('/customer/activity')}
                    className="w-full mt-6 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Navigation Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dashboardCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleNavigation(card.href)}
                    className="bg-white rounded-xl shadow p-6 text-left hover:shadow-lg transition-shadow hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.bgColor}`}>
                        <div className={card.color}>{card.icon}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {card.badge && (
                          <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                            {card.badge}
                          </span>
                        )}
                        {card.isNew && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <span>Go to {card.title.toLowerCase()}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl shadow p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <div className="flex items-center gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>All Activities</option>
                    <option>Orders Only</option>
                    <option>Reviews Only</option>
                    <option>Wishlist Only</option>
                  </select>
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                    Export Activity
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-6 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className={`p-3 rounded-xl ${getStatusColor(activity.status)}`}>
                      {getStatusIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{activity.description}</p>
                      {activity.status && (
                        <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      )}
                    </div>
                    <button className="p-2 text-gray-400 hover:text-black transition">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Orders</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activeOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'shipped' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="font-semibold">{order.estimatedDelivery}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleNavigation(`/track-order?order=${order.id}`)}
                        className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                      >
                        Track Order
                      </button>
                      <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleNavigation('/customer/orders')}
                className="w-full md:w-auto mt-8 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                View All Orders
              </button>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Need help with your account?</h3>
              <p className="text-gray-300">
                Our customer support team is available 7 days a week to assist you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-transparent text-white border border-white/30 font-medium rounded-lg hover:bg-white/10 transition">
                Browse FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;