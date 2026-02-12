import { Search, Filter, Activity, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';

const DiseaseSearch = () => {
  // Mock Data based on your requirements
  const diseases = [
    {
      id: 1,
      name: "Beta-Thalassemia",
      category: "Blood / Hematologic",
      prevalence: "High",
      screening: true,
      genes: ["HBB"]
    },
    {
      id: 2,
      name: "G6PD Deficiency",
      category: "Blood / Hematologic",
      prevalence: "High",
      screening: true,
      genes: ["G6PD"]
    },
    {
      id: 3,
      name: "Maple Syrup Urine Disease",
      category: "Metabolic",
      prevalence: "Low",
      screening: true,
      genes: ["BCKDHA", "BCKDHB"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex gap-8">
      
      {/* Sidebar Filters */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Filter size={20} />
            <h3 className="font-bold">Filters</h3>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Category</h4>
            <div className="space-y-2">
              {['Blood / Hematologic', 'Metabolic', 'Neuromuscular', 'Sensory'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Prevalence Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">PH Prevalence</h4>
            <div className="space-y-2">
              {['High', 'Moderate', 'Rare'].map((prev) => (
                <label key={prev} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">{prev}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Screening Filter */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Newborn Screening</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-700">Included in PH Panel</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Disease Search</h2>
          <p className="text-slate-600">Browse diseases monitored in the Philippines.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search diseases (e.g. Thalassemia)..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Disease List */}
        <div className="space-y-4">
          {diseases.map((disease) => (
            <div key={disease.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {disease.name}
                    </h3>
                    {disease.screening && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} /> NBS Screened
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Activity size={16} />
                    <span>{disease.category}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>Prevalence: <strong className="text-slate-700">{disease.prevalence}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Associated Genes:</span>
                    <div className="flex gap-2">
                      {disease.genes.map(gene => (
                        <span key={gene} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                          {gene}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DiseaseSearch;