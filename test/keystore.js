'use strict';

const assert = require('assert');
const should = require('chai').should();
const { user } = require('../fixtures');
const PRS = require('../lib');

const prsEnv = process.env.ENV || 'env';

const client = new PRS({ env: prsEnv, debug: true });

describe('Keystore', function () {
  it('get keystore', async function () {
    try {
      const res = await client.keystore.loginByEmail(user.email, user.password);
      const keystore = res.body.keystore;
      should.exist(keystore);
    } catch (err) {
      console.log(err);
      assert.fail(err);
    }
  });
});
