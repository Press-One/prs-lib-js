'use strict';

const { request } = require('./request');
const validator = require('./validator');

module.exports = Finance;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Finance (config) {
  this.config = config;
}

/**
 *
 * @function getWallet
 *
 * @returns {Promise}
 */
Finance.prototype.getWallet = function () {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/finance/wallet`,
    authOpts: authOpts,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getTransactions
 * @param {Number} options.offset
 * @param {Number} options.limit
 *
 * @returns {Promise}
 */
Finance.prototype.getTransactions = function (options) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  const authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/finance/transactions`,
    query: options,
    authOpts: authOpts,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function withdraw
 * @param {Number} amount
 * @param {Object} options.header
 *
 * @returns {Promise}
 */
Finance.prototype.withdraw = function (amount, options) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  const authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  const payload = { amount };
  return request({
    host: this.config.getHost(),
    method: 'post',
    headers: options ? options.header : {},
    path: `finance/withdraw`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function recharge
 * @param {Number} amount
 *
 * @returns {Promise}
 */
Finance.prototype.recharge = function (amount) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let payload = { amount };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `finance/recharge`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};
