import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import GeneSearch from "./pages/public/GeneSearch";
import DiseaseSearch from "./pages/public/DiseaseSearch";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminLogin from "./pages/admin/AdminLogin";
import SuggestionAdmin from "./pages/admin/SuggestionAdmin";
import About from "./pages/public/About";
import SuggestionTab from "./pages/public/SuggestionTab";
import SuperAdminPanel from "./pages/admin/SuperAdminPanel";
import AdminGeneSearch from "./pages/admin/AdminGeneSearch";
import AdminDiseaseSearch from "./pages/admin/AdminDiseaseSearch";

import { checkAuthStatus } from "./api/api";

const PublicLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main>
      <Outlet />
    </main>
  </div>
);

const AdminLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <AdminNavbar />
    <main>
      <Outlet />
    </main>
  </div>
);

const ProtectedRoute = ({ children, allowedRole }) => {
  // ✅ FIXED: Extract and save token synchronously before any render or API call
  const queryParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = queryParams.get("token");
  if (tokenFromUrl) {
    localStorage.setItem("jwt", tokenFromUrl);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const [authState, setAuthState] = useState({
    status: "loading",
    role: null
  });

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    checkAuthStatus()
      .then((isAuthenticated) => {
        if (isAuthenticated && token) {
          try {
            const decoded = jwtDecode(token);
            setAuthState({ status: "auth", role: decoded.role });
          } catch (error) {
            setAuthState({ status: "unauth", role: null });
          }
        } else {
          setAuthState({ status: "unauth", role: null });
        }
      })
      .catch(() => setAuthState({ status: "unauth", role: null }));
  }, []);

  if (authState.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Verifying session...
        </div>
      </div>
    );
  }

  if (authState.status === "unauth") {
    return <Navigate replace to="/admin/login" />;
  }

  if (allowedRole && authState.role !== allowedRole) {
    const redirectPath = authState.role === "ROLE_SUPER_ADMIN" ? "/superadmin" : "/admin";
    return <Navigate replace to={redirectPath} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<GeneSearch />} />
          <Route path="/diseases" element={<DiseaseSearch />} />
          <Route path="/about" element={<About />} />
          <Route path="/suggestion" element={<SuggestionTab />} />
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          {/* Admin Panel — accessible by both Managers and Super Admins */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRole="ROLE_SUPER_ADMIN">
                <SuperAdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/gene-search"
            element={
              <ProtectedRoute>
                <AdminGeneSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/disease-search"
            element={
              <ProtectedRoute>
                <AdminDiseaseSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/suggestions"
            element={
              <ProtectedRoute>
                <SuggestionAdmin />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;