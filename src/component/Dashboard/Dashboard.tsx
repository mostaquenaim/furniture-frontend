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
  ShoppingCart,
  ArrowRight,
  Activity,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Type Definitions
interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: number | string;
  isNew?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

interface RecentActivity {
  id: number;
  type: 'order' | 'review' | 'wishlist' | 'address' | 'payment';
  title: string;
  description: string;
  time: string;
  status?: 'completed' | 'pending' | 'processing';
}

interface ActiveOrder {
  id: string;
  items: string[];
  status: 'shipped' | 'processing' | 'delivered';
  estimatedDelivery: string;
  total: number;
}

// User Data Interface
interface UserData {
  name: string;
  email: string;
  loyaltyPoints: number;
  memberSince: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
  avatar: string;
}

// Constants
const USER: UserData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  loyaltyPoints: 1250,
  memberSince: '2022',
  tier: 'Gold',
  nextTierPoints: 250,
  avatar: 'AJ'
};

const DashboardComp = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'navigation' | 'activity' | 'orders'>('overview');

  // Dashboard Cards Configuration
  const dashboardCards: DashboardCard[] = [
    {
      id: 'orders',
      title: 'My Orders',
      description: 'View, track, and manage all your orders',
      icon: <ShoppingBag className="w-5 h-5" />,
      href: '/customer/orders',
      badge: 3,
      priority: 'high'
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      description: 'Your saved items and favorite products',
      icon: <Heart className="w-5 h-5" />,
      href: '/customer/wishlist',
      badge: 12,
      priority: 'medium'
    },
    {
      id: 'tracking',
      title: 'Track Orders',
      description: 'Real-time tracking for your deliveries',
      icon: <Package className="w-5 h-5" />,
      href: '/track-order',
      isNew: true,
      priority: 'high'
    },
    {
      id: 'addresses',
      title: 'Addresses',
      description: 'Manage your shipping and billing addresses',
      icon: <MapPin className="w-5 h-5" />,
      href: '/customer/addresses',
      priority: 'medium'
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      description: 'Your saved cards and payment options',
      icon: <CreditCard className="w-5 h-5" />,
      href: '/customer/payment',
      priority: 'medium'
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      description: 'Reviews you\'ve written for products',
      icon: <Star className="w-5 h-5" />,
      href: '/customer/reviews',
      priority: 'low'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alerts and updates about your account',
      icon: <Bell className="w-5 h-5" />,
      href: '/customer/notifications',
      badge: 5,
      priority: 'medium'
    },
    {
      id: 'loyalty',
      title: 'Loyalty Program',
      description: 'Points, rewards, and exclusive benefits',
      icon: <Gift className="w-5 h-5" />,
      href: '/customer/loyalty',
      priority: 'low'
    },
    {
      id: 'recent',
      title: 'Recently Viewed',
      description: 'Items you\'ve recently browsed',
      icon: <Clock className="w-5 h-5" />,
      href: '/customer/recent',
      priority: 'low'
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      description: 'Personalized picks just for you',
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/customer/recommendations',
      priority: 'low'
    },
    {
      id: 'support',
      title: 'Help & Support',
      description: 'Contact us or browse FAQs',
      icon: <MessageSquare className="w-5 h-5" />,
      href: '/help/help-center',
      priority: 'medium'
    },
    {
      id: 'settings',
      title: 'Account Settings',
      description: 'Manage your profile and preferences',
      icon: <Settings className="w-5 h-5" />,
      href: '/customer/settings',
      priority: 'medium'
    }
  ];

  // Stat Cards Configuration
  const statCards: StatCard[] = [
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: '24',
      change: '+12%',
      isPositive: true,
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      id: 'total-spent',
      title: 'Total Spent',
      value: '৳4,890',
      change: '+8%',
      isPositive: true,
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 'avg-order',
      title: 'Avg. Order Value',
      value: '৳203',
      change: '-3%',
      isPositive: false,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'wishlist-items',
      title: 'Wishlist Items',
      value: '12',
      change: '+4',
      isPositive: true,
      icon: <Heart className="w-5 h-5" />
    }
  ];

  // Recent Activity Configuration
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

  // Active Orders Configuration
  const activeOrders: ActiveOrder[] = [
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

  // Helper Functions
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const getStatusIcon = (type: RecentActivity['type']) => {
    const iconProps = { className: "w-4 h-4" };
    switch(type) {
      case 'order': return <Package {...iconProps} />;
      case 'review': return <Star {...iconProps} />;
      case 'wishlist': return <Heart {...iconProps} />;
      case 'address': return <MapPin {...iconProps} />;
      case 'payment': return <CreditCard {...iconProps} />;
      default: return <CheckCircle {...iconProps} />;
    }
  };

  const getStatusColor = (status?: RecentActivity['status']) => {
    switch(status) {
      case 'completed': return 'bg-gray-50 text-gray-700';
      case 'processing': return 'bg-gray-50 text-gray-700';
      case 'pending': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getTierColor = (tier: UserData['tier']) => {
    switch(tier) {
      case 'Bronze': return 'bg-amber-50 text-amber-700';
      case 'Silver': return 'bg-gray-50 text-gray-700';
      case 'Gold': return 'bg-amber-50 text-amber-700';
      case 'Platinum': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getOrderStatusColor = (status: ActiveOrder['status']) => {
    switch(status) {
      case 'shipped': return 'bg-gray-50 text-gray-700';
      case 'processing': return 'bg-gray-50 text-gray-700';
      case 'delivered': return 'bg-gray-50 text-gray-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  // Tab Content Components
  const OverviewTab = () => (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dashboardCards
              .filter(card => card.priority === 'high')
              ?.map((card) => (
                <DashboardCardItem key={card.id} card={card} />
              ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <button 
              onClick={() => handleNavigation('/customer/activity')}
              className="text-xs text-gray-500 hover:text-gray-700 transition"
            >
              View all
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="divide-y divide-gray-200">
              {recentActivity.slice(0, 3)?.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NavigationTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">All Navigation Options</h2>
        <div className="text-sm text-gray-500">
          {dashboardCards.length} options available
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dashboardCards?.map((card) => (
          <DashboardCardItem key={card.id} card={card} detailed />
        ))}
      </div>
    </div>
  );

  const ActivityTab = () => (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <div className="flex items-center gap-3">
            <select className="w-full sm:w-auto text-sm border border-gray-300 rounded-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
              <option>All Activities</option>
              <option>Orders Only</option>
              <option>Reviews Only</option>
              <option>Wishlist Only</option>
            </select>
            <button className="text-sm px-3 py-1.5 border border-gray-300 rounded-sm hover:bg-gray-50 transition">
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {recentActivity?.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} expanded />
        ))}
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Active Orders</h2>
        <button 
          onClick={() => handleNavigation('/customer/orders')}
          className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
        >
          View all orders
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {activeOrders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );

  // Reusable Components
  const DashboardCardItem = ({ card, detailed = false }: { card: DashboardCard; detailed?: boolean }) => (
    <button
      onClick={() => handleNavigation(card.href)}
      className={`bg-white border border-gray-200 rounded-sm text-left hover:border-gray-300 transition ${detailed ? 'p-4' : 'p-3'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-sm">
            {card.icon}
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-900">{card.title}</h3>
            {detailed && (
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {card.badge && (
            <span className="px-1.5 py-0.5 bg-gray-900 text-white text-xs rounded-sm">
              {card.badge}
            </span>
          )}
          {card.isNew && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-sm">
              New
            </span>
          )}
        </div>
      </div>
      {!detailed && (
        <>
          <p className="text-xs text-gray-500 mb-3">{card.description}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>View details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </>
      )}
    </button>
  );

  const ActivityItem = ({ activity, expanded = false }: { activity: RecentActivity; expanded?: boolean }) => (
    <div className={`p-4 hover:bg-gray-50 transition ${expanded ? '' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-sm ${getStatusColor(activity.status)}`}>
          {getStatusIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {activity.status && (
                <span className={`px-2 py-1 text-xs rounded-sm ${getStatusColor(activity.status)}`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              )}
              <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OrderCard = ({ order }: { order: ActiveOrder }) => (
    <div className="bg-white border border-gray-200 rounded-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{order.id}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-sm ${getOrderStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      
      <div className="mb-4">
        {order.items?.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Estimated Delivery</p>
            <p className="text-sm font-medium">{order.estimatedDelivery}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-base font-medium">${order.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleNavigation(`/track-order?order=${order.id}`)}
            className="flex-1 px-3 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition"
          >
            Track Order
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition">
            Details
          </button>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ stat }: { stat: StatCard }) => (
    <div className="bg-white border border-gray-200 rounded-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500">{stat.title}</p>
        <div className="p-2 bg-gray-50 rounded-sm">
          {stat.icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-medium text-gray-900">{stat.value}</p>
        <div className={`flex items-center gap-1 text-xs ${stat.isPositive ? 'text-gray-600' : 'text-gray-600'}`}>
          {stat.isPositive ? 
            <TrendingUp className="w-3.5 h-3.5" /> : 
            <TrendingDown className="w-3.5 h-3.5" />
          }
          <span>{stat.change}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center">
                  <span className="text-base font-medium text-gray-700">{USER.avatar}</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-900 mb-1">Welcome back, {USER.name}</h1>
                <p className="text-sm text-gray-500">{USER.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-sm ${getTierColor(USER.tier)}`}>
                    {USER.tier} Member
                  </span>
                  <span className="text-xs text-gray-500">
                    {USER.loyaltyPoints} points • {USER.nextTierPoints} to Platinum
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleNavigation('/shop')}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards?.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {(['overview', 'navigation', 'activity', 'orders'] as const)?.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition whitespace-nowrap border-b-2 ${
                activeTab === tab
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'navigation' && <NavigationTab />}
          {activeTab === 'activity' && <ActivityTab />}
          {activeTab === 'orders' && <OrdersTab />}
        </div>

        {/* Support Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">Need help with your account?</h3>
              <p className="text-sm text-gray-600">
                Our customer support team is available to assist you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => handleNavigation('/help/help-center')}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition"
              >
                Contact Support
              </button>
              <button 
                onClick={() => handleNavigation('/help/help-center')}
                className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-white transition"
              >
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