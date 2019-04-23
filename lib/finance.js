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
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 *
 * @returns {Promise}
 */
Finance.prototype.getTransactions = function (pageOpts) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let query = {};
  if (pageOpts) {
    if (pageOpts.offset != null) {
      query['offset'] = pageOpts.offset;
    }
    if (pageOpts.limit != null) {
      query['limit'] = pageOpts.limit;
    }
  }

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/finance/transactions`,
    query: query,
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
 *
 * @returns {Promise}
 */
Finance.prototype.withdraw = function (amount) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let payload = { amount };
  return request({
    host: this.config.getHost(),
    method: 'post',
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
