'use strict';

const { request } = require('./request');
const validator = require('./validator');

module.exports = Subscription;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Subscription (config) {
  this.config = config;
}

/**
 *
 * @function getSubscriptionJson
 * @param {String} address
 * @param {Number} options.offset
 * @param {Number} options.limit
 * @param {Boolean} options.asCount
 * @param {Boolean} options.isPersonal
 * @param {String} options.accountType
 *
 * @returns {Promise}
 */
Subscription.prototype.getSubscriptionJson = function (address, options) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${address}/subscription.json`,
    query: options,
    headers: { 'Content-Type': 'application/json' },
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getSubscriptions
 * @param {String} address
 * @param {Number} options.offset
 * @param {Number} options.limit
 * @param {Boolean} options.asCount
 * @param {Boolean} options.isPersonal
 * @param {String} options.accountType
 *
 * @returns {Promise}
 */
Subscription.prototype.getSubscriptions = function (address, options) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${address}/subscription`,
    query: options,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getSubscribers
 * @param {String} address
 * @param {Number} options.offset
 * @param {Number} options.limit
 *
 * @returns {Promise}
 */
Subscription.prototype.getSubscribers = function (address, options) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${address}/subscribers`,
    query: options,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getRecommendationJson
 * @param {Number} options.offset
 * @param {Number} options.limit
 *
 * @returns {Promise}
 */
Subscription.prototype.getRecommendationJson = function (options) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `feeds/recommendation.json`,
    query: options,
    headers: { 'Content-Type': 'application/json' },
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function getRecommendations
 * @param {Number} options.offset
 * @param {Number} options.limit
 *
 * @returns {Promise}
 */
Subscription.prototype.getRecommendations = function (options) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/feeds/recommendation`,
    query: options,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function subscribe
 * @param {String} address
 *
 * @returns {Promise}
 */
Subscription.prototype.subscribe = function (address) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let payload = { 'subscription_address': address };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: `/subscription/${address}`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function unsubscribe
 * @param {String} address
 *
 * @returns {Promise}
 */
Subscription.prototype.unsubscribe = function (address) {
  validator.assert(this.config.privateKey || this.config.token, 'config.privateKey or config.token cannot be null');
  let authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  let payload = { 'subscription_address': address };
  return request({
    host: this.config.getHost(),
    method: 'delete',
    path: `/subscription/${address}`,
    data: { payload },
    authOpts: authOpts,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};

/**
 *
 * @function checkSubscription
 * @param {String} subscriberAddress
 * @param {String} publisherAddress
 *
 * @returns {Promise}
 */
Subscription.prototype.checkSubscription = function (subscriberAddress, publisherAddress) {
  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/users/${subscriberAddress}/subscription/${publisherAddress}`,
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};
