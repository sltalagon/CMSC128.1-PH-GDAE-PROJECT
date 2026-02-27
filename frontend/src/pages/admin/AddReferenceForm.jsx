import React, { useState } from "react";
import { X, Check, BookOpen } from "lucide-react";

export function AddReferenceForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal: "",
    year: new Date().getFullYear(),
    doi: "",
    pmid: "",
    isLocal: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // In production, this would save to database
    console.log("Submitting reference:", formData);

    toast.success("Reference added successfully!", {
      description: "The research reference has been saved.",
    });

    onClose();
  };

  return (
    <div className="bg-white border-2 border-orange-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Add Research Reference
            </h3>
            <p className="text-sm text-gray-600">
              Add supporting literature to the database
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
            Article Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter the full title of the research article"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Authors <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.authors}
            onChange={(e) =>
              setFormData({ ...formData, authors: e.target.value })
            }
            placeholder="e.g., Santos JM, Cruz DE, Reyes AF"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Journal/Publication <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.journal}
              onChange={(e) =>
                setFormData({ ...formData, journal: e.target.value })
              }
              placeholder="Name of journal or publication"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              DOI (Optional)
            </label>
            <input
              type="text"
              value={formData.doi}
              onChange={(e) =>
                setFormData({ ...formData, doi: e.target.value })
              }
              placeholder="e.g., 10.1016/j.diabres.2022.109876"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PubMed ID (Optional)
            </label>
            <input
              type="text"
              value={formData.pmid}
              onChange={(e) =>
                setFormData({ ...formData, pmid: e.target.value })
              }
              placeholder="e.g., 12345678"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <input
            type="checkbox"
            id="isLocal"
            checked={formData.isLocal}
            onChange={(e) =>
              setFormData({ ...formData, isLocal: e.target.checked })
            }
            className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
          />
          <label
            htmlFor="isLocal"
            className="text-sm font-medium text-green-900 cursor-pointer"
          >
            🇵🇭 This is a local Philippine study
          </label>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-900">
            <span className="font-semibold">Note:</span> References are
            typically linked to gene-disease associations. In production, you
            would specify which association this reference supports.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Check className="w-5 h-5" />
            Add Reference
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
