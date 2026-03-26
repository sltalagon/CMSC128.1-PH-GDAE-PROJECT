import React from "react";
import { NavLink } from "react-router-dom";
import { Search, Shield, Lightbulb, BookOpen } from "lucide-react";
import logo from "../assets/logot.png"; // Make sure this path is correct!

const Navbar = () => {
  const navItems = [
    { name: "Gene Search", path: "/", icon: <Search size={18} /> },
    { name: "Disease Search", path: "/diseases", icon: <Search size={18} /> },
    { name: "Suggestions", path: "/suggestion", icon: <Lightbulb size={18} /> },
    { name: "About", path: "/about", icon: <BookOpen size={18} /> },
  ];

  // Consistent pill styling for all nav links
  const getLinkClassName = ({ isActive }) =>
    `flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100"
        : "bg-gray-100 text-slate-600 hover:bg-gray-200 hover:text-slate-900"
    }`;

  return (
    <div className="w-full font-sans">
      {/* Top Banner: Purple/Blue Gradient with Pattern */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0v20M0 10h20' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-2 flex items-center justify-center shadow-md">
              <img
                src={logo}
                className="h-24 w-24 object-contain rounded-full"
                alt="PH-GDAE Logo"
              />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                PH-GDAE
              </h1>
              <p className="text-blue-100 font-medium opacity-90 mt-1">
                Philippine Gene–Disease Association Explorer
              </p>
            </div>
          </div>

          {/* Location Badge (Email removed from here) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm font-semibold shadow-sm">
              <span>🇵🇭</span> Philippine Focus
            </div>
          </div>
        </div>

        {/* The White Bottom Curve */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-white"
          style={{ borderRadius: "100% 100% 0 0 / 100% 100% 0 0" }}
        ></div>
      </div>

      {/* Navigation: Pill Buttons */}
      <nav className="bg-white pb-6 pt-2 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Side: Main Links */}
            <div className="flex flex-wrap gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"} // Prevents Home from staying active on sub-pages
                  className={getLinkClassName}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Right Side: Admin Access Link */}
            <NavLink to="/admin/login" className={getLinkClassName}>
              <Shield size={18} className="text-slate-500" />
              Admin Access
            </NavLink>
            
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;