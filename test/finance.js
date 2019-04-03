'use strict';

const assert = require('assert');
const should = require('chai').should();
const utility = require('prs-utility');
const PRS = require('../lib/prs');
const { user } = require('../fixtures');
const client = new PRS({
  env: 'env',
  debug: true,
  privateKey: utility.recoverPrivateKey(user.keystore, user.password),
  address: user.address
});

describe('Finance', function () {
  it('get wallet', async function () {
    try {
      const res = await client.finance.getWallet();
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get transactions', async function () {
    try {
      const res = await client.finance.getTransactions();
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('recharge', async function () {
    try {
      const res = await client.finance.recharge(1);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('withdraw', async function () {
    try {
      const res = await client.finance.withdraw(1);
      should.exist(res.body);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});
