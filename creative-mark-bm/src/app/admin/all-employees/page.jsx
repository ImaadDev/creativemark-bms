"use client";

import { useState, useEffect } from "react";
import { getAllEmployees } from "../../../services/employeeApi";
import { FullPageLoading } from "../../../components/LoadingSpinner";
import { 
  FaSearch, 
  FaFilter, 
  FaUser, 
  FaUserCheck, 
  FaTasks, 
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
  FaMapMarkerAlt
} from "react-icons/fa";

export default function AllEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
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
    fetchEmployees();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-50 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="text-green-600" />;
      case "inactive":
        return <FaTimesCircle className="text-red-600" />;
      case "pending":
        return <FaClock className="text-yellow-600" />;
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

  const handleAssignTask = (employee) => {
    setSelectedEmployee(employee);
    setShowAssignModal(true);
  };

  const handleEditEmployee = (employee) => {
    // TODO: Implement edit employee functionality
    console.log("Edit employee:", employee);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

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
                    Employee Management
                  </h1>
                  <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">
                    Creative Mark Admin Portal
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
                Manage employee accounts, assignments, and team coordination efficiently
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
                <div className="text-sm text-gray-600 font-medium">
                  {filteredEmployees.length} of {employees.length} employees
                </div>
              </div>
            </div>
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
                  placeholder="Search employees by name, email, or department..."
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
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FullPageLoading text="Loading Employees..." />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-16 px-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Employees Found</h3>
              <p className="text-gray-500 mb-8">No employees match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee._id || employee.id}
                  className="group border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 bg-white"
                >
                  {/* Employee Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-200 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                        <FaUser className="text-emerald-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{employee.name}</h3>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(employee.status)}
                      <span className={`text-xs font-medium px-2.5 py-1 border rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status === 'active' ? 'Active' : employee.status === 'inactive' ? 'Inactive' : employee.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaBuilding className="mr-2 text-emerald-500" />
                      <span>{employee.department || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUserCheck className="mr-2 text-emerald-500" />
                      <span>{employee.role || "Employee"}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FaPhone className="mr-2 text-emerald-500" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendar className="mr-2 text-emerald-500" />
                      <span>Joined: {formatDate(employee.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleViewEmployee(employee)}
                      className="flex items-center justify-center gap-1 px-2 py-2 text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg transition-all duration-200"
                    >
                      <FaEye className="text-xs" />
                      View
                    </button>
                    <button
                      onClick={() => handleAssignTask(employee)}
                      className="flex items-center justify-center gap-1 px-2 py-2 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-all duration-200"
                    >
                      <FaTasks className="text-xs" />
                      Assign
                    </button>
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="flex items-center justify-center gap-1 px-2 py-2 text-xs bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-lg transition-all duration-200"
                    >
                      <FaEdit className="text-xs" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employee Details Modal */}
        {showDetailsModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Employee Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimesCircle className="text-lg" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaUser className="mr-3 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">Name</span>
                        <p className="text-gray-700 font-medium">{selectedEmployee.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-3 text-blue-500" />
                      <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="text-gray-700 font-medium">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    {selectedEmployee.phone && (
                      <div className="flex items-center">
                        <FaPhone className="mr-3 text-blue-500" />
                        <div>
                          <span className="text-sm text-gray-500">Phone</span>
                          <p className="text-gray-700 font-medium">{selectedEmployee.phone}</p>
                        </div>
                      </div>
                    )}
                    {selectedEmployee.address && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-3 text-blue-500" />
                        <div>
                          <span className="text-sm text-gray-500">Address</span>
                          <p className="text-gray-700 font-medium">{selectedEmployee.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FaBuilding className="text-white text-sm" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">Work Information</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaBuilding className="mr-3 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Department</span>
                        <p className="text-gray-700 font-medium">{selectedEmployee.department || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaUserCheck className="mr-3 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Role</span>
                        <p className="text-gray-700 font-medium">{selectedEmployee.role || "Employee"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(selectedEmployee.status)}
                      <div className="ml-3">
                        <span className="text-sm text-gray-500">Status</span>
                        <p className="text-gray-700 font-medium">{selectedEmployee.status || "Active"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-3 text-emerald-500" />
                      <div>
                        <span className="text-sm text-gray-500">Joined Date</span>
                        <p className="text-gray-700 font-medium">{formatDate(selectedEmployee.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => handleAssignTask(selectedEmployee)}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium rounded-lg"
                >
                  <FaTasks className="inline mr-2" />
                  Assign Task
                </button>
                <button
                  onClick={() => handleEditEmployee(selectedEmployee)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition font-medium rounded-lg"
                >
                  <FaEdit className="inline mr-2" />
                  Edit Employee
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Task Modal */}
        {showAssignModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Assign Task
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimesCircle className="text-lg" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 border border-emerald-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Assigning to:</h4>
                  <p className="text-gray-700 font-medium">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Type
                </label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200">
                  <option value="">Select task type...</option>
                  <option value="review">Review Request</option>
                  <option value="processing">Process Documents</option>
                  <option value="follow-up">Client Follow-up</option>
                  <option value="quality-check">Quality Check</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description
                </label>
                <textarea
                  rows="4"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200"
                  placeholder="Describe the task to be assigned..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement assign task functionality
                    console.log("Assigning task to:", selectedEmployee);
                    setShowAssignModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium rounded-lg"
                >
                  <FaTasks className="inline mr-2" />
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
