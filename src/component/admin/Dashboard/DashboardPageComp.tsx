"use client";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/api/actions/dashboard";
import DateRangePicker from "./Components/DateRangePicker";
import StatsGrid from "./Components/StatsGrid";
import SalesChart from "./Components/SalesChart";
import UserRetentionChart from "./Components/UserRetentionChart";
import TopProductsTable from "./Components/TopProductsTable";
import RecentOrders from "./Components/RecentOrders";
import SearchAnalytics from "./Components/SearchAnalytics";

export default function DashboardPageComp() {
  // 1. Initialize State
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  // 2. Fetch Data on Mount and when dateRange changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getDashboardData(dateRange);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // 3. Handle loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Overview of your e-commerce performance
              </p>
            </div>
            <DateRangePicker
              initialStart={dateRange.start}
              initialEnd={dateRange.end}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={data.stats} />

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Sales Trend
                </h2>
                <p className="text-sm text-gray-600">Revenue over time</p>
              </div>
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
                <option>Custom</option>
              </select>
            </div>
            <SalesChart data={data.salesTrend} />
          </div>

          {/* User Retention */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                User Retention
              </h2>
              <p className="text-sm text-gray-600">
                Customer engagement over time
              </p>
            </div>
            <UserRetentionChart data={data.userRetention} />
          </div>
        </div>

        {/* Tables Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Top Selling Products
              </h2>
            </div>
            <TopProductsTable products={data.topProducts} />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Orders
              </h2>
            </div>
            <RecentOrders orders={data.recentOrders} />
          </div>
        </div>

        {/* Search Analytics */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Search Analytics
              </h2>
              <p className="text-sm text-gray-600">Top searched keywords</p>
            </div>
            <SearchAnalytics keywords={data.topKeywords} />
          </div>
        </div>
      </div>
    </div>
  );
}
