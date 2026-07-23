import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';
import { getThunkFn } from "./thunkConfig";

export const createConfiguredThunk = (name) =>
    createAsyncThunk(`tasks/${name}`, async (arg) => {
        const thunkFn = getThunkFn(name);
        return await thunkFn(arg);
    });

const applyFulfilledPayload = (state, payload) => {
    if (Array.isArray(payload)) {
        state.items = payload;
        return;
    }

    if (payload === null) {
        state.selectedTask = null;
        return;
    }

    if (typeof payload !== 'object') {
        state.items = state.items.filter(task => task.id !== payload);
        return;
    }

    if ('updatedData' in payload) {
        const { id, updatedData } = payload;
        const existingTask = state.items.find(task => task.id === id);
        if (existingTask) {
            Object.assign(existingTask, updatedData);
        }
        return;
    }

    const existingTask = state.items.find(task => task.id === payload.id);
    if (existingTask) {
        Object.assign(existingTask, payload);
    } else {
        state.items.push(payload);
    }
    state.selectedTask = payload;
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        selectedTask: null,
        status: 'idle',
        error: {},
    },
    reducers: {
        clearSelectedTask: (state) => {
            state.selectedTask = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isPending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addMatcher(isFulfilled, (state, action) => {
                state.status = 'succeeded';
                applyFulfilledPayload(state, action.payload);
            })
            .addMatcher(isRejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { clearSelectedTask } = tasksSlice.actions;
export default tasksSlice.reducer;