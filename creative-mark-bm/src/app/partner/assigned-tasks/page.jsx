"use client";

import { useState } from "react";

export default function AssignedTasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      clientName: "Client A",
      country: "UAE",
      serviceType: "Company Formation",
      status: "In Progress",
      description: "Review and submit Articles of Association.",
    },
    {
      id: 2,
      clientName: "Client B",
      country: "KSA",
      serviceType: "Investment License",
      status: "Waiting for Documents",
      description: "Awaiting financial statements from client.",
    },
    {
      id: 3,
      clientName: "Client C",
      country: "Egypt",
      serviceType: "Bank Account Opening",
      status: "Completed",
      description: "Bank account successfully opened.",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Assigned Tasks</h2>

      <section className="bg-white p-6 rounded shadow">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border p-4 rounded-md space-y-2">
              <h3 className="text-lg font-semibold">Task: {task.description}</h3>
              <p><strong>Client:</strong> {task.clientName} ({task.country})</p>
              <p><strong>Service Type:</strong> {task.serviceType}</p>
              <div className="flex items-center justify-between">
                <p><strong>Status:</strong> <span className="font-medium">{task.status}</span></p>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting for Documents">Waiting for Documents</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
