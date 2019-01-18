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

// This file is used for auto-generating the themes.
// This can be extended later to generate different shades

const fs = require('fs');
const colors = require('../src/app/themes').colors;

const header = `
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

@import '~@angular/material/theming';
@import 'metabolica';
`

const fileContents = colors.reduce((textSoFar, color) =>
  `${textSoFar}

// ${color} theme
$${color}-primary: mat-palette($mat-${color});

$${color}-theme: mat-light-theme($${color}-primary, $metabolica-app-accent, $metabolica-app-warn);

.${color}-theme {
  @include angular-material-theme($${color}-theme);
  @include app-build-component($${color}-theme);
  @include app-reaction-panel-component($${color}-theme);
  @include jobs-details($${color}-theme);
}
`, header);

fs.writeFileSync('src/styles/themes.scss', fileContents);
console.log('Themes updated');
