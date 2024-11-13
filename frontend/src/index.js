import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store.js';
import { io } from 'socket.io-client';
import { addMessage } from './slices/messageSlice.js';

const socket = io();

// Прослушивание событий нового сообщения
socket.on('newMessage', (message) => {
  store.dispatch(addMessage(message));
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
