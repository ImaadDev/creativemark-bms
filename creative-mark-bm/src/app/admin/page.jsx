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
  FaHeadset,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowRight,
  FaEye,
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
  FaHandshake,
  FaChartLine,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaCalendar,
  FaGlobe,
  FaBuilding,
  FaUserPlus,
  FaUserMinus,
  FaClipboardCheck,
  FaExclamationCircle,
  FaInfoCircle,
  FaThumbsUp,
  FaThumbsDown
} from 'react-icons/fa';
import { getAllApplications } from '../../services/applicationService';
import { getAllEmployees } from '../../services/employeeApi';
import { getAllClients } from '../../services/clientApi';
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
    // Additional analytics data
    conversionRate: 0,
    avgProcessingTime: 0,
    clientSatisfaction: 0,
    monthlyGrowth: 0,
    quarterlyRevenue: 0,
    yearlyRevenue: 0,
    topServices: [],
    regionalData: [],
    performanceMetrics: {},
    trends: {}
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [ticketStats, setTicketStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
    

      // Load all applications, employees, clients, and ticket stats from the API
      const [applicationsResponse, employeesResponse, clientsResponse] = await Promise.all([
        getAllApplications(),
        getAllEmployees(),
        getAllClients(),
      ]);
      
      
      // Handle the response structure - the data is in response.data
      const applications = applicationsResponse.data || [];
      const employees = employeesResponse.success ? (employeesResponse.data || []) : [];
      const clients = clientsResponse.success ? (clientsResponse.data || []) : [];
      
      

      // Calculate stats based on application status
      // Use static values to prevent hydration mismatch
      const currentMonth = 0; // January
      const currentYear = 2024;
      
      const activeEmployees = employees.filter(emp => emp.status === 'active' || emp.status === 'Active' || !emp.status).length;
      const activeClients = clients.filter(client => client.status === 'active' || client.status === 'Active' || !client.status).length;
      
      // Calculate comprehensive analytics
      const completedApps = applications.filter(app => app.status?.current === 'completed' || app.status?.current === 'approved');
      const totalRevenue = completedApps.length * 1500;
      const monthlyApps = applications.filter(app => {
        const appDate = new Date(app.timestamps?.createdAt || app.createdAt);
        return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
      });
      
      // Service type analysis
      const serviceTypes = applications.reduce((acc, app) => {
        const serviceType = app.serviceDetails?.serviceType || 'Business Registration';
        acc[serviceType] = (acc[serviceType] || 0) + 1;
        return acc;
      }, {});
      
      const topServices = Object.entries(serviceTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([service, count]) => ({ service, count }));

      const newStats = {
        total: applications.length,
        pending: applications.filter(app => app.status?.current === 'submitted').length,
        inProgress: applications.filter(app => app.status?.current === 'under_review' || app.status?.current === 'in_process').length,
        completed: completedApps.length,
        clients: clients.length,
        activeClients: activeClients,
        employees: employees.length,
        activeEmployees: activeEmployees,
        revenue: totalRevenue,
        thisMonth: monthlyApps.length,
        // Enhanced analytics
        conversionRate: applications.length > 0 ? Math.round((completedApps.length / applications.length) * 100) : 0,
        avgProcessingTime: 7.5, // Mock data - average days
        clientSatisfaction: 4.7, // Mock data - out of 5
        monthlyGrowth: 12.5, // Mock data - percentage
        quarterlyRevenue: totalRevenue * 3,
        yearlyRevenue: totalRevenue * 12,
        topServices: topServices,
        regionalData: [
          { region: 'North', applications: Math.floor(applications.length * 0.35) },
          { region: 'South', applications: Math.floor(applications.length * 0.28) },
          { region: 'East', applications: Math.floor(applications.length * 0.22) },
          { region: 'West', applications: Math.floor(applications.length * 0.15) }
        ],
        performanceMetrics: {
          responseTime: '2.3 hours',
          completionRate: Math.round((completedApps.length / applications.length) * 100),
          clientRetention: 87,
          teamEfficiency: 92
        },
        trends: {
          applications: { current: applications.length, previous: Math.floor(applications.length * 0.88) },
          revenue: { current: totalRevenue, previous: Math.floor(totalRevenue * 0.85) },
          clients: { current: clients.length, previous: Math.floor(clients.length * 0.92) }
        }
      };

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

  const StatCard = ({ title, value, icon: Icon, color, onClick, trend, subtitle, isPrimary = false }) => (
    <div 
      className={`group relative bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out ${
        isPrimary ? 'hover:border-[#ffd17a]/50' : 'hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 ${
            isPrimary ? 'text-[#242021]' : 'text-gray-900'
          }`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium flex items-center gap-1 ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend > 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-500 ml-1 hidden sm:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${
          isPrimary 
            ? 'bg-[#242021] group-hover:bg-[#242021]/90' 
            : color === 'emerald' 
              ? 'bg-[#ffd17a] group-hover:bg-[#ffd17a]/90'
              : `bg-gradient-to-br from-${color}-500 to-${color}-600 group-hover:from-${color}-600 group-hover:to-${color}-700`
        } transition-all duration-300`}>
          <Icon className={`text-sm sm:text-lg ${
            isPrimary || color === 'emerald' ? 'text-white' : 'text-white'
          }`} />
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Modern Welcome Header */}
        <div className="relative overflow-hidden bg-[#242021] text-white shadow-2xl rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-[#ffd17a]/10 transform rotate-45 translate-x-16 sm:translate-x-24 lg:translate-x-32 -translate-y-16 sm:-translate-y-24 lg:-translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-[#ffd17a]/10 transform -rotate-45 -translate-x-8 sm:-translate-x-12 lg:-translate-x-16 translate-y-8 sm:translate-y-12 lg:translate-y-16"></div>
          
          <div className="relative p-4 sm:p-6 lg:p-8 xl:p-12">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#ffd17a] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl">
                    <FaTachometerAlt className="text-lg sm:text-2xl text-[#242021]" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                      Admin Dashboard
                    </h1>
                    <p className="text-[#ffd17a] text-sm sm:text-base lg:text-lg">
                      Creative Mark Management Portal • Monitor and manage all operations
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6">
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg">
                    <FaFileAlt className="text-[#ffd17a] text-xs sm:text-sm lg:text-base" />
                    <span className="text-xs sm:text-sm">Total Applications: {stats.total}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg">
                    <FaClock className="text-[#ffd17a] text-xs sm:text-sm lg:text-base" />
                    <span className="text-xs sm:text-sm">Pending: {stats.pending}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg">
                    <FaCheckCircle className="text-[#ffd17a] text-xs sm:text-sm lg:text-base" />
                    <span className="text-xs sm:text-sm">Completed: {stats.completed}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button 
                  onClick={loadDashboardData}
                  disabled={loading}
                  className="group bg-[#ffd17a] rounded-lg sm:rounded-xl text-[#242021] px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-[#ffd17a]/90 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FaSpinner className={`text-sm sm:text-base ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                  Refresh Data
                </button>
                <button 
                  onClick={() => router.push('/admin/requests')}
                  className="group bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm text-white border border-white/20 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <FaFileAlt className="text-sm sm:text-base" />
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

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={FaFileAlt}
            color="blue"
            subtitle="All time"
            trend={12}
            isPrimary={true}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
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

        {/* Support Tickets Stats */}
        {ticketStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Total Tickets"
              value={ticketStats.total || 0}
              icon={FaHeadset}
              color="blue"
              subtitle="All support tickets"
              onClick={() => router.push('/admin/tickets')}
            />
            <StatCard
              title="Open Tickets"
              value={ticketStats.open || 0}
              icon={FaExclamationCircle}
              color="orange"
              subtitle="Awaiting response"
              onClick={() => router.push('/admin/tickets?status=open')}
            />
            <StatCard
              title="In Progress"
              value={ticketStats.in_progress || 0}
              icon={FaClock}
              color="yellow"
              subtitle="Being handled"
              onClick={() => router.push('/admin/tickets?status=in_progress')}
            />
            <StatCard
              title="Resolved"
              value={ticketStats.resolved || 0}
              icon={FaCheckCircle}
              color="green"
              subtitle="Successfully resolved"
              onClick={() => router.push('/admin/tickets?status=resolved')}
            />
          </div>
        )}

        {/* Analytics & Performance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={FaPercent}
            color="green"
            subtitle="Success rate"
            trend={5}
            onClick={() => router.push('/admin/reports')}
          />
          <StatCard
            title="Avg Processing"
            value={`${stats.avgProcessingTime} days`}
            icon={FaClock}
            color="blue"
            subtitle="Average time"
            trend={-12}
            onClick={() => router.push('/admin/reports')}
          />
          <StatCard
            title="Client Satisfaction"
            value={`${stats.clientSatisfaction}/5`}
            icon={FaThumbsUp}
            color="emerald"
            subtitle="Rating"
            trend={3}
            onClick={() => router.push('/admin/reports')}
          />
          <StatCard
            title="Monthly Growth"
            value={`${stats.monthlyGrowth}%`}
            icon={FaArrowUp}
            color="purple"
            subtitle="Growth rate"
            trend={stats.monthlyGrowth}
            onClick={() => router.push('/admin/reports')}
          />
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Service Distribution Chart */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#ffd17a]/10 to-[#ffd17a]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#242021] rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaChartPie className="text-white text-sm sm:text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Service Distribution</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Top services by volume</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {stats.topServices && stats.topServices.length > 0 ? stats.topServices.map((service, index) => {
                  const percentage = stats.total > 0 ? Math.round((service.count / stats.total) * 100) : 0;
                  const colors = ['bg-[#ffd17a]', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium text-gray-700 truncate">{service.service}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colors[index] || 'bg-gray-400'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No service data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Regional Performance Chart */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#ffd17a]/10 to-[#ffd17a]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#242021] rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaGlobe className="text-white text-sm sm:text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Regional Performance</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Applications by region</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {stats.regionalData.map((region, index) => {
                  const percentage = stats.total > 0 ? Math.round((region.applications / stats.total) * 100) : 0;
                  const colors = ['bg-[#ffd17a]', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[index] || 'bg-gray-400'}`}>
                          <span className="text-white text-xs font-bold">{region.region[0]}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{region.region}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colors[index] || 'bg-gray-400'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">{region.applications}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaClock className="text-white text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Response Time</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stats.performanceMetrics.responseTime}</h4>
            <p className="text-xs sm:text-sm text-gray-600">Average response time</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaClipboardCheck className="text-white text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Completion Rate</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stats.performanceMetrics.completionRate}%</h4>
            <p className="text-xs sm:text-sm text-gray-600">Successfully completed</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaUsers className="text-white text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Client Retention</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stats.performanceMetrics.clientRetention}%</h4>
            <p className="text-xs sm:text-sm text-gray-600">Client retention rate</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffd17a] rounded-lg sm:rounded-xl flex items-center justify-center">
                <FaChartLine className="text-[#242021] text-sm sm:text-lg" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">Team Efficiency</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stats.performanceMetrics.teamEfficiency}%</h4>
            <p className="text-xs sm:text-sm text-gray-600">Overall team performance</p>
          </div>
        </div>

        {/* Recent Requests & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Recent Requests List */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200/50 bg-gradient-to-r from-[#ffd17a]/10 to-[#ffd17a]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#242021] rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaFileAlt className="text-white text-sm sm:text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Applications</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Latest application submissions</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/admin/requests')}
                  className="text-[#242021] hover:text-[#242021]/80 text-xs sm:text-sm font-medium flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-white/50 transition-all duration-200"
                >
                  View All <FaArrowRight className="ml-1 text-xs sm:text-sm" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              {recentRequests.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentRequests.map((application) => (
                    <div 
                      key={application.applicationId}
                      className="group border border-gray-200/50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-gradient-to-r hover:from-[#ffd17a]/10 hover:to-[#ffd17a]/20 hover:border-[#ffd17a]/30 cursor-pointer transition-all duration-200"
                      onClick={() => router.push(`/admin/requests/${application.applicationId}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <h3 className="font-semibold text-gray-900 group-hover:text-[#242021] transition-colors text-sm sm:text-base truncate">
                              {application.serviceDetails?.serviceType || 'Business Registration'}
                            </h3>
                            <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(application.status)} flex-shrink-0`}>
                              {formatStatus(application.status)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                            <p><span className="font-medium">ID:</span> {application.applicationId}</p>
                            <p><span className="font-medium">Client:</span> {application.client?.name || 'N/A'}</p>
                            <p><span className="font-medium">Partner:</span> {application.serviceDetails?.partnerType || 'N/A'}</p>
                            <p><span className="font-medium">Date:</span> {formatDate(application.timestamps?.createdAt || application.createdAt)}</p>
                          </div>
                        </div>
                        <button className="text-[#ffd17a] hover:text-[#242021] p-2 rounded-lg hover:bg-[#ffd17a]/20 transition-all duration-200 flex-shrink-0">
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FaFileAlt className="text-2xl sm:text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No recent applications</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">New applications will appear here</p>
                  <button 
                    onClick={() => router.push('/admin/requests')}
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-[#ffd17a] text-[#242021] hover:bg-[#ffd17a]/90 transition-all duration-200 font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base"
                  >
                    View All Applications
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200/50 bg-gradient-to-r from-[#ffd17a]/10 to-[#ffd17a]/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#242021] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FaTasks className="text-white text-sm sm:text-lg" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quick Actions</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Common admin tasks</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <button 
                  onClick={() => router.push('/admin/requests?tab=pending')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200/50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-[#ffd17a]/10 hover:to-[#ffd17a]/20 hover:border-[#ffd17a]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-200">
                      <FaClock className="text-yellow-600 text-sm sm:text-base" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block text-sm sm:text-base">Review Pending</span>
                      <span className="text-xs sm:text-sm text-gray-500">Applications awaiting review</span>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full">
                    {stats.pending}
                  </span>
                </button>

                <button 
                  onClick={() => router.push('/admin/requests')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200/50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-[#ffd17a]/10 hover:to-[#ffd17a]/20 hover:border-[#ffd17a]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                      <FaFileAlt className="text-blue-600 text-sm sm:text-base" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block text-sm sm:text-base">All Applications</span>
                      <span className="text-xs sm:text-sm text-gray-500">View complete list</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full">
                    {stats.total}
                  </span>
                </button>

                <button 
                  onClick={() => router.push('/admin/clients')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200/50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-[#ffd17a]/10 hover:to-[#ffd17a]/20 hover:border-[#ffd17a]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-200">
                      <FaUsers className="text-purple-600 text-sm sm:text-base" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block text-sm sm:text-base">Manage Clients</span>
                      <span className="text-xs sm:text-sm text-gray-500">Client database</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-400 group-hover:text-[#ffd17a] transition-colors text-sm sm:text-base" />
                </button>

                <button 
                  onClick={() => router.push('/admin/reports')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200/50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-[#ffd17a]/10 hover:to-[#ffd17a]/20 hover:border-[#ffd17a]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                      <FaChartBar className="text-green-600 text-sm sm:text-base" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block text-sm sm:text-base">View Reports</span>
                      <span className="text-xs sm:text-sm text-gray-500">Analytics & insights</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-400 group-hover:text-[#ffd17a] transition-colors text-sm sm:text-base" />
                </button>

                <button 
                  onClick={() => router.push('/admin/tickets')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200/50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-[#ffd17a]/10 hover:to-[#ffd17a]/20 hover:border-[#ffd17a]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                      <FaHeadset className="text-blue-600 text-sm sm:text-base" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block text-sm sm:text-base">Support Tickets</span>
                      <span className="text-xs sm:text-sm text-gray-500">Manage support requests</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full">
                    {ticketStats?.total || 0}
                  </span>
                </button>

                <button 
                  onClick={() => router.push('/admin/all-employees')}
                  className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200/50 rounded-lg sm:rounded-xl hover:bg-gradient-to-r hover:from-[#ffd17a]/10 hover:to-[#ffd17a]/20 hover:border-[#ffd17a]/30 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-200">
                      <FaUserTie className="text-indigo-600 text-sm sm:text-base" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-gray-900 block text-sm sm:text-base">Team Management</span>
                      <span className="text-xs sm:text-sm text-gray-500">Employee directory</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-gray-400 group-hover:text-[#ffd17a] transition-colors text-sm sm:text-base" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
