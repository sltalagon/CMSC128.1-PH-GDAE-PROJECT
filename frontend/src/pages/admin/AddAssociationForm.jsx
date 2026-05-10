import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../api/api";
import { X, Check, Link, Plus, Trash2 } from "lucide-react";

export function AddAssociationForm({ onClose, onCancel, onSuccess, mode = "admin", suggestionMeta = null }) {
  const [formData, setFormData] = useState({
    geneId: "",
    diseaseId: "",
    associationType: "PREDISPOSITION",
    // Replaced single citation with an array of references
    references: [{ title: "", url: "", description: "" }], 
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

  // --- Dynamic Reference Handlers ---
  const handleAddReference = () => {
    setFormData({
      ...formData,
      references: [...formData.references, { title: "", url: "", description: "" }],
    });
  };

  const handleReferenceChange = (index, field, value) => {
    const updatedRefs = [...formData.references];
    updatedRefs[index][field] = value;
    setFormData({ ...formData, references: updatedRefs });
  };

  const handleRemoveReference = (index) => {
    const updatedRefs = formData.references.filter((_, i) => i !== index);
    setFormData({ ...formData, references: updatedRefs });
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate references
      const validReferences = formData.references.filter(ref => ref.title.trim() !== "" && ref.url.trim() !== "");
      
      if (validReferences.length === 0) {
        throw new Error("Please provide at least one valid reference with a Title and URL.");
      }

      if (mode === "suggestion") {
        await apiPost("/suggestions", {
          submitterName: suggestionMeta.submitterName,
          submitterEmail: suggestionMeta.submitterEmail,
          suggestionType: "ASSOCIATION",
          content: JSON.stringify({ ...formData, references: validReferences }),
          referenceUrl: suggestionMeta.referenceUrl || validReferences[0].url,
        });
      } else {
        // 1. Create the Gene-Disease Association
        const savedAssociation = await apiPost("/genedisease", {
          gene: { geneId: formData.geneId },
          disease: { diseaseId: formData.diseaseId },
          associationType: formData.associationType,
          citationUrl: validReferences[0].url, 
          citationDescription: validReferences[0].description,
        });

        // FIX: Check multiple possible ID field names based on your backend entity
        const newGdId = savedAssociation?.id || savedAssociation?.geneDiseaseId; 

        if (!newGdId) {
          throw new Error("Association created, but backend did not return an ID. Check your /genedisease POST API.");
        }

        // 2. Process and Link References to the Database
        for (const ref of validReferences) {
          let referenceIdToLink = null;

          try {
            // Attempt to save the reference to the Database
            const savedRef = await apiPost("/references", ref);
            referenceIdToLink = savedRef.referenceId;
            
          } catch (refErr) {
            // If URL already exists (usually a 409 Conflict), fetch it to get its ID
            const errorMessage = (refErr.message || "").toLowerCase();
            
            if (errorMessage.includes("exists") || errorMessage.includes("409")) {
              const allRefs = await apiGet("/references");
              const existingRef = allRefs.find((r) => r.url === ref.url);
              
              if (existingRef) {
                referenceIdToLink = existingRef.referenceId;
              } else {
                throw new Error(`Database said URL exists, but couldn't find it: ${ref.url}`);
              }
            } else {
              // STOP THE FORM IF IT FAILS
              throw new Error(`Failed to save reference: ${refErr.message || "Unknown Error"}`);
            }
          }

          // 3. Link the reference to the gene-disease association
          if (referenceIdToLink) {
            try {
              await apiPost(`/references/genedisease/${newGdId}/${referenceIdToLink}`);
            } catch (linkErr) {
              // STOP THE FORM IF LINKING FAILS
              throw new Error(`Failed to link reference to disease: ${linkErr.message || "Unknown Error"}`);
            }
          } else {
            throw new Error("Reference was saved, but its ID was missing.");
          }
        }
      }
      
      // Only close if we make it through the whole loop without throwing an error!
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white border-2 border-purple-200 rounded-xl p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-start justify-between mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
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
          type="button"
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
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Gene & Disease Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Gene <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.geneId}
                onChange={(e) => setFormData({ ...formData, geneId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white"
              >
                <option value="">Choose a gene...</option>
                {genes.map((gene) => (
                  <option key={gene.geneId} value={gene.geneId}>
                    {gene.geneSymbol} - {gene.fullGeneName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Disease <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.diseaseId}
                onChange={(e) => setFormData({ ...formData, diseaseId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white"
              >
                <option value="">Choose a disease...</option>
                {diseases.map((disease) => (
                  <option key={disease.diseaseId} value={disease.diseaseId}>
                    {disease.diseaseName}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none bg-white"
            >
              <option value="PREDISPOSITION">Predisposition (increases disease risk)</option>
              <option value="DRIVER">Driver (actively drives disease development)</option>
              <option value="SOMATIC">Somatic (acquired mutation, not inherited)</option>
              <option value="GERMLINE">Germline (inherited mutation)</option>
            </select>
          </div>

          <hr className="border-gray-200" />

          {/* Dynamic References Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Supporting References <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddReference}
                className="text-sm flex items-center gap-1 text-purple-600 hover:text-purple-800 font-semibold bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={16} /> Add Reference URL
              </button>
            </div>

            <div className="space-y-4">
              {formData.references.map((ref, index) => (
                <div key={index} className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl relative">
                  {/* Remove Button */}
                  {formData.references.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReference(index)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                      title="Remove Reference"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  
                  <div className="space-y-3 pr-8">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Reference Title (e.g., Study on Gene X)"
                        value={ref.title}
                        onChange={(e) => handleReferenceChange(index, "title", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        required
                        placeholder="URL (https://...)"
                        value={ref.url}
                        onChange={(e) => handleReferenceChange(index, "url", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={2}
                        placeholder="Brief description of findings (Optional)"
                        value={ref.description}
                        onChange={(e) => handleReferenceChange(index, "description", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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