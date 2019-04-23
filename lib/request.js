'use strict';

const agent = require('superagent');
const qs = require('qs');
const utility = require('prs-utility');

const hashRequest = (path, payload) => {
  // calculate hash
  // standard of pressone api, this can be modified
  const prefix = qs.stringify({ path });
  const sortedQS = utility.getSortedQS(payload || {});
  const dataStr = `${prefix}${sortedQS ? '&' : ''}${sortedQS}`;
  return utility.keccak256(dataStr);
};

const signRequest = (path, payload, privateKey) => utility.signHash(
  hashRequest(path, payload),
  privateKey
);

const getAuthHeader = (path, payload, privateKey) => {
  // sign hash
  const { signature, hash } = signRequest(path, payload, privateKey);
  const address = utility.sigToAddress(hash, signature);

  return {
    'Content-Type': 'application/json',
    'X-Po-Auth-Address': address,
    'X-Po-Auth-Sig': signature,
    'X-Po-Auth-Msghash': hash
  };
};

const createApiUrl = ({
  host,
  version = 'v2',
  path
}) => {
  let apiURL = host;

  if (apiURL.charAt(apiURL.length - 1) !== '/') {
    apiURL += '/';
  }
  apiURL += 'api';
  if (version !== 'v1') {
    apiURL += `/${version}`;
  }
  if (path) {
    apiURL += path;
  }

  return apiURL;
};

const createApiPath = (path, query) => {
  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }

  const queryString = qs.stringify(query, {
    indices: false,
    strictNullHandling: true
  });
  if (query) {
    path = path + '?' + queryString;
  }
  return path;
};

/**
 *
 * @function request
 * @param {Object} options
 * @param {String} options.host
 * @param {String} options.version
 * @param {String} options.method
 * @param {String} options.path
 * @param {Object} [options.query]
 * @param {Object} [options.data]
 * @param {Object} [options.headers]
 * @param {Object} [options.authOpts]
 * @param {String} [options.authOpts.privateKey]
 * @param {String} [options.authOpts.token]
 * @param {Boolean} [options.debug]
 * @param {Number} [options.timeout]
 * @param {Function} [options.onError]
 * @param {Function} [options.onSuccess]
 */
const request = ({
  host,
  version = 'v2',
  method,
  path,
  query,
  data,
  headers,
  authOpts,
  fileds,
  fileData,
  debug = false,
  onprogress,
  timeout,
  onError,
  onSuccess
}) => {
  path = createApiPath(path, query);
  const url = createApiUrl({ host, version, path });
  if (authOpts && authOpts.privateKey) {
    let payload = data && data.payload;
    headers = Object.assign({}, headers, getAuthHeader(path, payload || undefined, authOpts.privateKey));
  } else if (authOpts && authOpts.token) {
    headers = Object.assign({}, headers, { 'authorization': `Bearer ${authOpts.token}` });
  }
  return new Promise((resolve, reject) => {
    let req = agent(method, url);
    if (headers) {
      req.set(headers);
    }
    if (data) {
      req.send(data);
    }
    if (onprogress) {
      req.on('progress', onprogress);
    }
    if (timeout) {
      req.timeout(timeout);
    }
    if (fileds) {
      req.field(fileds);
    }
    if (fileData && fileData.field && fileData.file && fileData.filename) {
      req.attach(fileData.field, fileData.file, fileData.filename);
    }
    req.end((err, res) => {
      if (err) {
        if (res) {
          if (debug) {
            console.log(
              'request %s %s %o %o %o',
              method,
              url,
              JSON.stringify(query),
              JSON.stringify(data),
              JSON.stringify(headers)
            );

            console.log(
              'response %d %O %o',
              res.status,
              JSON.stringify(res.body || res.text),
              res.header
            );
          }
          err.statusCode = res.status;
          err.responseText = res.text;
          err.response = res.body;
        }
        if (onError) {
          return resolve(onError(err, res));
        } else {
          return reject(err);
        }
      }
      if (debug) {
        console.log('request url: ' + url);
        console.log(
          'response %d %O %o',
          res.status,
          JSON.stringify(res.body || res.text),
          JSON.stringify(res.header)
        );
      }
      return onSuccess ? resolve(onSuccess(res)) : resolve(res);
    });
  });
};

module.exports = {
  request,
  hashRequest,
  signRequest,
  getAuthHeader
};
