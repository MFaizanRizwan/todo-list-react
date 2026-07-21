import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "./../components/TaskCard";
import Navbar from "./../components/Navbar";
import TaskChart from "./../components/TaskChart";
import "./../css/style.css";
import { getTasksByUser } from "../services/task_services/getTaskByUsername";
import { deleteTask as deleteTaskService } from "../services/task_services/deleteTask";

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("authToken");

  useEffect(() => {
    const loadTasks = async () => {

      if (localStorage.getItem("userRole") !== "user" || !username) {
        navigate("/login");
        return;
      }

      const userTasks = await getTasksByUser(username);
      setTasks(userTasks);
    };

    loadTasks();
  }, [navigate]);

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  async function deleteTask(id) {
    try {
      await deleteTaskService(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
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

        <div className="todo-panel">
          <div className="todo-panel-header">
            <h2 className="todo-panel-title">My Tasks</h2>
            <button className="create-task-btn" onClick={() => navigate("/task")}>
              + Create New
            </button>
          </div>

          <div className="todo-list">
            {currentTasks.length === 0 ? (
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