import { useEffect, useState } from "react";
import logo from "../assets/FinalLogo.png";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Shield,
  ClipboardCheck,
  LogOut,
  Users,
  Menu,
  X,
} from "lucide-react";
import { apiGet, removeToken } from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    apiGet("/admin/me")
      .then((data) => {
        if (data.role === "SUPER_ADMIN") setIsSuperAdmin(true);
        if (data.email) setUserEmail(data.email);
        if (data.picture) setUserPicture(data.picture);
      })
      .catch(() => {});
  }, []);

  const handleSignOut = () => {
    removeToken();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Gene Search", path: "/admin/gene-search", icon: <Search size={18} /> },
    { name: "Disease Search", path: "/admin/disease-search", icon: <Search size={18} /> },
    { name: "Admin Panel", path: "/admin", icon: <Shield size={18} /> },
    { name: "Admin Suggestions", path: "/admin/suggestions", icon: <ClipboardCheck size={18} /> },
    ...(isSuperAdmin
      ? [{ name: "Manage Accounts", path: "/superadmin", icon: <Users size={18} />, danger: true }]
      : []),
  ];

  const getLinkClass = (isActive, danger = false) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
      danger
        ? isActive
          ? "bg-red-600 text-white shadow-md"
          : "bg-red-50 text-red-600 hover:bg-red-100"
        : isActive
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white/60 backdrop-blur-md text-slate-700 hover:bg-blue-100 hover:shadow-sm"
    }`;

  return (
    <div className="w-full font-sans">
      {/* TOP BANNER */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0v20M0 10h20' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-6 pt-6 pb-10 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-4 -mt-2 md:mt-0">
            <div className="bg-white rounded-full p-2 shadow-md">
              <img src={logo} className="h-24 w-24 object-contain rounded-full" alt="Logo" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">GANDA</h1>
              <p className="text-blue-100 opacity-90">Gene and Disease Association</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 self-start md:self-auto md:ml-auto">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm font-semibold">
              🇵🇭 Philippine Focus
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 text-sm opacity-80">
              {userPicture && (
                <img
                  src={userPicture}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              {userEmail}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-white"
          style={{ borderRadius: "100% 100% 0 0 / 100% 100% 0 0" }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          {/* Mobile Header */}
          <div className="flex justify-between items-center md:hidden">
            <span className="text-lg font-semibold text-slate-700">Admin Menu</span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-white shadow hover:scale-105 transition"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Animated Menu */}
          <div
            className={`transform transition-all duration-300 ease-in-out origin-top
            ${isOpen ? "opacity-100 scale-100 mt-4" : "opacity-0 scale-95 h-0 overflow-hidden"}
            md:opacity-100 md:scale-100 md:h-auto md:overflow-visible md:mt-0`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 
                            bg-white/70 backdrop-blur-xl md:bg-transparent 
                            rounded-2xl md:rounded-none p-4 md:p-0 shadow-lg md:shadow-none">
              {/* Left Links */}
              <div className="flex flex-col md:flex-row gap-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/admin"}
                    className={({ isActive }) => getLinkClass(isActive, item.danger)}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
              </div>

              {/* Right */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold 
                           bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;