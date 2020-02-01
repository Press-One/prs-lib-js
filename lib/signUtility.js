"use strict";

const { request } = require("./request");
const validator = require("./validator");
const { keccak256, SHA256, bufToWordArray } = require("prs-utility");

const ALG = {
  KECCAK256: "keccak256",
  SHA256: "sha256"
};

const hashBuffer = (buffer, alg) => {
  if (alg === ALG.KECCAK256) {
    return keccak256(buffer);
  }
  if (alg === ALG.SHA256) {
    return SHA256(buffer).toString();
  }
  throw new Error(`Unsupported alg: ${alg}`);
};

// FIXME: 服务器签名可能也需要支持自定义 hash
const signByToken = async (data, token, host) => {
  validator.assert(data, "data cannot be null");
  validator.assert(token, "token cannot be null");
  let payload = { data };
  return request({
    host: host,
    method: "post",
    path: `/sign`,
    data: { payload },
    authOpts: { token }
  });
};

const hashByPassword = (email, password) => keccak256(password + email);

class FileHasher {
  constructor(file) {
    this.file = file;
  }

  _read(chunk) {
    return new Promise(resolve => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(chunk);
      fr.onload = event => {
        resolve(event.target.result);
      };
    });
  }

  async calc(progressCallback, alg = ALG.KECCAK256) {
    let sha = null;
    if (alg === ALG.KECCAK256) {
      sha = keccak256;
    }
    if (alg === ALG.SHA256) {
      sha = SHA256.create();
    }
    if (!sha) {
      throw new Error(`invalid alg ${alg}`);
    }
    let lastOffset = 0;
    let offset = 0;
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
      if (progressCallback)
        progressCallback(Number(((offset / size) * 100).toFixed(2)));
      sha = updateHasher(sha, data, alg);
      lastOffset = offset;
    }
    if (alg === ALG.KECCAK256) {
      return sha.hex();
    }
    if (alg === ALG.SHA256) {
      return sha.finalize().toString();
    }
  }
}

const hashByFileReader = async (
  file,
  progressCallback,
  alg = ALG.KECCAK256
) => {
  const _file = new FileHasher(file);
  const msghash = await _file.calc(progressCallback, alg);
  return msghash;
};

async function hashByReadableStream(stream, alg = ALG.KECCAK256) {
  let sha = createHasher(alg);
  return new Promise((resolve, reject) => {
    let chunk = Buffer.from([]);
    stream.on("data", data => {
      chunk = Buffer.concat([chunk, data]);
      updateHasher(sha, data, alg);
    });
    stream.on("end", async () => {
      const fileHash = finalizeHasher(sha, alg);
      resolve({
        buffer: chunk,
        fileHash
      });
    });
    stream.on("error", err => {
      reject(err);
    });
  });
}

function createHasher(alg = ALG.KECCAK256) {
  if (alg === ALG.KECCAK256) {
    return keccak256;
  }
  if (alg === ALG.SHA256) {
    return SHA256.create();
  }
  throw new Error(`invalid alg ${alg}`);
}

function updateHasher(hasher, data, alg = ALG.KECCAK256) {
  if (alg === ALG.KECCAK256) {
    hasher = hasher.update(data);
  }
  if (alg === ALG.SHA256) {
    hasher.update(bufToWordArray(data));
  }
}

function finalizeHasher(hasher, alg = ALG.KECCAK256) {
  if (alg === ALG.KECCAK256) {
    return hasher.hex();
  }
  if (alg === ALG.SHA256) {
    return hasher.finalize().toString();
  }
  throw new Error(`invalid alg ${alg}`);
}

module.exports = {
  signByToken,
  hashByFileReader,
  hashByReadableStream,
  hashByPassword,
  hashBuffer,
  ALG
};
