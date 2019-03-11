'use strict';

const ethUtil = require('ethereumjs-util');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const jsSha3 = require('js-sha3');
const keythereum = require('keythereum');
const ec = new require('elliptic').ec('secp256k1');
const qs = require('qs');

class File {
  constructor(file) {
    this.file = file;
  }

  _read(chunk) {
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(chunk);
      fr.onload = (event) => {
        resolve(event.target.result);
      };
    });
  };

  async calc(progressCallback) {
    let sha = null; let lastOffset = 0; let offset = 0;
    const size = this.file.size;
    const chunk = 1024 * 1024 * 2;
    while (1) {
      let last = false;
      offset += chunk;
      if (offset > size - 1) {
        offset = size;
        last = true;
      }
      const data = await this._read(this.file.slice(lastOffset, offset));
      if (progressCallback) progressCallback(Number((offset / size * 100).toFixed(2)));
      sha = (sha || jsSha3.keccak256).update(data);
      if (last) break;
      lastOffset = offset;
    }
    return sha.hex();
  };
}

const hashByFileReader = async (file, progressCallback) => {
  const _file = new File(file);
  const msghash = await _file.calc(progressCallback);
  return msghash;
};

const hashByReadableStream = async (stream) => {
  return new Promise((resolve, reject) => {
    let sha;
    let chunk = Buffer.from([]);
    stream.on('data', data => {
      chunk = Buffer.concat([chunk, data]);
      sha = (sha || jsSha3.keccak256).update(data);
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


const hashPassword = (email, password) => {
  const msghash = keccak256(password + email);
  return msghash;
}


let dumpKey = (buffer) => {
  return buffer.toString('hex');
};

let recoverKey = (string) => {
  return Buffer.from(string, 'hex');
};

let fetchKey = (buffer, options = {}) => {
  return options.dump ? dumpKey(buffer) : buffer;
};

let getPubaddressBySigAndMsghash = (sig, msghash) => {
  var v = Number(sig.slice(128));
  var sigbuff = recoverKey(sig.slice(0, 128));
  var senderPubKey = secp256k1.recover(recoverKey(msghash), sigbuff, v);
  var publickey = secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
  return dumpKey(ethUtil.pubToAddress(publickey));
};

let keccak256 = (message) => {
  return jsSha3.keccak256(message);
};

let sha256 = (string) => {
  return crypto.createHash('sha256').update(string, 'utf8').digest('hex');
};

let createPrivateKey = (options = {}) => {
  let privateKey;
  do {
    privateKey = crypto.randomBytes(32)
  } while (!secp256k1.privateKeyVerify(privateKey))
  return fetchKey(privateKey, options);
};

let createPublicKeyByPrivateKey = (privateKey, options = {}) => {
  return fetchKey(secp256k1.publicKeyCreate(privateKey), options);
};

let createKeyPair = (options = {}) => {
  let privateKey = createPrivateKey();
  let publishKey = createPublicKeyByPrivateKey(privateKey);
  let convertKey = secp256k1.publicKeyConvert(publishKey, false).slice(1);
  let publishAdd = ethUtil.pubToAddress(convertKey);
  return {
    privateKey: fetchKey(privateKey, options),
    publishKey: fetchKey(publishKey, options),
    address: fetchKey(publishAdd, options),
  };
};

const sortedToQueryString = (obj) => {
  const _obj = Object.create(null);
  const sortedKeys = Object.keys(obj).sort();
  for (const key of sortedKeys) {
    _obj[key] = obj[key];
  }
  return qs.stringify(_obj);
};

const calcObjectHash = (obj) => {
  const data = sortedToQueryString(obj);
  const hash = keccak256(data);
  return hash;
};

const calcRequestHash = (path, payload) => {
  const prefix = qs.stringify({ path });
  const sortedQS = sortedToQueryString(payload || {});
  const dataStr = `${prefix}${sortedQS ? '&' : ''}${sortedQS}`;
  const hash = keccak256(dataStr);
  return hash;
};

const getAuthSignature = (path, payload, privateKey) => {
  const hash = calcRequestHash(path, payload);
  const { sig } = signByMsghash(hash, privateKey);
  return {
    hash,
    signature: sig,
  };
};

const signByMsghash = (msghash, privatekey) => {
  const existingPrivKey = ec.keyFromPrivate(privatekey, 'hex');
  const signature = existingPrivKey.sign(msghash);
  const combinedHex = signature.r.toString(16, 32) + signature.s.toString(16, 32) + signature.recoveryParam.toString();
  return { sig: combinedHex, msghash: msghash };
};

const getAuthHeader = (path, payload, privateKey) => {
  const sign = getAuthSignature(path, payload, privateKey);
  const address = signToPubAddress(sign.hash, sign.signature);
  return {
    'Content-Type': 'application/json',
    'X-Po-Auth-Address': address,
    'X-Po-Auth-Sig': sign.signature,
    'X-Po-Auth-Msghash': sign.hash,
  };
};

const signBlockData = (data, privateKey) => {
  const hash = calcObjectHash(data);
  const { sig } = signByMsghash(hash, privateKey);
  return {
    hash,
    signature: sig,
  };
};

const recoverPrivateKey = (keystore, password) => {
  const privateKey = keythereum.recover(password, JSON.parse(keystore));
  return buf2hex(privateKey);
}

const buf2hex = buffer => {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
};

const signToPubAddress = (msghash, sig) => {
  const v = Number(sig.slice(128));
  const sigbuff = recoverKey(sig.slice(0, 128));
  const senderPubKey = secp256k1.recover(recoverKey(msghash), sigbuff, v);
  const publickey = secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
  return dumpKey(ethUtil.pubToAddress(publickey));
};

const privateKeyToAddress = (privateKey) => {
  return keythereum.privateKeyToAddress(privateKey).slice(2);
}

module.exports = {
  getPubaddressBySigAndMsghash,
  keccak256,
  sha256,
  createKeyPair,
  hashPassword,
  recoverPrivateKey,
  getAuthHeader,
  signBlockData,
  signToPubAddress,
  privateKeyToAddress,
  hashByFileReader,
  hashByReadableStream
};
