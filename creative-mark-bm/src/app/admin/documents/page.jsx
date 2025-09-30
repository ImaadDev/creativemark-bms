"use client";

import { useState } from "react";
import { FullPageLoading } from '../../../components/LoadingSpinner';
import { 
  FaFileAlt, 
  FaUpload, 
  FaCheck, 
  FaTimes, 
  FaDownload, 
  FaEye,
  FaFolder,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage
} from "react-icons/fa";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "Articles of Association.pdf", status: "Pending Review", type: "required" },
    { id: 2, name: "Financial Statements.xlsx", status: "Reviewed ✅", type: "required" },
    { id: 3, name: "Commercial Registration.pdf", status: "Rejected ❌", reason: "Blurry scan", type: "required" },
    { id: 4, name: "ClientAgreement.docx", status: "Approved", type: "optional" },
  ]);

  const requiredDocumentsChecklist = [
    "Articles of Association",
    "Financial Statements",
    "Commercial Registration",
    "Memorandum of Understanding",
  ];

  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocs = files.map((file, index) => ({
      id: documents.length + index + 1,
      name: file.name,
      status: "Pending Review",
      type: "uploaded",
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const handleReview = (id, newStatus, reason = "") => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, status: newStatus, reason } : doc)));
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return <FaFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-500" />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <FaFileImage className="text-purple-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('✅')) return 'bg-green-100 text-green-800 border-green-200';
    if (status.includes('❌')) return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'Approved') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaFileAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Documents Hub
              </h1>
              <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">
                Creative Mark Admin Portal
              </p>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl">
            Manage and review all client documents efficiently
          </p>
        </div>

        {/* Upload Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FaUpload className="text-white text-sm" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Upload Documents</h3>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-emerald-300 transition-colors">
            <FaUpload className="text-3xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">Drag and drop files here, or click to select</p>
            <input 
              type="file" 
              multiple 
              onChange={handleUpload} 
              className="hidden" 
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <FaUpload className="mr-2" />
              Choose Files
            </label>
          </div>
        </div>

        {/* Documents List & Review */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaFolder className="text-white text-sm" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">All Documents</h3>
          </div>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(doc.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{doc.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium px-2 py-1 border rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      {doc.reason && (
                        <span className="text-xs text-gray-500">({doc.reason})</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.status === "Pending Review" && (
                    <>
                      <button
                        onClick={() => handleReview(doc.id, "Reviewed ✅")}
                        className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      >
                        <FaCheck className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(doc.id, "Rejected ❌", prompt("Reason for rejection:") || "")}
                        className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <FaTimes className="mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  <button className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                    <FaDownload className="mr-1" />
                    Download
                  </button>
                  <button className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                    <FaEye className="mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <FaCheck className="text-white text-sm" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Required Documents Checklist</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocumentsChecklist.map((doc, index) => (
              <div key={index} className="flex items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={documents.some((d) => d.name.includes(doc) && d.status === "Reviewed ✅")}
                  readOnly
                  className="mr-3 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-gray-700 font-medium">{doc}</span>
                {documents.some((d) => d.name.includes(doc) && d.status === "Reviewed ✅") && (
                  <FaCheck className="ml-auto text-emerald-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
