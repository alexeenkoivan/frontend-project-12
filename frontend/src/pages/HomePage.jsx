import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setActiveChannel } from '../slices/channelsSlice.js';
import { fetchMessages } from '../slices/messageSlice.js';
import { useSocket } from '../contexts/SocketContext.js';
import axios from 'axios';
import routes from '../routes.js';

const HomePage = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const channels = useSelector((state) => state.channels.channels);
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const messages = useSelector((state) => state.messages.messages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (socket) {
      dispatch(fetchChannels());
      return () => {
        socket.off('newMessage');
      };
    }
  }, [dispatch, socket]);

  useEffect(() => {
    if (activeChannelId) {
      dispatch(fetchMessages(activeChannelId));
    }
  }, [dispatch, activeChannelId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }

    const messageData = {
      body: newMessage,
      channelId: activeChannelId,
      username: 'admin',
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

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%' }}>
        <h2>Channels</h2>
        <ul>
          {channels?.map((channel) => (
            <li
              key={channel.id}
              style={{ fontWeight: channel.id === activeChannelId ? 'bold' : 'normal' }}
              onClick={() => handleChannelClick(channel.id)}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: '70%', paddingLeft: '20px' }}>
        <h2>Messages</h2>
        <ul style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.username}:</strong> {msg.body}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
