"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaFileAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaSpinner,
  FaExclamationTriangle,
  FaEye,
  FaUserCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSearch,
  FaFilter,
  FaSort
} from 'react-icons/fa';
import { getAllApplications } from '../../services/applicationService';
import { isAuthenticated } from '../../services/auth';

const RequestsList = ({ statusFilter = 'all', assignedFilter = 'all', onRequestSelect, onRequestAssign, refreshTrigger }) => {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadRequests();
  }, [statusFilter, assignedFilter, currentPage, searchTerm, sortBy, sortOrder, refreshTrigger]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        router.push('/login');
        return;
      }

      const response = await getAllApplications();
      console.log('Applications API response:', response);
      
            if (response.success && response.data) {
              let applications = response.data;
              console.log('Loaded applications:', applications);
              console.log('First application assignedEmployees:', applications[0]?.assignedEmployees);
        
        // Filter by status if needed
        if (statusFilter !== 'all') {
          applications = applications.filter(app => {
            const currentStatus = app.status?.current || app.status;
            switch (statusFilter) {
              case 'Submitted':
                return currentStatus === 'submitted';
              case 'In Progress':
                return currentStatus === 'under_review' || currentStatus === 'in_process';
              default:
                return true;
            }
          });
        }
        
        setRequests(applications);
        setTotalPages(1); // For now, we'll show all applications without pagination
      } else {
        console.error('Invalid API response:', response);
        setRequests([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setRequests([]);
      setTotalPages(1);
      
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      
      // Show user-friendly error message
      alert('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const currentStatus = status?.current || status;
    switch (currentStatus) {
      case 'submitted':
        return <FaFileAlt className="text-blue-600" />;
      case 'under_review':
        return <FaClock className="text-yellow-600" />;
      case 'in_process':
        return <FaHourglassHalf className="text-orange-600" />;
      case 'approved':
        return <FaCheckCircle className="text-green-600" />;
      case 'completed':
        return <FaCheckCircle className="text-green-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request =>
    request.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.serviceDetails?.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaSpinner className="animate-spin text-white text-xl" />
          </div>
          <p className="text-sm text-gray-600 font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <FaFileAlt className="text-3xl text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Requests Found</h3>
        <p className="text-gray-600 mb-8 font-medium">No requests match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by request number, type, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="priority-desc">High Priority First</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {filteredRequests.map((request) => (
          <div
            key={request.applicationId}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg">
                    {getStatusIcon(request.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-medium text-gray-900">
                        {request.serviceDetails?.serviceType || 'Business Registration'}
                      </h3>
                      <span className={`inline-block text-sm font-medium px-3 py-1 border rounded-full ${getStatusColor(request.status)}`}>
                        {formatStatus(request.status)}
                      </span>
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor('Medium')}`}>
                        Medium
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Application ID: {request.applicationId}
                    </p>
                  </div>
                </div>

                {/* Client and Request Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="border-l-4 border-emerald-200 pl-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Client</p>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 flex items-center">
                        <FaUser className="mr-2 text-gray-400" />
                        {request.client?.name || 'N/A'}
                      </p>
                      {request.client?.email && (
                        <p className="text-sm text-gray-600 flex items-center">
                          {request.client.email}
                        </p>
                      )}
                      {request.client?.phone && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaPhone className="mr-2 text-gray-400" />
                          {request.client.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-200 pl-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Service Details</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        Partner Type: {request.serviceDetails?.partnerType || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        External Companies: {request.serviceDetails?.externalCompaniesCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Virtual Office: {request.serviceDetails?.needVirtualOffice ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-emerald-200 pl-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Timeline</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        Created: {formatDate(request.timestamps?.createdAt || request.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Updated: {formatDate(request.timestamps?.updatedAt || request.updatedAt)}
                      </p>
                      {request.assignedEmployees && request.assignedEmployees.length > 0 && (
                        <p className="text-sm text-emerald-600 flex items-center">
                          <FaUserCheck className="mr-2" />
                          Assigned to {request.assignedEmployees.length} employee(s)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {request.description && (
                  <div className="mb-6 border-l-4 border-gray-200 pl-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {request.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="ml-8 flex flex-col space-y-3">
                <button
                  onClick={() => onRequestSelect(request)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                >
                  <FaEye className="mr-2" />
                  View Details
                </button>
                
                {/* Show assign button if no employees assigned or if assignedEmployees is empty/undefined */}
                {(!request.assignedEmployees || request.assignedEmployees.length === 0) && (
                  <button
                    onClick={() => {
                      console.log('Assign button clicked for request:', request);
                      console.log('assignedEmployees:', request.assignedEmployees);
                      console.log('assignedEmployees length:', request.assignedEmployees?.length);
                      onRequestAssign(request);
                    }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                  >
                    <FaUserCheck className="mr-2" />
                    Assign
                  </button>
                )}
                
                {/* Show assigned status if employees are assigned */}
                {request.assignedEmployees && request.assignedEmployees.length > 0 && (
                  <div className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg">
                    <FaUserCheck className="mr-2" />
                    Assigned ({request.assignedEmployees.length})
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const page = currentPage > 3 ? currentPage - 2 + index : index + 1;
              if (page > totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                    currentPage === page
                      ? 'border-emerald-600 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
