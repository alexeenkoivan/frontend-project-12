import Rollbar from 'rollbar';

const rollbarConfig = {
  accessToken: '478ee50d1f024194b15bfbd0b733aa30',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV || 'production',
};

const rollbarInstance = new Rollbar(rollbarConfig);

export default rollbarInstance;
