import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "SAR" },
    method: { type: String, enum: ["card", "bank_transfer", "cash"], required: true },
    plan: { type: String, enum: ["full", "installment"], default: "full" }, // ✅ new
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    transactionRef: String,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }, { timestamps: true });
  
  
  export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
  