import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Activity, Link, Plus, Tag } from "lucide-react";

import { apiGet } from "../../api/api";

import { AddGeneForm } from "./AddGeneForm";
import { AddDiseaseForm } from "./AddDiseaseForm";
import { AddAssociationForm } from "./AddAssociationForm";
import { AddFunctionalCategoryForm } from "./AddFunctionalCategoryForm";
import { AddGeneCategoryForm } from "./AddGeneCategoryForm";

const AdminPanel = () => {
  const [activeView, setActiveView] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiGet("/admin/me")
      .then((data) => {
        setAdminData(data);
        setIsLoading(false);
      })
      .catch(() => {
        navigate("/admin/login");
      });
  }, [navigate]);

  const cards = [
    {
      title: "Add Gene",
      icon: Database,
      colors: {
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-600",
      },
      view: "add-gene",
      desc: "Register a new gene with its information",
    },
    {
      title: "Add Disease",
      icon: Activity,
      colors: {
        bg: "bg-green-50",
        border: "border-green-100",
        text: "text-green-600",
      },
      view: "add-disease",
      desc: "Register a new disease with Philippine prevalence data",
    },
    {
      title: "Add Gene-Disease Association",
      icon: Link,
      colors: {
        bg: "bg-purple-50",
        border: "border-purple-100",
        text: "text-purple-600",
      },
      view: "add-association",
      desc: "Link genes to diseases with association type",
    },
    {
      title: "Add Functional Category",
      icon: Tag,
      colors: {
        bg: "bg-orange-50",
        border: "border-orange-100",
        text: "text-orange-600",
      },
      view: "add-functional-category",
      desc: "Register a new gene functional category",
    },
    {
      title: "Add Gene–Category",
      icon: Tag,
      colors: {
        bg: "bg-yellow-50",
        border: "border-yellow-100",
        text: "text-yellow-600",
      },
      view: "add-gene-category",
      desc: "Link a gene to a functional category",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg font-medium text-slate-500 animate-pulse">
          Verifying secure session...
        </div>
      </div>
    );
  }

  const handleCloseView = () => setActiveView(null);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
          <p className="text-slate-600">
            Manage and explore genes, diseases, associations, and research
            references.
          </p>
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
              <p className="text-sm font-bold text-slate-900">
                {adminData.name}
              </p>
              <p className="text-xs text-slate-500">{adminData.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map(({ title, icon: Icon, colors, view, desc }) => (
          <div
            key={view}
            className={`${colors.bg} p-6 rounded-xl border ${colors.border} hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group ${activeView === view ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
            onClick={() => setActiveView(activeView === view ? null : view)}
            role="button"
          >
            <div
              className={`bg-white p-3 rounded-lg shadow-sm ${colors.text} group-hover:scale-110 transition-transform`}
            >
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {title}
                {view.startsWith("add") && (
                  <Plus size={16} className="text-slate-400" />
                )}
              </h3>
              <p className="text-slate-600 text-sm mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          POPUP MODALS (ONLY FOR THE ADD FORMS) 
          ========================================= */}
      {activeView && activeView.startsWith("add") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              {activeView === "add-gene" && (
                <AddGeneForm onClose={handleCloseView} />
              )}
              {activeView === "add-disease" && (
                <AddDiseaseForm onClose={handleCloseView} />
              )}
              {activeView === "add-association" && (
                <AddAssociationForm onClose={handleCloseView} />
              )}
              {activeView === "add-functional-category" && (
                <AddFunctionalCategoryForm onClose={handleCloseView} />
              )}
              {activeView === "add-gene-category" && (
                <AddGeneCategoryForm onClose={handleCloseView} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
