import { useNavigate } from "react-router-dom";

function TaskCard({ task, deleteTask }) {
  const navigate = useNavigate();

  function confirmDelete() {
    if (window.confirm("Are you sure?")) {
      deleteTask(task.id);
    }
  }

  // Convert hex boxColor into a light tint by appending opacity hex (1E = 12%)
  const tintColor = task.boxColor ? `${task.boxColor}1E` : "rgba(79,70,229,0.07)";

  return (
    <div
      className="task-row"
      style={{
        borderLeft: `4px solid ${task.boxColor || "#4F46E5"}`,
        background: tintColor,
      }}
    >
      <div className="task-row-info">
        <span className="task-row-name">{task.name}</span>
        <span className="task-row-meta">
          {task.startDate} → {task.dueDate}
        </span>
      </div>

      {task.priority && (
        <span className={`task-row-priority priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      )}

      <div className="task-row-progress">
        <div
          className="task-row-progress-bar"
          style={{ width: `${task.taskProgress || 0}%`, background: task.boxColor || "#4F46E5" }}
        />
      </div>

      <div className="task-row-actions">
        <button className="view-detail-btn" onClick={() => navigate(`/details/${task.id}`)}>
          Details
        </button>
        <button className="edit" onClick={() => navigate(`/task/${task.id}`)}>
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