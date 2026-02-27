import React, { useState } from "react";
import { X, Check, Activity, Plus, Trash2 } from "lucide-react";

export function AddDiseaseForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    prevalenceInPH: "Moderate",
    omimId: "",
  });

  const [symptoms, setSymptoms] = useState([""]);

  const addSymptom = () => {
    setSymptoms([...symptoms, ""]);
  };

  const removeSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const updateSymptom = (index, value) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredSymptoms = symptoms.filter((s) => s.trim() !== "");

    // In production, this would save to database
    console.log("Submitting disease:", {
      ...formData,
      symptoms: filteredSymptoms,
    });

    toast.success(`Disease "${formData.name}" added successfully!`, {
      description: "The disease has been registered in the system.",
    });

    onClose();
  };

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Disease</h3>
            <p className="text-sm text-gray-600">
              Register a new disease with Philippine data
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Disease Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Type 2 Diabetes Mellitus"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="Metabolic Disorder">Metabolic Disorder</option>
              <option value="Cardiovascular Disease">
                Cardiovascular Disease
              </option>
              <option value="Cancer">Cancer</option>
              <option value="Genetic Blood Disorder">
                Genetic Blood Disorder
              </option>
              <option value="Infectious Disease">Infectious Disease</option>
              <option value="Neurological Disorder">
                Neurological Disorder
              </option>
              <option value="Autoimmune Disease">Autoimmune Disease</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Philippine Prevalence <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.prevalenceInPH}
              onChange={(e) =>
                setFormData({ ...formData, prevalenceInPH: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the disease, its characteristics, and impact..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Common Symptoms
            </label>
            <button
              type="button"
              onClick={addSymptom}
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Symptom
            </button>
          </div>
          <div className="space-y-2">
            {symptoms.map((symptom, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={symptom}
                  onChange={(e) => updateSymptom(index, e.target.value)}
                  placeholder="Enter a symptom"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                />
                {symptoms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSymptom(index)}
                    className="px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            OMIM ID (Optional)
          </label>
          <input
            type="text"
            value={formData.omimId}
            onChange={(e) =>
              setFormData({ ...formData, omimId: e.target.value })
            }
            placeholder="e.g., 125853"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Check className="w-5 h-5" />
            Add Disease
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
