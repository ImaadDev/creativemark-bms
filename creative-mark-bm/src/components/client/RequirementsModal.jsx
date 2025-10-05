import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileText,
  DollarSign,
  Building2,
  Clock,
  Users,
  Globe,
} from "lucide-react";

export default function CompanyRequirementsModal({
  isOpen = false,
  onClose = () => {},
  onAccept = () => {},
  showTriggerButton = true,
}) {
  const [hasRead, setHasRead] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const requirements = {
    overview: [
      {
        title: "Why Saudi Arabia?",
        icon: Globe,
        items: [
          "Faster electronic procedures compared to UAE",
          "Wider variety of business activities available",
          "Government support and incentive programs",
          "Stable legal environment and currency",
          "Promising market with large consumer base",
          "Strategic location for regional business",
        ],
      },
      {
        title: "Investor Privileges",
        icon: Users,
        items: [
          "100% full ownership without local partner requirement",
          "Freedom to enter and exit Kingdom without sponsor",
          "Easier access to Premium Residency program",
          "Right to issue residency permits for first-degree family members",
          "Right to own real estate in designated areas",
          "Ability to acquire existing companies",
          "Enter strategic partnerships freely",
        ],
      },
    ],
    costs: [
      {
        title: "Company Establishment Fees",
        icon: Building2,
        items: [
          { label: "Company Setup Cost", value: "Based on approved offers", note: "Determined by current management offers" },
          { label: "License Fees", value: "Payment required", note: "May be delayed during Ministry of Investment inspection" },
        ],
      },
      {
        title: "Investor Residency Package",
        icon: Users,
        items: [
          { label: "Entry Visa Fee", value: "2,000 SAR", note: "Single entry" },
          { label: "Passport Processing", value: "650 SAR", note: "Administrative fees" },
          { label: "Work Permit (Standard)", value: "9,700 SAR", note: "Full rate" },
          { label: "Health Insurance", value: "Separate cost", note: "Not included in above fees" },
        ],
      },
    ],
    requirements: [
      {
        title: "Partnership Structures",
        icon: Users,
        items: [
          {
            type: "50% External Company Partner",
            details: [
              "Valid commercial registration in origin country",
              "Authenticated financial statements for previous year",
              "Authentication from Saudi embassy abroad required",
              "Investment license must be obtained",
              "Articles of association amendment needed",
            ],
          },
          {
            type: "Saudi or Gulf National Partner",
            details: [
              "Can be added directly without external requirements",
              "Simplified documentation process",
              "No investment license needed for Gulf nationals",
            ],
          },
        ],
      },
      {
        title: "Business Activity Requirements",
        icon: Briefcase,
        items: [
          {
            type: "Engineering Consulting Office",
            details: [
              "Requires 4 external companies total",
              "Three companies: CR + financial statements + 1 year operation",
              "One company: CR + 10 years of documented experience",
              "All documentation must be authenticated",
            ],
          },
          {
            type: "Commercial Activities (Solo Investor)",
            details: [
              "Requires 3 external companies",
              "Must be from 3 different countries",
              "Each with valid commercial registration",
              "Financial statements required for each",
            ],
          },
        ],
      },
    ],
    timeline: [
      {
        title: "Processing Timeline",
        icon: Clock,
        items: [
          { label: "Saudi Company Establishment", value: "~15 working days", note: "After all documents submitted and verified" },
          { label: "External Company Setup", value: "~15 working days", note: "If establishing new external company" },
          { label: "Total Process (With External)", value: "~30 working days", note: "Assuming no delays or additional requirements" },
        ],
      },
    ],
    important: [
      "License renewal: Non-renewal stops bank account and residency services",
      "Saudization: Required percentage of Saudi employees per Nitaqat system",
      "Commercial register: Linked to national address and chamber of commerce",
      "Nationwide operation: Possible after obtaining province-specific permits",
      "Sponsor partnership: Not recommended - obtain official investment license instead",
    ],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "costs", label: "Costs", icon: DollarSign },
    { id: "requirements", label: "Requirements", icon: FileText },
    { id: "timeline", label: "Timeline", icon: Clock },
  ];

  const renderSection = (section, index) => {
    const Icon = section.icon;
    return (
      <div key={index} className="bg-white border border-amber-100/50 overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-lg shadow-sm">
        <div className="p-3 sm:p-4 lg:p-6 bg-[#242021] border-b border-amber-200/20">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ffd17a] rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#242021]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">{section.title}</h3>
              <p className="text-xs sm:text-sm text-gray-300">Detailed information and requirements</p>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          {section.items.map((item, i) => (
            <div key={i}>
              {typeof item === "string" ? (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-2 flex-shrink-0 bg-[#ffd17a]"></div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{item}</p>
                </div>
              ) : item.type ? (
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ffd17a]"></div>
                    {item.type}
                  </h4>
                  <ul className="space-y-2 ml-3 sm:ml-4">
                    {item.details.map((detail, j) => (
                      <li key={j} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-[#ffd17a]"></div>
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block mb-1">{item.label}</span>
                      {item.note && <p className="text-xs text-gray-600 leading-relaxed">{item.note}</p>}
                    </div>
                    <div className="text-right sm:text-left">
                      <span className="inline-block text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#ffd17a] text-[#242021]">
                        {item.value}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {showTriggerButton && (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 flex items-center justify-center">
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-[#ffd17a] text-[#242021] font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#ffd17a]/90 text-sm sm:text-base"
          >
            View Company Requirements
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-2xl max-w-xs sm:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="backdrop-blur-sm border-b border-amber-200/20 bg-[#242021] p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#ffd17a] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#242021]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white truncate">Saudi Arabia Company Establishment</h2>
                    <p className="text-xs sm:text-sm text-gray-300 truncate">Complete requirements and procedures guide</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg sm:rounded-xl transition-all flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-50 overflow-x-auto px-2 sm:px-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-[#ffd17a] text-[#242021] rounded-lg"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.charAt(0)}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 overflow-y-auto max-h-[calc(95vh-200px)] bg-gradient-to-b from-white to-gray-50">
              {activeTab === "overview" && requirements.overview.map(renderSection)}
              {activeTab === "costs" && requirements.costs.map(renderSection)}
              {activeTab === "requirements" && requirements.requirements.map(renderSection)}
              {activeTab === "timeline" && (
                <>
                  {requirements.timeline.map(renderSection)}
                  <div className="bg-white border border-amber-100/50 overflow-hidden group hover:shadow-lg transition-all duration-300 rounded-lg shadow-sm">
                    <div className="p-3 sm:p-4 lg:p-6 bg-[#242021] border-b border-amber-200/20">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#ffd17a] rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#242021]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">Important Notes</h3>
                          <p className="text-xs sm:text-sm text-gray-300">Critical information for successful application</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
                      {requirements.important.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-2 flex-shrink-0 bg-[#ffd17a]"></div>
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-white shadow-sm">
                <input
                  type="checkbox"
                  id="readConfirm"
                  checked={hasRead}
                  onChange={(e) => setHasRead(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded transition-all duration-200 cursor-pointer accent-[#ffd17a]"
                />
                <label htmlFor="readConfirm" className="text-xs sm:text-sm font-semibold text-gray-800 cursor-pointer">
                  I have read and understood all requirements and procedures
                </label>
              </div>
            
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={hasRead ? onAccept : undefined}
                  disabled={!hasRead}
                  className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                    hasRead 
                      ? "bg-[#ffd17a] text-[#242021] shadow-lg hover:shadow-xl hover:bg-[#ffd17a]/90" 
                      : "bg-gray-300 cursor-not-allowed opacity-60 text-gray-500"
                  }`}
                >
                  {hasRead ? "Continue to Application" : "Accept Requirements"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}