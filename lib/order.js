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
 * @function createOrder
 * @param {String} contractRId
 * @param {String} fileRId
 * @param {String} licenseType
 *
 * @returns {Promise}
 */
Order.prototype.createOrder = function (contractRId, fileRId, licenseType) {
  validator.assert(contractRId, 'contractRId cannot be null');
  validator.assert(fileRId, 'fileRId cannot be null');
  validator.assert(licenseType, 'licenseType cannot be null');
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };

  let payload = {
    contractRId: contractRId,
    fileRId: fileRId,
    licenseType: licenseType
  };

  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/orders`,
    data: { payload },
    debug: this.config.debug,
    authOpts: authOpts
  });
};

/**
 *
 * @function getOrdersByContractRId
 * @param {String} contractRId
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 *
 * @returns {Promise}
 */
Order.prototype.getOrdersByContractRId = function (contractRId, pageOpts) {
  validator.assert(contractRId, 'contractRId cannot be null');
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
    path: `/contracts/${contractRId}/orders`,
    query: query,
    debug: this.config.debug,
    authOpts: authOpts
  });
};

/**
 *
 * @function getPurchasedOrders
 * @param {Object} pageOpts
 * @param {Number} pageOpts.offset
 * @param {Number} pageOpts.limit
 *
 * @returns {Promise}
 */
Order.prototype.getPurchasedOrders = function (pageOpts) {
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
    path: `/orders`,
    query: query,
    debug: this.config.debug,
    authOpts: authOpts
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
    authOpts: authOpts
  });
};
