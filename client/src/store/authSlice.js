import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

const saved = JSON.parse(localStorage.getItem('veloura_auth') || 'null');

export const login = createAsyncThunk('auth/login', async (payload) => (await api.post('/auth/login', payload)).data);
export const register = createAsyncThunk('auth/register', async (payload) => (await api.post('/auth/register', payload)).data);
export const loadMe = createAsyncThunk('auth/me', async () => (await api.get('/auth/me')).data);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: saved?.user || null, token: saved?.token || null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('veloura_auth');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { status: 'succeeded', error: null });
        localStorage.setItem('veloura_auth', JSON.stringify(action.payload));
      })
      .addCase(register.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { status: 'succeeded', error: null });
        localStorage.setItem('veloura_auth', JSON.stringify(action.payload));
      })
      .addCase(loadMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'), (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'), (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
