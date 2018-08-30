// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Configuration} from './configuration';

export const environment: Configuration = {
  production: true,
  apis: {
    iam: 'https://api-staging.dd-decaf.eu/iam',
<<<<<<< HEAD
=======
    bigg: 'https://api.dd-decaf.eu/bigg',
>>>>>>> fix: url bigg.
    model: 'https://api-staging.dd-decaf.eu/mcaffeine',
    map: 'https://api-staging.dd-decaf.eu/maps',
    bigg: 'https://api.dd-decaf.eu/bigg',
  },
  GA: {
    trackingID: 'UA-106144097-3',
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
