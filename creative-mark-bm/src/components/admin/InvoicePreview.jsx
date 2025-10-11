import React from 'react';
import { FaTimes, FaPrint, FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';

const InvoicePreview = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:p-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] print:shadow-none print:rounded-none print:max-w-none print:max-h-none">
        {/* Preview Header - Hidden in print */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 print:hidden bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPrint />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close preview"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto flex-1 p-8 print:p-0">
          <div className="max-w-4xl mx-auto bg-white print:shadow-none">
            {/* Company Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-500 mt-1">#{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">Creativemark</div>
                <div className="text-gray-500 mt-1">
                  <p>Creative The Future</p>
                  <p>Rifah Ibn Rafi Street Al Olaya, Riyadh</p>
                  <p>info@creativemark1</p>
                </div>
              </div>
            </div>

            {/* Client & Invoice Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Bill To</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{invoice.clientName}</p>
                  <p>{invoice.clientEmail}</p>
                  <p>{invoice.clientAddress}</p>
                  <p>{invoice.clientCity}, {invoice.clientZipCode}</p>
                  <p>{invoice.clientCountry}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Invoice Details</h3>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <p>Invoice Date:</p>
                  <p>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                  <p>Due Date:</p>
                  <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  <p>Status:</p>
                  <p className={`font-semibold ${
                    invoice.status === 'Paid' ? 'text-green-600' :
                    invoice.status === 'Unpaid' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>{invoice.status}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 text-left text-gray-600">Description</th>
                    <th className="py-3 text-right text-gray-600">Qty</th>
                    <th className="py-3 text-right text-gray-600">Price</th>
                    <th className="py-3 text-right text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 text-gray-800">{item.description}</td>
                      <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-600">SAR {item.unitPrice.toFixed(2)}</td>
                      <td className="py-4 text-right text-gray-800">SAR {item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">SAR {invoice.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
                    <span className="text-gray-800">SAR {invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-SAR {invoice.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-blue-600">SAR {invoice.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {invoice.paidAmount > 0 && (
              <div className="mb-8">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${(invoice.paidAmount / invoice.grandTotal) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">Payment Progress</span>
                  <span className="text-gray-800 font-medium">
                    SAR {invoice.paidAmount.toFixed(2)} / SAR {invoice.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Installments */}
            {invoice.installments && invoice.installments.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4">Payment Schedule</h3>
                <div className="space-y-2">
                  {invoice.installments.map((inst, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-gray-600">Installment {inst.installmentNumber}</span>
                        <p className="text-sm text-gray-500">Due: {new Date(inst.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-800">SAR {inst.amount.toFixed(2)}</span>
                        <p className={`text-sm ${
                          inst.status === 'Paid' ? 'text-green-600' :
                          inst.status === 'Overdue' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{inst.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm border-t pt-8">
              <p>Thank you for your business!</p>
              <p className="mt-1">Questions? Contact us at info@creativemark1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;