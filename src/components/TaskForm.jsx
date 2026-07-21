/**
 * Props:
 *   task        {object}   Controlled form state
 *   isEdit      {boolean}  true = editing, false = adding
 *   submitting  {boolean}  Disables the submit button while saving
 *   onChange    {fn}       Handles all text/date/range/radio inputs
 *   onCheckbox  {fn}       Handles checkbox inputs (name, checked)
 *   onSubmit    {fn}       Form submit handler
 */
function TaskForm({ task, isEdit, submitting, onChange, onCheckbox, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="details-form">
            {/* ── Primary Details ─────────────────────────────── */}
            <div className="details-box">
                <h2>Primary Details</h2>

                <label>Name *</label>
                <input
                    className="task-form-input"
                    type="text"
                    name="name"
                    value={task.name}
                    onChange={onChange}
                    required
                />

                <label>Description</label>
                <textarea
                    className="task-form-textarea"
                    name="description"
                    value={task.description}
                    onChange={onChange}
                />

                <label>Start Date *</label>
                <input
                    className="task-form-input"
                    type="date"
                    name="startDate"
                    value={task.startDate}
                    onChange={onChange}
                    required
                />

                <label>Due Date *</label>
                <input
                    className="task-form-input"
                    type="date"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={onChange}
                    required
                />
            </div>

            <hr />

            {/* ── Secondary Details ───────────────────────────── */}
            <div className="details-box">
                <h2>Secondary Details</h2>

                <label>Email</label>
                <input
                    className="task-form-input"
                    type="email"
                    name="email"
                    value={task.email}
                    onChange={onChange}
                />

                <label>Box Color</label>
                <input
                    className="task-form-input"
                    type="color"
                    name="boxColor"
                    value={task.boxColor}
                    onChange={onChange}
                />

                <label>Progress ({task.taskProgress}%)</label>
                <input
                    className="task-form-input"
                    type="range"
                    min="0"
                    max="100"
                    name="taskProgress"
                    value={task.taskProgress}
                    onChange={onChange}
                />
            </div>

            <hr />

            {/* ── Additional Details ──────────────────────────── */}
            <div className="details-box">
                <h2>Additional Details</h2>

                <label>Mobile Number</label>
                <input
                    className="task-form-input"
                    type="tel"
                    name="mobileNumber"
                    value={task.mobileNumber}
                    onChange={onChange}
                />

                <label>Related Link</label>
                <input
                    className="task-form-input"
                    type="url"
                    name="relatedLink"
                    value={task.relatedLink}
                    onChange={onChange}
                />

                <label>Notification</label>
                <div>
                    <label>
                        <input
                            className="task-form-input"
                            type="checkbox"
                            name="emailNotification"
                            checked={task.emailNotification}
                            onChange={(e) => onCheckbox(e.target.name, e.target.checked)}
                        />
                        {" "}Email
                    </label>
                    <label>
                        <input
                            className="task-form-input"
                            type="checkbox"
                            name="smsNotification"
                            checked={task.smsNotification}
                            onChange={(e) => onCheckbox(e.target.name, e.target.checked)}
                        />
                        {" "}SMS
                    </label>
                </div>

                <label>Priority</label>
                <div>
                    {["High", "Medium", "Low"].map((level) => (
                        <label key={level}>
                            <input
                                className="task-form-radio"
                                type="radio"
                                name="priority"
                                value={level}
                                checked={task.priority === level}
                                onChange={onChange}
                            />
                            {" "}{level}
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="task-form-submit"
                disabled={submitting}
            >
                {submitting
                    ? (isEdit ? "Updating..." : "Adding...")
                    : (isEdit ? "Update Task" : "Add Task")}
            </button>
        </form>
    );
}

export default TaskForm;
