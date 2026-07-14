import { useNavigate } from "react-router-dom";

function TaskCard({ task, deleteTask }) {
  const navigate = useNavigate();

  function confirmDelete() {
    if (window.confirm("Are you sure?")) {
      deleteTask(task.id);
    }
  }

  return (
    <div
      className="task"
      style={{
        border: `20px solid ${task.boxColor}`,
      }}
    >
      <h3>{task.name}</h3>

      <p>{task.startDate}</p>

      <p>{task.dueDate}</p>

      <button
        onClick={() =>
          navigate(`/details/${task.id}`)
        }
      >
        View Details
      </button>

      <button
        onClick={() =>
          navigate(`/update/${task.id}`)
        }
      >
        Edit
      </button>

      <button onClick={confirmDelete}>
        Delete
      </button>
    </div>
  );
}

export default TaskCard;