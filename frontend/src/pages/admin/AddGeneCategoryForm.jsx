import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../api/api";
import { X, Check, Tag } from "lucide-react";

export function AddGeneCategoryForm({ onClose, onCancel, mode = "admin", suggestionMeta = null }) {
  const [formData, setFormData] = useState({
    geneId: "",
    categoryId: "",
  });

  const [genes, setGenes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genesData, categoriesData] = await Promise.all([
          apiGet("/genes"),
          apiGet("/functional_categories"),
        ]);
        setGenes(genesData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (mode === "suggestion") {
        await fetch("http://localhost:8080/api/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submitterName: suggestionMeta.submitterName,
            submitterEmail: suggestionMeta.submitterEmail,
            suggestionType: "GENE_CATEGORY",
            content: JSON.stringify(formData),
            referenceUrl: suggestionMeta.referenceUrl,
          }),
        });
      } else {
        await apiPost("/gene-categories", {
          gene: { geneId: formData.geneId },
          functionalCategory: { categoryId: formData.categoryId },
        });
      }
      onClose();
    } 
    catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
  };

  return (
    <div className="bg-white border-2 border-yellow-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Tag className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Add Gene–Category Association</h3>
            <p className="text-sm text-gray-600">Link a gene to a functional category</p>
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

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading data...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Gene Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Gene <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.geneId}
              onChange={(e) => setFormData({ ...formData, geneId: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none"
            >
              <option value="">Choose a gene...</option>
              {genes.map((gene) => (
                <option key={gene.geneId} value={gene.geneId}>
                  {gene.geneSymbol} - {gene.fullGeneName}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Functional Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none"
            >
              <option value="">Choose a category...</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <span className="font-semibold">Note:</span> Each gene can belong
              to multiple functional categories. Make sure the association
              doesn't already exist before submitting.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              {submitting ? "Saving..." : mode === "suggestion" ? "Submit Suggestion" : "Create Association"}
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
      )}
    </div>
  );
}