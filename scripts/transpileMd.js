const toc = require('markdown-toc');
const fs = require('fs');
const marked = require('marked');
minimist = require('minimist');

const renderer = new marked.Renderer();

renderer.link = (link => (href, title, text) => {
  if (href === 'https://caffeine.dd-decaf.eu/login') {
    return `<a appOpenLoginDialog>${text}</a>`;
  }
  return link(href, title, text);
})(renderer.link.bind(renderer));

const argv = minimist(process.argv.slice(2));

// Custom linkify method for addign fullpath
const linkify = (tok, options) => {
  if (tok && tok.content) {
    tok = {
      ...tok,
      content: toc.linkify(tok, options).content,
    };
  }
  return tok;
};

const inputFile = argv._[0];
const outputFile = argv._[1];

const content = fs.readFileSync(inputFile).toString();
const inserted = toc.insert(content, {linkify});
const license = `<!--Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.-->

<!--Licensed under the Apache License, Version 2.0 (the "License");-->
<!--you may not use this file except in compliance with the License.-->
<!--You may obtain a copy of the License at-->

<!--http://www.apache.org/licenses/LICENSE-2.0-->

<!--Unless required by applicable law or agreed to in writing, software-->
<!--distributed under the License is distributed on an "AS IS" BASIS,-->
<!--WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.-->
<!--See the License for the specific language governing permissions and-->
<!--limitations under the License.-->

`;
const result = license + marked(inserted, {renderer});
fs.writeFileSync(outputFile, result);
