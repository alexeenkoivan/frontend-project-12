import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (channelId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token is missing');
  }
  const response = await axios.get(routes.channelMessagesPath(channelId), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { channelId, messages: response.data };
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    byChannelId: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage(state, action) {
      const { channelId, ...message } = action.payload;
      if (!state.byChannelId[channelId]) {
        state.byChannelId[channelId] = [];
      }
      state.byChannelId[channelId].push(message);
    },
    removeMessagesByChannel(state, action) {
      delete state.byChannelId[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { channelId, messages } = action.payload;
        state.byChannelId[channelId] = messages || [];
      });
  },
});

export const { addMessage, removeMessagesByChannel } = messagesSlice.actions;
export default messagesSlice.reducer;
