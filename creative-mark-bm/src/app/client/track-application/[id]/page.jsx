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
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center mb-6 group transition-all duration-300 hover:translate-x-[-2px]"
                  style={{ color: 'gray' }}
                >
                  <div className="mr-3 p-2 group-hover:bg-white/10 transition-colors duration-300" style={{ borderRadius: '8px' }}>
                    <FaArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm sm:text-base">Back to Applications</span>
                </button>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-wider" style={{ color: 'rgba(255, 209, 122, 0.8)' }}>Application Details</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-4" style={{ color: '#ffd17a' }}>
                  Application Details
                </h1>
                <p className="text-sm sm:text-base lg:text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Track and monitor your application progress
                </p>
                <div className="mt-6 flex items-center space-x-3">
                  <div className="px-4 py-2" style={{
                    backgroundColor: 'rgba(255, 209, 122, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 209, 122, 0.2)'
                  }}>
                    <p className="text-xs sm:text-sm font-mono font-semibold" style={{ color: 'gray' }}>ID: {application._id}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'gray' }}>Status</p>
                  <span className={`inline-flex items-center px-5 py-3 text-xs sm:text-sm font-bold uppercase transition-all duration-300 hover:scale-105 ${getStatusStyle(progressData?.currentStatus || application.status?.current || application.status)}`}
                        style={{ borderRadius: '10px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)' }}>
                    <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                    {formatStatus(progressData?.currentStatus || application.status?.current || application.status)}
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'gray' }}>Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{ backgroundColor: '#ffd17a', width: `${getProgressPercentage()}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'gray' }}>
                      {getProgressPercentage()}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Client Information */}
            <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                 style={{
                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                   borderRadius: '12px',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                   border: '1px solid rgba(255, 209, 122, 0.1)'
                 }}>
              <div className="p-8" style={{
                background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                borderRadius: '12px 12px 0 0'
              }}>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
                       style={{
                         background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                         borderRadius: '10px',
                         boxShadow: '0 6px 16px rgba(255, 209, 122, 0.4)'
                       }}>
                    <FaUser className="w-7 h-7" style={{ color: '#242021' }} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#ffd17a' }}>Client Information</h2>
                    <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Personal details and contact information</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Full Name</label>
                    <div className="p-5 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                         style={{
                           borderRadius: '8px',
                           border: '1px solid rgba(255, 209, 122, 0.1)'
                         }}>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{application.client?.name || application.serviceDetails?.client?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Email</label>
                    <div className="p-5 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                         style={{
                           borderRadius: '8px',
                           border: '1px solid rgba(255, 209, 122, 0.1)'
                         }}>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{application.client?.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Phone</label>
                    <div className="p-5 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                         style={{
                           borderRadius: '8px',
                           border: '1px solid rgba(255, 209, 122, 0.1)'
                         }}>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{application.client?.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Nationality</label>
                    <div className="p-5 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                         style={{
                           borderRadius: '8px',
                           border: '1px solid rgba(255, 209, 122, 0.1)'
                         }}>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{application.client?.nationality || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Information */}
            {(application.partner || application.serviceDetails?.partner) && (
              <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                   style={{
                     background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                     borderRadius: '12px',
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                     border: '1px solid rgba(255, 209, 122, 0.1)'
                   }}>
                <div className="p-8" style={{
                  background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
                         style={{
                           background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                           borderRadius: '10px',
                           boxShadow: '0 6px 16px rgba(255, 209, 122, 0.4)'
                         }}>
                      <FaUser className="w-7 h-7" style={{ color: '#242021' }} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#ffd17a' }}>Partner Information</h2>
                      <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Business partner details</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Partner Name</label>
                      <div className="p-5 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                           style={{
                             borderRadius: '8px',
                             border: '1px solid rgba(255, 209, 122, 0.1)'
                           }}>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{(application.partner || application.serviceDetails?.partner)?.name || "N/A"}</p>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Email</label>
                      <div className="p-5 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                           style={{
                             borderRadius: '8px',
                             border: '1px solid rgba(255, 209, 122, 0.1)'
                           }}>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{(application.partner || application.serviceDetails?.partner)?.email || "N/A"}</p>
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Phone</label>
                      <div className="p-5 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                           style={{
                             borderRadius: '8px',
                             border: '1px solid rgba(255, 209, 122, 0.1)'
                           }}>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">{(application.partner || application.serviceDetails?.partner)?.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Overview */}
            <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                 style={{
                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                   borderRadius: '12px',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                   border: '1px solid rgba(255, 209, 122, 0.1)'
                 }}>
              <div className="p-8" style={{
                background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                borderRadius: '12px 12px 0 0'
              }}>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
                       style={{
                         background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                         borderRadius: '10px',
                         boxShadow: '0 6px 16px rgba(255, 209, 122, 0.4)'
                       }}>
                    <FaFileAlt className="w-7 h-7" style={{ color: '#242021' }} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#ffd17a' }}>Application Overview</h2>
                    <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Service details and business information</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Service Type</label>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{application.serviceDetails?.serviceType || application.serviceType || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Partner Type</label>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{application.serviceDetails?.partnerType || application.partnerType || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">External Companies</label>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{application.serviceDetails?.externalCompaniesCount || application.externalCompaniesCount || 0}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Virtual Office</label>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${(application.serviceDetails?.needVirtualOffice || application.needVirtualOffice) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <p className="text-sm font-medium text-gray-900">
                          {(application.serviceDetails?.needVirtualOffice || application.needVirtualOffice) ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {(application.serviceDetails?.projectEstimatedValue || application.projectEstimatedValue) && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Project Estimated Value</label>
                      <div className="p-4 bg-gray-50 border border-gray-200">
                        <p className="text-lg font-bold text-gray-900">
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
              <div className="bg-white border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-600 flex items-center justify-center rounded-lg">
                      <FaBuilding className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">External Companies</h2>
                      <p className="text-amber-100 text-sm">External company details and ownership</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {(application.serviceDetails?.externalCompaniesDetails || application.externalCompaniesDetails).map((company, index) => (
                      <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-gray-900">Company #{index + 1}</h3>
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            {company.sharePercentage || 0}% Share
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Company Name</label>
                            <p className="text-sm font-medium text-gray-900">{company.companyName || "N/A"}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Country</label>
                            <p className="text-sm font-medium text-gray-900">{company.country || "N/A"}</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">CR Number</label>
                            <p className="text-sm font-mono font-medium text-gray-900">{company.crNumber || "N/A"}</p>
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
              <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                   style={{
                     background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                     borderRadius: '12px',
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                     border: '1px solid rgba(255, 209, 122, 0.1)'
                   }}>
                <div className="p-8" style={{
                  background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105"
                         style={{
                           background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                           borderRadius: '10px',
                           boxShadow: '0 6px 16px rgba(255, 209, 122, 0.4)'
                         }}>
                      <FaUsers className="w-7 h-7" style={{ color: '#242021' }} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#ffd17a' }}>Family Members</h2>
                      <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Family members requiring residency</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    {(application.serviceDetails?.familyMembers || application.familyMembers).map((member, index) => (
                      <div key={index} className="p-6 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group"
                           style={{
                             borderRadius: '8px',
                             border: '1px solid rgba(255, 209, 122, 0.1)'
                           }}>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-6">Family Member #{index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="group">
                            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Full Name</label>
                            <div className="p-4 bg-white border-0 hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                                 style={{
                                   borderRadius: '8px',
                                   border: '1px solid rgba(255, 209, 122, 0.1)'
                                 }}>
                              <p className="text-sm sm:text-base font-semibold text-gray-900">{member.name || "N/A"}</p>
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Relationship</label>
                            <div className="p-4 bg-white border-0 hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                                 style={{
                                   borderRadius: '8px',
                                   border: '1px solid rgba(255, 209, 122, 0.1)'
                                 }}>
                              <p className="text-sm sm:text-base font-semibold text-gray-900">{member.relation || "N/A"}</p>
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Passport Number</label>
                            <div className="p-4 bg-white border-0 hover:shadow-sm transition-all duration-300 group-hover:scale-[1.02]"
                                 style={{
                                   borderRadius: '8px',
                                   border: '1px solid rgba(255, 209, 122, 0.1)'
                                 }}>
                              <p className="text-sm sm:text-base font-mono font-semibold text-gray-900">{member.passportNo || "N/A"}</p>
                            </div>
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
              <div className="bg-white border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-600 flex items-center justify-center rounded-lg">
                      <FaFileAlt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Uploaded Documents</h2>
                      <p className="text-amber-100 text-sm">Application documents and files</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.documents.map((doc, index) => (
                      <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900 mb-1">{doc.type}</h3>
                            <p className="text-xs text-gray-500">Uploaded on {formatDate(doc.createdAt)}</p>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 inline-flex items-center px-3 py-1 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200"
                          >
                            <FaEye className="w-3 h-3 mr-1" />
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
          <div className="space-y-6">
            {/* Application Timeline */}
            <div className="bg-white border-2 border-gray-200 overflow-hidden">
              <div className="p-4" style={{ backgroundColor: '#242021', color: '#ffd17a' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#ffd17a' }}>
                    <FaClock className="w-5 h-5" style={{ color: '#242021' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Timeline</h3>
                    <p className="text-xs" style={{ color: 'gray' }}>Application progress tracking</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Timeline 
                  events={progressData?.timeline || application.timeline || []} 
                  currentStatus={progressData?.currentStatus || application.status?.current || application.status}
                  progressData={progressData}
                />
              </div>
            </div>

            {/* Application Info */}
            <div className="bg-white border-2 border-gray-200 overflow-hidden">
              <div className="p-4" style={{ backgroundColor: '#242021', color: '#ffd17a' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#ffd17a' }}>
                    <FaCog className="w-5 h-5" style={{ color: '#242021' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Application Info</h3>
                    <p className="text-xs" style={{ color: 'gray' }}>Key application details</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Application ID</label>
                  <p className="text-gray-900 font-mono text-xs break-all">{application.applicationId || application._id}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Submitted</label>
                  <p className="text-gray-900 font-medium text-sm">{formatDate(application.timestamps?.createdAt || application.createdAt)}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Last Updated</label>
                  <p className="text-gray-900 font-medium text-sm">{formatDate(application.timestamps?.updatedAt || application.updatedAt)}</p>
                </div>
                {(application.status?.approvedBy || application.approvedBy) && (
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Approved By</label>
                    <p className="text-gray-900 font-medium text-sm">{(application.status?.approvedBy || application.approvedBy)?.fullName || (application.status?.approvedBy || application.approvedBy)?.name || "N/A"}</p>
                  </div>
                )}
                {(application.status?.approvedAt || application.approvedAt) && (
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Approved At</label>
                    <p className="text-gray-900 font-medium text-sm">{formatDate(application.status?.approvedAt || application.approvedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Employees */}
            {application.assignedEmployees && application.assignedEmployees.length > 0 && (
              <div className="bg-white border-2 border-gray-200 overflow-hidden">
                <div className="p-4" style={{ backgroundColor: '#242021', color: '#ffd17a' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#ffd17a' }}>
                      <FaUsers className="w-5 h-5" style={{ color: '#242021' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Assigned Team</h3>
                      <p className="text-xs" style={{ color: 'gray' }}>Team members handling your application</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {application.assignedEmployees.map((employee, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#ffd17a' }}>
                              <span className="font-bold text-xs" style={{ color: '#242021' }}>
                                {employee.fullName?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{employee.fullName || employee.name}</h3>
                            <p className="text-xs text-gray-600 font-medium">{employee.position || employee.role}</p>
                            <p className="text-xs text-gray-500">{employee.email}</p>
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
              <div className="bg-white border-2 border-gray-200 overflow-hidden">
                <div className="p-4" style={{ backgroundColor: '#242021', color: '#ffd17a' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#ffd17a' }}>
                      <FaDollarSign className="w-5 h-5" style={{ color: '#242021' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Payment Info</h3>
                      <p className="text-xs" style={{ color: 'gray' }}>Payment details and status</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Amount</label>
                    <p className="text-lg font-bold text-gray-900">{application.payment?.amount || 0} SAR</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Method</label>
                    <p className="text-gray-900 font-medium text-sm">{application.payment?.method || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Status</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        application.payment?.status === 'paid' ? 'bg-green-500' : 
                        application.payment?.status === 'pending' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}></div>
                      <p className="text-gray-900 font-medium text-sm capitalize">{application.payment?.status || "N/A"}</p>
                    </div>
                  </div>
                  {application.payment?.paidAt && (
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Paid At</label>
                      <p className="text-gray-900 font-medium text-sm">{formatDate(application.payment.paidAt)}</p>
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