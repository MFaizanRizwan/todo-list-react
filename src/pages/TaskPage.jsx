import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import { useDispatch, useSelector } from "react-redux";
import { createConfiguredThunk } from "../store/tasksSlice";

const addNewTask = createConfiguredThunk('addNewTask');
const editTask = createConfiguredThunk('editTask');
const fetchTaskById = createConfiguredThunk('fetchTaskById');
import "../css/add.css";

const EMPTY_TASK = {
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    email: "",
    boxColor: "#4F46E5",
    taskProgress: 0,
    mobileNumber: "",
    relatedLink: "",
    emailNotification: false,
    smsNotification: false,
    notificationMethod: [],
    priority: "Low",
};

function TaskPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [task, setTask] = useState(EMPTY_TASK);
    const [originalTask, setOriginalTask] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const LoadedTask = useSelector((state) =>
        state.tasks.items.find(t => t.id === id)
    );

    useEffect(() => {
        if (!isEdit) return;

        if (LoadedTask) {
            const seeded = {
                ...LoadedTask,
                emailNotification: LoadedTask.notificationMethod?.includes("Email") || false,
                smsNotification: LoadedTask.notificationMethod?.includes("SMS") || false,
            };
            setTask(seeded);
            setOriginalTask(seeded);
        } else {
            dispatch(fetchTaskById(id));
        }
    }, [id, isEdit, dispatch, LoadedTask]);


    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setTask((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "range" ? Number(value) : value,
        }));
    }

    function handleCheckbox(name, checked) {
        setTask((prev) => {
            let methods = [...(prev.notificationMethod || [])];
            if (name === "emailNotification") {
                methods = checked
                    ? [...new Set([...methods, "Email"])]
                    : methods.filter((m) => m !== "Email");
            }
            if (name === "smsNotification") {
                methods = checked
                    ? [...new Set([...methods, "SMS"])]
                    : methods.filter((m) => m !== "SMS");
            }
            return { ...prev, [name]: checked, notificationMethod: methods };
        });
    }

    function validate() {
        if (!task.name || !task.startDate || !task.dueDate) {
            alert("Please fill all required fields.");
            return false;
        }
        if (new Date(task.startDate) > new Date(task.dueDate)) {
            alert("Start Date cannot be after Due Date.");
            return false;
        }
        return true;
    }

    function hasChanges() {
        if (!originalTask) return true;
        return (
            originalTask.name !== task.name ||
            originalTask.description !== task.description ||
            originalTask.startDate !== task.startDate ||
            originalTask.dueDate !== task.dueDate ||
            originalTask.email !== task.email ||
            originalTask.mobileNumber !== task.mobileNumber ||
            originalTask.relatedLink !== task.relatedLink ||
            originalTask.taskProgress !== task.taskProgress ||
            originalTask.priority !== task.priority ||
            originalTask.boxColor !== task.boxColor ||
            JSON.stringify(originalTask.notificationMethod || []) !==
            JSON.stringify(task.notificationMethod || [])
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        if (isEdit && !hasChanges()) {
            alert("No changes made to the task.");
            return;
        }

        const payload = {
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
        };

        setSubmitting(true);
        try {
            if (isEdit) {
                await dispatch(editTask({ id, updatedData: { ...payload, author: task.author } })).unwrap();
            } else {
                await dispatch(addNewTask({ ...payload, author: localStorage.getItem("authToken") })).unwrap();
                setTask(EMPTY_TASK); // Reset form for next entry
            }
            setShowModal(true);
        } catch (err) {
            console.error(err);
            alert(`Error ${isEdit ? "updating" : "adding"} task. Please try again.`);
        } finally {
            setSubmitting(false);
        }
    }

    if (isEdit && !LoadedTask) {
        return <h2 style={{ padding: "2rem" }}>Loading task...</h2>;
    }

    return (
        <>
            <Navbar showSearch={false} />

            {showModal && (
                <div className="success-modal">
                    <div className="modal-options">
                        <h2>Task {isEdit ? "Updated" : "Added"} Successfully</h2>
                        <div className="modal-buttons">
                            {isEdit ? (
                                <>
                                    <button onClick={() => navigate(`/details/${id}`)}>
                                        See Details
                                    </button>
                                    <button onClick={() => navigate(-1)}>Go Back</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setShowModal(false)}>
                                        Add Another
                                    </button>
                                    <button onClick={() => navigate("/")}>Go Back</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main className="task-form-main">
                <TaskForm
                    task={task}
                    isEdit={isEdit}
                    submitting={submitting}
                    onChange={handleChange}
                    onCheckbox={handleCheckbox}
                    onSubmit={handleSubmit}
                />
            </main>
        </>
    );
}

export default TaskPage;
