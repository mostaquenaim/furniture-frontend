// lib/actions/dashboard.ts
"use server";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    conversionRate: number;
    activeUsers: number;
    inventoryAlerts: number;
  };
  salesTrend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    category: string;
    sales: number;
    revenue: number;
    stock: number;
    status: "in_stock" | "low_stock" | "out_of_stock";
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    date: string;
    amount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    payment: "cod" | "bkash" | "card";
  }>;
  userRetention: Array<{
    week: string;
    newUsers: number;
    returningUsers: number;
    retentionRate: number;
  }>;
  topKeywords: Array<{
    keyword: string;
    searches: number;
    conversionRate: number;
    productsFound: number;
  }>;
}

export async function getDashboardData(dateRange: {
  start: string;
  end: string;
}): Promise<DashboardData> {
  // In a real application, you would fetch this data from your database
  // This is mock data for demonstration

  const mockData: DashboardData = {
    stats: {
      totalRevenue: 1250000,
      totalOrders: 342,
      avgOrderValue: 3655,
      conversionRate: 3.2,
      activeUsers: 1245,
      inventoryAlerts: 7,
    },
    salesTrend: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split("T")[0].slice(5),
        revenue: Math.floor(Math.random() * 80000) + 20000,
        orders: Math.floor(Math.random() * 40) + 10,
      };
    }),
    topProducts: [
      {
        id: "PRD001",
        name: "Modern Leather Sofa",
        category: "Sofa",
        sales: 45,
        revenue: 675000,
        stock: 12,
        status: "in_stock",
      },
      {
        id: "PRD002",
        name: "King Size Bed",
        category: "Bed",
        sales: 38,
        revenue: 570000,
        stock: 5,
        status: "low_stock",
      },
      {
        id: "PRD003",
        name: "Dining Table Set",
        category: "Dining",
        sales: 32,
        revenue: 480000,
        stock: 8,
        status: "in_stock",
      },
      {
        id: "PRD004",
        name: "Office Chair",
        category: "Chair",
        sales: 28,
        revenue: 224000,
        stock: 0,
        status: "out_of_stock",
      },
      {
        id: "PRD005",
        name: "Bookshelf",
        category: "Storage",
        sales: 25,
        revenue: 187500,
        stock: 15,
        status: "in_stock",
      },
    ],
    recentOrders: [
      {
        id: "ORD-2024-001",
        customer: "John Smith",
        date: "2024-01-15",
        amount: 45000,
        status: "delivered",
        payment: "cod",
      },
      {
        id: "ORD-2024-002",
        customer: "Sarah Johnson",
        date: "2024-01-14",
        amount: 28500,
        status: "shipped",
        payment: "bkash",
      },
      {
        id: "ORD-2024-003",
        customer: "Michael Brown",
        date: "2024-01-14",
        amount: 62500,
        status: "processing",
        payment: "card",
      },
      {
        id: "ORD-2024-004",
        customer: "Emma Wilson",
        date: "2024-01-13",
        amount: 32000,
        status: "pending",
        payment: "cod",
      },
      {
        id: "ORD-2024-005",
        customer: "David Lee",
        date: "2024-01-12",
        amount: 18500,
        status: "delivered",
        payment: "bkash",
      },
    ],
    userRetention: Array.from({ length: 12 }, (_, i) => ({
      week: `W${i + 1}`,
      newUsers: Math.floor(Math.random() * 300) + 100,
      returningUsers: Math.floor(Math.random() * 200) + 50,
      retentionRate: parseFloat((Math.random() * 20 + 60).toFixed(1)),
    })),
    topKeywords: [
      {
        keyword: "leather sofa",
        searches: 1245,
        conversionRate: 4.2,
        productsFound: 23,
      },
      {
        keyword: "dining table",
        searches: 987,
        conversionRate: 3.8,
        productsFound: 45,
      },
      {
        keyword: "office chair",
        searches: 856,
        conversionRate: 5.1,
        productsFound: 32,
      },
      {
        keyword: "bed frame",
        searches: 743,
        conversionRate: 2.9,
        productsFound: 28,
      },
      {
        keyword: "bookshelf",
        searches: 621,
        conversionRate: 4.7,
        productsFound: 19,
      },
    ],
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockData;
}
