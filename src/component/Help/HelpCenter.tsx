"use client";
import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  HelpCircle,
  FileText,
  Truck,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ExternalLink,
  AlertCircle,
  Star,
  BookOpen,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  availability?: string;
}

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMethod, setContactMethod] = useState<
    "email" | "phone" | "chat" | null
  >(null);

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "orders", label: "Orders & Shipping" },
    { id: "returns", label: "Returns & Refunds" },
    { id: "account", label: "Account & Security" },
    { id: "products", label: "Products & Care" },
    { id: "payment", label: "Payment & Pricing" },
  ];

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the Order History page. Alternatively, use the tracking number provided in your shipping confirmation email on the carrier's website. Orders typically update within 24 hours of shipment.",
      category: "orders",
    },
    {
      id: "2",
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy from the date of delivery. Items must be in original condition with all tags attached and in original packaging. Furniture items have specific return requirements – please contact our support team for furniture returns. Refunds are processed within 5-10 business days after we receive your return.",
      category: "returns",
    },
    {
      id: "3",
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link valid for 24 hours. If you don't see the email, check your spam folder or contact our support team for assistance.",
      category: "account",
    },
    {
      id: "4",
      question: "What payment methods do you accept?",
      answer:
        "We accept Visa, MasterCard, American Express, Discover, Apple Pay, Google Pay, and PayPal. All payments are processed securely through encrypted connections. We do not store your full payment information on our servers.",
      category: "payment",
    },
    {
      id: "5",
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-7 business days. Express shipping (if available) takes 1-3 business days. Furniture and large items may have longer delivery times of 2-4 weeks. You'll receive tracking information as soon as your order ships.",
      category: "orders",
    },
    {
      id: "6",
      question: "Can I modify or cancel my order?",
      answer:
        "Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support team immediately. Once an order has shipped, it cannot be cancelled, but you can initiate a return when you receive it.",
      category: "orders",
    },
    {
      id: "7",
      question: "How do I care for wood furniture?",
      answer:
        "Use a soft, dry cloth for daily cleaning. Avoid harsh chemicals and direct sunlight. For deeper cleaning, use a mild soap solution and dry immediately. Apply furniture wax every 6-12 months to maintain the finish. Always use coasters and placemats to protect surfaces.",
      category: "products",
    },
    {
      id: "8",
      question: "Is my personal information secure?",
      answer:
        "Yes, we use industry-standard SSL encryption to protect your data. We never share your personal information with third parties for marketing purposes. You can review our complete Privacy Policy in the footer of our website.",
      category: "account",
    },
  ];

  const contactOptions: ContactOption[] = [
    {
      id: "chat",
      title: "Live Chat",
      description:
        "Chat with a support agent in real-time for immediate assistance",
      icon: <MessageCircle className="w-5 h-5" />,
      actionText: "Start Chat",
      availability: "Mon-Fri 9AM-9PM EST",
    },
    {
      id: "phone",
      title: "Phone Support",
      description: "Speak directly with our customer service team",
      icon: <Phone className="w-5 h-5" />,
      actionText: "Call Now",
      availability: "Mon-Fri 9AM-6PM EST",
    },
    {
      id: "email",
      title: "Email Support",
      description: "Send us a message and we'll respond within 24 hours",
      icon: <Mail className="w-5 h-5" />,
      actionText: "Send Email",
    },
  ];

  const popularTopics = [
    {
      title: "Return a Product",
      description: "Step-by-step guide to returning items",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      title: "Payment Issues",
      description: "Troubleshoot payment and billing problems",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      title: "Account Security",
      description: "Keep your account safe and secure",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      title: "Order Status",
      description: "Check and understand your order status",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const ContactForm = ({ method }: { method: "email" | "phone" | "chat" }) => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      orderNumber: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission
      setShowContactForm(false);
      setContactMethod(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Contact Support
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {method === "email" && "We'll respond within 24 hours"}
                  {method === "phone" && "Call us at 1-800-123-4567"}
                  {method === "chat" && "Chat with a support agent now"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowContactForm(false);
                  setContactMethod(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-sm"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>

            {method === "phone" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Order Number (Optional)
              </label>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) =>
                  setFormData({ ...formData, orderNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="e.g., SAK-12345"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Please describe your issue in detail..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium">Need immediate assistance?</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Include your order number for faster service</li>
                    <li>Check our FAQ section for quick answers</li>
                    <li>
                      For urgent matters, consider live chat or phone support
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowContactForm(false);
                  setContactMethod(null);
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition"
              >
                {method === "email" && "Send Message"}
                {method === "phone" && "Request Callback"}
                {method === "chat" && "Start Chat"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {showContactForm && contactMethod && (
        <ContactForm method={contactMethod} />
      )}

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-1">
          Help Center
        </h1>
        <p className="text-sm text-gray-500">
          Find answers, guides, and contact options for all your questions
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="What can we help you with? Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>
      </div>

      {/* Contact Options */}
      <div className="mb-12">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Get in Touch
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {contactOptions.map((option) => (
            <div
              key={option.id}
              className="border border-gray-200 rounded-sm p-5 hover:border-gray-300 transition"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gray-50 rounded-sm">{option.icon}</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {option.title}
                  </h3>
                  {option.availability && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {option.availability}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-4">{option.description}</p>
              <button
                onClick={() => {
                  setContactMethod(option.id as "email" | "phone" | "chat");
                  setShowContactForm(true);
                }}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
              >
                {option.actionText}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Topics */}
      <div className="mb-12">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Popular Topics
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {popularTopics.map((topic, index) => (
            <button
              key={index}
              className="border border-gray-200 rounded-sm p-4 text-left hover:border-gray-300 transition hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-sm">{topic.icon}</div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-600">{topic.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-medium text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <HelpCircle className="w-4 h-4" />
            <span>{faqs.length} questions</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 text-xs rounded-sm transition ${
                activeCategory === category.id
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-300 hover:border-gray-400 text-gray-700"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-sm">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-700 text-base">No results found</p>
              <p className="text-gray-500 text-xs mt-1">
                Try different search terms or browse by category
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                  }
                  className="w-full p-4 bg-white hover:bg-gray-50 transition text-left flex items-center justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gray-50 rounded-sm mt-0.5">
                      <HelpCircle className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {faq.question}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {categories.find((c) => c.id === faq.category)?.label}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition ${
                      expandedFAQ === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFAQ === faq.id && (
                  <div className="p-4 pt-0">
                    <div className="pl-11">
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {faq.answer}
                        </p>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            Was this helpful?
                          </span>
                          <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded-sm">
                              <CheckCircle className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-sm">
                              <XCircle className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Help Guides */}
      <div className="mb-12">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Helpful Guides
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-sm p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-50 rounded-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Complete Return Process Guide
                </h3>
                <p className="text-xs text-gray-500">
                  5 min read • Updated Jan 2026
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Step-by-step instructions for returning items, from initiating a
              return to receiving your refund. Includes packaging tips and
              shipping information.
            </p>
            <button className="text-xs text-gray-700 hover:text-gray-900 transition flex items-center gap-1">
              Read Guide
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="border border-gray-200 rounded-sm p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-gray-50 rounded-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Furniture Care & Maintenance
                </h3>
                <p className="text-xs text-gray-500">
                  8 min read • Updated Dec 2025
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Learn how to properly care for different furniture materials
              including wood, upholstery, and metal. Seasonal maintenance tips
              included.
            </p>
            <button className="text-xs text-gray-700 hover:text-gray-900 transition flex items-center gap-1">
              Read Guide
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-2">
            Still Need Help?
          </h3>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            Our support team is here to assist you with any questions or
            concerns you may have.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setContactMethod("chat");
                setShowContactForm(true);
              }}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Start Live Chat
            </button>
            <button
              onClick={() => {
                setContactMethod("email");
                setShowContactForm(true);
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
