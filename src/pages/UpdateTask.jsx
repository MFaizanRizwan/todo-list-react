import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/add.css";
import Navbar from "../components/Navbar";
import { getTaskById } from "../services/task_services/getTaskById";
import { updateTask } from "../services/task_services/updateTask";

function UpdateTask() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [currentTask, setCurrentTask] = useState(null);
    const [task, setTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        validateSession();
        loadTask();
    }, [id, navigate]);

    async function loadTask() {
        try {
            setLoading(true);
            const loadedTask = await getTaskById(id);

            if (!loadedTask) {
                alert("Task not found.");
                navigate("/");
                return;
            }

            setCurrentTask(loadedTask);
            setTask({
                ...loadedTask,
                emailNotification: loadedTask.notificationMethod?.includes("Email") || false,
                smsNotification: loadedTask.notificationMethod?.includes("SMS") || false,
            });
        } catch (error) {
            console.error("Error loading task:", error);
            alert("Error loading task");
            navigate("/");
        } finally {
            setLoading(false);
        }
    }

    function validateSession() {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            alert("You are not authorized.");
            navigate("/login");
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setTask((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "range" ? Number(value) : value,
        }));
    }

    function validateInput() {
        if (
            task.name === "" ||
            task.startDate === "" ||
            task.dueDate === ""
        ) {
            alert("Please fill all required fields.");
            return false;
        }

        return true;
    }

    function validateDate() {
        const start = new Date(task.startDate);
        const due = new Date(task.dueDate);

        if (start > due) {
            alert("Start Date cannot be after Due Date.");
            return false;
        }

        return true;
    }

    function handleCheckbox(name, checked) {
        setTask((prev) => {
            let methods = [...(prev.notificationMethod || [])];

            if (name === "emailNotification") {
                if (checked) {
                    if (!methods.includes("Email")) methods.push("Email");
                } else {
                    methods = methods.filter((method) => method !== "Email");
                }
            }

            if (name === "smsNotification") {
                if (checked) {
                    if (!methods.includes("SMS")) methods.push("SMS");
                } else {
                    methods = methods.filter((method) => method !== "SMS");
                }
            }

            return {
                ...prev,
                emailNotification: name === "emailNotification" ? checked : prev.emailNotification,
                smsNotification: name === "smsNotification" ? checked : prev.smsNotification,
                notificationMethod: methods,
            };
        });
    }

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
        return a.every((value, index) => value === b[index]);
    }

    function hasChanges() {
        return (
            currentTask.name !== task.name ||
            currentTask.description !== task.description ||
            currentTask.startDate !== task.startDate ||
            currentTask.dueDate !== task.dueDate ||
            currentTask.email !== task.email ||
            currentTask.mobileNumber !== task.mobileNumber ||
            currentTask.relatedLink !== task.relatedLink ||
            currentTask.taskProgress !== task.taskProgress ||
            currentTask.priority !== task.priority ||
            currentTask.boxColor !== task.boxColor ||
            !arraysEqual(currentTask.notificationMethod || [], task.notificationMethod || [])
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validateInput()) return;
        if (!validateDate()) return;

        if (!hasChanges()) {
            alert("No changes made to the task.");
            return;
        }

        try {
            const updatePayload = {
                name: task.name,
                description: task.description,
                startDate: task.startDate,
                dueDate: task.dueDate,
                email: task.email,
                boxColor: task.boxColor,
                taskProgress: task.taskProgress,
                mobileNumber: task.mobileNumber,
                relatedLink: task.relatedLink,
                notificationMethod: task.notificationMethod || [],
                priority: task.priority,
                author: task.author,
            };

            await updateTask(task.id, updatePayload);
            setShowModal(true);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Error updating task");
        }
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!task) {
        return <h2>Task not found</h2>;
    }

    return (
        <>
            <Navbar showSearch={false} />
            {showModal && (
                <div className="success-modal">
                    <div className="modal-options">
                        <h2>Task Updated Successfully</h2>

                        <div className="modal-buttons">
                            <button onClick={() => navigate(`/details/${task.id}`)}>
                                See Details
                            </button>

                            <button onClick={() => navigate("/")}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="task-form-main">
                <form onSubmit={handleSubmit} className="details-form">
                    <div className="details-box">
                        <h2>Primary Details</h2>

                        <label>Name *</label>
                        <input className="task-form-input" type="text"
                            name="name"
                            value={task.name}
                            onChange={handleChange}
                        />

                        <label>Description</label>
                        <textarea className="task-form-textarea" name="description"
                            value={task.description}
                            onChange={handleChange}
                        />

                        <label>Start Date *</label>
                        <input className="task-form-input" type="date"
                            name="startDate"
                            value={task.startDate}
                            onChange={handleChange}
                        />

                        <label>Due Date *</label>
                        <input className="task-form-input" type="date"
                            name="dueDate"
                            value={task.dueDate}
                            onChange={handleChange}
                        />
                    </div>

                    <hr />

                    <div className="details-box">
                        <h2>Secondary Details</h2>

                        <label>Email</label>
                        <input className="task-form-input" type="email"
                            name="email"
                            value={task.email}
                            onChange={handleChange}
                        />

                        <label>Box Color</label>
                        <input className="task-form-input" type="color"
                            name="boxColor"
                            value={task.boxColor}
                            onChange={handleChange}
                        />

                        <label>Progress ({task.taskProgress}%)</label>
                        <input className="task-form-input" type="range"
                            min="0"
                            max="100"
                            name="taskProgress"
                            value={task.taskProgress}
                            onChange={handleChange}
                        />
                    </div>

                    <hr />

                    <div className="details-box">
                        <h2>Additional Details</h2>

                        <label>Mobile Number</label>
                        <input className="task-form-input" type="tel"
                            name="mobileNumber"
                            value={task.mobileNumber}
                            onChange={handleChange}
                        />

                        <label>Related Link</label>
                        <input className="task-form-input" type="url"
                            name="relatedLink"
                            value={task.relatedLink}
                            onChange={handleChange}
                        />

                        <label>Notification</label>
                        <div>
                            <label>
                                <input className="task-form-input" type="checkbox"
                                    name="emailNotification"
                                    checked={task.emailNotification}
                                    onChange={(e) => handleCheckbox(e.target.name, e.target.checked)}
                                />
                                Email
                            </label>

                            <label>
                                <input className="task-form-input" type="checkbox"
                                    name="smsNotification"
                                    checked={task.smsNotification}
                                    onChange={(e) => handleCheckbox(e.target.name, e.target.checked)}
                                />
                                SMS
                            </label>
                        </div>

                        <label>Priority</label>
                        <div>
                            <label>
                                <input className="task-form-radio" type="radio"
                                    name="priority"
                                    value="High"
                                    checked={task.priority === "High"}
                                    onChange={handleChange}
                                />
                                High
                            </label>

                            <label>
                                <input className="task-form-radio" type="radio"
                                    name="priority"
                                    value="Medium"
                                    checked={task.priority === "Medium"}
                                    onChange={handleChange}
                                />
                                Medium
                            </label>

                            <label>
                                <input className="task-form-radio" type="radio"
                                    name="priority"
                                    value="Low"
                                    checked={task.priority === "Low"}
                                    onChange={handleChange}
                                />
                                Low
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="task-form-submit">Update Task</button>
                </form>
            </main>
        </>
    );
}

export default UpdateTask;