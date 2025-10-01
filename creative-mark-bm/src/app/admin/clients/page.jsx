"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllClients } from "../../../services/clientApi";
import { getAllApplications } from "../../../services/applicationService";
import { deleteUser } from "../../../services/userService";
import { getCurrentUser } from "../../../services/auth";
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaUserCheck, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaSpinner,
  FaUsers,
  FaBuilding,
  FaClock,
  FaEye,
  FaUserPlus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaMapMarkerAlt,
  FaTrash,
  FaArrowLeft,
  FaPlus,
  FaIdCard,
  FaShieldAlt,
  FaFileAlt,
  FaChartLine,
  FaDollarSign,
  FaHandshake,
  FaUserTimes
} from "react-icons/fa";
import Swal from 'sweetalert2';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user.data);
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients and applications in parallel
      const [clientsResponse, applicationsResponse] = await Promise.all([
        getAllClients(),
        getAllApplications()
      ]);
      
      console.log("Clients API response:", clientsResponse);
      console.log("Applications API response:", applicationsResponse);
      
      const clientsData = clientsResponse.success ? (clientsResponse.data || []) : [];
      const applicationsData = applicationsResponse.data || [];
      
      setClients(clientsData);
      setApplications(applicationsData);
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setClients([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "suspended":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="text-emerald-600" />;
      case "inactive":
        return <FaTimesCircle className="text-red-600" />;
      case "pending":
        return <FaClock className="text-amber-600" />;
      case "suspended":
        return <FaExclamationTriangle className="text-orange-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  // Filter clients based on search and filters
  const filteredClients = clients.filter(client => {
    const matchesSearch = (client.fullName || client.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for filter
  const statuses = [...new Set(clients.map(client => client.status).filter(Boolean))];

  // Handle actions
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };


  const handleDeleteClient = async (client) => {
    if (!currentUser || currentUser.role !== "admin") {
      Swal.fire({
        title: 'Permission Denied',
        text: 'Only admin can delete clients.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'OK',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-gray-900 font-semibold',
          content: 'text-gray-600'
        }
      });
      return;
    }

    // Get client's applications count
    const clientApplications = applications.filter(app => app.client?.email === client.email);
    
    const result = await Swal.fire({
      title: 'Delete Client',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete <strong>${client.fullName || client.name}</strong>?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-red-800 font-semibold mb-2">⚠️ This action cannot be undone and will permanently remove:</p>
            <ul class="text-red-700 text-sm space-y-1">
              <li>• Client account and profile</li>
              <li>• ${clientApplications.length} application(s) and associated data</li>
              <li>• All uploaded documents and timeline entries</li>
              <li>• All payment records and communication history</li>
            </ul>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p class="text-gray-600 text-sm">
              <strong>Client:</strong> ${client.fullName || client.name}
            </p>
            <p class="text-gray-600 text-sm">
              <strong>Email:</strong> ${client.email}
            </p>
            <p class="text-gray-600 text-sm">
              <strong>Applications:</strong> ${clientApplications.length}
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete Client!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-gray-900 font-semibold',
        content: 'text-gray-600',
        confirmButton: 'rounded-lg font-medium px-6 py-3',
        cancelButton: 'rounded-lg font-medium px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(client._id || client.id);

        // Show loading alert
        Swal.fire({
          title: 'Deleting Client...',
          text: 'Please wait while we delete the client and all associated data.',
          icon: 'info',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-gray-900 font-semibold'
          },
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await deleteUser(client._id || client.id, currentUser._id);

        // Remove the deleted client from the local state
        setClients(prev => prev.filter(c => (c._id || c.id) !== (client._id || client.id)));

        // Show success alert
        Swal.fire({
          title: 'Successfully Deleted!',
          text: `${client.fullName || client.name} and all associated data have been permanently deleted.`,
          icon: 'success',
          confirmButtonColor: '#059669',
          confirmButtonText: 'OK',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-gray-900 font-semibold',
            content: 'text-gray-600',
            confirmButton: 'rounded-lg font-medium px-6 py-3'
          }
        });
      } catch (error) {
        console.error('Error deleting client:', error);
        Swal.fire({
          title: 'Deletion Failed',
          text: `Failed to delete client: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'OK',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-gray-900 font-semibold',
            content: 'text-gray-600',
            confirmButton: 'rounded-lg font-medium px-6 py-3'
          }
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getClientApplications = (clientEmail) => {
    return applications.filter(app => app.client?.email === clientEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    Client Management
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Manage client accounts, applications, and relationships
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 font-medium"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-emerald-600">{clients.filter(client => client.status === 'active' || !client.status).length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaFileAlt className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-3xl font-bold text-purple-600">{filteredClients.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaFilter className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-4 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSpinner className="animate-spin text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Clients</h3>
                <p className="text-gray-600">Fetching the latest client data...</p>
              </div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Clients Found</h3>
              <p className="text-gray-500 mb-8">No clients match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
              {filteredClients.map((client) => {
                const clientApplications = getClientApplications(client.email);
                return (
                  <div
                    key={client._id || client.id}
                    className="group bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    {/* Client Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-200 rounded-2xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                          <FaUser className="text-emerald-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {client.fullName || client.name}
                          </h3>
                          <p className="text-sm text-gray-600">{client.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(client.status)}
                          <span className={`text-xs font-medium px-3 py-1 border rounded-full ${getStatusColor(client.status)}`}>
                            {client.status === 'active' ? 'Active' : client.status === 'inactive' ? 'Inactive' : client.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Client Details */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaEnvelope className="mr-3 text-emerald-500" />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaPhone className="mr-3 text-emerald-500" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.address?.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaMapMarkerAlt className="mr-3 text-emerald-500" />
                          <span>{client.address.city}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <FaFileAlt className="mr-3 text-emerald-500" />
                        <span>{clientApplications.length} applications</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendar className="mr-3 text-emerald-500" />
                        <span>Joined: {formatDate(client.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleViewClient(client)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                      >
                        <FaEye className="text-sm" />
                        View Details
                      </button>
                      {currentUser && currentUser.role === "admin" && (
                        <button
                          onClick={() => handleDeleteClient(client)}
                          disabled={deletingId === (client._id || client.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 disabled:opacity-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 disabled:hover:scale-100"
                        >
                          {deletingId === (client._id || client.id) ? (
                            <>
                              <FaSpinner className="animate-spin text-sm" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash className="text-sm" />
                              Delete Client
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Client Details Modal */}
        {showDetailsModal && selectedClient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-900">
                  Client Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <FaTimesCircle className="text-xl" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FaUser className="text-white text-lg" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Personal Information</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUser className="mr-4 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">Name</span>
                        <p className="text-gray-700 font-semibold">{selectedClient.fullName || selectedClient.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-4 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="text-gray-700 font-semibold">{selectedClient.email}</p>
                      </div>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center">
                        <FaPhone className="mr-4 text-blue-500" />
                        <div>
                          <span className="text-sm text-gray-500">Phone</span>
                          <p className="text-gray-700 font-semibold">{selectedClient.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-4 text-blue-500" />
                        <div>
                          <span className="text-sm text-gray-500">Address</span>
                          <p className="text-gray-700 font-semibold">
                            {selectedClient.address.street && `${selectedClient.address.street}, `}
                            {selectedClient.address.city && `${selectedClient.address.city}, `}
                            {selectedClient.address.country}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <FaIdCard className="text-white text-lg" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Account Information</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      {getStatusIcon(selectedClient.status)}
                      <div className="ml-4">
                        <span className="text-sm text-gray-500">Status</span>
                        <p className="text-gray-700 font-semibold">{selectedClient.status || "Active"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-4 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Joined Date</span>
                        <p className="text-gray-700 font-semibold">{formatDate(selectedClient.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaFileAlt className="mr-4 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Total Applications</span>
                        <p className="text-gray-700 font-semibold">{getClientApplications(selectedClient.email).length}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaUserCheck className="mr-4 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Account Type</span>
                        <p className="text-gray-700 font-semibold">Client</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applications Section */}
              {getClientApplications(selectedClient.email).length > 0 && (
                <div className="mt-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FaFileAlt className="text-white text-lg" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800">Applications</h4>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {getClientApplications(selectedClient.email).slice(0, 5).map((app, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl border border-purple-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {app.serviceDetails?.serviceType || app.serviceType || 'Application'}
                              </h5>
                              <p className="text-sm text-gray-600">ID: {app.applicationId}</p>
                              <p className="text-xs text-gray-500">
                                Created: {formatDate(app.timestamps?.createdAt || app.createdAt)}
                              </p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                              app.status?.current === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                              app.status?.current === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {app.status?.current || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {getClientApplications(selectedClient.email).length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          And {getClientApplications(selectedClient.email).length - 5} more applications...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                {currentUser && currentUser.role === "admin" && (
                  <button
                    onClick={() => handleDeleteClient(selectedClient)}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <FaTrash className="inline mr-2" />
                    Delete Client
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-8 py-4 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium rounded-xl shadow-sm hover:shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}