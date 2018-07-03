#!/usr/bin/env bash

# Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -xeu

if [ "${TRAVIS_BRANCH}" = "master" ]; then
  sed -i -e "s/SENTRY_PROJECT/${TRAVIS_COMMIT}/g" src/environments/environment.prod.ts
  PROJECT='caffeine'
elif [ "${TRAVIS_BRANCH}" = "devel" ]; then
   sed -i -e "s/SENTRY_PROJECT/${TRAVIS_COMMIT}/g" src/environments/environment.staging.ts
   PROJECT='caffeine-staging'
fi

if [ "${TRAVIS_BRANCH}" = "master" ] || [ "${TRAVIS_BRANCH}" = "devel" ]; then
  curl --fail https://sentry.io/api/0/organizations/technical-university-of-denmark/releases/ \
    -X POST \
    -H 'Authorization: Bearer ${AUTH_TOKEN}' \
    -H 'Content-Type: application/json' \
    -d '
    {
      "version": "${TRAVIS_COMMIT}",
      "refs": [{
          "repository":"DD-DeCaF/caffeine",
          "commit":"${TRAVIS_COMMIT}"
      }],
      "projects":["${PROJECT}"]
  }
  '
fi
