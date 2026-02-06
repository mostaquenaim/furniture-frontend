import React from "react";

const CustomerDrawer = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* drawer toggle  */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            >
              {isDrawerOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* my account label  */}
            <div className="flex items-center gap-2">
              <span className="font-light text-xl">My Account</span>
            </div>

            {/* right name & phone */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name || "Guest"}</p>
                <p className="text-xs text-gray-500">{user.phone || ""}</p>
              </div>
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {(user.name || "G")[0].toUpperCase()}
              </div>
            </div>

            <div className="md:hidden w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {(user.name || "G")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-6">
            <nav className="space-y-1">
              {navigationItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition text-sm ${
                    activeItem === item.id
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 transition text-red-600 text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {isDrawerOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        <aside
          className={`lg:hidden fixed top-0 left-0 w-80 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-light text-xl">My Account</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-gray-50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium text-xl">
                  {(user.name || "G")[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="font-medium text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              {navigationItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition text-sm ${
                    activeItem === item.id
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </nav>

            <div className="p-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 transition text-red-600 text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CustomerDrawer;
