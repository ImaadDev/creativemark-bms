"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaSave, FaEye, FaMoneyBillWave, FaFileInvoiceDollar } from "react-icons/fa";
import InvoicePreview from "./InvoicePreview";
import ToastContainer from "../common/Toast";
import { motion } from "framer-motion";
import { createInvoice } from "../../services/invoiceService";

// Toast Hook
const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  return { toasts, addToast, removeToast };
};

// Generate Invoice Number
const generateInvoiceNumber = () => {
  return `INV-${Math.floor(Math.random() * 10000).toString().padStart(5, "0")}`;
};

const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientFullName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientCity: "",
    clientCountry: "",
    clientZipCode: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    subTotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    grandTotal: 0,
    paidAmount: 0,
    remainingAmount: 0,
    installments: [],
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      setFormData((prev) => ({ ...prev, invoiceNumber: generateInvoiceNumber() }));
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Auto-calculate totals
  useEffect(() => {
    const subTotal = formData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = (subTotal * formData.taxRate) / 100;
    const grandTotal = subTotal + taxAmount - formData.discount;
    const remainingAmount = grandTotal - formData.paidAmount;

    setFormData((prev) => ({
      ...prev,
      subTotal,
      taxAmount,
      grandTotal: Math.max(0, grandTotal),
      remainingAmount: Math.max(0, remainingAmount),
    }));
  }, [formData.items, formData.taxRate, formData.discount, formData.paidAmount]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === "quantity" || field === "unitPrice" ? Number(value) || 0 : value;
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const addInstallment = () => {
    setFormData((prev) => ({
      ...prev,
      installments: [
        ...prev.installments,
        { installmentNumber: prev.installments.length + 1, amount: 0, dueDate: "", status: "Pending", paidDate: "" },
      ],
    }));
  };

  const handleInstallmentChange = (index, field, value) => {
    const newInstallments = [...formData.installments];
    newInstallments[index][field] = field === "amount" ? Number(value) || 0 : value;
    if (field === "status" && value !== "Paid") {
      newInstallments[index].paidDate = "";
    }
    setFormData((prev) => ({ ...prev, installments: newInstallments }));
  };

  const removeInstallment = (index) => {
    const newInstallments = formData.installments
      .filter((_, i) => i !== index)
      .map((inst, i) => ({ ...inst, installmentNumber: i + 1 }));
    setFormData((prev) => ({ ...prev, installments: newInstallments }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!formData.clientEmail.trim()) newErrors.clientEmail = "Client email is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = "Invoice number is required";

    formData.items.forEach((item, i) => {
      if (!item.description.trim()) newErrors[`desc_${i}`] = "Description is required";
      if (item.quantity <= 0) newErrors[`qty_${i}`] = "Quantity must be greater than 0";
      if (item.unitPrice <= 0) newErrors[`price_${i}`] = "Unit price must be greater than 0";
    });

    if (formData.installments.length > 0) {
      let totalInstallmentAmount = 0;
      formData.installments.forEach((inst, i) => {
        totalInstallmentAmount += inst.amount;
        if (inst.amount <= 0) newErrors[`inst_amount_${i}`] = "Amount must be greater than 0";
        if (!inst.dueDate) newErrors[`inst_dueDate_${i}`] = "Due date is required";
        if (inst.status === "Paid" && !inst.paidDate) newErrors[`inst_paidDate_${i}`] = "Paid date is required for Paid status";
      });
      if (Math.abs(totalInstallmentAmount - formData.grandTotal) > 0.01) {
        newErrors.installmentsTotal = `Installment total ($${totalInstallmentAmount.toFixed(2)}) must match Grand Total ($${formData.grandTotal.toFixed(2)}).`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        installments:
          formData.installments.length > 0
            ? formData.installments.map((inst) => ({
                ...inst,
                paidDate: inst.paidDate || undefined,
              }))
            : [
                {
                  installmentNumber: 1,
                  amount: formData.remainingAmount,
                  dueDate: formData.dueDate,
                  status: "Pending",
                  paidDate: undefined,
                },
              ],
      };

      const res = await createInvoice(data);
      addToast("Invoice created successfully!", "success");
      onSuccess(res.invoice);
      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
      addToast(error.message || "Error creating invoice", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => setShowPreview(true);

  if (!isOpen) return null;

  if (showPreview) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <InvoicePreview invoice={formData} onClose={() => setShowPreview(false)} />
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#242021]/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-5xl max-h-[95vh] flex flex-col border border-[#ffd17a]/20"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#ffd17a]/20 bg-gradient-to-r from-[#242021]/5 to-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#ffd17a] rounded-xl flex items-center justify-center">
              <FaFileInvoiceDollar className="text-[#242021] w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#242021] to-[#242021]/80 bg-clip-text text-transparent">
                Create New Invoice
              </h2>
              <span className="text-sm font-semibold text-[#ffd17a]/80">#{formData.invoiceNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-[#ffd17a]/10 transition-all duration-300"
          >
            <FaTimes className="w-5 h-5 text-[#242021]/70 hover:text-[#242021]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Client Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#242021] border-b border-[#ffd17a]/20 pb-2">Client Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: "Name *", field: "clientName", type: "text" },
                  { label: "Email *", field: "clientEmail", type: "email" },
                  { label: "Phone", field: "clientPhone", type: "text" },
                  { label: "Address", field: "clientAddress", type: "text" },
                  { label: "City", field: "clientCity", type: "text" },
                  { label: "Country", field: "clientCountry", type: "text" },
                  { label: "Zip Code", field: "clientZipCode", type: "text" },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-[#242021]/80">{label}</label>
                    <input
                      type={type}
                      value={formData[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] placeholder-[#242021]/50 ${
                        errors[field] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#242021] border-b border-[#ffd17a]/20 pb-2">Invoice Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#242021]/80">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#242021]/80">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021]"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#242021]/80">Invoice Date</label>
                  <input
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#242021]/80">Due Date *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] ${
                      errors.dueDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#242021]/5 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-semibold text-[#242021] border-b border-[#ffd17a]/20 pb-2">Financial Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Subtotal", value: `SAR ${formData.subTotal.toFixed(2)}`, color: "text-[#242021]" },
                  { label: `Tax (${formData.taxRate}%)`, value: `SAR ${formData.taxAmount.toFixed(2)}`, color: "text-[#242021]" },
                  { label: "Discount", value: `SAR ${formData.discount.toFixed(2)}`, color: "text-emerald-600" },
                  { label: "Grand Total", value: `SAR ${formData.grandTotal.toFixed(2)}`, color: "text-[#ffd17a]" },
                  { label: "Remaining Due", value: `SAR ${formData.remainingAmount.toFixed(2)}`, color: "text-red-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between text-sm font-medium">
                    <span className="text-[#242021]/80">{label}:</span>
                    <span className={color}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-[#ffd17a]/20 pb-2">
                <h3 className="text-lg font-semibold text-[#242021]">Invoice Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ffd17a] text-[#242021] rounded-xl hover:bg-[#ffd17a]/80 transition-all duration-300 font-semibold"
                >
                  <FaPlus className="w-4 h-4" /> Add Item
                </button>
              </div>
              <div className="space-y-4">
                {formData.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 bg-[#242021]/5 p-4 rounded-2xl">
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-sm font-medium text-[#242021]/80">Description *</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(i, "description", e.target.value)}
                        className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] placeholder-[#242021]/50 ${
                          errors[`desc_${i}`] ? "border-red-500" : ""
                        }`}
                        placeholder="Item description"
                      />
                      {errors[`desc_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`desc_${i}`]}</p>}
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-[#242021]/80">Qty *</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(i, "quantity", e.target.value)}
                        className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] ${
                          errors[`qty_${i}`] ? "border-red-500" : ""
                        }`}
                      />
                      {errors[`qty_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`qty_${i}`]}</p>}
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-[#242021]/80">Price *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(i, "unitPrice", e.target.value)}
                        className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] ${
                          errors[`price_${i}`] ? "border-red-500" : ""
                        }`}
                      />
                      {errors[`price_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`price_${i}`]}</p>}
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-sm font-medium text-[#242021]/80">Total</label>
                      <input
                        type="text"
                        value={`SAR ${item.total.toFixed(2)}`}
                        readOnly
                        className="w-full px-4 py-3 bg-[#242021]/5 border border-[#242021]/10 rounded-xl text-[#242021]"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-1 flex justify-end items-center">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="p-3 text-red-600 hover:bg-red-100/50 rounded-xl transition-all duration-300"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Installments */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-[#ffd17a]/20 pb-2">
                <h3 className="text-lg font-semibold text-[#242021]">Installment Schedule</h3>
                <button
                  type="button"
                  onClick={addInstallment}
                  className="flex items-center gap-2 px-6 py-3 bg-[#ffd17a] text-[#242021] rounded-xl hover:bg-[#ffd17a]/80 transition-all duration-300 font-semibold"
                >
                  <FaPlus className="w-4 h-4" /> Add Installment
                </button>
              </div>
              {errors.installmentsTotal && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {errors.installmentsTotal}
                </div>
              )}
              <div className="space-y-4">
                {formData.installments.length === 0 ? (
                  <p className="text-[#242021]/70 italic text-sm">
                    No installments defined. Full remaining amount (SAR {formData.remainingAmount.toFixed(2)}) due on invoice due date.
                  </p>
                ) : (
                  formData.installments.map((inst, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-4 bg-[#242021]/5 p-4 rounded-2xl border border-[#ffd17a]/20"
                    >
                      <div className="col-span-6 sm:col-span-1">
                        <label className="block text-sm font-medium text-[#242021]/80">No.</label>
                        <input
                          type="text"
                          value={inst.installmentNumber}
                          readOnly
                          className="w-full px-4 py-3 bg-[#242021]/5 border border-[#242021]/10 rounded-xl text-[#242021] text-center"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-[#242021]/80">Due Date *</label>
                        <input
                          type="date"
                          value={inst.dueDate}
                          onChange={(e) => handleInstallmentChange(i, "dueDate", e.target.value)}
                          className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] ${
                            errors[`inst_dueDate_${i}`] ? "border-red-500" : ""
                          }`}
                        />
                        {errors[`inst_dueDate_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`inst_dueDate_${i}`]}</p>}
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-[#242021]/80">Amount *</label>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={inst.amount}
                          onChange={(e) => handleInstallmentChange(i, "amount", e.target.value)}
                          className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] ${
                            errors[`inst_amount_${i}`] ? "border-red-500" : ""
                          }`}
                        />
                        {errors[`inst_amount_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`inst_amount_${i}`]}</p>}
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-sm font-medium text-[#242021]/80">Status</label>
                        <select
                          value={inst.status}
                          onChange={(e) => handleInstallmentChange(i, "status", e.target.value)}
                          className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-sm font-medium text-[#242021]/80">
                          Paid Date {inst.status === "Paid" ? "*" : ""}
                        </label>
                        <input
                          type="date"
                          value={inst.paidDate}
                          onChange={(e) => handleInstallmentChange(i, "paidDate", e.target.value)}
                          className={`w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] ${
                            errors[`inst_paidDate_${i}`] ? "border-red-500" : ""
                          }`}
                          disabled={inst.status !== "Paid"}
                        />
                        {errors[`inst_paidDate_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`inst_paidDate_${i}`]}</p>}
                      </div>
                      <div className="col-span-6 sm:col-span-1 flex justify-end items-center">
                        <button
                          type="button"
                          onClick={() => removeInstallment(i)}
                          className="p-3 text-red-600 hover:bg-red-100/50 rounded-xl transition-all duration-300"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tax, Discount, Paid Amount */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#242021] border-b border-[#ffd17a]/20 pb-2">Additional Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#242021]/80">Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange("taxRate", Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#242021]/80">Discount (SAR)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#242021]/80">Paid Amount (SAR)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.paidAmount}
                    onChange={(e) => handleInputChange("paidAmount", Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021]"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[#242021]/80">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-[#242021]/10 rounded-xl focus:border-[#ffd17a] focus:ring-2 focus:ring-[#ffd17a]/30 transition-all duration-300 text-[#242021] placeholder-[#242021]/50"
                rows={4}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#ffd17a]/20 bg-[#242021]/5 flex-shrink-0">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center gap-2 px-6 py-3 bg-white/50 border border-[#242021]/10 rounded-xl hover:bg-[#ffd17a]/10 text-[#242021] font-semibold transition-all duration-300"
              >
                <FaEye className="w-4 h-4" /> Preview
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#ffd17a] text-[#242021] rounded-xl hover:bg-[#ffd17a]/80 disabled:opacity-50 font-semibold transition-all duration-300"
              >
                <FaSave className="w-4 h-4" /> {loading ? "Saving..." : "Save Invoice"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </motion.div>
  );
};

export default CreateInvoiceModal;