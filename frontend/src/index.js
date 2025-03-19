import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import leoProfanity from 'leo-profanity';
import initI18n from './locales/i18n.js';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import store from './store.js';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

leoProfanity.clearList();
leoProfanity.add(leoProfanity.getDictionary('ru'));
leoProfanity.add(leoProfanity.getDictionary('en'));

initI18n().then(() => {
  const socket = io();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App socket={socket} />
      </Provider>
    </React.StrictMode>,
  );
});

reportWebVitals();
