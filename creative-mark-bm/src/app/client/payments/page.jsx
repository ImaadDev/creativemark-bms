"use client";
import { useState, useEffect } from "react";
import { CreditCard, DollarSign as RiyalSign, TrendingUp, Calendar, Download, Search, CheckCircle, XCircle, Clock, ChevronRight, Plus, FileText, X, Upload, Eye, AlertCircle, Receipt } from "lucide-react";
import { useTranslation } from "../../../i18n/TranslationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { paymentService } from "../../../services/paymentService";

export default function ClientPaymentDashboard() {
  const { t } = useTranslation();
  const { user: currentUser, loading, requireAuth } = useAuth();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [isReceiptUploadOpen, setIsReceiptUploadOpen] = useState(false);
  const [isPaymentPlanModalOpen, setIsPaymentPlanModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState("full");

  // Load payments on component mount
  useEffect(() => {
    if (loading) return;
    if (!currentUser || currentUser.role !== 'client') return;
    
    loadPayments();
  }, [currentUser, loading]);

  const loadPayments = async () => {
    try {
      const response = await paymentService.getClientPayments();
      setPayments(response.data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      setPayments([]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handlePaymentSubmission = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedPayment) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('receipt', selectedFile);
      formData.append('paymentPlan', selectedPaymentPlan);

      const response = await paymentService.submitPayment(
        selectedPayment._id,
        formData
      );

      if (response.success) {
        await loadPayments();
        setIsReceiptUploadOpen(false);
        setSelectedFile(null);
        setSelectedPayment(null);
        setSelectedPaymentPlan("full");
        alert('Payment submitted successfully!');
      } else {
        alert(response.message || 'Failed to submit payment');
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInstallmentUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedPayment) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('receipt', selectedFile);

      let response;
      
      // If this is the first installment (installmentIndex is 0) or full payment
      if (selectedPayment.installmentIndex === 0 || selectedPayment.installmentIndex === null || selectedPayment.installmentIndex === undefined) {
        // Submit payment with payment plan
        formData.append('paymentPlan', selectedPaymentPlan);
        response = await paymentService.submitPayment(
          selectedPayment._id,
          formData
        );
      } else {
        // Upload subsequent installment receipt
        response = await paymentService.uploadInstallmentReceipt(
          selectedPayment._id,
          selectedPayment.installmentIndex,
          formData
        );
      }

      if (response.success) {
        await loadPayments();
        setIsReceiptUploadOpen(false);
        setSelectedFile(null);
        setSelectedPayment(null);
        setSelectedPaymentPlan("full");
        alert('Payment submitted successfully!');
      } else {
        alert(response.message || 'Failed to upload receipt');
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      alert('Failed to upload receipt. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesFilter = filter === "all" || 
      (filter === "pending" && payment.status === "pending") ||
      (filter === "submitted" && payment.status === "submitted") ||
      (filter === "approved" && payment.status === "approved") ||
      (filter === "rejected" && payment.status === "rejected");
    
    const matchesSearch = payment.applicationId?.serviceType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalAmount: payments.reduce((sum, payment) => sum + payment.totalAmount, 0),
    pendingAmount: payments.filter(p => p.status === "pending").reduce((sum, payment) => sum + payment.totalAmount, 0),
    submittedAmount: payments.filter(p => p.status === "submitted").reduce((sum, payment) => sum + payment.totalAmount, 0),
    approvedAmount: payments.filter(p => p.status === "approved").reduce((sum, payment) => sum + payment.totalAmount, 0),
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
      day: 'numeric'
    });
  };

  const openPaymentPlanModal = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentPlanModalOpen(true);
  };

  const openReceiptUpload = (payment, installmentIndex = null) => {
    setSelectedPayment({ ...payment, installmentIndex });
    setIsReceiptUploadOpen(true);
    setIsPaymentPlanModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#242021] mb-2 tracking-tight">{t('payments.dashboard.title')}</h1>
              <p className="text-gray-600 text-base md:text-lg">{t('payments.dashboard.subtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide opacity-80'>{t('payments.dashboard.totalAmount')}</span>
                <div className="p-2 rounded-xl bg-[#ffd17a]/20"><RiyalSign size={18} /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-1">{stats.totalAmount.toFixed(2)} SAR</div>
              <div className='text-xs opacity-70'>{t('payments.all')} {t('payments.title')}</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide text-gray-600'>{t('payments.dashboard.pendingAmount')}</span>
                <div className="p-2 rounded-xl bg-amber-100"><Clock size={18} className="text-amber-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stats.pendingAmount.toFixed(2)} SAR</div>
              <div className="text-xs text-gray-500">{t('payments.dashboard.awaitingPayment')}</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide text-gray-600'>{t('payments.dashboard.submittedAmount')}</span>
                <div className="p-2 rounded-xl bg-blue-100"><Upload size={18} className="text-blue-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stats.submittedAmount.toFixed(2)} SAR</div>
              <div className='text-xs text-gray-500'>{t('payments.dashboard.underReview')}</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className='text-sm font-semibold uppercase tracking-wide text-gray-600'>{t('payments.dashboard.approvedAmount')}</span>
                <div className="p-2 rounded-xl bg-green-100"><CheckCircle size={18} className="text-green-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stats.approvedAmount.toFixed(2)} SAR</div>
              <div className='text-xs text-gray-500'>{t('payments.dashboard.verified')}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className='text-2xl font-bold text-[#242021]'>{t('payments.dashboard.paymentPlans')}</h2>
                <div className="flex gap-2">
                  <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "all" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>{t('payments.all')}</button>
                  <button onClick={() => setFilter("pending")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "pending" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>{t('payments.status.pending')}</button>
                  <button onClick={() => setFilter("submitted")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "submitted" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>{t('payments.status.submitted')}</button>
                  <button onClick={() => setFilter("approved")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "approved" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>{t('payments.status.approved')}</button>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder={t('payments.dashboard.searchByService')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#242021] border border-gray-200" />
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
                          </div>
                          <div className="text-sm text-gray-500">
                            Amount: {payment.totalAmount} SAR • Due: {payment.dueDate ? formatDate(payment.dueDate) : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {payment.status === "pending" && (
                          <button 
                            onClick={() => openPaymentPlanModal(payment)}
                            className="px-4 py-2 bg-[#242021] text-[#ffd17a] text-sm font-semibold rounded-lg hover:bg-[#3a3537] transition-colors"
                          >
{t('payments.dashboard.choosePaymentPlan')}
                          </button>
                        )}
                        <button 
                          onClick={() => { setSelectedPayment(payment); setIsPaymentDetailsOpen(true); }} 
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <ChevronRight size={18} className="text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Installments Preview */}
                    {payment.paymentPlan === "installments" && payment.installments && payment.installments.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {payment.installments.slice(0, 3).map((installment, index) => (
                          <div key={index} className="p-3 bg-white rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">
                                {t('payments.installments.installment')} {index + 1}
                              </span>
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(installment.status)}`}>
                                {getStatusIcon(installment.status)}
                                {installment.status}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{installment.amount} SAR</div>
                            {installment.status === "pending" && (
                              <button
                                onClick={() => openReceiptUpload(payment, index)}
                                className="w-full mt-2 px-3 py-1.5 bg-[#242021] text-[#ffd17a] text-xs font-semibold rounded-lg hover:bg-[#3a3537] transition-colors"
                              >
{t('payments.installments.uploadReceipt')}
                              </button>
                            )}
                          </div>
                        ))}
                        {payment.installments.length > 3 && (
                          <div className="p-3 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                            <span className="text-sm text-gray-500">
                              +{payment.installments.length - 3} more
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
              <h2 className='text-xl font-bold text-[#242021] mb-6'>{t('payments.quickActions')}</h2>
              <div className="space-y-3">
                <button className="w-full p-4 bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a] rounded-xl text-left flex items-center gap-3 hover:shadow-lg transition-all">
                  <Upload size={20} />
                  <span className='font-medium text-sm'>{t('payments.dashboard.uploadReceipt')}</span>
                </button>
                <button className="w-full p-4 bg-white rounded-xl text-left flex items-center gap-3 border border-gray-200 hover:shadow-md transition-all">
                  <Download size={20} className="text-gray-600" />
                  <span className='font-medium text-gray-900 text-sm'>{t('payments.dashboard.downloadStatement')}</span>
                </button>
                <button className="w-full p-4 bg-white rounded-xl text-left flex items-center gap-3 border border-gray-200 hover:shadow-md transition-all">
                  <Calendar size={20} className="text-gray-600" />
                  <span className='font-medium text-gray-900 text-sm'>{t('payments.dashboard.paymentHistory')}</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 p-6">
              <h3 className='text-lg font-bold text-gray-900 mb-3'>{t('payments.dashboard.paymentTips')}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t('payments.dashboard.chooseBetweenFull')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t('payments.dashboard.uploadClearReceipts')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t('payments.dashboard.verifiedWithin24Hours')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Plan Selection Modal */}
      {isPaymentPlanModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h2 className='text-2xl font-bold text-[#ffd17a]'>{t('payments.planSelection.title')}</h2>
                <p className="text-[#ffd17a]/70 text-sm mt-1">
                  {selectedPayment.applicationId?.serviceType?.charAt(0).toUpperCase() + selectedPayment.applicationId?.serviceType?.slice(1)} Application
                </p>
              </div>
              <button onClick={() => setIsPaymentPlanModalOpen(false)} className="text-[#ffd17a] p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">{t('payments.planSelection.paymentDetails')}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{t('payments.planSelection.totalAmount')}:</span>
                    <span className="font-semibold">{selectedPayment.totalAmount} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('payments.planSelection.dueDate')}:</span>
                    <span className="font-semibold">{selectedPayment.dueDate ? formatDate(selectedPayment.dueDate) : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{t('payments.planSelection.selectPaymentOption')}</h3>
                
                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPaymentPlan === "full" 
                      ? "border-[#242021] bg-[#242021]/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentPlan("full")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPaymentPlan === "full" 
                        ? "border-[#242021] bg-[#242021]" 
                        : "border-gray-300"
                    }`}>
                      {selectedPaymentPlan === "full" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">💰 {t('payments.planSelection.payInFull')}</div>
                      <div className="text-sm text-gray-600">{t('payments.planSelection.payCompleteAmount')}: {selectedPayment.totalAmount} SAR</div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPaymentPlan === "installments" 
                      ? "border-[#242021] bg-[#242021]/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentPlan("installments")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPaymentPlan === "installments" 
                        ? "border-[#242021] bg-[#242021]" 
                        : "border-gray-300"
                    }`}>
                      {selectedPaymentPlan === "installments" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">🧾 {t('payments.planSelection.payInInstallments')}</div>
                      <div className="text-sm text-gray-600">{t('payments.planSelection.payIn3Parts')}: {(selectedPayment.totalAmount / 3).toFixed(2)} SAR {t('payments.planSelection.each')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsPaymentPlanModalOpen(false)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={() => openReceiptUpload(selectedPayment)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a] font-bold rounded-xl hover:from-[#3a3537] hover:to-[#4a4547] transition-all"
                >
{t('payments.planSelection.continueToUpload')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Upload Modal */}
      {isReceiptUploadOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <h2 className='text-2xl font-bold text-[#ffd17a]'>{t('payments.receiptUpload.title')}</h2>
                <p className="text-[#ffd17a]/70 text-sm mt-1">
                  {selectedPayment.installmentIndex !== undefined 
                    ? `Installment #${selectedPayment.installmentIndex + 1} - ${(selectedPayment.totalAmount / 3).toFixed(2)} SAR`
                    : `Total Amount - ${selectedPayment.totalAmount} SAR`
                  }
                </p>
              </div>
              <button onClick={() => setIsReceiptUploadOpen(false)} className="text-[#ffd17a] p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={selectedPayment.installmentIndex !== undefined ? handleInstallmentUpload : handlePaymentSubmission} className="p-6 space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">
                      {selectedPayment.installmentIndex !== undefined 
                        ? `${(selectedPayment.totalAmount / 3).toFixed(2)} SAR`
                        : `${selectedPayment.totalAmount} SAR`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Plan:</span>
                    <span className="font-semibold">
                      {selectedPayment.installmentIndex !== undefined ? 'Installments' : selectedPaymentPlan}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-gray-700 font-semibold mb-2 text-sm'>Receipt Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="text-green-600">
                          <CheckCircle size={48} className="mx-auto" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">Click to change file</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-gray-400">
                          <Upload size={48} className="mx-auto" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Click to upload receipt</p>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Ensure the receipt is clear and readable</li>
                      <li>• Include transaction reference number if available</li>
                      <li>• Payment will be verified within 24-48 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsReceiptUploadOpen(false)} 
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!selectedFile || uploading}
                  className="flex-1 py-3 bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a] font-bold rounded-xl hover:from-[#3a3537] hover:to-[#4a4547] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}