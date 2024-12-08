import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, ButtonGroup, DropdownButton } from 'react-bootstrap';
import { fetchChannels, setActiveChannel } from '../slices/channelsSlice.js';
import { fetchMessages, addMessage } from '../slices/messageSlice.js';
import { useSocket } from '../contexts/SocketContext.js';
import axios from 'axios';
import routes from '../routes.js';
import AddChannelModal from '../modals/AddChannelModal.jsx';
import RemoveChannelModal from '../modals/RemoveChannelModal.jsx';
import RenameChannelModal from '../modals/RenameChannelModal.jsx';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const channels = useSelector((state) => state.channels.channels);
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const messagesByChannelId = useSelector((state) => state.messages.byChannelId);
  const [newMessage, setNewMessage] = useState('');
  const [isAddChannelModalOpen, setAddChannelModalOpen] = useState(false);
  const [channelToRemove, setChannelToRemove] = useState(null);
  const [channelToRename, setChannelToRename] = useState(null);

  const username = localStorage.getItem('username'); // Получение имени пользователя из localStorage

  const messages = messagesByChannelId[activeChannelId] || [];

  useEffect(() => {
    if (socket) {
      dispatch(fetchChannels());

      socket.on('newMessage', (message) => {
        dispatch(addMessage(message));
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [dispatch, socket]);

  useEffect(() => {
    if (activeChannelId && !messagesByChannelId[activeChannelId]) {
      dispatch(fetchMessages(activeChannelId));
    }
  }, [dispatch, activeChannelId, messagesByChannelId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Удаление имени пользователя при выходе
    navigate('/login');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    const messageData = {
      body: trimmedMessage,
      channelId: activeChannelId,
      username, // Используем имя пользователя из localStorage
    };

    try {
      await axios.post(routes.messagesPath(), messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleChannelClick = (channelId) => {
    dispatch(setActiveChannel(channelId));
  };

  const openAddChannelModal = () => setAddChannelModalOpen(true);
  const closeAddChannelModal = () => setAddChannelModalOpen(false);

  const openRemoveChannelModal = (channel) => setChannelToRemove(channel);
  const closeRemoveChannelModal = () => setChannelToRemove(null);

  const openRenameChannelModal = (channel) => setChannelToRename(channel);
  const closeRenameChannelModal = () => setChannelToRename(null);

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </nav>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>Каналы</b>
              <button
                type="button"
                className="p-0 text-primary btn btn-group-vertical"
                onClick={openAddChannelModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                </svg>
              </button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels?.map((channel) => (
                <li key={channel.id} className="nav-item w-100 d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    className={`flex-grow-1 w-100 rounded-0 text-start btn ${channel.id === activeChannelId ? 'btn-secondary' : ''}`}
                    onClick={() => handleChannelClick(channel.id)}
                  >
                    <span className="me-1">#</span>{channel.name}
                  </button>
                  {channel.isNew && (
                    <Dropdown as={ButtonGroup} align="end">
                      <DropdownButton
                        id={`dropdown-${channel.id}`}
                        title=""
                        variant="light"
                        split
                      >
                        <Dropdown.Item onClick={() => openRemoveChannelModal(channel)}>Удалить</Dropdown.Item>
                        <Dropdown.Item onClick={() => openRenameChannelModal(channel)}>Переименовать</Dropdown.Item>
                      </DropdownButton>
                    </Dropdown>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b># {channels.find((c) => c.id === activeChannelId)?.name}</b>
                </p>
                <span className="text-muted">{messages.length} сообщений</span>
              </div>
              <div id="messages-box" className="chat-messages overflow-auto px-5">
                <ul className="list-unstyled">
                  {messages.map((msg, index) => (
                    <li key={index}>
                      <strong>{msg.username}: </strong>{msg.body}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto px-5 py-3">
                <form onSubmit={handleSendMessage} className="py-1 border rounded-2">
                  <div className="input-group has-validation">
                    <input
                      name="body"
                      aria-label="Новое сообщение"
                      placeholder="Введите сообщение..."
                      className="border-0 p-0 ps-2 form-control"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-group-vertical">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddChannelModal show={isAddChannelModalOpen} onHide={closeAddChannelModal} />
      {channelToRemove && (
        <RemoveChannelModal channel={channelToRemove} onHide={closeRemoveChannelModal} />
      )}
      {channelToRename && (
        <RenameChannelModal channel={channelToRename} onHide={closeRenameChannelModal} />
      )}
    </div>
  );
};

export default HomePage;
