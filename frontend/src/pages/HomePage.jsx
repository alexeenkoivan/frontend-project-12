import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import leoProfanity from 'leo-profanity';
import { useGetChannelsQuery, channelsApi } from '../slices/channelsSlice.js';
import { useGetMessagesQuery, useAddMessageMutation, messagesApi } from '../slices/messageSlice.js';
import { useSocket } from '../contexts/SocketContext.js';
import useAuth from '../hooks/useAuth';
import routes from '../routes.js';
import AddChannelModal from '../modals/AddChannelModal.jsx';
import RemoveChannelModal from '../modals/RemoveChannelModal.jsx';
import RenameChannelModal from '../modals/RenameChannelModal.jsx';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const token = useAuth();
  const username = localStorage.getItem('username');

  const {
    data: channels,
    isLoading: channelsLoading,
    error: channelsError,
  } = useGetChannelsQuery();

  const [activeChannelId, setActiveChannelId] = useState(null);

  useEffect(() => {
    if (channels && channels.length > 0 && !activeChannelId) {
      const generalChannel = channels.find((ch) => ch.name === 'general');
      setActiveChannelId(generalChannel ? generalChannel.id : channels[0].id);
    }
  }, [channels, activeChannelId]);

  const { data: messagesData = [] } = useGetMessagesQuery(
    activeChannelId,
    { skip: !activeChannelId },
  );
  const messages = Array.isArray(messagesData)
    ? messagesData.filter((msg) => msg.channelId === activeChannelId)
    : [];

  const [sendMessage] = useAddMessageMutation();

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.channelId === activeChannelId) {
        dispatch(
          messagesApi.util.updateQueryData('getMessages', activeChannelId, (draft) => {
            draft.push(message);
          }),
        );
      }
    };

    const handleNewChannel = (channel) => {
      dispatch(
        channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
          draft.push(channel);
        }),
      );
      if (channel.username === username) {
        setActiveChannelId(channel.id);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
    };
  }, [socket, activeChannelId, dispatch, username]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate(routes.ROUTES.LOGIN);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) {
      return;
    }

    if (!token) {
      console.error('Token is missing');
      return;
    }

    const cleanedMessage = leoProfanity.clean(trimmedMessage);
    const messageData = {
      body: cleanedMessage,
      username,
      channelId: activeChannelId,
    };

    try {
      console.log('Отправка сообщения:', messageData);
      await sendMessage(messageData).unwrap();
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleChannelClick = (channelId) => {
    setActiveChannelId(channelId);
  };

  const [isAddChannelModalOpen, setAddChannelModalOpen] = useState(false);
  const [channelToRemove, setChannelToRemove] = useState(null);
  const [channelToRename, setChannelToRename] = useState(null);

  const openAddChannelModal = () => setAddChannelModalOpen(true);
  const closeAddChannelModal = () => setAddChannelModalOpen(false);
  const openRemoveChannelModal = (channel) => setChannelToRemove(channel);
  const closeRemoveChannelModal = () => setChannelToRemove(null);
  const openRenameChannelModal = (channel) => setChannelToRename(channel);
  const closeRenameChannelModal = () => setChannelToRename(null);

  if (channelsLoading) return <div>{t('loading')}</div>;
  if (channelsError) return <div>{t('errors.loadData')}</div>;

  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            {t('logout')}
          </button>
        </div>
      </nav>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('channels.channels')}</b>
              {channels.length > 0 && (
                <button
                  type="button"
                  className="p-0 text-primary btn btn-group-vertical"
                  aria-label={t('modals.add')}
                  onClick={openAddChannelModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="bold">+</text>
                  </svg>
                </button>
              )}
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels?.map((channel) => (
                <li key={channel.id} className="nav-item w-100">
                  {channel.removable ? (
                    <Dropdown as={ButtonGroup} className="d-flex w-100">
                      <Button
                        type="button"
                        variant={channel.id === activeChannelId ? 'secondary' : 'light'}
                        className="w-100 rounded-0 text-start text-truncate"
                        onClick={() => handleChannelClick(channel.id)}
                      >
                        <span className="me-1">#</span>
                        {channel.name}
                      </Button>
                      <Dropdown.Toggle split className="flex-grow-0" variant={channel.id === activeChannelId ? 'secondary' : 'light'}>
                        <span className="visually-hidden">{t('channels.menu')}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => openRemoveChannelModal(channel)}>
                          {t('channels.remove')}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => openRenameChannelModal(channel)}>
                          {t('channels.rename')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Button
                      type="button"
                      variant={channel.id === activeChannelId ? 'secondary' : 'light'}
                      className="w-100 rounded-0 text-start text-truncate"
                      onClick={() => handleChannelClick(channel.id)}
                    >
                      <span className="me-1">#</span>
                      {channel.name}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b>
                    #
                    {channels.find((c) => c.id === activeChannelId)?.name}
                  </b>
                </p>
                <span className="text-muted">
                  {t('messages.messagesCounter.messagesCount', { count: messages.length })}
                </span>
              </div>
              <div id="messages-box" className="chat-messages overflow-auto px-5">
                <ul className="list-unstyled">
                  {messages.map((msg, index) => (
                    <li key={msg.id}>
                      <strong>
                        {msg.username}
                        :
                      </strong>
                      {msg.body}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto px-5 py-3">
                <form onSubmit={handleSendMessage} className="py-1 border rounded-2">
                  <div className="input-group has-validation">
                    <input
                      name="body"
                      aria-label={t('messages.newMessage')}
                      placeholder={t('messages.placeholder')}
                      className="border-0 p-0 ps-2 form-control"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-outline-secondary"
                      aria-label="Submit"
                    >
                      <i className="bi bi-box-arrow-right" />
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
