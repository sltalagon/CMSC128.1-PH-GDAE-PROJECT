import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../api/api";
import { X, Check, Link } from "lucide-react";


export function AddAssociationForm({ onClose }) {
  const [formData, setFormData] = useState({
    geneId: "",
    diseaseId: "",
    associationType: "PREDISPOSITION",
    citationUrl: "",
    citationDescription: "",
  });

  const [genes, setGenes] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genesData, diseasesData] = await Promise.all([
          apiGet("/genes"),
          apiGet("/diseases"),
        ]);

        setGenes(genesData);
        setDiseases(diseasesData);
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
      await apiPost("/genedisease", {
        gene: { geneId: formData.geneId },
        disease: { diseaseId: formData.diseaseId },
        associationType: formData.associationType,
        citationUrl: formData.citationUrl,
        citationDescription: formData.citationDescription,
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Link className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Add Gene-Disease Association
            </h3>
            <p className="text-sm text-gray-600">
              Link a gene to a disease with association details
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
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="">Choose a gene...</option>
              {genes.map((gene) => (
                <option key={gene.geneId} value={gene.geneId}>
                  {gene.geneSymbol} - {gene.fullGeneName}
                </option>
              ))}
            </select>
          </div>

          {/* Disease Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Disease <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.diseaseId}
              onChange={(e) => setFormData({ ...formData, diseaseId: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="">Choose a disease...</option>
              {diseases.map((disease) => (
                <option key={disease.diseaseId} value={disease.diseaseId}>
                  {disease.diseaseName} ({disease.diseaseCategory})
                </option>
              ))}
            </select>
          </div>

          {/* Association Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Association Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.associationType}
              onChange={(e) => setFormData({ ...formData, associationType: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="PREDISPOSITION">Predisposition (increases disease risk)</option>
              <option value="DRIVER">Driver (actively drives disease development)</option>
              <option value="SOMATIC">Somatic (acquired mutation, not inherited)</option>
              <option value="GERMLINE">Germline (inherited mutation)</option>
            </select>
          </div>

          {/* Citation URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Citation URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
              value={formData.citationUrl}
              onChange={(e) => setFormData({ ...formData, citationUrl: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Citation Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Citation Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of the supporting evidence..."
              value={formData.citationDescription}
              onChange={(e) => setFormData({ ...formData, citationDescription: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900">
              <span className="font-semibold">Note:</span> The Citation URL is
              required as supporting evidence for the gene-disease association.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              {submitting ? "Saving..." : "Create Association"}
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
      )}
    </div>
  );
}