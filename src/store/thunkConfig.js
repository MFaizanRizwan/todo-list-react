import { getTasks } from "../services/task_services/getTasks";
import { getTasksByUser } from "../services/task_services/getTaskByUsername";
import { addTask } from "../services/task_services/addTask";
import { updateTask } from "../services/task_services/updateTask";
import { deleteTask } from "../services/task_services/deleteTask";
import { getTaskById } from "../services/task_services/getTaskById";

const thunkConfig = {
    fetchUserTasks: async (username) => {
        const tasks = await getTasksByUser(username);
        return tasks;
    },

    fetchAllTasks: async () => {
        const tasks = await getTasks();
        return tasks;
    },

    fetchTaskById: async (taskId) => {
        const task = await getTaskById(taskId);
        return task;
    },

    addNewTask: async (taskData) => {
        const newId = await addTask(taskData);
        if (!newId) {
            throw new Error(`Failed to add task`);
        }
        return { ...taskData, id: newId };
    },

    editTask: async ({ id, updatedData }) => {
        const success = await updateTask(id, updatedData);
        if (!success) {
            throw new Error(`Failed to update task with id "${id}"`);
        }
        return { id, updatedData };
    },

    removeTask: async (id) => {
        const success = await deleteTask(id);
        if (!success) {
            throw new Error(`Failed to delete task with id "${id}"`);
        }
        return id;
    }
};

export const getThunkFn = (name) => {
    const thunkFn = thunkConfig[name];
    if (!thunkFn) {
        throw new Error(`No thunk function registered for "${name}" in thunkConfig`);
    }
    return thunkFn;
};

export default thunkConfig;
