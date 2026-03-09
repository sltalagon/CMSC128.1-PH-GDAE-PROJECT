import React, { useState } from "react";
import { apiGet, apiPost } from "../../api/api";
import { X, Check, Activity } from "lucide-react";


export function AddDiseaseForm({ onClose }) {
  const [formData, setFormData] = useState({
    diseaseName: "",
    diseaseCategory: "",
    inheritancePattern: "",
    omimId: "",
    phPrevalence: "MEDIUM",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await apiPost("/diseases", {
        diseaseName: formData.diseaseName,
        diseaseCategory: formData.diseaseCategory,
        inheritancePattern: formData.inheritancePattern,
        omimId: formData.omimId ? parseFloat(formData.omimId) : null,
        phPrevalence: formData.phPrevalence,
        description: formData.description,
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Disease Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.diseaseName}
            onChange={(e) => setFormData({ ...formData, diseaseName: e.target.value })}
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
              value={formData.diseaseCategory}
              onChange={(e) => setFormData({ ...formData, diseaseCategory: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="METABOLIC">Metabolic</option>
              <option value="NEUROLOGICAL">Neurological</option>
              <option value="NEUROMUSCULAR">Neuromuscular</option>
              <option value="CANCER">Cancer</option>
              <option value="HEMATOLOGIC">Hematologic</option>
              <option value="SENSORY_DISORDERS">Sensory Disorders</option>
              <option value="DERMATOLOGICAL">Dermatological</option>
              <option value="CARDIOVASCULAR">Cardiovascular</option>
              <option value="RENAL">Renal</option>
              <option value="SYNDROMIC">Syndromic</option>
              <option value="ETC">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Philippine Prevalence <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.phPrevalence}
              onChange={(e) => setFormData({ ...formData, phPrevalence: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="NONE">None</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Inheritance Pattern <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.inheritancePattern}
            onChange={(e) => setFormData({ ...formData, inheritancePattern: e.target.value })}
            placeholder="e.g., Autosomal Dominant, Autosomal Recessive, X-Linked"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            OMIM ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            value={formData.omimId}
            onChange={(e) => setFormData({ ...formData, omimId: e.target.value })}
            placeholder="e.g., 125853"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the disease, its characteristics, and impact..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            {submitting ? "Saving..." : "Add Disease"}
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