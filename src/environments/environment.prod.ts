import {Configuration} from './configuration';

export const environment: Configuration = {
  production: true,
  apis: {
    iam: 'https://api.dd-decaf.eu/iam',
    model: 'https://api.dd-decaf.eu/model-caffeine',
  },
  GA: {
    trackingID: 'UA-106144097-2',
  },
  sentry: {
    DSN: 'https://4f2d0b394b5a4215806fc38ae2424502@sentry.io/1233163',
    release: 'SENTRY_PROJECT',
  },
  firebase: {
    api_key: 'AIzaSyApbLMKp7TprhjH75lpcmJs514uI11fEIo',
    auth_domain: 'dd-decaf-cfbf6.firebaseapp.com',
    database_url: 'https://dd-decaf-cfbf6.firebaseio.com',
    project_id: 'dd-decaf-cfbf6',
    storage_bucket: 'dd-decaf-cfbf6.appspot.com',
    sender_id: '972933293195',
  },
  trustedURLs: ['https://api.dd-decaf.eu/iam'],
};
