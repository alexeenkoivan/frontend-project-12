const apiPath = '/api/v1';

const routes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  chatPath: () => [apiPath, 'chat'].join('/'),
};

export default routes;