import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
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
    activeChannelId: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setActiveChannel(state, action) {
      state.activeChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload || [];

        const generalChannel = state.channels.find((channel) => channel.name === 'general');
        state.activeChannelId = generalChannel ? generalChannel.id : state.channels[0]?.id;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setActiveChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
