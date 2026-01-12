"use client";
import { useState } from "react";
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
} from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      id: "orders",
      title: "Orders & Tracking",
      icon: Package,
      description: "Track orders, manage deliveries, and order issues",
    },
    {
      id: "payment",
      title: "Payment & Billing",
      icon: CreditCard,
      description: "Payment methods, invoices, and billing questions",
    },
    {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: Truck,
      description: "Shipping options, delivery times, and costs",
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      icon: RotateCcw,
      description: "Return policy, refund process, and exchanges",
    },
    {
      id: "account",
      title: "Account & Security",
      icon: ShieldCheck,
      description: "Account settings, password, and security",
    },
    {
      id: "general",
      title: "General Questions",
      icon: HelpCircle,
      description: "Product info, policies, and other inquiries",
    },
  ];

  const faqData = {
    orders: [
      {
        question: "How can I track my order?",
        answer:
          "You can track your order by logging into your account and visiting the Orders page. Click on the specific order to view detailed tracking information. You'll also receive email updates with tracking links when your order ships.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "Orders can be modified or cancelled within 1 hour of placement. After this time, the order enters our fulfillment process and cannot be changed. Please contact support immediately if you need to make changes.",
      },
      {
        question: "Why is my order delayed?",
        answer:
          "Order delays can occur due to high demand, inventory issues, or shipping carrier delays. Check your order status for specific information. If your order is significantly delayed, our support team will contact you with updates.",
      },
      {
        question: "What should I do if I received the wrong item?",
        answer:
          "If you received an incorrect item, please contact our support team within 48 hours with your order number and photos of the item received. We'll arrange a replacement or full refund at no additional cost to you.",
      },
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely through encrypted connections.",
      },
      {
        question: "When will I be charged for my order?",
        answer:
          "Your payment method is charged immediately when you place your order. For pre-orders, you'll be charged when the item is ready to ship. If an item is out of stock, we'll notify you before processing payment.",
      },
      {
        question: "Can I get an invoice for my purchase?",
        answer:
          "Yes, invoices are automatically generated for all orders. You can download your invoice from the order details page in your account, or request one via email from our support team.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use industry-standard SSL encryption and PCI-DSS compliant payment processors. We never store your complete credit card information on our servers.",
      },
    ],
    shipping: [
      {
        question: "What are the shipping costs?",
        answer:
          "Shipping costs vary based on your location, order size, and selected shipping method. Standard shipping is free for orders over ৳100. Express and overnight shipping options are available at checkout.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days, and overnight shipping delivers next business day. International orders may take 10-21 business days depending on customs.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination. Import duties and taxes may apply and are the responsibility of the recipient.",
      },
      {
        question: "Can I change my shipping address after ordering?",
        answer:
          "Shipping addresses can be updated within 1 hour of order placement. Contact our support team immediately if you need to change your address. Once shipped, address changes must be handled through the carrier.",
      },
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy from the date of delivery. Items must be unused, in original packaging, and in resalable condition. Some items like personalized products or final sale items cannot be returned.",
      },
      {
        question: "How do I start a return?",
        answer:
          "To initiate a return, log into your account, go to Order History, select the order, and click 'Request Return'. Follow the prompts to select items and provide a reason. You'll receive a prepaid return label via email.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be credited to your original payment method. Please allow 3-5 additional business days for the refund to appear.",
      },
      {
        question: "Can I exchange an item instead of returning it?",
        answer:
          "Yes, we offer exchanges for different sizes or colors of the same item. Select 'Exchange' when initiating your return. We'll ship your replacement as soon as we receive your original item.",
      },
    ],
    account: [
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link via email within a few minutes. If you don't receive it, check your spam folder or contact support.",
      },
      {
        question: "Can I change my email address?",
        answer:
          "Yes, you can update your email address in Account Settings. For security, we'll send a verification email to your new address before the change takes effect. You'll need to confirm both the old and new email addresses.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "To delete your account, go to Account Settings and select 'Delete Account'. Please note that this action is permanent and will remove all your order history, saved addresses, and preferences.",
      },
      {
        question: "Is my personal information secure?",
        answer:
          "We take privacy seriously. Your personal information is encrypted, stored securely, and never sold to third parties. We only use your data to process orders and improve your shopping experience. View our Privacy Policy for details.",
      },
    ],
    general: [
      {
        question: "Do you offer gift cards?",
        answer:
          "Yes, digital gift cards are available in amounts from ৳25 to ৳500. Gift cards are delivered via email and never expire. They can be used for any purchase on our website.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach us via live chat (available 9 AM - 9 PM EST), email at support@example.com, or phone at 1-800-EXAMPLE. We typically respond to emails within 24 hours on business days.",
      },
      {
        question: "Do you have a physical store?",
        answer:
          "We're an online-only retailer, which allows us to offer competitive prices and a wide selection. However, we occasionally host pop-up shops in major cities. Check our website for upcoming events.",
      },
      {
        question: "Can I sign up for email notifications?",
        answer:
          "Yes, you can subscribe to our newsletter for exclusive offers, new product announcements, and style tips. Manage your email preferences in Account Settings or use the unsubscribe link in any email.",
      },
    ],
  };

  const contactOptions = [
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
      description: "Send us a detailed message",
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

  const allFaqs = Object.values(faqData)
    .flat()
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredFaqs = selectedCategory
    ? faqData[selectedCategory].filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-2xl md:text-3xl font-medium mb-2 tracking-tight text-gray-900 text-center">
            Help Center
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Find answers to common questions and get support
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
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
                <p className="text-xs text-gray-500 mt-1">
                  Try different keywords or browse categories below
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {allFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === idx ? null : idx)
                      }
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-4 pt-0">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            <div className="mb-6">
              {categories
                .filter((cat) => cat.id === selectedCategory)
                .map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {cat.title}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 border border-gray-200 rounded-lg bg-white">
                  <p className="text-sm text-gray-500">
                    No FAQs match your search
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === idx ? null : idx)
                      }
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-4 pt-0 border-t border-gray-200 mt-4">
                        <p className="text-xs text-gray-600 leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {!searchQuery && (
              <div className="mb-12">
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
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
                            <Icon className="w-5 h-5 text-gray-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {category.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {category.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {!searchQuery && (
              <div>
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
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Can't find what you're looking for?
            </p>
            <button className="text-sm text-gray-900 font-medium hover:text-gray-700 transition-colors">
              Contact our support team →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
