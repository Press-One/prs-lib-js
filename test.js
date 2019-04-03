'use strict';

const Mocha = require('mocha');
const path = require('path');
const argv = require('yargs').argv;
const mocha = new Mocha({ grep: argv.grep || '', timeout: 10000 });
const casePath = path.join(__dirname, '/test/');

require('fs').readdirSync(casePath).forEach((file) => {
  if (file.endsWith('.js')) {
    let path = `${casePath}${file}`;
    mocha.addFile(path);
  }
});

// Run the tests.
mocha.run((failures) => {
  process.exitCode = failures ? -1 : 0; // exit with non-zero status if there were failures
});
