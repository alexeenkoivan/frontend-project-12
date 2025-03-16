import Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV || 'production',
};

const rollbarInstance = new Rollbar(rollbarConfig);

export default rollbarInstance;
