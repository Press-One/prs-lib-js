'use strict';

const { request } = require('./request');
const validator = require('./validator');
const { keccak256 } = require('prs-utility');

const signByToken = async (data, token, host) => {
  validator.assert(data, 'data cannot be null');
  validator.assert(token, 'token cannot be null');
  let payload = { data };
  return request({
    host: host,
    method: 'post',
    path: `/sign`,
    data: { payload },
    authOpts: { token }
  });
};

const hashByPassword = (email, password) => keccak256(password + email);

class FileHasher {
  constructor (file) {
    this.file = file;
  }

  _read (chunk) {
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(chunk);
      fr.onload = (event) => {
        resolve(event.target.result);
      };
    });
  };

  async calc (progressCallback) {
    let sha = null; let lastOffset = 0; let offset = 0;
    const size = this.file.size;
    const chunk = 1024 * 1024 * 2;
    let done = false;
    while (!done) {
      offset += chunk;
      if (offset > size - 1) {
        offset = size;
        done = true;
      }
      const data = await this._read(this.file.slice(lastOffset, offset));
      if (progressCallback) progressCallback(Number((offset / size * 100).toFixed(2)));
      sha = (sha || keccak256).update(data);
      lastOffset = offset;
    }
    return sha.hex();
  };
}

const hashByFileReader = async (file, progressCallback) => {
  const _file = new FileHasher(file);
  const msghash = await _file.calc(progressCallback);
  return msghash;
};

const hashByReadableStream = async (stream) => {
  return new Promise((resolve, reject) => {
    let sha;
    let chunk = Buffer.from([]);
    stream.on('data', data => {
      chunk = Buffer.concat([chunk, data]);
      sha = (sha || keccak256).update(data);
    });
    stream.on('end', async () => {
      const fileHash = sha.hex();
      resolve({
        buffer: chunk,
        fileHash
      });
    });
    stream.on('error', err => {
      reject(err);
    });
  });
};

module.exports = {
  signByToken,
  hashByFileReader,
  hashByReadableStream,
  hashByPassword
};
