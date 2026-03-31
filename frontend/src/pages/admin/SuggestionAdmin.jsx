import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Calendar,
  User,
  Lightbulb,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:8080/api";

const SuggestionAdmin = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // For the review modal
  const [reviewing, setReviewing] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [submittingAction, setSubmittingAction] = useState(null); // "APPROVED" | "REJECTED" | null

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/suggestions`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch suggestions.");
      setSuggestions(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status) => {
    setSubmittingAction(status);
    try {
      const res = await fetch(
        `${API_BASE}/suggestions/${reviewing.suggestionId}/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status, adminNotes }),
        },
      );
      if (!res.ok) throw new Error("Failed to update suggestion.");
      setReviewing(null);
      setAdminNotes("");
      fetchSuggestions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingAction(null);
    }
  };

  const Spinner = () => (
    <svg
      className="animate-spin w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );

  const filteredSuggestions = suggestions
    .filter(
      (s) => filterStatus === "all" || s.status?.toLowerCase() === filterStatus,
    )
    .filter(
      (s) =>
        searchQuery === "" ||
        s.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.submitterEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.submitterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.suggestionType?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const statusCounts = {
    all: suggestions.length,
    pending: suggestions.filter((s) => s.status === "PENDING").length,
    approved: suggestions.filter((s) => s.status === "APPROVED").length,
    rejected: suggestions.filter((s) => s.status === "REJECTED").length,
  };

  const statusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      return (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          {Object.entries(parsed).map(([key, value]) => {
            if (!value) return null;
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            return (
              <div key={key} className="flex gap-2">
                <span className="font-semibold text-gray-600 min-w-[160px]">
                  {label}:
                </span>
                <span className="text-gray-800">{value}</span>
              </div>
            );
          })}
        </div>
      );
    } catch {
      return (
        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
          {content}
        </p>
      );
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Suggestion Management
        </h2>
        <p className="text-gray-600">
          Review and manage gene-disease association suggestions.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total",
            key: "all",
            icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
            border: "border-gray-200",
            text: "text-blue-600",
          },
          {
            label: "Pending Review",
            key: "pending",
            icon: <Eye className="w-8 h-8 text-yellow-600" />,
            border: "border-gray-200",
            text: "text-yellow-600",
          },
          {
            label: "Approved",
            key: "approved",
            icon: <CheckCircle className="w-8 h-8 text-green-600" />,
            border: "border-gray-200",
            text: "text-green-600",
          },
          {
            label: "Rejected",
            key: "rejected",
            icon: <XCircle className="w-8 h-8 text-red-600" />,
            border: "border-gray-200",
            text: "text-red-600",
          },
        ].map(({ label, key, icon, border, text }) => (
          <div
            key={key}
            className={`bg-white border-2 ${border} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${text}`}>{label}</p>
                <p className={`text-2xl font-bold ${text}`}>
                  {statusCounts[key]}
                </p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                {icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
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
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by content, name, or email..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">
          Loading suggestions...
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No suggestions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.suggestionId}
              className="bg-white border-2 border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {suggestion.suggestionType?.replace("_", " ")} Suggestion
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(suggestion.status)}`}
                    >
                      {suggestion.status?.charAt(0) +
                        suggestion.status?.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>
                        {suggestion.submitterName} ({suggestion.submitterEmail})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(suggestion.submittedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </p>
                  {renderContent(suggestion.content)}
                </div>

                {suggestion.referenceUrl && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Reference
                    </p>
                    <a
                      href={suggestion.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {suggestion.referenceUrl}
                    </a>
                  </div>
                )}

                {suggestion.adminNotes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Admin Notes
                    </p>
                    <p className="text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm">
                      {suggestion.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              {suggestion.status === "PENDING" && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setReviewing(suggestion);
                      setAdminNotes("");
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Eye className="w-5 h-5" />
                    Review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Review Suggestion
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              From {reviewing.submitterName} —{" "}
              {reviewing.suggestionType?.replace("_", " ")}
            </p>

            <div className="mb-4">
              {renderContent(reviewing.content)}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Notes{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add a note explaining your decision..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReview("APPROVED")}
                disabled={submittingAction !== null}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingAction === "APPROVED" ? (
                  <Spinner />
                ) : (
                  <CheckCircle size={18} />
                )}
                {submittingAction === "APPROVED" ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={() => handleReview("REJECTED")}
                disabled={submittingAction !== null}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingAction === "REJECTED" ? (
                  <Spinner />
                ) : (
                  <XCircle size={18} />
                )}
                {submittingAction === "REJECTED" ? "Rejecting..." : "Reject"}
              </button>

              <button
                onClick={() => setReviewing(null)}
                disabled={submittingAction !== null}
                className="px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionAdmin;