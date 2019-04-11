'use strict';

const assert = require('assert');
const should = require('chai').should();
const { user } = require('../fixtures');
const PRS = require('../lib');
const client = new PRS({ env: 'env', debug: true });

describe('Keystore', function () {
  it('get keystore', async function () {
    try {
      const res = await client.keystore.getByEmail(user.email, user.password);
      const keystore = res.body.keystore;
      should.exist(keystore);
    } catch (err) {
      console.log(err);
      assert.fail(err);
    }
  });
});
