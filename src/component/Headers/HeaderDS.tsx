/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useState } from "react";
import {
  Search,
  Menu,
  User,
  ChevronDown,
  ShoppingBag,
  X,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import PromoBannerContainer from "./PromoBannerContainer";
import type {
  MobileMenuItem,
  MobileMenuContent,
  MegaMenuProps,
  MobileMenuDrawerProps,
} from "@/types/menu";
import AuthModal from "../Auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import LoadingDots from "../Loading/LoadingDS";
import { useRouter } from "next/navigation";

// Structure: Category Name -> Array of Menu Items
const mobileMenuContent: MobileMenuContent = {
  "Décor & Pillows": [
    { type: "link", label: "Candle Holders & Lanterns" },
    { type: "link", label: "Books" },
    { type: "link", label: "Botanicals" },
    { type: "link", label: "Paint" },
    {
      type: "collapsible",
      label: "Now Trending",
      links: ["Vases", "Picture Frames", "Home Scents"],
      expanded: false,
    },
    {
      type: "collapsible",
      label: "Seasonal Décor",
      links: [
        "Pillows & Throws",
        "Holiday Tree Trimming Shop",
        "Holiday Mantel Décor",
      ],
      expanded: true,
    },
    { type: "link", label: "Pillows & Throws" },
    { type: "banner", label: "GIFTS FOR THE DAYDREAMER" },
  ],
};

// --- DESKTOP MEGA MENU DATA (for reference/completeness, unchanged) ---
const megaMenuData = {
  Candles: [
    {
      title: "Shop by Category",
      links: [
        "Shop All Sale",
        "Limited-Time Sale",
        "New Sale Styles",
        "Furniture",
        "Art & Mirrors",
        "Kitchen & Dining",
      ],
    },
    {
      title: "Shop by Price",
      links: ["Under ৳25", "Under ৳50", "Under ৳75", "Under ৳100"],
    },
  ],
  "Art & Mirrors": [
    {
      title: "Shop by Category",
      links: [
        "Shop All Art & Mirrors",
        "Top-Rated Art & Mirrors",
        "New Art & Mirrors",
        "Back-In-Stock Bestsellers",
        "Wall Art",
      ],
    },
    {
      title: "Shop Art by Subject",
      links: [
        "Flowers, Plants, & Landscapes",
        "Animals & Portraits",
        "Food & Drink",
        "Text, Objects, & Abstract Art",
        "Architecture & Travel",
        "Black & White Photography",
      ],
    },
    {
      title: "Shop Mirrors by Shape",
      links: [
        "Rectangular Wall Mirrors",
        "Round Wall Mirrors",
        "Floor Mirrors",
        "Mental Mirrors",
        "Petite Mirrors",
      ],
    },
    {
      title: "Now Trending",
      links: [
        "Gallery Wall Decor",
        "Peel & Stick Wallpaper",
        "Dopamine Decor",
        "Sakigai x YoungArts",
        "GREAT FOR GIFTING: Wall Charms",
      ],
    },
  ],
};

// Desktop MegaMenu Component (Unchanged)
const MegaMenu: React.FC<MegaMenuProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-40 bg-white border-t border-gray-200 shadow-lg pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 flex gap-12">
        {data.map((column, colIndex) => (
          <div
            key={colIndex}
            className={`
      w-1/4 px-8 
      ${colIndex !== data.length - 1 ? "border-r border-gray-200" : ""}
    `}
          >
            {/* Added border-b and extra pb-3 to create the separator line */}
            <h3 className="font-semibold text-gray-900 mb-3 text-sm border-b border-gray-200 pb-3">
              {column.title}
            </h3>
            <ul className="space-y-2 pt-3">
              {" "}
              {/* Added pt-3 for spacing after the line */}
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-amber-700 transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Placeholder for the side banner/image */}
        <div className="w-1/4">
          <div className="bg-teal-700 p-6 flex flex-col items-center justify-center h-full text-white text-center rounded">
            <p className="text-xl font-bold mb-2">EXTRA</p>
            <p className="text-4xl font-extrabold mb-4">50% OFF</p>
            <p className="text-xl font-bold">SALE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MOBILE MENU DRILLDOWN COMPONENTS ---
const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  navItems,
  mobileMenuContent,
  isMenuOpen, // <-- Use this state to control the entire drawer's entry/exit
  setIsMenuOpen,
  isModalOpen,
  setIsModalOpen,
  token,
  logoutIcon,
  loading,
  handleAuthModal,
  // handleAuthModal
}) => {
  const [mobileActiveCategory, setMobileActiveCategory] = useState<
    string | null
  >(null);

  const [collapsibleStates, setCollapsibleStates] = useState<
    Record<string, boolean>
  >({});
  // const isLoggedIn = false;

  const activeCategoryData = mobileActiveCategory
    ? mobileMenuContent[mobileActiveCategory]
    : null;

  const toggleCollapsible = (label: string) => {
    setCollapsibleStates((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const hasDrilldown = (item: string): boolean =>
    mobileMenuContent.hasOwnProperty(item);

  return (
    // FIX 1: Apply slide-in/out transition for the entire drawer based on isMenuOpen
    <div
      className={`lg:hidden fixed inset-0 z-50 bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
        isMenuOpen ? "translate-x-0" : "translate-x-full" // Slides from right to left
      }`}
    >
      {/* FIX 2: Create a single sliding container for the two-panel drilldown effect */}
      <div
        className={`h-full flex w-[200%] transition-transform duration-300 ease-in-out ${
          mobileActiveCategory ? "-translate-x-1/2" : "translate-x-0" // Handles the slide between main and sub-menu
        }`}
      >
        {/* Panel 1: Main Menu List (Takes up 1/2 of 200% width = 100% viewport width) */}
        <div className="w-1/2 h-full shrink-0 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            {/* <h2 className="text-xl font-serif font-bold">Menu</h2> */}
            {/* The 'X' button closes the entire drawer */}
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="py-3 text-sm border-b border-gray-100 text-gray-900 font-semibold flex items-center gap-2 blue-link">
              {loading ? (
                <LoadingDots size="xs"></LoadingDots>
              ) : (
                <>
                  <span
                    onClick={handleAuthModal}
                    className="inline lg:hidden text-sm blue-link cursor-pointer"
                  >
                    {" "}
                    {token ? (
                      <span className="flex gap-2 item-center justify-center">
                        Profile
                        <User size={20} />
                      </span>
                    ) : (
                      "Sign In / Sign Up"
                    )}
                  </span>
                  {token && (
                    <>
                      <span className="blue-link">|</span>
                      <span>{logoutIcon()}</span>
                    </>
                  )}
                </>
              )}
            </div>

            {navItems.map((item) => (
              <a
                key={item}
                href={hasDrilldown(item) ? "#" : `/shop/${item.toLowerCase()}`}
                className={`py-3 text-gray-700 hover:text-amber-700 border-b border-gray-100 text-lg font-medium flex justify-between items-center`}
                onClick={(e) => {
                  if (hasDrilldown(item)) {
                    e.preventDefault();
                    setMobileActiveCategory(item);
                  } else {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {item}
                {hasDrilldown(item) && (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Panel 2: Drilldown Sub-Category Panel (Takes up 1/2 of 200% width = 100% viewport width) */}
        <div
          className={`w-1/2 h-full flex-shrink-0 bg-white p-6 overflow-y-auto`}
        >
          {/* Header: Back Button and Category Title */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setMobileActiveCategory(null)}
              className="mr-4 text-gray-700 flex items-center"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-medium text-gray-900">
              {mobileActiveCategory}
            </h2>
          </div>

          {/* Subcategory Links */}
          <div className="space-y-1">
            {activeCategoryData?.map((item, index) => {
              if (item.type === "link") {
                return (
                  <a
                    key={index}
                    href={`/shop/${mobileActiveCategory?.toLowerCase()}/${item.label
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                    className="block py-3 text-gray-700 border-b border-gray-100 font-medium"
                  >
                    {item.label}
                  </a>
                );
              } else if (item.type === "collapsible") {
                const isExpanded =
                  collapsibleStates[item.label] ?? item.expanded;
                return (
                  <div key={index} className="border-b border-gray-100">
                    <button
                      onClick={() => toggleCollapsible(item.label)}
                      className="w-full py-3 text-gray-700 font-medium flex justify-between items-center"
                    >
                      {item.label}
                      <span className="text-xl font-bold text-gray-400">
                        {isExpanded ? "-" : "+"}
                      </span>
                    </button>
                    {isExpanded && (
                      <ul className="pl-4 pb-2 space-y-1">
                        {item.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <a
                              href="#"
                              className="block py-1 text-gray-600 text-sm"
                            >
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              } else if (item.type === "banner") {
                return (
                  <div key={index} className="mt-6">
                    <div className="bg-gray-100 p-8 rounded text-center">
                      <p className="font-serif text-xl font-bold">
                        {item.label}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN HEADER COMPONENT ---
const HeaderDS = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const navItems = [
    "New!",
    "Gifts",
    "Holiday",
    "Furniture",
    "Décor & Pillows",
    "Lighting",
    "Rugs",
    "Art & Mirrors",
    "Kitchen & Dining",
    "Candles",
    "Bedding",
    "Bath",
    "Outdoor",
    "Sale",
  ];

  const { token, logout, loading, setLoading } = useAuth();
  // console.log(token,'tokennn');
  const megaMenuContent = activeNavItem
    ? megaMenuData[activeNavItem as keyof typeof megaMenuData]
    : null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleAuthModal = () => {
    token ? router.push("/dashboard") : setIsModalOpen(true);
  };

  // const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.post("/auth/logout");
      logout();
      setLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  const logoutIcon = () => {
    return (
      <span onClick={handleLogout} className="flex gap-2 item-center justify-center text-red-500 cursor-pointer">
        Logout
        <LogOut className="" size={20} />
      </span>
    );
  };

  return (
    <header className="">
      <PromoBannerContainer />

      <div
        className="border-b border-gray-200 relative"
        onMouseLeave={() => setActiveNavItem(null)}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
            {/* Logo */}
            <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-wider">
              SAKIGAI
            </h1>

            {/* Right Side Actions (unchanged for brevity) */}
            <div className="lg:w-fit w-full sm:gap-4 flex justify-between items-center">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search className="text-gray-500" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="bg-transparent border-none outline-none px-3 text-sm w-36 sm:w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden lg:flex text-gray-700 hover:text-amber-700 transition-colors gap-2">
                  {loading ? (
                    <LoadingDots size="xs"></LoadingDots>
                  ) : (
                    <>
                      <span
                        onClick={handleAuthModal}
                        className="hidden sm:inline text-sm blue-link cursor-pointer"
                      >
                        {token ? (
                          <span className="flex gap-2 item-center justify-center">
                            Profile
                            <User size={20} />
                          </span>
                        ) : (
                          "Sign In / Sign Up"
                        )}
                      </span>
                      {token && (
                        <>
                          <span className="blue-link">|</span>
                          <span>{logoutIcon()}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
                <button className="text-gray-700 hover:text-amber-700 transition-colors">
                  <ShoppingBag size={20} />
                </button>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Full Navigation (unchanged for brevity) */}
          <nav className="hidden lg:flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className={`font-semibold heading text-xs
                  text-gray-700 transition-colors relative border-b-2 pb-4
                  ${
                    activeNavItem === item
                      ? "text-amber-700 font-semibold  border-amber-700 "
                      : "hover:text-amber-700 border-transparent"
                  }
                `}
                onMouseEnter={() => setActiveNavItem(item)}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Mega Menu Dropdown */}
          {megaMenuContent && <MegaMenu data={megaMenuContent} />}

          {/* --- MOBILE NAVIGATION DRAWER (UPDATED PROPS) --- */}
          <MobileMenuDrawer
            navItems={navItems}
            mobileMenuContent={mobileMenuContent}
            isMenuOpen={isMenuOpen} // <--- Passed the state
            setIsMenuOpen={setIsMenuOpen}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            token={token}
            logoutIcon={logoutIcon}
            loading={loading}
            handleAuthModal={handleAuthModal}
          />
        </div>
      </div>
      {
        // isModalOpen && (
        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        // )
      }
    </header>
  );
};

export default HeaderDS;
