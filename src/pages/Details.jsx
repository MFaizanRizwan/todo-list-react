import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedTask, createConfiguredThunk } from "../store/tasksSlice";

const fetchTaskById = createConfiguredThunk('fetchTaskById');
import "../css/details.css";

function Details() {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const { selectedTask: task, status, error } = useSelector((state) => state.tasks);

    useEffect(() => {
        if (!id) return;
        if (task?.id === id) return;

        dispatch(fetchTaskById(id));

        return () => {
            dispatch(clearSelectedTask());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (status === "failed") {
            alert(error || "Task not found.");
            navigate("/");
        }
    }, [status, error, navigate]);

    if (status === "loading") {
        return <h2>Loading...</h2>;
    }

    if (!task) {
        return <h2>Task not found.</h2>;
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
                                )}
                            >
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
                        <a href={task.relatedLink} target="_blank" rel="noreferrer">
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
                            {task.notificationMethod?.length === 0 ? "None" : task.notificationMethod?.join(", ")}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Details;