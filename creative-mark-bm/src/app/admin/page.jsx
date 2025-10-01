// Internal Admin Dashboard
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaTachometerAlt,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowRight,
  FaPlus,
  FaEye,
  FaBuilding,
  FaUserTie,
  FaChartBar,
  FaBell,
  FaCog,
  FaDownload,
  FaUpload,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaDollarSign,
  FaClipboardList,
  FaTasks,
  FaUserCheck,
  FaUserTimes,
  FaFileInvoice,
  FaHandshake
} from 'react-icons/fa';
import { getAllApplications } from '../../services/applicationService';
import { getAllEmployees } from '../../services/employeeApi';
import { getAllClients } from '../../services/clientApi';
import { isAuthenticated } from '../../services/auth';
import { FullPageLoading } from '../../components/LoadingSpinner';

export default function InternalDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    clients: 0,
    activeClients: 0,
    employees: 0,
    activeEmployees: 0,
    revenue: 0,
    thisMonth: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push('/');
        return;
      }

      // Load all applications, employees, and clients from the API
      const [applicationsResponse, employeesResponse, clientsResponse] = await Promise.all([
        getAllApplications(),
        getAllEmployees(),
        getAllClients()
      ]);
      
      console.log("Applications API Response:", applicationsResponse);
      console.log("Employees API Response:", employeesResponse);
      console.log("Clients API Response:", clientsResponse);
      
      // Handle the response structure - the data is in response.data
      const applications = applicationsResponse.data || [];
      const employees = employeesResponse.success ? (employeesResponse.data || []) : [];
      const clients = clientsResponse.success ? (clientsResponse.data || []) : [];
      
      console.log("Applications data:", applications);
      console.log("Employees data:", employees);
      console.log("Clients data:", clients);

      // Calculate stats based on application status
      // Use static values to prevent hydration mismatch
      const currentMonth = 0; // January
      const currentYear = 2024;
      
      const activeEmployees = employees.filter(emp => emp.status === 'active' || emp.status === 'Active' || !emp.status).length;
      const activeClients = clients.filter(client => client.status === 'active' || client.status === 'Active' || !client.status).length;
      
      const newStats = {
        total: applications.length,
        pending: applications.filter(app => app.status?.current === 'submitted').length,
        inProgress: applications.filter(app => app.status?.current === 'under_review' || app.status?.current === 'in_process').length,
        completed: applications.filter(app => app.status?.current === 'completed' || app.status?.current === 'approved').length,
        clients: clients.length, // Real client count from API
        activeClients: activeClients, // Active clients count
        employees: employees.length, // Real employee count from API
        activeEmployees: activeEmployees, // Active employees count
        revenue: applications.filter(app => app.status?.current === 'completed' || app.status?.current === 'approved').length * 1500, // Mock calculation
        thisMonth: applications.filter(app => {
          const appDate = new Date(app.timestamps?.createdAt || app.createdAt);
          return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
        }).length,
      };

      console.log("Calculated stats:", newStats);
      setStats(newStats);
      
      // Sort by creation date and get 5 most recent
      const sortedApplications = applications
        .sort((a, b) => new Date(b.timestamps?.createdAt || b.createdAt) - new Date(a.timestamps?.createdAt || a.createdAt))
        .slice(0, 5);
      
      setRecentRequests(sortedApplications);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      // Set default values on error
      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        clients: 0,
        activeClients: 0,
        employees: 0,
        activeEmployees: 0,
        revenue: 0,
        thisMonth: 0,
      });
      setRecentRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick, trend, subtitle }) => (
    <div 
      className="group relative bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 cursor-pointer hover:shadow-lg hover:border-emerald-200 transition-all duration-300 ease-out"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-100/0 group-hover:from-emerald-50/50 group-hover:to-emerald-100/30 rounded-xl transition-all duration-300"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-1 sm:mt-2">
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-gray-500 ml-1 hidden sm:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-${color}-100 to-${color}-200 group-hover:from-${color}-200 group-hover:to-${color}-300 transition-all duration-300`}>
          <Icon className={`text-lg sm:text-xl lg:text-2xl text-${color}-600 group-hover:text-${color}-700 transition-colors duration-300`} />
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );

  const getStatusColor = (status) => {
    const currentStatus = status?.current || status;
    switch (currentStatus) {
      case 'submitted':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'in_process':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'approved':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'completed':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    const currentStatus = status?.current || status;
    switch (currentStatus) {
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'in_process':
        return 'In Process';
      case 'approved':
        return 'Approved';
      case 'completed':
        return 'Completed';
      default:
        return currentStatus || 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <FullPageLoading text="Loading Admin Dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        {/* Modern Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white shadow-2xl rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/5 transform rotate-45 translate-x-16 sm:translate-x-24 lg:translate-x-32 -translate-y-16 sm:-translate-y-24 lg:-translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-white/5 transform -rotate-45 -translate-x-8 sm:-translate-x-12 lg:-translate-x-16 translate-y-8 sm:translate-y-12 lg:translate-y-16"></div>
          
          <div className="relative p-4 sm:p-6 lg:p-8 xl:p-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-lg sm:rounded-xl">
                    <FaTachometerAlt className="text-lg sm:text-xl lg:text-2xl" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-4xl font-bold mb-1 sm:mb-2">
                      Admin Dashboard
                    </h1>
                    <p className="text-emerald-100 text-xs sm:text-sm lg:text-base xl:text-lg">
                      Creative Mark Management Portal • Monitor and manage all operations
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6">
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg">
                    <FaFileAlt className="text-green-300 text-xs sm:text-sm lg:text-base" />
                    <span className="text-xs sm:text-sm">Total Applications: {stats.total}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg">
                    <FaClock className="text-yellow-300 text-xs sm:text-sm lg:text-base" />
                    <span className="text-xs sm:text-sm">Pending: {stats.pending}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg">
                    <FaCheckCircle className="text-green-300 text-xs sm:text-sm lg:text-base" />
                    <span className="text-xs sm:text-sm">Completed: {stats.completed}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                <button 
                  onClick={loadDashboardData}
                  disabled={loading}
                  className="group bg-white rounded-xl sm:rounded-2xl text-emerald-600 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FaSpinner className={`text-xs sm:text-sm lg:text-base ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                  Refresh Data
                </button>
                <button 
                  onClick={() => router.push('/admin/requests')}
                  className="group bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm text-white border border-white/20 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FaFileAlt className="text-xs sm:text-sm lg:text-base" />
                  View All Requests
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 text-sm sm:text-lg" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4 flex-1">
                <h3 className="text-xs sm:text-sm font-semibold text-red-800 mb-1">Error loading dashboard data</h3>
                <p className="text-xs sm:text-sm text-red-700 mb-2 sm:mb-3">{error}</p>
                <button 
                  onClick={loadDashboardData}
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <FaSpinner className={`mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={FaFileAlt}
            color="blue"
            subtitle="All time"
            trend={12}
            onClick={() => router.push('/admin/requests?tab=all')}
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={FaClock}
            color="yellow"
            subtitle="Awaiting action"
            trend={-5}
            onClick={() => router.push('/admin/requests?tab=pending')}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={FaExclamationTriangle}
            color="orange"
            subtitle="Being processed"
            trend={8}
            onClick={() => router.push('/admin/requests?tab=in-progress')}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={FaCheckCircle}
            color="emerald"
            subtitle="Successfully finished"
            trend={15}
            onClick={() => router.push('/admin/requests?status=Completed')}
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Active Clients"
            value={stats.clients}
            icon={FaUsers}
            color="purple"
            subtitle={`${stats.activeClients} active • ${stats.clients} total`}
            trend={22}
            onClick={() => router.push('/admin/clients')}
          />
          <StatCard
            title="Team Members"
            value={stats.employees}
            icon={FaUserTie}
            color="indigo"
            subtitle={`${stats.activeEmployees} active • ${stats.employees} total`}
            trend={0}
            onClick={() => router.push('/admin/all-employees')}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={FaDollarSign}
            color="emerald"
            subtitle="This month"
            trend={18}
            onClick={() => router.push('/admin/reports')}
          />
          <StatCard
            title="This Month"
            value={stats.thisMonth}
            icon={FaCalendarAlt}
            color="pink"
            subtitle="New applications"
            trend={25}
            onClick={() => router.push('/admin/requests')}
          />
        </div>

        {/* Recent Requests & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Recent Requests List */}
          <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-white text-xs sm:text-sm" />
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Recent Applications</h2>
                </div>
                <button 
                  onClick={() => router.push('/admin/requests')}
                  className="text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm font-medium flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-emerald-50 transition-colors duration-200"
                >
                  View All <FaArrowRight className="ml-1 text-xs sm:text-sm" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentRequests.length > 0 ? (
                <div className="space-y-3">
                  {recentRequests.map((application) => (
                    <div 
                      key={application.applicationId}
                      className="group border border-gray-100 rounded-lg p-4 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-blue-50/50 hover:border-emerald-200 cursor-pointer transition-all duration-200"
                      onClick={() => router.push(`/admin/requests/${application.applicationId}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                              {application.serviceDetails?.serviceType || 'Business Registration'}
                            </h3>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(application.status)}`}>
                              {formatStatus(application.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">ID:</span> {application.applicationId}</p>
                            <p><span className="font-medium">Client:</span> {application.client?.name || 'N/A'}</p>
                            <p><span className="font-medium">Partner:</span> {application.serviceDetails?.partnerType || 'N/A'}</p>
                            <p><span className="font-medium">Date:</span> {formatDate(application.timestamps?.createdAt || application.createdAt)}</p>
                          </div>
                        </div>
                        <button className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-100 transition-all duration-200">
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileAlt className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent applications</h3>
                  <p className="text-gray-500 mb-4">New applications will appear here</p>
                  <button 
                    onClick={() => router.push('/admin/requests')}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View All Applications
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <FaTasks className="text-white text-sm" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/admin/requests?tab=pending')}
                  className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:border-yellow-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mr-3 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-200">
                      <FaClock className="text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block">Review Pending</span>
                      <span className="text-sm text-gray-500">Applications awaiting review</span>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-semibold rounded-full">
                    {stats.pending}
                  </span>
                </button>

                <button 
                  onClick={() => router.push('/admin/requests')}
                  className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                      <FaFileAlt className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block">All Applications</span>
                      <span className="text-sm text-gray-500">View complete list</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-semibold rounded-full">
                    {stats.total}
                  </span>
                </button>

                <button 
                  onClick={() => router.push('/admin/clients')}
                  className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-200">
                      <FaUsers className="text-purple-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block">Manage Clients</span>
                      <span className="text-sm text-gray-500">Client database</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors" />
                </button>

                <button 
                  onClick={() => router.push('/admin/reports')}
                  className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:border-emerald-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mr-3 group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-200">
                      <FaChartBar className="text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block">View Reports</span>
                      <span className="text-sm text-gray-500">Analytics & insights</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                </button>

                <button 
                  onClick={() => router.push('/admin/all-employees')}
                  className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:border-indigo-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-3 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-200">
                      <FaUserTie className="text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block">Team Management</span>
                      <span className="text-sm text-gray-500">Employee directory</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
