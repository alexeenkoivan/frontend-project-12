import { configureStore } from '@reduxjs/toolkit';
import { channelsApi } from './slices/channelsSlice.js';
import { messagesApi } from './slices/messageSlice.js';

const store = configureStore({
  reducer: {
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(channelsApi.middleware)
      .concat(messagesApi.middleware),
});

export default store;
