"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '../../../services/userService';
import { FullPageLoading } from '../../../components/LoadingSpinner';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendar,
  FaSave,
  FaTimes,
  FaSpinner,
  FaCamera,
  FaCheck,
  FaExclamationTriangle,
  FaUserCircle,
  FaIdCard,
  FaShieldAlt,
  FaUserPlus,
  FaUserTie,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHandshake
} from 'react-icons/fa';

export default function AddUserPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    dateOfBirth: '',
    nationality: '',
    profilePicture: null,
    // Employee fields
    hireDate: '',
    salary: '',
    manager: '',
    permissions: [],
    workLocation: '',
    emergencyContact: '',
    // Partner fields
    partnerId: '',
    partnerType: '',
    contractStartDate: '',
    contractEndDate: '',
    commissionRate: '',
    specializations: [],
    serviceAreas: [],
    languages: [],
    availability: 'available',
    // Common fields
    userRole: 'employee'
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const departments = [
    'Administration',
    'Human Resources',
    'Finance',
    'Operations',
    'IT',
    'Legal',
    'Marketing',
    'Sales',
    'Customer Service'
  ];

  const userRoles = [
    { value: 'employee', label: 'Employee', icon: '👤' },
    { value: 'partner', label: 'External Partner', icon: '🤝' },
    { value: 'admin', label: 'Administrator', icon: '👑' }
  ];

  // Access levels removed - no longer needed

  const workLocations = [
    'Head Office',
    'Branch Office',
    'Remote',
    'Hybrid'
  ];


  const partnerTypes = [
    'Service Provider',
    'Consultant',
    'Freelancer',
    'Agency',
    'Vendor',
    'Contractor'
  ];

  const specializations = [
    'Legal Services',
    'Financial Consulting',
    'Technical Support',
    'Marketing',
    'Design',
    'Translation',
    'Research',
    'Training',
    'Quality Assurance',
    'Project Management'
  ];

  const serviceAreas = [
    'North America',
    'South America',
    'Europe',
    'Asia',
    'Africa',
    'Australia',
    'Middle East',
    'Global'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Arabic',
    'Chinese',
    'Japanese',
    'Russian'
  ];

  const availabilityOptions = [
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Please select a valid image file'
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      if (errors.profilePicture) {
        setErrors(prev => ({
          ...prev,
          profilePicture: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    // Website field removed - no validation needed

    if (!formData.userRole) {
      newErrors.userRole = 'User role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setSuccess('');
      
      // Prepare user data for API
      const userData = {
        ...formData,
        role: formData.userRole // Map userRole to role for API
      };
      
      const response = await createUser(userData);
      
      if (response.success) {
        setSuccess(`${formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'} created successfully!`);
        
        // Reset form after success
        setTimeout(() => {
          router.push('/admin/all-employees');
        }, 2000);
      } else {
        setErrors({ general: response.message || 'Failed to create user' });
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ general: error.message || 'Failed to create user. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/all-employees');
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      department: '',
      position: '',
      dateOfBirth: '',
      nationality: '',
      profilePicture: null,
      // Employee fields
      hireDate: '',
      salary: '',
      manager: '',
      permissions: [],
      workLocation: '',
      emergencyContact: '',
      // Partner fields
      partnerId: '',
      partnerType: '',
      contractStartDate: '',
      contractEndDate: '',
      commissionRate: '',
      specializations: [],
      serviceAreas: [],
      languages: [],
      availability: 'available',
      // Common fields
      userRole: 'employee'
    });
    setErrors({});
    setSuccess('');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-[#242021] rounded-2xl flex items-center justify-center shadow-xl">
                  <FaUserPlus className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                    Add New User
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Create a new employee, partner, or administrator account
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200 font-medium"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Form Progress</h3>
              <span className="text-sm font-medium text-gray-600">
                {(() => {
                  const fields = ['fullName', 'email', 'password', 'userRole'];
                  const completed = fields.filter(field => formData[field] && formData[field].toString().trim() !== '').length;
                  return `${completed}/${fields.length} completed`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${(() => {
                    const fields = ['fullName', 'email', 'password', 'userRole'];
                    const completed = fields.filter(field => formData[field] && formData[field].toString().trim() !== '').length;
                    return (completed / fields.length) * 100;
                  })()}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl flex items-center shadow-lg">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
              <FaCheck className="text-white text-xl" />
            </div>
            <div>
              <p className="text-emerald-900 font-bold text-lg">{success}</p>
              <p className="text-emerald-700 text-sm">Redirecting you back to the users list...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl flex items-center shadow-lg">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
              <FaExclamationTriangle className="text-white text-xl" />
            </div>
            <div>
              <p className="text-red-900 font-bold text-lg">Error</p>
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
                
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-sm border-4 border-white">
                      {formData.profilePicture ? (
                        <img
                          src={URL.createObjectURL(formData.profilePicture)}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <FaUserCircle className="text-6xl text-emerald-600" />
                      )}
                    </div>
                    
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200">
                      <FaCamera className="text-white text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Profile Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {errors.profilePicture && (
                      <p className="text-red-600 text-sm mt-1">{errors.profilePicture}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Max size: 5MB. Formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="mt-8 lg:hidden space-y-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating {formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'}...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Create {formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <FaTimes className="mr-2" />
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
              {/* Account Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <FaLock className="mr-3 text-emerald-600" />
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      User Role *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {userRoles.map(role => (
                        <label
                          key={role.value}
                          className={`relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group hover:scale-105 ${
                            formData.userRole === role.value
                              ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg shadow-emerald-200/50'
                              : 'border-gray-200 hover:border-emerald-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white shadow-sm hover:shadow-lg'
                          }`}
                        >
                          <input
                            type="radio"
                            name="userRole"
                            value={role.value}
                            checked={formData.userRole === role.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              formData.userRole === role.value
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg'
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-emerald-100 group-hover:to-emerald-200'
                            }`}>
                              <span className="text-2xl">{role.icon}</span>
                            </div>
                            <div>
                              <div className={`text-lg font-bold transition-colors duration-200 ${
                                formData.userRole === role.value ? 'text-emerald-900' : 'text-gray-900'
                              }`}>
                                {role.label}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {role.value === 'employee' && 'Internal team member'}
                                {role.value === 'partner' && 'External service provider'}
                                {role.value === 'admin' && 'System administrator'}
                              </div>
                            </div>
                          </div>
                          {formData.userRole === role.value && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.userRole && (
                      <p className="text-red-600 text-sm mt-2">{errors.userRole}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 pr-12 ${
                          errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                        }`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 pr-12 ${
                          errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <FaUser className="mr-3 text-emerald-600" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                        errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                        errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendar className="inline mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Enter nationality"
                    />
                  </div>

                 

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information - Only show for employees */}
              {formData.userRole === 'employee' && (
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <FaUserTie className="mr-3 text-emerald-600" />
                  Employment Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBuilding className="inline mr-2" />
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Enter position"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendar className="inline mr-2" />
                      Hire Date
                    </label>
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                    />
                  </div>

               
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Location
                    </label>
                    <select
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                    >
                      <option value="">Select work location</option>
                      {workLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager
                    </label>
                    <input
                      type="text"
                      name="manager"
                      value={formData.manager}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Enter manager name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      placeholder="Enter salary"
                    />
                  </div>
                </div>
                </div>
              )}

              {/* Partner Information - Only show for partners */}
              {formData.userRole === 'partner' && (
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <FaHandshake className="mr-3 text-emerald-600" />
                    Partner Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaIdCard className="inline mr-2" />
                        Partner ID
                      </label>
                      <input
                        type="text"
                        name="partnerId"
                        value={formData.partnerId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                        placeholder="Enter partner ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Partner Type
                      </label>
                      <select
                        name="partnerType"
                        value={formData.partnerType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      >
                        <option value="">Select partner type</option>
                        {partnerTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendar className="inline mr-2" />
                        Contract Start Date
                      </label>
                      <input
                        type="date"
                        name="contractStartDate"
                        value={formData.contractStartDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendar className="inline mr-2" />
                        Contract End Date
                      </label>
                      <input
                        type="date"
                        name="contractEndDate"
                        value={formData.contractEndDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        name="commissionRate"
                        value={formData.commissionRate}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                        placeholder="Enter commission rate"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md"
                      >
                        {availabilityOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Specializations
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {specializations.map(spec => (
                        <label key={spec} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.specializations.includes(spec)}
                            onChange={() => handleArrayChange('specializations', spec)}
                            className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Service Areas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {serviceAreas.map(area => (
                        <label key={area} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.serviceAreas.includes(area)}
                            onChange={() => handleArrayChange('serviceAreas', area)}
                            className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Languages
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {languages.map(lang => (
                        <label key={lang} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.languages.includes(lang)}
                            onChange={() => handleArrayChange('languages', lang)}
                            className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:block mt-12">
              <div className="flex items-center justify-end space-x-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <FaTimes className="mr-2" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating {formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'}...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Create {formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}