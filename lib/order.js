'use strict';

const { request } = require('./request');
const validator = require('./validator');
module.exports = Order;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Order (config) {
  this.config = config;
}

/**
 *
 * @function create
 * @param {String} data.contractRId
 * @param {String} data.fileRId
 * @param {String} data.licenseType
 *
 * @returns {Promise}
 */
Order.prototype.create = function (data) {
  validator.assert(data, 'contractRId cannot be null');
  const { contractRId, fileRId, licenseType } = data;
  validator.assert(contractRId, 'contractRId cannot be null');
  validator.assert(fileRId, 'fileRId cannot be null');
  validator.assert(licenseType, 'licenseType cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  const authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/orders`,
    data: { payload: data },
    debug: this.config.debug,
    authOpts: authOpts,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getOrdersByContractRId
 * @param {String} contractRId
 * @param {Number} options.offset
 * @param {Number} options.limit
 *
 * @returns {Promise}
 */
Order.prototype.getOrdersByContractRId = function (contractRId, options) {
  validator.assert(contractRId, 'contractRId cannot be null');
  const authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/contracts/${contractRId}/orders`,
    query: options,
    debug: this.config.debug,
    authOpts: authOpts,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getPurchasedOrders
 * @param {Number} options.offset
 * @param {Number} options.limit
 * @param {String} options.type optional ['image' | 'text']
 *
 * @returns {Promise}
 */
Order.prototype.getPurchasedOrders = function (options) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  const authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/orders`,
    query: options,
    debug: this.config.debug,
    authOpts: authOpts,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 * @function getOrderByRId
 * @param {String} rId
 *
 * @returns {Promise}
 */
Order.prototype.getOrderByRId = function (rId) {
  validator.assert(rId, 'order rId cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/orders/${rId}`,
    debug: this.config.debug,
    authOpts: authOpts,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};
