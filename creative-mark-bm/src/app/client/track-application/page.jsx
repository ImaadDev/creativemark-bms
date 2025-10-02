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
        return "bg-amber-50 text-amber-900 border-l-4 border-amber-600";
      case "in_process":
        return "bg-purple-50 text-purple-900 border-l-4 border-purple-600";
      case "completed":
        return "bg-amber-50 text-amber-900 border-l-4 border-amber-600";
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
        return "bg-amber-100 text-amber-800";
      case "in_process":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-amber-100 text-amber-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        {/* Header Section */}
        <div className="backdrop-blur-sm border-b" style={{
          background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
          borderBottomColor: 'rgba(255, 209, 122, 0.2)'
        }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
                  <span className="text-sm font-medium uppercase tracking-wider" style={{ color: 'rgba(255, 209, 122, 0.8)' }}>Applications</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: '#ffd17a' }}>
                  My Applications
                </h1>
                <p className="text-base sm:text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Track and manage your business applications
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={fetchApplications}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider border transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                  style={{
                    backgroundColor: 'rgba(255, 209, 122, 0.1)',
                    color: '#ffd17a',
                    borderColor: 'rgba(255, 209, 122, 0.3)',
                    borderRadius: '12px'
                  }}
                >
                  <span className="group-hover:scale-105 transition-transform duration-300">{loading ? "Loading..." : "Refresh"}</span>
                </button>
                <button
                  onClick={() => router.push("/client/application")}
                  className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-lg group"
                  style={{
                    background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                    color: '#242021',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                  }}
                >
                  <span className="group-hover:scale-105 transition-transform duration-300">+ New Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '20px',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(239, 68, 68, 0.2)'
               }}>
            <div className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center shadow-lg"
                       style={{
                         background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                         borderRadius: '12px',
                         boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                       }}>
                    <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Applications</h3>
                  <p className="text-base text-gray-700 mb-6">{error}</p>
                  <button
                    onClick={fetchApplications}
                    className="px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-lg group"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <span className="group-hover:scale-105 transition-transform duration-300">Try Again</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '20px',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 209, 122, 0.1)'
               }}>
            <div className="p-16">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 flex items-center justify-center shadow-xl"
                       style={{
                         background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                         borderRadius: '16px',
                         boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                       }}>
                    <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                  </div>
                </div>
                <span className="text-lg font-semibold text-gray-700">Loading applications...</span>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && !error && applications.length > 0 && (
          <>
            <div className="hidden lg:block bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                 style={{
                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                   borderRadius: '20px',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                   border: '1px solid rgba(255, 209, 122, 0.1)'
                 }}>
              <table className="w-full">
                <thead>
                  <tr className="text-white" style={{
                    background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)'
                  }}>
                    <th className="px-8 py-6 text-left text-xs font-bold uppercase tracking-wider">
                      Application ID
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-8 py-6 text-center text-xs font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(255, 209, 122, 0.1)' }}>
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-white/50 transition-all duration-300 group"
                      style={{ backgroundColor: 'rgba(248, 249, 250, 0.8)' }}
                    >
                      <td className="px-8 py-5">
                        <span className="font-mono text-sm text-gray-900 font-semibold">
                          {app._id}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-semibold text-gray-900">
                          {app.serviceType}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`inline-block px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-300 group-hover:scale-105 ${getStatusBadgeStyle(
                            app.status
                          )}`}
                          style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                        >
                          {app.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(app.createdAt || app.submittedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <button
                          onClick={() => router.push(`/client/track-application/${app._id}`)}
                          className="px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-lg group"
                          style={{
                            background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                            color: '#242021',
                            borderRadius: '12px',
                            boxShadow: '0 6px 20px rgba(255, 209, 122, 0.3)'
                          }}
                        >
                          <span className="group-hover:scale-105 transition-transform duration-300">View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white border-0 overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    borderRadius: '5px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 209, 122, 0.1)'
                  }}
                >
                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#ffd17a' }}></div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Application Details
                          </h3>
                        </div>
                        <p className="font-mono text-sm font-semibold text-gray-900 break-all mb-2">
                          {app._id}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-300 group-hover:scale-105 ${getStatusBadgeStyle(
                          app.status
                        )}`}
                        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#ffd17a' }}></div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Service Type
                          </h3>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {app.serviceType}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#ffd17a' }}></div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Submitted
                          </h3>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(app.createdAt || app.submittedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => router.push(`/client/track-application/${app._id}`)}
                        className="px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-lg group"
                        style={{
                          background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                          color: '#242021',
                          borderRadius: '12px',
                          boxShadow: '0 6px 20px rgba(255, 209, 122, 0.3)'
                        }}
                      >
                        <span className="group-hover:scale-105 transition-transform duration-300">View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '20px',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 209, 122, 0.1)'
               }}>
            <div className="text-center p-16 sm:p-24">
              <div className="max-w-lg mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 flex items-center justify-center mx-auto shadow-xl"
                       style={{
                         background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                         borderRadius: '20px',
                         boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                       }}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 text-base sm:text-lg mb-10 leading-relaxed">
                  You haven't submitted any applications yet. Start your first business registration application today.
                </p>
                <button
                  onClick={() => router.push("/client/application")}
                  className="px-10 py-5 text-base font-bold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-lg group"
                  style={{
                    background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                    color: '#242021',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                  }}
                >
                  <span className="group-hover:scale-105 transition-transform duration-300">Start New Application</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}