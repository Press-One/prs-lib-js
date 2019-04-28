'use strict';

const HOST_RELEASE = 'https://press.one';
const HOST_DEV = 'https://beta.press.one';

module.exports = PRSConfig;

const defaultOptions = {
  env: 'prod',
  debug: false
};

/**
 *
 * constructor
 * @param {Object} options
 * @param {string} options.env
 * @param {boolean} options.debug
 * @param {string} options.privateKey
 * @param {string} options.token
 * @param {string} options.address
 * @param {string} options.host
 * @param {Function} options.onApiError
 * @param {Function} options.onApiSuccess
 */
function PRSConfig (options = defaultOptions) {
  const {
    env,
    debug,
    privateKey,
    token,
    address,
    host,
    onApiError,
    onApiSuccess
  } = Object.assign({}, defaultOptions, options);
  this.env = env;
  this.debug = debug;
  this.privateKey = privateKey;
  this.token = token;
  this.address = address;
  this.host = host;
  this.onApiError = onApiError;
  this.onApiSuccess = onApiSuccess;
}

PRSConfig.prototype.getHost = function () {
  if (this.host) return this.host;
  return this.env === 'prod' ? HOST_RELEASE : HOST_DEV;
};
