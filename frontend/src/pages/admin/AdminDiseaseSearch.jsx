import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../api/api";
import { Search, Filter, Activity, ChevronRight, CheckCircle } from "lucide-react";

// 1. IMPORT THE DISEASE MODAL
// Ensure this path matches where your DiseaseModal component actually lives
import DiseaseModal from "../../components/DiseaseModal"; 

const AdminDiseaseSearch = () => {
  const [diseases, setDiseases] = useState([]);
  const [geneDiseases, setGeneDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrevalences, setSelectedPrevalences] = useState([]);

  // 2. STATE TO TRACK WHICH DISEASE IS CLICKED
  const [selectedDisease, setSelectedDisease] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [diseasesData, geneDiseaseData] = await Promise.all([
          apiGet("/diseases"),
          apiGet("/genedisease"),
        ]);

        setDiseases(diseasesData);
        setGeneDiseases(geneDiseaseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get associated gene symbols for a given diseaseId (used for the small tags on the card)
  const getGenesForDisease = (diseaseId) => {
    return geneDiseases
      .filter((gd) => gd.disease?.diseaseId === diseaseId)
      .map((gd) => gd.gene?.geneSymbol)
      .filter(Boolean);
  };

  // 3. GET DETAILED GENES FORMATTED FOR THE MODAL
  const getDetailedGenesForModal = (diseaseId) => {
    return geneDiseases
      .filter((gd) => gd.disease?.diseaseId === diseaseId)
      .map((gd) => ({
        symbol: gd.gene?.geneSymbol || "Unknown",
        name: gd.gene?.fullGeneName || "Unknown Gene",
        chromosome: gd.gene?.chromosome || "N/A",
        // Defaulting these in case your API doesn't have them yet
        associationType: gd.associationType || "Associated",
        confidence: gd.confidenceScore || "High",
        description: gd.gene?.description || "No description available.",
        function: gd.gene?.function || "No function data available.",
        references: gd.references || [] 
      }));
  };

  // 4. CLICK HANDLER TO FORMAT DATA FOR THE MODAL
  const handleDiseaseClick = (disease) => {
    // We map your backend fields to the fields the modal expects (like "name" and "symptoms")
    setSelectedDisease({
      ...disease,
      name: disease.diseaseName, 
      description: disease.description || "No detailed description provided for this disease.",
      // Fallback to empty array if symptoms don't exist in your API yet
      symptoms: disease.symptoms || ["Data on symptoms currently unavailable."], 
      associatedGenes: getDetailedGenesForModal(disease.diseaseId)
    });
  };

  const toggleFilter = (value, list, setList) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const categories = [...new Set(diseases.map((d) => d.diseaseCategory).filter(Boolean))];
  const prevalences = ["HIGH", "MEDIUM", "LOW", "NONE"];

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.diseaseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.diseaseCategory?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(disease.diseaseCategory);

    const matchesPrevalence =
      selectedPrevalences.length === 0 ||
      selectedPrevalences.includes(disease.phPrevalence);

    return matchesSearch && matchesCategory && matchesPrevalence;
  });

  return (
    // Added 'relative' to the parent div
    <div className="max-w-6xl mx-auto py-8 px-4 flex gap-8 relative">
      {/* Sidebar Filters */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Filter size={20} />
            <h3 className="font-bold">Filters</h3>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">
              Category
            </h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() =>
                      toggleFilter(cat, selectedCategories, setSelectedCategories)
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Prevalence Filter */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">
              PH Prevalence
            </h4>
            <div className="space-y-2">
              {prevalences.map((prev) => (
                <label key={prev} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPrevalences.includes(prev)}
                    onChange={() =>
                      toggleFilter(prev, selectedPrevalences, setSelectedPrevalences)
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{prev}</span>
                </label>
              ))}
            </div>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* States */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading diseases...</div>
        ) : filteredDiseases.length === 0 ? (
          <div className="text-center py-16 text-slate-500">No diseases found.</div>
        ) : (
          <div className="space-y-4">
            {filteredDiseases.map((disease) => {
              const associatedGenes = getGenesForDisease(disease.diseaseId);
              return (
                <div
                  key={disease.diseaseId}
                  // 5. TRIGGER CLICK HANDLER
                  onClick={() => handleDiseaseClick(disease)}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                        {disease.diseaseName}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Activity size={16} />
                        <span>{disease.diseaseCategory}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>
                          Prevalence:{" "}
                          <strong className="text-slate-700">{disease.phPrevalence}</strong>
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Inheritance: <strong className="text-slate-700">{disease.inheritancePattern}</strong></span>
                      </div>

                      {associatedGenes.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase">
                            Associated Genes:
                          </span>
                          <div className="flex gap-2 flex-wrap">
                            {associatedGenes.map((gene) => (
                              <span
                                key={gene}
                                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100"
                              >
                                {gene}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. RENDER THE DISEASE MODAL */}
      <DiseaseModal 
        isOpen={!!selectedDisease} 
        onClose={() => setSelectedDisease(null)} 
        diseaseData={selectedDisease} 
      />
    </div>
  );
};

export default AdminDiseaseSearch;