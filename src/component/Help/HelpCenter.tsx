"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

// --- Types & Interfaces ---

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FAQData {
  [key: string]: FAQ[];
}

interface ContactOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  availability: string;
  action: string;
}

// --- Data ---

const categories: Category[] = [
  {
    id: "orders",
    title: "Orders & Tracking",
    icon: Package,
    description: "Track orders and manage deliveries",
  },
  {
    id: "payment",
    title: "Payment & Billing",
    icon: CreditCard,
    description: "Payment methods and billing questions",
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: Truck,
    description: "Shipping options and delivery times",
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: RotateCcw,
    description: "Return policy and refund process",
  },
  {
    id: "account",
    title: "Account & Security",
    icon: ShieldCheck,
    description: "Account settings and security",
  },
  {
    id: "general",
    title: "General Questions",
    icon: HelpCircle,
    description: "Product info and other inquiries",
  },
];

const faqData: FAQData = {
  orders: [
    {
      question: "How can I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the Orders page.",
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "Orders can be modified or cancelled within 1 hour of placement.",
    },
  ],
  payment: [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, Apple Pay, and Google Pay.",
    },
  ],
  shipping: [
    {
      question: "What are the shipping costs?",
      answer: "Standard shipping is free for orders over ৳100.",
    },
  ],
  returns: [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy from the date of delivery.",
    },
  ],
  account: [
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page to receive a reset link.",
    },
  ],
  general: [
    {
      question: "Do you offer gift cards?",
      answer: "Yes, digital gift cards are available from ৳25 to ৳500.",
    },
  ],
};

const contactOptions: ContactOption[] = [
  {
    id: "chat",
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team",
    availability: "Mon-Sun, 9 AM - 9 PM EST",
    action: "Start Chat",
  },
  {
    id: "email",
    icon: Mail,
    title: "Email Support",
    description: "Send us a message",
    availability: "Response within 24 hours",
    action: "Send Email",
  },
  {
    id: "phone",
    icon: Phone,
    title: "Phone Support",
    description: "Speak with a representative",
    availability: "Mon-Fri, 9 AM - 6 PM EST",
    action: "1-800-EXAMPLE",
  },
];

// --- Sub-Components ---

const FAQItem: React.FC<{
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ faq, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
    >
      <span className="text-sm font-medium text-gray-900 pr-4">
        {faq.question}
      </span>
      {isOpen ? (
        <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      )}
    </button>
    {isOpen && (
      <div className="px-5 pb-4 pt-0 border-t border-gray-50">
        <p className="text-xs text-gray-600 leading-relaxed pt-4">
          {faq.answer}
        </p>
      </div>
    )}
  </div>
);

// --- Main Component ---

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const allFaqs: FAQ[] = Object.values(faqData)
    .flat()
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const filteredFaqs: FAQ[] = selectedCategory
    ? faqData[selectedCategory].filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header & Search */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-2xl md:text-3xl font-medium mb-2 tracking-tight text-gray-900">
            Help Center
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Find answers to common questions and get support
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Search Results View */}
        {searchQuery && !selectedCategory && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Search Results ({allFaqs.length})
            </h2>
            {allFaqs.length === 0 ? (
              <div className="text-center py-12 border border-gray-200 rounded-lg bg-white">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-900 font-medium">
                  No results found
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allFaqs.map((faq, idx) => (
                  <FAQItem
                    key={idx}
                    faq={faq}
                    isOpen={expandedFaq === idx}
                    onToggle={() =>
                      setExpandedFaq(expandedFaq === idx ? null : idx)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Detail View */}
        {selectedCategory ? (
          <div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setExpandedFaq(null);
              }}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Categories
            </button>

            {categories
              .filter((c) => c.id === selectedCategory)
              .map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="flex items-start gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {cat.title}
                      </h2>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    </div>
                  </div>
                );
              })}

            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <FAQItem
                  key={idx}
                  faq={faq}
                  isOpen={expandedFaq === idx}
                  onToggle={() =>
                    setExpandedFaq(expandedFaq === idx ? null : idx)
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          /* Landing View (Categories & Contact) */
          <>
            {!searchQuery && (
              <>
                <section className="mb-12">
                  <h2 className="text-sm font-medium text-gray-900 mb-4">
                    Browse by Category
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setExpandedFaq(null);
                          }}
                          className="border border-gray-200 rounded-lg bg-white p-4 hover:border-gray-300 transition-colors text-left group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                              <Icon className="w-5 h-5 text-gray-700" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900 mb-1">
                                {category.title}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {category.description}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h2 className="text-sm font-medium text-gray-900 mb-4">
                    Contact Support
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {contactOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.id}
                          className="border border-gray-200 rounded-lg bg-white p-5"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                            <Icon className="w-5 h-5 text-gray-700" />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {option.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3">
                            {option.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{option.availability}</span>
                          </div>
                          <button className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium">
                            {option.action}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <button className="text-sm text-gray-900 font-medium hover:text-gray-700 transition-colors">
            Contact our support team →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;
