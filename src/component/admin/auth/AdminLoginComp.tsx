import React from "react";

const AdminLoginComp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b">
          <h1 className="text-2xl font-serif tracking-wide text-gray-800">
            Sakigai Admin
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your store
          </p>
        </div>

        {/* Form */}
        <form className="px-8 py-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@sakigai.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-gray-800" />
              Remember me
            </label>

            <button type="button" className="text-gray-700 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Sakigai Furniture
        </div>
      </div>
    </div>
  );
};

export default AdminLoginComp;
