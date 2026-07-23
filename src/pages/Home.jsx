import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "./../components/TaskCard";
import Navbar from "./../components/Navbar";
import TaskChart from "./../components/TaskChart";
import "./../css/style.css";
import { useDispatch, useSelector } from "react-redux";
import { getTaskThunk } from "../store/tasksSlice";

const fetchUserTasks = getTaskThunk('fetchUserTasks');
const removeTask = getTaskThunk('removeTask');

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("authToken");

  const dispatch = useDispatch();
  const { items: tasks, pending, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "user" || !username) {
      navigate("/login");
      return;
    }
    if (!pending.fetchUserTasks && tasks.length === 0 && !error.fetchUserTasks) {
      dispatch(fetchUserTasks(username));
    }
  }, [navigate, dispatch, pending.fetchUserTasks, error.fetchUserTasks, tasks.length, username]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  async function deleteTask(id) {
    try {
      await dispatch(removeTask(id)).unwrap();
    } catch (error) {
      alert("Unable to delete task.");
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.author === username &&
      task.name.toLowerCase().includes(search.toLowerCase())
  );

  const tasksPerPage = 9;

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const start = (currentPage - 1) * tasksPerPage;

  const currentTasks = filteredTasks.slice(start, start + tasksPerPage);

  return (
    <>
      <Navbar
        showSearch={true}
        search={search}
        onSearchChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <main className="home-main">
{/* list provider// or list renderer  */}
        <div className="todo-panel">
          <div className="todo-panel-header">
            <h2 className="todo-panel-title">My Tasks</h2>
            <button className="create-task-btn" onClick={() => navigate("/task")}>
              + Create New
            </button>
          </div>

          <div className="todo-list">
            {pending.fetchUserTasks ? (
              <p className="no-tasks-msg">Loading tasks...</p>
            ) : currentTasks.length === 0 ? (
              <p className="no-tasks-msg">No tasks found.</p>
            ) : (
              currentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  deleteTask={deleteTask}
                />
              ))
            )}
          </div>

          <div className="todo-panel-footer">
            <span className="task-count">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </span>
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Prev
              </button>
              <span>{currentPage} / {totalPages || 1}</span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <TaskChart tasks={filteredTasks} />

      </main>
    </>
  );
}

export default Home;