'use strict';

const { request } = require('./request');
const utility = require('prs-utility');
const validator = require('./validator');
const signUtility = require('./signUtility');

module.exports = Data;

/**
 * constructor
 *
 * @param {PRSConfig} config
 */
function Data (config) {
  this.config = config;
}


Data.prototype.sign = async function (blockData, type) {
  let sign = null;
  const authOpts = { privateKey: this.config.privateKey, token: this.config.token };
  if (authOpts.privateKey) {
    sign = utility.signBlockData(blockData, authOpts.privateKey);
  } else if (authOpts.token) {
    const res = await signUtility.signByToken(blockData, authOpts.token, this.config.getHost());
    sign = res.body;
  }
  //const address = utility.sigToAddress(sign.hash, sign.signature);


  let payload = {
    data : blockData.data,
    meta : blockData.meta,
    hash : sign.hash,
    type : type,
    signature: sign.signature
  };
    
  return request({
    host: this.config.getHost(),
    data: payload,
    method: 'post',
    path: '/datasign',
    debug: this.config.debug,
    onError: this.config.onApiError,
    onSuccess: this.config.onApiSuccess
  });
}

