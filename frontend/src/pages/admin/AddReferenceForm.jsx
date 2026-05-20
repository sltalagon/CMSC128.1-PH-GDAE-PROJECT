import { useState, useEffect } from "react";
import { BookOpen, Loader2, Check, X } from "lucide-react";
import { apiGet, apiPost, apiPostPublic } from "../../api/api";

export const AddReferenceForm = ({ onClose, onCancel, onSuccess, mode = "admin", suggestionMeta = {} }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ title: "", url: "", description: "", geneDiseaseId: "" });
  const [associations, setAssociations] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    apiGet("/genedisease")
      .then(data => setAssociations(data))
      .catch(err => console.error("Failed to fetch associations", err))
      .finally(() => setLoadingLists(false));
  }, []);

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); 
    setError(null);
    try {
      if (mode === "suggestion") {
        // Use the public post so Spring Security ignores it!
        await apiPostPublic("/suggestions", {
          suggestionType: "REFERENCE",
          submitterName: suggestionMeta.submitterName,
          submitterEmail: suggestionMeta.submitterEmail,
          referenceUrl: suggestionMeta.referenceUrl,
          content: JSON.stringify(data),
        });
        if (onSuccess) onSuccess();
      } else {
        // Standard Admin Save
        let referenceIdToLink = null;
        try {
          const savedRef = await apiPost("/references", { title: data.title, url: data.url, description: data.description });
          referenceIdToLink = savedRef.referenceId;
        } catch (refErr) {
          // Extract error messaging from any common API response layout or status strings
          const errorString = (
            refErr.response?.data?.message || 
            refErr.data?.message || 
            refErr.message || 
            ""
          ).toLowerCase();

          // FIX: Added '400' detection to catch the IllegalArgumentException response status
          if (errorString.includes("exists") || errorString.includes("409") || errorString.includes("400")) {
            throw new Error("This URL already exists in the database. Please search for the existing reference to link it.");
          } else {
            throw refErr;
          }
        }

        if (data.geneDiseaseId && referenceIdToLink) {
          try {
            await apiPost(`/references/genedisease/${data.geneDiseaseId}/${referenceIdToLink}`);
          } catch (linkErr) {
            if (!linkErr.message?.includes("already linked")) throw new Error("Saved, but failed to link.");
          }
        }
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to process reference. Please try again.");
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="bg-white border-2 border-teal-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-100"><BookOpen className="w-6 h-6 text-teal-600" /></div>
          <h3 className="text-xl font-bold text-gray-900">Add Reference</h3>
        </div>
        {(onClose || onCancel) && (
          <button onClick={onClose || onCancel} className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Reference Title <span className="text-red-500">*</span></label>
          <input type="text" value={data.title} onChange={set("title")} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">URL <span className="text-red-500">*</span></label>
          <input type="url" value={data.url} onChange={set("url")} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea rows={3} value={data.description} onChange={set("description")} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 resize-none" />
        </div>
        
        <div className="border-t border-teal-100 pt-4 mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Link to Association (Optional)</label>
          <select value={data.geneDiseaseId} onChange={set("geneDiseaseId")} disabled={loadingLists} className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 disabled:bg-gray-50">
            <option value="">-- No Association (Save as Standalone) --</option>
            {associations.map((a) => (
              <option key={a.geneDiseaseId} value={a.geneDiseaseId}>
                {a.gene?.geneSymbol} - {a.disease?.diseaseName} ({a.associationType})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold disabled:opacity-50 transition-colors">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {mode === "suggestion" ? "Submit Suggestion" : "Save Changes"}
          </button>
          <button onClick={onCancel || onClose} disabled={saving} className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors disabled:opacity-50">Cancel</button>
        </div>
      </div>
    </div>
  );
};