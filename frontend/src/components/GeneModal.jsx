import React from 'react';
import { X, MapPin, FileText, Activity, ExternalLink } from 'lucide-react';

export default function GeneModal({ isOpen, onClose, geneData }) {
  if (!isOpen || !geneData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header - Blue */}
        <div className="bg-blue-600 text-white p-6 relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg w-12 h-12 flex-shrink-0"></div> {/* Placeholder for icon/logo if needed */}
            <div>
              <h2 className="text-3xl font-bold">{geneData.symbol}</h2>
              <p className="text-blue-100 text-lg">{geneData.name}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-blue-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">Gene Information</h3>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <MapPin size={16} />
                <span className="text-sm">Chromosome Location</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{geneData.chromosome}</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-sm w-24">NCBI Gene ID</span>
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                  {geneData.ncbiId} <ExternalLink size={14} />
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-sm w-24">OMIM ID</span>
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                  {geneData.omimId} <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Description & Function */}
          <div className="mb-8 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Description</h4>
              <p className="text-slate-600">{geneData.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Biological Function</h4>
              <div className="bg-blue-50 border border-blue-100 text-slate-700 p-4 rounded-xl">
                {geneData.biologicalFunction}
              </div>
            </div>
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
                
                {/* References Section inside the card */}
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
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">
                              PH Local Study
                            </span>
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
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