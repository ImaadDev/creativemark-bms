"use client";

import { useState } from "react";
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaDownload,
  FaEye,
  FaFilter,
  FaSearch,
  FaPlus
} from "react-icons/fa";

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dummy payment data
  const payments = [
    {
      id: "PAY-001",
      amount: 15000,
      currency: "SAR",
      status: "completed",
      date: "2024-01-15",
      description: "Business Registration Fee",
      method: "Credit Card",
      reference: "TXN-789456123"
    },
    {
      id: "PAY-002", 
      amount: 8500,
      currency: "SAR",
      status: "pending",
      date: "2024-01-20",
      description: "Document Processing Fee",
      method: "Bank Transfer",
      reference: "TXN-456789123"
    },
    {
      id: "PAY-003",
      amount: 25000,
      currency: "SAR", 
      status: "completed",
      date: "2024-01-25",
      description: "Premium Service Package",
      method: "Credit Card",
      reference: "TXN-123456789"
    },
    {
      id: "PAY-004",
      amount: 5000,
      currency: "SAR",
      status: "failed",
      date: "2024-01-28",
      description: "Additional Services Fee",
      method: "Credit Card", 
      reference: "TXN-987654321"
    },
    {
      id: "PAY-005",
      amount: 12000,
      currency: "SAR",
      status: "completed",
      date: "2024-02-01",
      description: "Renewal Fee",
      method: "Bank Transfer",
      reference: "TXN-654321987"
    },
    {
      id: "PAY-006",
      amount: 7500,
      currency: "SAR",
      status: "pending",
      date: "2024-02-05",
      description: "Consultation Services",
      method: "Credit Card",
      reference: "TXN-321987654"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="w-5 h-5 text-emerald-500" />;
      case "pending":
        return <FaClock className="w-5 h-5 text-amber-500" />;
      case "failed":
        return <FaTimesCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FaClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = payments
    .filter(payment => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 border-b-2 border-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
                  Payment History
                </h1>
                <p className="text-amber-100 text-sm sm:text-base">
                  Track and manage all your payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Action Buttons */}
        <div className="mb-6">
          <button className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold uppercase tracking-wider transition-all duration-200">
            <FaPlus className="w-4 h-4" />
            New Payment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                    Total Payments
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{payments.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <FaCreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                    Total Amount
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{totalAmount.toLocaleString()} SAR</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <FaCheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                    Completed
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{completedAmount.toLocaleString()} SAR</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <FaCheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border-2 border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white p-4">
            <h3 className="text-lg font-bold">Search & Filter</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-amber-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 focus:border-amber-500 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-300">
                <FaFilter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white border-2 border-emerald-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200">
            <h2 className="text-xl font-bold" style={{ color: '#242021' }}>Recent Payments</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Payment ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                          <FaCreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{payment.id}</p>
                          <p className="text-sm text-gray-500">{payment.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{payment.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-lg text-gray-900">{payment.amount.toLocaleString()} {payment.currency}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{new Date(payment.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{payment.method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors duration-200">
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                          <FaDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCreditCard className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default PaymentsPage;
