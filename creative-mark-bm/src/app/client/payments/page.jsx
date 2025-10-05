"use client";
import { useState } from "react";
import { CreditCard, DollarSign, TrendingUp, Calendar, Download, Search, CheckCircle, XCircle, Clock, ChevronRight, Plus, FileText, X } from "lucide-react";

const mockPayments = [
  { id: "PAY-001", amount: 150.00, description: "Premium Subscription - Monthly", status: "completed", method: "Credit Card", date: "2024-10-01", time: "14:30", transactionId: "TXN-9876543210", cardLast4: "4242" },
  { id: "PAY-002", amount: 75.50, description: "Document Processing Fee", status: "completed", method: "PayPal", date: "2024-09-28", time: "09:15", transactionId: "TXN-9876543211", cardLast4: null },
  { id: "PAY-003", amount: 200.00, description: "Annual Service Upgrade", status: "pending", method: "Bank Transfer", date: "2024-09-25", time: "16:45", transactionId: "TXN-9876543212", cardLast4: null },
  { id: "PAY-004", amount: 89.99, description: "Additional Storage - 100GB", status: "completed", method: "Credit Card", date: "2024-09-20", time: "11:20", transactionId: "TXN-9876543213", cardLast4: "5555" },
  { id: "PAY-005", amount: 45.00, description: "Consultation Service Fee", status: "failed", method: "Credit Card", date: "2024-09-18", time: "13:50", transactionId: "TXN-9876543214", cardLast4: "1234" },
];

const mockCards = [
  { id: 1, type: "visa", last4: "4242", expiry: "12/25", isDefault: true, holderName: "John Doe" },
  { id: 2, type: "mastercard", last4: "5555", expiry: "08/26", isDefault: false, holderName: "John Doe" },
];

export default function ClientPaymentDashboard() {
  const [payments, setPayments] = useState(mockPayments);
  const [cards, setCards] = useState(mockCards);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentForm, setPaymentForm] = useState({ amount: "", description: "", method: "credit_card", cardId: cards.find(c => c.isDefault)?.id || 1 });
  const [cardForm, setCardForm] = useState({ cardNumber: "", holderName: "", expiry: "", cvv: "", isDefault: false });

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const selectedCard = cards.find(c => c.id === parseInt(paymentForm.cardId));
    const newPayment = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      amount: parseFloat(paymentForm.amount),
      description: paymentForm.description,
      status: "pending",
      method: paymentForm.method === "credit_card" ? "Credit Card" : "Bank Transfer",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      transactionId: `TXN-${Date.now()}`,
      cardLast4: selectedCard?.last4 || null,
    };
    setPayments([newPayment, ...payments]);
    setPaymentForm({ amount: "", description: "", method: "credit_card", cardId: cards.find(c => c.isDefault)?.id || 1 });
    setIsNewPaymentOpen(false);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: cards.length + 1,
      type: cardForm.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4: cardForm.cardNumber.slice(-4),
      expiry: cardForm.expiry,
      isDefault: cardForm.isDefault,
      holderName: cardForm.holderName,
    };
    if (cardForm.isDefault) {
      setCards(cards.map(c => ({ ...c, isDefault: false })).concat(newCard));
    } else {
      setCards([...cards, newCard]);
    }
    setCardForm({ cardNumber: "", holderName: "", expiry: "", cvv: "", isDefault: false });
    setIsAddCardOpen(false);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) || payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: payments.reduce((sum, p) => p.status === "completed" ? sum + p.amount : sum, 0),
    pending: payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    completed: payments.filter(p => p.status === "completed").length,
    thisMonth: payments.filter(p => p.date.startsWith("2024-10")).reduce((sum, p) => p.status === "completed" ? sum + p.amount : sum, 0),
  };

  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle size={16} />;
    if (status === "pending") return <Clock size={16} />;
    if (status === "failed") return <XCircle size={16} />;
    return null;
  };

  const getStatusStyle = (status) => {
    if (status === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "failed") return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#242021] mb-2 tracking-tight">Payments</h1>
              <p className="text-gray-600 text-base md:text-lg">Manage your payments and billing history</p>
            </div>
            <button onClick={() => setIsNewPaymentOpen(true)} className="group flex items-center gap-2 bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a] px-6 py-3 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>New Payment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a] shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide opacity-80">Total Paid</span>
                <div className="p-2 rounded-xl bg-[#ffd17a]/20"><DollarSign size={18} /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-1">${stats.total.toFixed(2)}</div>
              <div className="text-xs opacity-70">All time</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">This Month</span>
                <div className="p-2 rounded-xl bg-blue-100"><TrendingUp size={18} className="text-blue-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">${stats.thisMonth.toFixed(2)}</div>
              <div className="text-xs text-gray-500">October 2024</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">Pending</span>
                <div className="p-2 rounded-xl bg-amber-100"><Clock size={18} className="text-amber-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">${stats.pending.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Awaiting</div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-gray-600">Completed</span>
                <div className="p-2 rounded-xl bg-emerald-100"><CheckCircle size={18} className="text-emerald-600" /></div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{stats.completed}</div>
              <div className="text-xs text-gray-500">Successful</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#242021]">Payment History</h2>
                <div className="flex gap-2">
                  <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "all" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>All</button>
                  <button onClick={() => setFilter("completed")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "completed" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>Done</button>
                  <button onClick={() => setFilter("pending")} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "pending" ? "bg-[#242021] text-[#ffd17a]" : "bg-gray-100 text-gray-600"}`}>Pending</button>
                </div>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 text-gray-800 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#242021] border border-gray-200" />
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} onClick={() => { setSelectedPayment(payment); setIsDetailsOpen(true); }} className="p-4 bg-gray-50 hover:bg-white rounded-2xl transition-all border border-gray-200 hover:shadow-md cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${payment.status === "completed" ? "from-emerald-500 to-emerald-600" : payment.status === "pending" ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600"} text-white flex-shrink-0`}>
                          <DollarSign size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-sm">{payment.description}</h3>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              {payment.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">{payment.date} • {payment.method}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-xl font-bold text-gray-900">${payment.amount.toFixed(2)}</div>
                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#242021]">Cards</h2>
                <button onClick={() => setIsAddCardOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl"><Plus size={20} className="text-gray-600" /></button>
              </div>
              <div className="space-y-3">
                {cards.map((card) => (
                  <div key={card.id} className={`p-4 rounded-2xl border-2 ${card.isDefault ? "bg-gradient-to-br from-[#242021] to-[#3a3537] text-[#ffd17a]" : "bg-gray-50 text-gray-900 border-gray-200"}`}>
                    <div className="flex justify-between mb-3">
                      <div className="text-2xl">💳</div>
                      {card.isDefault && <span className="px-2 py-1 bg-[#ffd17a]/20 text-[#ffd17a] rounded-lg text-xs font-bold">Default</span>}
                    </div>
                    <div className="text-lg font-bold mb-1">•••• {card.last4}</div>
                    <div className="flex justify-between text-sm opacity-80">
                      <span>{card.holderName}</span>
                      <span>{card.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-white rounded-xl text-left flex items-center gap-3 border border-gray-200">
                  <Download size={18} className="text-gray-600" />
                  <span className="font-medium text-gray-900 text-sm">Download Statement</span>
                </button>
                <button className="w-full p-3 bg-white rounded-xl text-left flex items-center gap-3 border border-gray-200">
                  <Calendar size={18} className="text-gray-600" />
                  <span className="font-medium text-gray-900 text-sm">Schedule Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDetailsOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl">
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6 rounded-t-3xl flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#ffd17a]">Payment Details</h2>
                <p className="text-[#ffd17a]/70 text-sm mt-1">{selectedPayment.transactionId}</p>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="text-[#ffd17a] p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-sm text-gray-600 mb-1">Amount</div><div className="text-2xl font-bold text-gray-900">${selectedPayment.amount.toFixed(2)}</div></div>
                <div><div className="text-sm text-gray-600 mb-1">Status</div><span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusStyle(selectedPayment.status)}`}>{getStatusIcon(selectedPayment.status)}{selectedPayment.status}</span></div>
              </div>
              <div><div className="text-sm text-gray-600 mb-1">Description</div><div className="text-gray-900 font-medium">{selectedPayment.description}</div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-sm text-gray-600 mb-1">Method</div><div className="text-gray-900">{selectedPayment.method}</div></div>
                <div><div className="text-sm text-gray-600 mb-1">Date</div><div className="text-gray-900">{selectedPayment.date}</div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isNewPaymentOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6 rounded-t-3xl flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#ffd17a]">Make Payment</h2>
              <button onClick={() => setIsNewPaymentOpen(false)} className="text-[#ffd17a] p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Amount</label>
                <input type="number" step="0.01" required value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Description</label>
                <input type="text" required value={paymentForm.description} onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Method</label>
                <select value={paymentForm.method} onChange={(e) => setPaymentForm({...paymentForm, method: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]">
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              {paymentForm.method === "credit_card" && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Card</label>
                  <select value={paymentForm.cardId} onChange={(e) => setPaymentForm({...paymentForm, cardId: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]">
                    {cards.map(card => <option key={card.id} value={card.id}>•••• {card.last4}</option>)}
                  </select>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsNewPaymentOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a] font-bold rounded-xl">Pay</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddCardOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-[#242021] to-[#3a3537] p-6 rounded-t-3xl flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#ffd17a]">Add Card</h2>
              <button onClick={() => setIsAddCardOpen(false)} className="text-[#ffd17a] p-2 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddCard} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Card Number</label>
                <input type="text" required maxLength="16" value={cardForm.cardNumber} onChange={(e) => setCardForm({...cardForm, cardNumber: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]" placeholder="1234567890123456" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Name</label>
                <input type="text" required value={cardForm.holderName} onChange={(e) => setCardForm({...cardForm, holderName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Expiry</label>
                  <input type="text" required maxLength="5" value={cardForm.expiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4); setCardForm({...cardForm, expiry: v}); }} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">CVV</label>
                  <input type="text" required maxLength="3" value={cardForm.cvv} onChange={(e) => setCardForm({...cardForm, cvv: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#242021]" placeholder="123" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="default" checked={cardForm.isDefault} onChange={(e) => setCardForm({...cardForm, isDefault: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="default" className="text-sm text-gray-700">Set as default</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddCardOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-[#242021] to-[#3a3537] text-[#ffd17a] font-bold rounded-xl">Add Card</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}