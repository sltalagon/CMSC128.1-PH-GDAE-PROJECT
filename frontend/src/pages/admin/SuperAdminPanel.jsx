import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserPlus, Trash2, X, Check, AlertCircle, Users } from "lucide-react";

const SuperAdminPanel = () => {
  const [adminData, setAdminData] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("MANAGER");
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete state
  const [confirmDelete, setConfirmDelete] = useState(null); // holds the admin to delete

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(async (data) => {
        setAdminData(data);
        await fetchAdmins();
      })
      .catch(() => navigate("/admin/login"));
}, [navigate]);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/all`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:8080/api/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: newEmail, username: newUsername, role: newRole }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      setSuccess(`${newEmail} has been added as ${newRole === "SUPER_ADMIN" ? "Super Admin" : "Manager"}.`);
      setNewEmail("");
      setNewUsername("");
      setNewRole("MANAGER");
      setShowAddForm(false);
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (adminId, email) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/remove/${adminId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to remove admin");

      setSuccess(`${email} has been removed.`);
      setConfirmDelete(null);
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Verifying secure session...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Super Admin Panel</h2>
            <p className="text-slate-500 text-sm">Manage admin accounts and roles</p>
          </div>
        </div>

        {adminData && (
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
            <img
              src={adminData.picture}
              alt="Profile"
              className="w-10 h-10 rounded-full"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{adminData.name}</p>
              <p className="text-xs text-slate-500">{adminData.email}</p>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Super Admin
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <Check size={18} />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      {/* Add Admin Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Users size={20} />
          <h3 className="font-semibold text-lg">Whitelisted Accounts</h3>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {admins.length}
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
        >
          <UserPlus size={16} />
          Add Account
        </button>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <div className="mb-6 bg-white border-2 border-red-200 rounded-xl p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="font-bold text-slate-900 mb-4">Whitelist New Account</h4>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g., user@up.edu.ph"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g., jdelacruz"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="MANAGER">GenePH Manager – can add/approve genes & diseases</option>
                <option value="SUPER_ADMIN">Super Admin – full access including account management</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check size={18} />
                {submitting ? "Adding..." : "Add to Whitelist"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="space-y-3">
        {admins.map((admin) => (
          <div
            key={admin.adminId}
            className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="font-semibold text-slate-900">{admin.username}</p>
              <p className="text-sm text-slate-500">{admin.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                admin.role === "SUPER_ADMIN"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Manager"}
              </span>
              {/* Prevent deleting yourself */}
              {admin.email !== adminData?.email && (
                <button
                  onClick={() => setConfirmDelete(admin)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Remove Account</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-red-600">{confirmDelete.email}</span> from the whitelist?
              They will lose all admin access immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleRemoveAdmin(confirmDelete.adminId, confirmDelete.email)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;
