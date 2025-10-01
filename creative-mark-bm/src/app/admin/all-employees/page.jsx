"use client";

import { useState, useEffect } from "react";
import { getAllEmployees } from "../../../services/employeeApi";
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
  FaEdit,
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
  FaShieldAlt
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

export default function AllEmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchEmployees();
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

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees();
      console.log("Employees API response:", response);
      
      if (response.success && response.data) {
        setEmployees(response.data);
      } else {
        console.error("Failed to fetch employees:", response.message);
        setEmployees([]);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
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
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || employee.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  // Handle actions
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleEditEmployee = (employee) => {
    // TODO: Implement edit employee functionality
    console.log("Edit employee:", employee);
  };

  const handleDeleteEmployee = async (employee) => {
    if (!currentUser || currentUser.role !== "admin") {
      Swal.fire({
        title: 'Permission Denied',
        text: 'Only admin can delete employees.',
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

    const result = await Swal.fire({
      title: 'Delete Employee',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-4">
            Are you sure you want to delete <strong>${employee.name}</strong>?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-red-800 font-semibold mb-2">⚠️ This action cannot be undone and will permanently remove:</p>
            <ul class="text-red-700 text-sm space-y-1">
              <li>• Employee account and profile</li>
              <li>• All associated data and records</li>
              <li>• Access permissions and assignments</li>
            </ul>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p class="text-gray-600 text-sm">
              <strong>Employee:</strong> ${employee.name}
            </p>
            <p class="text-gray-600 text-sm">
              <strong>Email:</strong> ${employee.email}
            </p>
            <p class="text-gray-600 text-sm">
              <strong>Department:</strong> ${employee.department || 'N/A'}
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete Employee!',
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
        setDeletingId(employee._id || employee.id);

        // Show loading alert
        Swal.fire({
          title: 'Deleting Employee...',
          text: 'Please wait while we delete the employee.',
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

        await deleteUser(employee._id || employee.id, currentUser._id);

        // Remove the deleted employee from the local state
        setEmployees(prev => prev.filter(emp => (emp._id || emp.id) !== (employee._id || employee.id)));

        // Show success alert
        Swal.fire({
          title: 'Successfully Deleted!',
          text: `${employee.name} has been permanently deleted.`,
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
        console.error('Error deleting employee:', error);
        Swal.fire({
          title: 'Deletion Failed',
          text: `Failed to delete employee: ${error.message}`,
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

  return (
    <div className="min-h-screen">
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
                    Employee Management
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Manage employee accounts, profiles, and team coordination
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/add-user')}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Add Employee
              </button>
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
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
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
                <p className="text-3xl font-bold text-emerald-600">{employees.filter(emp => emp.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-3xl font-bold text-blue-600">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaBuilding className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-3xl font-bold text-purple-600">{filteredEmployees.length}</p>
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
                  placeholder="Search employees by name, email, or department..."
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
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-4 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employees Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSpinner className="animate-spin text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Employees</h3>
                <p className="text-gray-600">Fetching the latest employee data...</p>
              </div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Employees Found</h3>
              <p className="text-gray-500 mb-8">No employees match your current filters.</p>
              <button
                onClick={() => router.push('/admin/add-user')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Add First Employee
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee._id || employee.id}
                  className="group bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {/* Employee Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-200 rounded-2xl flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                        <FaUser className="text-emerald-600 text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{employee.name}</h3>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(employee.status)}
                        <span className={`text-xs font-medium px-3 py-1 border rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status === 'active' ? 'Active' : employee.status === 'inactive' ? 'Inactive' : employee.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaBuilding className="mr-3 text-emerald-500" />
                      <span>{employee.department || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUserCheck className="mr-3 text-emerald-500" />
                      <span>{employee.role || "Employee"}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FaPhone className="mr-3 text-emerald-500" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendar className="mr-3 text-emerald-500" />
                      <span>Joined: {formatDate(employee.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleViewEmployee(employee)}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                    >
                      <FaEye className="text-sm" />
                      View
                    </button>
                    {currentUser && currentUser.role === "admin" && (
                      <button
                        onClick={() => handleDeleteEmployee(employee)}
                        disabled={deletingId === (employee._id || employee.id)}
                        className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 text-sm bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 disabled:opacity-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 disabled:hover:scale-100"
                      >
                        {deletingId === (employee._id || employee.id) ? (
                          <>
                            <FaSpinner className="animate-spin text-sm" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FaTrash className="text-sm" />
                            Delete Employee
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employee Details Modal */}
        {showDetailsModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-900">
                  Employee Details
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
                        <p className="text-gray-700 font-semibold">{selectedEmployee.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-4 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="text-gray-700 font-semibold">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    {selectedEmployee.phone && (
                      <div className="flex items-center">
                        <FaPhone className="mr-4 text-blue-500" />
                        <div>
                          <span className="text-sm text-gray-500">Phone</span>
                          <p className="text-gray-700 font-semibold">{selectedEmployee.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedEmployee.address && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-4 text-blue-500" />
                        <div>
                          <span className="text-sm text-gray-500">Address</span>
                          <p className="text-gray-700 font-semibold">{selectedEmployee.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-white text-lg" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Work Information</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaBuilding className="mr-4 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Department</span>
                        <p className="text-gray-700 font-semibold">{selectedEmployee.department || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaUserCheck className="mr-4 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Role</span>
                        <p className="text-gray-700 font-semibold">{selectedEmployee.role || "Employee"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(selectedEmployee.status)}
                      <div className="ml-4">
                        <span className="text-sm text-gray-500">Status</span>
                        <p className="text-gray-700 font-semibold">{selectedEmployee.status || "Active"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-4 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Joined Date</span>
                        <p className="text-gray-700 font-semibold">{formatDate(selectedEmployee.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
               
                {currentUser && currentUser.role === "admin" && (
                  <button
                    onClick={() => handleDeleteEmployee(selectedEmployee)}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <FaTrash className="inline mr-2" />
                    Delete Employee
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