import { useState, useEffect, useMemo } from "react";
import { apiGet } from "../../api/api";
import { Search, Filter, Info, Dna, ChevronRight } from "lucide-react";
import GeneModal from "../../components/GeneModal";

const GeneSearch = () => {
  const [genes, setGenes] = useState([]);
  const [geneDiseases, setGeneDiseases] = useState([]);
  const [geneCategories, setGeneCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGeneTypes, setSelectedGeneTypes] = useState([]);
  const [selectedGene, setSelectedGene] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genesData, geneDiseaseData, geneCategoryData] =
          await Promise.all([
            apiGet("/genes"),
            apiGet("/genedisease"),
            apiGet("/gene-categories"),
          ]);

        setGenes(genesData);
        setGeneDiseases(geneDiseaseData);
        setGeneCategories(geneCategoryData);
      } catch (err) {
        setError(err.message || "Failed to fetch gene data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const geneToDiseasesMap = useMemo(() => {
    const map = {};
    geneDiseases.forEach((gd) => {
      const gId = gd.gene?.geneId;
      const disease = gd.disease;

      if (gId && disease) {
        if (!map[gId]) map[gId] = [];

        map[gId].push({
          name: disease.diseaseName,
          type: disease.diseaseCategory || "Unknown Category",
          description:
            disease.diseaseDescription || "No description available.",
          associationType: "Associated",
          confidence: "Verified",
          references: [],
        });
      }
    });
    return map;
  }, [geneDiseases]);

  const getCategoriesForGene = (geneId) => {
    return geneCategories
      .filter((gc) => gc.gene?.geneId === geneId)
      .map((gc) => ({
        name: gc.functionalCategory?.categoryName,
        description: gc.functionalCategory?.description,
      }))
      .filter((cat) => cat.name);
  };

  // Extract unique gene types for the filter sidebar
  const geneTypes = [...new Set(genes.map((g) => g.geneType).filter(Boolean))];

  const filteredGenes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return genes.filter((gene) => {
      // 1. Check Search Query
      const matchesSearch =
        gene.geneSymbol?.toLowerCase().includes(query) ||
        gene.fullGeneName?.toLowerCase().includes(query) ||
        gene.description?.toLowerCase().includes(query);

      // 2. Check Type Filter
      const matchesType =
        selectedGeneTypes.length === 0 ||
        selectedGeneTypes.includes(gene.geneType);

      return matchesSearch && matchesType;
    });
  }, [genes, searchQuery, selectedGeneTypes]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex gap-8">
      {/* Sidebar Filters */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <Filter size={20} />
            <h3 className="font-bold">Filters</h3>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">
              Gene Type
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="geneType"
                  checked={selectedGeneTypes.length === 0}
                  onChange={() => setSelectedGeneTypes([])}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">All</span>
              </label>
              {geneTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="geneType"
                    checked={selectedGeneTypes.includes(type)}
                    onChange={() => setSelectedGeneTypes([type])}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 capitalize">
                    {type.replace("_", "-").toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Gene Search</h2>
          <p className="text-slate-600">
            Search for genes and explore their associated diseases relevant to
            the Philippines population.
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6 flex gap-4">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">
              About Gene Search
            </h4>
            <p className="text-sm text-blue-800 mt-1">
              Click on any gene card to view detailed information including gene
              type, function, and associated diseases with prevalence data for
              the Philippines.
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-3.5 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by gene symbol, name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-500">
            Loading genes...
          </div>
        ) : filteredGenes.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No genes found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGenes.map((gene) => {
              const associatedDiseases = geneToDiseasesMap[gene.geneId] || [];

              return (
                <div
                  key={gene.geneId}
                  onClick={() => setSelectedGene(gene)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 flex justify-between items-start group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Dna size={24} />
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-lg font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                          {gene.geneSymbol}
                        </h3>
                        <span className="text-sm text-slate-500 capitalize">
                          {gene.geneType?.replace("_", "-").toLowerCase()}
                        </span>
                      </div>

                      <h4 className="font-semibold text-slate-900 mb-1">
                        {gene.fullGeneName}
                      </h4>

                      {gene.description && (
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {gene.description}
                        </p>
                      )}

                      {associatedDiseases.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-500 uppercase">
                            Associated Diseases:
                          </span>
                          {associatedDiseases.map((disease, idx) => (
                            <span
                              key={idx}
                              className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium border border-red-100"
                            >
                              {disease.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-2" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <GeneModal
        isOpen={!!selectedGene}
        onClose={() => setSelectedGene(null)}
        geneData={
          selectedGene
            ? {
                symbol: selectedGene.geneSymbol,
                name: selectedGene.fullGeneName,
                chromosome: selectedGene.chromosomeLocation || "Location N/A",
                ncbiId: selectedGene.ncbiId || "N/A",
                omimId: selectedGene.omimId || "N/A",
                description:
                  selectedGene.description || "No description provided.",
                associatedDiseases:
                  geneToDiseasesMap[selectedGene.geneId] || [],
                functionalCategories: getCategoriesForGene(selectedGene.geneId),
              }
            : null
        }
      />
    </div>
  );
};

export default GeneSearch;
