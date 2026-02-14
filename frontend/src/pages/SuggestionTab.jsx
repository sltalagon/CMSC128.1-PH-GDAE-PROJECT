import React, { useState } from "react";
import { Lightbulb, Send, AlertCircle, CheckCircle, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function SuggestionTab() {
  const [geneSymbol, setGeneSymbol] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [comments, setComments] = useState("");
  const [references, setReferences] = useState([
    { title: "", authors: "", journal: "", year: "", doi: "", pmid: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReference = () => {
    setReferences([
      ...references,
      { title: "", authors: "", journal: "", year: "", doi: "", pmid: "" },
    ]);
  };

  const removeReference = (index) => {
    if (references.length > 1) {
      setReferences(references.filter((_, i) => i !== index));
    }
  };

  const updateReference = (index, field, value) => {
    const updated = [...references];
    updated[index] = { ...updated[index], [field]: value };
    setReferences(updated);
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if at least one reference has required fields filled
    const hasValidReference = references.some(
      (ref) =>
        ref.title.trim() &&
        ref.authors.trim() &&
        ref.journal.trim() &&
        ref.year.trim(),
    );

    if (!hasValidReference) {
      newErrors.references =
        "At least one reference with title, authors, journal, and year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in at least one complete reference");
      return;
    }

    setIsSubmitting(true);

    // TODO: Replace with your Spring Boot API endpoint
    /*
    try {
      const response = await fetch('http://localhost:8080/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          geneSymbol: geneSymbol || null,
          diseaseName: diseaseName || null,
          comments: comments || null,
          references: references.filter(ref => 
            ref.title && ref.authors && ref.journal && ref.year
          )
        })
      });

      if (response.ok) {
        toast.success('Suggestion submitted successfully!');
        // Reset form
        setGeneSymbol('');
        setDiseaseName('');
        setComments('');
        setReferences([{ title: '', authors: '', journal: '', year: '', doi: '', pmid: '' }]);
      } else {
        toast.error('Failed to submit suggestion');
      }
    } catch (error) {
      toast.error('Error connecting to server');
    }
    */

    // Mock implementation
    console.log("Submitting suggestion:", {
      geneSymbol: geneSymbol || null,
      diseaseName: diseaseName || null,
      comments: comments || null,
      references: references.filter(
        (ref) => ref.title && ref.authors && ref.journal && ref.year,
      ),
    });

    setTimeout(() => {
      toast.success("Suggestion submitted successfully!");
      setIsSubmitting(false);
      // Reset form
      setGeneSymbol("");
      setDiseaseName("");
      setComments("");
      setReferences([
        { title: "", authors: "", journal: "", year: "", doi: "", pmid: "" },
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Submit a Suggestion
        </h2>
        <p className="text-gray-600">
          Help us improve the database by suggesting new gene-disease
          associations or corrections.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-900">
          <p className="font-semibold mb-1">Contribution Guidelines</p>
          <p>
            Your suggestions help enhance the accuracy and completeness of
            PH-GDAE. While gene, disease, and comments are optional, at least
            one reference with complete information (title, authors, journal,
            and year) is required to support your suggestion.
          </p>
        </div>
      </div>

      {/* Suggestion Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Association Information
          </h3>

          <div className="space-y-4">
            {/* Gene Field */}
            <div>
              <label
                htmlFor="gene"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gene Symbol{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="gene"
                type="text"
                value={geneSymbol}
                onChange={(e) => setGeneSymbol(e.target.value)}
                placeholder="e.g., BRCA1, TP53, HBB"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the gene symbol you want to suggest
              </p>
            </div>

            {/* Disease Field */}
            <div>
              <label
                htmlFor="disease"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Disease Name{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                id="disease"
                type="text"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.target.value)}
                placeholder="e.g., Type 2 Diabetes, Breast Cancer"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the disease name you want to associate
              </p>
            </div>

            {/* Comments Field */}
            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comments{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide additional context, association type, confidence level, or any relevant information..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add any additional information about the association, prevalence
                in Philippines, or notes
              </p>
            </div>
          </div>
        </div>

        {/* References Section */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                References <span className="text-red-600">*</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                At least one complete reference is required
              </p>
            </div>
            <button
              type="button"
              onClick={addReference}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              + Add Another Reference
            </button>
          </div>

          <div className="space-y-6">
            {references.map((ref, index) => (
              <div
                key={index}
                className="relative border-2 border-gray-200 rounded-lg p-4"
              >
                {references.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReference(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                <h4 className="font-semibold text-gray-900 mb-3">
                  Reference {index + 1}
                </h4>

                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={ref.title}
                      onChange={(e) =>
                        updateReference(index, "title", e.target.value)
                      }
                      placeholder="Full title of the publication"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Authors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Authors <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={ref.authors}
                      onChange={(e) =>
                        updateReference(index, "authors", e.target.value)
                      }
                      placeholder="e.g., Smith J, Johnson A, Williams B"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {/* Journal */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Journal <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={ref.journal}
                        onChange={(e) =>
                          updateReference(index, "journal", e.target.value)
                        }
                        placeholder="Journal name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={ref.year}
                        onChange={(e) =>
                          updateReference(index, "year", e.target.value)
                        }
                        placeholder="YYYY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {/* DOI */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DOI{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={ref.doi || ""}
                        onChange={(e) =>
                          updateReference(index, "doi", e.target.value)
                        }
                        placeholder="10.xxxx/xxxxx"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* PMID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PMID{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={ref.pmid || ""}
                        onChange={(e) =>
                          updateReference(index, "pmid", e.target.value)
                        }
                        placeholder="PubMed ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.references && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.references}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-900 mb-1">Review Process</p>
              <p>
                Your suggestion will be reviewed by our team of researchers
                before being added to the database.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Suggestion
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SuggestionTab;
