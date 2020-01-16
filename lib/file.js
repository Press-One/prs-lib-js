"use strict";

const { request } = require("./request");
const utility = require("prs-utility");
const validator = require("./validator");
const signUtility = require("./signUtility");

module.exports = File;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function File(config) {
  this.config = config;
}

/**
 *
 * @function signByFileReader
 * @param {Object} data
 * @param {FileReader} data.file
 * @param {String} data.title
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * @param {Number} data.projectId
 * @param {String} data.alg
 * @param {Function} onUploadProgress
 * @param {Function} onHashProgress
 *
 * @returns {Promise}
 */
File.prototype.signByFileReader = async function(
  data,
  onUploadProgress = noop,
  onHashProgress = noop
) {
  validator.assert(data, "data cannot be null");
  validator.assert(data.file, "file cannot be null");
  validator.assert(
    data.file.type === "text/markdown" || data.file.type.startsWith("image"),
    `file type(${data.file.type}) is not supported`
  );
  validator.assert(data.title, "title cannot be null");

  validator.assert(
    this.config.privateKey || this.config.token,
    "config.privateKey or config.token cannot be null"
  );

  let alg = signUtility.ALG.KECCAK256;
  if (data.alg) {
    alg = data.alg;
    delete data.alg;
  }

  const authOpts = {
    privateKey: this.config.privateKey,
    token: this.config.token
  };
  const fileHash = await signUtility.hashByFileReader(
    data.file,
    onHashProgress,
    alg
  );
  const blockData = {
    file_hash: fileHash
  };

  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey, alg);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(
      blockData,
      authOpts.token,
      this.config.getHost()
    );
    sign = res.body;
  }
  const address = utility.sigToAddress(sign.hash, sign.signature);

  const fields = Object.assign({}, data, {
    address,
    signature: sign.signature,
    title: data.title
  });

  const fileData = {
    field: "file",
    file: data.file,
    filename: data.file.type.startsWith("image") ? fileHash : `${fileHash}.md`
  };
  console.log(fileData);

  return request({
    host: this.config.getHost(),
    method: "post",
    path: "/files",
    fileds: fields,
    fileData: fileData,
    debug: this.config.debug,
    onProgress: e => {
      if (e.direction === "upload") onUploadProgress(e);
    },
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function signByStream
 * @param {Object} data
 * @param {ReadableStream} data.stream
 * @param {String} data.filename
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * @param {Number} data.projectId
 * @param {String} data.alg
 * @param {Object} meta
 *
 * @returns {Promise}
 */
File.prototype.signByStream = async function(data, meta) {
  validator.assert(data, "data cannot be null");
  validator.assert(data.stream, "stream cannot be null");
  validator.assert(data.filename, "filename cannot be null");
  validator.assert(data.title, "title cannot be null");

  validator.assert(
    this.config.privateKey || this.config.token,
    "config.privateKey or config.token cannot be null"
  );

  let alg = signUtility.ALG.KECCAK256;
  if (data.alg) {
    alg = data.alg;
    delete data.alg;
  }

  meta = omitSignData(meta || {});

  let authOpts = {
    privateKey: this.config.privateKey,
    token: this.config.token
  };
  const { buffer, fileHash } = await signUtility.hashByReadableStream(
    data.stream,
    alg
  );
  let blockData = {
    file_hash: fileHash
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey, alg);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(
      blockData,
      authOpts.token,
      this.config.getHost()
    );
    sign = res.body;
  }
  const address = utility.sigToAddress(sign.hash, sign.signature);
  let fields = {
    address,
    signature: sign.signature,
    title: data.title
  };
  if (data.source) {
    fields["source"] = data.source;
  }
  if (data.originUrl) {
    fields["originUrl"] = data.originUrl;
  }
  if (data.category) {
    fields["category"] = data.category;
  }
  if (data.projectId != null) {
    fields["projectId"] = data.projectId;
  }
  fields = Object.assign(fields, meta);

  let fileData = {
    field: "file",
    file: buffer,
    filename: data.filename
  };
  return request({
    host: this.config.getHost(),
    method: "post",
    path: "/files",
    fileds: fields,
    fileData: fileData,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function signByBuffer
 * @param {Object} data
 * @param {Buffer} data.buffer
 * @param {String} data.filename
 * @param {String} data.source
 * @param {String} data.originUrl
 * @param {String} data.category
 * @param {Number} data.projectId
 * @param {String} data.alg
 * @param {Object} meta
 *
 * @returns {Promise}
 */
File.prototype.signByBuffer = async function(data, meta) {
  validator.assert(data, "data cannot be null");
  validator.assert(data.buffer, "buffer cannot be null");
  validator.assert(data.filename, "filename cannot be null");
  validator.assert(data.title, "title cannot be null");

  validator.assert(
    this.config.privateKey || this.config.token,
    "config.privateKey or config.token cannot be null"
  );

  let alg = signUtility.ALG.KECCAK256;
  if (data.alg) {
    alg = data.alg;
    delete data.alg;
  }

  meta = omitSignData(meta || {});

  let authOpts = {
    privateKey: this.config.privateKey,
    token: this.config.token
  };

  const fileHash = signUtility.hashBuffer(data.buffer, alg);
  let blockData = {
    file_hash: fileHash
  };
  let sign = null;
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey, alg);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(
      blockData,
      authOpts.token,
      this.config.getHost()
    );
    sign = res.body;
  }
  const address = utility.sigToAddress(sign.hash, sign.signature);

  let fields = {
    address,
    signature: sign.signature,
    title: data.title
  };
  if (data.source) {
    fields["source"] = data.source;
  }
  if (data.originUrl) {
    fields["originUrl"] = data.originUrl;
  }
  if (data.category) {
    fields["category"] = data.category;
  }
  if (data.projectId != null) {
    fields["projectId"] = data.projectId;
  }
  fields = Object.assign(fields, meta);

  let fileData = {
    field: "file",
    file: data.buffer,
    filename: data.filename
  };

  return request({
    host: this.config.getHost(),
    method: "post",
    path: "/files",
    fileds: fields,
    fileData: fileData,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getByRId
 * @param {String} rId
 * @param {Number} options.rewardersLimit
 * @param {Boolean} options.withUser
 * @returns {Promise}
 */
File.prototype.getByRId = function(rId, options) {
  validator.assert(rId, "rId cannot be null");
  const authOpts = {
    privateKey: this.config.privateKey,
    token: this.config.token
  };
  return request({
    host: this.config.getHost(),
    method: "get",
    path: `/files/${rId}`,
    query: options,
    debug: this.config.debug,
    authOpts: authOpts,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getByMsghash
 * @param {String} msghash
 * @param {Number} options.rewardersLimit
 * @param {Boolean} options.withUser
 * @returns {Promise}
 */
File.prototype.getByMsghash = function(msghash, options) {
  validator.assert(msghash, "msghash cannot be null");
  const authOpts = {
    privateKey: this.config.privateKey,
    token: this.config.token
  };
  return request({
    host: this.config.getHost(),
    method: "get",
    path: `/files/hash/${msghash}`,
    query: options,
    debug: this.config.debug,
    authOpts: authOpts,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function reward
 * @param {String} rId
 * @param {Number} amount
 * @param {String} options.memo
 * @param {String} options.comment <= 255
 * @param {Object} options.header
 * @returns {Promise}
 */
File.prototype.reward = function(rId, amount, options) {
  validator.assert(rId, "rId cannot be null");
  validator.assert(amount, "amount cannot be null");
  validator.assert(
    this.config.privateKey || this.config.token,
    "config.privateKey or config.token cannot be null"
  );
  const authOpts = {
    privateKey: this.config.privateKey,
    token: this.config.token
  };

  const payload = Object.assign({}, { amount }, options);
  delete payload.header;

  const header = options ? options.header : {};
  return request({
    host: this.config.getHost(),
    method: "post",
    path: `/files/${rId}/reward`,
    data: { payload },
    headers: header,
    debug: this.config.debug,
    authOpts: authOpts,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getFeeds
 * @param {String} address
 * @param {Number} options.offset
 * @param {Number} options.limit
 *
 * @returns {Promise}
 */
File.prototype.getFeeds = function(address, options) {
  validator.assert(address, "address cannot be null");

  return request({
    host: this.config.getHost(),
    method: "get",
    path: `/users/${address}/feed.json`,
    query: options,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

function omitSignData(data) {
  const omitKeys = [
    "address",
    "signature",
    "fileHash",
    "title",
    "source",
    "originUrl",
    "category",
    "projectId"
  ];
  let omitData = {};
  Object.keys(data)
    .filter(k => !omitKeys.includes(k))
    .forEach(k => {
      omitData[k] = data[k];
    });
  return omitData;
}

function noop() {}
