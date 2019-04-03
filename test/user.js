'use strict';

const assert = require('assert');
const should = require('chai').should();
const utility = require('prs-utility');
const { user, avatarBase64String } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({
  env: 'env',
  debug: true,
  privateKey: utility.recoverPrivateKey(user.keystore, user.password),
  address: user.address
});

describe('User', function () {
  it('get profile', async function () {
    try {
      const res = await client.user.getByAddress(user.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('edit profile', async function () {
    try {
      const name = `pressone test ${String(Date.now())}`;
      let profile = {
        name: name,
        title: 'test title'
      };
      const res = await client.user.editProfile(profile);
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('upload avatar', async function () {
    this.timeout(1000 * 200);
    try {
      const res = await client.user.uploadAvatar(avatarBase64String);
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });
});
