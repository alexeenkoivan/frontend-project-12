import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const fetchChannels = createAsyncThunk('channels/fetchChannels', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token is missing');
  }
  const response = await axios.get(routes.channelsPath(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.map((channel) => ({ ...channel, isNew: false }));
});

export const addChannel = createAsyncThunk('channels/addChannel', async (channel, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(routes.channelsPath(), channel, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ...response.data, isNew: true };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeChannel = createAsyncThunk('channels/removeChannel', async (channelId, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${routes.channelsPath()}/${channelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return channelId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const renameChannel = createAsyncThunk('channels/renameChannel', async ({ id, name }, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.patch(`${routes.channelsPath()}/${id}`, { name }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

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
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.channels = action.payload || [];
        const generalChannel = state.channels.find((ch) => ch.name === 'general');
        state.activeChannelId = generalChannel ? generalChannel.id : state.channels[0]?.id;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter((ch) => ch.id !== action.payload);
        if (state.activeChannelId === action.payload) {
          const generalChannel = state.channels.find((ch) => ch.name === 'general');
          state.activeChannelId = generalChannel ? generalChannel.id : state.channels[0]?.id;
        }
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const channel = state.channels.find((ch) => ch.id === action.payload.id);
        if (channel) {
          channel.name = action.payload.name;
        }
      });
  },
});

export const { setActiveChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
