import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('/', {
      withCredentials: true,
    });
    setSocket(newSocket);

    // Логируем успешное подключение
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    // Логируем ошибки подключения
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSocket = () => useContext(SocketContext);
