"use client";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, message: "New task assigned: Review documents for Client F.", time: "10 minutes ago" },
    { id: 2, message: "Reminder: Task #456 (Client B) deadline is tomorrow.", time: "2 hours ago" },
    { id: 3, message: "Internal staff uploaded new documents for Client G. Please review.", time: "1 day ago" },
    { id: 4, message: "Payment for Task #123 (Client A) has been received.", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Recent Notifications</h3>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-gray-50 p-3 rounded">
              <p>{notification.message}</p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
