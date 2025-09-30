"use client";

import { useState, useEffect } from 'react';
import { 
  FaBuilding, 
  FaTrademark, 
  FaUserTie, 
  FaUniversity, 
  FaShieldAlt, 
  FaGlobe,
  FaCalculator,
  FaFileContract,
  FaIdCard,
  FaHandshake,
  FaPlus,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaDollarSign,
  FaCalendarAlt,
  FaDownload,
  FaEdit
} from 'react-icons/fa';

const AdditionalServicesPage = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Service Categories
  const serviceCategories = [
    {
      id: 'licensing',
      name: 'Licensing & Permits',
      icon: FaShieldAlt,
      color: 'blue',
      services: [
        {
          id: 'trade-license',
          name: 'Trade License',
          description: 'Obtain necessary trade licenses for your business operations',
          price: 1500,
          duration: '5-7 days',
          requirements: ['Business plan', 'Location documents', 'Owner passport'],
          popular: true
        },
        {
          id: 'import-export',
          name: 'Import/Export License',
          description: 'International trade authorization and permits',
          price: 2500,
          duration: '10-15 days',
          requirements: ['Trade license', 'Bank statements', 'Product details']
        },
        {
          id: 'industrial-license',
          name: 'Industrial License',
          description: 'Manufacturing and industrial operation permits',
          price: 3500,
          duration: '15-20 days',
          requirements: ['Environmental clearance', 'Location approval', 'Technical specs']
        }
      ]
    },
    {
      id: 'trademark',
      name: 'Trademark & IP',
      icon: FaTrademark,
      color: 'green',
      services: [
        {
          id: 'trademark-reg',
          name: 'Trademark Registration',
          description: 'Protect your brand name, logo, and intellectual property',
          price: 2000,
          duration: '30-45 days',
          requirements: ['Logo design', 'Business documents', 'Usage proof'],
          popular: true
        },
        {
          id: 'copyright',
          name: 'Copyright Protection',
          description: 'Secure copyrights for creative works and content',
          price: 1200,
          duration: '15-20 days',
          requirements: ['Original work', 'Creation proof', 'Author details']
        },
        {
          id: 'patent',
          name: 'Patent Filing',
          description: 'Patent registration for inventions and innovations',
          price: 5000,
          duration: '60-90 days',
          requirements: ['Invention details', 'Technical drawings', 'Novelty search']
        }
      ]
    },
    {
      id: 'hr',
      name: 'HR & Employment',
      icon: FaUserTie,
      color: 'purple',
      services: [
        {
          id: 'employment-visa',
          name: 'Employment Visa',
          description: 'Work visa processing for international employees',
          price: 1800,
          duration: '10-15 days',
          requirements: ['Job offer', 'Educational certificates', 'Medical tests']
        },
        {
          id: 'labor-contract',
          name: 'Labor Contract',
          description: 'Legal employment contract preparation and filing',
          price: 800,
          duration: '3-5 days',
          requirements: ['Job description', 'Salary details', 'Employee info']
        },
        {
          id: 'payroll-setup',
          name: 'Payroll Management',
          description: 'Complete payroll system setup and management',
          price: 2500,
          duration: '7-10 days',
          requirements: ['Employee data', 'Salary structure', 'Bank details']
        }
      ]
    },
    {
      id: 'banking',
      name: 'Banking & Finance',
      icon: FaUniversity,
      color: 'indigo',
      services: [
        {
          id: 'corporate-account',
          name: 'Corporate Bank Account',
          description: 'Business bank account opening assistance',
          price: 1000,
          duration: '5-7 days',
          requirements: ['Trade license', 'MOA documents', 'Initial deposit'],
          popular: true
        },
        {
          id: 'loan-assistance',
          name: 'Business Loan',
          description: 'Business loan application and approval assistance',
          price: 3000,
          duration: '15-30 days',
          requirements: ['Business plan', 'Financial statements', 'Collateral docs']
        },
        {
          id: 'credit-facility',
          name: 'Credit Facility',
          description: 'Credit line and financing facility setup',
          price: 2200,
          duration: '10-15 days',
          requirements: ['Bank statements', 'Revenue proof', 'Credit history']
        }
      ]
    },
    {
      id: 'legal',
      name: 'Legal Services',
      icon: FaFileContract,
      color: 'red',
      services: [
        {
          id: 'contract-drafting',
          name: 'Contract Drafting',
          description: 'Professional legal contract preparation',
          price: 1500,
          duration: '3-5 days',
          requirements: ['Contract type', 'Party details', 'Terms outline']
        },
        {
          id: 'legal-consultation',
          name: 'Legal Consultation',
          description: 'Expert legal advice and consultation services',
          price: 500,
          duration: '1-2 days',
          requirements: ['Case details', 'Relevant documents', 'Meeting schedule']
        },
        {
          id: 'compliance-audit',
          name: 'Compliance Audit',
          description: 'Business compliance review and audit',
          price: 2800,
          duration: '7-10 days',
          requirements: ['Business records', 'License documents', 'Financial records']
        }
      ]
    }
  ];

  // Mock data for service requests
  const serviceRequests = [
    {
      id: 'SRV001',
      serviceName: 'Trademark Registration',
      category: 'Trademark & IP',
      status: 'In Progress',
      requestDate: '2024-01-15',
      expectedCompletion: '2024-02-15',
      price: 2000,
      progress: 65,
      lastUpdate: 'Documents under review',
      nextAction: 'Awaiting trademark search results'
    },
    {
      id: 'SRV002',
      serviceName: 'Corporate Bank Account',
      category: 'Banking & Finance',
      status: 'Completed',
      requestDate: '2024-01-10',
      completedDate: '2024-01-17',
      price: 1000,
      progress: 100,
      lastUpdate: 'Account opened successfully',
      nextAction: 'Account details sent via email'
    },
    {
      id: 'SRV003',
      serviceName: 'Employment Visa',
      category: 'HR & Employment',
      status: 'Pending',
      requestDate: '2024-01-20',
      expectedCompletion: '2024-02-05',
      price: 1800,
      progress: 25,
      lastUpdate: 'Initial documents submitted',
      nextAction: 'Medical test results required'
    },
    {
      id: 'SRV004',
      serviceName: 'Trade License',
      category: 'Licensing & Permits',
      status: 'Approved',
      requestDate: '2024-01-12',
      approvedDate: '2024-01-19',
      price: 1500,
      progress: 90,
      lastUpdate: 'License approved, final processing',
      nextAction: 'License collection pending'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'approved': return 'text-green-600 bg-green-100 border-green-200';
      case 'in progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'rejected': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      red: 'bg-red-100 text-red-600 border-red-200'
    };
    return colors[color] || colors.blue;
  };

  const getAllServices = () => {
    return serviceCategories.flatMap(category => 
      category.services.map(service => ({
        ...service,
        category: category.name,
        categoryId: category.id,
        categoryIcon: category.icon,
        categoryColor: category.color
      }))
    );
  };

  const getFilteredServices = () => {
    let services = getAllServices();
    
    if (selectedCategory !== 'all') {
      services = services.filter(service => service.categoryId === selectedCategory);
    }
    
    if (searchTerm) {
      services = services.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return services;
  };

  const handleServiceRequest = (serviceId) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Service request submitted for ${serviceId}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Additional Services</h1>
          <p className="text-gray-600">Expand your business with our comprehensive range of professional services</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Browse Services
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Service Requests
            </button>
          </nav>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            {/* Filters */}
            <div className="bg-white border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="w-full md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {serviceCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Service Categories Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {serviceCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 border text-center hover:shadow-md transition-all ${
                      selectedCategory === category.id 
                        ? getCategoryColor(category.color)
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.services.length} services
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredServices().map((service) => {
                const IconComponent = service.categoryIcon;
                return (
                  <div key={service.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Service Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${getCategoryColor(service.categoryColor)}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            {service.popular && (
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                      {/* Service Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-gray-900">${service.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium text-gray-900">{service.duration}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600 block mb-1">Requirements:</span>
                          <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                            {service.requirements.slice(0, 2).map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                            {service.requirements.length > 2 && (
                              <li>+{service.requirements.length - 2} more</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleServiceRequest(service.id)}
                          disabled={loading}
                          className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                        >
                          <FaPlus className="mr-2 h-4 w-4" />
                          Request Service
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Service Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mr-3">
                    <FaFileContract className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{serviceRequests.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center mr-3">
                    <FaClock className="text-yellow-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {serviceRequests.filter(req => req.status === 'In Progress').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center mr-3">
                    <FaCheckCircle className="text-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {serviceRequests.filter(req => req.status === 'Completed').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 shadow-sm p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 flex items-center justify-center mr-3">
                    <FaDollarSign className="text-purple-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${serviceRequests.reduce((sum, req) => sum + req.price, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Service & ID</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Progress</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {serviceRequests.map((request) => (
                  <div key={request.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    {/* Service & ID */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900">{request.serviceName}</div>
                      <div className="text-sm text-gray-600">ID: {request.id}</div>
                      <div className="text-xs text-gray-500">${request.price}</div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">{request.category}</div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-600 mb-1">{request.progress}%</div>
                      <div className="w-full bg-gray-200 h-2">
                        <div 
                          className="bg-blue-600 h-2 transition-all duration-300"
                          style={{ width: `${request.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">{request.requestDate}</div>
                      {request.expectedCompletion && (
                        <div className="text-xs text-gray-500">
                          Expected: {request.expectedCompletion}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <FaDownload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalServicesPage;