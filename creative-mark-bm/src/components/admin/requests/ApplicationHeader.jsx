"use client";

import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaFileAlt } from 'react-icons/fa';
import StatusChip from './StatusChip';

const ApplicationHeader = forwardRef(({ 
  application,
  className = '',
  onBack,
  ...props 
}, ref) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/admin/requests');
    }
  };

  const getProgressPercentage = (status) => {
    const currentStatus = status?.current || status;
    switch (currentStatus) {
      case 'completed': return 100;
      case 'in_process': return 80;
      case 'approved': return 60;
      case 'under_review': return 40;
      case 'submitted': return 20;
      case 'rejected': return 0;
      default: return 0;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const progress = getProgressPercentage(application?.status);

  return (
    <div ref={ref} className={`mb-8 ${className}`} {...props}>
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 group transition-colors duration-200"
          aria-label="Back to applications"
        >
          <div className="mr-2 p-1 rounded-full group-hover:bg-gray-100 transition-colors duration-200">
            <FaArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Applications</span>
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">Application Details</span>
      </div>

      {/* Main Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Title and Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <FaFileAlt className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Application Details
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                    <p className="text-sm font-mono text-gray-600">
                      ID: {application?.applicationId || application?._id || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Submitted {formatDate(application?.timestamps?.createdAt || application?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            {application?.client && (
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{application.client.name}</p>
                  <p className="text-sm text-gray-600">{application.client.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Status and Progress */}
          <div className="flex items-center space-x-8">
            {/* Status */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-3">Current Status</p>
              <StatusChip status={application?.status} size="large" />
            </div>

            {/* Progress */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-3">Progress</p>
              <div className="flex items-center space-x-3">
                <div className="relative w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700 min-w-[3rem]">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ApplicationHeader.displayName = 'ApplicationHeader';

export default ApplicationHeader;
