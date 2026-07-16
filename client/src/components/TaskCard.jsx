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
        borderTop: `6px solid ${task.boxColor}`,
      }}
    >
      <h3>{task.name}</h3>

      <p>{task.startDate}</p>

      <p>{task.dueDate}</p>

      <div className="action-buttons">
        <button className="view-detail-btn"
          onClick={() =>
            navigate(`/details/${task.id}`)
          }
        >
          View Details
        </button>

        <button className="edit"
          onClick={() =>
            navigate(`/update/${task.id}`)
          }
        >
          Edit
        </button>

        <button className="delete" onClick={confirmDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;