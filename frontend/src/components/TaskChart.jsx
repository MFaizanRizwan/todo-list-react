import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./../css/style.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function TaskChart({ tasks }) {
  const finishedCount = tasks.filter((t) => t.taskProgress === 100).length;
  const pendingCount = tasks.length - finishedCount;

  const chartData = {
    labels: ["Finished", "Pending"],
    datasets: [
      {
        data: [finishedCount, pendingCount],
        backgroundColor: ["#10B981", "#6366F1"],
        hoverBackgroundColor: ["#059669", "#4F46E5"],
        borderColor: ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.8)"],
        borderWidth: 3,
        hoverOffset: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14, family: "Inter", weight: "600" },
          color: "#374151",
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = finishedCount + pendingCount;
            const pct = total === 0 ? 0 : Math.round((ctx.parsed / total) * 100);
            return ` ${ctx.label}: ${ctx.parsed} tasks (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-panel">
      <div className="chart-panel-header">
        <h2 className="chart-title">Task Overview</h2>
        <p className="chart-subtitle">
          {tasks.length} total task{tasks.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="chart-stats">
        <div className="stat-badge stat-finished">
          <span className="stat-dot"></span>
          <span>{finishedCount} Finished</span>
        </div>
        <div className="stat-badge stat-pending">
          <span className="stat-dot"></span>
          <span>{pendingCount} Pending</span>
        </div>
      </div>
      <div className="chart-wrapper">
        {tasks.length === 0 ? (
          <p className="chart-empty">No tasks yet to visualize.</p>
        ) : (
          <Pie data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}

export default TaskChart;
