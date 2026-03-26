import { useState, useEffect } from "react";
import { apiGet } from "../../api/api";
import { Search, Info, Dna, ChevronRight } from "lucide-react";
import GeneModal from "../../components/GeneModal"; 

const AdminGeneSearch = () => {
  const [genes, setGenes] = useState([]);
  const [geneDiseases, setGeneDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGene, setSelectedGene] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genesData, geneDiseaseData] = await Promise.all([
          apiGet("/genes"),
          apiGet("/genedisease"),
        ]);

        setGenes(genesData);
        setGeneDiseases(geneDiseaseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDetailedDiseasesForModal = (geneId) => {
    return geneDiseases
      .filter((gd) => gd.gene?.geneId === geneId)
      .map((gd) => ({
        diseaseId: gd.disease?.diseaseId,
        name: gd.disease?.diseaseName || "Unknown Disease",
        category: gd.disease?.diseaseCategory || "N/A",
        prevalence: gd.disease?.phPrevalence || "NONE",
        inheritance: gd.disease?.inheritancePattern || "N/A",
        associationType: gd.associationType || "Associated"
      }));
  };

  const handleGeneClick = (gene) => {
    const hasLocation = gene.chromosome && gene.chromosome.toString().trim() !== "";

    setSelectedGene({
      ...gene,
      symbol: gene.geneSymbol,
      name: gene.fullGeneName,
      // Logic for Chromosome Location fallback
      location: hasLocation ? `Chromosome ${gene.chromosome}` : "Location N/A",
      description: gene.description || "No description provided.",
      biologicalFunction: gene.function || "Function details not available.",
      ncbiId: gene.ncbiId || "N/A",
      omimId: gene.omimId || "123", 
      associatedDiseases: getDetailedDiseasesForModal(gene.geneId)
    });
  };

  const filteredGenes = genes.filter((gene) =>
    gene.geneSymbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gene.fullGeneName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gene.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Gene Search</h2>
        <p className="text-slate-600">
          Search for genes and explore their associated diseases relevant to the
          Philippines population.
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by gene symbol, name, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8 flex gap-4">
        <Info className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <h4 className="font-semibold text-blue-900">About Gene Search</h4>
          <p className="text-sm text-blue-800 mt-1">
            Click on any gene card to view detailed information including gene type,
            function, and associated diseases with prevalence data for the Philippines.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading genes...</div>
      ) : filteredGenes.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No genes found.</div>
      ) : (
        <div className="space-y-4">
          {filteredGenes.map((gene) => (
            <div
              key={gene.geneId}
              onClick={() => handleGeneClick(gene)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 flex justify-between items-center group"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Dna size={24} />
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-lg font-bold text-blue-600">{gene.geneSymbol}</h3>
                    <span className="text-sm text-slate-500 capitalize">
                      {gene.geneType?.replace("_", "-").toLowerCase()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{gene.fullGeneName}</h4>
                  {gene.description && (
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {gene.description}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {selectedGene && (
        <GeneModal 
          isOpen={true} 
          onClose={() => setSelectedGene(null)} 
          geneData={selectedGene}
        />
      )}
    </div>
  );
};

export default AdminGeneSearch;