'use strict';

const { request } = require('./request');
const validator = require('./validator');

module.exports = Block;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Block (config) {
  this.config = config;
}

/**
 *
 * @function getByRIds
 * @param {Array} rIds
 * @param {Boolean} withDetail
 *
 * @returns {Promise}
 */
Block.prototype.getByRIds = function (rIds, withDetail = false) {
  validator.assert(rIds, 'rIds cannot be null');

  return request({
    host: this.config.getHost(),
    method: 'get',
    path: `/blocks/${rIds.join(',')}`,
    query: withDetail ? { withDetail } : {},
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
};
