"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import { getInvoiceById } from "../../../../services/invoiceService";
import EditInvoiceModal from "../../../../components/admin/EditInvoiceModal";

const InvoicePrintPage = () => {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const data = await getInvoiceById(params.id);
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error.message || "Failed to fetch invoice");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  const getStatusColor = (status) => {
    const colors = {
      Paid: "bg-emerald-100 text-emerald-800",
      Pending: "bg-amber-100 text-amber-800",
      Overdue: "bg-rose-100 text-rose-800",
      "Partially Paid": "bg-blue-100 text-blue-800",
      Cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status] || colors["Pending"];
  };

  const handlePrint = () => {
    window.print();
  };

  // Handler for updating invoice after edit
  const handleInvoiceUpdate = (updatedInvoice) => {
    setInvoice(updatedInvoice);
    setEditOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Loading Invoice...</h3>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Not Found</h3>
          <p className="text-gray-600 mb-4">{error || "The invoice you are looking for does not exist."}</p>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 mx-auto"
          >
            <FaArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Action Buttons - Hidden on Print */}
      <div className="no-print bg-white border-b p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-100 rounded-lg"
          >
            Edit
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <FaPrint className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* Edit Invoice Modal */}
      {editOpen && (
        <EditInvoiceModal
          invoice={invoice}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleInvoiceUpdate}
        />
      )}

      {/* Invoice Container - Full Width for Print */}
      <div className="max-w-[210mm] mx-auto p-8 print:p-0 print:max-w-full">
        <div className="bg-white shadow-sm print:shadow-none">
          
          {/* Header */}
          <div className="flex justify-between items-start p-8 pb-6 border-b-2 border-gray-900">
            <div className="flex items-start gap-3">
              <img
                src="/CreativeMarkFavicon.png"
                alt="Logo"
                className="w-14 h-14 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">CreativeMark</h1>
                <p className="text-xs text-gray-600 mt-1">Creating The Future</p>
                <p className="text-xs text-gray-600">Rifah Ibn Rafi, Riyadh, 12344</p>
                <p className="text-xs text-gray-600 mt-1">info@creativemark1 | +966 539683334</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">INVOICE</h2>
              <p className="text-sm text-gray-600 mt-1">#{invoice.invoiceNumber}</p>
              <div className={`inline-block px-3 py-1 rounded text-xs font-medium mt-2 ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </div>
            </div>
          </div>

          {/* Billing Info & Dates */}
          <div className="grid grid-cols-2 gap-8 p-8 pb-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</p>
              <h3 className="font-bold text-gray-900 mb-1">{invoice.clientFullName || invoice.clientName}</h3>
              {invoice.clientFullName && invoice.clientFullName !== invoice.clientName && (
                <p className="text-sm text-gray-600">{invoice.clientName}</p>
              )}
              <div className="text-sm text-gray-600 space-y-0.5 mt-2">
                {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                {(invoice.clientCity || invoice.clientZipCode) && (
                  <p>
                    {invoice.clientCity}
                    {invoice.clientCity && invoice.clientZipCode && ", "}
                    {invoice.clientZipCode}
                  </p>
                )}
                {invoice.clientCountry && <p>{invoice.clientCountry}</p>}
                {invoice.clientEmail && <p className="mt-1.5">{invoice.clientEmail}</p>}
                {invoice.clientPhone && <p>{invoice.clientPhone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Invoice Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.invoiceDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Due Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {invoice.paymentMethod && (
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">{invoice.paymentMethod}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 pb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-3 text-xs font-semibold text-gray-900 uppercase tracking-wide">Description</th>
                  <th className="text-center py-3 text-xs font-semibold text-gray-900 uppercase tracking-wide w-20">Qty</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-900 uppercase tracking-wide w-28">Unit Price</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-900 uppercase tracking-wide w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="py-3 text-sm text-gray-700 text-center">{item.quantity}</td>
                    <td className="py-3 text-sm text-gray-700 text-right">SAR {item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 text-sm font-medium text-gray-900 text-right">SAR {item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Payment Schedule */}
          <div className="grid grid-cols-2 gap-8 px-8 pb-6">
            {/* Payment Schedule */}
            <div>
  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
    Payment Schedule
  </p>
  <div className="space-y-2">
    {invoice.installments && invoice.installments.length > 0 &&
     !(invoice.installments.length === 1 && 
       invoice.installments[0].amount === invoice.grandTotal) ? (
      invoice.installments.map((inst, idx) => (
        <div key={idx} className="text-sm border-l-2 border-gray-300 pl-3 py-1">
          <p className="font-medium text-gray-900">
            Installment {inst.installmentNumber} — SAR {inst.amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">
            Due:{" "}
            {new Date(inst.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {inst.paidDate &&
              ` • Paid: ${new Date(inst.paidDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}`}
          </p>
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${getStatusColor(
              inst.status
            )}`}
          >
            {inst.status}
          </span>
        </div>
      ))
    ) : (
      <div className="text-sm border-l-2 border-gray-300 pl-3 py-1">
        <p className="font-medium text-gray-900">
          Full Payment — SAR {invoice.grandTotal.toLocaleString()}
        </p>
        <p className="text-xs text-gray-600">
          Due:{" "}
          {new Date(invoice.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${getStatusColor(
            invoice.status
          )}`}
        >
          {invoice.status}
        </span>
      </div>
    )}
  </div>
</div>



            {/* Summary */}
            <div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">SAR {invoice.subTotal.toLocaleString()}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                    <span className="font-medium text-gray-900">SAR {invoice.taxAmount.toLocaleString()}</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-emerald-600">-SAR{invoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-gray-900">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">SAR {invoice.grandTotal.toLocaleString()}</span>
                </div>
                {invoice.paidAmount > 0 && (
                  <>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Paid</span>
                      <span className="font-medium text-emerald-600">SAR {invoice.paidAmount.toLocaleString()}</span>
                    </div>
                    {invoice.remainingAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Balance Due</span>
                        <span className="text-lg font-bold text-rose-600">SAR {invoice.remainingAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-8 pb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-5 text-center">
            <p className="text-sm font-medium text-gray-900">Thank you for your business!</p>
            <p className="text-xs text-gray-600 mt-1">
              This is a computer-generated invoice. For questions, contact us at info@creativemark1
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      overflow: hidden !important;
      width: 100% !important;
      height: 100% !important;
    }

    @page {
      size: A4 landscape; /* 👈 Makes it wider */
      margin: 10mm;
    }

    .no-print {
      display: none !important;
    }

    .print\\:hidden {
      display: none !important;
    }

    .print\\:shadow-none {
      box-shadow: none !important;
    }

    .print\\:p-0 {
      padding: 0 !important;
    }

    .print\\:bg-white {
      background: white !important;
    }

    .print\\:max-w-full {
      max-width: 100% !important;
      width: 100% !important;
    }

    .shadow-sm {
      box-shadow: none !important;
    }

    /* Hide scrollbar completely */
    ::-webkit-scrollbar {
      display: none;
    }
  }
`}</style>

    </div>
  );
};

export default InvoicePrintPage;