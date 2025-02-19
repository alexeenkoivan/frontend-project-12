import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addNewChannel, setActiveChannel } from '../slices/channelsSlice.js';
import i18next from 'i18next';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const username = localStorage.getItem('username');

  useEffect(() => {
    const newSocket = io('/', { withCredentials: true });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('connect_error', () => {
      toast.error(i18next.t('errors.network'));
    });

    newSocket.on('newChannel', (channel) => {
      console.log('New channel received:', channel);

      dispatch(addNewChannel(channel));
      const currentUser = localStorage.getItem('username');
      if (channel.username === currentUser) {
        dispatch(setActiveChannel(channel.id));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch, username]);

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
