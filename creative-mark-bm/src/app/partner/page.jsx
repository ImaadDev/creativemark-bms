// External-specific page
"use client";

export default function ExternalHome() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">External Office Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mock Data - Replace with actual data fetching */}
        {[
          { name: "Assigned Tasks", value: 12, color: "bg-blue-500" },
          { name: "Pending Uploads", value: 5, color: "bg-yellow-500" },
          { name: "Completed Tasks This Month", value: 20, color: "bg-green-500" },
        ].map((stat) => (
          <div
            key={stat.name}
            className={`p-6 rounded shadow text-white ${stat.color}`}
          >
            <h3 className="text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Recent Activities</h3>
        <div className="space-y-3">
          {/* Mock Data - Replace with actual data fetching */}
          {[
            { id: 1, activity: "Reviewed documents for Client X", time: "2 hours ago" },
            { id: 2, activity: "Uploaded final report for Project Y", time: "1 day ago" },
            { id: 3, activity: "Replied to internal query from John Doe", time: "2 days ago" },
          ].map((activity) => (
            <div
              key={activity.id}
              className="bg-white p-4 rounded shadow flex justify-between"
            >
              <span>{activity.activity}</span>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
