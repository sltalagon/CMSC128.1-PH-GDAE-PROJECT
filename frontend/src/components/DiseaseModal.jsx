import React from 'react';
import { X, FileText, AlertCircle, ExternalLink, Dna } from 'lucide-react';

export default function DiseaseModal({ isOpen, onClose, diseaseData }) {
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
              <div className="bg-white rounded-lg w-12 h-12 flex-shrink-0"></div>
              <h2 className="text-3xl font-bold">{diseaseData.name}</h2>
            </div>
            {diseaseData.phPrevalence && (
              <div className="flex">
                <span className="bg-red-50 text-red-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="bg-red-200 text-red-800 text-[10px] px-1.5 py-0.5 rounded font-bold">PH</span>
                  High Prevalence in Philippines
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto">
          
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-green-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">Disease Information</h3>
          </div>

          <p className="text-slate-600 mb-3">{diseaseData.description}</p>
          <a href="#" className="text-blue-600 hover:underline flex items-center gap-1 text-sm mb-8">
            View in OMIM Database <ExternalLink size={14} />
          </a>

          {/* Common Symptoms */}
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-orange-500" size={20} />
            <h3 className="text-lg font-bold text-slate-800">Common Symptoms</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {diseaseData.symptoms?.map((symptom, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span className="text-slate-700">{symptom}</span>
              </div>
            ))}
          </div>

          {/* Associated Genes */}
          <div className="flex items-center gap-2 mb-4">
            <Dna className="text-blue-600" size={20} />
            <h3 className="text-xl font-bold text-slate-800">
              Associated Genes ({diseaseData.associatedGenes?.length || 0})
            </h3>
          </div>

          <div className="space-y-4 mb-8">
            {diseaseData.associatedGenes?.map((gene, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 flex justify-between items-start bg-white">
                  <div className="flex gap-3">
                     <div className="mt-1 bg-blue-50 p-1.5 rounded text-blue-600">
                        <Dna size={20}/>
                     </div>
                     <div>
                      <h4 className="text-xl font-bold text-blue-600">{gene.symbol}</h4>
                      <p className="text-slate-800 font-medium">{gene.name}</p>
                      <p className="text-slate-500 text-sm mb-3">{gene.chromosome}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {gene.associationType}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {gene.confidence}
                    </span>
                  </div>
                </div>
                
                <div className="px-4 pb-4 bg-white">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 mb-2">{gene.description}</p>
                    <p className="text-slate-600 text-sm">
                      <span className="font-semibold text-slate-800">Function: </span> 
                      {gene.function}
                    </p>
                  </div>
                </div>

                {/* References */}
                {gene.references && (
                  <div className="bg-white px-4 pb-4">
                     <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Supporting References ({gene.references.length}):</p>
                        {gene.references.map((ref, rIdx) => (
                          <div key={rIdx} className="text-sm bg-slate-50 p-3 rounded border border-slate-100">
                            <p className="font-medium text-slate-800">{ref.title}</p>
                            <p className="text-slate-500 text-xs mb-1">
                              {ref.authors} ({ref.year}). <span className="italic">{ref.journal}</span>
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">
                                PH Local Study
                              </span>
                            </p>
                            <p className="text-slate-400 text-xs">• PMID: {ref.pmid}</p>
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