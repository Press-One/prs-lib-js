'use strict';

const User = require('./user');
const Keystore = require('./keystore');
const Config = require('./config');
const Subscription = require('./subscription');
const Finance = require('./finance');
const File = require('./file');
const Block = require('./block');
const Draft = require('./draft');
const Contract = require('./contract');
const Order = require('./order');
const DApp = require('./dapp');
const signUtility = require('./signUtility');
const { hashRequest, signRequest, getAuthHeader } = require('./request');

module.exports = PRS;

/**
 *
 * constructor
 * @param {Object} options
 * @param {string} options.env
 * @param {boolean} options.debug
 * @param {string} options.privateKey
 * @param {string} options.token
 * @param {string} options.address
 * @param {Function} options.onApiError
 * @param {Function} options.onApiSuccess
 */
function PRS (options) {
  this.config = new Config(options);

  this.keystore = new Keystore(this.config);
  this.user = new User(this.config);
  this.subscription = new Subscription(this.config);
  this.finance = new Finance(this.config);
  this.file = new File(this.config);
  this.block = new Block(this.config);
  this.draft = new Draft(this.config);
  this.contract = new Contract(this.config);
  this.order = new Order(this.config);
  this.dapp = new DApp(this.config);
}

// static method
PRS.util = Object.assign({}, signUtility, {
  hashRequest,
  signRequest,
  getAuthHeader
});
