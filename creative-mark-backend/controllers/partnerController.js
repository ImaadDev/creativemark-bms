import Partner from "../models/Partner.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/partners';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow image files for profile pictures and document files for other uploads
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.fieldname === 'profilePicture') {
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid image file type. Only JPG, PNG, and GIF files are allowed for profile pictures.'), false);
      }
    } else {
      if (allowedDocTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid document file type. Only PDF, DOC, and DOCX files are allowed.'), false);
      }
    }
  }
});



export const createPartner = async (req, res) => {
  try {
    console.log("=== PARTNER CREATION REQUEST ===");
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Request files:", req.files);
    console.log("================================");

    const {
      fullName,
      email,
      password,
      phone,
      nationality,
      address,

      partnershipType,
      clientEngagementManager,
      ifzaContactPerson,

      legalEntityName,
      legalFormOfEntity,
      businessAddress,

      title,
      gmFullName,
      gmDateOfBirth,
      countryOfBirth,
      gmNationality,
      passportNumber,
      passportCountryOfIssue,
      gender,
      gmEmail,
      gmMobileNumber,

      incorporationDocumentsEmail,
      billingAddress,
      officeAddress,
      buildingName,
      city,
      streetDistrict,
      postalZipCode,
      country,

      bankName,
      beneficiaryAccountName,
      bankAccountNumber,
      iban,
      swiftCode,
      bankStreetAddress,
      bankCity,
      accountsContactPerson,
      trn,

      partnerId,
      partnerType,
      contractStartDate,
      contractEndDate,
      commissionRate,
      specializations,
      serviceAreas,
      languages,
      availability
    } = req.body;

    // === Basic validation ===
    if (!fullName || !email || !password)
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });

    // Generate unique partner ID if not provided
    const finalPartnerId = partnerId || (await User.generateUniqueId("partner"));

    // Parse JSON arrays
    const parseArray = (field) => {
      if (!field) return [];
      return typeof field === "string" ? JSON.parse(field) : field;
    };
    const parsedSpecializations = parseArray(specializations);
    const parsedServiceAreas = parseArray(serviceAreas);
    const parsedLanguages = parseArray(languages);

    // === Create User ===
    const user = new User({
      fullName,
      email,
      passwordHash: password,
      phone,
      nationality,
      address: {
        street: address,
        city,
        country,
      },
      profilePicture: req.files?.profilePicture?.[0]?.path || null,
      role: "partner",
      partnerDetails: {
        partnerId: finalPartnerId,
        partnerType: partnerType || "consultant",
        companyName: legalEntityName,
        contractStartDate: contractStartDate ? new Date(contractStartDate) : null,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
        commissionRate: commissionRate ? parseFloat(commissionRate) : null,
        specializations: parsedSpecializations,
        serviceAreas: parsedServiceAreas,
        languages: parsedLanguages,
        availability: availability || "available",
      },
    });
    await user.save();

    // === Create Partner ===
    const partner = new Partner({
      userId: user._id,
      partnershipInfo: {
        partnershipType,
        clientEngagementManager,
        ifzaContactPerson,
      },
      partnerInfo: {
        legalEntityName,
        legalFormOfEntity,
        businessAddress,
      },
      generalManagerDetails: {
        title,
        fullName: gmFullName,
        dateOfBirth: gmDateOfBirth ? new Date(gmDateOfBirth) : null,
        countryOfBirth,
        nationality: gmNationality,
        passportNumber,
        passportCountryOfIssue,
        gender,
        email: gmEmail,
        mobileNumber: gmMobileNumber,
      },
      incorporationDetails: {
        incorporationDocumentsEmail,
        billingAddress,
        officeAddress,
        buildingName,
        city,
        streetDistrict,
        postalZipCode,
        country,
      },
      bankingDetails: {
        bankName,
        beneficiaryAccountName,
        bankAccountNumber,
        iban,
        swiftCode,
        bankStreetAddress,
        bankCity,
        accountsContactPerson,
        trn,
      },
      requiredDocuments: {
        companyRegistrationTradeLicense: req.files?.companyRegistrationTradeLicense?.[0]?.path || "pending",
        generalManagerDirectorPassport: req.files?.generalManagerDirectorPassport?.[0]?.path || "pending",
        vatCertificate: req.files?.vatCertificate?.[0]?.path || "pending",
      },
    });
    await partner.save();

    const populatedPartner = await Partner.findById(partner._id).populate("userId", "fullName email role");

    res.status(201).json({
      success: true,
      message: "Partner created successfully",
      data: {
        user,
        partner: populatedPartner,
      },
    });
  } catch (error) {
    console.error("Error creating partner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create partner",
      error: error.message,
    });
  }
};



// Get all partners
export const getAllPartners = async (req, res) => {
  try {
    const { status, partnershipType, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (partnershipType) query['partnershipInfo.partnershipType'] = partnershipType;

    const partners = await Partner.find(query)
      .populate('userId', 'fullName email phone role isActive')
      .populate('reviewedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Partner.countDocuments(query);

    res.json({
      success: true,
      data: partners,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
      error: error.message
    });
  }
};

// Get partner by ID
export const getPartnerById = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findById(partnerId)
      .populate('userId', 'fullName email phone role isActive')
      .populate('reviewedBy', 'fullName');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    res.json({
      success: true,
      data: partner
    });

  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partner",
      error: error.message
    });
  }
};

