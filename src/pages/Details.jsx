import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../css/details.css";

function Details() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [task, setTask] = useState(null);

    useEffect(() => {
        const taskList =
            JSON.parse(localStorage.getItem("taskList")) || [];

        const currentTask = taskList.find(
            (task) => task.id === Number(id)
        );

        if (!currentTask) {
            alert("Task not found.");
            navigate("/");
            return;
        }

        setTask(currentTask);
    }, [id, navigate]);

    if (!task) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="details-page-wrapper">
            <header>
                <nav>
                    <ul>
                        <li>
                            <button
                                onClick={() => navigate(
                                    localStorage.getItem("userRole") === "user" ? "/" : "/dashboard"
                                )
                                }>
                                Todo App
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
                <div className="details">

                    <div className="section-details">
                        <h1>Primary Details</h1>

                        <h2>{task.name}</h2>

                        <h3>Description</h3>

                        <p>{task.description}</p>

                        <div className="time-details">

                            <div className="time">
                                <h4>Start Date</h4>

                                <p>{task.startDate}</p>
                            </div>

                            <div className="time">
                                <h4>End Date</h4>

                                <p>{task.dueDate}</p>
                            </div>

                        </div>
                    </div>

                    <hr className="details-hr" />

                    <div className="section-details">

                        <h1>Secondary Details</h1>

                        <h4>Email</h4>
                        <p>{task.email}</p>

                        <h4>Mobile Number</h4>
                        <p>{task.mobileNumber}</p>

                        <h4>Related Link</h4>

                        <a
                            href={task.relatedLink}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {task.relatedLink}
                        </a>

                        <h4>Task Progress</h4>

                        <p>{task.taskProgress}%</p>

                    </div>

                    <hr className="details-hr" />

                    <div className="section-details">

                        <h1>Additional Details</h1>

                        <h4>Priority</h4>

                        <p>{task.priority}</p>

                        <h4>Notification Method</h4>

                        <p>
                            {task.notificationMethod.length === 0 ? "None" : task.notificationMethod.join(", ")}
                        </p>

                    </div>

                </div>
            </main>
        </div>
    );
}

export default Details;