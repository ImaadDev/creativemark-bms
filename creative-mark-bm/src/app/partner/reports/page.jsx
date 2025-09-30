"use client";
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function ReportsPage() {
  const monthlyTasksCompleted = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [10, 12, 8, 15, 11, 14],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const averageCompletionTime = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Avg. Completion Time (days)',
        data: [7, 8, 6, 7, 9, 7],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const feedbackScores = [
    { office: "Office A", score: 4.5, feedback: "Excellent communication." },
    { office: "Office B", score: 3.8, feedback: "Needs improvement in document submission speed." },
    { office: "Office C", score: 4.2, feedback: "Consistently meets deadlines." },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>

      {/* Monthly Performance Report */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Monthly Tasks Completed</h3>
        <div className="h-64">
          <Line data={monthlyTasksCompleted} />
        </div>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Average Task Completion Time</h3>
        <div className="h-64">
          <Bar data={averageCompletionTime} />
        </div>
      </section>

      {/* Feedback from Internal Staff */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Feedback from Internal Staff</h3>
        <div className="space-y-3">
          {feedbackScores.map((data, idx) => (
            <div key={idx} className="bg-gray-100 p-3 rounded shadow">
              <p className="font-medium">{data.office}: <span className="font-semibold text-blue-600">{data.score} / 5</span></p>
              <p className="text-sm text-gray-700">"{data.feedback}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Comparison (Simplified) */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Office Performance Comparison</h3>
        <div className="space-y-3">
          <div className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
            <span>Office A</span>
            <span className="font-semibold text-green-600">Top Performer</span>
          </div>
          <div className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
            <span>Office B</span>
            <span className="font-semibold text-yellow-600">Average</span>
          </div>
          <div className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
            <span>Office C</span>
            <span className="font-semibold text-blue-600">Good Performance</span>
          </div>
        </div>
      </section>
    </div>
  );
}
