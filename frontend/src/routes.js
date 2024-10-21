const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  channelMessagesPath: (channelId) => [apiPath, 'channels', channelId, 'messages'].join('/'),
};

export default routes;
