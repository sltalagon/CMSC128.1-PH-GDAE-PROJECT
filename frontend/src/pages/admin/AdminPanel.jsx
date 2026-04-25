import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Database, Activity, Link, Plus, Tag,
  Pencil, Trash2, X, AlertTriangle, Loader2, Check,
} from "lucide-react";

import { apiGet, apiPut, apiDelete } from "../../api/api";

import { AddGeneForm } from "./AddGeneForm";
import { AddDiseaseForm } from "./AddDiseaseForm";
import { AddAssociationForm } from "./AddAssociationForm";
import { AddFunctionalCategoryForm } from "./AddFunctionalCategoryForm";
import { AddGeneCategoryForm } from "./AddGeneCategoryForm";

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------

const FormHeader = ({ title, icon: Icon, colorClass, onClose }) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colorClass.iconBg}`}>
        <Icon className={`w-6 h-6 ${colorClass.iconText}`} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

const ErrorBanner = ({ message }) =>
  message ? (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      {message}
    </div>
  ) : null;

const SuccessBanner = ({ message }) =>
  message ? (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
      <Check className="w-4 h-4 shrink-0" />
      {message}
    </div>
  ) : null;

const EntityLookupDropdown = ({ endpoint, idField, labelFn, placeholder, onLoad, isLoading, initialId }) => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(initialId || "");
  const [loadingList, setLoadingList] = useState(true);
  const autoLoadTriggered = useRef(false);

  useEffect(() => {
    apiGet(endpoint)
      .then((data) => {
        const fetchedItems = Array.isArray(data) ? data : [];
        setItems(fetchedItems);

        // Auto-load if we were passed an initial ID from the search page
        if (initialId && !autoLoadTriggered.current) {
          setSelectedId(initialId);
          onLoad(initialId);
          autoLoadTriggered.current = true; // Ensure it only fires once
        }
      })
      .catch((err) => console.error(`Failed to load items from ${endpoint}`, err))
      .finally(() => setLoadingList(false));
  }, [endpoint]);

  return (
    <div className="flex gap-2 mb-6">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        disabled={loadingList}
        className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white disabled:bg-gray-50"
      >
        <option value="">{loadingList ? "Loading records..." : placeholder}</option>
        {items.map((item) => (
          <option key={item[idField]} value={item[idField]}>
            {labelFn(item)}
          </option>
        ))}
      </select>
      <button
        onClick={() => onLoad(selectedId)}
        disabled={isLoading || !selectedId}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && <Loader2 size={14} className="animate-spin" />}
        Load
      </button>
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = (focus) =>
  `w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none ${focus}`;

const SaveCancelBar = ({ onSave, saving, onClose, saveColor = "bg-blue-600 hover:bg-blue-700" }) => (
  <div className="flex gap-3 pt-4">
    <button
      onClick={onSave}
      disabled={saving}
      className={`flex-1 ${saveColor} text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {saving && <Loader2 size={16} className="animate-spin" />}
      {saving ? "Saving..." : "Save Changes"}
    </button>
    <button
      onClick={onClose}
      className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
    >
      Cancel
    </button>
  </div>
);

