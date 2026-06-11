import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

export const fetchCart = createAsyncThunk('cart/fetch', async () => (await api.get('/cart')).data);
export const addToCart = createAsyncThunk('cart/add', async (payload) => (await api.post('/cart/items', payload)).data);
export const updateQty = createAsyncThunk('cart/update', async ({ itemId, quantity }) => (await api.patch(`/cart/items/${itemId}`, { quantity })).data);
export const removeItem = createAsyncThunk('cart/remove', async (itemId) => (await api.delete(`/cart/items/${itemId}`)).data);
export const applyCoupon = createAsyncThunk('cart/coupon', async (code) => (await api.post('/cart/coupon', { code })).data);

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], savedForLater: [], coupon: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    const setCart = (state, action) => ({ ...state, ...action.payload, status: 'succeeded', error: null });
    builder
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateQty.fulfilled, setCart)
      .addCase(removeItem.fulfilled, setCart)
      .addCase(applyCoupon.fulfilled, setCart)
      .addMatcher((action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'), (state) => {
        state.status = 'loading';
      })
      .addMatcher((action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'), (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default cartSlice.reducer;
