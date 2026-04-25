import React, { useState } from "react";
import { X, FileText, Activity, ExternalLink, Dna, Tag, Pencil, Trash2 } from "lucide-react";

export default function GeneModal({ isOpen, onClose, geneData, onEdit, onDelete }) {
  const [activeCat, setActiveCat] = useState(null);

  if (!isOpen || !geneData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-blue-600 text-white p-6 relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center">
              <Dna size={34} color="#3b82f6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{geneData.symbol}</h2>
              <p className="text-blue-100 text-lg">{geneData.name}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">

          {/* Gene Information */}
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-blue-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">Gene Information</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-sm font-medium text-slate-500">NCBI Gene ID:</span>
              {geneData.ncbiId && geneData.ncbiId !== "N/A" ? (
                <a href={`https://www.ncbi.nlm.nih.gov/gene/${geneData.ncbiId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  {geneData.ncbiId} <ExternalLink size={10} />
                </a>
              ) : <span className="text-slate-400">N/A</span>}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-sm font-medium text-slate-500">OMIM ID:</span>
              {geneData.omimId && geneData.omimId !== "N/A" ? (
                <a href={`https://omim.org/entry/${geneData.omimId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  {geneData.omimId} <ExternalLink size={10} />
                </a>
              ) : <span className="text-slate-400">N/A</span>}
            </div>
          </div>

          {/* Description & Biological Function */}
          <div className="mb-8 space-y-4">
            {geneData.functionalCategories?.length > 0 && (
              <div className="mt-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                <Tag className="text-purple-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Functional Categories</h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">Click a category to see its description.</p>
              </div>
                <div className="flex flex-wrap gap-2">
                  {geneData.functionalCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCat(activeCat?.name === cat.name ? null : cat)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                        activeCat?.name === cat.name
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Description popover */}
                {activeCat && (
                  <div className="mt-3 p-4 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-900">
                    <p className="font-semibold mb-1">{activeCat.name}</p>
                    <p>{activeCat.description || "No description available."}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Associated Diseases */}
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-green-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">
              Associated Diseases ({geneData.associatedDiseases?.length || 0})
            </h3>
          </div>

          <div className="space-y-4 mb-8">
            {geneData.associatedDiseases?.map((disease, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 flex justify-between items-start bg-white">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{disease.name}</h4>
                    <p className="text-slate-500 text-sm mb-3">{disease.type}</p>
                    <p className="text-slate-700 text-sm">{disease.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {disease.associationType}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {disease.confidence}
                    </span>
                  </div>
                </div>

                {disease.references && (
                  <div className="bg-slate-50 p-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
                        <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold">PH</span>
                        High Prevalence in Philippines
                      </span>
                      <span className="text-slate-400 text-xs">{disease.references.length} reference(s)</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">References:</p>
                      {disease.references.map((ref, rIdx) => (
                        <div key={rIdx} className="text-sm">
                          <p className="font-medium text-slate-800">{ref.title}</p>
                          <p className="text-slate-500 text-xs mb-1">
                            {ref.authors} ({ref.year}). <span className="italic">{ref.journal}</span>
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">PH Local Study</span>
                          </p>
                          <p className="text-slate-400 text-xs">PMID: {ref.pmid}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Edit/Delete Buttons */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="flex gap-2">
            {onEdit && (
              <button onClick={() => onEdit(geneData)} className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                <Pencil size={16} /> Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(geneData)} className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}