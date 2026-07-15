import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "./../components/TaskCard";
import Navbar from "./../components/Navbar";
import "./../css/style.css";

function Home() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const username = localStorage.getItem("authToken");

  useEffect(() => {
    validateSession();

    const taskList = JSON.parse(localStorage.getItem("taskList")) || [];

    setTasks(taskList);
  }, []);

  function validateSession() {
    if (
      !localStorage.getItem("authToken") ||
      localStorage.getItem("userRole") !== "user"
    ) {
      alert("You are not authorized.");
      navigate("/login");
    }
  }



  function deleteTask(id) {
    const updated = tasks.filter((task) => task.id !== id);

    setTasks(updated);

    localStorage.setItem("taskList", JSON.stringify(updated));
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
        <div className="todo-viewer">

          {currentTasks.length === 0 ? (
            <h2>No Tasks Found</h2>
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

        <button className="create-task-btn" onClick={() => navigate("/add")}>
          Create New +
        </button>

        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span>{currentPage}</span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>

        </div>
      </main>
    </>
  );
}

export default Home;