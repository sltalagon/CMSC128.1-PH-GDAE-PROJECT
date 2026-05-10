import React, { useState } from "react";
import { Activity, X, FileText, AlertCircle, ExternalLink, Dna, Pencil, Trash2, Tag } from "lucide-react";

export default function DiseaseModal({ isOpen, onClose, diseaseData, onEdit, onDelete }) {
  const [activeCat, setActiveCat] = useState(null);

  if (!isOpen || !diseaseData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header - Red */}
        <div className="bg-red-600 text-white p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <Activity size={24} color="red" />
              </div>
              <h2 className="text-3xl font-bold">{diseaseData.name}</h2>
            </div>
            {diseaseData.phPrevalence && diseaseData.phPrevalence !== "NONE" && (
              <div className="flex">
                <span className="bg-red-50 text-red-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="bg-red-200 text-red-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                    PH
                  </span>
                  Prevalence: {diseaseData.phPrevalence}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-green-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">
              Disease Information
            </h3>
          </div>

          <p className="text-slate-600 mb-3">{diseaseData.description}</p>
          {diseaseData.omimId && diseaseData.omimId !== "N/A" && (
            <a
              href={`https://omim.org/entry/${diseaseData.omimId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 text-sm mb-8"
            >
              View in OMIM Database <ExternalLink size={14} />
            </a>
          )}
          
          {/* Associated Genes */}
          <div className="flex items-center gap-2 mb-4">
            <Dna className="text-blue-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">
              Associated Genes ({diseaseData.associatedGenes?.length || 0})
            </h3>
          </div>

          <div className="space-y-4 mb-8">
            {diseaseData.associatedGenes?.map((gene, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Gene Header */}
                <div className="p-4 flex justify-between items-start bg-white">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                      <Dna size={20} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-blue-600">
                        {gene.symbol}
                      </h4>
                      <p className="text-slate-800 font-medium">{gene.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {gene.associationType}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {gene.geneType?.replace("_", "-").toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Gene Body (Description & Categories) */}
                <div className="px-4 pb-4 bg-white">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 mb-2">{gene.description}</p>
                    
                    {/* Functional Categories exactly like GeneModal */}
                    {gene.functionalCategories && gene.functionalCategories.length > 0 ? (
                      <div className="mt-4 border-t border-slate-200 pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="text-purple-600" size={16} />
                          <h5 className="font-bold text-slate-800 text-sm">Functional Categories</h5>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">Click a category to see its description.</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {gene.functionalCategories.map((cat, cIdx) => {
                            // Unique ID so clicking one gene's tag doesn't open the popover for another gene!
                            const catId = `${idx}-${cIdx}`; 
                            const isActive = activeCat?.id === catId;
                            
                            return (
                              <button
                                key={cIdx}
                                onClick={() => setActiveCat(isActive ? null : { id: catId, ...cat })}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  isActive
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100"
                                }`}
                              >
                                {cat.name}
                              </button>
                            );
                          })}
                        </div>

                        {/* Description Popover */}
                        {activeCat && activeCat.id.startsWith(`${idx}-`) && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
                            <p className="font-semibold mb-1">{activeCat.name}</p>
                            <p>{activeCat.description || "No description available."}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm mt-3 border-t border-slate-200 pt-3 italic">
                        No functional categories mapped to this gene.
                      </p>
                    )}
                  </div>
                </div>

                {/* References Section */}
                <div className="bg-white px-4 pb-4">
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                      Supporting References ({gene.references?.length || 0}):
                    </p>
                    
                    {gene.references && gene.references.length > 0 ? (
                      <div className="space-y-3">
                        {gene.references.map((ref, rIdx) => (
                          <div key={rIdx} className="text-sm bg-slate-50 p-3 rounded border border-slate-100">
                            <p className="font-medium text-slate-800">{ref.title}</p>
                            {ref.description && (
                              <p className="text-slate-600 text-xs mt-1">{ref.description}</p>
                            )}
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:underline text-xs flex items-center gap-1 mt-1 break-all"
                            >
                              {ref.url} <ExternalLink size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No references available for this association.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Edit/Delete Buttons */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="flex gap-2">
            {onEdit && (
              <button onClick={() => onEdit(diseaseData)} className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                <Pencil size={16} /> Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(diseaseData)} className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}