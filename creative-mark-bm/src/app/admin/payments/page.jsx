"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, Download, Search, Filter, AlertCircle, Receipt, User, Calendar, DollarSign } from "lucide-react";
import { useTranslation } from "../../../i18n/TranslationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { paymentService } from "../../../services/paymentService";

export default function AdminPaymentsPage() {
  const { t } = useTranslation();
  const { user: currentUser, loading, requireAuth } = useAuth();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationAction, setVerificationAction] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Load payments on component mount
  useEffect(() => {
    if (loading) return;
    if (!currentUser || currentUser.role !== 'admin') return;
    
    loadPayments();
  }, [currentUser, loading]);

  const loadPayments = async () => {
    try {
      const response = await paymentService.getPendingPayments();
      setPayments(response.data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      setPayments([]);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationAction || !selectedPayment) return;

    setVerifying(true);
    try {
      let response;
      
      if (selectedPayment.installmentIndex !== undefined) {
        // Verify installment
        response = await paymentService.verifyInstallmentPayment(
          selectedPayment._id,
          selectedPayment.installmentIndex,
          {
            action: verificationAction,
            adminNotes: adminNotes
          }
        );
      } else {
        // Verify full payment
        response = await paymentService.verifyPayment(
          selectedPayment._id,
          {
            action: verificationAction,
            adminNotes: adminNotes
          }
        );
      }

      if (response.success) {
        await loadPayments();
        setIsVerificationModalOpen(false);
        setVerificationAction("");
        setAdminNotes("");
        setSelectedPayment(null);
        alert(`Payment ${verificationAction}d successfully!`);
      } else {
        alert(response.message || `Failed to ${verificationAction} payment`);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert(`Failed to ${verificationAction} payment. Please try again.`);
    } finally {
      setVerifying(false);
    }
  };

  const openVerificationModal = (payment, installmentIndex = null, action = "") => {
    setSelectedPayment({ ...payment, installmentIndex });
    setVerificationAction(action);
    setIsVerificationModalOpen(true);
    setIsPaymentDetailsOpen(false);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesFilter = filter === "all" || 
      (filter === "submitted" && payment.status === "submitted") ||
      (filter === "installments" && payment.paymentPlan === "installments") ||
      (filter === "full" && payment.paymentPlan === "full");
    
    const matchesSearch = payment.applicationId?.serviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.clientId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalPending: payments.length,
    submittedPayments: payments.filter(p => p.status === "submitted").length,
    fullPayments: payments.filter(p => p.paymentPlan === "full").length,
    installmentPayments: payments.filter(p => p.paymentPlan === "installments").length,
  };

  const getStatusIcon = (status) => {
    if (status === "approved") return <CheckCircle size={16} className="text-green-600" />;
    if (status === "submitted") return <Clock size={16} className="text-blue-600" />;
    if (status === "rejected") return <XCircle size={16} className="text-red-600" />;
    if (status === "pending") return <Clock size={16} className="text-amber-600" />;
    return null;
  };

  const getStatusStyle = (status) => {
    if (status === "approved") return "bg-green-50 text-green-700 border-green-200";
    if (status === "submitted") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "rejected") return "bg-red-50 text-red-700 border-red-200";
    if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#242021] mb-2 tracking-tight">Payment Verification</h1>
              <p className="text-gray-600 text-base md:text-lg">Review and verify client payment receipts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide opacity-80'>Total Pending</span>
                <div className="p-2 rounded-xl bg-[#ffd17a]/20"><Clock size={18} /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-1">{stats.totalPending}</div>
              <div className='text-xs opacity-70'>Payments</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide text-gray-600'>Submitted</span>
                <div className="p-2 rounded-xl bg-blue-100"><Receipt size={18} className="text-blue-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stats.submittedPayments}</div>
              <div className="text-xs text-gray-500">Awaiting Review</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide text-gray-600'>Full Payments</span>
                <div className="p-2 rounded-xl bg-green-100"><DollarSign size={18} className="text-green-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stats.fullPayments}</div>
              <div className='text-xs text-gray-500'>One-time</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide text-gray-600'>Installments</span>
                <div className="p-2 rounded-xl bg-purple-100"><Calendar size={18} className="text-purple-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stats.installmentPayments}</div>
              <div className='text-xs text-gray-500'>Multi-part</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className='text-2xl font-bold text-[#242021]'>Pending Payments</h2>
            <div className="flex gap-2">
              <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "all" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>All</button>
              <button onClick={() => setFilter("submitted")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "submitted" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>Submitted</button>
              <button onClick={() => setFilter("full")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "full" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>Full</button>
              <button onClick={() => setFilter("installments")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "installments" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>Installments</button>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search by service type or client name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#242021] border border-gray-200" />
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="p-6 bg-gray-50 hover:bg-white rounded-2xl transition-all border border-gray-200 hover:shadow-md">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] flex-shrink-0">
                      <Receipt size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {payment.applicationId?.serviceType?.charAt(0).toUpperCase() + payment.applicationId?.serviceType?.slice(1)} Application
                        </h3>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          payment.paymentPlan === "full" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          {payment.paymentPlan}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Client: {payment.clientId?.fullName} • Amount: ${payment.totalAmount} • Submitted: {payment.createdAt ? formatDate(payment.createdAt) : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {payment.status === "submitted" && (
                      <>
                        <button 
                          onClick={() => openVerificationModal(payment, null, "approve")}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button 
                          onClick={() => openVerificationModal(payment, null, "reject")}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => { setSelectedPayment(payment); setIsPaymentDetailsOpen(true); }} 
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <Eye size={18} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Installments Preview */}
                {payment.paymentPlan === "installments" && payment.installments && payment.installments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {payment.installments.map((installment, index) => (
                      <div key={index} className="p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Installment {index + 1}
                          </span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(installment.status)}`}>
                            {getStatusIcon(installment.status)}
                            {installment.status}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">${installment.amount}</div>
                        {installment.status === "submitted" && (
                          <div className="flex gap-1 mt-2">
                            <button
                              onClick={() => openVerificationModal(payment, index, "approve")}
                              className="flex-1 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openVerificationModal(payment, index, "reject")}
                              className="flex-1 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Receipt Preview */}
                {payment.receiptImage && (
                  <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt size={16} className="text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Payment Receipt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={payment.receiptImage} 
                        alt="Payment Receipt" 
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Receipt uploaded</p>
                        <button 
                          onClick={() => window.open(payment.receiptImage, '_blank')}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View Full Size
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Verification Modal */}
      {isVerificationModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h2 className='text-2xl font-bold text-[#ffd17a]'>
                  {verificationAction === "approve" ? "Approve Payment" : "Reject Payment"}
                </h2>
                <p className="text-[#ffd17a]/70 text-sm mt-1">
                  {selectedPayment.installmentIndex !== undefined 
                    ? `Installment #${selectedPayment.installmentIndex + 1}`
                    : "Full Payment"
                  }
                </p>
              </div>
              <button onClick={() => setIsVerificationModalOpen(false)} className="text-[#ffd17a] p-2 hover:bg-white/10 rounded-xl">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleVerification} className="p-6 space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span className="font-semibold">{selectedPayment.clientId?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">
                      ${selectedPayment.installmentIndex !== undefined 
                        ? (selectedPayment.totalAmount / 3).toFixed(2)
                        : selectedPayment.totalAmount
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-semibold">
                      {selectedPayment.applicationId?.serviceType?.charAt(0).toUpperCase() + selectedPayment.applicationId?.serviceType?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedPayment.receiptImage && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Receipt Image</h3>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <img 
                      src={selectedPayment.receiptImage} 
                      alt="Payment Receipt" 
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className='block text-gray-700 font-semibold mb-2 text-sm'>Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this verification..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#242021] resize-none"
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Verification Action:</p>
                    <p className="text-xs">
                      {verificationAction === "approve" 
                        ? "This will approve the payment and activate the application."
                        : "This will reject the payment and notify the client to re-upload."
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsVerificationModalOpen(false)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={verifying}
                  className={`flex-1 py-3 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    verificationAction === "approve"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {verifying ? 'Processing...' : `${verificationAction === "approve" ? "Approve" : "Reject"} Payment`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}