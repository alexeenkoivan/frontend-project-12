import Rollbar from 'rollbar';

const rollbarToken = process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN;

const rollbarConfig = rollbarToken
  ? {
      accessToken: rollbarToken,
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: process.env.NODE_ENV || 'production',
    }
  : null;

const rollbarInstance = rollbarConfig ? new Rollbar(rollbarConfig) : null;

export default rollbarInstance;
