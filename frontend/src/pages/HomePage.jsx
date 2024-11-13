import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setActiveChannel } from '../slices/channelsSlice.js';
import { useSocket } from '../contexts/SocketContext.js';

const HomePage = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const channels = useSelector((state) => state.channels.channels);
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket) {
      console.log('Setting up socket listeners'); // Настройка слушателей сокета
      
      dispatch(fetchChannels()); // Запрос каналов при подключении
  
      // Получение новых сообщений от сервера
      socket.on('newMessage', (message) => {
        console.log('Received message from server:', message);
        setMessages((prev) => [...prev, message]);
      });
  
      return () => {
        console.log('Cleaning up socket listeners');
        socket.off('newMessage');
      };
    }
  }, [dispatch, socket]);
  

  const handleNewMessage = (message) => {
    if (socket) {
      console.log('Sending message:', message);
      socket.emit('newMessage', message, (response) => {
        console.log('Server response:', response); // Лог ответа от сервера для отладки
      });
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
          {messages
            .filter((msg) => msg.channelId === activeChannelId)
            .map((msg, index) => (
              <li key={index}>
                <strong>{msg.username}:</strong> {msg.text}
              </li>
          ))}
        </ul>
        <form onSubmit={(e) => {
          e.preventDefault();
          const message = {
            text: e.target.message.value,
            channelId: activeChannelId,
          };
          handleNewMessage(message);
          e.target.reset();
        }}>
          <input name="message" type="text" placeholder="Enter your message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
