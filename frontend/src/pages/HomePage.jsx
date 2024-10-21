import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from '../slices/channelsSlice.js';

const HomePage = () => {
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.channels);
  const loading = useSelector((state) => state.channels.loading);
  const error = useSelector((state) => state.channels.error);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  // Логи для отладки: Проверяем, что содержится в переменных
  console.log('Channels:', channels);
  console.log('Loading:', loading);
  console.log('Error:', error);

  if (loading) {
    return <div>Loading channels...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Welcome to the Chat</h1>
      <p>Please select a channel:</p>
      <ul>
        {/* Проверка, что channels является массивом перед вызовом map */}
        {Array.isArray(channels) && channels.map((channel) => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
