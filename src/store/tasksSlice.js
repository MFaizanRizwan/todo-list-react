import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks } from "../services/task_services/getTasks";
import { getTasksByUser } from "../services/task_services/getTaskByUsername";
import { addTask as addTaskService } from "../services/task_services/addTask";
import { updateTask as updateTaskService } from "../services/task_services/updateTask";
import { deleteTask as deleteTaskService } from "../services/task_services/deleteTask";
import { getTaskById } from "../services/task_services/getTaskById";

export const fetchUserTasks = createAsyncThunk('tasks/fetchUserTasks', async (uid) => {
    return await getTasksByUser(uid);
});

export const fetchAllTasks = createAsyncThunk('tasks/fetchAllTasks', async () => {
    return await getTasks();
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (taskId) => {
    return await getTaskById(taskId);
});

export const addNewTask = createAsyncThunk('tasks/addNewTask', async (taskData) => {
    const newId = await addTaskService(taskData);
    return { ...taskData, id: newId };
});

export const editTask = createAsyncThunk('tasks/editTask', async ({ id, updatedData }) => {
    await updateTaskService(id, updatedData);
    return { id, updatedData };
});

export const removeTask = createAsyncThunk('tasks/removeTask', async (id) => {
    await deleteTaskService(id);
    return id;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        selectedTask: null,
        status: 'idle',
        error: null,
        loading: {},
        error: {},
        params: {}
    },
    reducers: {
        clearSelectedTask: (state) => {
            state.selectedTask = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchUserTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchAllTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchTaskById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedTask = action.payload;

                if (action.payload) {
                    const existingTask = state.items.find(task => task.id === action.payload.id);
                    if (existingTask) {
                        Object.assign(existingTask, action.payload);
                    } else {
                        state.items.push(action.payload);
                    }
                }
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(addNewTask.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editTask.fulfilled, (state, action) => {
                const { id, updatedData } = action.payload;
                const existingTask = state.items.find(task => task.id === id);
                if (existingTask) {
                    Object.assign(existingTask, updatedData);
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                state.items = state.items.filter(task => task.id !== action.payload);
            });
    }
});

export const { clearSelectedTask } = tasksSlice.actions;
export default tasksSlice.reducer;