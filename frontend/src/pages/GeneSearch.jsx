    import { Search, Info, Dna, ChevronRight } from 'lucide-react';

const GeneSearch = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Gene Search</h2>
        <p className="text-slate-600">
          Search for genes and explore their associated diseases relevant to the Philippines population.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by gene symbol, name, or description..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
      </div>

      {/* Info Alert Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8 flex gap-4">
        <Info className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <h4 className="font-semibold text-blue-900">About Gene Search</h4>
          <p className="text-sm text-blue-800 mt-1">
            This tool allows you to explore genes and their disease associations. Click on any gene card to view detailed information including chromosome location, function, and associated diseases with prevalence data for the Philippines.
          </p>
        </div>
      </div>

      {/* Gene Card Result (Mock Data for HBB) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 flex justify-between items-center group">
        <div className="flex gap-4">
          {/* DNA Icon Box */}
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Dna size={24} />
          </div>
          
          {/* Card Content */}
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-lg font-bold text-blue-600">HBB</h3>
              <span className="text-sm text-slate-500">Chromosome 11</span>
            </div>
            
            <h4 className="font-semibold text-slate-900 mb-1">Hemoglobin Subunit Beta</h4>
            <p className="text-slate-600 text-sm mb-3">
              Encodes the beta chain of hemoglobin, essential for oxygen transport in red blood cells.
            </p>
            
            <div className="text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Function:</span>
              <p className="text-slate-700 mt-1">Oxygen transport and delivery to tissues</p>
            </div>
          </div>
        </div>

        {/* Chevron Arrow */}
        <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
      </div>

    </div>
  );
};

export default GeneSearch;