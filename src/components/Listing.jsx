import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTaskThunk } from "../store/tasksSlice";
import { getUsers } from "../services/user_services/getUsers";
import TaskCard from "./TaskCard";
import "../css/listing.css";

const removeTaskThunk = getTaskThunk("removeTask");

function Listing({ thunkName, username }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [usersData, setUsersData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const { items: tasks, pending, error } = useSelector((state) => state.tasks);

  const isTaskThunk = thunkName ? thunkName.toLowerCase().includes("task") : false;

  useEffect(() => {
    if (isTaskThunk) {
      if (username) {
        const thunkFn = getTaskThunk("fetchUserTasks");
        dispatch(thunkFn(username));
      } else {
        const thunkFn = getTaskThunk("fetchAllTasks");
        dispatch(thunkFn());
      }
    } else {
      // Fetch users data
      async function loadUsers() {
        setUsersLoading(true);
        setUsersError(null);
        try {
          const allUsers = await getUsers();
          const userList = allUsers.filter((u) => u.role === "user" || !u.role);

          // Fetch all tasks to compute task counts
          const allTasksThunk = getTaskThunk("fetchAllTasks");
          const tasksResult = await dispatch(allTasksThunk()).unwrap();

          const taskCounts = {};
          if (Array.isArray(tasksResult)) {
            tasksResult.forEach((t) => {
              if (t.author) {
                taskCounts[t.author] = (taskCounts[t.author] || 0) + 1;
              }
            });
          }

          const augmented = userList.map((u) => ({
            ...u,
            taskCount: taskCounts[u.id] || 0,
          }));

          setUsersData(augmented);
        } catch (err) {
          console.error("Failed to load users:", err);
          setUsersError("Failed to load users data.");
        } finally {
          setUsersLoading(false);
        }
      }
      loadUsers();
    }
  }, [thunkName, username, isTaskThunk, dispatch]);

  const handleDeleteTask = async (id) => {
    try {
      await dispatch(removeTaskThunk(id)).unwrap();
    } catch (err) {
      alert("Unable to delete task.");
    }
  };

  // Filter items based on search input
  const filteredTasks = isTaskThunk
    ? tasks.filter(
      (t) =>
        (t.name && t.name.toLowerCase().includes(search.toLowerCase())) ||
        (t.author && t.author.toLowerCase().includes(search.toLowerCase()))
    )
    : [];

  const filteredUsers = !isTaskThunk
    ? usersData.filter(
      (u) =>
        (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
        (u.id && u.id.toLowerCase().includes(search.toLowerCase()))
    )
    : [];

  const totalItems = isTaskThunk ? filteredTasks.length : filteredUsers.length;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const currentTasks = isTaskThunk
    ? filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const currentUsers = !isTaskThunk
    ? filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const isLoading = isTaskThunk
    ? pending.fetchUserTasks || pending.fetchAllTasks
    : usersLoading;

  const hasError = isTaskThunk
    ? error.fetchUserTasks || error.fetchAllTasks
    : usersError;

  return (
    <div className="todo-panel">
      <div className="todo-panel-header">
        <h2 className="todo-panel-title">
          {isTaskThunk ? (username ? "My Tasks" : "All Tasks") : "Users Directory"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
          <input
            type="search"
            className="search-input"
            placeholder={isTaskThunk ? "Search tasks..." : "Search users..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="todo-list">
        {isLoading ? (
          <p className="no-tasks-msg">Loading data...</p>
        ) : hasError ? (
          <p className="no-tasks-msg">{hasError}</p>
        ) : totalItems === 0 ? (
          <p className="no-tasks-msg">No {isTaskThunk ? "tasks" : "users"} found.</p>
        ) : isTaskThunk ? (
          currentTasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={handleDeleteTask} />
          ))
        ) : (
          currentUsers.map((user) => (
            <div
              key={user.id}
              className="task-row"
              style={{
                borderLeft: "4px solid #6366F1",
                background: "rgba(99, 102, 241, 0.05)",
              }}
            >
              <div className="task-row-info">
                <span className="task-row-name">{user.email}</span>
                <span className="task-row-meta">
                  ID: {user.id} | Role: {user.role || "user"}
                </span>
              </div>
              <span className="task-row-priority priority-medium">
                {user.taskCount} {user.taskCount === 1 ? "Task" : "Tasks"}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="todo-panel-footer">
        <span className="task-count">
          {totalItems} {isTaskThunk ? "task" : "user"}{totalItems !== 1 ? "s" : ""}
        </span>
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            ← Prev
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Listing;