// Update partner
export const updatePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const updateData = req.body;

    // Handle file uploads if present
    if (req.files) {
      if (req.files.companyRegistrationTradeLicense) {
        updateData['requiredDocuments.companyRegistrationTradeLicense'] = req.files.companyRegistrationTradeLicense[0].path;
      }
      if (req.files.generalManagerDirectorPassport) {
        updateData['requiredDocuments.generalManagerDirectorPassport'] = req.files.generalManagerDirectorPassport[0].path;
      }
      if (req.files.vatCertificate) {
        updateData['requiredDocuments.vatCertificate'] = req.files.vatCertificate[0].path;
      }
    }

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email phone role isActive');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    res.json({
      success: true,
      message: "Partner updated successfully",
      data: partner
    });

  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update partner",
      error: error.message
    });
  }
};

// Delete partner
export const deletePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    // Delete associated user
    await User.findByIdAndDelete(partner.userId);

    // Delete partner
    await Partner.findByIdAndDelete(partnerId);

    res.json({
      success: true,
      message: "Partner deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({
      success: false,
      message: "Failed to delete partner",
      error: error.message
    });
  }
};

// Approve partner
export const approvePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { reviewNotes } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      {
        status: 'approved',
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
        reviewNotes
      },
      { new: true }
    ).populate('userId', 'fullName email phone role isActive');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    res.json({
      success: true,
      message: "Partner approved successfully",
      data: partner
    });

  } catch (error) {
    console.error('Error approving partner:', error);
    res.status(500).json({
      success: false,
      message: "Failed to approve partner",
      error: error.message
    });
  }
};

// Reject partner
export const rejectPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { reviewNotes } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      {
        status: 'rejected',
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
        reviewNotes
      },
      { new: true }
    ).populate('userId', 'fullName email phone role isActive');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    res.json({
      success: true,
      message: "Partner rejected successfully",
      data: partner
    });

  } catch (error) {
    console.error('Error rejecting partner:', error);
    res.status(500).json({
      success: false,
      message: "Failed to reject partner",
      error: error.message
    });
  }
};

// Suspend partner
export const suspendPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { reviewNotes } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      {
        status: 'suspended',
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
        reviewNotes
      },
      { new: true }
    ).populate('userId', 'fullName email phone role isActive');

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    res.json({
      success: true,
      message: "Partner suspended successfully",
      data: partner
    });

  } catch (error) {
    console.error('Error suspending partner:', error);
    res.status(500).json({
      success: false,
      message: "Failed to suspend partner",
      error: error.message
    });
  }
};

// Partner Dashboard Stats
export const getPartnerDashboardStats = async (req, res) => {
  try {
    const partnerId = req.user.id;
    
    const partner = await Partner.findOne({ userId: partnerId });
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    // Get partner's applications
    const applications = await Application.find({ partnerId: partner._id });
    
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      approvedApplications: applications.filter(app => app.status === 'approved').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
      partnerStatus: partner.status,
      partnershipType: partner.partnershipInfo.partnershipType,
      legalEntityName: partner.partnerInfo.legalEntityName
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching partner dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partner dashboard stats",
      error: error.message
    });
  }
};

// Get partner applications
export const getPartnerApplications = async (req, res) => {
  try {
    const partnerId = req.user.id;
    
    const partner = await Partner.findOne({ userId: partnerId });
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    const applications = await Application.find({ partnerId: partner._id })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching partner applications:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partner applications",
      error: error.message
    });
  }
};

// Get partner recent activities
export const getPartnerRecentActivities = async (req, res) => {
  try {
    const partnerId = req.user.id;
    
    const partner = await Partner.findOne({ userId: partnerId });
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    // Get recent applications and activities
    const recentApplications = await Application.find({ partnerId: partner._id })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = recentApplications.map(app => ({
      id: app._id,
      type: 'application',
      title: `Application ${app.applicationId}`,
      description: `Application submitted by ${app.userId.fullName}`,
      timestamp: app.createdAt,
      status: app.status
    }));

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {
    console.error('Error fetching partner activities:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partner activities",
      error: error.message
    });
  }
};

// Get partner performance
export const getPartnerPerformance = async (req, res) => {
  try {
    const partnerId = req.user.id;
    
    const partner = await Partner.findOne({ userId: partnerId });
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    const applications = await Application.find({ partnerId: partner._id });
    
    const performance = {
      totalApplications: applications.length,
      successRate: applications.length > 0 ? 
        (applications.filter(app => app.status === 'approved').length / applications.length) * 100 : 0,
      averageProcessingTime: 0, // Calculate based on your business logic
      monthlyApplications: [], // Calculate based on your business logic
      partnerRating: 4.5 // Calculate based on your business logic
    };

    res.json({
      success: true,
      data: performance
    });

  } catch (error) {
    console.error('Error fetching partner performance:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partner performance",
      error: error.message
    });
  }
};

// Get partner notifications
export const getPartnerNotifications = async (req, res) => {
  try {
    const partnerId = req.user.id;
    
    const partner = await Partner.findOne({ userId: partnerId });
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found"
      });
    }

    // Mock notifications - implement based on your notification system
    const notifications = [
      {
        id: 1,
        type: 'status_update',
        title: 'Application Status Updated',
        message: 'Your application has been approved',
        timestamp: new Date(),
        read: false
      }
    ];

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error('Error fetching partner notifications:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch partner notifications",
      error: error.message
    });
  }
};

// Export multer middleware for file uploads
export { upload };
