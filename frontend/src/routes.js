const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  channelMessagesPath: () => [apiPath, 'messages'],
  messagesPath: () => [apiPath, 'messages'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),

  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    NOT_FOUND: '*',
  },
};

export default routes;