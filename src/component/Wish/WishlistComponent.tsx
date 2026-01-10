/* eslint-disable @next/next/no-img-element */
"use client";

import ProtectedRoute from "@/component/ProtectedRoute";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Heart,
  ShoppingBag,
  Eye,
  Share2,
  ChevronRight,
  Star,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import Title from "../Headers/Title";
import LoadingDots from "../Loading/LoadingDS";
import ShowProductsFlex from "../ProductDisplay/ShowProductsFlex";

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
}

const mockWishlist: WishlistItem[] = [
  {
    id: 1,
    productId: 101,
    name: "Oak Wood Dining Chair",
    price: 12500,
    originalPrice: 15000,
    image:
      "https://m.media-amazon.com/images/I/517lhHFdW6L._AC_UF894,1000_QL80_.jpg",
    slug: "oak-wood-dining-chair",
    inStock: true,
    isNew: true,
    rating: 4.5,
    reviewCount: 24,
  },
  {
    id: 3,
    productId: 103,
    name: "Velvet Lounge Sofa",
    price: 32500,
    originalPrice: 38000,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop",
    slug: "velvet-lounge-sofa",
    inStock: true,
    rating: 4.8,
    reviewCount: 42,
  },
];

const WishlistComponent = () => {
  const axiosSecure = useAxiosSecure();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const removeItem = async (id: number) => {
    try {
      await axiosSecure.delete(`/wishlist/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const removeSelectedItems = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) => axiosSecure.delete(`/wishlist/${id}`))
      );
      setItems((prev) => prev.filter((i) => !selectedItems.includes(i.id)));
      setSelectedItems([]);
      toast.success(`Removed ${selectedItems.length} items from wishlist`);
    } catch {
      toast.error("Failed to remove items");
    }
  };

  const addToCart = async (item: WishlistItem) => {
    if (!item.inStock) {
      toast.error("This item is out of stock");
      return;
    }
    try {
      // Add to cart API call would go here
      toast.success(`Added ${item.name} to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosSecure.get("/wishlist");
        const formatted: WishlistItem[] = res.data.map((w: any) => ({
          id: w.id,
          productId: w.productId,
          name: w.product.name,
          slug: w.product.slug,
          image: w.product.image,
          price: w.product.price,
          originalPrice: w.product.originalPrice,
          inStock: w.product.inStock || true,
          isNew: w.product.isNew,
          rating: w.product.rating,
          reviewCount: w.product.reviewCount,
        }));
        setItems(formatted);
      } catch {
        setItems(mockWishlist);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [axiosSecure]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-800">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/account" className="hover:text-gray-800">
              Account
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium">Wishlist</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-serif font-light tracking-tight mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {items.length} {items.length === 1 ? "item" : "items"} saved for
                later
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {selectedItems.length > 0 && (
                <button
                  onClick={removeSelectedItems}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                  Remove Selected ({selectedItems.length})
                </button>
              )}
              <button
                onClick={selectAllItems}
                className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
              >
                {selectedItems.length === items.length && items.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingDots />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <Heart className="mx-auto text-gray-300 mb-6" size={64} />
            <h3 className="text-2xl font-serif font-light mb-4">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Save items you love here to revisit them later. When you're ready,
              you can easily move them to your cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
              <Link
                href="/shop/new-arrivals"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-800 text-gray-800 hover:bg-gray-50 transition-colors"
              >
                View New Arrivals
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item) => (
                <>
                  {item.inStock && (
                    <div
                      key={item.id}
                      className={`group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-4/5 overflow-hidden">
                        <Link href={`/product/${item.slug}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {item.isNew && (
                            <span className="bg-white px-3 py-1 text-xs font-medium tracking-wide">
                              NEW
                            </span>
                          )}
                          {item.originalPrice && (
                            <span className="bg-red-500 text-white px-3 py-1 text-xs font-medium">
                              SALE
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => toggleSelectItem(item.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedItems.includes(item.id)
                                ? "bg-black text-white"
                                : "bg-white text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {selectedItems.includes(item.id) ? "✓" : "○"}
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center hover:bg-red-50 hover:text-red-600"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Stock Status Overlay */}
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <span className="bg-gray-900 text-white px-4 py-2 text-sm font-medium">
                              OUT OF STOCK
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <div className="mb-3">
                          <Link href={`/product/${item.slug}`}>
                            <h3 className="font-serif text-lg font-light mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>

                          {/* Rating */}
                          {item.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={`${
                                      i < Math.floor(item.rating!)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                ({item.reviewCount})
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xl font-light">
                            ৳{item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <>
                              <span className="text-gray-400 line-through text-sm">
                                ৳{item.originalPrice.toLocaleString()}
                              </span>
                              <span className="text-red-500 text-sm font-medium">
                                Save ৳
                                {(
                                  item.originalPrice - item.price
                                ).toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => addToCart(item)}
                            disabled={!item.inStock}
                            className={`w-full py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                              item.inStock
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <ShoppingBag size={16} />
                            {item.inStock ? "Add to Cart" : "Out of Stock"}
                          </button>
                          <div className="flex gap-2">
                            <Link
                              href={`/product/${item.slug}`}
                              className="flex-1 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                              <Eye size={16} />
                              View
                            </Link>
                            <button
                              className="w-10 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                              title="Share"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Summary Bar */}
            <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-sm text-gray-600">
                  <p>
                    {selectedItems.length} of {items.length} items selected 
                    {/* {items.filter((item) => item.inStock).length} in stock •
                    {items.filter((item) => !item.inStock).length} out of stock */}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      const inStockItems = items.filter(
                        (item) =>
                          selectedItems.includes(item.id) && item.inStock
                      );
                      // Bulk add to cart logic
                      toast.success(
                        `Added ${inStockItems.length} items to cart`
                      );
                    }}
                    disabled={selectedItems.length === 0}
                    className={`px-8 py-3 text-sm font-medium ${
                      selectedItems.length > 0
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Add Selected to Cart
                  </button>

                  <button
                    onClick={() => {
                      // Share wishlist logic
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Wishlist link copied to clipboard");
                    }}
                    className="px-8 py-3 border border-gray-800 text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Share2 size={16} />
                    Share Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="mt-16">
              <div className="max-w-7xl">
                <Title title="You might also like" />
                <ShowProductsFlex />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistComponent;
