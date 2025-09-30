"use client";

import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaUser,
  FaUsers,
  FaSpinner,
  FaCheck,
  FaPlus,
  FaSave
} from 'react-icons/fa';
import { assignApplicationToEmployees } from '../../services/applicationService';
import { getAllEmployees } from '../../services/employeeApi';
import { getCurrentUser } from '../../services/auth';

const AssignmentModal = ({ request, onClose, onAssigned }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [formData, setFormData] = useState({
    selectedEmployees: [],
    note: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      console.log('Loading employees from API...');
      
      const response = await getAllEmployees();
      console.log('Employees API response:', response);
      
      if (response.success && response.data) {
        setEmployees(response.data);
        console.log(`Loaded ${response.data.length} employees`);
      } else {
        console.error('Failed to load employees:', response.message);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!formData.selectedEmployees || formData.selectedEmployees.length === 0) {
      alert('Please select at least one employee to assign this application to.');
      return;
    }

    try {
      setAssigning(true);
      
      // Get current user ID (assignedBy)
      const currentUser = await getCurrentUser();
      if (!currentUser || !currentUser.data) {
        alert('You must be logged in to assign applications.');
        return;
      }
      
      const applicationId = request.applicationId || request._id;
      console.log('Assigning application:', applicationId, 'to employees:', formData.selectedEmployees);
      
      const response = await assignApplicationToEmployees(
        applicationId,
        formData.selectedEmployees,
        currentUser.data._id, // assignedBy
        formData.note || `Application assigned via dashboard`
      );
      
      console.log('Assignment response:', response);
      
      if (response.success) {
        alert(`Application successfully assigned to ${formData.selectedEmployees.length} employee(s)!`);
        onAssigned();
      } else {
        alert('Failed to assign application. Please try again.');
      }
    } catch (error) {
      console.error('Error assigning application:', error);
      const errorMessage = error.message || 'Error assigning application. Please try again.';
      alert(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleEmployeeToggle = (employeeId) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(employeeId)
        ? prev.selectedEmployees.filter(id => id !== employeeId)
        : [...prev.selectedEmployees, employeeId]
    }));
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full mx-4 max-h-screen overflow-y-auto rounded-xl shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Assign Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <p className="text-gray-600 mt-2 font-medium">
            Assign application {request.applicationId || request._id} to employees
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Request Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 mb-6 border border-gray-200 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Request Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Service Type:</span>
                <span className="ml-2 font-medium">{request.serviceDetails?.serviceType || 'Business Registration'}</span>
              </div>
              <div>
                <span className="text-gray-500">Partner Type:</span>
                <span className="ml-2 font-medium">{request.serviceDetails?.partnerType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Client:</span>
                <span className="ml-2 font-medium">{request.client?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2 font-medium">{request.status?.current || request.status || 'N/A'}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaSpinner className="animate-spin text-white text-xl" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Loading employees...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Employee Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FaUsers className="inline mr-2" />
                  Select Employees to Assign *
                </label>
                <div className="grid gap-2 max-h-48 overflow-y-auto border border-gray-200 p-3 rounded-lg">
                  {employees.map((employee) => (
                    <label
                      key={employee._id}
                      className={`flex items-center p-3 border cursor-pointer transition-all duration-200 rounded-lg ${
                        formData.selectedEmployees.includes(employee._id)
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedEmployees.includes(employee._id)}
                        onChange={() => handleEmployeeToggle(employee._id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-600">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.role || 'Employee'} • {employee.department}</div>
                      </div>
                      {formData.selectedEmployees.includes(employee._id) && (
                        <FaCheck className="text-emerald-600" />
                      )}
                    </label>
                  ))}
                </div>
                {formData.selectedEmployees.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {formData.selectedEmployees.length} employee(s)
                  </div>
                )}
              </div>


              {/* Assignment Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Note
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200"
                  placeholder="Add any special instructions or notes for the assignee..."
                />
              </div>

              {/* Assignment Summary */}
              {formData.assignedTo && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-4 rounded-lg">
                  <h4 className="font-bold text-emerald-900 mb-2">Assignment Summary</h4>
                  <div className="text-sm text-emerald-800">
                    <p><strong>Primary Assignee:</strong> {getEmployeeName(formData.assignedTo)}</p>
                    {formData.teamMembers.length > 0 && (
                      <p><strong>Team Members:</strong> {formData.teamMembers.map(getEmployeeName).join(', ')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex space-x-3">
          <button
  onClick={handleAssign}
  disabled={assigning || formData.selectedEmployees.length === 0 || loading}
  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
>
  {assigning ? (
    <FaSpinner className="animate-spin mr-2" />
  ) : (
    <FaSave className="mr-2" />
  )}
  {assigning ? 'Assigning...' : 'Assign Request'}
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
