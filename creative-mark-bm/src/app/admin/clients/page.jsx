"use client";

import { useState, useEffect } from "react";
// import { getAllClients, deleteClient } from "../../../services/clientApi";
// import { getAllEmployees } from "../../../services/employeeApi";
import api from "../../../services/api";
// import { checkBackendHealth } from "../../../services/api";
import { FullPageLoading } from "../../../components/LoadingSpinner";
import { 
  FaEdit, 
  FaTrash, 
  FaEnvelope, 
  FaSearch, 
  FaFilter, 
  FaUserPlus, 
  FaEye, 
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaUsers,
  FaUserCheck,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
  FaFileAlt
} from "react-icons/fa";

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clientToAssign, setClientToAssign] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Test backend connection first
        // const backendTest = await checkBackendHealth();
        // if (!backendTest) {
        //   console.error("Backend is not running or not accessible");
        //   setClients([]);
        //   setEmployees([]);
        //   return;
        // }
  
        const [clientsResponse, employeesResponse] = await Promise.all([
          api.get('/clients'),
          api.get('/employees')
        ]);
  
        console.log("Clients API response:", clientsResponse);
        console.log("Employees API response:", employeesResponse);
        
        // Handle clients data
        if (clientsResponse.data.success && clientsResponse.data.data) {
          setClients(clientsResponse.data.data);
        } else {
          console.error("Failed to fetch clients:", clientsResponse.data.message);
          setClients([]);
        }
        
        // Handle employees data
        if (employeesResponse.data.success && employeesResponse.data.data) {
          setEmployees(employeesResponse.data.data);
        } else {
          console.error("Failed to fetch employees:", employeesResponse.data.message);
          setEmployees([]);
        }
  
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setClients([]);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-50 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-orange-50 text-orange-800 border-orange-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle client actions
  const handleViewClient = (client) => {
    setSelectedClient(client);
  };

  const handleAssignClient = (client) => {
    setClientToAssign(client);
    setShowAssignModal(true);
  };

  const handleDeleteClient = async (client) => {
    // Create a modern SweetAlert-style confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    confirmDialog.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-100 transform transition-all duration-300 scale-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Delete Client</h3>
          <button id="closeDialog" class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-red-100 border border-red-200 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Are you sure?</p>
              <p class="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-gray-700 text-sm">
              You are about to permanently delete <span class="font-semibold text-gray-900">${client.name}</span> and all associated data including:
            </p>
            <ul class="mt-2 text-sm text-gray-600 space-y-1">
              <li>• All applications and requests</li>
              <li>• All uploaded documents</li>
              <li>• All timeline entries</li>
              <li>• All payment records</li>
            </ul>
          </div>
        </div>
        
        <div class="flex gap-4">
          <button id="cancelDelete" class="flex-1 px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium rounded-lg">
            Cancel
          </button>
          <button id="confirmDelete" class="flex-1 px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition font-medium rounded-lg flex items-center justify-center gap-2">
            <svg id="deleteSpinner" class="w-4 h-4 animate-spin hidden" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span id="deleteText">Delete Client</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmDialog);

    // Add event listeners
    const closeDialog = () => {
      document.body.removeChild(confirmDialog);
    };

    confirmDialog.querySelector('#closeDialog').addEventListener('click', closeDialog);
    confirmDialog.querySelector('#cancelDelete').addEventListener('click', closeDialog);
    
    confirmDialog.querySelector('#confirmDelete').addEventListener('click', async () => {
      const deleteBtn = confirmDialog.querySelector('#confirmDelete');
      const deleteSpinner = confirmDialog.querySelector('#deleteSpinner');
      const deleteText = confirmDialog.querySelector('#deleteText');
      
      try {
        setDeleting(true);
        deleteBtn.disabled = true;
        deleteSpinner.classList.remove('hidden');
        deleteText.textContent = 'Deleting...';

        const response = await api.delete(`/clients/${client._id}`);
        
        if (response.data.success) {
          // Remove client from state
          setClients(clients.filter(c => c._id !== client._id));
          if (selectedClient?._id === client._id) {
            setSelectedClient(null);
          }
          
          // Show success message
          closeDialog();
          showSuccessMessage(client.name, response.data);
        } else {
          throw new Error(response.message || 'Failed to delete client');
        }
      } catch (error) {
        console.error("Failed to delete client:", error);
        deleteBtn.disabled = false;
        deleteSpinner.classList.add('hidden');
        deleteText.textContent = 'Delete Client';
        
        // Show error message
        showErrorMessage(error.message || 'Failed to delete client');
      } finally {
        setDeleting(false);
      }
    });

    // Close on backdrop click
    confirmDialog.addEventListener('click', (e) => {
      if (e.target === confirmDialog) {
        closeDialog();
      }
    });
  };

  const showSuccessMessage = (clientName, deleteData) => {
    const successDialog = document.createElement('div');
    successDialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    successDialog.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-100 transform transition-all duration-300 scale-100">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Client Deleted Successfully</h3>
          <p class="text-gray-600 mb-6">
            <span class="font-semibold">${clientName}</span> and all associated data have been permanently removed.
          </p>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Deleted Data:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• ${deleteData.deletedApplications} applications</li>
              <li>• All related documents</li>
              <li>• All timeline entries</li>
              <li>• All payment records</li>
            </ul>
          </div>
          <button id="closeSuccess" class="w-full px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium rounded-lg">
            Continue
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(successDialog);
    
    successDialog.querySelector('#closeSuccess').addEventListener('click', () => {
      document.body.removeChild(successDialog);
    });

    // Auto close after 3 seconds
    setTimeout(() => {
      if (document.body.contains(successDialog)) {
        document.body.removeChild(successDialog);
      }
    }, 3000);
  };

  const showErrorMessage = (message) => {
    const errorDialog = document.createElement('div');
    errorDialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
    errorDialog.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-100 transform transition-all duration-300 scale-100">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Delete Failed</h3>
          <p class="text-gray-600 mb-6">${message}</p>
          <button id="closeError" class="w-full px-6 py-3 bg-gray-600 text-white hover:bg-gray-700 transition font-medium rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(errorDialog);
    
    errorDialog.querySelector('#closeError').addEventListener('click', () => {
      document.body.removeChild(errorDialog);
    });
  };

  const confirmAssignClient = async () => {
    try {
      // TODO: Implement assign client API call
      console.log("Assigning client:", clientToAssign, "to employee:", selectedEmployee);
      setShowAssignModal(false);
      setClientToAssign(null);
      setSelectedEmployee("");
    } catch (error) {
      console.error("Failed to assign client:", error);
    }
  };

  const tabs = [
    {
      id: 'all',
      label: 'All Clients',
      icon: FaUsers,
      description: 'View all registered clients',
      color: 'green'
    },
    {
      id: 'active',
      label: 'Active Clients',
      icon: FaUserCheck,
      description: 'Currently active client accounts',
      color: 'blue'
    },
    {
      id: 'pending',
      label: 'Pending Review',
      icon: FaExclamationTriangle,
      description: 'Clients awaiting approval',
      color: 'yellow'
    }
  ];

  const getStatusFilter = (tabId) => {
    switch (tabId) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      default:
        return 'all';
    }
  };

  if (loading) {
    return <FullPageLoading text="Loading Clients..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUsers className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    Client Management
                  </h1>
                  <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">
                    Creative Mark Admin Portal
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
                Manage client accounts, assignments, and relationships efficiently
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
                <div className="text-sm text-gray-600 font-medium">
                  {filteredClients.length} of {clients.length} clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFilterStatus(getStatusFilter(tab.id));
                }}
                className={`flex items-center justify-center px-6 py-4 text-base font-medium transition-all duration-200 flex-1 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <tab.icon className="mr-2 text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clients Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-16 px-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Clients Found</h3>
              <p className="text-gray-500 mb-8">No clients match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Clients List */}
              <div className="lg:col-span-1 border-r border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Client Directory
                    </h3>
                  </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  {filteredClients.map((client) => (
                    <div
                      key={client._id}
                      className={`p-6 border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-blue-50/50 transition-all duration-200 cursor-pointer group ${
                        selectedClient?._id === client._id ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-l-emerald-600' : ''
                      }`}
                      onClick={() => handleViewClient(client)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.email}</p>
                          {client.phone && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <FaPhone className="mr-1 text-xs" />
                              {client.phone}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 border rounded-full ${getStatusColor(client.status || 'active')}`}>
                          {client.status === 'active' ? 'Active' : client.status === 'inactive' ? 'Inactive' : client.status || 'Active'}
                        </span>
                      </div>
                      
                      {/* Quick Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClient(client);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg transition-all duration-200"
                        >
                          <FaEye className="text-xs" />
                          View
                        </button>
                      
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClient(client);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg transition-all duration-200"
                        >
                          <FaTrash className="text-xs" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Details */}
              <div className="lg:col-span-2">
                {selectedClient ? (
                  <div className="h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedClient.name}
                          </h2>
                          <p className="text-gray-600">{selectedClient.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-3 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition rounded-lg" 
                            title="Send Email"
                          >
                            <FaEnvelope />
                          </button>
                          <button 
                            onClick={() => handleDeleteClient(selectedClient)}
                            className="p-3 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition rounded-lg"
                            title="Delete Client"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      {/* Client Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <FaEnvelope className="text-white text-sm" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Contact Information</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <FaEnvelope className="mr-3 text-blue-500" />
                              <span className="text-gray-700">{selectedClient.email}</span>
                            </div>
                            <div className="flex items-center">
                              <FaPhone className="mr-3 text-blue-500" />
                              <span className="text-gray-700">{selectedClient.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-3 text-blue-500" />
                              <span className="text-gray-700">{selectedClient.address?.city || "N/A"}</span>
                            </div>
                            <div className="flex items-center">
                              <FaUserCheck className="mr-3 text-blue-500" />
                              <span className={`px-3 py-1 text-sm font-medium border rounded-full ${getStatusColor(selectedClient.status || 'Active')}`}>
                                {selectedClient.status || "Active"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <FaFileAlt className="text-white text-sm" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Account Details</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-3 text-emerald-500" />
                              <div>
                                <span className="text-sm text-gray-500">Member Since</span>
                                <p className="text-gray-700 font-medium">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FaFileAlt className="mr-3 text-emerald-500" />
                              <div>
                                <span className="text-sm text-gray-500">Total Requests</span>
                                <p className="text-gray-700 font-medium">{selectedClient.requests?.length || 0}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-3 text-emerald-500" />
                              <div>
                                <span className="text-sm text-gray-500">Last Activity</span>
                                <p className="text-gray-700 font-medium">{selectedClient.lastUpdate || "Not available"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Requests */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-white text-sm" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800">Recent Requests</h4>
                        </div>
                        {selectedClient.requests && selectedClient.requests.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {selectedClient.requests.slice(0, 5).map((req) => (
                              <div key={req._id} className="bg-white p-4 border border-purple-200 rounded-lg shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900">{req.title}</h5>
                                    <p className="text-sm text-gray-600">
                                      {req.type} • {req.serviceCategory}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Created: {new Date(req.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <span className={`text-xs font-medium px-2.5 py-1 border rounded-full ${getStatusColor(req.status)}`}>
                                    {req.status}
                                  </span>
                                </div>
                                {req.assignedTo && (
                                  <p className="text-xs text-emerald-600 flex items-center">
                                    <FaUserCheck className="mr-1" />
                                    Assigned to {req.assignedTo.name}
                                  </p>
                                )}
                              </div>
                            ))}
                            {selectedClient.requests.length > 5 && (
                              <p className="text-sm text-gray-500 text-center">
                                And {selectedClient.requests.length - 5} more requests...
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-white border border-purple-200 rounded-lg">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <FaFileAlt className="text-xl text-gray-400" />
                            </div>
                            <p className="text-gray-500">No requests found for this client</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaEye className="text-2xl text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">Select a Client</h3>
                      <p className="text-gray-500">Choose a client from the list to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}