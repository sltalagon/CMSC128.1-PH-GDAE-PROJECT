import React, { useState } from "react";
import { Lightbulb, CheckCircle, ArrowLeft } from "lucide-react";
import { AddGeneForm } from "../admin/AddGeneForm";
import { AddDiseaseForm } from "../admin/AddDiseaseForm";
import { AddAssociationForm } from "../admin/AddAssociationForm";
import { AddFunctionalCategoryForm } from "../admin/AddFunctionalCategoryForm";
import { AddGeneCategoryForm } from "../admin/AddGeneCategoryForm";

function SuggestionTab() {
  const [step, setStep] = useState("info"); // "info" | "form" | "done"
  const [suggestionType, setSuggestionType] = useState("");
  const [submitterInfo, setSubmitterInfo] = useState({
    submitterName: "",
    submitterEmail: "",
    referenceUrl: "",
  });
  const [infoErrors, setInfoErrors] = useState({});

  const suggestionTypes = [
    { value: "GENE", label: "New Gene", desc: "Suggest a gene to be added to the database" },
    { value: "DISEASE", label: "New Disease", desc: "Suggest a disease to be added" },
    { value: "ASSOCIATION", label: "Gene–Disease Association", desc: "Suggest a link between a gene and a disease" },
    { value: "FUNCTIONAL_CATEGORY", label: "Functional Category", desc: "Suggest a new functional category" },
    { value: "GENE_CATEGORY", label: "Gene–Category Association", desc: "Suggest linking a gene to a functional category" },
  ];

  const validateInfo = () => {
    const errors = {};
    if (!submitterInfo.submitterName.trim()) errors.submitterName = "Name is required.";
    if (!submitterInfo.submitterEmail.trim()) errors.submitterEmail = "Email is required.";
    if (!suggestionType) errors.suggestionType = "Please select a suggestion type.";
    if (!submitterInfo.referenceUrl.trim()) errors.referenceUrl = "A reference URL is required.";
    setInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (validateInfo()) setStep("form");
  };

  const handleFormClose = () => setStep("done");

  if (step === "done") {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">Suggestion Submitted!</h2>
          <p className="text-green-700 mb-6">
            Thank you! Your suggestion will be reviewed by our team before being added to the database.
          </p>
          <button
            onClick={() => { setStep("info"); setSuggestionType(""); setSubmitterInfo({ submitterName: "", submitterEmail: "", referenceUrl: "" }); }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  if (step === "form") {
    const formProps = {
      onClose: handleFormClose,
      mode: "suggestion",
      suggestionMeta: submitterInfo,
    };

    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <button
          onClick={() => setStep("info")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Submitting as:</span> {submitterInfo.submitterName} ({submitterInfo.submitterEmail})
          </p>
        </div>

        {suggestionType === "GENE" && <AddGeneForm {...formProps} />}
        {suggestionType === "DISEASE" && <AddDiseaseForm {...formProps} />}
        {suggestionType === "ASSOCIATION" && <AddAssociationForm {...formProps} />}
        {suggestionType === "FUNCTIONAL_CATEGORY" && <AddFunctionalCategoryForm {...formProps} />}
        {suggestionType === "GENE_CATEGORY" && <AddGeneCategoryForm {...formProps} />}
      </div>
    );
  }

  // step === "info"
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit a Suggestion</h2>
        <p className="text-gray-600">Help us improve the database by suggesting new entries or associations.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-900">
          <span className="font-semibold">Contribution Guidelines: </span>
          Fill in your details and select what you'd like to suggest. You'll then get the same form our admins use to add entries, so your suggestion is as detailed as possible.
        </p>
      </div>

      <form onSubmit={handleInfoSubmit} className="space-y-6">
        {/* Submitter Info */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={submitterInfo.submitterName}
                onChange={(e) => setSubmitterInfo({ ...submitterInfo, submitterName: e.target.value })}
                placeholder="e.g., Juan dela Cruz"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${infoErrors.submitterName ? "border-red-400" : "border-gray-200 focus:border-blue-500"}`}
              />
              {infoErrors.submitterName && <p className="mt-1 text-xs text-red-600">{infoErrors.submitterName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={submitterInfo.submitterEmail}
                onChange={(e) => setSubmitterInfo({ ...submitterInfo, submitterEmail: e.target.value })}
                placeholder="e.g., researcher@up.edu.ph"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${infoErrors.submitterEmail ? "border-red-400" : "border-gray-200 focus:border-blue-500"}`}
              />
              {infoErrors.submitterEmail && <p className="mt-1 text-xs text-red-600">{infoErrors.submitterEmail}</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={submitterInfo.referenceUrl}
              onChange={(e) => setSubmitterInfo({ ...submitterInfo, referenceUrl: e.target.value })}
              placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${infoErrors.referenceUrl ? "border-red-400" : "border-gray-200 focus:border-blue-500"}`}
            />
            {infoErrors.referenceUrl && <p className="mt-1 text-xs text-red-600">{infoErrors.referenceUrl}</p>}
            <p className="mt-1 text-xs text-gray-500">Link to a PubMed article, DOI, or other published source supporting your suggestion.</p>
          </div>
        </div>

        {/* Suggestion Type */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What would you like to suggest? <span className="text-red-500">*</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {suggestionTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSuggestionType(type.value)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  suggestionType === type.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <p className="font-semibold text-gray-900">{type.label}</p>
                <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
              </button>
            ))}
          </div>
          {infoErrors.suggestionType && <p className="mt-2 text-xs text-red-600">{infoErrors.suggestionType}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          Continue to Form →
        </button>
      </form>
    </div>
  );
}

export default SuggestionTab;