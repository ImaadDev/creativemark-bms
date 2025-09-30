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
      case 'completed': return 'text-green-600 bg-green-100';
      case 'approved': return 'text-green-600 bg-green-100';
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
    return <FullPageLoading text="Loading Dashboard..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-12 shadow-xl border border-white/20 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-12 shadow-xl border border-white/20">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mx-auto mb-6">
            <FaFileAlt className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Dashboard Data</h3>
          <p className="text-gray-600">Unable to load dashboard information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Modern Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white shadow-2xl rounded-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 transform rotate-45 translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 transform -rotate-45 -translate-x-16 translate-y-16"></div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FaShieldAlt className="text-2xl" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-4xl font-bold mb-2">
                      Welcome back, {dashboardData.user.name}!
                    </h1>
                    <p className="text-blue-100 text-sm md:text-lg">
                      Member since {dashboardData.user.memberSince} • Last login: {dashboardData.user.lastLogin}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2">
                    <FaTrendingUp className="text-green-300" />
                    <span className="text-sm">Active Applications: {dashboardData.statistics.inProgressRequests}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2">
                    <FaCheckCircle className="text-green-300" />
                    <span className="text-sm">Completed: {dashboardData.statistics.completedRequests}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/client/application" 
                  className="group bg-white rounded-2xl text-emerald-600 px-8 py-4 font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                  <FaPlus className="text-sm md:text-lg group-hover:rotate-90 transition-transform duration-300" />
                  New Application
                </Link>
                <Link 
                  href="/client/track-application" 
                  className="group bg-white/10 rounded-2xl backdrop-blur-sm text-white border border-white/20 px-8 py-4 font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <FaEye className="text-sm md:text-lg" />
                  Track Applications
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardData.statistics.totalRequests}</p>
                <div className="flex items-center text-xs text-emerald-600">
                  <FaTrendingUp className="mr-1 text-xs" />
                  <span>All time</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <FaFileContract className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardData.statistics.inProgressRequests}</p>
                <div className="flex  items-center text-xs text-amber-600">
                  <FaHourglassHalf className="mr-1 text-xs" />
                  <span>Active processes</span>
                </div>
              </div>
              <div className="w-14  h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <FaClock className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{dashboardData.statistics.completedRequests}</p>
                <div className="flex items-center text-xs text-emerald-600">
                  <FaCheckCircle className="mr-1 text-xs" />
                  <span>Successfully finished</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                <FaCheckCircle className="text-white text-xl" />
              </div>
            </div>
          </div>

          <div className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Investment</p>
                <p className="text-xl font-bold text-gray-900 mb-2">{dashboardData.statistics.totalSpent.toLocaleString()} SAR</p>
                <div className="flex items-center text-xs text-purple-600">
                  <FaDollarSign className="mr-1 text-xs" />
                  <span>Service investments</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <FaDollarSign className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white border rounded-2xl border-gray-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <FaFileAlt className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                </div>
                <Link 
                  href="/client/track-application" 
                  className="group text-emerald-600 rounded-2xl hover:text-emerald-800 text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  View All
                  <FaArrowUp className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {dashboardData.recentRequests.length > 0 ? (
                  dashboardData.recentRequests.map((request) => (
                    <div key={request.id} className="group rounded-2xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <FaFileContract className="text-white text-sm" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">{request.type}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Application ID: {request.id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm text-gray-500">{request.date}</p>
                        </div>
                        <span className={`px-4 py-2 text-xs font-semibold ${getStatusColor(request.status)} shadow-sm`}>
                          {request.status}
                        </span>
                      </div>
                      
                      {/* Modern Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span className="font-medium">Progress</span>
                          <span className="font-semibold">{request.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 transition-all duration-500 ease-out"
                            style={{ width: `${request.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 font-medium">{request.nextAction}</p>
                        <Link 
                          href={`/client/track-application/${request._id}`}
                          className="group/btn rounded-xl bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-all duration-300 flex items-center gap-2 text-sm font-semibold"
                        >
                          <FaEye className="text-xs group-hover/btn:scale-110 transition-transform" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                      <FaFileAlt className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-6">Start your journey by creating your first application</p>
                    <Link 
                      href="/client/application"
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 transition-colors font-semibold"
                    >
                      <FaPlus className="text-sm" />
                      Create Application
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modern Sidebar */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <FaBell className="text-white text-sm" />
                  </div>
                  <h3 className="font-bold text-gray-900">Recent Notifications</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.notifications && dashboardData.notifications.length > 0 ? (
                    dashboardData.notifications.slice(0, 3).map((notification) => (
                      <Link 
                        key={notification.id} 
                        href={notification.actionUrl}
                        className="group flex items-start space-x-4 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-100/50 hover:border-blue-200 transition-all duration-300 block"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-900 transition-colors">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {notification.time}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                        <FaBell className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No recent notifications</p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link 
                    href="/client/notifications" 
                    className="group text-emerald-600 hover:text-emerald-800 text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    View All Notifications
                    <FaArrowUp className="text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-sm" />
                  </div>
                  <h3 className="font-bold text-gray-900">Upcoming Deadlines</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {!isClient ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Loading deadlines...</p>
                    </div>
                  ) : dashboardData.upcomingDeadlines && dashboardData.upcomingDeadlines.length > 0 ? (
                    dashboardData.upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/50 p-4 hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">{deadline.title}</h4>
                          <span className={`px-3 py-1 text-xs font-bold ${
                            deadline.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
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
                      <div className="w-12 h-12 bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No upcoming deadlines</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <FaChartLine className="text-white text-sm" />
                  </div>
                  <h3 className="font-bold text-gray-900">Quick Stats</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-50">
                  <span className="text-sm font-medium text-gray-700">Documents Uploaded</span>
                  <span className="font-bold text-emerald-600">{dashboardData.statistics.documentsUploaded}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50">
                  <span className="text-sm font-medium text-gray-700">Avg. Processing Time</span>
                  <span className="font-bold text-emerald-600">{dashboardData.statistics.avgProcessingTime} days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50">
                  <span className="text-sm font-medium text-gray-700">Success Rate</span>
                  <span className="font-bold text-purple-600">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <FaCog className="text-white text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link 
                href="/client/application" 
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaPlus className="text-white text-lg" />
                </div>
                <span className="font-semibold text-gray-900 text-center">New Application</span>
              </Link>
              
              <Link 
                href="/client/track-application" 
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaEye className="text-white text-lg" />
                </div>
                <span className="font-semibold text-gray-900 text-center">Track Applications</span>
              </Link>
              
              <Link 
                href="/client/payments" 
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaDollarSign className="text-white text-lg" />
                </div>
                <span className="font-semibold text-gray-900 text-center">View Payments</span>
              </Link>
              
              <Link 
                href="/client/support" 
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaHandshake className="text-white text-lg" />
                </div>
                <span className="font-semibold text-gray-900 text-center">Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;