"use client";

import { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Check, Upload, X, Plus, Building2, Users, FileText, CreditCard, Eye, Shield } from "lucide-react";
import { createApplication } from "../../../services/applicationService";
import AuthContext from "../../../contexts/AuthContext";
import RequirementsModal from "../../../components/client/RequirementsModal";
import { getCurrentUser } from "../../../services/auth";

export default function ModernMultiStepForm() {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [showRequirementsModal, setShowRequirementsModal] = useState(true);
  const [requirementsAccepted, setRequirementsAccepted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    residencyStatus: "",
    externalCompaniesCount: 0,
    externalCompaniesDetails: [],
    serviceType: "",
    partnerType: "sole",
    partnerId: "",
    saudiPartnerName: "",
    saudiPartnerIqama: null,
    projectEstimatedValue: "",
    familyMembers: [],
    needVirtualOffice: false,
    uploadedFiles: {},
    passportFile: null,
    docOption: "uploadDocs",
    companyArrangesExternalCompanies: false,
    status: "submitted",
    approvedBy: "",
    approvedAt: "",
    assignedEmployees: []
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Current user:", user.data);
        setCurrentUser(user.data);
        
        // Update form with user data
        if (user.data) {
          setForm(prev => ({
            ...prev,
            fullName: user.data.fullName || prev.fullName,
            email: user.data.email || prev.email,
            phone: user.data.phone || prev.phone,
            nationality: user.data.nationality || prev.nationality,
            residencyStatus: user.data.residencyStatus || prev.residencyStatus
          }));
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);


  function getRequirements() {
    const svc = form.serviceType;
    const partnerType = form.partnerType;

    if (svc === "engineering") {
      return {
        requiredExternalCompanies: 4,
        note: "Engineering consulting requires 4 external companies: 3 with CR + FS + 1 year operation, and 1 with CR + 10 years experience."
      };
    }
    if (svc === "commercial" || svc === "trade") {
      if (partnerType === "sole") {
        return {
          requiredExternalCompanies: 3,
          note: "Commercial (sole partner) requires 3 external companies from 3 different countries."
        };
      }
      return {
        requiredExternalCompanies: 1,
        note: "Commercial with a Saudi partner requires 1 external company (Saudi partner counts as two)."
      };
    }
    if (svc === "real_estate") {
      return {
        requiredExternalCompanies: 1,
        note: "Real estate development requires an external company and the first project value must be at least 300,000,000 SAR."
      };
    }
    if (svc === "industrial" || svc === "agricultural" || svc === "service") {
      return {
        requiredExternalCompanies: 1,
        note: "Industrial/agricultural/service activities require 1 external company with 1 year of operation and financial statements."
      };
    }
    if (svc === "advertising") {
      return {
        requiredExternalCompanies: 0,
        note: "Advertising & promotions requires owning 50% share in an advertising company in your home country (renewed every 3 years)."
      };
    }
    return { requiredExternalCompanies: 0, note: "No special external-company rules for the selected service." };
  }

  const requirements = getRequirements();

  // Enhanced validation functions
  const validateField = (name, value, formData = form) => {
    let error = "";
    
    switch (name) {
      case "fullName":
        if (!value?.trim()) error = "Full name is required";
        else if (value.trim().length < 2) error = "Full name must be at least 2 characters";
        break;
      case "email":
        if (!value?.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value?.trim()) error = "Phone number is required";
        else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ""))) {
          error = "Please enter a valid phone number";
        }
        break;
      case "nationality":
        if (!value?.trim()) error = "Nationality is required";
        break;
      case "residencyStatus":
        if (!value?.trim()) error = "Residency status is required";
        break;
      case "serviceType":
        if (!value) error = "Service type is required";
        break;
      case "saudiPartnerName":
        if (formData.partnerType === "withSaudiPartner" && !value?.trim()) {
          error = "Saudi partner name is required when partner type is 'with Saudi partner'";
        }
        break;
      case "saudiPartnerIqama":
        if (formData.partnerType === "withSaudiPartner" && !value) {
          error = "Saudi partner Iqama/ID card is required when partner type is 'with Saudi partner'";
        }
        break;
      case "projectEstimatedValue":
        if (formData.serviceType === "real_estate") {
          if (!value || isNaN(parseFloat(value))) {
            error = "Project estimated value is required for real estate";
          } else if (parseFloat(value) < 300000000) {
            error = "Minimum project value for real estate is 300,000,000 SAR";
          }
        } else if (value && isNaN(parseFloat(value))) {
          error = "Project estimated value must be a valid number";
        } else if (value && parseFloat(value) < 0) {
          error = "Project estimated value cannot be negative";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 1:
        // Only validate phone if name and email are already filled from profile
        if (form.fullName && form.email) {
          const phoneError = validateField("phone", form.phone);
          if (phoneError) newErrors.phone = phoneError;
        } else {
          // Validate all fields if not pre-filled
          ["fullName", "email", "phone"].forEach(field => {
            const error = validateField(field, form[field]);
            if (error) newErrors[field] = error;
          });
        }
        break;
      case 2:
        // Only validate if fields are not pre-filled from profile
        if (!form.nationality) {
          const nationalityError = validateField("nationality", form.nationality);
          if (nationalityError) newErrors.nationality = nationalityError;
        }
        if (!form.residencyStatus) {
          const residencyError = validateField("residencyStatus", form.residencyStatus);
          if (residencyError) newErrors.residencyStatus = residencyError;
        }
        break;
      case 3:
        const serviceError = validateField("serviceType", form.serviceType);
        if (serviceError) newErrors.serviceType = serviceError;
        
        if (form.serviceType === "real_estate") {
          const projectError = validateField("projectEstimatedValue", form.projectEstimatedValue);
          if (projectError) newErrors.projectEstimatedValue = projectError;
        }
        break;
      case 4:
        if (form.serviceType === "commercial" && form.partnerType === "withSaudiPartner") {
          const partnerNameError = validateField("saudiPartnerName", form.saudiPartnerName);
          if (partnerNameError) newErrors.saudiPartnerName = partnerNameError;
          
          const partnerIqamaError = validateField("saudiPartnerIqama", form.saudiPartnerIqama);
          if (partnerIqamaError) newErrors.saudiPartnerIqama = partnerIqamaError;
        }
        break;
      case 5:
        // External companies validation - allow 0 companies, we'll arrange them
        // Only validate company details if user has provided companies
        if (form.externalCompaniesCount > 0) {
          for (let i = 0; i < form.externalCompaniesDetails.length; i++) {
            const company = form.externalCompaniesDetails[i];
            if (!company) {
              newErrors[`company_${i}_missing`] = "Company details are required";
              continue;
            }
            if (!company.companyName?.trim()) {
              newErrors[`company_${i}_name`] = "Company name is required";
            }
            if (!company.country?.trim()) {
              newErrors[`company_${i}_country`] = "Country is required";
            }
            if (!company.crNumber?.trim()) {
              newErrors[`company_${i}_crNumber`] = "CR Number is required";
            }
          }
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const newValue = type === "checkbox" ? checked : 
                    name === "externalCompaniesCount" ? parseInt(value) || 0 :
                    value;
    
    setForm(prev => ({ ...prev, [name]: newValue }));
    
    // Real-time validation
    const error = validateField(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Auto-generate company slots when count changes
    if (name === "externalCompaniesCount") {
      const count = parseInt(value) || 0;
      setForm(prev => ({
        ...prev,
        externalCompaniesDetails: Array.from({ length: count }, (_, i) => 
          prev.externalCompaniesDetails[i] || {
            companyName: "",
            country: "",
            crNumber: "",
            sharePercentage: 0
          }
        )
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }

  const getInputClassName = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    const baseClasses = "w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 placeholder-gray-400 text-gray-900 font-medium shadow-sm hover:shadow-md focus:shadow-lg";
    
    if (hasError) {
      return `${baseClasses} border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100/50`;
    }
    return `${baseClasses} border-gray-200/50 bg-white/80 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 backdrop-blur-sm`;
  };

  const renderErrorMessage = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
          <X className="w-4 h-4" />
          {errors[fieldName]}
        </div>
      );
    }
    return null;
  };

  // File handling functions
  function handleFileChange(e) {
    const { name, files } = e.target;
    setForm(prev => ({ ...prev, uploadedFiles: { ...prev.uploadedFiles, [name]: files } }));
  }

  function handlePassportChange(e) {
    setForm(prev => ({ ...prev, passportFile: e.target.files?.[0] || null }));
  }

  function handleSaudiPartnerIqamaChange(e) {
    setForm(prev => ({ ...prev, saudiPartnerIqama: e.target.files?.[0] || null }));
  }

  // Dynamic field management
  function addFamilyMember() {
    setForm(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: "", relation: "spouse", passportNo: "" }]
    }));
  }

  function removeFamilyMember(index) {
    setForm(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  }

  function updateFamilyMember(index, field, value) {
    setForm(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  }

  function updateExternalCompany(index, field, value) {
    setForm(prev => ({
      ...prev,
      externalCompaniesDetails: prev.externalCompaniesDetails.map((company, i) => 
        i === index ? { ...company, [field]: value } : company
      )
    }));
    
    const errorKey = `company_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep(s => s + 1);
    } else {
      // Mark fields as touched to show errors
      const fieldsToTouch = {};
      switch (step) {
        case 1:
          // Only mark phone as touched if name and email are pre-filled
          if (form.fullName && form.email) {
            fieldsToTouch.phone = true;
          } else {
            ["fullName", "email", "phone"].forEach(field => fieldsToTouch[field] = true);
          }
          break;
        case 2:
          // Only mark fields as touched if they're not pre-filled
          if (!form.nationality) fieldsToTouch.nationality = true;
          if (!form.residencyStatus) fieldsToTouch.residencyStatus = true;
          break;
        case 3:
          fieldsToTouch.serviceType = true;
          if (form.serviceType === "real_estate") fieldsToTouch.projectEstimatedValue = true;
          break;
        case 4:
          if (form.serviceType === "commercial" && form.partnerType === "withSaudiPartner") {
            fieldsToTouch.saudiPartnerName = true;
            fieldsToTouch.saudiPartnerIqama = true;
          }
          break;
        case 5:
          fieldsToTouch.externalCompaniesCount = true;
          break;
      }
      setTouched(prev => ({ ...prev, ...fieldsToTouch }));
    }
  }

  function prevStep() {
    setStep(s => Math.max(1, s - 1));
  }

  async function submitForm() {
    if (!user || !user.id) {
      setSubmitError("User not authenticated. Please log in again.");
      return;
    }

    // Validate required fields before submission
    const validationErrors = {};
    
    // Check serviceType
    if (!form.serviceType || form.serviceType.trim() === "") {
      validationErrors.serviceType = "Service type is required";
    }
    
    // Check partner type validation
    if (form.partnerType === "withSaudiPartner" && (!form.saudiPartnerName || form.saudiPartnerName.trim() === "")) {
      validationErrors.saudiPartnerName = "Saudi partner name is required when partner type is 'with Saudi partner'";
    }
    
    // If there are validation errors, show them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("Please fix the validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Prepare application data for backend
      console.log("Current user:", user);
      console.log("User will be authenticated via middleware - not sending userId in body");
      const applicationData = {
        // userId removed - will be taken from authenticated user in middleware
        serviceType: form.serviceType?.trim(), // Ensure no whitespace
        partnerType: form.partnerType || "sole",
        partnerId: form.partnerId || null,
        saudiPartnerName: form.saudiPartnerName?.trim() || null,
        externalCompaniesCount: parseInt(form.externalCompaniesCount) || 0,
        externalCompaniesDetails: form.externalCompaniesDetails || [],
        projectEstimatedValue: form.projectEstimatedValue ? parseFloat(form.projectEstimatedValue) : null,
        familyMembers: form.familyMembers || [],
        needVirtualOffice: Boolean(form.needVirtualOffice),
        companyArrangesExternalCompanies: Boolean(form.companyArrangesExternalCompanies),
        // Additional fields from backend
        status: "submitted", // Always set to submitted for new applications
        approvedBy: null, // Never set for client submissions
        approvedAt: null, // Never set for client submissions
        assignedEmployees: [] // Never set for client submissions
      };

      // Final validation before sending
      if (!applicationData.serviceType) {
        throw new Error("Service type is required");
      }

      console.log("Submitting application:", applicationData);
      console.log("User ID:", user.id);
      console.log("Service Type:", applicationData.serviceType);
      console.log("Partner Type:", applicationData.partnerType);

      // Prepare files for upload
      const filesToUpload = {};
      
      // Add passport file if available
      if (form.passportFile) {
        filesToUpload.passport = [form.passportFile];
      }

      // Add ID card file if available
      if (form.uploadedFiles.idCard && form.uploadedFiles.idCard.length > 0) {
        filesToUpload.idCard = Array.from(form.uploadedFiles.idCard);
      }

      // Add Saudi partner Iqama file if available
      if (form.saudiPartnerIqama) {
        filesToUpload.saudiPartnerIqama = [form.saudiPartnerIqama];
      }

      // Add commercial registration files if user chose to upload docs
      if (form.docOption === "uploadDocs" && form.uploadedFiles) {
        Object.keys(form.uploadedFiles).forEach(key => {
          if (key.startsWith('cr_')) {
            // Commercial Registration documents
            if (form.uploadedFiles[key] && form.uploadedFiles[key].length > 0) {
              filesToUpload.commercial_registration = filesToUpload.commercial_registration || [];
              filesToUpload.commercial_registration.push(...Array.from(form.uploadedFiles[key]));
            }
          } else if (key.startsWith('fs_')) {
            // Financial Statement documents
            if (form.uploadedFiles[key] && form.uploadedFiles[key].length > 0) {
              filesToUpload.financial_statement = filesToUpload.financial_statement || [];
              filesToUpload.financial_statement.push(...Array.from(form.uploadedFiles[key]));
            }
          } else if (key.startsWith('aoa_')) {
            // Articles of Association documents
            if (form.uploadedFiles[key] && form.uploadedFiles[key].length > 0) {
              filesToUpload.articles_of_association = filesToUpload.articles_of_association || [];
              filesToUpload.articles_of_association.push(...Array.from(form.uploadedFiles[key]));
            }
          }
        });
      }

      console.log("Files to upload:", filesToUpload);

      // Call the backend API
      const response = await createApplication(applicationData, filesToUpload);
      
      console.log("Application submitted successfully:", response);
      setApplicationId(response.data?.applicationId);
      setSubmitted(true);
      
      // Redirect to client dashboard after successful submission
      setTimeout(() => {
        window.location.href = '/client/track-application';
      }, 3000);

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const steps = [
    { id: 1, title: "Personal Info", icon: Users },
    { id: 2, title: "Background", icon: FileText },
    { id: 3, title: "Service Type", icon: Building2 },
    { id: 4, title: "Partnerships", icon: Users },
    { id: 5, title: "Companies", icon: Building2 },
    { id: 6, title: "Family", icon: Users },
    { id: 7, title: "Documents", icon: Upload },
    { id: 8, title: "Payment", icon: CreditCard },
    { id: 9, title: "Review", icon: Eye }
  ];

  // Handle requirements modal acceptance
  const handleRequirementsAccept = () => {
    console.log('Requirements accepted, closing modal');
    setRequirementsAccepted(true);
    setShowRequirementsModal(false);
  };

  const handleRequirementsClose = () => {
    setShowRequirementsModal(false);
    // Optionally redirect back to client dashboard
    window.location.href = '/client';
  };

  // Show requirements modal first
  if (showRequirementsModal) {
    console.log('Showing requirements modal');
    return (
      <RequirementsModal
        isOpen={showRequirementsModal}
        onClose={handleRequirementsClose}
        onAccept={handleRequirementsAccept}
        showTriggerButton={false}
      />
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been submitted successfully. You will receive updates via email.
          </p>
          {applicationId && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-blue-900">
                Application ID: <span className="font-mono">{applicationId}</span>
              </p>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Submit New Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
    

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Ultra Modern Progress Steps */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Step {step} of {steps.length}</h2>
              <p className="text-gray-600 font-medium">{steps[step - 1]?.title}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                {Math.round((step / steps.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600 font-medium">Complete</p>
            </div>
          </div>
          
          {/* Ultra Modern Progress Bar */}
          <div className="w-full bg-gray-200/50 rounded-full h-3 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>

          {/* Ultra Modern Step Icons */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-6">
            {steps.map((stepItem) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.id;
              const isCompleted = step > stepItem.id;
              
              return (
                <div key={stepItem.id} className="flex flex-col items-center group">
                  <div className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:scale-105
                    ${isActive 
                      ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white shadow-2xl scale-110 ring-4 ring-emerald-200' 
                      : isCompleted 
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg' 
                      : 'bg-white/60 border-2 border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-500'
                    }
                  `}>
                    {isCompleted ? <Check className="w-6 h-6 sm:w-7 sm:h-7" /> : <Icon className="w-6 h-6 sm:w-7 sm:h-7" />}
                  </div>
                  <span className={`mt-3 text-xs sm:text-sm font-semibold text-center transition-colors duration-300 ${
                    isActive ? 'text-emerald-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-500'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ultra Modern Form Container */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 sm:p-12">
            
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 mb-6 shadow-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-4">
                    Personal Information
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Let's start with your basic details to create your business profile
                  </p>
                  
                  {/* Show pre-filled data notification */}
                  {(form.fullName || form.email) && (
                    <div className="mt-6 max-w-md mx-auto">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-800">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-sm">Profile Data Loaded</span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          Your name and email have been automatically filled from your profile. Name and email are locked, but you can update your phone number, nationality, and residency status.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Full Name *
                      {form.fullName && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          From Profile
                        </span>
                      )}
                    </label>
                    <input 
                      name="fullName" 
                      value={form.fullName} 
                      readOnly
                      placeholder="Enter your full legal name" 
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium shadow-sm cursor-not-allowed" 
                    />
                    {form.fullName && (
                      <p className="text-xs text-gray-500 mt-1">This field is locked and cannot be changed</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Email Address *
                      {form.email && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          From Profile
                        </span>
                      )}
                    </label>
                    <input 
                      name="email" 
                      type="email"
                      value={form.email} 
                      readOnly
                      placeholder="your.email@example.com" 
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium shadow-sm cursor-not-allowed" 
                    />
                    {form.email && (
                      <p className="text-xs text-gray-500 mt-1">This field is locked and cannot be changed</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Phone Number *
                      {form.phone && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          From Profile (Editable)
                        </span>
                      )}
                    </label>
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="+966 50 123 4567" 
                      className={getInputClassName("phone")} 
                    />
                    {renderErrorMessage("phone")}
                    {form.phone && (
                      <p className="text-xs text-blue-600 mt-1">You can update your phone number if needed</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Background Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Background Information</h2>
                  <p className="text-gray-600">Tell us about your background and requirements</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Nationality *
                      {form.nationality && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          From Profile (Editable)
                        </span>
                      )}
                    </label>
                    <input 
                      name="nationality" 
                      value={form.nationality} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., American, British, Indian" 
                      className={getInputClassName("nationality")} 
                    />
                    {renderErrorMessage("nationality")}
                    {form.nationality && (
                      <p className="text-xs text-blue-600 mt-1">You can update your nationality if needed</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Residency Status *
                      {form.residencyStatus && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          From Profile (Editable)
                        </span>
                      )}
                    </label>
                    <select 
                      name="residencyStatus" 
                      value={form.residencyStatus} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClassName("residencyStatus")}
                    >
                      <option value="">Select your residency status</option>
                      <option value="saudi">Saudi National</option>
                      <option value="gulf">Gulf National</option>
                      <option value="premium">Premium Residency</option>
                      <option value="foreign">Foreign National</option>
                    </select>
                    {renderErrorMessage("residencyStatus")}
                    {form.residencyStatus && (
                      <p className="text-xs text-blue-600 mt-1">You can update your residency status if needed</p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="needVirtualOffice" 
                        checked={form.needVirtualOffice} 
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" 
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Virtual Office Service</span>
                        <p className="text-sm text-gray-600 mt-1">I prefer a virtual office instead of physical space</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Service Selection */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Service Selection</h2>
                  <p className="text-gray-600">Choose the type of business service you need</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type *</label>
                    <select 
                      name="serviceType" 
                      value={form.serviceType} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClassName("serviceType")}
                    >
                      <option value="">Select your business service</option>
                      <option value="commercial">Commercial Activity</option>
                      <option value="engineering">Engineering Consulting Office</option>
                      <option value="real_estate">Real Estate Development</option>
                      <option value="industrial">Industrial Activity</option>
                      <option value="agricultural">Agricultural Activity</option>
                      <option value="service">Service Activity</option>
                      <option value="advertising">Advertising & Promotions</option>
                    </select>
                    {renderErrorMessage("serviceType")}
                  </div>

                  {form.serviceType === "commercial" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Partnership Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                          <input 
                            type="radio"
                            name="partnerType" 
                            value="sole"
                            checked={form.partnerType === "sole"}
                            onChange={handleChange} 
                            className="text-emerald-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">Sole Partner</div>
                            <div className="text-sm text-gray-600">No Saudi partner</div>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                          <input 
                            type="radio"
                            name="partnerType" 
                            value="withSaudiPartner"
                            checked={form.partnerType === "withSaudiPartner"}
                            onChange={handleChange} 
                            className="text-emerald-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">With Saudi Partner</div>
                            <div className="text-sm text-gray-600">Partnership required</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {form.serviceType === "real_estate" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Project Value (SAR) *</label>
                      <input 
                        name="projectEstimatedValue" 
                        type="number"
                        value={form.projectEstimatedValue} 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Minimum: 300,000,000 SAR" 
                        className={getInputClassName("projectEstimatedValue")} 
                      />
                      {renderErrorMessage("projectEstimatedValue")}
                      <p className="text-sm text-gray-600 mt-2">Real estate projects require a minimum value of 300 million SAR</p>
                    </div>
                  )}

                  {form.serviceType && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h3 className="font-semibold text-emerald-900 mb-2">Requirements Summary</h3>
                    <p className="text-sm text-emerald-800">{requirements.note}</p>
                  </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Partnership Details */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Partnership Details</h2>
                  <p className="text-gray-600">Configure your business partnerships</p>
                </div>

                <div className="space-y-6">
                  {form.serviceType === "commercial" && form.partnerType === "withSaudiPartner" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Saudi Partner Name *</label>
                        <input 
                          name="saudiPartnerName" 
                          value={form.saudiPartnerName} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your Saudi partner's full name" 
                          className={getInputClassName("saudiPartnerName")} 
                        />
                        {renderErrorMessage("saudiPartnerName")}
                        <p className="text-sm text-gray-600 mt-2">Enter the full legal name of your Saudi business partner</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Saudi Partner Iqama/ID Card *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                          <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-3">Upload your Saudi partner's Iqama or National ID card</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleSaudiPartnerIqamaChange}
                            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                          />
                          {form.saudiPartnerIqama && (
                            <p className="text-sm text-green-600 mt-2 font-medium">
                              ✓ File selected: {form.saudiPartnerIqama.name}
                            </p>
                          )}
                        </div>
                        {renderErrorMessage("saudiPartnerIqama")}
                        <p className="text-sm text-gray-600 mt-2">Upload a clear copy of your Saudi partner's Iqama or National ID card</p>
                      </div>
                    </div>
                  )}

                  {form.serviceType && form.serviceType !== "commercial" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h3 className="font-semibold text-yellow-900 mb-2">No Partnership Required</h3>
                      <p className="text-sm text-yellow-800">
                        Your selected service type does not require a Saudi partner. You can proceed to the next step.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: External Companies */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">External Companies</h2>
                  <p className="text-gray-600">Manage your external company details</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of External Companies</label>
                    <input 
                      name="externalCompaniesCount" 
                      type="number" 
                      min="0" 
                      max="10" 
                      value={form.externalCompaniesCount} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClassName("externalCompaniesCount")} 
                      placeholder="Enter number of companies"
                    />
                    {renderErrorMessage("externalCompaniesCount")}
                    <p className="text-sm text-gray-600 mt-2">Companies you own outside Saudi Arabia</p>
                  </div>

                  {requirements.requiredExternalCompanies > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Requirements</h3>
                      <p className="text-sm text-blue-800 mb-2">
                        Your service requires {requirements.requiredExternalCompanies} external companies.
                      </p>
                      <p className="text-sm text-blue-700 mb-3">{requirements.note}</p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800 font-medium">
                          💡 Don't have external companies? No problem! We can arrange them for you.
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Simply enter 0 companies and we'll handle the rest.
                        </p>
                        <div className="mt-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="companyArrangesExternalCompanies"
                              checked={form.companyArrangesExternalCompanies}
                              onChange={handleChange}
                              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <span className="text-sm text-green-800 font-medium">
                              I want Creative Mark to arrange the required external companies for me
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* External Companies Details */}
                  {form.externalCompaniesDetails.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
                      
                      {form.externalCompaniesDetails.map((company, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">Company #{index + 1}</h4>
                            <span className="text-sm text-gray-600">Required</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                              <input 
                                value={company.companyName} 
                                onChange={(e) => updateExternalCompany(index, 'companyName', e.target.value)}
                                placeholder="Enter company name"
                                className={errors[`company_${index}_name`] ? 
                                  "w-full px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 focus:border-red-500 text-sm" : 
                                  "w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 text-sm"
                                } 
                              />
                              {errors[`company_${index}_name`] && (
                                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                  <X className="w-4 h-4" />
                                  {errors[`company_${index}_name`]}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                              <input 
                                value={company.country} 
                                onChange={(e) => updateExternalCompany(index, 'country', e.target.value)}
                                placeholder="Enter country"
                                className={errors[`company_${index}_country`] ? 
                                  "w-full px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 focus:border-red-500 text-sm" : 
                                  "w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 text-sm"
                                } 
                              />
                              {errors[`company_${index}_country`] && (
                                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                  <X className="w-4 h-4" />
                                  {errors[`company_${index}_country`]}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">CR Number *</label>
                              <input 
                                value={company.crNumber} 
                                onChange={(e) => updateExternalCompany(index, 'crNumber', e.target.value)}
                                placeholder="Commercial registration number"
                                className={errors[`company_${index}_crNumber`] ? 
                                  "w-full px-3 py-2 rounded-lg border-2 border-red-300 bg-red-50 focus:border-red-500 text-sm" : 
                                  "w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 text-sm"
                                } 
                              />
                              {errors[`company_${index}_crNumber`] && (
                                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                  <X className="w-4 h-4" />
                                  {errors[`company_${index}_crNumber`]}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Your Share (%)</label>
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={company.sharePercentage} 
                                onChange={(e) => updateExternalCompany(index, 'sharePercentage', parseFloat(e.target.value) || 0)}
                                placeholder="Ownership percentage"
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {form.externalCompaniesCount === 0 && (
                    <div className="text-center py-8">
                      <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600 mb-2">No external companies to configure</p>
                      {requirements.requiredExternalCompanies > 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-sm text-green-800 font-medium mb-2">
                            ✅ We'll arrange the required {requirements.requiredExternalCompanies} companies for you
                          </p>
                          <p className="text-sm text-green-700">
                            You can proceed to the next step. Our team will handle the external company requirements.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">You can proceed to the next step</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Family Members */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Family Members</h2>
                  <p className="text-gray-600">Add family members who will need residency</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
                    <button
                      type="button"
                      onClick={addFamilyMember}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Member
                    </button>
                  </div>
                  
                  {form.familyMembers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No family members added</p>
                      <p className="text-sm">Click "Add Member" to include family members who need residency</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.familyMembers.map((member, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Family Member #{index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(index)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              <X className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                              <input 
                                value={member.name} 
                                onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                                placeholder="Enter full name"
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 text-sm" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                              <select 
                                value={member.relation} 
                                onChange={(e) => updateFamilyMember(index, 'relation', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 text-sm"
                              >
                                <option value="spouse">Spouse</option>
                                <option value="child">Child</option>
                                <option value="parent">Parent</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                              <input 
                                value={member.passportNo} 
                                onChange={(e) => updateFamilyMember(index, 'passportNo', e.target.value)}
                                placeholder="Enter passport number"
                                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Document Upload */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Document Upload</h2>
                  <p className="text-gray-600">Upload required documents for your application</p>
                </div>

                <div className="space-y-6">
                  {requirements.requiredExternalCompanies > 0 ? (
                    <div className="space-y-6">
                      {Number(form.externalCompaniesCount) >= requirements.requiredExternalCompanies ? (
                        <div className="space-y-4">
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <h3 className="font-semibold text-green-900 mb-2">Document Options</h3>
                            <p className="text-sm text-green-800 mb-3">
                              You have sufficient external companies. Choose your preferred option:
                            </p>

                            <div className="space-y-3">
                              <label className="flex items-start gap-3 cursor-pointer p-3 border border-green-200 rounded-lg hover:bg-green-50">
                                <input
                                  type="radio"
                                  name="docOption"
                                  value="uploadDocs"
                                  checked={form.docOption === "uploadDocs"}
                                  onChange={handleChange}
                                  className="mt-1 text-green-600"
                                />
                                <div>
                                  <span className="font-medium text-green-900">Upload Company Documents</span>
                                  <p className="text-sm text-green-700 mt-1">I have all company documents ready to upload</p>
                                </div>
                              </label>
                              <label className="flex items-start gap-3 cursor-pointer p-3 border border-green-200 rounded-lg hover:bg-green-50">
                                <input
                                  type="radio"
                                  name="docOption"
                                  value="passportOnly"
                                  checked={form.docOption === "passportOnly"}
                                  onChange={handleChange}
                                  className="mt-1 text-green-600"
                                />
                                <div>
                                  <span className="font-medium text-green-900">Provide Documents for Me</span>
                                  <p className="text-sm text-green-700 mt-1">I'll provide passport + ID, you arrange the company documents</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {form.docOption === "uploadDocs" && (
                            <div className="space-y-6">
                              <h3 className="text-lg font-semibold text-gray-900">Company Documents</h3>
                              {Array.from({ length: Math.min(form.externalCompaniesCount, requirements.requiredExternalCompanies) }).map((_, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl p-4 sm:p-6">
                                  <h4 className="font-semibold text-gray-900 mb-4">
                                    {form.externalCompaniesDetails[idx]?.companyName || `Company #${idx + 1}`}
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commercial Registration
                                      </label>
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                        <input
                                          type="file"
                                          name={`cr_${idx}`}
                                          onChange={handleFileChange}
                                          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Financial Statement
                                      </label>
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                        <input
                                          type="file"
                                          name={`fs_${idx}`}
                                          onChange={handleFileChange}
                                          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Articles of Association
                                      </label>
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                                        <input
                                          type="file"
                                          name={`aoa_${idx}`}
                                          onChange={handleFileChange}
                                          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {form.docOption === "passportOnly" && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 space-y-4">
                              <h3 className="font-semibold text-yellow-900 mb-2">Personal Documents Required</h3>
                              <p className="text-sm text-yellow-800 mb-4">
                                Please upload your personal documents. We'll arrange all company documents on your behalf.
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport</label>
                                  <div className="border-2 border-dashed border-yellow-300 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors">
                                    <Upload className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                                    <input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={handlePassportChange}
                                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-100 file:text-yellow-800"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Iqama / ID Card</label>
                                  <div className="border-2 border-dashed border-yellow-300 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors">
                                    <Upload className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                                    <input
                                      type="file"
                                      name="idCard"
                                      onChange={handleFileChange}
                                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-100 file:text-yellow-800"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                          <h3 className="font-semibold text-green-900 mb-2">We'll Arrange External Companies for You</h3>
                          <p className="text-sm text-green-800 mb-4">
                            You have {form.externalCompaniesCount} external companies, but {requirements.requiredExternalCompanies} are required. 
                            Don't worry - we'll arrange the missing {requirements.requiredExternalCompanies - form.externalCompaniesCount} companies for you.
                          </p>
                          <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-green-900 mb-2">What we need from you:</h4>
                            <ul className="text-sm text-green-800 space-y-1">
                              <li>• Your passport copy</li>
                              <li>• Your Iqama/ID card copy</li>
                              <li>• We'll handle the rest!</li>
                            </ul>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Passport</label>
                              <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                                <Upload className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handlePassportChange}
                                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-800"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Iqama / ID Card</label>
                              <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                                <Upload className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                <input
                                  type="file"
                                  name="idCard"
                                  onChange={handleFileChange}
                                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-800"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="font-semibold text-blue-900 mb-2">Personal Documents Required</h3>
                      <p className="text-sm text-blue-800 mb-4">
                        No external company requirements for this service. Please upload your personal documents.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Passport</label>
                          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                            <input
                              type="file"
                              name="passport"
                              onChange={handlePassportChange}
                              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-800"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Iqama / ID Card</label>
                          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                            <input
                              type="file"
                              name="idCard"
                              onChange={handleFileChange}
                              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 8: Payment Details */}
            {step === 8 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
                  <p className="text-gray-600">Review fees and payment information</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Fee Breakdown
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-700">Investor visa fee:</span>
                        <span className="font-medium">2,000 SAR</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-700">Passport processing fee:</span>
                        <span className="font-medium">650 SAR</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-700">Work permit:</span>
                        <span className="font-medium">9,700 SAR</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-700">Transfer fee:</span>
                        <span className="font-medium">2,000 SAR</span>
                      </div>
                      <div className="flex justify-between py-3 text-lg font-bold text-gray-900 bg-white rounded-lg px-3">
                        <span>Total Estimated:</span>
                        <span className="text-blue-600">14,350 SAR</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Payment Information</h4>
                    <p className="text-sm text-yellow-800">
                      This is a demonstration form. In a real application, you would be redirected to a secure payment gateway 
                      to complete the transaction.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Demo Payment Method</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input 
                          placeholder="**** **** **** ****" 
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500" 
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input 
                          placeholder="MM/YY" 
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500" 
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: Review */}
            {step === 9 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Application Review</h2>
                  <p className="text-gray-600">Please review your application before submission</p>
                </div>

                <div className="space-y-6">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <X className="w-5 h-5" />
                        <span className="font-medium">{submitError}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Ready for Submission
                    </h3>
                    <p className="text-sm text-green-800 mb-4">
                      Your application is complete and ready for submission. Upon submission, it will go through the following stages:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-green-700">Submitted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-green-700">Under Review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-green-700">In Process</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="text-green-700">Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Application Summary */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Summary</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                        <div className="space-y-1 text-gray-600">
                          <p><span className="font-medium">Name:</span> {form.fullName || "Not provided"}</p>
                          <p><span className="font-medium">Email:</span> {form.email || "Not provided"}</p>
                          <p><span className="font-medium">Phone:</span> {form.phone || "Not provided"}</p>
                          <p><span className="font-medium">Nationality:</span> {form.nationality || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Service Details</h4>
                        <div className="space-y-1 text-gray-600">
                          <p><span className="font-medium">Service Type:</span> {form.serviceType ? form.serviceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Not selected"}</p>
                          <p><span className="font-medium">Partner Type:</span> {form.partnerType === "sole" ? "Sole Partner" : "With Saudi Partner"}</p>
                          {form.partnerType === "withSaudiPartner" && form.saudiPartnerName && (
                            <p><span className="font-medium">Saudi Partner:</span> {form.saudiPartnerName}</p>
                          )}
                          <p><span className="font-medium">Virtual Office:</span> {form.needVirtualOffice ? "Yes" : "No"}</p>
                          {form.projectEstimatedValue && (
                            <p><span className="font-medium">Project Value:</span> {Number(form.projectEstimatedValue).toLocaleString()} SAR</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">External Companies</h4>
                        <div className="space-y-1 text-gray-600">
                          <p><span className="font-medium">Count:</span> {form.externalCompaniesCount}</p>
                          <p><span className="font-medium">Required:</span> {requirements.requiredExternalCompanies}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Family Members</h4>
                        <div className="space-y-1 text-gray-600">
                          <p><span className="font-medium">Count:</span> {form.familyMembers.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 text-gray-700 font-semibold rounded-2xl hover:bg-white hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" 
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                  Previous Step
                </button>
              )}
              
              <div className="flex-1"></div>
              
              {step < 9 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white font-bold rounded-2xl hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={submitForm}
                  disabled={isSubmitting}
                  className={`group flex items-center justify-center gap-3 px-10 py-4 font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl ${
                    isSubmitting 
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed scale-100" 
                      : "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white hover:from-emerald-700 hover:via-green-700 hover:to-teal-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}