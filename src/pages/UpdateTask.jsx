import { useState, useEffect } from "react";
import "./../css/add.css";
import { useNavigate, useParams } from "react-router-dom";

function UpdateTask() {

    const navigate = useNavigate();
    const { id } = useParams();
    const currentTask = getTaskById(getId());

    if (!currentTask) {
        alert("Task not found.");
        navigate("/");
        return;
    }

    let emailNotification = currentTask.notificationMethod?.includes("Email") || false;
    let smsNotification = currentTask.notificationMethod?.includes("SMS") || false;

    const [showModal, setShowModal] = useState(false);
    const [task, setTask] = useState(currentTask);

    useEffect(() => {
        validateSession();
    }, []);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setTask({
            ...task,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    function getId() {
        return Number(id);
    }

    function getTaskById(id) {
        let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
        return taskList.find((task) => task.id === Number(id));
    }

    function validateSession() {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            alert("You are not authorized.");
            navigate("/login");
        }
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

    }

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
        return a.every((value, index) => value === b[index]);
    }


    function updated(object, NewName, NewDescription, NewStartDate, NewdueDate, NewEmail, NewMobileNumber, NewRelatedLink, NewTaskProgress, NewPriority, NewNotificationMethod, NewboxColor) {
        return (
            object.name !== NewName ||
            object.description !== NewDescription ||
            object.startDate !== NewStartDate ||
            object.dueDate !== NewdueDate ||
            object.email !== NewEmail ||
            object.mobileNumber !== NewMobileNumber ||
            object.relatedLink !== NewRelatedLink ||
            object.taskProgress !== NewTaskProgress ||
            object.priority !== NewPriority ||
            object.boxColor !== NewboxColor ||
            !arraysEqual(object.notificationMethod || [], NewNotificationMethod || [])
        );
    }

    function writeToLocalStorage(newTask) {
        let taskList = JSON.parse(localStorage.getItem("taskList")) || [];

        const updatedTasks = taskList.filter((task) => task.id !== newTask.id);
        updatedTasks.push(newTask);

        localStorage.setItem(
            "taskList",
            JSON.stringify(updatedTasks)
        );
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!validateInput())
            return;

        if (!validateDate())
            return;

        if (!updated(currentTask, task.name, task.description, task.startDate, task.dueDate, task.email, task.mobileNumber, task.relatedLink, task.taskProgress, task.priority, task.notificationMethod, task.boxColor)) {
            alert("No changes made to the task.");
            return;
        }

        const notificationMethod = [];

        if (task.emailNotification)
            notificationMethod.push("Email");
        if (task.smsNotification) notificationMethod.push("SMS");

        const newTask = {
            id: task.id,
            author: task.author,
            name: task.name,
            description: task.description,
            startDate: task.startDate,
            dueDate: task.dueDate,
            email: task.email,
            boxColor: task.boxColor,
            taskProgress: task.taskProgress,
            mobileNumber: task.mobileNumber,
            relatedLink: task.relatedLink,
            notificationMethod: task.notificationMethod,
            priority: task.priority,
        };

        console.log(newTask);

        writeToLocalStorage(newTask);

        setShowModal(true);
    }

    return (
        <>
            {showModal && (
                <div className="success-modal">
                    <div className="modal-options">
                        <h2>Task Updated Successfully</h2>

                        <div className="modal-buttons">
                            <button onClick={() => navigate(`/details/${task.id}`)}>
                                See Details
                            </button>

                            <button
                                onClick={() => (navigate("/"))}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main>
                <form onSubmit={handleSubmit}>
                    <div className="details-box">
                        <h2>Primary Details</h2>

                        <label>Name *</label>

                        <input
                            type="text"
                            name="name"
                            value={task.name}
                            onChange={handleChange}
                        />

                        <label>Description</label>

                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                        />

                        <label>Start Date *</label>

                        <input
                            type="date"
                            name="startDate"
                            value={task.startDate}
                            onChange={handleChange}
                        />

                        <label>Due Date *</label>

                        <input
                            type="date"
                            name="dueDate"
                            value={task.dueDate}
                            onChange={handleChange}
                        />
                    </div>

                    <hr />

                    <div className="details-box">
                        <h2>Secondary Details</h2>

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={task.email}
                            onChange={handleChange}
                        />

                        <label>Box Color</label>

                        <input
                            type="color"
                            name="boxColor"
                            value={task.boxColor}
                            onChange={handleChange}
                        />

                        <label>
                            Progress ({task.taskProgress}%)
                        </label>

                        <input
                            type="range"
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

                        <input
                            type="tel"
                            name="mobileNumber"
                            value={task.mobileNumber}
                            onChange={handleChange}
                        />

                        <label>Related Link</label>

                        <input
                            type="url"
                            name="relatedLink"
                            value={task.relatedLink}
                            onChange={handleChange}
                        />

                        <label>Notification</label>

                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="emailNotification"
                                    checked={emailNotification}
                                    onChange={handleChange}
                                />
                                Email
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    name="smsNotification"
                                    checked={smsNotification}
                                    onChange={(e) => { handleCheckbox(e.target.name, e.target.checked) }}
                                />
                                SMS
                            </label>
                        </div>

                        <label>Priority</label>

                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="High"
                                    checked={task.priority === "High"}
                                    onChange={(e) => { handleCheckbox(e.target.name, e.target.checked) }}
                                />
                                High
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="Medium"
                                    checked={task.priority === "Medium"}
                                    onChange={handleChange}
                                />
                                Medium
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="priority"
                                    value="Low"
                                    checked={task.priority === "Low"}
                                    onChange={handleChange}
                                />
                                Low
                            </label>
                        </div>
                    </div>

                    <button type="submit">Update Task</button>
                </form>
            </main>
        </>
    );
}

export default UpdateTask;