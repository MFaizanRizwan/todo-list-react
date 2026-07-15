import { useState } from "react";
import "./../css/add.css";
import Navbar from "./../components/Navbar";

function AddTask() {
  const [showModal, setShowModal] = useState(false);

  const [task, setTask] = useState({
    todoName: "",
    description: "",
    startDate: "",
    dueDate: "",

    email: "",
    boxColor: "#000000",
    taskProgress: 0,

    mobileNumber: "",
    relatedLink: "",

    emailNotification: false,
    smsNotification: false,

    priority: "Low",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setTask({
      ...task,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function validateSession() {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "user") {
      alert("You are not authorized.");
      navigate("/login");
    }
  }

  validateSession();

  function validateInput() {
    if (
      task.todoName === "" ||
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

  function getId() {
    let taskList = JSON.parse(localStorage.getItem("taskList")) || [];

    if (taskList.length === 0) return 1;

    return taskList.length + 1;
  }

  function writeToLocalStorage(newTask) {
    let taskList = JSON.parse(localStorage.getItem("taskList")) || [];

    newTask.id = getId();
    newTask.author = localStorage.getItem("authToken");

    taskList.push(newTask);

    localStorage.setItem("taskList", JSON.stringify(taskList));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateInput()) return;

    if (!validateDate()) return;

    const notificationMethod = [];

    if (task.emailNotification)
      notificationMethod.push("Email");
    if (task.smsNotification) notificationMethod.push("SMS");

    const newTask = {
      name: task.todoName,
      description: task.description,
      startDate: task.startDate,
      dueDate: task.dueDate,
      email: task.email,
      boxColor: task.boxColor,
      taskProgress: task.taskProgress,
      mobileNumber: task.mobileNumber,
      relatedLink: task.relatedLink,
      notificationMethod,
      priority: task.priority,
    };

    console.log(newTask);

    writeToLocalStorage(newTask);

    setShowModal(true);

    setTask({
      todoName: "",
      description: "",
      startDate: "",
      dueDate: "",
      email: "",
      boxColor: "#000000",
      taskProgress: 0,
      mobileNumber: "",
      relatedLink: "",
      emailNotification: false,
      smsNotification: false,
      priority: "Low",
    });
  }

  return (
    <>
      <Navbar showSearch={false} />
      {showModal && (
        <div className="success-modal">
          <div className="modal-options">
            <h2>Task Added Successfully</h2>

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>
                Add Another
              </button>

              <button
                onClick={() => (window.location.href = "/")}
              >
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
              name="todoName"
              value={task.todoName}
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

            <label>
              Progress ({task.taskProgress}%)
            </label>

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
                  onChange={handleChange}
                />
                Email
              </label>

              <label>
                <input className="task-form-input" type="checkbox"
                  name="smsNotification"
                  checked={task.smsNotification}
                  onChange={handleChange}
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

          <button type="submit" >Add Task</button>
        </form>
      </main>
    </>
  );
}

export default AddTask;