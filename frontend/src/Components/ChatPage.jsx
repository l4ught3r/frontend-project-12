import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData } from '../chatSlice';

const ChatPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { channels, messages, status, error } = useSelector((state) => state.chat);
  const [currentChannelId, setCurrentChannelId] = React.useState(null);

  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  useEffect(() => {
    if (channels.length > 0 && currentChannelId === null) {
      setCurrentChannelId(channels[0].id);
    }
  }, [channels, currentChannelId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleChannelClick = (id) => setCurrentChannelId(id);

  const currentChannel = channels.find((c) => c.id === currentChannelId) || {};
  const channelMessages = messages.filter((m) => m.channelId === currentChannelId);

  return (
    <div className="h-100 bg-light">
      <div className="h-100 d-flex flex-column">
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <a className="navbar-brand" href="/">Hexlet Chat</a>
            <button type="button" className="btn btn-primary" onClick={handleLogout}>Выйти</button>
          </div>
        </nav>
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <div className="d-flex justify-content-between mb-2 ps-4 pe-2 p-4">
                <b>Каналы</b>
                <button type="button" className="p-0 text-primary btn btn-group-vertical">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" className="bi bi-plus-square">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zm0-1H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                  </svg>
                  <span className="visually-hidden">+</span>
                </button>
              </div>
              <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                {channels.map((channel) => (
                  <li className="nav-item w-100" key={channel.id}>
                    <button
                      type="button"
                      className={`w-100 rounded-0 text-start btn${channel.id === currentChannelId ? ' btn-secondary' : ' btn-light'}`}
                      onClick={() => handleChannelClick(channel.id)}
                    >
                      <span className="me-1" style={{ color: channel.id === currentChannelId ? '#fff' : '#000' }}>#</span>
                      {channel.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col p-0 h-100">
              <div className="d-flex flex-column h-100">
                <div className="bg-light mb-4 p-3 shadow-sm small">
                  <p className="m-0">
                    <b># {currentChannel.name || ''}</b>
                  </p>
                  <span className="text-muted">{channelMessages.length} сообщений</span>
                </div>
                <div id="messages-box" className="chat-messages overflow-auto px-5">
                  {channelMessages.map((msg) => (
                    <div className="text-break mb-2" key={msg.id}>
                      <b>{msg.username}:</b> {msg.body}
                    </div>
                  ))}
                </div>
                <div className="mt-auto px-5 py-3">
                  <form noValidate className="py-1 border rounded-2">
                    <div className="input-group has-validation">
                      <input name="body" aria-label="Новое сообщение" placeholder="Введите сообщение..." className="border-0 p-0 ps-2 form-control" value="" />
                      <button type="submit" disabled className="btn btn-group-vertical">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-square">
                          <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                        </svg>
                        <span className="visually-hidden">Отправить</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>
  );
};

export default ChatPage;