import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App.jsx';
import { Provider } from 'react-redux';
import store from './store';
import { io } from 'socket.io-client';
import { messageReceived } from './chatSlice';

if (import.meta.env.DEV) {
  try {
    const key = 'devAuthClearedOnce';
    if (!sessionStorage.getItem(key)) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      sessionStorage.setItem(key, '1');
    }
  } catch (_) {}
}

const socket = io('/', { transports: ['websocket'] });

socket.on('connect', () => {});

socket.off('newMessage');
socket.on('newMessage', (payload) => {
  if (import.meta.env.DEV) {
    console.debug('newMessage payload:', payload);
  }
  store.dispatch(messageReceived(payload));
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