// ---------------------------------------------------------------------------
// EDIT: Gene
// ---------------------------------------------------------------------------
const EditGeneForm = ({ onClose, initialId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLoad = async (id) => {
    setLoading(true); setError(null); setSuccess(null); setData(null);
    try {
      setData(await apiGet(`/genes/${id}`));
    } catch {
      setError(`No gene found with ID "${id}".`);
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await apiPut(`/genes/${data.geneId}`, {
        geneSymbol: data.geneSymbol,
        fullGeneName: data.fullGeneName,
        geneType: data.geneType,
        omimId: data.omimId ? parseInt(data.omimId, 10) : null,
        ncbiId: data.ncbiId || null,
        description: data.description,
      });
      setSuccess("Gene updated successfully.");
    } catch {
      setError("Failed to update gene. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
      <FormHeader title="Edit Gene" icon={Database} colorClass={{ iconBg: "bg-blue-100", iconText: "text-blue-600" }} onClose={onClose} />
      <EntityLookupDropdown 
        endpoint="/genes" 
        idField="geneId" 
        labelFn={(g) => `${g.geneId} - ${g.geneSymbol} (${g.fullGeneName})`} 
        placeholder="Select a Gene to edit..." 
        onLoad={handleLoad} 
        isLoading={loading} 
        initialId={initialId}
      />
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />
      {data && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Gene Symbol" required>
              <input type="text" value={data.geneSymbol ?? ""} onChange={set("geneSymbol")} placeholder="e.g., BRCA1" className={inputCls("focus:border-blue-500")} />
            </Field>
            <Field label="Gene Type" required>
              <select value={data.geneType ?? "PROTEIN_CODING"} onChange={set("geneType")} className={inputCls("focus:border-blue-500")}>
                <option value="PROTEIN_CODING">Protein-Coding</option>
                <option value="NON_CODING">Non-Coding</option>
              </select>
            </Field>
          </div>
          <Field label="Full Gene Name" required>
            <input type="text" value={data.fullGeneName ?? ""} onChange={set("fullGeneName")} placeholder="e.g., Breast Cancer Type 1 Susceptibility Protein" className={inputCls("focus:border-blue-500")} />
          </Field>
          <Field label="OMIM ID" required>
            <input type="number" value={data.omimId ?? ""} onChange={set("omimId")} min="100000" max="999999" placeholder="e.g., 113705" className={inputCls("focus:border-blue-500")} />
            <p className="mt-1 text-xs text-gray-500">Must be a valid 6-digit OMIM identifier.</p>
          </Field>
          <Field label="NCBI Gene ID">
            <input type="text" value={data.ncbiId ?? ""} onChange={set("ncbiId")} placeholder="e.g., NM_0012345.1" className={inputCls("focus:border-blue-500")} />
          </Field>
          <Field label="Description">
            <textarea rows={3} value={data.description ?? ""} onChange={set("description")} placeholder="Describe the gene and its characteristics..." className={`${inputCls("focus:border-blue-500")} resize-none`} />
          </Field>
          <SaveCancelBar onSave={handleSave} saving={saving} onClose={onClose} saveColor="bg-blue-600 hover:bg-blue-700" />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EDIT: Disease
// ---------------------------------------------------------------------------
const EditDiseaseForm = ({ onClose, initialId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLoad = async (id) => {
    setLoading(true); setError(null); setSuccess(null); setData(null);
    try {
      setData(await apiGet(`/diseases/${id}`));
    } catch {
      setError(`No disease found with ID "${id}".`);
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await apiPut(`/diseases/${data.diseaseId}`, {
        diseaseName: data.diseaseName,
        diseaseCategory: data.diseaseCategory,
        inheritancePattern: data.inheritancePattern,
        omimId: data.omimId ? parseInt(data.omimId, 10) : null,
        phPrevalence: data.phPrevalence,
        description: data.description,
      });
      setSuccess("Disease updated successfully.");
    } catch {
      setError("Failed to update disease. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl p-6">
      <FormHeader title="Edit Disease" icon={Activity} colorClass={{ iconBg: "bg-green-100", iconText: "text-green-600" }} onClose={onClose} />
      <EntityLookupDropdown 
        endpoint="/diseases" 
        idField="diseaseId" 
        labelFn={(d) => `${d.diseaseId} - ${d.diseaseName}`} 
        placeholder="Select a Disease to edit..." 
        onLoad={handleLoad} 
        isLoading={loading} 
        initialId={initialId}
      />
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />
      {data && (
        <div className="space-y-4">
          <Field label="Disease Name" required>
            <input type="text" value={data.diseaseName ?? ""} onChange={set("diseaseName")} placeholder="e.g., Type 2 Diabetes Mellitus" className={inputCls("focus:border-green-500")} />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select value={data.diseaseCategory ?? ""} onChange={set("diseaseCategory")} className={inputCls("focus:border-green-500")}>
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
            </Field>
            <Field label="Philippine Prevalence" required>
              <select value={data.phPrevalence ?? "MEDIUM"} onChange={set("phPrevalence")} className={inputCls("focus:border-green-500")}>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="NONE">None</option>
              </select>
            </Field>
          </div>
          <Field label="Inheritance Pattern" required>
            <input type="text" value={data.inheritancePattern ?? ""} onChange={set("inheritancePattern")} placeholder="e.g., Autosomal Dominant, Autosomal Recessive, X-Linked" className={inputCls("focus:border-green-500")} />
          </Field>
          <Field label="OMIM ID" required>
            <input type="number" value={data.omimId ?? ""} onChange={set("omimId")} placeholder="e.g., 125853" className={inputCls("focus:border-green-500")} />
          </Field>
          <Field label="Description" required>
            <textarea rows={3} value={data.description ?? ""} onChange={set("description")} placeholder="Describe the disease, its characteristics, and impact..." className={`${inputCls("focus:border-green-500")} resize-none`} />
          </Field>
          <SaveCancelBar onSave={handleSave} saving={saving} onClose={onClose} saveColor="bg-green-600 hover:bg-green-700" />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EDIT: Association
// ---------------------------------------------------------------------------
const EditAssociationForm = ({ onClose, initialId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [genes, setGenes] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    Promise.all([apiGet("/genes"), apiGet("/diseases")])
      .then(([g, d]) => { setGenes(g); setDiseases(d); })
      .catch(() => setError("Failed to load genes/diseases list."))
      .finally(() => setListsLoading(false));
  }, []);

  const handleLoad = async (id) => {
    setLoading(true); setError(null); setSuccess(null); setData(null);
    try {
      setData(await apiGet(`/genedisease/${id}`));
    } catch {
      setError(`No association found with ID "${id}".`);
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await apiPut(`/genedisease/${data.geneDiseaseId}`, {
        gene: { geneId: data.geneId },
        disease: { diseaseId: data.diseaseId },
        associationType: data.associationType,
        citationUrl: data.citationUrl,
        citationDescription: data.citationDescription,
      });
      setSuccess("Association updated successfully.");
    } catch {
      setError("Failed to update association. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
      <FormHeader title="Edit Gene-Disease Association" icon={Link} colorClass={{ iconBg: "bg-purple-100", iconText: "text-purple-600" }} onClose={onClose} />
      {listsLoading ? (
        <div className="text-center py-6 text-gray-500 text-sm">Loading genes and diseases...</div>
      ) : (
        <>
          <EntityLookupDropdown 
            endpoint="/genedisease" 
            idField="geneDiseaseId" 
            labelFn={(a) => `${a.geneDiseaseId} - Gene: ${a.gene?.geneSymbol || 'Unknown'} | Disease: ${a.disease?.diseaseName || 'Unknown'}`} 
            placeholder="Select an Association to edit..." 
            onLoad={handleLoad} 
            isLoading={loading} 
            initialId={initialId}
          />
          <ErrorBanner message={error} />
          <SuccessBanner message={success} />
          {data && (
            <div className="space-y-4">
              <Field label="Select Gene" required>
                <select value={data.geneId ?? ""} onChange={set("geneId")} className={inputCls("focus:border-purple-500")}>
                  <option value="">Choose a gene...</option>
                  {genes.map((g) => (
                    <option key={g.geneId} value={g.geneId}>{g.geneSymbol} - {g.fullGeneName}</option>
                  ))}
                </select>
              </Field>
              <Field label="Select Disease" required>
                <select value={data.diseaseId ?? ""} onChange={set("diseaseId")} className={inputCls("focus:border-purple-500")}>
                  <option value="">Choose a disease...</option>
                  {diseases.map((d) => (
                    <option key={d.diseaseId} value={d.diseaseId}>{d.diseaseName} ({d.diseaseCategory})</option>
                  ))}
                </select>
              </Field>
              <Field label="Association Type" required>
                <select value={data.associationType ?? "PREDISPOSITION"} onChange={set("associationType")} className={inputCls("focus:border-purple-500")}>
                  <option value="PREDISPOSITION">Predisposition (increases disease risk)</option>
                  <option value="DRIVER">Driver (actively drives disease development)</option>
                  <option value="SOMATIC">Somatic (acquired mutation, not inherited)</option>
                  <option value="GERMLINE">Germline (inherited mutation)</option>
                </select>
              </Field>
              <Field label="Citation URL" required>
                <input type="url" value={data.citationUrl ?? ""} onChange={set("citationUrl")} placeholder="https://pubmed.ncbi.nlm.nih.gov/..." className={inputCls("focus:border-purple-500")} />
              </Field>
              <Field label="Citation Description">
                <textarea rows={3} value={data.citationDescription ?? ""} onChange={set("citationDescription")} placeholder="Brief description of the supporting evidence..." className={`${inputCls("focus:border-purple-500")} resize-none`} />
              </Field>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900"><span className="font-semibold">Note:</span> The Citation URL is required as supporting evidence for the gene-disease association.</p>
              </div>
              <SaveCancelBar onSave={handleSave} saving={saving} onClose={onClose} saveColor="bg-purple-600 hover:bg-purple-700" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EDIT: Functional Category
// ---------------------------------------------------------------------------
const EditFunctionalCategoryForm = ({ onClose, initialId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleLoad = async (id) => {
    setLoading(true); setError(null); setSuccess(null); setData(null);
    try {
      setData(await apiGet(`/functional_categories/${id}`));
    } catch {
      setError(`No functional category found with ID "${id}".`);
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await apiPut(`/functional_categories/${data.categoryId}`, {
        categoryName: data.categoryName,
        description: data.description,
      });
      setSuccess("Functional category updated successfully.");
    } catch {
      setError("Failed to update functional category. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <FormHeader title="Edit Functional Category" icon={Tag} colorClass={{ iconBg: "bg-orange-100", iconText: "text-orange-600" }} onClose={onClose} />
      <EntityLookupDropdown 
        endpoint="/functional_categories" 
        idField="categoryId" 
        labelFn={(c) => `${c.categoryId} - ${c.categoryName}`} 
        placeholder="Select a Category to edit..." 
        onLoad={handleLoad} 
        isLoading={loading} 
        initialId={initialId}
      />
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />
      {data && (
        <div className="space-y-4">
          <Field label="Category Name" required>
            <input type="text" value={data.categoryName ?? ""} onChange={set("categoryName")} placeholder="e.g., Tumor Suppressor, Oncogene, DNA Repair" className={inputCls("focus:border-orange-500")} />
          </Field>
          <Field label="Description">
            <textarea rows={4} value={data.description ?? ""} onChange={set("description")} placeholder="Describe the functional role of this category..." className={`${inputCls("focus:border-orange-500")} resize-none`} />
          </Field>
          <SaveCancelBar onSave={handleSave} saving={saving} onClose={onClose} saveColor="bg-orange-600 hover:bg-orange-700" />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EDIT: Gene-Category
// ---------------------------------------------------------------------------
const EditGeneCategoryForm = ({ onClose, initialId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [genes, setGenes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    Promise.all([apiGet("/genes"), apiGet("/functional_categories")])
      .then(([g, c]) => { setGenes(g); setCategories(c); })
      .catch(() => setError("Failed to load genes/categories list."))
      .finally(() => setListsLoading(false));
  }, []);

  const handleLoad = async (id) => {
    setLoading(true); setError(null); setSuccess(null); setData(null);
    try {
      setData(await apiGet(`/gene-categories/${id}`));
    } catch {
      setError(`No gene-category link found with ID "${id}".`);
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setData((d) => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await apiPut(`/gene-categories/${data.geneCategoryId}`, {
        gene: { geneId: data.geneId },
        functionalCategory: { categoryId: data.categoryId },
      });
      setSuccess("Gene-Category link updated successfully.");
    } catch {
      setError("Failed to update gene-category link. Please try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white border-2 border-yellow-200 rounded-xl p-6">
      <FormHeader title="Edit Gene–Category Link" icon={Tag} colorClass={{ iconBg: "bg-yellow-100", iconText: "text-yellow-600" }} onClose={onClose} />
      {listsLoading ? (
        <div className="text-center py-6 text-gray-500 text-sm">Loading genes and categories...</div>
      ) : (
        <>
          <EntityLookupDropdown 
            endpoint="/gene-categories" 
            idField="geneCategoryId" 
            labelFn={(gc) => `${gc.geneCategoryId} - Gene: ${gc.gene?.geneSymbol || gc.geneId} | Cat: ${gc.functionalCategory?.categoryName || gc.categoryId}`} 
            placeholder="Select a Gene-Category Link to edit..." 
            onLoad={handleLoad} 
            isLoading={loading} 
            initialId={initialId}
          />
          <ErrorBanner message={error} />
          <SuccessBanner message={success} />
          {data && (
            <div className="space-y-4">
              <Field label="Select Gene" required>
                <select value={data.geneId ?? ""} onChange={set("geneId")} className={inputCls("focus:border-yellow-500")}>
                  <option value="">Choose a gene...</option>
                  {genes.map((g) => (
                    <option key={g.geneId} value={g.geneId}>{g.geneSymbol} - {g.fullGeneName}</option>
                  ))}
                </select>
              </Field>
              <Field label="Select Functional Category" required>
                <select value={data.categoryId ?? ""} onChange={set("categoryId")} className={inputCls("focus:border-yellow-500")}>
                  <option value="">Choose a category...</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              </Field>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900"><span className="font-semibold">Note:</span> Each gene can belong to multiple functional categories. Make sure the association doesn't already exist before saving.</p>
              </div>
              <SaveCancelBar onSave={handleSave} saving={saving} onClose={onClose} saveColor="bg-yellow-500 hover:bg-yellow-600" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// DELETE — generic component, driven by per-entity config
// ---------------------------------------------------------------------------
const DeleteForm = ({ title, icon: Icon, colorClass, borderColor, endpoint, idField, entityLabel, labelFn, renderSummary, onClose, initialId }) => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleLoad = async (id) => {
    setLoading(true); setError(null); setSuccess(null); setRecord(null); setConfirmed(false);
    try {
      setRecord(await apiGet(`${endpoint}/${id}`));
    } catch {
      setError(`No ${entityLabel} found with ID "${id}".`);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setDeleting(true); setError(null);
    try {
      await apiDelete(`${endpoint}/${record[idField]}`);
      setSuccess(`${entityLabel} deleted successfully.`);
      setRecord(null);
      setConfirmed(false);
    } catch {
      setError(`Failed to delete ${entityLabel}. Please try again.`);
    } finally { setDeleting(false); }
  };

  return (
    <div className={`bg-white border-2 ${borderColor} rounded-xl p-6`}>
      <FormHeader title={title} icon={Icon} colorClass={colorClass} onClose={onClose} />
      <EntityLookupDropdown 
        endpoint={endpoint} 
        idField={idField} 
        labelFn={labelFn} 
        placeholder={`Select ${entityLabel} to delete...`} 
        onLoad={handleLoad} 
        isLoading={loading} 
        initialId={initialId}
      />
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      {record && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <AlertTriangle size={13} /> Record to be deleted
          </p>
          <div className="mb-4 space-y-1 text-sm text-slate-700">
            {renderSummary(record)}
          </div>
          {!confirmed ? (
            <button
              onClick={() => setConfirmed(true)}
              className="w-full py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              I want to delete this {entityLabel}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-700 font-medium text-center">
                This action is <strong>irreversible</strong>. Are you absolutely sure?
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmed(false)} className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Delete form instances
const DeleteGeneForm = ({ onClose, initialId }) => (
  <DeleteForm title="Delete Gene" icon={Database} colorClass={{ iconBg: "bg-blue-100", iconText: "text-blue-600" }} borderColor="border-red-200"
    endpoint="/genes" idField="geneId" entityLabel="Gene" initialId={initialId}
    labelFn={(g) => `${g.geneId} - ${g.geneSymbol} (${g.fullGeneName})`}
    renderSummary={(r) => (<><p><span className="font-semibold">ID:</span> {r.geneId}</p><p><span className="font-semibold">Symbol:</span> {r.geneSymbol}</p><p><span className="font-semibold">Name:</span> {r.fullGeneName}</p><p><span className="font-semibold">Type:</span> {r.geneType}</p><p><span className="font-semibold">OMIM ID:</span> {r.omimId}</p></>)}
    onClose={onClose} />
);

const DeleteDiseaseForm = ({ onClose, initialId }) => (
  <DeleteForm title="Delete Disease" icon={Activity} colorClass={{ iconBg: "bg-green-100", iconText: "text-green-600" }} borderColor="border-red-200"
    endpoint="/diseases" idField="diseaseId" entityLabel="Disease" initialId={initialId}
    labelFn={(d) => `${d.diseaseId} - ${d.diseaseName}`}
    renderSummary={(r) => (<><p><span className="font-semibold">ID:</span> {r.diseaseId}</p><p><span className="font-semibold">Name:</span> {r.diseaseName}</p><p><span className="font-semibold">Category:</span> {r.diseaseCategory}</p><p><span className="font-semibold">OMIM ID:</span> {r.omimId}</p><p><span className="font-semibold">PH Prevalence:</span> {r.phPrevalence}</p></>)}
    onClose={onClose} />
);

const DeleteAssociationForm = ({ onClose, initialId }) => (
  <DeleteForm title="Delete Gene-Disease Association" icon={Link} colorClass={{ iconBg: "bg-purple-100", iconText: "text-purple-600" }} borderColor="border-red-200"
    endpoint="/genedisease" idField="geneDiseaseId" entityLabel="Association" initialId={initialId}
    labelFn={(a) => `${a.geneDiseaseId} - Gene: ${a.gene?.geneSymbol || 'Unknown'} | Disease: ${a.disease?.diseaseName || 'Unknown'}`}
    renderSummary={(r) => (<><p><span className="font-semibold">ID:</span> {r.geneDiseaseId}</p><p><span className="font-semibold">Gene ID:</span> {r.gene?.geneId || r.geneId}</p><p><span className="font-semibold">Disease ID:</span> {r.disease?.diseaseId || r.diseaseId}</p><p><span className="font-semibold">Type:</span> {r.associationType}</p><p><span className="font-semibold">Citation:</span> <span className="truncate block">{r.citationUrl}</span></p></>)}
    onClose={onClose} />
);

const DeleteFunctionalCategoryForm = ({ onClose, initialId }) => (
  <DeleteForm title="Delete Functional Category" icon={Tag} colorClass={{ iconBg: "bg-orange-100", iconText: "text-orange-600" }} borderColor="border-red-200"
    endpoint="/functional_categories" idField="categoryId" entityLabel="Functional Category" initialId={initialId}
    labelFn={(c) => `${c.categoryId} - ${c.categoryName}`}
    renderSummary={(r) => (<><p><span className="font-semibold">ID:</span> {r.categoryId}</p><p><span className="font-semibold">Name:</span> {r.categoryName}</p><p><span className="font-semibold">Description:</span> {r.description}</p></>)}
    onClose={onClose} />
);

const DeleteGeneCategoryForm = ({ onClose, initialId }) => (
  <DeleteForm title="Delete Gene–Category Link" icon={Tag} colorClass={{ iconBg: "bg-yellow-100", iconText: "text-yellow-600" }} borderColor="border-red-200"
    endpoint="/gene-categories" idField="geneCategoryId" entityLabel="Gene-Category Link" initialId={initialId}
    labelFn={(gc) => `${gc.geneCategoryId} - Gene: ${gc.gene?.geneSymbol || gc.geneId} | Cat: ${gc.functionalCategory?.categoryName || gc.categoryId}`}
    renderSummary={(r) => (<><p><span className="font-semibold">ID:</span> {r.geneCategoryId}</p><p><span className="font-semibold">Gene ID:</span> {r.geneId}</p><p><span className="font-semibold">Category ID:</span> {r.categoryId}</p></>)}
    onClose={onClose} />
);

// ---------------------------------------------------------------------------
// Section divider
// ---------------------------------------------------------------------------
const SectionLabel = ({ label }) => (
  <div className="col-span-full flex items-center gap-3 mt-2 mb-1">
    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

// ---------------------------------------------------------------------------
// Main AdminPanel
// ---------------------------------------------------------------------------
const AdminPanel = () => {
  const [activeView, setActiveView] = useState(null);
  const [initialEntityId, setInitialEntityId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("jwt");
  const tokenData = token ? jwtDecode(token) : {};

  // Check for login
  useEffect(() => {
    setAdminData(null);
    setIsLoading(true);
    apiGet("/admin/me")
      .then((data) => { setAdminData(data); setIsLoading(false); })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  // Check for incoming route state (e.g., from search page edits)
  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
      setInitialEntityId(location.state.entityId || null);
      
      // Clear the history state so refreshing doesn't re-trigger the auto-load
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const addCards = [
    { title: "Add Gene", icon: Database, colors: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" }, view: "add-gene", desc: "Register a new gene in the database" },
    { title: "Add Disease", icon: Activity, colors: { bg: "bg-green-50", border: "border-green-100", text: "text-green-600" }, view: "add-disease", desc: "Register a new disease with Philippine prevalence data" },
    { title: "Add Gene-Disease Association", icon: Link, colors: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600" }, view: "add-association", desc: "Link genes to diseases with association type" },
    { title: "Add Functional Category", icon: Tag, colors: { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-600" }, view: "add-functional-category", desc: "Register a new gene functional category" },
    { title: "Add Gene–Category", icon: Tag, colors: { bg: "bg-yellow-50", border: "border-yellow-100", text: "text-yellow-600" }, view: "add-gene-category", desc: "Link a gene to a functional category" },
  ];

  const editCards = [
    { title: "Edit Gene", icon: Database, colors: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" }, view: "edit-gene", desc: "Update gene symbol, name, type, or IDs" },
    { title: "Edit Disease", icon: Activity, colors: { bg: "bg-green-50", border: "border-green-100", text: "text-green-600" }, view: "edit-disease", desc: "Update disease name, category, or prevalence" },
    { title: "Edit Association", icon: Link, colors: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600" }, view: "edit-association", desc: "Change association type, citation, or linked records" },
    { title: "Edit Functional Category", icon: Tag, colors: { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-600" }, view: "edit-functional-category", desc: "Update a functional category's name or description" },
    { title: "Edit Gene–Category", icon: Tag, colors: { bg: "bg-yellow-50", border: "border-yellow-100", text: "text-yellow-600" }, view: "edit-gene-category", desc: "Re-link a gene to a different functional category" },
  ];

  const deleteCards = [
    { title: "Delete Gene", icon: Database, colors: { bg: "bg-red-50", border: "border-red-100", text: "text-red-500" }, view: "delete-gene", desc: "Permanently remove a gene record" },
    { title: "Delete Disease", icon: Activity, colors: { bg: "bg-red-50", border: "border-red-100", text: "text-red-500" }, view: "delete-disease", desc: "Permanently remove a disease record" },
    { title: "Delete Association", icon: Link, colors: { bg: "bg-red-50", border: "border-red-100", text: "text-red-500" }, view: "delete-association", desc: "Permanently remove a gene-disease association" },
    { title: "Delete Functional Category", icon: Tag, colors: { bg: "bg-red-50", border: "border-red-100", text: "text-red-500" }, view: "delete-functional-category", desc: "Permanently remove a functional category" },
    { title: "Delete Gene–Category", icon: Tag, colors: { bg: "bg-red-50", border: "border-red-100", text: "text-red-500" }, view: "delete-gene-category", desc: "Permanently remove a gene-category link" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg font-medium text-slate-500 animate-pulse">Verifying secure session...</div>
      </div>
    );
  }

  const handleCloseView = () => {
    setActiveView(null);
    setInitialEntityId(null);
  };

  const CardGrid = ({ cards, ActionIcon }) => (
    <>
      {cards.map(({ title, icon: Icon, colors, view, desc }) => (
        <div
          key={view}
          className={`${colors.bg} p-6 rounded-xl border ${colors.border} hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4 group ${activeView === view ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
          onClick={() => {
            setActiveView(activeView === view ? null : view);
            setInitialEntityId(null); // Clear auto-load if clicking manually
          }}
          role="button"
        >
          <div className={`bg-white p-3 rounded-lg shadow-sm ${colors.text} group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {title}
              <ActionIcon size={15} className="text-slate-400" />
            </h3>
            <p className="text-slate-600 text-sm mt-1">{desc}</p>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
          <p className="text-slate-600">Manage genes, diseases, associations, and research references.</p>
        </div>
        {adminData && (
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
            <img
              src={tokenData.picture}
              alt="Profile"
              className="w-10 h-10 rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminData.name)}&background=dc2626&color=fff`;
              }}
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{adminData.name}</p>
              <p className="text-xs text-slate-500">{adminData.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SectionLabel label="Add" />
        <CardGrid cards={addCards} ActionIcon={Plus} />
        <SectionLabel label="Edit" />
        <CardGrid cards={editCards} ActionIcon={Pencil} />
        <SectionLabel label="Delete" />
        <CardGrid cards={deleteCards} ActionIcon={Trash2} />
      </div>

      {/* Modal */}
      {activeView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <div className="p-6">
              {/* ADD */}
              {activeView === "add-gene" && <AddGeneForm onClose={handleCloseView} />}
              {activeView === "add-disease" && <AddDiseaseForm onClose={handleCloseView} />}
              {activeView === "add-association" && <AddAssociationForm onClose={handleCloseView} />}
              {activeView === "add-functional-category" && <AddFunctionalCategoryForm onClose={handleCloseView} />}
              {activeView === "add-gene-category" && <AddGeneCategoryForm onClose={handleCloseView} />}
              {/* EDIT */}
              {activeView === "edit-gene" && <EditGeneForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "edit-disease" && <EditDiseaseForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "edit-association" && <EditAssociationForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "edit-functional-category" && <EditFunctionalCategoryForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "edit-gene-category" && <EditGeneCategoryForm onClose={handleCloseView} initialId={initialEntityId} />}
              {/* DELETE */}
              {activeView === "delete-gene" && <DeleteGeneForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "delete-disease" && <DeleteDiseaseForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "delete-association" && <DeleteAssociationForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "delete-functional-category" && <DeleteFunctionalCategoryForm onClose={handleCloseView} initialId={initialEntityId} />}
              {activeView === "delete-gene-category" && <DeleteGeneCategoryForm onClose={handleCloseView} initialId={initialEntityId} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;