"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  AiOutlineMenu,
  AiOutlineDashboard,
  AiOutlineHome,
  AiOutlineShopping,
} from "react-icons/ai";
import { FiPackage, FiLayers, FiUsers, FiSettings } from "react-icons/fi";
import { TbCategory, TbCategory2 } from "react-icons/tb";
import { MdInventory, MdOutlineDiscount } from "react-icons/md";
import { BsGraphUp, BsCashCoin } from "react-icons/bs";
import {
  RiGalleryLine,
  RiArrowDropRightLine,
  RiArrowDropDownLine,
} from "react-icons/ri";
import { useAdminDrawer } from "@/context/AdminContext";

interface NavSection {
  name: string;
  icon: React.ReactNode;
  tasks: {
    href: string;
    label: string;
    badge?: number;
  }[];
}

const AdminDrawerTS = () => {
  const { isAdminOpen, toggleAdminDrawer } = useAdminDrawer();
  const pathname = usePathname();

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    Dashboard: true,
    Products: true,
    Categories: true,
    Series: true,
    Orders: true,
    Inventory: true,
  });

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const navSections: NavSection[] = [
    {
      name: "Dashboard",
      icon: <AiOutlineDashboard className="text-xl" />,
      tasks: [
        { href: "/admin/dashboard", label: "Overview" },
        { href: "/admin/analytics", label: "Analytics" },
        { href: "/admin/statistics", label: "Statistics" },
      ],
    },
    {
      name: "Products",
      icon: <FiPackage className="text-xl" />,
      tasks: [
        { href: "/admin/products", label: "All Products" },
        { href: "/admin/product/add", label: "Add Product" },
        { href: "/admin/product/trash", label: "Trash Products" },
        { href: "/admin/product/reviews", label: "Product Reviews" },
      ],
    },
    {
      name: "Series",
      icon: <FiLayers className="text-xl" />,
      tasks: [
        { href: "/admin/series", label: "All Series" },
        { href: "/admin/series/add", label: "Add Series" },
        { href: "/admin/series/arrange", label: "Arrange Series" },
      ],
    },
    {
      name: "Categories",
      icon: <TbCategory className="text-xl" />,
      tasks: [
        { href: "/admin/categories", label: "All Categories" },
        { href: "/admin/category/add", label: "Add Category" },
        { href: "/admin/category/arrange", label: "Arrange Categories" },
      ],
    },
    {
      name: "Subcategories",
      icon: <TbCategory2 className="text-xl" />,
      tasks: [
        { href: "/admin/subcategories", label: "All Subcategories" },
        { href: "/admin/subcategory/add", label: "Add Subcategory" },
        {
          href: "/admin/subcategory/arrange",
          label: "Arrange Subcategories",
        },
      ],
    },
    {
      name: "Orders",
      icon: <AiOutlineShopping className="text-xl" />,
      tasks: [
        { href: "/admin/orders", label: "All Orders" },
        { href: "/admin/order/pending", label: "Pending Orders" },
        { href: "/admin/order/completed", label: "Completed Orders" },
        { href: "/admin/order/returns", label: "Return Requests" },
      ],
    },
    {
      name: "Inventory",
      icon: <MdInventory className="text-xl" />,
      tasks: [
        { href: "/admin/inventories", label: "Stock Overview" },
        {
          href: "/admin/inventory/low-stock",
          label: "Low Stock Alerts",
        },
        { href: "/admin/inventory/adjustments", label: "Stock Adjustments" },
        { href: "/admin/inventory/warehouse", label: "Warehouse" },
      ],
    },
    {
      name: "Customers",
      icon: <FiUsers className="text-xl" />,
      tasks: [
        { href: "/admin/customers", label: "All Customers" },
        { href: "/admin/customer/groups", label: "Customer Groups" },
        { href: "/admin/customer/reviews", label: "Customer Reviews" },
      ],
    },
    {
      name: "Promotions",
      icon: <MdOutlineDiscount className="text-xl" />,
      tasks: [
        { href: "/admin/promotions/coupons", label: "Coupons" },
        { href: "/admin/promotions/discounts", label: "Discounts" },
        { href: "/admin/promotions/offers", label: "Special Offers" },
      ],
    },
    {
      name: "Content",
      icon: <RiGalleryLine className="text-xl" />,
      tasks: [
        { href: "/admin/content/banners", label: "Banners & Sliders" },
        { href: "/admin/content/pages", label: "Pages" },
        { href: "/admin/content/blogs", label: "Blog Posts" },
      ],
    },
    {
      name: "Reports",
      icon: <BsGraphUp className="text-xl" />,
      tasks: [
        { href: "/admin/reports/sales", label: "Sales Reports" },
        { href: "/admin/reports/inventory", label: "Inventory Reports" },
        { href: "/admin/reports/customers", label: "Customer Reports" },
      ],
    },
    {
      name: "Finances",
      icon: <BsCashCoin className="text-xl" />,
      tasks: [
        { href: "/admin/finances/transactions", label: "Transactions" },
        { href: "/admin/finances/payments", label: "Payment Methods" },
        { href: "/admin/finances/taxes", label: "Tax Settings" },
      ],
    },
    {
      name: "Settings",
      icon: <FiSettings className="text-xl" />,
      tasks: [
        { href: "/admin/settings/general", label: "General Settings" },
        { href: "/admin/settings/shipping", label: "Shipping" },
        { href: "/admin/settings/email", label: "Email Templates" },
        { href: "/admin/settings/maintenance", label: "Maintenance" },
      ],
    },
  ];

  return (
    <div
      className={`fixed flex z-40 left-0 top-0
        ${isAdminOpen ? "w-64" : "w-20"}
       transition-all duration-300 ease-in-out h-screen`}
    >
      <div
        className={`flex flex-col bg-gray-800 text-white h-full 
          ${isAdminOpen ? "w-64" : "w-0 md:w-20"}
         transition-all duration-300 ease-in-out shadow-xl`}
      >
        {/* header  */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isAdminOpen && (
            <Link
              href="/admin"
              className="text-xl font-bold text-white hover:text-blue-300 transition duration-300 flex items-center"
            >
              <AiOutlineDashboard className="mr-2" />
              Admin Panel
            </Link>
          )}
          <button
            onClick={toggleAdminDrawer}
            className={`p-2 rounded-md ${
              isAdminOpen && "hover:bg-gray-700"
              // : "hover:bg-white border-transparent hover:border-black border"
            } transition-colors duration-200`}
            aria-label={isAdminOpen ? "Collapse menu" : "Expand menu"}
          >
            <AiOutlineMenu
              className={`${
                isAdminOpen ? "text-white" : "text-black md:text-white"
              } text-xl`}
            />
          </button>
        </div>

        {/* navigation  */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navSections.map((section) => {
              const isExpanded = expandedSections[section.name];
              const hasActiveChild = section.tasks.some((task) =>
                pathname.startsWith(task.href)
              );

              return (
                <li key={section.name} className="mb-2">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg
                      transition-all duration-200
                      ${hasActiveChild ? "bg-gray-700" : "hover:bg-gray-700"}
                      ${isAdminOpen ? "justify-between" : "justify-center"}
                    `}
                  >
                    <div className="flex items-center">
                      <span
                        className={
                          hasActiveChild ? "text-blue-400" : "text-gray-300"
                        }
                      >
                        {section.icon}
                      </span>
                      {isAdminOpen && (
                        <span className="ml-3 font-medium">{section.name}</span>
                      )}
                    </div>

                    {isAdminOpen && (
                      <span className="text-gray-400">
                        {isExpanded ? (
                          <RiArrowDropDownLine />
                        ) : (
                          <RiArrowDropRightLine />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Section Tasks */}
                  {isAdminOpen && isExpanded && (
                    <ul className="ml-10 mt-1 space-y-1">
                      {section.tasks.map((task) => {
                        const isActive =
                          pathname === task.href ||
                          pathname.startsWith(task.href);
                        return (
                          <li key={task.href}>
                            <Link
                              href={task.href}
                              className={`
                                flex items-center justify-between px-3 py-2 rounded
                                text-sm transition-colors
                                ${
                                  isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }
                              `}
                            >
                              <span>{task.label}</span>
                              {task.badge && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
                                  {task.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          {isAdminOpen ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">SA</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sakigai Admin</p>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
              </div>
              <Link
                href="/"
                className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <AiOutlineHome />
                <span>Back to Store</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">SA</span>
              </div>
              <Link
                href="/"
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <AiOutlineHome />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDrawerTS;
