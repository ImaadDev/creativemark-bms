"use client";

import { useState } from "react";
import { FullPageLoading } from '../../../components/LoadingSpinner';
import { 
  FaCogs, 
  FaUser, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye
} from "react-icons/fa";

export default function AdditionalServicesPage() {
  const services = [
    { id: 1, name: "Safety & Security licenses", client: "Client Alpha", status: "Pending" },
    { id: 2, name: "Trademarks registration", client: "Client Beta", status: "In Progress" },
    { id: 3, name: "Premium Residency application", client: "Client Gamma", status: "Completed" },
    { id: 4, name: "Company Name Change", client: "Client Delta", status: "Pending" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock className="text-yellow-600" />;
      case "In Progress":
        return <FaExclamationTriangle className="text-blue-600" />;
      case "Completed":
        return <FaCheckCircle className="text-emerald-600" />;
      default:
        return <FaCogs className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaCogs className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Additional Services
              </h1>
              <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">
                Creative Mark Admin Portal
              </p>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
            Manage and track additional service requests for clients
          </p>
        </div>

        {/* Add New Service Button */}
        <div className="mb-8">
          <button className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
            <FaPlus className="mr-2" />
            Add New Service Request
          </button>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaCogs className="text-white text-sm" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Requests for Additional Services</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="group border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-200 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-emerald-300 transition-all duration-300">
                      {getStatusIcon(service.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaUser className="w-3 h-3 text-emerald-500" />
                        {service.client}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
