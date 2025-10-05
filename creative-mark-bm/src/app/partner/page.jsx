"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaGauge, 
  FaListCheck, 
  FaUpload, 
  FaCircleCheck, 
  FaClock, 
  FaTriangleExclamation,
  FaChartLine,
  FaUsers,
  FaFile,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaCalendar,
  FaDollarSign,
  FaBuilding,
  FaHandshake,
  FaSpinner,
  FaEye,
  FaDownload,
  FaPlus,
  FaComments,
  FaChartColumn,
  FaArrowTrendUp,
  FaAward,
  FaStar,
  FaGlobe,
  FaClock as FaTime,
  FaCheck,
  FaXmark,
  FaCircleInfo
} from 'react-icons/fa6';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
      totalEarnings: 0,
      monthlyEarnings: 0,
      activeClients: 0,
      successRate: 0
    },
    recentActivities: [],
    upcomingDeadlines: [],
    performanceMetrics: {},
    notifications: []
  });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          stats: {
            totalTasks: 24,
            completedTasks: 18,
            pendingTasks: 4,
            overdueTasks: 2,
            totalEarnings: 45600,
            monthlyEarnings: 12800,
            activeClients: 12,
            successRate: 94.5
          },
          recentActivities: [
            {
              id: 1,
              type: 'task_completed',
              title: 'Document Review Completed',
              description: 'Successfully reviewed and approved legal documents for ABC Company',
              timestamp: '2 hours ago',
              icon: FaCircleCheck,
              color: 'text-green-500'
            },
            {
              id: 2,
              type: 'upload',
              title: 'Report Uploaded',
              description: 'Final compliance report uploaded for XYZ Corporation',
              timestamp: '4 hours ago',
              icon: FaUpload,
              color: 'text-blue-500'
            },
            {
              id: 3,
              type: 'communication',
              title: 'Client Communication',
              description: 'Responded to client inquiry regarding visa processing',
              timestamp: '1 day ago',
              icon: FaComments,
              color: 'text-purple-500'
            },
            {
              id: 4,
              type: 'deadline',
              title: 'Deadline Approaching',
              description: 'Document submission deadline for DEF Ltd. in 2 days',
              timestamp: '2 days ago',
              icon: FaTriangleExclamation,
              color: 'text-orange-500'
            }
          ],
          upcomingDeadlines: [
            {
              id: 1,
              title: 'Visa Application Submission',
              client: 'ABC Company',
              deadline: '2024-01-15',
              priority: 'high',
              status: 'pending'
            },
            {
              id: 2,
              title: 'Legal Document Review',
              client: 'XYZ Corporation',
              deadline: '2024-01-18',
              priority: 'medium',
              status: 'in_progress'
            },
            {
              id: 3,
              title: 'Compliance Report',
              client: 'DEF Ltd.',
              deadline: '2024-01-20',
              priority: 'low',
              status: 'pending'
            }
          ],
          performanceMetrics: {
            monthlyGrowth: 12.5,
            clientSatisfaction: 4.8,
            taskCompletionRate: 94.5,
            averageResponseTime: '2.3 hours'
          },
          notifications: [
            {
              id: 1,
              type: 'info',
              title: 'New Task Assigned',
              message: 'You have been assigned a new document review task',
              timestamp: '1 hour ago',
              read: false
            },
            {
              id: 2,
              type: 'success',
              title: 'Payment Received',
              message: 'Payment of $2,500 has been processed for completed tasks',
              timestamp: '3 hours ago',
              read: false
            },
            {
              id: 3,
              type: 'warning',
              title: 'Deadline Reminder',
              message: 'Document submission deadline approaching for ABC Company',
              timestamp: '5 hours ago',
              read: true
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <FaSpinner className="animate-spin text-2xl text-emerald-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Partner Dashboard</h1>
            <p className="text-emerald-100 text-lg">
              Welcome back, {user?.fullName || 'Partner'}! Here's your performance overview.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-emerald-200 text-sm">Partner Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="font-semibold">Active</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-200 text-sm">Success Rate</p>
              <p className="text-2xl font-bold">{dashboardData.stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats.totalTasks}</p>
              <div className="flex items-center mt-2">
                <FaArrowTrendUp className="text-green-500 text-sm mr-1" />
                <span className="text-green-600 text-sm font-medium">+12% this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaListCheck className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats.completedTasks}</p>
              <div className="flex items-center mt-2">
                <FaCircleCheck className="text-green-500 text-sm mr-1" />
                <span className="text-green-600 text-sm font-medium">75% completion rate</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCircleCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats.pendingTasks}</p>
              <div className="flex items-center mt-2">
                <FaClock className="text-yellow-500 text-sm mr-1" />
                <span className="text-yellow-600 text-sm font-medium">2 overdue</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Monthly Earnings */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Earnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(dashboardData.stats.monthlyEarnings)}</p>
              <div className="flex items-center mt-2">
                <FaArrowUp className="text-green-500 text-sm mr-1" />
                <span className="text-green-600 text-sm font-medium">+8.2% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FaDollarSign className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color.replace('text-', 'bg-').replace('-500', '-100')}`}>
                      <IconComponent className={`${activity.color} text-lg`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                      <p className="text-gray-400 text-xs mt-2">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
      <div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h3>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{deadline.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{deadline.client}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{formatDate(deadline.deadline)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deadline.status)}`}>
                      {deadline.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaChartLine className="text-blue-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.performanceMetrics.monthlyGrowth}%</p>
              <p className="text-gray-600 text-sm">Monthly Growth</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaStar className="text-yellow-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.performanceMetrics.clientSatisfaction}</p>
              <p className="text-gray-600 text-sm">Client Rating</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCircleCheck className="text-green-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.performanceMetrics.taskCompletionRate}%</p>
              <p className="text-gray-600 text-sm">Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTime className="text-purple-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.performanceMetrics.averageResponseTime}</p>
              <p className="text-gray-600 text-sm">Avg Response</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <FaPlus className="text-blue-600 text-xl" />
              </div>
              <span className="font-medium text-gray-900">New Task</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <FaUpload className="text-green-600 text-xl" />
              </div>
              <span className="font-medium text-gray-900">Upload File</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <FaComments className="text-purple-600 text-xl" />
              </div>
              <span className="font-medium text-gray-900">Messages</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <FaChartColumn className="text-orange-600 text-xl" />
              </div>
              <span className="font-medium text-gray-900">Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Notifications</h3>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
            Mark All as Read
          </button>
        </div>
        <div className="space-y-3">
          {dashboardData.notifications.map((notification) => (
            <div key={notification.id} className={`flex items-start space-x-3 p-4 rounded-xl ${!notification.read ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                <p className="text-gray-400 text-xs mt-2">{notification.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
