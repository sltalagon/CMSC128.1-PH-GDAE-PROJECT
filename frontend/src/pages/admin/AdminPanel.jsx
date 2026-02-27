import { Database, Activity, Link, BookOpen, Plus } from "lucide-react";

const AdminPanel = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Panel</h2>
        <p className="text-slate-600">
          Manage genes, diseases, associations, and research references.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Gene Card */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group">
          <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Add Gene <Plus size={16} className="text-slate-400" />
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Register a new gene with its information
            </p>
          </div>
        </div>

        {/* Add Disease Card */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group">
          <div className="bg-white p-3 rounded-lg shadow-sm text-green-600 group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Add Disease <Plus size={16} className="text-slate-400" />
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Register a new disease with Philippine prevalence data
            </p>
          </div>
        </div>

        {/* Add Association Card */}
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group">
          <div className="bg-white p-3 rounded-lg shadow-sm text-purple-600 group-hover:scale-110 transition-transform">
            <Link size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Add Gene-Disease Association{" "}
              <Plus size={16} className="text-slate-400" />
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Link genes to diseases with association type
            </p>
          </div>
        </div>

        {/* Add Reference Card */}
        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group">
          <div className="bg-white p-3 rounded-lg shadow-sm text-orange-600 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Add Reference <Plus size={16} className="text-slate-400" />
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Add supporting research references
            </p>
          </div>
        </div>
      </div>

      {/* Warning/Note Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>Note:</strong> This is a demonstration with mock data. In
        production, these forms would save data to a database. Currently,
        submissions will be displayed but not persisted.
      </div>
    </div>
  );
};

export default AdminPanel;
