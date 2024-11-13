import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice.js';
import messagesReducer from './slices/messageSlice.js';

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
});

export default store;
