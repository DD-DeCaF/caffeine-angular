import {Configuration} from './configuration';

export const environment: Configuration = {
  production: true,
  apis: {
    iam: 'https://api-staging.dd-decaf.eu/iam',
    model: 'https://api-staging.dd-decaf.eu/model-caffeine',
  },
  GA: {
    trackingID: 'UA-106144097-3',
    eventLogging: true,
  },
  sentry: {
    DSN: 'https://4ae40dd008994d91bc5632437fd5c395@sentry.io/1233153',
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
  trustedURLs: ['https://api-staging.dd-decaf.eu/iam'],
};
