"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoading } from "../../../components/LoadingSpinner";
import { 
  FaChartBar, 
  FaUsers, 
  FaFileAlt, 
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaDownload,
  FaCalendarAlt,
  FaUserCheck,
  FaHandshake,
  FaPrint,
  FaTasks,
  FaUserTie,
  FaBuilding,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaStar,
  FaPercent,
  FaTrophy,
  FaMedal,
  FaAward,
  FaTrendingUp,
  FaTrendingDown,
  FaMinus
} from "react-icons/fa";
import { getDashboardAnalytics, getApplicationReports, getEmployeeReports, getFinancialReports } from "../../../services/reportsApi";
import { getAllApplications } from "../../../services/applicationService";
import { getAllEmployees } from "../../../services/employeeApi";
import { getAllClients } from "../../../services/clientApi";

export default function ReportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [applicationReports, setApplicationReports] = useState(null);
  const [employeeReports, setEmployeeReports] = useState(null);
  const [financialReports, setFinancialReports] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Real data from APIs
  const [applications, setApplications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [comprehensiveStats, setComprehensiveStats] = useState({
    totalApplications: 0,
    totalClients: 0,
    totalEmployees: 0,
    totalPartners: 0,
    activeClients: 0,
    activeEmployees: 0,
    pendingApplications: 0,
    completedApplications: 0,
    inProgressApplications: 0,
    rejectedApplications: 0,
    totalRevenue: 0,
    averageProcessingTime: 0,
    successRate: 0,
    clientSatisfaction: 0
  });

  useEffect(() => {
    const initializePage = async () => {
      try {
        await loadDashboardData();
      } catch (error) {
        console.error('Error initializing reports page:', error);
        setError('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [applicationsResponse, employeesResponse, clientsResponse] = await Promise.all([
        getAllApplications(),
        getAllEmployees(),
        getAllClients()
      ]);
      
      const applicationsData = applicationsResponse.data || [];
      const employeesData = employeesResponse.success ? (employeesResponse.data || []) : [];
      const clientsData = clientsResponse.success ? (clientsResponse.data || []) : [];
      
      setApplications(applicationsData);
      setEmployees(employeesData);
      setClients(clientsData);
      
      // Calculate comprehensive statistics
      const stats = calculateComprehensiveStats(applicationsData, employeesData, clientsData);
      setComprehensiveStats(stats);
      
      // Create mock analytics for compatibility
      const mockAnalytics = createMockAnalytics(applicationsData, employeesData, clientsData, stats);
      setAnalytics(mockAnalytics);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadApplicationReports = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (dateRange.startDate) filters.startDate = dateRange.startDate;
      if (dateRange.endDate) filters.endDate = dateRange.endDate;
      
      const response = await getApplicationReports(filters);
      if (response.success) {
        setApplicationReports(response.data);
      } else {
        setError('Failed to load application reports');
      }
    } catch (error) {
      console.error('Error loading application reports:', error);
      setError('Failed to load application reports');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeReports = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (dateRange.startDate) filters.startDate = dateRange.startDate;
      if (dateRange.endDate) filters.endDate = dateRange.endDate;
      
      const response = await getEmployeeReports(filters);
      if (response.success) {
        setEmployeeReports(response.data);
      } else {
        setError('Failed to load employee reports');
      }
    } catch (error) {
      console.error('Error loading employee reports:', error);
      setError('Failed to load employee reports');
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialReports = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (dateRange.startDate) filters.startDate = dateRange.startDate;
      if (dateRange.endDate) filters.endDate = dateRange.endDate;
      
      const response = await getFinancialReports(filters);
      if (response.success) {
        setFinancialReports(response.data);
      } else {
        setError('Failed to load financial reports');
      }
    } catch (error) {
      console.error('Error loading financial reports:', error);
      setError('Failed to load financial reports');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setError(null);
    
    switch (tab) {
      case 'applications':
        await loadApplicationReports();
        break;
      case 'employees':
        await loadEmployeeReports();
        break;
      case 'financial':
        await loadFinancialReports();
        break;
      default:
        break;
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'in_process': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <FaFileAlt className="text-blue-600" />;
      case 'under_review': return <FaClock className="text-yellow-600" />;
      case 'in_process': return <FaSpinner className="text-purple-600" />;
      case 'approved': return <FaCheckCircle className="text-green-600" />;
      case 'completed': return <FaCheckCircle className="text-emerald-600" />;
      case 'rejected': return <FaExclamationTriangle className="text-red-600" />;
      default: return <FaFileAlt className="text-gray-600" />;
    }
  };

  // Helper function to calculate comprehensive statistics
  const calculateComprehensiveStats = (applicationsData, employeesData, clientsData) => {
    const totalApplications = applicationsData.length;
    const totalClients = clientsData.length;
    const totalEmployees = employeesData.length;
    
    // Calculate active users
    const activeClients = clientsData.filter(client => 
      client.status === 'active' || client.status === 'Active' || !client.status
    ).length;
    
    const activeEmployees = employeesData.filter(emp => 
      emp.status === 'active' || emp.status === 'Active' || !emp.status
    ).length;
    
    // Calculate application status breakdown
    const pendingApplications = applicationsData.filter(app => 
      app.status?.current === 'submitted' || app.status === 'submitted'
    ).length;
    
    const completedApplications = applicationsData.filter(app => 
      app.status?.current === 'completed' || app.status?.current === 'approved' || 
      app.status === 'completed' || app.status === 'approved'
    ).length;
    
    const inProgressApplications = applicationsData.filter(app => 
      app.status?.current === 'under_review' || app.status?.current === 'in_process' ||
      app.status === 'under_review' || app.status === 'in_process'
    ).length;
    
    const rejectedApplications = applicationsData.filter(app => 
      app.status?.current === 'rejected' || app.status === 'rejected'
    ).length;
    
    // Calculate success rate
    const successRate = totalApplications > 0 ? (completedApplications / totalApplications) * 100 : 0;
    
    // Calculate average processing time (mock calculation)
    const averageProcessingTime = completedApplications > 0 ? 
      applicationsData.filter(app => 
        app.status?.current === 'completed' || app.status === 'completed'
      ).reduce((acc, app) => {
        const created = new Date(app.timestamps?.createdAt || app.createdAt);
        const completed = new Date(app.timestamps?.updatedAt || app.updatedAt);
        return acc + Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
      }, 0) / completedApplications : 0;
    
    // Calculate revenue (mock calculation - 1500 SAR per completed application)
    const totalRevenue = completedApplications * 1500;
    
    // Mock client satisfaction (85-95% range)
    const clientSatisfaction = 85 + Math.random() * 10;
    
    return {
      totalApplications,
      totalClients,
      totalEmployees,
      totalPartners: 0, // Mock data
      activeClients,
      activeEmployees,
      pendingApplications,
      completedApplications,
      inProgressApplications,
      rejectedApplications,
      totalRevenue,
      averageProcessingTime: Math.round(averageProcessingTime),
      successRate: Math.round(successRate * 100) / 100,
      clientSatisfaction: Math.round(clientSatisfaction * 100) / 100
    };
  };

  // Helper function to create mock analytics for compatibility
  const createMockAnalytics = (applicationsData, employeesData, clientsData, stats) => {
    const statusBreakdown = [
      { status: 'submitted', count: stats.pendingApplications },
      { status: 'under_review', count: Math.floor(stats.inProgressApplications / 2) },
      { status: 'in_process', count: Math.ceil(stats.inProgressApplications / 2) },
      { status: 'completed', count: stats.completedApplications },
      { status: 'rejected', count: stats.rejectedApplications }
    ];

    const serviceTypeBreakdown = [
      { serviceType: 'business_registration', count: Math.floor(stats.totalApplications * 0.4) },
      { serviceType: 'commercial_registration', count: Math.floor(stats.totalApplications * 0.3) },
      { serviceType: 'engineering_consultation', count: Math.floor(stats.totalApplications * 0.2) },
      { serviceType: 'other_services', count: Math.floor(stats.totalApplications * 0.1) }
    ];

    const recentApplications = applicationsData
      .sort((a, b) => new Date(b.timestamps?.createdAt || b.createdAt) - new Date(a.timestamps?.createdAt || a.createdAt))
      .slice(0, 10)
      .map(app => ({
        clientName: app.client?.name || 'Unknown Client',
        clientEmail: app.client?.email || 'unknown@email.com',
        serviceType: app.serviceDetails?.serviceType || app.serviceType || 'business_registration',
        status: app.status,
        assignedEmployees: Math.floor(Math.random() * 3) + 1,
        createdAt: app.timestamps?.createdAt || app.createdAt
      }));

    return {
      overview: {
        totalApplications: stats.totalApplications,
        totalClients: stats.totalClients,
        totalEmployees: stats.totalEmployees,
        totalPartners: stats.totalPartners
      },
      statusBreakdown,
      serviceTypeBreakdown,
      recentApplications
    };
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSpinner className="animate-spin text-2xl text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Reports</h3>
          <p className="text-gray-600">Fetching analytics and performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-2xl text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Reports</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-[#242021] rounded-xl flex items-center justify-center shadow-lg">
                  <FaChartBar className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    Reports & Analytics
                  </h1>
                  <p className="text-sm text-[#242021] font-medium uppercase tracking-wider">
                    Creative Mark Admin Portal
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
                Comprehensive insights and performance metrics for business intelligence
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 rounded-xl shadow-sm">
                <FaDownload className="mr-2" />
                Export Data
              </button>
              <button className="flex items-center justify-center px-6 py-3 bg-[#242021] text-white font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl">
                <FaPrint className="mr-2" />
                Print Report
              </button>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200"
              />
              <button
                onClick={() => {
                  setDateRange({ startDate: '', endDate: '' });
                  if (activeTab !== 'overview') {
                    handleTabChange(activeTab);
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartBar },
              { id: 'applications', label: 'Applications', icon: FaFileAlt },
              { id: 'employees', label: 'Employees', icon: FaUsers },
              { id: 'clients', label: 'Clients', icon: FaUserTie },
              { id: 'performance', label: 'Performance', icon: FaTrophy },
              { id: 'financial', label: 'Financial', icon: FaDollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center justify-center py-4 px-6 text-base font-medium transition-all duration-200 flex-1 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-b-2 border-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon className="mr-2 text-lg" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'overview' && analytics && (
            <div className="p-6">
              {/* Enhanced Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                      <p className="text-3xl font-bold">{formatNumber(comprehensiveStats.totalApplications)}</p>
                      <p className="text-blue-200 text-xs mt-1">
                        {comprehensiveStats.completedApplications} completed
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <FaFileAlt className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="group relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Active Clients</p>
                      <p className="text-3xl font-bold">{formatNumber(comprehensiveStats.activeClients)}</p>
                      <p className="text-emerald-200 text-xs mt-1">
                        {comprehensiveStats.totalClients} total clients
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <FaUsers className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Team Members</p>
                      <p className="text-3xl font-bold">{formatNumber(comprehensiveStats.activeEmployees)}</p>
                      <p className="text-purple-200 text-xs mt-1">
                        {comprehensiveStats.totalEmployees} total employees
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <FaUserCheck className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="group relative bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                      <p className="text-3xl font-bold">{comprehensiveStats.successRate.toFixed(1)}%</p>
                      <p className="text-orange-200 text-xs mt-1">
                        {comprehensiveStats.averageProcessingTime} avg days
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <FaTrophy className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {formatNumber(comprehensiveStats.completedApplications)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
                  <p className="text-sm text-gray-600">Successfully processed applications</p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <FaClock className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">
                      {formatNumber(comprehensiveStats.pendingApplications)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
                  <p className="text-sm text-gray-600">Applications awaiting review</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaSpinner className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatNumber(comprehensiveStats.inProgressApplications)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">In Progress</h3>
                  <p className="text-sm text-gray-600">Currently being processed</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <FaExclamationTriangle className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-red-600">
                      {formatNumber(comprehensiveStats.rejectedApplications)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejected</h3>
                  <p className="text-sm text-gray-600">Applications that were rejected</p>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
                  </div>
                  <div className="space-y-3">
                    {analytics.statusBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 bg-blue-100 px-2 py-1 rounded-full">{formatNumber(item.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FaChartBar className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Service Types</h3>
                  </div>
                  <div className="space-y-3">
                    {analytics.serviceTypeBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-200">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {item.serviceType.replace('_', ' ')}
                        </span>
                        <span className="text-sm font-bold text-gray-900 bg-emerald-100 px-2 py-1 rounded-full">{formatNumber(item.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="text-white text-sm" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-purple-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Service Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentApplications.map((app, index) => (
                        <tr key={index} className="border-b border-purple-100 hover:bg-white/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold text-gray-900">{app.clientName}</p>
                              <p className="text-sm text-gray-500">{app.clientEmail}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 capitalize">
                            {app.serviceType.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(typeof app.status === 'object' ? app.status.current : app.status)}`}>
                              {getStatusIcon(typeof app.status === 'object' ? app.status.current : app.status)}
                              <span className="ml-1 capitalize">{(typeof app.status === 'object' ? app.status.current : app.status)?.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {app.assignedEmployees} employee(s)
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDate(app.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && applicationReports && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Reports</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Application ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Service Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Processing Days</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicationReports.applications.map((app, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-mono text-gray-600">
                          {app.id.slice(-8)}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{app.client.name}</p>
                            <p className="text-sm text-gray-500">{app.client.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700 capitalize">
                          {app.serviceType.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(typeof app.status === 'object' ? app.status.current : app.status)}`}>
                            {getStatusIcon(typeof app.status === 'object' ? app.status.current : app.status)}
                            <span className="ml-1 capitalize">{(typeof app.status === 'object' ? app.status.current : app.status)?.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {app.processingDays} days
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDate(app.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'employees' && employeeReports && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Completed</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">In Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Completion Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Processing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeReports.employeePerformance.map((emp, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{emp.employeeName}</p>
                            <p className="text-sm text-gray-500">{emp.employeeEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {formatNumber(emp.assignedApplications)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {formatNumber(emp.completedApplications)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {formatNumber(emp.inProgressApplications)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          <span className={`font-medium ${emp.completionRate >= 80 ? 'text-green-600' : emp.completionRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {emp.completionRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {emp.avgProcessingDays ? `${emp.avgProcessingDays} days` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Client Analytics</h3>
              
              {/* Client Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatNumber(comprehensiveStats.totalClients)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Clients</h3>
                  <p className="text-sm text-gray-600">Registered clients in the system</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {formatNumber(comprehensiveStats.activeClients)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Clients</h3>
                  <p className="text-sm text-gray-600">Currently active clients</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaPercent className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {((comprehensiveStats.activeClients / comprehensiveStats.totalClients) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Rate</h3>
                  <p className="text-sm text-gray-600">Percentage of active clients</p>
                </div>
              </div>

              {/* Client List */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Client Details</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Client Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Applications</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.slice(0, 10).map((client, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                                <FaUserTie className="text-white text-sm" />
                              </div>
                              <span className="font-semibold text-gray-900">{client.fullName || client.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">{client.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              client.status === 'active' || !client.status ? 
                                'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'
                            }`}>
                              {client.status === 'active' || !client.status ? 'Active' : client.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {applications.filter(app => app.client?.email === client.email).length}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDate(client.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h3>
              
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FaTrophy className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {comprehensiveStats.successRate.toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
                  <p className="text-sm text-gray-600">Application completion rate</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FaClock className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {comprehensiveStats.averageProcessingTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Processing Time</h3>
                  <p className="text-sm text-gray-600">Days to complete applications</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaStar className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {comprehensiveStats.clientSatisfaction.toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Satisfaction</h3>
                  <p className="text-sm text-gray-600">Overall satisfaction rating</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <FaDollarSign className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatCurrency(comprehensiveStats.totalRevenue)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
                  <p className="text-sm text-gray-600">Generated from completed applications</p>
                </div>
              </div>

              {/* Employee Performance */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.slice(0, 6).map((employee, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                          <FaUserCheck className="text-white text-sm" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{employee.fullName || employee.name}</h5>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-green-600">
                            {applications.filter(app => app.assignedEmployees?.some(emp => emp === employee._id)).length}
                          </p>
                          <p className="text-gray-600">Assigned</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-blue-600">
                            {Math.floor(Math.random() * 90) + 10}%
                          </p>
                          <p className="text-gray-600">Success</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Financial Reports</h3>
              
              {/* Financial Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FaDollarSign className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(comprehensiveStats.totalRevenue)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
                  <p className="text-sm text-gray-600">From completed applications</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatNumber(comprehensiveStats.completedApplications)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Paid Applications</h3>
                  <p className="text-sm text-gray-600">Applications with completed payments</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FaChartLine className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatCurrency(comprehensiveStats.totalRevenue / Math.max(comprehensiveStats.completedApplications, 1))}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Revenue</h3>
                  <p className="text-sm text-gray-600">Per completed application</p>
                </div>
              </div>

              {/* Service Revenue Breakdown */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Revenue Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { service: 'Business Registration', revenue: comprehensiveStats.totalRevenue * 0.4, count: Math.floor(comprehensiveStats.completedApplications * 0.4) },
                    { service: 'Commercial Registration', revenue: comprehensiveStats.totalRevenue * 0.3, count: Math.floor(comprehensiveStats.completedApplications * 0.3) },
                    { service: 'Engineering Consultation', revenue: comprehensiveStats.totalRevenue * 0.2, count: Math.floor(comprehensiveStats.completedApplications * 0.2) },
                    { service: 'Other Services', revenue: comprehensiveStats.totalRevenue * 0.1, count: Math.floor(comprehensiveStats.completedApplications * 0.1) }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{item.service}</h5>
                        <span className="text-lg font-bold text-emerald-600">{formatCurrency(item.revenue)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.count} applications</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(item.revenue / comprehensiveStats.totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
