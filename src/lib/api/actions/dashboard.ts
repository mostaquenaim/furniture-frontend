// lib/api/actions/dashboard.ts
"use server";

import { cookies } from "next/headers";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  activeUsers: number;
  inventoryAlerts: number;
}

export interface SalesTrendPoint {
  date: string; // "MM-DD"
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "confirmed";
  payment: string;
}

export interface TopKeyword {
  keyword: string;
  searches: number;
  conversionRate: number;
  productsFound: number;
}

export interface TopViewedProduct {
  productId: number;
  title: string;
  category: string;
  views: number;
}

export interface DashboardData {
  stats: DashboardStats;
  salesTrend: SalesTrendPoint[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  topViewedProducts: TopViewedProduct[];
}

// ── Server Action ─────────────────────────────────────────────────────────────

export async function getDashboardData(dateRange: {
  start: string;
  end: string;
}): Promise<DashboardData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const params = new URLSearchParams({
    start: dateRange.start,
    end: dateRange.end,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // Don't cache — dashboard should always be fresh
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Dashboard fetch failed: ${res.status}`);
  }

  return res.json();
}
