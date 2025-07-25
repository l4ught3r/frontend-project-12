import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [
      { id: 1, name: 'general' },
      { id: 2, name: 'random' },
    ],
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.channels && action.payload.channels.length > 0) {
          state.channels = action.payload.channels;
          state.messages = action.payload.messages;
        } else {
          state.messages = [];
        }
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        // channels остаются дефолтными
      });
  },
});

export default chatSlice.reducer; 