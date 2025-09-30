"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaBuilding,
  FaUsers,
  FaDollarSign,
  FaHome,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaChartLine,
  FaFlag,
  FaComments,
  FaDownload,
  FaCog
} from "react-icons/fa";
import { getApplication, getApplicationProgress } from "../../../../services/applicationService";
import Timeline from "../../../../components/Timeline";
import { FullPageLoading } from "../../../../components/LoadingSpinner";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id;
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);
  
  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch application details and progress in parallel
      const [applicationResponse, progressResponse] = await Promise.all([
        getApplication(applicationId),
        getApplicationProgress(applicationId)
      ]);
  
      // Store application data
      setApplication(applicationResponse.data);
      
      // Store progress data
      setProgressData(progressResponse.data);
      
      console.log("Application Data:", applicationResponse.data);
      console.log("Progress Data:", progressResponse.data);
    } catch (err) {
      console.error("Error fetching application:", err);
      setError(err.message || "Failed to fetch application details");
    } finally {
      setLoading(false);
    }
  };
  

  const getStatusStyle = (status) => {
    switch (status) {
      case "submitted":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200";
      case "under_review":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-200";
      case "approved":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-green-200";
      case "in_process":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-200";
      case "completed":
        return "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-300";
      case "rejected":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-200";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatStatus = (status) => {
    if (!status) return "UNKNOWN";
    return String(status).replace("_", " ").toUpperCase();
  };

  const getProgressPercentage = () => {
    return progressData?.progressPercentage || 0;
  };

  if (loading) {
    return <FullPageLoading text="Loading Application Details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur-sm border border-red-200/50 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                <svg className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900">Error loading application</h3>
                <p className="mt-2 text-red-700">{error}</p>
                <button
                  onClick={fetchApplicationDetails}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Application not found</h3>
            <p className="text-gray-600">The requested application could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group transition-all duration-200"
              >
                <div className="mr-2 p-1 rounded-full group-hover:bg-gray-100 transition-colors duration-200">
                  <FaArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Back to Applications</span>
              </button>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Application Details
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                    <p className="text-sm font-mono text-gray-600">ID: {application._id}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
                <span className={`inline-flex items-center px-6 py-3 text-sm font-bold uppercase rounded-xl shadow-lg ${getStatusStyle(progressData?.currentStatus || application.status?.current || application.status)}`}>
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  {formatStatus(progressData?.currentStatus || application.status?.current || application.status)}
                </span>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 mb-2">Progress</p>
                <div className="flex items-center space-x-3">
                  <div className="relative w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                      style={{ width: `${getProgressPercentage()}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {getProgressPercentage()}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Client Information */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <FaUser className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-lg font-semibold text-gray-900">{application.client?.name || application.serviceDetails?.client?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <p className="text-lg font-semibold text-gray-900">{application.client?.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-lg font-semibold text-gray-900">{application.client?.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Nationality</label>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                      <p className="text-lg font-semibold text-gray-900">{application.client?.nationality || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Information */}
            {(application.partner || application.serviceDetails?.partner) && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaUser className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Partner Information</h2>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Partner Name</label>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <p className="text-lg font-semibold text-gray-900">{(application.partner || application.serviceDetails?.partner)?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <p className="text-lg font-semibold text-gray-900">{(application.partner || application.serviceDetails?.partner)?.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <p className="text-lg font-semibold text-gray-900">{(application.partner || application.serviceDetails?.partner)?.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Overview */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <FaFileAlt className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Application Overview</h2>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Service Type</label>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-lg font-semibold text-gray-900">{application.serviceDetails?.serviceType || application.serviceType || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Partner Type</label>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <p className="text-lg font-semibold text-gray-900">{application.serviceDetails?.partnerType || application.partnerType || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">External Companies</label>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-lg font-semibold text-gray-900">{application.serviceDetails?.externalCompaniesCount || application.externalCompaniesCount || 0}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Virtual Office</label>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${(application.serviceDetails?.needVirtualOffice || application.needVirtualOffice) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-lg font-semibold text-gray-900">
                          {(application.serviceDetails?.needVirtualOffice || application.needVirtualOffice) ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {(application.serviceDetails?.projectEstimatedValue || application.projectEstimatedValue) && (
                    <div className="md:col-span-2 space-y-3">
                      <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide">Project Estimated Value</label>
                      <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                        <p className="text-2xl font-bold text-gray-900">
                          {(() => {
                            const value = application.serviceDetails?.projectEstimatedValue || application.projectEstimatedValue;
                            return typeof value === 'number' ? value.toLocaleString() : value;
                          })()} SAR
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* External Companies Details */}
            {((application.serviceDetails?.externalCompaniesDetails || application.externalCompaniesDetails) && (application.serviceDetails?.externalCompaniesDetails || application.externalCompaniesDetails).length > 0) && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaBuilding className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">External Companies</h2>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid gap-6">
                    {(application.serviceDetails?.externalCompaniesDetails || application.externalCompaniesDetails).map((company, index) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-gray-900">Company #{index + 1}</h3>
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {company.sharePercentage || 0}% Share
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Company Name</label>
                            <p className="text-gray-900 font-medium">{company.companyName || "N/A"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Country</label>
                            <p className="text-gray-900 font-medium">{company.country || "N/A"}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-500 mb-2">CR Number</label>
                            <p className="text-gray-900 font-mono font-medium">{company.crNumber || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Family Members */}
            {((application.serviceDetails?.familyMembers || application.familyMembers) && (application.serviceDetails?.familyMembers || application.familyMembers).length > 0) && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaUsers className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Family Members</h2>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid gap-6">
                    {(application.serviceDetails?.familyMembers || application.familyMembers).map((member, index) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Family Member #{index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Full Name</label>
                            <p className="text-gray-900 font-medium">{member.name || "N/A"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Relationship</label>
                            <p className="text-gray-900 font-medium">{member.relation || "N/A"}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">Passport Number</label>
                            <p className="text-gray-900 font-mono font-medium">{member.passportNo || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {application.documents && application.documents.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaFileAlt className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Uploaded Documents</h2>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {application.documents.map((doc, index) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 group/doc">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{doc.type}</h3>
                            <p className="text-sm text-gray-500">Uploaded on {formatDate(doc.createdAt)}</p>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group-hover/doc:scale-105"
                          >
                            <FaEye className="w-4 h-4 mr-2" />
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Application Timeline */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <FaClock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Timeline</h2>
                </div>
              </div>
              <div className="p-6">
                <Timeline 
                  events={progressData?.timeline || application.timeline || []} 
                  currentStatus={progressData?.currentStatus || application.status?.current || application.status}
                  progressData={progressData}
                />
              </div>
            </div>

            {/* Application Info */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <FaCog className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Application Info</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Application ID</label>
                  <p className="text-gray-900 font-mono text-sm break-all">{application.applicationId || application._id}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Submitted</label>
                  <p className="text-gray-900 font-medium">{formatDate(application.timestamps?.createdAt || application.createdAt)}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Updated</label>
                  <p className="text-gray-900 font-medium">{formatDate(application.timestamps?.updatedAt || application.updatedAt)}</p>
                </div>
                {(application.status?.approvedBy || application.approvedBy) && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Approved By</label>
                    <p className="text-gray-900 font-medium">{(application.status?.approvedBy || application.approvedBy)?.fullName || (application.status?.approvedBy || application.approvedBy)?.name || "N/A"}</p>
                  </div>
                )}
                {(application.status?.approvedAt || application.approvedAt) && (
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Approved At</label>
                    <p className="text-gray-900 font-medium">{formatDate(application.status?.approvedAt || application.approvedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Employees */}
            {application.assignedEmployees && application.assignedEmployees.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaUsers className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Assigned Team</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {application.assignedEmployees.map((employee, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {employee.fullName?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{employee.fullName || employee.name}</h3>
                            <p className="text-sm text-gray-600 font-medium">{employee.position || employee.role}</p>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {application.payment && (
              <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="px-6 py-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaDollarSign className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Info</h2>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
                    <p className="text-2xl font-bold text-gray-900">{application.payment?.amount || 0} SAR</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Method</label>
                    <p className="text-gray-900 font-medium">{application.payment?.method || "N/A"}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        application.payment?.status === 'paid' ? 'bg-green-500' : 
                        application.payment?.status === 'pending' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}></div>
                      <p className="text-gray-900 font-medium capitalize">{application.payment?.status || "N/A"}</p>
                    </div>
                  </div>
                  {application.payment?.paidAt && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paid At</label>
                      <p className="text-gray-900 font-medium">{formatDate(application.payment.paidAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}