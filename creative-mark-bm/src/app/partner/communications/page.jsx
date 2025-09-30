"use client";

import { useState } from "react";

export default function CommunicationsPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Internal Staff (John Doe)", subject: "Query on Client A's documents", message: "Please clarify the missing documents for Client A.", timestamp: "2025-09-23 10:00", replied: false },
    { id: 2, sender: "Internal Staff (Jane Smith)", subject: "Feedback on Project Y report", message: "The report for Project Y looks good. Just a minor correction on page 3.", timestamp: "2025-09-22 15:30", replied: true },
    { id: 3, sender: "Internal Staff (Admin)", subject: "Urgent: Client B license application", message: "The deadline for Client B's license application is tomorrow. Please prioritize.", timestamp: "2025-09-22 11:00", replied: false },
  ]);

  const [newMessage, setNewMessage] = useState({ subject: "", message: "" });

  const handleSendMessage = () => {
    if (newMessage.subject && newMessage.message) {
      setMessages([...messages, { id: messages.length + 1, sender: "You", timestamp: new Date().toLocaleString(), replied: true, ...newMessage }]);
      setNewMessage({ subject: "", message: "" });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Communications</h2>

      {/* Send New Message */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Send New Message to Internal Staff</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            className="block w-full p-2 border rounded"
            value={newMessage.subject}
            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="block w-full p-2 border rounded"
            value={newMessage.message}
            onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
          ></textarea>
          <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Send Message
          </button>
        </div>
      </section>

      {/* Received Messages / Tickets */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Messages from Internal Staff</h3>
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-gray-50 p-3 rounded shadow">
              <p><strong>From:</strong> {msg.sender}</p>
              <p><strong>Subject:</strong> {msg.subject}</p>
              <p className="mt-1 text-gray-700">{msg.message}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>{msg.timestamp}</span>
                {msg.replied ? (
                  <span className="text-green-600">Replied</span>
                ) : (
                  <button className="text-blue-500 hover:underline">Reply</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
