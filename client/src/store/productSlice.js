import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}) => (await api.get('/products', { params })).data);
export const fetchFilters = createAsyncThunk('products/filters', async () => (await api.get('/products/filters')).data);

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], total: 0, filters: {}, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.status = 'succeeded';
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.filters = action.payload;
      })
      .addMatcher((action) => action.type.startsWith('products/') && action.type.endsWith('/pending'), (state) => {
        state.status = 'loading';
      })
      .addMatcher((action) => action.type.startsWith('products/') && action.type.endsWith('/rejected'), (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default productSlice.reducer;
