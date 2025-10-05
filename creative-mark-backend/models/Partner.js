import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
  // Reference to User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Partnership Information
  partnershipInfo: {
    partnershipType: {
      type: String,
      enum: [
        'IFZA Free Zone Company',
        'IFZA Branch Office',
        'IFZA Representative Office',
        'IFZA Subsidiary',
        'IFZA Joint Venture',
        'Other'
      ],
      required: true
    },
    clientEngagementManager: {
      type: String,
      required: true,
      trim: true
    },
    ifzaContactPerson: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Partner Information
  partnerInfo: {
    legalEntityName: {
      type: String,
      required: true,
      trim: true
    },
    legalFormOfEntity: {
      type: String,
      enum: [
        'Limited Liability Company (LLC)',
        'Public Joint Stock Company (PJSC)',
        'Private Joint Stock Company (PrJSC)',
        'Partnership Limited by Shares',
        'Limited Partnership',
        'General Partnership',
        'Sole Proprietorship',
        'Branch Office',
        'Representative Office',
        'Free Zone Company',
        'Other'
      ],
      required: true
    },
    businessAddress: {
      type: String,
      required: true,
      trim: true
    }
  },

  // General Manager / Director Details
  generalManagerDetails: {
    title: {
      type: String,
      enum: ['Mr.', 'Ms.', 'Dr.', 'Prof.', 'Eng.', 'Other'],
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    countryOfBirth: {
      type: String,
      required: true,
      trim: true
    },
    nationality: {
      type: String,
      required: true,
      trim: true
    },
    passportNumber: {
      type: String,
      required: true,
      trim: true
    },
    passportCountryOfIssue: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Incorporation & Contact Details
  incorporationDetails: {
    incorporationDocumentsEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    billingAddress: {
      type: String,
      required: true,
      trim: true
    },
    officeAddress: {
      type: String,
      required: true,
      trim: true
    },
    buildingName: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    streetDistrict: {
      type: String,
      required: true,
      trim: true
    },
    postalZipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Banking Details
  bankingDetails: {
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    beneficiaryAccountName: {
      type: String,
      required: true,
      trim: true
    },
    bankAccountNumber: {
      type: String,
      required: true,
      trim: true
    },
    iban: {
      type: String,
      required: true,
      trim: true
    },
    swiftCode: {
      type: String,
      required: true,
      trim: true
    },
    bankStreetAddress: {
      type: String,
      required: true,
      trim: true
    },
    bankCity: {
      type: String,
      required: true,
      trim: true
    },
    accountsContactPerson: {
      type: String,
      required: true,
      trim: true
    },
    trn: {
      type: String,
      trim: true // Tax Registration Number
    }
  },

  // Required Documents
  requiredDocuments: {
    companyRegistrationTradeLicense: {
      type: String, // File path or URL
      required: false
    },
    generalManagerDirectorPassport: {
      type: String, // File path or URL
      required: false
    },
    vatCertificate: {
      type: String, // File path or URL
      required: false
    }
  },

  // Status and metadata
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

  // Additional notes
  notes: {
    type: String,
    trim: true
  },

  // Review information
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    trim: true
  }

}, { 
  timestamps: true 
});

// Index for better query performance
PartnerSchema.index({ userId: 1 });
PartnerSchema.index({ status: 1 });
PartnerSchema.index({ 'partnershipInfo.partnershipType': 1 });

// Virtual for full partner name
PartnerSchema.virtual('fullPartnerName').get(function() {
  return `${this.generalManagerDetails.title} ${this.generalManagerDetails.fullName}`;
});

// Virtual for formatted mobile number
PartnerSchema.virtual('formattedMobileNumber').get(function() {
  const mobile = this.generalManagerDetails.mobileNumber;
  if (mobile && !mobile.startsWith('+')) {
    return `+${mobile}`;
  }
  return mobile;
});

// Method to get partner summary
PartnerSchema.methods.getSummary = function() {
  return {
    id: this._id,
    legalEntityName: this.partnerInfo.legalEntityName,
    partnershipType: this.partnershipInfo.partnershipType,
    generalManager: this.fullPartnerName,
    email: this.generalManagerDetails.email,
    mobile: this.formattedMobileNumber,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static method to find partners by status
PartnerSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('userId', 'fullName email role');
};

// Static method to find partners by partnership type
PartnerSchema.statics.findByPartnershipType = function(partnershipType) {
  return this.find({ 'partnershipInfo.partnershipType': partnershipType }).populate('userId', 'fullName email role');
};

PartnerSchema.set('toJSON', { virtuals: true });
PartnerSchema.set('toObject', { virtuals: true });

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
