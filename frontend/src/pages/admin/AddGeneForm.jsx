import React, { useState } from "react";
import { X, Check, Database } from "lucide-react";

export function AddGeneForm({ onClose }) {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    chromosome: "",
    description: "",
    function: "",
    ncbiId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // In production, this would save to database
    console.log("Submitting gene:", formData);

    toast.success(`Gene ${formData.symbol} added successfully!`, {
      description: "The gene has been registered in the system.",
    });

    onClose();
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gene Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.symbol}
              onChange={(e) =>
                setFormData({ ...formData, symbol: e.target.value })
              }
              placeholder="e.g., BRCA1"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chromosome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.chromosome}
              onChange={(e) =>
                setFormData({ ...formData, chromosome: e.target.value })
              }
              placeholder="e.g., 17 or X"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Gene Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Breast Cancer Type 1 Susceptibility Protein"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the gene and its characteristics..."
            rows={3}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Biological Function <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.function}
            onChange={(e) =>
              setFormData({ ...formData, function: e.target.value })
            }
            placeholder="Describe the primary biological function..."
            rows={2}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            NCBI Gene ID (Optional)
          </label>
          <input
            type="text"
            value={formData.ncbiId}
            onChange={(e) =>
              setFormData({ ...formData, ncbiId: e.target.value })
            }
            placeholder="e.g., 672"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Check className="w-5 h-5" />
            Add Gene
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
