import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema({
  installmentNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending",
  },
  paidDate: { type: Date },
});

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    // Admin who created it
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },

    // Client Details
    clientName: { type: String, required: true },
    clientFullName: { type: String },
    clientEmail: { type: String },
    clientPhone: { type: String },
    clientAddress: { type: String },
    clientCity: { type: String },
    clientCountry: { type: String },
    clientZipCode: { type: String },

    // Invoice Info
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid", "Overdue", "Cancelled"],
      default: "Pending",
    },

    // Items
    items: [itemSchema],

    // Financial Summary
    subTotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    // Payment & Installments
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Credit Card", "PayPal", "Other"],
    },
    installments: [installmentSchema],
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },

    // Notes
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
