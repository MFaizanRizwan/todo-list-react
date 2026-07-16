import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from "../components/Navbar";
import "../css/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
    const [tasksCount, setTasksCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);

    useEffect(() => {
        document.title = "TODO App | Admin Dashboard";
        const tasksList = JSON.parse(localStorage.getItem("Tasks")) || [];
        const usersList = JSON.parse(localStorage.getItem("Users")) || [];
        setTasksCount(tasksList.length);
        setUsersCount(usersList.length);
    }, []);

    const chartData = {
        labels: ['Tasks', 'Users'],
        datasets: [
            {
                label: 'Count',
                data: [tasksCount, usersCount],
                backgroundColor: ['rgba(79, 70, 229, 0.6)', 'rgba(16, 185, 129, 0.6)'],
                borderColor: ['rgba(79, 70, 229, 1)', 'rgba(16, 185, 129, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="dashboard-page-wrapper">
            <Navbar showSearch={false} />
            <main className="hero-section">
                <div className="sidebar-section">
                    <h2>Navigation</h2>
                    <ul className="sidebar-tabs">
                        <li className="sidebar-item active">
                            <Link to="/dashboard">Analytics Page</Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/dashboard_details">Data Page</Link>
                        </li>
                    </ul>
                </div>
                <div className="analytics-section">
                    <h1>Admin Dashboard</h1>
                    <div className="cards-section">
                        <div className="info-card">
                            <h2>Total Tasks</h2>
                            <hr />
                            <h2 className="info-num">{tasksCount}</h2>
                        </div>
                        <div className="info-card">
                            <h2>Total Users</h2>
                            <hr />
                            <h2 className="info-num">{usersCount}</h2>
                        </div>
                    </div>
                    <div className="graph-section">
                        <h2>Users and Tasks Analytics</h2>
                        <div className="graph-canvas">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;