import React, { useState } from "react";
import { X, Check, Database, AlertTriangle } from "lucide-react";
import { apiPost } from "../../api/api"; 

export function AddGeneForm({ onClose, onCancel, mode = "admin", suggestionMeta = null }) {
  const [formData, setFormData] = useState({
    geneSymbol: "",
    fullGeneName: "",
    geneType: "PROTEIN_CODING",
    omimId: "",
    ncbiId: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [duplicate, setDuplicate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setDuplicate(false);

    try {
      if (mode === "suggestion") {
        await apiPost("/suggestions", {
          submitterName: suggestionMeta.submitterName,
          submitterEmail: suggestionMeta.submitterEmail,
          suggestionType: "GENE",
          content: JSON.stringify(formData),
          referenceUrl: suggestionMeta.referenceUrl,
        });
      } else {
        await apiPost("/genes", {
          geneSymbol: formData.geneSymbol,
          fullGeneName: formData.fullGeneName,
          geneType: formData.geneType,
          omimId: formData.omimId ? parseInt(formData.omimId, 10) : null,
          ncbiId: formData.ncbiId || null,
          description: formData.description,
        });
      }

      onClose();
    } catch (err) {
      if (err.message.includes("409")) {
        setDuplicate(true);
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add New Gene</h3>
            <p className="text-sm text-gray-600">
              Register a new gene in the database
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

      {/* Duplicate warning — yellow */}
      {duplicate && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          This gene already exists in the database.
        </div>
      )}

      {/* General error — red */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gene Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.geneSymbol}
              onChange={(e) =>
                setFormData({ ...formData, geneSymbol: e.target.value })
              }
              placeholder="e.g., BRCA1"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gene Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.geneType}
              onChange={(e) =>
                setFormData({ ...formData, geneType: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="PROTEIN_CODING">Protein-Coding</option>
              <option value="NON_CODING">Non-Coding</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Gene Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.fullGeneName}
            onChange={(e) =>
              setFormData({ ...formData, fullGeneName: e.target.value })
            }
            placeholder="e.g., Breast Cancer Type 1 Susceptibility Protein"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            OMIM ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min="100000"
            max="999999"
            value={formData.omimId}
            onChange={(e) => setFormData({ ...formData, omimId: e.target.value })}
            placeholder="e.g., 113705 (6-digit number)"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">Must be a valid 6-digit OMIM identifier.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            NCBI Gene ID
          </label>
          <input
            type="text"
            value={formData.ncbiId}
            onChange={(e) => setFormData({ ...formData, ncbiId: e.target.value })}
            placeholder="e.g., NM_0012345.1"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the gene and its characteristics..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            {submitting ? "Saving..." : mode === "suggestion" ? "Submit Suggestion" : "Add Gene"}
          </button>
          <button
            type="button"
            onClick={onCancel ?? onClose}
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
