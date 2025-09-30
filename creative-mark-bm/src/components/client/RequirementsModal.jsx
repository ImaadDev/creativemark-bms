// app/components/CompanyRequirementsModal.jsx
"use client";

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
      {
        title: "Employee Sponsorship Costs",
        icon: Users,
        items: [
          { label: "New Employee Package", value: "Same as investor", note: "Visa + passport + work permit fees apply" },
          { label: "Sponsored Transfer Fee", value: "From 2,000 SAR", note: "Increases with each subsequent transfer" },
        ],
      },
      {
        title: "Family & Dependent Services",
        icon: Users,
        items: [
          { label: "Family Visit Visa", value: "500 SAR per person", note: "Excludes travel and accommodation costs" },
          { label: "Recruitment Visa", value: "4,500 SAR per person", note: "All fees included, residency permit issued" },
          { label: "Family Work Authorization", value: "Additional process", note: "Residency doesn't allow work initially, transfer required" },
        ],
      },
      {
        title: "Specialized Activity Fees",
        icon: Briefcase,
        items: [
          { label: "Advertising License (Mawthouq)", value: "15,000 SAR", note: "Valid for 3 years, requires 50% ownership in home country" },
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
          {
            type: "Foreign National Partner (Non-Gulf)",
            details: [
              "Must first be added to parent company",
              "Then Saudi company can be amended accordingly",
              "Two-step process required",
            ],
          },
          {
            type: "Premium Residency Holder",
            details: [
              "Can be added directly as partner",
              "Similar privileges to Saudi nationals",
              "Simplified partnership process",
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
            type: "Real Estate Development",
            details: [
              "Must have established external company",
              "First project minimum: 300 million SAR",
              "Includes both land acquisition and construction costs",
              "Comprehensive business plan required",
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
          {
            type: "Commercial Activities (With Saudi Partner)",
            details: [
              "Only 1 external company required",
              "Saudi partner counts as 2 companies",
              "Significantly reduced documentation",
              "Faster approval process",
            ],
          },
          {
            type: "Industrial, Agricultural, or Service",
            details: [
              "1 external company required",
              "Minimum 1 year of operation",
              "Previous year's financial statements",
              "Relevant industry experience documentation",
            ],
          },
        ],
      },
    ],
    taxes: [
      {
        title: "Tax Structure",
        icon: DollarSign,
        items: [
          { label: "Foreign Investor Income Tax", value: "20%", note: "Applied on net profits of foreign-owned businesses" },
          { label: "Saudi National Zakat", value: "2.5%", note: "Religious obligation for Saudi partners only" },
          { label: "Value Added Tax (VAT)", value: "15%", note: "Applied universally to all businesses and consumers" },
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
      {
        title: "Critical Information",
        items: [
          "License renewal: Non-renewal stops bank account and residency services",
          "Saudization: Required percentage of Saudi employees per Nitaqat system",
          "Commercial register: Linked to national address and chamber of commerce",
          "Nationwide operation: Possible after obtaining province-specific permits",
          "Sponsor partnership: Not recommended - obtain official investment license instead",
        ],
      },
    ],
  };

  const renderSection = (section, index) => {
    const Icon = section.icon;
    return (
      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">{section.title}</h3>
        </div>
        {section.items.map((item, i) => (
          <div key={i} className="mb-3 last:mb-0">
            {typeof item === "string" ? (
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-emerald-600">•</span> {item}
              </p>
            ) : item.type ? (
              <div className="pl-4">
                <h4 className="text-sm font-medium text-gray-800">{item.type}</h4>
                <ul className="mt-2 space-y-1">
                  {item.details.map((detail, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-emerald-600">•</span> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-emerald-600">{item.value}</span>
                  {item.note && <p className="text-xs text-gray-500">{item.note}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {showTriggerButton && (
        <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            View Company Requirements
          </button>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Saudi Arabia Company Establishment</h2>
              <button onClick={onClose} className="p-2 hover:bg-emerald-700 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: Globe },
                { id: "costs", label: "Costs", icon: DollarSign },
                { id: "requirements", label: "Requirements", icon: FileText },
                { id: "taxes", label: "Taxes", icon: Briefcase },
                { id: "timeline", label: "Timeline", icon: Clock },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? "border-b-2 border-emerald-600 text-emerald-600 bg-white"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {activeTab === "overview" && requirements.overview.map(renderSection)}
              {activeTab === "costs" && requirements.costs.map(renderSection)}
              {activeTab === "requirements" && requirements.requirements.map(renderSection)}
              {activeTab === "taxes" && requirements.taxes.map(renderSection)}
              {activeTab === "timeline" && (
                <>
                  {requirements.timeline.map(renderSection)}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <h3 className="text-lg font-semibold">Important Notes</h3>
                    </div>
                    {requirements.important[0].items.map((item, i) => (
                      <p key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-amber-600">•</span> {item}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="readConfirm"
                  checked={hasRead}
                  onChange={(e) => setHasRead(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded"
                />
                <label htmlFor="readConfirm" className="text-sm text-gray-700">
                  I have read and understood all requirements and procedures
                </label>
              </div>
              {hasRead && (
                <div className="bg-green-50 p-3 rounded flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700">Requirements accepted! Proceed to application.</p>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={hasRead ? onAccept : undefined}
                  disabled={!hasRead}
                  className={`flex-1 py-2 px-4 rounded text-white ${
                    hasRead ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
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