"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../../../contexts/AuthContext';
import { getCurrentUser, updateUserProfile } from '../../../services/auth';
import { FullPageLoading } from '../../../components/LoadingSpinner';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendar,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaCamera,
  FaCheck,
  FaExclamationTriangle,
  FaUserCircle,
  FaIdCard,
  FaGlobe,
  FaShieldAlt,
  FaCrown,
  FaUserTie,
  FaChartLine,
  FaCog
} from 'react-icons/fa';

export default function AdminProfilePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    bio: '',
    website: '',
    dateOfBirth: '',
    nationality: '',
    profilePicture: null,
    // Admin-specific fields
    employeeId: '',
    hireDate: '',
    salary: '',
    manager: '',
    permissions: [],
    accessLevel: 'admin',
    workLocation: '',
    emergencyContact: '',
    skills: [],
    certifications: []
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

  const accessLevels = [
    { value: 'admin', label: 'Administrator' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' }
  ];

  const workLocations = [
    'Head Office',
    'Branch Office',
    'Remote',
    'Hybrid'
  ];

  const commonSkills = [
    'Project Management',
    'Team Leadership',
    'Data Analysis',
    'Client Relations',
    'Process Improvement',
    'Budget Management',
    'Strategic Planning',
    'Communication',
    'Problem Solving',
    'Technical Writing'
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.success) {
        const userData = response.data;
        setCurrentUser(userData);
        setFormData({
          fullName: userData.fullName || userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          department: userData.department || '',
          position: userData.position || '',
          bio: userData.bio || '',
          website: userData.website || '',
          dateOfBirth: userData.dateOfBirth || '',
          nationality: userData.nationality || '',
          profilePicture: userData.profilePicture || null,
          employeeId: userData.employeeId || '',
          hireDate: userData.hireDate || '',
          salary: userData.salary || '',
          manager: userData.manager || '',
          permissions: userData.permissions || [],
          accessLevel: userData.accessLevel || 'admin',
          workLocation: userData.workLocation || '',
          emergencyContact: userData.emergencyContact || '',
          skills: userData.skills || [],
          certifications: userData.certifications || []
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSkillChange = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
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
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setSuccess('');
      
      const updateData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          if (Array.isArray(formData[key])) {
            updateData.append(key, JSON.stringify(formData[key]));
          } else if (key === 'profilePicture' && formData[key] instanceof File) {
            // Handle file upload
            updateData.append(key, formData[key]);
          } else {
            updateData.append(key, formData[key]);
          }
        }
      });

      const response = await updateUserProfile(updateData);
      
      if (response.success) {
        setCurrentUser(response.data);
        setEditing(false);
        setSuccess('Profile updated successfully!');
        // Dispatch event to update navbar profile picture
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ general: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    setSuccess('');
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        department: currentUser.department || '',
        position: currentUser.position || '',
        bio: currentUser.bio || '',
        website: currentUser.website || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        nationality: currentUser.nationality || '',
        profilePicture: currentUser.profilePicture || null,
        employeeId: currentUser.employeeId || '',
        hireDate: currentUser.hireDate || '',
        salary: currentUser.salary || '',
        manager: currentUser.manager || '',
        permissions: currentUser.permissions || [],
        accessLevel: currentUser.accessLevel || 'admin',
        workLocation: currentUser.workLocation || '',
        emergencyContact: currentUser.emergencyContact || '',
        skills: currentUser.skills || [],
        certifications: currentUser.certifications || []
      });
    }
  };

  if (loading) {
    return <FullPageLoading text="Loading Profile..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaCrown className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    Admin Profile
                  </h1>
                  <p className="text-sm text-[#242021] font-medium uppercase tracking-wider">
                    System Administrator
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
                Manage your administrative profile and system access information
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                  >
                    {saving ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg flex items-center">
            <FaCheck className="text-emerald-600 mr-3" />
            <p className="text-emerald-800 font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg flex items-center">
            <FaExclamationTriangle className="text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-sm border-4 border-white">
                    {formData.profilePicture ? (
                      <img
                        src={typeof formData.profilePicture === 'string' ? formData.profilePicture : URL.createObjectURL(formData.profilePicture)}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <FaUserCircle className="text-6xl text-emerald-600" />
                    )}
                  </div>
                  
                  {editing && (
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200">
                      <FaCamera className="text-white text-sm" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {editing && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload New Photo
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
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
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    } ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Enter your full name"
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
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    } ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Enter your email"
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
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    } ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Enter your phone number"
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
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
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
                    disabled={!editing}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FaUserTie className="mr-3 text-emerald-600" />
                Employment Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaIdCard className="inline mr-2" />
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                    placeholder="Enter employee ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline mr-2" />
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
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
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                    placeholder="Enter your position"
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
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaShieldAlt className="inline mr-2" />
                    Access Level
                  </label>
                  <select
                    name="accessLevel"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    {accessLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Location
                  </label>
                  <select
                    name="workLocation"
                    value={formData.workLocation}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
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
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                    placeholder="Enter manager name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                    placeholder="Enter emergency contact"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <FaChartLine className="mr-3 text-emerald-600" />
                Skills & Certifications
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Skills
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonSkills.map(skill => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleSkillChange(skill)}
                          disabled={!editing}
                          className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                      editing ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                    }`}
                    placeholder="Tell us about your professional background and expertise..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}