import React, { useState } from "react";
import { X, Check, Link } from "lucide-react";

export function AddAssociationForm({ onClose }) {
  const [formData, setFormData] = useState({
    geneId: "",
    diseaseId: "",
    associationType: "Risk Factor",
    confidence: "Moderate",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const gene = mockGenes.find((g) => g.id === formData.geneId);
    const disease = mockDiseases.find((d) => d.id === formData.diseaseId);

    // In production, this would save to database
    console.log("Submitting association:", formData);

    toast.success("Gene-Disease Association created!", {
      description: `Linked ${gene?.symbol} to ${disease?.name}`,
    });

    onClose();
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Gene <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.geneId}
            onChange={(e) =>
              setFormData({ ...formData, geneId: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="">Choose a gene...</option>
            {mockGenes.map((gene) => (
              <option key={gene.id} value={gene.id}>
                {gene.symbol} - {gene.name} (Chr {gene.chromosome})
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
            onChange={(e) =>
              setFormData({ ...formData, diseaseId: e.target.value })
            }
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="">Choose a disease...</option>
            {mockDiseases.map((disease) => (
              <option key={disease.id} value={disease.id}>
                {disease.name} ({disease.category})
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Association Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.associationType}
              onChange={(e) =>
                setFormData({ ...formData, associationType: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="Causative">
                Causative (directly causes disease)
              </option>
              <option value="Risk Factor">
                Risk Factor (increases disease risk)
              </option>
              <option value="Protective">
                Protective (reduces disease risk)
              </option>
              <option value="Modifier">
                Modifier (affects disease progression)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confidence Level <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.confidence}
              onChange={(e) =>
                setFormData({ ...formData, confidence: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="High">High (strong evidence)</option>
              <option value="Moderate">Moderate (moderate evidence)</option>
              <option value="Low">Low (limited evidence)</option>
            </select>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            <span className="font-semibold">Note:</span> After creating this
            association, you can add supporting references through the "Add
            Reference" form.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Check className="w-5 h-5" />
            Create Association
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
