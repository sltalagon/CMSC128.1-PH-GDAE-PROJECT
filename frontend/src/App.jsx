import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
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
import { Outlet } from "react-router-dom";

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

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setAuthState("auth");
        } else {
          setAuthState("unauth");
        }
      })
      .catch(() => setAuthState("unauth"));
  }, []);

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Verifying session...
        </div>
      </div>
    );
  }

  return authState === "auth" ? children : <Navigate replace to="/admin/login" />;
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
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
            path="/superadmin"
            element={
              <ProtectedRoute>
                <SuperAdminPanel />
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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;