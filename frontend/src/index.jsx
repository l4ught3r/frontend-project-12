
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import './i18n'
import App from './Components/App.jsx'
import store from './store'
import socket from './socket'
import { messageReceived, channelReceived, channelRenamed, channelRemoved } from './chatSlice'

if (import.meta.env.DEV) {
  const key = 'devAuthClearedOnce'
  if (!sessionStorage.getItem(key)) {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    sessionStorage.setItem(key, '1')
  }
}

const socketEvents = [
  { event: 'newMessage', action: messageReceived },
  { event: 'newChannel', action: channelReceived },
  { event: 'renameChannel', action: channelRenamed },
  { event: 'removeChannel', action: channelRemoved },
]

socketEvents.forEach(({ event, action }) => {
  socket.off(event)
  socket.on(event, (payload) => {
    store.dispatch(action(payload))
  })
})
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)
