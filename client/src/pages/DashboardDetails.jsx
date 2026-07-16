import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/dashboard.css";

function DashboardDetails() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        document.title = "TODO App | Dashboard Data Page";
        loadData();
    }, []);

    const loadData = () => {
        const tasksList = JSON.parse(localStorage.getItem("Tasks")) || [];
        const usersList = JSON.parse(localStorage.getItem("Users")) || [];
        
        // Count tasks for each user to augment users list
        const userTaskCounts = {};
        tasksList.forEach(task => {
            if (task.author) {
                userTaskCounts[task.author] = (userTaskCounts[task.author] || 0) + 1;
            }
        });

        const augmentedUsers = usersList.map(user => ({
            ...user,
            taskCount: userTaskCounts[user.username] || 0
        }));

        setTasks(tasksList);
        setUsers(augmentedUsers);
    };

    const confirmDeleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            const updatedTasks = tasks.filter(task => task.id !== id);
            localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
            loadData();
        }
    };

    const confirmDeleteUser = (username) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const updatedUsers = users.filter(user => user.username !== username);
            localStorage.setItem("Users", JSON.stringify(updatedUsers));
            loadData();
        }
    };

    return (
        <div className="dashboard-page-wrapper">
            <Navbar showSearch={false} />
            <main className="hero-section">
                <div className="sidebar-section">
                    <h2>Navigation</h2>
                    <ul className="sidebar-tabs">
                        <li className="sidebar-item">
                            <Link to="/dashboard">Analytics Page</Link>
                        </li>
                        <li className="sidebar-item active">
                            <Link to="/dashboard_details">Data Page</Link>
                        </li>
                    </ul>
                </div>
                <div className="analytics-section">
                    <h1>Data Section</h1>
                    
                    <h2 className="data-heading">Tasks Data</h2>
                    <div className="data-table">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th className="dashboard-th">No.</th>
                                    <th className="dashboard-th">Task Title</th>
                                    <th className="dashboard-th">Author</th>
                                    <th className="dashboard-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={task.id} className="dashboard-tr">
                                        <td className="dashboard-td">{index + 1}</td>
                                        <td className="dashboard-td">{task.name}</td>
                                        <td className="dashboard-td">{task.author}</td>
                                        <td className="dashboard-td">
                                            <button className="view-detail-btn" onClick={() => navigate(`/details/${task.id}`)} style={{ marginRight: '8px' }}>
                                                View
                                            </button>
                                            <button className="edit" onClick={() => navigate(`/update/${task.id}`)} style={{ marginRight: '8px' }}>
                                                Edit
                                            </button>
                                            <button className="delete" onClick={() => confirmDeleteTask(task.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {tasks.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="dashboard-td" style={{ textAlign: "center" }}>No tasks found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h2 className="data-heading">Users Data</h2>
                    <div className="data-table">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th className="dashboard-th">No.</th>
                                    <th className="dashboard-th">Username</th>
                                    <th className="dashboard-th">Task Count</th>
                                    <th className="dashboard-th">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.username} className="dashboard-tr">
                                        <td className="dashboard-td">{index + 1}</td>
                                        <td className="dashboard-td">{user.username}</td>
                                        <td className="dashboard-td">{user.taskCount}</td>
                                        <td className="dashboard-td">
                                            <button className="delete" onClick={() => confirmDeleteUser(user.username)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="dashboard-td" style={{ textAlign: "center" }}>No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardDetails;