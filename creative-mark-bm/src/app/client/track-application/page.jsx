"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserApplications } from "../../../services/applicationService";
import { useAuth } from "../../../contexts/AuthContext";

export default function MyApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Current user in track application:", user);
      console.log("Fetching user applications...");
      const response = await getUserApplications();
      console.log("Applications response:", response);
      setApplications(response.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 text-blue-900 border-l-4 border-blue-600";
      case "under_review":
        return "bg-amber-50 text-amber-900 border-l-4 border-amber-600";
      case "approved":
        return "bg-emerald-50 text-emerald-900 border-l-4 border-emerald-600";
      case "in_process":
        return "bg-purple-50 text-purple-900 border-l-4 border-purple-600";
      case "completed":
        return "bg-green-50 text-green-900 border-l-4 border-green-600";
      case "rejected":
        return "bg-red-50 text-red-900 border-l-4 border-red-600";
      default:
        return "bg-gray-50 text-gray-900 border-l-4 border-gray-400";
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "in_process":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 border-b-2 border-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
                  My Applications
                </h1>
                <p className="text-amber-100 text-sm sm:text-base">
                  Track and manage your business applications
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={fetchApplications}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold uppercase tracking-wider border border-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
                <button
                  onClick={() => router.push("/client/application")}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg"
                >
                  + New Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-900 mb-1">Error Loading Applications</h3>
                <p className="text-sm text-red-800 mb-4">{error}</p>
                <button
                  onClick={fetchApplications}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold uppercase tracking-wide transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-50 border-l-4 border-amber-600 p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
              <span className="text-gray-700 font-medium">Loading applications...</span>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && !error && applications.length > 0 && (
          <>
            <div className="hidden lg:block bg-white border-2 border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-stone-900 to-amber-950 text-white">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-amber-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900 font-medium">
                          {app._id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {app.serviceType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadgeStyle(
                            app.status
                          )}`}
                        >
                          {app.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {new Date(app.createdAt || app.submittedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => router.push(`/client/track-application/${app._id}`)}
                          className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className={`bg-white border-2 border-gray-200 overflow-hidden ${getStatusStyle(
                    app.status
                  )}`}
                >
                  <div className="p-4 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                          Application ID
                        </h3>
                        <p className="font-mono text-sm font-medium text-gray-900 break-all">
                          {app._id}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusBadgeStyle(
                          app.status
                        )}`}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                          Service Type
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                          {app.serviceType}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                          Submitted
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(app.createdAt || app.submittedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/client/track-application/${app._id}`)}
                      className="w-full px-5 py-3 bg-amber-900 hover:bg-amber-950 text-white text-sm font-bold uppercase tracking-wider transition-all duration-200"
                    >
                      View Application Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="text-center py-16 sm:py-24 bg-gray-50 border-2 border-gray-200">
            <div className="max-w-md mx-auto px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                No Applications Yet
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
                You haven't submitted any applications yet. Start your first business registration application today.
              </p>
              <button
                onClick={() => router.push("/client/application")}
                className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-950 text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg"
              >
                Start New Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}