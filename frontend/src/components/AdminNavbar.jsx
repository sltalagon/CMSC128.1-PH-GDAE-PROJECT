import React, { useEffect, useState } from "react";
import logo from "../assets/logot.png";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Shield, ClipboardCheck, LogOut, Users } from "lucide-react";

const Navbar = ({ onSignOut }) => {
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.role === "SUPER_ADMIN") setIsSuperAdmin(true);
        if (data.email) setUserEmail(data.email);
      })
      .catch(() => {});
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Gene Search",        path: "/admin/gene-search",    icon: <Search size={18} /> },
    { name: "Disease Search",     path: "/admin/disease-search", icon: <Search size={18} /> },
    { name: "Admin Panel",        path: "/admin",                icon: <Shield size={18} /> },
    { name: "Admin Suggestions",  path: "/admin/suggestions",    icon: <ClipboardCheck size={18} /> },
  ];

  return (
    <div className="w-full font-sans">
      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0v20M0 10h20' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-2 flex items-center justify-center shadow">
              <img
                src={logo}
                className="h-28 w-auto object-contain"
                alt="PH-GDAE Logo"
              />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                PH-GDAE
              </h1>
              <p className="text-blue-100 font-medium opacity-90">
                Philippine Gene–Disease Association Explorer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm font-semibold">
              <span>🇵🇭</span> Philippine Focus
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm opacity-80">
              {userEmail}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-white"
          style={{ borderRadius: "100% 100% 0 0 / 100% 100% 0 0" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white pb-6 pt-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100"
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}

            {/* Only visible to Super Admins */}
            {isSuperAdmin && (
              <NavLink
                to="/superadmin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-200 ring-2 ring-red-100"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`
                }
              >
                <Users size={18} />
                Manage Accounts
              </NavLink>
            )}

            <button
              onClick={handleSignOut}
              className="ml-auto flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;