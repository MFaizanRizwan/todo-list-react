import { getTasks } from "../services/task_services/getTasks";
import { getTasksByUser } from "../services/task_services/getTaskByUsername";
import { addTask } from "../services/task_services/addTask";
import { updateTask } from "../services/task_services/updateTask";
import { deleteTask } from "../services/task_services/deleteTask";
import { getTaskById } from "../services/task_services/getTaskById";

import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected, createAction } from '@reduxjs/toolkit';

const fetchUserTasks = createAsyncThunk('tasks/fetchUserTasks', async (uid) => {
    return await getTasksByUser(uid);
});

const fetchAllTasks = createAsyncThunk('tasks/fetchAllTasks', async () => {
    return await getTasks();
});

const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (taskId) => {
    return await getTaskById(taskId);
});

const addNewTask = createAsyncThunk('tasks/addNewTask', async (taskData) => {
    const newId = await addTask(taskData);
    return { ...taskData, id: newId };
});

const editTask = createAsyncThunk('tasks/editTask', async ({ id, updatedData }) => {
    await updateTask(id, updatedData);
    return { id, updatedData };
});

const removeTask = createAsyncThunk('tasks/removeTask', async (id) => {
    await deleteTask(id);
    return id;
});

const thunkProvider = {
    fetchUserTasks,
    fetchAllTasks,
    fetchTaskById,
    addNewTask,
    editTask,
    removeTask
}

export const getTaskThunk = (name) => {
    const thunkFn = thunkProvider[name];
    if (!thunkFn) {
        throw new Error(`No async function registered for "${name}"`);
    }
    return thunkFn;
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        selectedTask: null,
        error: {
            fetchUserTasks: null,
            fetchAllTasks: null,
            fetchTaskById: null,
            addNewTask: null,
            editTask: null,
            removeTask: null
        },
        pending: {
            fetchUserTasks: false,
            fetchAllTasks: false,
            fetchTaskById: false,
            addNewTask: false,
            editTask: false,
            removeTask: false
        },
    },
    reducers: {
        clearSelectedTask: (state) => {
            state.selectedTask = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTasks.fulfilled, (state, action) => {
                state.items = action.payload;
            })

            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.items = action.payload;
            })

            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.selectedTask = action.payload;
            })

            .addCase(addNewTask.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            .addCase(editTask.fulfilled, (state, action) => {
                const { id, updatedData } = action.payload;
                const index = state.items.findIndex(task => task.id === id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updatedData };
                }
            })

            .addCase(removeTask.fulfilled, (state, action) => {
                const idToRemove = action.payload;
                state.items = state.items.filter(task => task.id !== idToRemove);
            })

            .addMatcher((action) => {
                return action.type.startsWith('tasks/') && (isPending(action) || isFulfilled(action) || isRejected(action));
            }, (state, action) => {
                const actionName = action.type.split('/')[1];
                const actionType = action.type.split('/')[2];

                if (actionType === 'pending') {
                    state.pending[actionName] = true;
                    state.error[actionName] = null;
                }

                else if (actionType === 'fulfilled') {
                    state.pending[actionName] = false;
                    state.error[actionName] = null;
                }

                else if (actionType === 'rejected') {
                    state.pending[actionName] = false;
                    state.error[actionName] = action.error.message;
                }
            });
    }
});

export const { clearSelectedTask } = tasksSlice.actions;
export default tasksSlice.reducer;