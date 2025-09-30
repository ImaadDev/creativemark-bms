"use client";
import { useState } from "react";

export default function ExternalCommunication() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { type: "internal", text: "Internal staff has a query regarding Client X's documents.", time: "1 day ago" },
    { type: "external", text: "Please specify which documents you need clarification on.", time: "2 hours ago" },
  ]);

  const [tickets, setTickets] = useState([
    { id: 1, subject: "Clarification on Client A's business activity", status: "Open", lastUpdate: "2024-03-01" },
    { id: 2, subject: "Request for additional information for Client B", status: "Closed", lastUpdate: "2024-02-25" },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { type: "external", text: message, time: "Just now" }]);
      setMessage("");
      // In a real application, send this to a backend service
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Requests & Communication</h2>

      {/* Direct Communication with Internal Staff */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Direct Message</h3>
        <div className="h-64 overflow-y-auto border p-4 rounded mb-4 bg-gray-50">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.type === "external" ? "text-right" : "text-left"}`}>
              <span className={`inline-block p-2 rounded ${msg.type === "external" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                {msg.text}
              </span>
              <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message to internal staff..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </section>

      {/* Open a Ticket for a Task */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Open New Ticket</h3>
        <form className="space-y-3">
          <div>
            <label htmlFor="ticketSubject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input type="text" id="ticketSubject" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="ticketTask" className="block text-sm font-medium text-gray-700">Related Task (Optional)</label>
            <input type="text" id="ticketTask" placeholder="e.g., Task #123" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="ticketDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="ticketDescription" rows="4" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">Submit Ticket</button>
        </form>
      </section>

      {/* Track Responses & Communication History */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Ticket History</h3>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-gray-100 p-3 rounded shadow">
              <p className="font-medium">Ticket #{ticket.id}: {ticket.subject}</p>
              <p className="text-sm text-gray-600">Status: {ticket.status}</p>
              <p className="text-xs text-gray-500">Last Update: {ticket.lastUpdate}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
