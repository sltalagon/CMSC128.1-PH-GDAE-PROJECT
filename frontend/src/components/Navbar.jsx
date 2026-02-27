import { Search, Book, Activity, SquarePen, Shield } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  // Main public navigation items
  const navItems = [
    { name: "Gene Search", path: "/", icon: <Search size={18} /> },
    { name: "Disease Search", path: "/diseases", icon: <Activity size={18} /> },
    { name: "Suggestion Tab", path: "/suggestion", icon: <SquarePen size={18} /> },
    { name: "About", path: "/about", icon: <Book size={18} /> },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Header Section */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <div className="w-6 h-6 border-2 border-white rounded-full"></div>
            <div className="w-6 h-1 bg-white mt-1 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">PH-GDAE</h1>
            <p className="text-sm text-slate-500">Philippine Gene–Disease Association Explorer</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          PH Philippine Focus
        </span>
      </div>

      {/* Navigation Tabs Section */}
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          
          {/* Left Side: Main Public Tabs */}
          <div className="flex gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 pb-3 pt-2 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Side: Admin Access Link */}
          <NavLink
            to="/admin/login"
            className={({ isActive }) =>
              `flex items-center gap-2 pb-3 pt-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-blue-600"
              }`
            }
          >
            <Shield size={18} />
            Admin Access
          </NavLink>

        </div>
      </div>
    </div>
  );
};

export default Navbar;