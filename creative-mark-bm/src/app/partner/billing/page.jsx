"use client";
import { useState } from "react";

export default function ExternalBilling() {
  const [invoices, setInvoices] = useState([
    { id: 1, service: "Company Formation - Client A", amount: "5,000 AED", status: "Paid", date: "2024-02-15" },
    { id: 2, service: "Investment License - Client B", amount: "10,000 AED", status: "Pending", date: "2024-03-01" },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, task: "Review Articles of Association - Client A", amount: "500 AED", status: "Received" },
    { id: 2, task: "Prepare Power of Attorney - Client B", amount: "300 AED", status: "Pending" },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Billing & Payments</h2>

      {/* Record New Invoice */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Record New Invoice</h3>
        <form className="space-y-3">
          <div>
            <label htmlFor="invoiceService" className="block text-sm font-medium text-gray-700">Service/Task</label>
            <input type="text" id="invoiceService" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="invoiceAmount" className="block text-sm font-medium text-gray-700">Amount (AED)</label>
            <input type="number" id="invoiceAmount" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Record Invoice</button>
        </form>
      </section>

      {/* Invoices History */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Invoices History</h3>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{invoice.service}</p>
                <p className="text-sm text-gray-600">{invoice.amount} - {invoice.status}</p>
              </div>
              <span className="text-xs text-gray-500">{invoice.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Track Payments for Tasks */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Payments for Tasks</h3>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-medium">{payment.task}</p>
                <p className="text-sm text-gray-600">{payment.amount}</p>
              </div>
              <span className={`font-semibold ${payment.status === "Received" ? "text-green-500" : "text-yellow-500"}`}>
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
