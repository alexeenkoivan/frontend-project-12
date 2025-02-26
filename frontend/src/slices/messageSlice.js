import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';
import i18next from 'i18next';
import { toast } from 'react-toastify';

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (channelId, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(routes.channelMessagesPath(channelId), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { channelId, messages: response.data || [] };
  } catch (error) {
    if (!error.response || error.response.status >= 500) {
      toast.error(i18next.t('errors.network'));
    }
    return rejectWithValue(error.message);
  }
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
        state.byChannelId[channelId] = Array.isArray(messages) ? messages : [];
      });
  },
});

export const { addMessage, removeMessagesByChannel } = messagesSlice.actions;
export default messagesSlice.reducer;
