"use client";

import { useState } from "react";

export default function UploadsPage() {
  const [uploadedDocuments, setUploadedDocuments] = useState([
    { id: 1, name: "Articles of Association - Client A.pdf", status: "Submitted" },
    { id: 2, name: "Financial Statements - Client C.xlsx", status: "Reviewed by Internal" },
  ]);

  const [internalDocuments, setInternalDocuments] = useState([
    { id: 1, name: "Client A Passport Copy.pdf", uploadedBy: "Internal Staff" },
    { id: 2, name: "Client B License Request.docx", uploadedBy: "Internal Staff" },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Documents & Deliverables</h2>

      {/* Upload Completed Documents */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Upload Your Documents</h3>
        <input type="file" className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "/>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Upload Document</button>
      </section>

      {/* Your Submitted Documents */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Your Submitted Documents</h3>
        <div className="space-y-3">
          {uploadedDocuments.map((doc) => (
            <div key={doc.id} className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
              <span>{doc.name}</span>
              <span className="font-medium">{doc.status}</span>
              <button className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Download</button>
            </div>
          ))}
        </div>
      </section>

      {/* Documents Uploaded by Internal Staff for Review */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Documents from Internal Staff</h3>
        <div className="space-y-3">
          {internalDocuments.map((doc) => (
            <div key={doc.id} className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
              <div>
                <span>{doc.name}</span>
                <p className="text-xs text-gray-500">Uploaded by: {doc.uploadedBy}</p>
              </div>
              <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600">Review / Download</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
