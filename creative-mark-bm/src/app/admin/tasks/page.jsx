"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaPlus, 
  FaList, 
  FaTasks, 
  FaUserCheck, 
  FaSpinner,
  FaFilter,
  FaSearch,
  FaFileAlt,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaBars,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import api from '../../../services/api';

const AdminTasksPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Form state for creating tasks
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    applicationId: '',
    dueDate: '',
    estimatedHours: '',
    tags: []
  });

  const tabs = [
    { id: 'all', label: 'All Tasks', icon: FaList, count: 0 },
    { id: 'open', label: 'Open', icon: FaClock, count: 0 },
    { id: 'in_progress', label: 'In Progress', icon: FaTasks, count: 0 },
    { id: 'completed', label: 'Completed', icon: FaCheckCircle, count: 0 },
  ];

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, employeesRes, applicationsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/employees'),
        api.get('/applications/all')
      ]);

      setTasks(tasksRes.data.data || []);
      setEmployees(employeesRes.data.data || []);
      setApplications(applicationsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for API call
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
        applicationId: formData.applicationId || null,
        tags: formData.tags || []
      };
      
      const response = await api.post('/tasks', taskData);
      if (response.data.success) {
        setTasks(prev => [response.data.data, ...prev]);
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          assignedTo: '',
          applicationId: '',
          dueDate: '',
          estimatedHours: '',
          tags: []
        });
        
        // Show success message
        alert('Task created successfully! The assigned employee will be notified.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      console.error('Error response:', error.response?.data);
      console.error('Form data being sent:', taskData);
      
      // Show user-friendly error message
      if (error.response?.data?.message) {
        alert(`Error creating task: ${error.response.data.message}`);
      } else {
        alert('Error creating task. Please check the console for details.');
      }
    }
  };

  const handleStatusUpdate = async (taskId, status, note = '') => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, {
        status,
        note
      });
      if (response.data.success) {
        setTasks(prev => prev.map(task => 
          task._id === taskId ? response.data.data : task
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesTab = activeTab === 'all' || task.status === activeTab;
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSpinner className="animate-spin text-2xl text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Tasks</h3>
          <p className="text-gray-600">Fetching the latest task data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FaTasks className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                      Task Management
                    </h1>
                    <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">
                      Creative Mark Admin Portal
                    </p>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
                  Create, assign, and track tasks for your team members
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Task
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Analytics Dashboard */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FaTasks className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tasks.filter(task => task.status === 'in_progress').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {tasks.length > 0 ? Math.round((tasks.filter(task => task.status === 'in_progress').length / tasks.length) * 100) : 0}% of total
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaClock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {tasks.filter(task => task.status === 'completed').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {tasks.length > 0 ? Math.round((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100) : 0}% completion rate
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">
                      {tasks.filter(task => isOverdue(task.dueDate, task.status)).length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Need attention</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Tab Navigation */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <nav className="flex space-x-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const count = tasks.filter(task => 
                    tab.id === 'all' || task.status === tab.id
                  ).length;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        <span>{tab.label}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }`}>
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {task.title}
                        </h3>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex gap-1">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{task.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUsers className="w-4 h-4" />
                      <span>Assigned to: {task.assignedTo?.fullName || task.assignedTo?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaClock className="w-4 h-4" />
                      <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : ''}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {task.applicationId && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-emerald-900">📋 Related Application</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              typeof task.applicationId.status === 'object' 
                                ? task.applicationId.status.current === 'approved' ? 'bg-green-100 text-green-800' :
                                  task.applicationId.status.current === 'in_process' ? 'bg-blue-100 text-blue-800' :
                                  task.applicationId.status.current === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {typeof task.applicationId.status === 'object' ? task.applicationId.status.current : task.applicationId.status || 'Unknown'}
                            </span>
                          </div>
                          <p className="text-sm text-emerald-800 font-medium">
                            {typeof task.applicationId === 'object' 
                              ? task.applicationId.serviceType?.replace('_', ' ') || 'Unknown Service'
                              : 'Application'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

              
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <FaTasks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first task.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Task
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <FaPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
                    <p className="text-sm text-emerald-600 font-medium">Assign tasks to your team members</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter a clear, descriptive task title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Provide detailed instructions and requirements for this task..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🟠 High Priority</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To Employee *
                  </label>
                  <select
                    required
                    value={formData.assignedTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">👤 Select Employee</option>
                    {employees.map((employee, index) => (
                      <option key={employee._id || `employee-${index}`} value={employee._id}>
                        {employee.fullName || employee.name} - {employee.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Due Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⏱️ Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="e.g., 8 hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 Related Application (Optional)
                  </label>
                  <select
                    value={formData.applicationId}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">No related application</option>
                    {applications.map((app, index) => (
                      <option key={app._id || `app-${index}`} value={app._id}>
                        {app.serviceType?.replace('_', ' ')} - {typeof app.status === 'object' ? app.status.current : app.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏷️ Tags (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="e.g., frontend, urgent, client-work"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTasksPage;