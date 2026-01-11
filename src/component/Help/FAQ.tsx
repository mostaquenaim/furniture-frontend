"use client";

import { useState, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  CreditCard,
  Package,
  User,
  MessageSquare,
  Home,
  Globe,
  Filter,
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  // Ordering & Products
  {
    id: 1,
    question: "How do I place an order on Sakigai?",
    answer:
      "You can place an order by browsing our collection, selecting your desired items, and proceeding through our secure checkout. You'll need to provide shipping information, select a payment method, and confirm your order. You'll receive an email confirmation immediately after placing your order.",
    category: "Ordering & Products",
    tags: ["ordering", "checkout", "payment"],
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept Visa, MasterCard, American Express, PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted channels. We also offer installment payment options for orders above $500 through our financing partners.",
    category: "Ordering & Products",
    tags: ["payment", "credit cards", "financing"],
  },
  {
    id: 3,
    question: "How can I check product availability?",
    answer:
      "Product availability is shown on each product page. Items marked 'In Stock' typically ship within 1-2 business days. For custom or made-to-order pieces, production time will be indicated on the product page. You can also contact our customer service for specific availability questions.",
    category: "Ordering & Products",
    tags: ["availability", "inventory", "stock"],
  },

  // Shipping & Delivery
  {
    id: 4,
    question: "What are your shipping options and costs?",
    answer:
      "We offer standard shipping (5-7 business days) for $9.99, express shipping (2-3 business days) for $19.99, and overnight shipping for $39.99. Free standard shipping is available on all orders over $199. International shipping rates vary by destination.",
    category: "Shipping & Delivery",
    tags: ["shipping", "delivery", "costs"],
  },
  {
    id: 5,
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 5-7 business days. Express delivery is 2-3 business days. Custom or large furniture items may take 2-4 weeks for delivery. You'll receive tracking information via email as soon as your order ships.",
    category: "Shipping & Delivery",
    tags: ["delivery time", "tracking", "shipping"],
  },
  {
    id: 6,
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by location. Customs duties and taxes may apply depending on your country's regulations. You can check shipping availability during checkout.",
    category: "Shipping & Delivery",
    tags: ["international", "global", "customs"],
  },
  {
    id: 7,
    question: "How can I track my order?",
    answer:
      "You can track your order using the 'Track Order' feature on our website. Simply enter your order number and email address. You'll also receive email updates with tracking links at each stage of the shipping process.",
    category: "Shipping & Delivery",
    tags: ["tracking", "order status", "shipment"],
  },

  // Returns & Exchanges
  {
    id: 8,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Items must be in original condition with all packaging. Custom or made-to-order items are not eligible for return. Return shipping is free for defective items; otherwise, a $9.99 return shipping fee applies.",
    category: "Returns & Exchanges",
    tags: ["returns", "refunds", "policy"],
  },
  {
    id: 9,
    question: "How do I initiate a return or exchange?",
    answer:
      "Log into your account, go to 'Order History', select the item you want to return, and follow the return instructions. You can also contact our customer service team for assistance. Once we receive your return, refunds are processed within 5-7 business days.",
    category: "Returns & Exchanges",
    tags: ["return process", "exchange", "refund"],
  },
  {
    id: 10,
    question: "Are there any items that cannot be returned?",
    answer:
      "Yes, custom furniture, made-to-order pieces, clearance items, and personalized products cannot be returned. Additionally, items that show signs of use, damage, or missing packaging may not be eligible for return.",
    category: "Returns & Exchanges",
    tags: ["non-returnable", "custom", "clearance"],
  },

  // Product Care & Assembly
  {
    id: 11,
    question: "How do I care for my wooden furniture?",
    answer:
      "Clean with a soft, dry cloth. Avoid harsh chemicals and excessive moisture. Use coasters for drinks to prevent water rings. For deep cleaning, use a mild soap solution and dry immediately. Apply furniture wax every 6-12 months to maintain the finish.",
    category: "Product Care & Assembly",
    tags: ["care", "maintenance", "wood"],
  },
  {
    id: 12,
    question: "Do your products require assembly?",
    answer:
      "Some furniture items require basic assembly. All necessary tools and instructions are included. For larger items, we offer white-glove delivery and assembly service for an additional fee. Assembly requirements are listed on each product page.",
    category: "Product Care & Assembly",
    tags: ["assembly", "setup", "installation"],
  },

  // Account & Security
  {
    id: 13,
    question: "How do I create an account?",
    answer:
      "Click 'Sign Up' in the top navigation and provide your email address and a password. You can also create an account during checkout. Having an account allows you to track orders, save favorites, and view order history.",
    category: "Account & Security",
    tags: ["account", "registration", "sign up"],
  },
  {
    id: 14,
    question: "How secure is my personal information?",
    answer:
      "We use industry-standard SSL encryption to protect your data. We never store full credit card numbers. Your information is only used to process orders and improve your shopping experience. Read our Privacy Policy for more details.",
    category: "Account & Security",
    tags: ["security", "privacy", "data"],
  },

  // Services & Support
  {
    id: 15,
    question: "Do you offer interior design consultations?",
    answer:
      "Yes, we offer complimentary virtual design consultations for orders over $2,500. Our design experts can help you select pieces that work for your space. Book a consultation through our website or contact our design team directly.",
    category: "Services & Support",
    tags: ["design", "consultation", "styling"],
  },
  {
    id: 16,
    question: "What are your customer service hours?",
    answer:
      "Our customer service team is available Monday-Friday 9AM-8PM EST and Saturday 10AM-6PM EST. You can reach us via phone, email, or live chat. For urgent matters outside these hours, you can submit a ticket through our contact form.",
    category: "Services & Support",
    tags: ["support", "contact", "hours"],
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Ordering & Products": <ShoppingBag className="w-6 h-6" />,
  "Shipping & Delivery": <Truck className="w-6 h-6" />,
  "Returns & Exchanges": <RefreshCw className="w-6 h-6" />,
  "Product Care & Assembly": <Package className="w-6 h-6" />,
  "Account & Security": <Shield className="w-6 h-6" />,
  "Services & Support": <MessageSquare className="w-6 h-6" />,
};

const FAQPageComp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState<string | "All">("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "All",
    ...Array.from(new Set(faqData.map((item) => item.category))),
  ];

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchInputRef.current?.blur();
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-100 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    categories.forEach((cat) => {
      if (cat === "All") {
        stats[cat] = faqData.length;
      } else {
        stats[cat] = faqData.filter((item) => item.category === cat).length;
      }
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find answers to common questions about ordering, shipping,
              returns, and more.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search questions or keywords..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-300">
                {searchQuery
                  ? `Found ${filteredFAQs.length} result${
                      filteredFAQs.length !== 1 ? "s" : ""
                    }`
                  : "Type to search our FAQ database"}
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar (Expandable on Mobile) */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden lg:sticky lg:top-24">
              {/* Mobile Header / Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-full flex lg:hidden items-center justify-between p-4 bg-white text-gray-900 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <span>Category: {activeCategory}</span>
                </div>
                {isSidebarOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {/* Desktop Header */}
              <div className="hidden lg:block p-6 pb-2">
                <h3 className="font-bold text-gray-900">Categories</h3>
              </div>

              {/* Categories List */}
              <div
                className={`${
                  isSidebarOpen ? "block" : "hidden"
                } lg:block p-2 lg:p-4 space-y-1`}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setIsSidebarOpen(false); // Close on selection (mobile)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      activeCategory === category
                        ? "bg-black text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        activeCategory === category
                          ? "bg-white/20"
                          : "bg-gray-100"
                      }`}
                    >
                      {categoryStats[category]}
                    </span>
                  </button>
                ))}
                <div className="mt-6 pt-6 border-t lg:hidden grid grid-cols-2 gap-2">
                   <a href="/contact" className="text-center py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Email Us</a>
                   <a href="/live-chat" className="text-center py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold">Live Chat</a>
                </div>
              </div>
           
              {/* Help Card */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Still need help?
                </h4>
                <p className="text-blue-700 text-sm mb-4">
                  Can't find what you're looking for? Contact our support team.
                </p>
                <div className="space-y-3">
                  <a
                    href="/contact"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/live-chat"
                    className="block w-full text-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
                  >
                    Live Chat
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeCategory === "All" ? "All Questions" : activeCategory}
                </h2>
                <p className="text-gray-600">
                  {filteredFAQs.length} question
                  {filteredFAQs.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {searchQuery || activeCategory !== "All" ? (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                  >
                    <button
                      onClick={() => toggleFAQ(item.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg mt-1">
                          {categoryIcons[item.category]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {highlightText(item.question)}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {expandedId === item.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedId === item.id && (
                      <div className="px-6 pb-5 pt-2 border-t">
                        <div className="pl-12">
                          <p className="text-gray-700 leading-relaxed">
                            {highlightText(item.answer)}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Category: {item.category}
                            </span>
                            <button
                              onClick={() => toggleFAQ(item.id)}
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Collapse
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any FAQs matching "{searchQuery}". Try
                      different keywords or browse by category.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                    >
                      View All FAQs
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Popular Questions */}
            {!searchQuery && activeCategory === "All" && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Popular Questions
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {faqData.slice(0, 4).map((item) => (
                    <a
                      key={item.id}
                      href={`#faq-${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFAQ(item.id);
                        document
                          .getElementById(`faq-${item.id}`)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {categoryIcons[item.category]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {item.question}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.answer.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Banner */}
            <div className="mt-16 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Still have questions?
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Our customer support team is here to help you with any
                  questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition"
                  >
                    Contact Us
                  </a>
                  <a
                    href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
                    className="px-8 py-3 bg-transparent text-white border border-white/30 font-medium rounded-lg hover:bg-white/10 transition"
                  >
                    Call Now: {process.env.NEXT_PUBLIC_PHONE_LABEL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPageComp;
