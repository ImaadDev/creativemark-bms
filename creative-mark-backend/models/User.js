import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, index: true },
  phone: { type: String, trim: true },
  phoneCountryCode: { type: String, trim: true, default: "+966" },
  nationality: { type: String },
  residencyStatus: { 
    type: String, 
    enum: ["saudi", "gulf", "premium", "foreign"], 
  },
  passwordHash: { type: String, required: true }, // 🔐 Hashed password

  // Profile picture
  profilePicture: { type: String }, // URL to profile picture

  // Address information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  // Role-based system
  role: { 
    type: String, 
    enum: ["client", "employee", "partner", "admin"], 
    default: "client",
    index: true
  },

  // Partner-specific fields
  partnerDetails: {
    partnerId: { type: String, unique: true, sparse: true }, // Unique partner ID
    partnerType: { 
      type: String, 
      enum: ["consultant", "contractor", "vendor", "freelancer", "agency"] 
    },
    companyName: String,
    crNumber: String,   // Commercial Registration Number
    sharePercentage: Number,
    contractStartDate: Date,
    contractEndDate: Date,
    commissionRate: Number,
    specializations: [String],
    serviceAreas: [String],
    languages: [String],
    availability: { 
      type: String, 
      enum: ["available", "busy", "unavailable"], 
      default: "available" 
    },
  },

  // Employee-specific fields
  employeeDetails: {
    employeeId: { type: String, unique: true, sparse: true }, // Unique employee ID
    position: String,
    department: { 
      type: String, 
      enum: [
        "Administration", "Human Resources", "Finance", "Operations", 
        "IT", "Legal", "Marketing", "Sales", "Customer Service"
      ] 
    },
    salary: Number,
    hireDate: Date,
    manager: String,
    permissions: [String],
    workLocation: String,
    emergencyContact: String,
    skills: [String],
  },

  // Admin-specific fields
  adminDetails: {
    adminId: { type: String, unique: true, sparse: true }, // Unique admin ID
    permissions: [String],
    accessLevel: { 
      type: String, 
      enum: ["admin", "supervisor", "manager", "employee"] 
    },
  },

  // Bio and additional info
  bio: String,

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

/**
 * 🔐 Pre-save hook → hash password if changed
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * ✅ Compare entered password with stored hash
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

/**
 * Generate unique ID for different user types
 */
UserSchema.statics.generateUniqueId = async function (role) {
  const prefix = role === 'employee' ? 'CR' : role === 'partner' ? 'PT' : 'AD';
  let counter = 1;
  let uniqueId;
  
  do {
    const randomNum = Math.floor(Math.random() * 90000) + 10000; // 5-digit random number
    uniqueId = `${prefix}-${randomNum}`;
    
    // Check if this ID already exists
    const existingUser = await this.findOne({
      $or: [
        { 'employeeDetails.employeeId': uniqueId },
        { 'partnerDetails.partnerId': uniqueId },
        { 'adminDetails.adminId': uniqueId }
      ]
    });
    
    if (!existingUser) break;
    counter++;
  } while (counter < 100); // Prevent infinite loop
  
  return uniqueId;
};

// Virtual: applications submitted by this user (if client)
UserSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "userId",
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
