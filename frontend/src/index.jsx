import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './Components/App.jsx';
import store from './store';
import socket from './socket';
import { messageReceived, channelReceived, channelRenamed, channelRemoved } from './chatSlice';

// Очистка токенов в dev режиме при первом запуске
if (import.meta.env.DEV) {
  try {
    const key = 'devAuthClearedOnce';
    if (!sessionStorage.getItem(key)) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      sessionStorage.setItem(key, '1');
    }
  } catch (error) {
    console.warn('Failed to clear dev auth tokens:', error);
  }
}

// Настройка Socket.IO событий
const socketEvents = [
  { event: 'newMessage', action: messageReceived },
  { event: 'newChannel', action: channelReceived },
  { event: 'renameChannel', action: channelRenamed },
  { event: 'removeChannel', action: channelRemoved },
];

socketEvents.forEach(({ event, action }) => {
  socket.off(event);
  socket.on(event, (payload) => {
    if (import.meta.env.DEV) {
      console.debug(`${event} payload:`, payload);
    }
    store.dispatch(action(payload));
  });
});

// Подключение при готовности
socket.on('connect', () => {
  if (import.meta.env.DEV) {
    console.debug('Socket connected');
  }
});

// Рендер приложения
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
