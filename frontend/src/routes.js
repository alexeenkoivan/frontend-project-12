const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  channelMessagesPath: (channelId) => [apiPath, 'channels', channelId, 'messages'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),

  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    NOT_FOUND: '*',
  }
};

export default routes;