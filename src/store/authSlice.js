import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // Store serializable info: uid, email
    role: null,
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.loading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.role = null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setUser, clearUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
