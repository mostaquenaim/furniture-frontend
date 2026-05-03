/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/actions/dashboard.ts
"use server";

import axios from "axios";
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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const params = new URLSearchParams({
    start: dateRange.start,
    end: dateRange.end,
  });

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
      {
        params: {
          start: dateRange.start,
          end: dateRange.end,
        },
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    return res.data;
  } catch (error: any) {
    throw new Error(
      `Dashboard fetch failed: ${error?.response?.status || error.message}`,
    );
  }
}
