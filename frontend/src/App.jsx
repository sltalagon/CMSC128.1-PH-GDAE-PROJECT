import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import GeneSearch from "./pages/public/GeneSearch";
import DiseaseSearch from "./pages/public/DiseaseSearch";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDiseaseSearch from "./pages/admin/AdminDiseaseSearch";
import AdminGeneSearch from "./pages/admin/AdminGeneSearch";
import SuggestionAdmin from "./pages/admin/SuggestionAdmin";
import About from "./pages/public/About";
import SuggestionTab from "./pages/public/SuggestionTab";
import { Outlet } from "react-router-dom";

// Layout for Public Pages (with Navbar)
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

// simple Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAdmin") === "true";
  return isAuthenticated ? children : <Navigate replace to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES (Shows Navbar) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<GeneSearch />} />
          <Route path="/diseases" element={<DiseaseSearch />} />
          <Route path="/about" element={<About />} />
          <Route path="/suggestion" element={<SuggestionTab />} />
        </Route>

        {/* --- ADMIN ROUTES (No Public Navbar) --- */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/genes"
            element={
              <ProtectedRoute>
                <AdminGeneSearch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/diseases"
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
