"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  ShoppingBag,
  Truck,
  User,
  Star,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const ContactComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });

  const [selectedTopic, setSelectedTopic] = useState("general");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const topics = [
    {
      id: "general",
      label: "General Inquiry",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: "order",
      label: "Order Status",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      id: "shipping",
      label: "Shipping & Delivery",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "returns",
      label: "Returns & Exchanges",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "account",
      label: "Account Help",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "product",
      label: "Product Questions",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  const storeLocations = [
    {
      city: "New York",
      address: "123 Madison Avenue",
      phone: "+1 (212) 555-7890",
      hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-7PM",
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
    },
    {
      city: "Los Angeles",
      address: "456 Rodeo Drive",
      phone: "+1 (310) 555-1234",
      hours: "Mon-Sat: 10AM-9PM, Sun: 11AM-7PM",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    },
    {
      city: "Chicago",
      address: "789 Michigan Avenue",
      phone: "+1 (312) 555-5678",
      hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-6PM",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    },
  ];

  const faqs = [
    {
      question: "What are your customer service hours?",
      answer:
        "Our customer service team is available Monday-Friday from 9AM-8PM EST and Saturday-Sunday from 10AM-6PM EST.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Use our Track Order feature on the website or mobile app. You'll need your order number and email address.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Custom furniture has special considerations - please contact us.",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);

    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        orderNumber: "",
        subject: "",
        message: "",
      });
      setSelectedTopic("general");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thank You for Reaching Out!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We've received your message and our team will get back to you
              within 24-48 hours.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-gray-50 rounded-xl">
                <Mail className="w-8 h-8 text-gray-700 mb-4" />
                <p className="font-medium">Check Your Email</p>
                <p className="text-sm text-gray-600 mt-2">
                  We've sent a confirmation to {formData.email}
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <Phone className="w-8 h-8 text-gray-700 mb-4" />
                <p className="font-medium">Need Immediate Help?</p>
                <p className="text-sm text-gray-600 mt-2">
                  Call us at +1 (800) 123-4567
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <Clock className="w-8 h-8 text-gray-700 mb-4" />
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-gray-600 mt-2">
                  Typically within 24 hours during business days
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-12 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We&apos;re here to help. Reach out to our team for any questions
              about your order, our products, or anything else.
            </p>
            <div className="flex flex-wrap gap-6">
              <a
                href="#contact-form"
                className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition font-medium flex items-center gap-2"
              >
                Send a Message
                <Send className="w-4 h-4" />
              </a>
              <a
                href="tel:+18001234567"
                className="px-8 py-3 bg-transparent text-white border border-white/30 rounded-lg hover:bg-white/10 transition font-medium flex items-center gap-2"
              >
                Call Now
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Phone */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Call Us</h3>
            <p className="text-gray-600 mb-4">
              Speak directly with our customer service team.
            </p>
            <a
              href="tel:+18001234567"
              className="text-2xl font-bold text-gray-900 hover:text-black transition block mb-2"
            >
              +1 (800) 123-4567
            </a>
            <div className="flex items-center gap-2 text-gray-500 mt-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Mon-Fri 9AM-8PM EST</span>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Us</h3>
            <p className="text-gray-600 mb-4">
              Send us a message and we'll respond within 24 hours.
            </p>
            <a
              href="mailto:hello@sakigai.com"
              className="text-xl font-medium text-gray-900 hover:text-black transition block mb-2"
            >
              hello@sakigai.com
            </a>
            <p className="text-sm text-gray-500 mt-4">For general inquiries</p>
          </div>

          {/* Live Chat */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Chat</h3>
            <p className="text-gray-600 mb-4">
              Chat instantly with our support team.
            </p>
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium w-full">
              Start Live Chat
            </button>
            <p className="text-sm text-gray-500 text-center mt-4">
              Available 9AM-8PM EST
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div id="contact-form">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>

              <form onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="SAK-12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
                      placeholder="Please provide as much detail as possible..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Answers
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
                  >
                    <summary className="font-medium text-gray-900 cursor-pointer list-none">
                      <div className="flex items-center justify-between">
                        {faq.question}
                        <ChevronRight className="w-5 h-5 text-gray-400 transform transition-transform group-open:rotate-90" />
                      </div>
                    </summary>
                    <p className="mt-4 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
              <a
                href="faq"
                className="mt-6 inline-flex items-center gap-2 text-black font-medium hover:text-gray-700 transition"
              >
                View all FAQs
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Store Locations & Social */}
          <div>
            {/* Store Locations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Visit Our Stores
              </h2>
              <p className="text-gray-600 mb-8">
                Experience our furniture in person at one of our flagship
                locations.
              </p>

              <div className="space-y-6">
                {storeLocations.map((store, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                  >
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${store.image})` }}
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {store.city}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{store.address}</span>
                          </div>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${store.address}`}
                          target="_blank"
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                        >
                          Directions
                        </a>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{store.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{store.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-linear-to-br from-gray-900 to-black text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
              <p className="text-gray-300 mb-8">
                Follow along for design inspiration, new arrivals, and exclusive
                offers.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition flex flex-col items-center gap-3"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="font-medium">Instagram</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition flex flex-col items-center gap-3"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="font-medium">Facebook</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition flex flex-col items-center gap-3"
                >
                  <Twitter className="w-6 h-6" />
                  <span className="font-medium">Twitter</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition flex flex-col items-center gap-3"
                >
                  <Youtube className="w-6 h-6" />
                  <span className="font-medium">YouTube</span>
                </a>
              </div>

              <div className="pt-8 border-t border-white/20">
                <h4 className="font-medium mb-4">Newsletter Signup</h4>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">
            Ready to transform your space?
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Whether you need design advice or help with an order, we're here for
            you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Shop Collection
            </a>
            <a
              href="tel:+18001234567"
              className="px-8 py-3 bg-transparent text-white border border-white/30 font-medium rounded-lg hover:bg-white/10 transition"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;
