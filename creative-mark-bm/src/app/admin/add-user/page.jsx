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
  FaHandshake,
  FaFileAlt
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
    // Partnership Information
    partnershipType: '',
    clientEngagementManager: '',
    ifzaContactPerson: '',
    // Partner Information
    legalEntityName: '',
    legalFormOfEntity: '',
    businessAddress: '',
    // General Manager / Director Details
    title: '',
    gmFullName: '',
    gmDateOfBirth: '',
    countryOfBirth: '',
    gmNationality: '',
    passportNumber: '',
    passportCountryOfIssue: '',
    gender: '',
    gmEmail: '',
    gmMobileNumber: '',
    // Incorporation & Contact Details
    incorporationDocumentsEmail: '',
    billingAddress: '',
    officeAddress: '',
    buildingName: '',
    city: '',
    streetDistrict: '',
    postalZipCode: '',
    country: '',
    // Banking Details
    bankName: '',
    beneficiaryAccountName: '',
    bankAccountNumber: '',
    iban: '',
    swiftCode: '',
    bankStreetAddress: '',
    bankCity: '',
    accountsContactPerson: '',
    trn: '',
    // Required Documents
    companyRegistrationTradeLicense: null,
    generalManagerDirectorPassport: null,
    vatCertificate: null,
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

  const partnershipTypes = [
    'IFZA Free Zone Company',
    'IFZA Branch Office',
    'IFZA Representative Office',
    'IFZA Subsidiary',
    'IFZA Joint Venture',
    'Other'
  ];

  const legalFormOfEntityOptions = [
    'Limited Liability Company (LLC)',
    'Public Joint Stock Company (PJSC)',
    'Private Joint Stock Company (PrJSC)',
    'Partnership Limited by Shares',
    'Limited Partnership',
    'General Partnership',
    'Sole Proprietorship',
    'Branch Office',
    'Representative Office',
    'Free Zone Company',
    'Other'
  ];

  const titleOptions = [
    'Mr.',
    'Ms.',
    'Dr.',
    'Prof.',
    'Eng.',
    'Other'
  ];

  const genderOptions = [
    'Male',
    'Female',
    'Other'
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

  // Helper function to get input className with error styling
  const getInputClassName = (fieldName, baseClasses = "") => {
    const errorClasses = errors[fieldName] ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200';
    return `${baseClasses} ${errorClasses}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (file) {
      // Check file type based on field
      if (fieldName === 'profilePicture') {
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({
            ...prev,
            profilePicture: 'Please select a valid image file'
          }));
          return;
        }
      } else {
        // For document files, allow PDF, DOC, DOCX
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: 'Please select a valid document file (PDF, DOC, DOCX)'
          }));
          return;
        }
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB for documents
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'File size must be less than 10MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
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
      setErrors({}); // Clear previous errors
      
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
      
      // Handle backend validation errors
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Handle validation errors array
          const fieldErrors = {};
          errorData.errors.forEach(errorMsg => {
            // Try to extract field name from error message
            if (errorMsg.toLowerCase().includes('email')) {
              fieldErrors.email = errorMsg;
            } else if (errorMsg.toLowerCase().includes('password')) {
              fieldErrors.password = errorMsg;
            } else if (errorMsg.toLowerCase().includes('name')) {
              fieldErrors.fullName = errorMsg;
            } else if (errorMsg.toLowerCase().includes('phone')) {
              fieldErrors.phone = errorMsg;
            } else {
              // If we can't map to a specific field, add to general errors
              fieldErrors.general = fieldErrors.general ? `${fieldErrors.general}; ${errorMsg}` : errorMsg;
            }
          });
          setErrors(fieldErrors);
        } else if (errorData.message) {
          // Handle single error message
          setErrors({ general: errorData.message });
        } else {
          setErrors({ general: error.message || 'Failed to create user. Please try again.' });
        }
      } else {
        setErrors({ general: error.message || 'Failed to create user. Please try again.' });
      }
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
      // Partnership Information
      partnershipType: '',
      clientEngagementManager: '',
      ifzaContactPerson: '',
      // Partner Information
      legalEntityName: '',
      legalFormOfEntity: '',
      businessAddress: '',
      // General Manager / Director Details
      title: '',
      gmFullName: '',
      gmDateOfBirth: '',
      countryOfBirth: '',
      gmNationality: '',
      passportNumber: '',
      passportCountryOfIssue: '',
      gender: '',
      gmEmail: '',
      gmMobileNumber: '',
      // Incorporation & Contact Details
      incorporationDocumentsEmail: '',
      billingAddress: '',
      officeAddress: '',
      buildingName: '',
      city: '',
      streetDistrict: '',
      postalZipCode: '',
      country: '',
      // Banking Details
      bankName: '',
      beneficiaryAccountName: '',
      bankAccountNumber: '',
      iban: '',
      swiftCode: '',
      bankStreetAddress: '',
      bankCity: '',
      accountsContactPerson: '',
      trn: '',
      // Required Documents
      companyRegistrationTradeLicense: null,
      generalManagerDirectorPassport: null,
      vatCertificate: null,
      // Common fields
      userRole: 'employee'
    });
    setErrors({});
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Modern Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#242021] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl">
                  <FaUserPlus className="text-lg sm:text-2xl text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                    Add New User
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 sm:mt-2">
                    Create a new employee, partner, or administrator account
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-gray-600 hover:text-gray-900 hover:bg-white/80 border border-gray-200 hover:border-gray-300 rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-sm sm:text-base"
              >
                <FaTimes className="mr-2 text-sm sm:text-base" />
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
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
                className="bg-gradient-to-r from-[#ffd17a] to-[#ffd17a]/80 h-3 rounded-full transition-all duration-500 ease-out"
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
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl sm:rounded-2xl flex items-center shadow-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <FaCheck className="text-white text-sm sm:text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-emerald-900 font-bold text-sm sm:text-lg">{success}</p>
              <p className="text-emerald-700 text-xs sm:text-sm">Redirecting you back to the users list...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl sm:rounded-2xl flex items-center shadow-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <FaExclamationTriangle className="text-white text-sm sm:text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-red-900 font-bold text-sm sm:text-lg">Error</p>
              <p className="text-red-700 text-xs sm:text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Profile Picture</h3>
                
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#ffd17a]/20 to-[#ffd17a]/30 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm border-4 border-white">
                      {formData.profilePicture ? (
                        <img
                          src={URL.createObjectURL(formData.profilePicture)}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                        />
                      ) : (
                        <FaUserCircle className="text-4xl sm:text-6xl text-[#242021]" />
                      )}
                    </div>
                    
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#ffd17a] to-[#ffd17a]/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:from-[#ffd17a]/90 hover:to-[#ffd17a] transition-all duration-200">
                      <FaCamera className="text-[#242021] text-xs sm:text-sm" />
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
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ffd17a] file:text-[#242021] hover:file:bg-[#ffd17a]/90"
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
              <div className="mt-6 sm:mt-8 lg:hidden space-y-3 sm:space-y-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 bg-[#242021] text-white hover:bg-[#242021]/90 disabled:opacity-50 transition-all duration-200 font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 text-sm sm:text-base" />
                      Creating {formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'}...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 text-sm sm:text-base" />
                      Create {formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                >
                  <FaTimes className="mr-2 text-sm sm:text-base" />
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 transition-all duration-200 font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Account Information */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <FaLock className="mr-3 text-[#242021]" />
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      User Role *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {userRoles.map(role => (
                        <label
                          key={role.value}
                          className={`relative flex flex-col items-center p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 group hover:scale-105 ${
                            formData.userRole === role.value
                              ? 'border-[#ffd17a] bg-gradient-to-br from-[#ffd17a]/10 to-[#ffd17a]/20 shadow-lg shadow-[#ffd17a]/20'
                              : 'border-gray-200 hover:border-[#ffd17a]/50 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white shadow-sm hover:shadow-lg'
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
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              formData.userRole === role.value
                                ? 'bg-gradient-to-br from-[#ffd17a] to-[#ffd17a]/90 shadow-lg'
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#ffd17a]/20 group-hover:to-[#ffd17a]/30'
                            }`}>
                              <span className="text-lg sm:text-2xl">{role.icon}</span>
                            </div>
                            <div>
                              <div className={`text-sm sm:text-lg font-bold transition-colors duration-200 ${
                                formData.userRole === role.value ? 'text-[#242021]' : 'text-gray-900'
                              }`}>
                                {role.label}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                {role.value === 'employee' && 'Internal team member'}
                                {role.value === 'partner' && 'External service provider'}
                                {role.value === 'admin' && 'System administrator'}
                              </div>
                            </div>
                          </div>
                          {formData.userRole === role.value && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-[#ffd17a] rounded-full flex items-center justify-center">
                              <FaCheck className="text-[#242021] text-xs" />
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
                        className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 pr-12 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                          errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                        }`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
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
                        className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 pr-12 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                          errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                        }`}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <FaUser className="mr-3 text-[#242021]" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
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
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment Information - Only show for employees */}
              {formData.userRole === 'employee' && (
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <FaUserTie className="mr-3 text-[#242021]" />
                  Employment Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBuilding className="inline mr-2" />
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                        errors.department ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-red-600 text-sm mt-1">{errors.department}</p>
                    )}
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
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                        errors.position ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Enter position"
                    />
                    {errors.position && (
                      <p className="text-red-600 text-sm mt-1">{errors.position}</p>
                    )}
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
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                        errors.hireDate ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                    />
                    {errors.hireDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.hireDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Location
                    </label>
                    <select
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                        errors.workLocation ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select work location</option>
                      {workLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    {errors.workLocation && (
                      <p className="text-red-600 text-sm mt-1">{errors.workLocation}</p>
                    )}
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
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                        errors.manager ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Enter manager name"
                    />
                    {errors.manager && (
                      <p className="text-red-600 text-sm mt-1">{errors.manager}</p>
                    )}
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
                      className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base ${
                        errors.salary ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                      }`}
                      placeholder="Enter salary"
                    />
                    {errors.salary && (
                      <p className="text-red-600 text-sm mt-1">{errors.salary}</p>
                    )}
                  </div>
                </div>
                </div>
              )}


              {/* Partnership Information - Only show for partners */}
              {formData.userRole === 'partner' && (
                <>
                  {/* Partnership Information Section */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaHandshake className="mr-3 text-[#242021]" />
                      Partnership Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Partnership Type with IFZA *
                        </label>
                        <select
                          name="partnershipType"
                          value={formData.partnershipType}
                          onChange={handleInputChange}
                          className={getInputClassName('partnershipType', "w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base")}
                        >
                          <option value="">Select partnership type</option>
                          {partnershipTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.partnershipType && (
                          <p className="text-red-600 text-sm mt-1">{errors.partnershipType}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client Engagement Manager *
                        </label>
                        <input
                          type="text"
                          name="clientEngagementManager"
                          value={formData.clientEngagementManager}
                          onChange={handleInputChange}
                          className={getInputClassName('clientEngagementManager', "w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base")}
                          placeholder="Enter client engagement manager name"
                        />
                        {errors.clientEngagementManager && (
                          <p className="text-red-600 text-sm mt-1">{errors.clientEngagementManager}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IFZA Contact Person *
                        </label>
                        <input
                          type="text"
                          name="ifzaContactPerson"
                          value={formData.ifzaContactPerson}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter IFZA contact person name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner Information Section */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaBuilding className="mr-3 text-[#242021]" />
                      Partner Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Legal Entity Name (as per Trade License / Incorporation Certificate) *
                        </label>
                        <input
                          type="text"
                          name="legalEntityName"
                          value={formData.legalEntityName}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter legal entity name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Legal Form of Entity *
                        </label>
                        <select
                          name="legalFormOfEntity"
                          value={formData.legalFormOfEntity}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                        >
                          <option value="">Select legal form</option>
                          {legalFormOfEntityOptions.map(form => (
                            <option key={form} value={form}>{form}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Address *
                        </label>
                        <input
                          type="text"
                          name="businessAddress"
                          value={formData.businessAddress}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter business address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* General Manager / Director Details Section */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaUserTie className="mr-3 text-[#242021]" />
                      General Manager / Director Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <select
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                        >
                          <option value="">Select title</option>
                          {titleOptions.map(title => (
                            <option key={title} value={title}>{title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="gmFullName"
                          value={formData.gmFullName}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth (dd-MMM-yyyy) *
                        </label>
                        <input
                          type="date"
                          name="gmDateOfBirth"
                          value={formData.gmDateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                        />
                      </div>


                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country of Birth *
                        </label>
                        <input
                          type="text"
                          name="countryOfBirth"
                          value={formData.countryOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter country of birth"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationality (GM) *
                        </label>
                        <input
                          type="text"
                          name="gmNationality"
                          value={formData.gmNationality}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter nationality"
                        />
                      </div>


                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Passport Number *
                        </label>
                        <input
                          type="text"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter passport number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Passport Country of Issue *
                        </label>
                        <input
                          type="text"
                          name="passportCountryOfIssue"
                          value={formData.passportCountryOfIssue}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter passport country of issue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                        >
                          <option value="">Select gender</option>
                          {genderOptions.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="gmEmail"
                          value={formData.gmEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number (+966…) *
                        </label>
                        <input
                          type="tel"
                          name="gmMobileNumber"
                          value={formData.gmMobileNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="+966 50 123 4567"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Incorporation & Contact Details Section */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaMapMarkerAlt className="mr-3 text-[#242021]" />
                      Incorporation & Contact Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Incorporation Documents Email *
                        </label>
                        <input
                          type="email"
                          name="incorporationDocumentsEmail"
                          value={formData.incorporationDocumentsEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter incorporation documents email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address *
                        </label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter billing address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Office Address *
                        </label>
                        <input
                          type="text"
                          name="officeAddress"
                          value={formData.officeAddress}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter office address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Building Name
                        </label>
                        <input
                          type="text"
                          name="buildingName"
                          value={formData.buildingName}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter building name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street/District *
                        </label>
                        <input
                          type="text"
                          name="streetDistrict"
                          value={formData.streetDistrict}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter street/district"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal / Zip Code *
                        </label>
                        <input
                          type="text"
                          name="postalZipCode"
                          value={formData.postalZipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter postal/zip code"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter country"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Banking Details Section */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaBuilding className="mr-3 text-[#242021]" />
                      Banking Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter bank name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Beneficiary Account Name *
                        </label>
                        <input
                          type="text"
                          name="beneficiaryAccountName"
                          value={formData.beneficiaryAccountName}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter beneficiary account name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Account Number *
                        </label>
                        <input
                          type="text"
                          name="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter bank account number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IBAN *
                        </label>
                        <input
                          type="text"
                          name="iban"
                          value={formData.iban}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter IBAN"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SWIFT Code *
                        </label>
                        <input
                          type="text"
                          name="swiftCode"
                          value={formData.swiftCode}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter SWIFT code"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Street Address *
                        </label>
                        <input
                          type="text"
                          name="bankStreetAddress"
                          value={formData.bankStreetAddress}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter bank street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank City *
                        </label>
                        <input
                          type="text"
                          name="bankCity"
                          value={formData.bankCity}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter bank city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accounts Contact Person *
                        </label>
                        <input
                          type="text"
                          name="accountsContactPerson"
                          value={formData.accountsContactPerson}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter accounts contact person"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          TRN (Tax Registration Number)
                        </label>
                        <input
                          type="text"
                          name="trn"
                          value={formData.trn}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-sm sm:text-base"
                          placeholder="Enter TRN"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Required Documents Section */}
                  <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <FaFileAlt className="mr-3 text-[#242021]" />
                      Required Documents (Uploads)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Registration / Trade License Copy *
                        </label>
                        <input
                          type="file"
                          name="companyRegistrationTradeLicense"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ffd17a] file:text-[#242021] hover:file:bg-[#ffd17a]/90 text-sm sm:text-base"
                        />
                        {errors.companyRegistrationTradeLicense && (
                          <p className="text-red-600 text-sm mt-1">{errors.companyRegistrationTradeLicense}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Max size: 10MB. Formats: PDF, DOC, DOCX
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          General Manager / Director Passport Copy *
                        </label>
                        <input
                          type="file"
                          name="generalManagerDirectorPassport"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ffd17a] file:text-[#242021] hover:file:bg-[#ffd17a]/90 text-sm sm:text-base"
                        />
                        {errors.generalManagerDirectorPassport && (
                          <p className="text-red-600 text-sm mt-1">{errors.generalManagerDirectorPassport}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Max size: 10MB. Formats: PDF, DOC, DOCX
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          VAT Certificate *
                        </label>
                        <input
                          type="file"
                          name="vatCertificate"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#ffd17a]/20 focus:border-[#ffd17a] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ffd17a] file:text-[#242021] hover:file:bg-[#ffd17a]/90 text-sm sm:text-base"
                        />
                        {errors.vatCertificate && (
                          <p className="text-red-600 text-sm mt-1">{errors.vatCertificate}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Max size: 10MB. Formats: PDF, DOC, DOCX
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden lg:block mt-8 sm:mt-12">
              <div className="flex items-center justify-end space-x-4 sm:space-x-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-4 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 transition-all duration-200 font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                >
                  <FaTimes className="mr-2 text-sm sm:text-base" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-4 sm:px-8 py-3 sm:py-4 bg-[#242021] text-white hover:bg-[#242021]/90 disabled:opacity-50 transition-all duration-200 font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 text-sm sm:text-base" />
                      Creating {formData.userRole === 'employee' ? 'Employee' : formData.userRole === 'partner' ? 'Partner' : 'User'}...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 text-sm sm:text-base" />
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