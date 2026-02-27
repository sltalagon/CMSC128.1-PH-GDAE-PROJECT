import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Calendar,
  User,
  Lightbulb,
  FileText,
  ExternalLink,
} from "lucide-react";

// Mock data for suggestions
const mockSuggestions = [
  {
    id: 1,
    geneSymbol: "HBB",
    diseaseName: "Beta-Thalassemia",
    comments:
      "This gene mutation is particularly prevalent in Southeast Asian populations including the Philippines. Studies show higher carrier rates in Luzon and Mindanao regions.",
    references: [
      {
        title: "Beta-thalassemia mutations in the Philippines",
        authors: "Santos MC, dela Cruz JA, Reyes AB",
        journal: "Southeast Asian Journal of Tropical Medicine",
        year: "2023",
        doi: "10.1234/seajtm.2023.001",
        pmid: "12345678",
      },
    ],
    submittedBy: "researcher@phgdae.edu.ph",
    submittedDate: "2026-02-15",
    status: "pending",
  },
  {
    id: 2,
    geneSymbol: "APOE",
    diseaseName: "Alzheimer's Disease",
    comments:
      "APOE4 variant shows significant association with late-onset Alzheimer's in Filipino elderly population.",
    references: [
      {
        title: "APOE genotypes and Alzheimer's risk in Filipino population",
        authors: "Garcia MR, Santos LT, Cruz PD",
        journal: "Philippine Journal of Neurology",
        year: "2024",
        doi: "10.1234/pjn.2024.045",
        pmid: "23456789",
      },
    ],
    submittedBy: "student@up.edu.ph",
    submittedDate: "2026-02-14",
    status: "pending",
  },
  {
    id: 3,
    geneSymbol: "TCF7L2",
    diseaseName: "Type 2 Diabetes",
    comments:
      "Strong genetic association observed in Filipino cohort studies. Risk allele frequency appears higher than in other Asian populations.",
    references: [
      {
        title:
          "TCF7L2 polymorphisms and Type 2 Diabetes susceptibility in Filipinos",
        authors: "Reyes AA, Mendoza BC, Torres CD",
        journal: "Asian Diabetes Research",
        year: "2025",
        doi: "10.1234/adr.2025.089",
        pmid: "",
      },
      {
        title: "Genetic risk factors for diabetes in Southeast Asia",
        authors: "Lee KH, Santos MJ",
        journal: "Diabetes International",
        year: "2024",
        doi: "10.1234/di.2024.234",
        pmid: "34567890",
      },
    ],
    submittedBy: "doctor@pgh.gov.ph",
    submittedDate: "2026-02-13",
    status: "approved",
  },
  {
    id: 4,
    geneSymbol: "",
    diseaseName: "Hypertension",
    comments:
      "Request to add more genetic variants associated with hypertension, particularly those studied in Filipino populations.",
    references: [
      {
        title: "Hypertension genetics in the Philippines",
        authors: "Aquino JR, Santos FG",
        journal: "Philippine Heart Journal",
        year: "2023",
        doi: "",
        pmid: "45678901",
      },
    ],
    submittedBy: "researcher@ust.edu.ph",
    submittedDate: "2026-02-12",
    status: "rejected",
  },
  {
    id: 5,
    geneSymbol: "G6PD",
    diseaseName: "",
    comments:
      "G6PD deficiency is common in the Philippines. Multiple variants need to be documented with regional prevalence data.",
    references: [
      {
        title: "G6PD deficiency variants in Filipino populations",
        authors: "Ramos EF, Cruz AB, Santos DC",
        journal: "Philippine Journal of Hematology",
        year: "2025",
        doi: "10.1234/pjh.2025.067",
        pmid: "56789012",
      },
    ],
    submittedBy: "lab@nkti.gov.ph",
    submittedDate: "2026-02-10",
    status: "pending",
  },
];

const SuggestionAdmin = ({ onClose }) => {
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleApprove = (suggestionId) => {
    // TODO: Connect to Spring Boot API
    /*
    try {
      const response = await fetch(`http://localhost:8080/api/admin/suggestions/${suggestionId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        toast.success('Suggestion approved successfully!');
        // Refresh suggestions list
      }
    } catch (error) {
      toast.error('Error approving suggestion');
    }
    */

    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, status: "approved" } : s,
      ),
    );
    toast.success("Suggestion approved successfully!");
  };

  const handleReject = (suggestionId) => {
    // TODO: Connect to Spring Boot API
    /*
    try {
      const response = await fetch(`http://localhost:8080/api/admin/suggestions/${suggestionId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        toast.success('Suggestion rejected');
        // Refresh suggestions list
      }
    } catch (error) {
      toast.error('Error rejecting suggestion');
    }
    */

    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, status: "rejected" } : s,
      ),
    );
    toast.success("Suggestion rejected");
  };

  const filteredSuggestions = suggestions
    .filter((s) => filterStatus === "all" || s.status === filterStatus)
    .filter(
      (s) =>
        searchQuery === "" ||
        s.geneSymbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.diseaseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.submittedBy?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const statusCounts = {
    all: suggestions.length,
    pending: suggestions.filter((s) => s.status === "pending").length,
    approved: suggestions.filter((s) => s.status === "approved").length,
    rejected: suggestions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="container mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Suggestion Management Panel
        </h2>
        <p className="text-gray-600">
          Review and manage gene-disease association suggestions from
          researchers and students.
        </p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">
                {statusCounts.all}
              </p>
            </div>
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-800">
                {statusCounts.pending}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-800">
                {statusCounts.approved}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-800">
                {statusCounts.rejected}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Suggestions</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by gene, disease, or submitter..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No suggestions found</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {suggestion.geneSymbol && suggestion.diseaseName
                        ? `${suggestion.geneSymbol} ↔ ${suggestion.diseaseName}`
                        : suggestion.geneSymbol ||
                          suggestion.diseaseName ||
                          "General Suggestion"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        suggestion.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : suggestion.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {suggestion.status.charAt(0).toUpperCase() +
                        suggestion.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{suggestion.submittedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(suggestion.submittedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Gene and Disease */}
                <div className="grid md:grid-cols-2 gap-4">
                  {suggestion.geneSymbol && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Gene Symbol
                      </p>
                      <p className="text-gray-900">{suggestion.geneSymbol}</p>
                    </div>
                  )}
                  {suggestion.diseaseName && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Disease Name
                      </p>
                      <p className="text-gray-900">{suggestion.diseaseName}</p>
                    </div>
                  )}
                </div>

                {/* Comments */}
                {suggestion.comments && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Comments
                    </p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {suggestion.comments}
                    </p>
                  </div>
                )}

                {/* References */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    References ({suggestion.references.length})
                  </p>
                  <div className="space-y-3">
                    {suggestion.references.map((ref, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <p className="font-semibold text-gray-900 mb-2">
                          {ref.title}
                        </p>
                        <p className="text-sm text-gray-700 mb-1">
                          {ref.authors}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{ref.journal}</span> (
                          {ref.year})
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          {ref.doi && (
                            <a
                              href={`https://doi.org/${ref.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                              DOI: {ref.doi}
                            </a>
                          )}
                          {ref.pmid && (
                            <a
                              href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                              PMID: {ref.pmid}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {suggestion.status === "pending" && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(suggestion.id)}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(suggestion.id)}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestionAdmin;
