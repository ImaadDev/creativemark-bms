"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClientOnly } from '../../hooks/useClientOnly';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf,
  FaExclamationTriangle,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaBell,
  FaCalendarAlt,
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaBuilding,
  FaSpinner,
  FaArrowUp as FaTrendingUp,
  FaArrowDown as FaTrendingDown,
  FaFileAlt as FaFileContract,
  FaUsers as FaHandshake,
  FaCog,
  FaBuilding as FaShieldAlt
} from 'react-icons/fa';
import { getUserApplications, getApplicationProgress } from '../../services/applicationService';
import AuthContext from '../../contexts/AuthContext';
import { FullPageLoading } from '../../components/LoadingSpinner';



const ClientDashboard = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isClient = useClientOnly();

  // Load real dashboard data from backend
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch user's applications from backend
        const response = await getUserApplications();
        const applications = response.data || [];
        
        // Calculate statistics from real data
        const statistics = calculateStatistics(applications);
        
        // Fetch progress data for each application
        const recentApplications = applications.slice(0, 5);
        const applicationsWithProgress = await Promise.all(
          recentApplications.map(async (app) => {
            try {
              const progressResponse = await getApplicationProgress(app._id);
              return {
                id: app._id,
                _id: app._id,
                type: formatServiceType(app.serviceType),
                date: new Date(app.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }),
                status: formatStatus(app.status),
                progress: progressResponse.data.progressPercentage || getProgressPercentage(app.status),
                nextAction: getNextAction(app.status),
                progressData: progressResponse.data
              };
            } catch (error) {
              console.error(`Error fetching progress for application ${app._id}:`, error);
              // Fallback to hardcoded progress if API fails
              return {
                id: app._id,
                _id: app._id,
                type: formatServiceType(app.serviceType),
                date: new Date(app.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }),
                status: formatStatus(app.status),
                progress: getProgressPercentage(app.status),
                nextAction: getNextAction(app.status),
                progressData: null
              };
            }
          })
        );
        
        // Prepare dashboard data
        const dashboardData = {
          user: {
            name: user.fullName || user.email,
            memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            }) : 'Recently',
            lastLogin: "Just now"
          },
          statistics,
          recentRequests: applicationsWithProgress,
          notifications: generateNotifications(applications),
          upcomingDeadlines: generateDeadlines(applications)
        };
        
        setDashboardData(dashboardData);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Helper functions for data processing
  const calculateStatistics = (applications) => {
    const totalRequests = applications.length;
    const inProgressRequests = applications.filter(app => 
      ['submitted', 'under_review', 'in_process'].includes(app.status)
    ).length;
    const completedRequests = applications.filter(app => 
      ['completed', 'approved'].includes(app.status)
    ).length;
    
    // Calculate total spent (mock calculation - you can enhance this with real payment data)
    const totalSpent = applications.length * 5000; // Assuming 5000 SAR per application
    
    return {
      totalRequests,
      inProgressRequests,
      completedRequests,
      totalSpent,
      documentsUploaded: applications.length * 3, // Mock calculation
      avgProcessingTime: 14 // Mock calculation
    };
  };

  const formatServiceType = (serviceType) => {
    const serviceMap = {
      'commercial': 'Commercial Registration',
      'engineering': 'Engineering Consulting',
      'real_estate': 'Real Estate Development',
      'industrial': 'Industrial License',
      'agricultural': 'Agricultural License',
      'service': 'Service License',
      'advertising': 'Advertising License'
    };
    return serviceMap[serviceType] || serviceType;
  };

  const formatStatus = (status) => {
    const statusMap = {
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'approved': 'Approved',
      'in_process': 'In Process',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  };

  const getProgressPercentage = (status) => {
    const progressMap = {
      'submitted': 20,
      'under_review': 40,
      'approved': 60,
      'in_process': 80,
      'completed': 100,
      'rejected': 0
    };
    return progressMap[status] || 0;
  };

  const getNextAction = (status) => {
    const actionMap = {
      'submitted': 'Application submitted, awaiting review',
      'under_review': 'Under review by our team',
      'approved': 'Application approved, processing documents',
      'in_process': 'Documents being processed',
      'completed': 'Application completed successfully',
      'rejected': 'Application requires attention'
    };
    return actionMap[status] || 'Processing...';
  };

  const generateNotifications = (applications) => {
    const notifications = [];
    
    applications.forEach(app => {
      if (app.status === 'submitted') {
        notifications.push({
          id: `notif_${app._id}_submitted`,
          type: 'info',
          title: 'Application Submitted',
          message: `Your ${formatServiceType(app.serviceType)} application has been submitted`,
          time: 'Just now',
          actionUrl: `/client/requests/${app._id}`
        });
      }
      
      if (app.status === 'under_review') {
        notifications.push({
          id: `notif_${app._id}_review`,
          type: 'info',
          title: 'Under Review',
          message: `Your ${formatServiceType(app.serviceType)} application is being reviewed`,
          time: '1 hour ago',
          actionUrl: `/client/requests/${app._id}`
        });
      }
      
      if (app.status === 'approved') {
        notifications.push({
          id: `notif_${app._id}_approved`,
          type: 'urgent',
          title: 'Application Approved!',
          message: `Your ${formatServiceType(app.serviceType)} application has been approved`,
          time: '2 hours ago',
          actionUrl: `/client/requests/${app._id}`
        });
      }
    });
    
    return notifications.slice(0, 3);
  };

  const generateDeadlines = (applications) => {
    if (!isClient) return []; // Return empty array during SSR
    
    const deadlines = [];
    
    applications.forEach(app => {
      if (app.status === 'submitted' || app.status === 'under_review') {
        const deadlineDate = new Date(app.createdAt);
        deadlineDate.setDate(deadlineDate.getDate() + 30); // 30 days from submission
        
        const daysLeft = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft > 0) {
          deadlines.push({
            id: `deadline_${app._id}`,
            title: `${formatServiceType(app.serviceType)} Review`,
            date: deadlineDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            daysLeft,
            priority: daysLeft <= 7 ? 'high' : daysLeft <= 14 ? 'medium' : 'low'
          });
        }
      }
    });
    
    return deadlines.slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-amber-600 bg-amber-100';
      case 'approved': return 'text-amber-600 bg-amber-100';
      case 'in progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent': return <FaExclamationTriangle className="text-red-500" />;
      case 'info': return <FaBell className="text-blue-500" />;
      case 'reminder': return <FaClock className="text-yellow-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-gray-50 border-l-4 border-amber-600 p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent"></div>
              <span className="text-gray-700 font-medium">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-red-50 border-l-4 border-red-600 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-red-900 mb-1">Error Loading Dashboard</h3>
                <p className="text-sm text-red-800 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold uppercase tracking-wide transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center py-16 sm:py-24 bg-gray-50 border-2 border-gray-200">
            <div className="max-w-md mx-auto px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto mb-6">
                <FaFileAlt className="w-10 h-10 text-amber-900" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                No Dashboard Data
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
                Unable to load dashboard information. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-950 text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg"
              >
                Retry
              </button>
            </div>
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
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
                  <span className="text-sm font-medium uppercase tracking-wider" style={{ color: 'rgba(255, 209, 122, 0.8)' }}>Dashboard</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4" style={{ color: '#ffd17a' }}>
                  Welcome back, {dashboardData.user.name}!
                </h1>
                <p className="text-base sm:text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Member since {dashboardData.user.memberSince} • Last login: {dashboardData.user.lastLogin}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/client/track-application"
                  className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider border transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                  style={{
                    backgroundColor: 'rgba(255, 209, 122, 0.1)',
                    color: '#ffd17a',
                    borderColor: 'rgba(255, 209, 122, 0.3)',
                    borderRadius: '12px'
                  }}
                >
                  <span className="group-hover:scale-105 transition-transform duration-300">Track Applications</span>
                </Link>
                <Link
                  href="/client/application"
                  className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg shadow-lg group"
                  style={{
                    background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                    color: '#242021',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                  }}
                >
                  <span className="group-hover:scale-105 transition-transform duration-300">+ New Application</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group bg-white border-0 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '20px',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 209, 122, 0.1)'
               }}>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Total Applications
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{dashboardData.statistics.totalRequests}</p>
                  <div className="flex items-center text-sm font-medium" style={{ color: '#ffd17a' }}>
                    <FaTrendingUp className="mr-2 text-sm" />
                    <span>All time</span>
                  </div>
                </div>
                <div className="w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaFileContract className="text-xl" style={{ color: '#242021' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-white border-0 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '20px',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 209, 122, 0.1)'
               }}>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    In Progress
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{dashboardData.statistics.inProgressRequests}</p>
                  <div className="flex items-center text-sm font-medium" style={{ color: '#ffd17a' }}>
                    <FaHourglassHalf className="mr-2 text-sm" />
                    <span>Active processes</span>
                  </div>
                </div>
                <div className="w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaClock className="text-xl" style={{ color: '#242021' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-white border-0 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '20px',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 209, 122, 0.1)'
               }}>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Completed
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{dashboardData.statistics.completedRequests}</p>
                  <div className="flex items-center text-sm font-medium" style={{ color: '#ffd17a' }}>
                    <FaCheckCircle className="mr-2 text-sm" />
                    <span>Successfully finished</span>
                  </div>
                </div>
                <div className="w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaCheckCircle className="text-xl" style={{ color: '#242021' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-white border-0 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '20px',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 209, 122, 0.1)'
               }}>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Total Investment
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-3">{dashboardData.statistics.totalSpent.toLocaleString()} SAR</p>
                  <div className="flex items-center text-sm font-medium" style={{ color: '#ffd17a' }}>
                    <FaDollarSign className="mr-2 text-sm" />
                    <span>Service investments</span>
                  </div>
                </div>
                <div className="w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '16px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaDollarSign className="text-xl" style={{ color: '#242021' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
               style={{
                 background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                 borderRadius: '24px',
                 boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                 border: '1px solid rgba(255, 209, 122, 0.1)'
               }}>
            <div className="p-8" style={{
              background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
              borderRadius: '24px 24px 0 0'
            }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#ffd17a' }}>Recent Applications</h2>
                </div>
                <Link
                  href="/client/track-application"
                  className="px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
                  style={{
                    backgroundColor: 'rgba(255, 209, 122, 0.1)',
                    color: '#ffd17a',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 209, 122, 0.2)'
                  }}
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {dashboardData.recentRequests.length > 0 ? (
                  dashboardData.recentRequests.map((request) => (
                    <div key={request.id} className="group bg-white border-0 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                         style={{
                           background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                           borderRadius: '16px',
                           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                           border: '1px solid rgba(255, 209, 122, 0.1)'
                         }}>
                      <div className="p-6 space-y-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: '#ffd17a' }}></div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Application Details
                              </h3>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 mb-3">{request.type}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-2" style={{ color: 'rgba(255, 209, 122, 0.8)' }}>
                                <FaFileAlt className="text-sm" />
                                <span className="font-medium">ID: {request.id.slice(-8).toUpperCase()}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-500">
                                <FaCalendarAlt className="text-sm" />
                                <span>{request.date}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:scale-105 ${getStatusColor(request.status)}`}
                                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
                            {request.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-medium text-gray-700">
                            <span>Progress</span>
                            <span className="font-bold" style={{ color: '#ffd17a' }}>{request.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-3" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                            <div
                              className="h-3 transition-all duration-1000 ease-out"
                              style={{
                                width: `${request.progress}%`,
                                background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(255, 209, 122, 0.3)'
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <p className="text-sm font-medium text-gray-600">{request.nextAction}</p>
                          <Link
                            href={`/client/track-application/${request._id}`}
                            className="px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group"
                            style={{
                              background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                              color: '#242021',
                              borderRadius: '12px',
                              boxShadow: '0 6px 20px rgba(255, 209, 122, 0.3)'
                            }}
                          >
                            <span className="group-hover:scale-105 transition-transform duration-300">View Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 sm:py-24 bg-gray-50 border-2 border-gray-200">
                    <div className="max-w-md mx-auto px-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mx-auto mb-6">
                        <FaFileAlt className="w-10 h-10 text-amber-900" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        No Applications Yet
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
                        Start your journey by creating your first business registration application today.
                      </p>
                      <Link 
                        href="/client/application"
                        className="w-full sm:w-auto px-8 py-4 bg-amber-900 hover:bg-amber-950 text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-lg"
                      >
                        Start New Application
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                 style={{
                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                   borderRadius: '20px',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                   border: '1px solid rgba(255, 209, 122, 0.1)'
                 }}>
              <div className="p-6" style={{
                background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                borderRadius: '20px 20px 0 0'
              }}>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
                  <h3 className="text-lg font-bold" style={{ color: '#ffd17a' }}>Recent Notifications</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.notifications && dashboardData.notifications.length > 0 ? (
                    dashboardData.notifications.slice(0, 3).map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.actionUrl}
                        className="block p-4 bg-gray-50 border-0 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                        style={{ borderRadius: '12px' }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm group-hover:scale-110 transition-transform duration-300"
                               style={{
                                 background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                                 borderRadius: '8px'
                               }}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 mb-1">{notification.title}</p>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <FaClock className="text-xs" />
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-50 mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '12px' }}>
                        <FaBell className="text-2xl text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No recent notifications</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t" style={{ borderTopColor: 'rgba(255, 209, 122, 0.1)' }}>
                  <Link
                    href="/client/notifications"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 209, 122, 0.1) 0%, rgba(255, 209, 122, 0.05) 100%)',
                      color: '#ffd17a',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 209, 122, 0.2)'
                    }}
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                 style={{
                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                   borderRadius: '20px',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                   border: '1px solid rgba(255, 209, 122, 0.1)'
                 }}>
              <div className="p-6" style={{
                background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                borderRadius: '20px 20px 0 0'
              }}>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
                  <h3 className="text-lg font-bold" style={{ color: '#ffd17a' }}>Upcoming Deadlines</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {!isClient ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-50 mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '12px' }}>
                        <FaCalendarAlt className="text-2xl text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Loading deadlines...</p>
                    </div>
                  ) : dashboardData.upcomingDeadlines && dashboardData.upcomingDeadlines.length > 0 ? (
                    dashboardData.upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="bg-gray-50 border-0 p-4 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                           style={{ borderRadius: '12px' }}>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-800">{deadline.title}</h4>
                          <span className={`px-3 py-1 text-xs font-bold transition-all duration-300 group-hover:scale-105 ${
                            deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                            deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-amber-100 text-amber-800'
                          }`} style={{ borderRadius: '8px' }}>
                            {deadline.daysLeft} days left
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />
                          Due: {deadline.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-50 mx-auto mb-4 flex items-center justify-center" style={{ borderRadius: '12px' }}>
                        <FaCalendarAlt className="text-2xl text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No upcoming deadlines</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                 style={{
                   background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                   borderRadius: '20px',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                   border: '1px solid rgba(255, 209, 122, 0.1)'
                 }}>
              <div className="p-6" style={{
                background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
                borderRadius: '20px 20px 0 0'
              }}>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
                  <h3 className="text-lg font-bold" style={{ color: '#ffd17a' }}>Quick Stats</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group"
                     style={{ borderRadius: '12px' }}>
                  <span className="text-sm font-medium text-gray-700">Documents Uploaded</span>
                  <span className="font-bold text-lg" style={{ color: '#ffd17a' }}>{dashboardData.statistics.documentsUploaded}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group"
                     style={{ borderRadius: '12px' }}>
                  <span className="text-sm font-medium text-gray-700">Avg. Processing Time</span>
                  <span className="font-bold text-lg" style={{ color: '#ffd17a' }}>{dashboardData.statistics.avgProcessingTime} days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 border-0 hover:bg-white hover:shadow-sm transition-all duration-300 group"
                     style={{ borderRadius: '12px' }}>
                  <span className="text-sm font-medium text-gray-700">Success Rate</span>
                  <span className="font-bold text-lg" style={{ color: '#ffd17a' }}>95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
             style={{
               background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
               borderRadius: '24px',
               boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
               border: '1px solid rgba(255, 209, 122, 0.1)'
             }}>
          <div className="p-8" style={{
            background: 'linear-gradient(135deg, #242021 0%, #2a2422 50%, #242021 100%)',
            borderRadius: '24px 24px 0 0'
          }}>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full shadow-lg animate-pulse" style={{ backgroundColor: '#ffd17a' }}></div>
              <h2 className="text-2xl font-bold" style={{ color: '#ffd17a' }}>Quick Actions</h2>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link
                href="/client/application"
                className="group flex flex-col items-center p-8 bg-gray-50 border-0 hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 209, 122, 0.1)'
                }}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '12px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaPlus className="text-xl" style={{ color: '#242021' }} />
                </div>
                <span className="font-bold text-gray-900 text-center text-sm uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">New Application</span>
              </Link>

              <Link
                href="/client/track-application"
                className="group flex flex-col items-center p-8 bg-gray-50 border-0 hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 209, 122, 0.1)'
                }}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '12px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaEye className="text-xl" style={{ color: '#242021' }} />
                </div>
                <span className="font-bold text-gray-900 text-center text-sm uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">Track Applications</span>
              </Link>

              <Link
                href="/client/payments"
                className="group flex flex-col items-center p-8 bg-gray-50 border-0 hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 209, 122, 0.1)'
                }}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '12px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaDollarSign className="text-xl" style={{ color: '#242021' }} />
                </div>
                <span className="font-bold text-gray-900 text-center text-sm uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">View Payments</span>
              </Link>

              <Link
                href="/client/support"
                className="group flex flex-col items-center p-8 bg-gray-50 border-0 hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 209, 122, 0.1)'
                }}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300"
                     style={{
                       background: 'linear-gradient(135deg, #ffd17a 0%, #e6b855 100%)',
                       borderRadius: '12px',
                       boxShadow: '0 8px 25px rgba(255, 209, 122, 0.3)'
                     }}>
                  <FaHandshake className="text-xl" style={{ color: '#242021' }} />
                </div>
                <span className="font-bold text-gray-900 text-center text-sm uppercase tracking-wider group-hover:scale-105 transition-transform duration-300">Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;