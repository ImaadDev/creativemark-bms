"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaList, 
  FaTasks, 
  FaSpinner,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaCalendarAlt,
  FaUser,
  FaFlag,
  FaTimes
} from 'react-icons/fa';
import { isAuthenticated } from '../../../services/auth';
import api from '../../../services/api';

const EmployeeTasksPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  const tabs = [
    { id: 'all', label: 'All Tasks', icon: FaList, count: 0 },
    { id: 'open', label: 'Open', icon: FaClock, count: 0 },
    { id: 'in_progress', label: 'In Progress', icon: FaTasks, count: 0 },
    { id: 'completed', label: 'Completed', icon: FaCheckCircle, count: 0 },
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    fetchMyTasks();
  }, [router]);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks/my-tasks');
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching my tasks:', error);
    } finally {
      setLoading(false);
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
        setShowTaskModal(false);
        setStatusNote('');
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
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading My Tasks</h3>
          <p className="text-gray-600">Fetching your assigned tasks...</p>
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
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaTasks className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  My Tasks
                </h1>
                <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">
                  Creative Mark Employee Portal
                </p>
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
              Track and manage your assigned tasks
            </p>
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

          {/* Tasks List */}
          <div className="space-y-6">
            {filteredTasks.map((task) => {
              const daysUntilDue = getDaysUntilDue(task.dueDate);
              const overdue = isOverdue(task.dueDate, task.status);
              
              return (
                <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          {overdue && (
                            <FaExclamationTriangle className="w-4 h-4 text-red-500" title="Overdue" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {task.description}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowTaskModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        <FaFlag className="w-3 h-3 inline mr-1" />
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUser className="w-4 h-4" />
                        <span>Assigned by: {task.assignedBy?.fullName || task.assignedBy?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span className={overdue ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="w-4 h-4" />
                        <span className={overdue ? 'text-red-600 font-medium' : daysUntilDue <= 1 ? 'text-orange-600 font-medium' : ''}>
                          {overdue ? 'Overdue' : daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`}
                        </span>
                      </div>
                    </div>

                    {task.applicationId && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <strong>Related Application:</strong> {task.applicationId.serviceType?.replace('_', ' ')} - {task.applicationId.status}
                        </p>
                      </div>
                    )}

                    {task.estimatedHours && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600">
                          <strong>Estimated Hours:</strong> {task.estimatedHours} hours
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {task.status === 'open' && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, 'in_progress')}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <FaTasks className="w-3 h-3" />
                          Start Task
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowTaskModal(true);
                          }}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <FaCheckCircle className="w-3 h-3" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <FaTasks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria.' : 'You have no assigned tasks at the moment.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedTask.title}</h2>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedTask(null);
                    setStatusNote('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
                  <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned By</h3>
                  <p className="text-gray-900">{selectedTask.assignedBy?.fullName || selectedTask.assignedBy?.name}</p>
                </div>
              </div>

              {selectedTask.applicationId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Related Application</h3>
                  <p className="text-gray-900">{selectedTask.applicationId.serviceType?.replace('_', ' ')} - {selectedTask.applicationId.status}</p>
                </div>
              )}

              {selectedTask.estimatedHours && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Estimated Hours</h3>
                  <p className="text-gray-900">{selectedTask.estimatedHours} hours</p>
                </div>
              )}

              {selectedTask.notes && selectedTask.notes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                  <div className="space-y-2">
                    {selectedTask.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">{note.note}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By {note.addedBy?.fullName || note.addedBy?.name} on {new Date(note.addedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedTask.status === 'in_progress' || selectedTask.status === 'open') && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Add Note (Optional)</h3>
                  <textarea
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Add a note about this task update..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setSelectedTask(null);
                    setStatusNote('');
                  }}
                  className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedTask.status === 'open' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedTask._id, 'in_progress', statusNote)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Start Task
                  </button>
                )}
                {selectedTask.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedTask._id, 'completed', statusNote)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeTasksPage;