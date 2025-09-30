// Mock Payment Service - No backend connection
import api from "./api";

// Mock payments data
let mockPayments = [
  {
    id: "1",
    applicationId: "1",
    amount: 5000,
    currency: "SAR",
    method: "bank_transfer",
    plan: "full",
    status: "paid",
    transactionRef: "TXN-123456789",
    paidBy: "1",
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    clientName: "John Doe",
    serviceType: "commercial"
  },
  {
    id: "2",
    applicationId: "2", 
    amount: 10000,
    currency: "SAR",
    method: "card",
    plan: "installment",
    status: "pending",
    transactionRef: "TXN-987654321",
    paidBy: "1",
    paidAt: null,
    clientName: "John Doe",
    serviceType: "engineering"
  },
  {
    id: "3",
    applicationId: "3",
    amount: 15000,
    currency: "SAR", 
    method: "cash",
    plan: "full",
    status: "paid",
    transactionRef: "TXN-456789123",
    paidBy: "6",
    paidAt: new Date(Date.now() - 172800000).toISOString(),
    clientName: "Robert Brown",
    serviceType: "real_estate"
  }
];

// Mock payment methods
const mockPaymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "bank_transfer", name: "Bank Transfer", icon: "🏦" },
  { id: "cash", name: "Cash Payment", icon: "💵" }
];

const paymentService = {
  // Get payment summary/overview
  getPaymentSummary: async () => {
    console.log('Mock getPaymentSummary');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const totalPaid = mockPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalPending = mockPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      success: true,
      data: {
        totalPaid,
        totalPending,
        totalTransactions: mockPayments.length,
        paidTransactions: mockPayments.filter(p => p.status === 'paid').length,
        pendingTransactions: mockPayments.filter(p => p.status === 'pending').length
      }
    };
  },

  // Get client payments with filters
  getClientPayments: async (filters = {}) => {
    console.log('Mock getClientPayments with filters:', filters);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredPayments = [...mockPayments];
    
    // Apply filters
    if (filters.status) {
      filteredPayments = filteredPayments.filter(p => p.status === filters.status);
    }
    
    if (filters.search) {
      filteredPayments = filteredPayments.filter(p => 
        p.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.transactionRef.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: {
        payments: filteredPayments,
        total: filteredPayments.length,
        page: filters.page || 1,
        limit: filters.limit || 10
      }
    };
  },

  // Get upcoming payments
  getUpcomingPayments: async () => {
    console.log('Mock getUpcomingPayments');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const upcomingPayments = mockPayments.filter(p => p.status === 'pending');
    
    return {
      success: true,
      data: upcomingPayments
    };
  },

  // Get payment methods
  getPaymentMethods: async () => {
    console.log('Mock getPaymentMethods');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: mockPaymentMethods
    };
  },

  // Create new payment
  createPayment: async (paymentData) => {
    console.log('Mock createPayment:', paymentData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newPayment = {
      id: (mockPayments.length + 1).toString(),
      ...paymentData,
      status: "pending",
      transactionRef: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      paidAt: null
    };
    
    mockPayments.push(newPayment);
    
    return {
      success: true,
      message: "Payment created successfully",
      data: newPayment
    };
  },

  // Process payment
  processPayment: async (paymentId, paymentData) => {
    console.log('Mock processPayment:', paymentId, paymentData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const payment = mockPayments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    
    payment.status = "paid";
    payment.paidAt = new Date().toISOString();
    payment.method = paymentData.method || payment.method;
    
    return {
      success: true,
      message: "Payment processed successfully",
      data: payment
    };
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    console.log('Mock getPaymentDetails:', paymentId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const payment = mockPayments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    
    return {
      success: true,
      data: payment
    };
  },

  // Download receipt
  downloadReceipt: async (paymentId) => {
    console.log('Mock downloadReceipt:', paymentId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const payment = mockPayments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    
    if (payment.status !== 'paid') {
      throw new Error("Receipt only available for paid payments");
    }
    
    return {
      success: true,
      data: {
        receiptUrl: `mock-receipt-url-${paymentId}.pdf`,
        payment: payment
      }
    };
  }
};

// Mock helper functions
export const getMockPayments = () => mockPayments;
export const getMockPaymentMethods = () => mockPaymentMethods;
export const addMockPayment = (payment) => {
  mockPayments.push(payment);
  return payment;
};

export default paymentService;
