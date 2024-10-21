import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token is missing');
    }
    const response = await axios.get(routes.channelsPath(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload.channels;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default channelsSlice.reducer;
