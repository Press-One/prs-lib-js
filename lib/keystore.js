'use strict';

const { request } = require('./request');
const { hashByPassword } = require('./signUtility');

module.exports = Keystore;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Keystore (config) {
  this.config = config;
}

/**
 *
 * @function getByEmail
 * @param {String} email
 * @param {String} password
 *
 * @returns {Promise}
 */
Keystore.prototype.getByEmail = function (email, password) {
  const payload = {
    email,
    passwordHash: hashByPassword(email, password)
  };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/keystore/login/email',
    data: { payload },
    headers: { Accept: 'application/json' },
    debug: this.config.debug
  });
};

/**
 *
 * @function getByPhone
 * @param {String} phone
 * @param {String} code
 *
 * @returns {Promise}
 */
Keystore.prototype.getByPhone = function (phone, code) {
  const payload = {
    phone,
    code
  };
  return request({
    host: this.config.getHost(),
    method: 'post',
    path: '/keystore/login/phone',
    data: { payload },
    headers: { Accept: 'application/json' },
    debug: this.config.debug
  });
};
