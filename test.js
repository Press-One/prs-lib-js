'use strict';

const Mocha = require('mocha');
const chai = require('chai');
const path = require('path');
const argv = require('yargs').argv;

const mocha = new Mocha({ grep: argv.grep || '', timeout: 10000 });
const casePath = path.join(__dirname, '/test/');

// Add `should` to Object.prototype
chai.should();

require('fs').readdirSync(casePath).forEach((file) => {
  if (file.endsWith('.js') && file.includes(argv.file || '')) {
    let path = `${casePath}${file}`;
    mocha.addFile(path);
  }
});

// Run the tests.
mocha.run((failures) => {
  process.exitCode = failures ? -1 : 0; // exit with non-zero status if there were failures
});
