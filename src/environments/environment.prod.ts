import {Configuration} from './configuration';

export const environment: Configuration = {
  production: true,
  apis: {
    iam: 'https://api.dd-decaf.eu/iam',
  },
  sentryDSN: 'https://4f2d0b394b5a4215806fc38ae2424502@sentry.io/1233163',
  firebase: {
    api_key: 'AIzaSyApbLMKp7TprhjH75lpcmJs514uI11fEIo',
    auth_domain: 'dd-decaf-cfbf6.firebaseapp.com',
    database_url: 'https://dd-decaf-cfbf6.firebaseio.com',
    project_id: 'dd-decaf-cfbf6',
    storage_bucket: 'dd-decaf-cfbf6.appspot.com',
    sender_id: '972933293195',
  },
};
