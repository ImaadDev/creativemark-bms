"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../../../contexts/AuthContext';
import { getCurrentUser, updatePassword, updateUserSettings } from '../../../services/auth';
import {
  FaLock, FaBell, FaShieldAlt, FaEye, FaEyeSlash, FaSave, FaSpinner, FaCheck,
  FaExclamationTriangle, FaUser, FaGlobe, FaMoon, FaSun, FaDesktop, FaLanguage,
  FaPalette, FaCog, FaTrash, FaDownload, FaKey, FaHandshake, FaUserTie, FaChartLine
} from 'react-icons/fa';

export default function PartnerSettingsPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('security');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [settingsForm, setSettingsForm] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    securityAlerts: true,
    taskUpdates: true,
    paymentNotifications: true,
    language: 'en',
    timezone: 'UTC',
    theme: 'light',
    twoFactorAuth: false,
    sessionTimeout: 30,
    // Partner-specific settings
    autoAcceptTasks: false,
    showTaskProgress: true,
    enableNotifications: true,
    dataSharing: false,
    analyticsTracking: true,
    workHours: { start: '09:00', end: '17:00' },
    responseTime: '24h'
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const tabs = [
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'preferences', label: 'Preferences', icon: FaCog },
    { id: 'partner', label: 'Partner Settings', icon: FaHandshake },
    { id: 'privacy', label: 'Privacy', icon: FaUser }
  ];

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.success) {
        const userData = response.data;
        setCurrentUser(userData);
        setSettingsForm({
          emailNotifications: userData.settings?.emailNotifications ?? true,
          smsNotifications: userData.settings?.smsNotifications ?? false,
          marketingEmails: userData.settings?.marketingEmails ?? true,
          securityAlerts: userData.settings?.securityAlerts ?? true,
          taskUpdates: userData.settings?.taskUpdates ?? true,
          paymentNotifications: userData.settings?.paymentNotifications ?? true,
          language: userData.settings?.language ?? 'en',
          timezone: userData.settings?.timezone ?? 'UTC',
          theme: userData.settings?.theme ?? 'light',
          twoFactorAuth: userData.settings?.twoFactorAuth ?? false,
          sessionTimeout: userData.settings?.sessionTimeout ?? 30,
          autoAcceptTasks: userData.settings?.autoAcceptTasks ?? false,
          showTaskProgress: userData.settings?.showTaskProgress ?? true,
          enableNotifications: userData.settings?.enableNotifications ?? true,
          dataSharing: userData.settings?.dataSharing ?? false,
          analyticsTracking: userData.settings?.analyticsTracking ?? true,
          workHours: userData.settings?.workHours ?? { start: '09:00', end: '17:00' },
          responseTime: userData.settings?.responseTime ?? '24h'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettingsForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleWorkHoursChange = (field, value) => {
    setSettingsForm(prev => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [field]: value
      }
    }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters long';
    if (!passwordForm.confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (passwordForm.currentPassword === passwordForm.newPassword) newErrors.newPassword = 'New password must be different from current password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswordForm()) return;
    try {
      setSaving(true);
      setSuccess('');
      const response = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (response.success) {
        setSuccess('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ general: response.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrors({ general: 'Failed to update password. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setSaving(true);
      setSuccess('');
      const response = await updateUserSettings(settingsForm);
      if (response.success) {
        setCurrentUser(prev => ({ ...prev, settings: settingsForm }));
        setSuccess('Settings updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setErrors({ general: response.message || 'Failed to update settings' });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setErrors({ general: 'Failed to update settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaSpinner className="animate-spin text-white text-2xl" />
          </div>
          <p className="text-xl text-gray-800 font-bold">Loading settings...</p>
        </div>
      </div>
    );
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
                  <FaHandshake className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                    Partner Settings
                  </h1>
                  <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">
                    External Partner
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
                Configure your partner account settings and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg flex items-center">
            <FaCheck className="text-emerald-600 mr-3" />
            <p className="text-emerald-800 font-medium">{success}</p>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg flex items-center">
            <FaExclamationTriangle className="text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{errors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`mr-3 text-lg ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <FaLock className="mr-3 text-emerald-600" />
                    Change Password
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                            errors.currentPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.currentPassword && <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                            errors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.newPassword && <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200 ${
                            errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                      onClick={handlePasswordUpdate}
                      disabled={saving}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                    >
                      {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <FaShieldAlt className="mr-3 text-emerald-600" />
                    Two-Factor Authentication
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={settingsForm.twoFactorAuth}
                        onChange={handleSettingsChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Partner Settings Tab */}
            {activeTab === 'partner' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <FaHandshake className="mr-3 text-emerald-600" />
                    Partner Preferences
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Auto Accept Tasks</p>
                        <p className="text-sm text-gray-600">Automatically accept assigned tasks</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="autoAcceptTasks"
                          checked={settingsForm.autoAcceptTasks}
                          onChange={handleSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Show Task Progress</p>
                        <p className="text-sm text-gray-600">Display task progress indicators</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="showTaskProgress"
                          checked={settingsForm.showTaskProgress}
                          onChange={handleSettingsChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Hours Start</label>
                        <input
                          type="time"
                          value={settingsForm.workHours.start}
                          onChange={(e) => handleWorkHoursChange('start', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Hours End</label>
                        <input
                          type="time"
                          value={settingsForm.workHours.end}
                          onChange={(e) => handleWorkHoursChange('end', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                      <select
                        name="responseTime"
                        value={settingsForm.responseTime}
                        onChange={handleSettingsChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-200"
                      >
                        <option value="1h">1 Hour</option>
                        <option value="4h">4 Hours</option>
                        <option value="8h">8 Hours</option>
                        <option value="24h">24 Hours</option>
                        <option value="48h">48 Hours</option>
                        <option value="72h">72 Hours</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSettingsUpdate}
                      disabled={saving}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md"
                    >
                      {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                      {saving ? 'Saving...' : 'Save Partner Settings'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would follow similar pattern... */}
          </div>
        </div>
      </div>
    </div>
  );
}
