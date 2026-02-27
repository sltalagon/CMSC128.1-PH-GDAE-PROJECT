import { useState } from "react";
import { Database, Activity, Link, BookOpen, Plus } from "lucide-react";
import { AddGeneForm } from "./AddGeneForm";
import { AddDiseaseForm } from "./AddDiseaseForm";
import { AddAssociationForm } from "./AddAssociationForm";
import { AddReferenceForm } from "./AddReferenceForm";

const AdminPanel = () => {
  const [activeForm, setActiveForm] = useState(null);

  const cards = [
    {
      title: "Add Gene",
      icon: Database,
      color: "blue",
      form: "gene",
      desc: "Register a new gene with its information",
    },
    {
      title: "Add Disease",
      icon: Activity,
      color: "green",
      form: "disease",
      desc: "Register a new disease with Philippine prevalence data",
    },
    {
      title: "Add Gene-Disease Association",
      icon: Link,
      color: "purple",
      form: "association",
      desc: "Link genes to diseases with association type",
    },
    {
      title: "Add Reference",
      icon: BookOpen,
      color: "orange",
      form: "reference",
      desc: "Add supporting research references",
    },
  ];

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
        {cards.map(({ title, icon: Icon, color, form, desc }) => (
          <div
            key={form}
            className={`bg-${color}-50 p-6 rounded-xl border border-${color}-100 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group`}
            onClick={() => setActiveForm(form)}
            role="button"
            aria-label={title}
          >
            <div
              className={`bg-white p-3 rounded-lg shadow-sm text-${color}-600 group-hover:scale-110 transition-transform`}
            >
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {title} <Plus size={16} className="text-slate-400" />
              </h3>
              <p className="text-slate-600 text-sm mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Forms */}
      {activeForm === "gene" && (
        <AddGeneForm onClose={() => setActiveForm(null)} />
      )}
      {activeForm === "disease" && (
        <AddDiseaseForm onClose={() => setActiveForm(null)} />
      )}
      {activeForm === "association" && (
        <AddAssociationForm onClose={() => setActiveForm(null)} />
      )}
      {activeForm === "reference" && (
        <AddReferenceForm onClose={() => setActiveForm(null)} />
      )}

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
