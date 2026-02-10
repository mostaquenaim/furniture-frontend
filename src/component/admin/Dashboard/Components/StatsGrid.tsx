// components/dashboard/StatsGrid.tsx
import React from "react";

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  activeUsers: number;
  inventoryAlerts: number;
}

interface StatsGridProps {
  stats: StatsData;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statsConfig = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "+12.5%",
      trend: "positive",
      description: "From previous period",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "+8.2%",
      trend: "positive",
      description: "Orders placed",
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(stats.avgOrderValue),
      change: "+4.3%",
      trend: "positive",
      description: "Average per order",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      change: "+2.1%",
      trend: "positive",
      description: "Visitor to customer",
    },
    {
      label: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: "+15.7%",
      trend: "positive",
      description: "Last 30 days",
    },
    {
      label: "Low Stock Alerts",
      value: stats.inventoryAlerts,
      change: "3 items",
      trend: "warning",
      description: "Requires attention",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsConfig.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
            {stat.trend === "positive" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {stat.change}
              </span>
            )}
            {stat.trend === "warning" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {stat.change}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
