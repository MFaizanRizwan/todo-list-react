import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/dashboard.css";
import { getTaskThunk } from "../store/tasksSlice";

const fetchAllTasks = getTaskThunk('fetchAllTasks');
const removeTask = getTaskThunk('removeTask');
import { getUsers } from "../services/user_services/getUsers";
import { useDispatch, useSelector } from "react-redux";

function DashboardDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);
    const { items: tasksList, pending, error } = useSelector((state) => state.tasks);

    useEffect(() => {
        document.title = "TODO App | Dashboard Data Page";
        if (!pending.fetchAllTasks && tasksList.length === 0 && !error.fetchAllTasks) {
            dispatch(fetchAllTasks());
        }
    }, [dispatch, pending.fetchAllTasks, error.fetchAllTasks, tasksList.length]);

    useEffect(() => {
        if (!pending.fetchAllTasks && !error.fetchAllTasks) {
            async function loadUsersAndCalculateCounts() {
                try {
                    const allUsers = await getUsers();
                    const usersList = allUsers.filter(user => user.role === "user");

                    const userTaskCounts = {};
                    tasksList.forEach(task => {
                        if (task.author) {
                            userTaskCounts[task.author] = (userTaskCounts[task.author] || 0) + 1;
                        }
                    });

                    const augmentedUsers = usersList.map(user => ({
                        ...user,
                        taskCount: userTaskCounts[user.id] || 0
                    }));

                    setUsers(augmentedUsers);
                } catch (err) {
                    console.error("Error loading users:", err);
                }
            }
            loadUsersAndCalculateCounts();
        }
    }, [pending.fetchAllTasks, error.fetchAllTasks, tasksList]);

    const confirmDeleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await dispatch(removeTask(id)).unwrap();
        } catch {
            alert("Failed to delete task. Please try again.");
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
                                {tasksList.map((task, index) => (
                                    <tr key={task.id} className="dashboard-tr">
                                        <td className="dashboard-td">{index + 1}</td>
                                        <td className="dashboard-td">{task.name}</td>
                                        <td className="dashboard-td">{task.author}</td>
                                        <td className="dashboard-td">
                                            <button className="view-detail-btn" onClick={() => navigate(`/details/${task.id}`)} style={{ marginRight: '8px' }}>
                                                View
                                            </button>
                                            <button className="edit" onClick={() => navigate(`/task/${task.id}`)} style={{ marginRight: '8px' }}>
                                                Edit
                                            </button>
                                            <button className="delete" onClick={() => confirmDeleteTask(task.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {tasksList.length === 0 && (
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
                                    <th className="dashboard-th">Email</th>
                                    <th className="dashboard-th">Task Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id} className="dashboard-tr">
                                        <td className="dashboard-td">{index + 1}</td>
                                        <td className="dashboard-td">{user.email}</td>
                                        <td className="dashboard-td">{user.taskCount}</td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="dashboard-td" style={{ textAlign: "center" }}>No users found</td>
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