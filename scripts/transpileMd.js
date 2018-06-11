const toc = require('markdown-toc');
const fs = require('fs');
const marked = require('marked');
minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

// Custom linkify method for addign fullpath
const linkify = (tok, options) => {
  if (tok && tok.content) {
    tok = {
      ...tok,
      content: toc.linkify(tok, options).content.replace('(#', '(/app/#'),
    };
  }
  return tok;
};

const inputFile = argv._[0];
const outputFile = argv._[1];

const content = fs.readFileSync(inputFile).toString();
const inserted = toc.insert(content, {linkify});
const result = marked(inserted);
fs.writeFileSync(outputFile, result);