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

  // Fetch applications on component mount
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
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "under_review":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-50 text-green-800 border-green-200";
      case "in_process":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-600 text-white border-green-600";
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              My Applications
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Track and manage your business applications
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={fetchApplications}
              disabled={loading}
              className="px-4 py-2.5 bg-gray-600 text-white text-sm font-semibold uppercase tracking-wide shadow-md hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={() => router.push("/client/application")}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold uppercase tracking-wide shadow-md hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
            >
              + New Application
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading applications</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchApplications}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-gray-600">Loading applications...</span>
            </div>
          </div>
        )}

        {/* Applications Table */}
        {!loading && !error && applications.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 uppercase tracking-wide">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700 uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr
                    key={app._id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-all duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-gray-800 text-sm">
                      {app._id}
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {app.serviceType}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase border ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {app.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(app.createdAt || app.submittedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => router.push(`/client/track-application/${app._id}`)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs sm:text-sm font-semibold uppercase shadow-sm hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
                      >
                        View Application
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-500 text-base mb-6">
                You haven't submitted any applications yet. Start your first business registration application.
              </p>
              <button
                onClick={() => router.push("/client/application")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-semibold uppercase tracking-wide shadow-md hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
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