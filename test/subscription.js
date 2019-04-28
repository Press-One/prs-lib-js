'use strict';

const assert = require('assert');
const should = require('chai').should();
const utility = require('prs-utility');
const { user, developer } = require('../fixtures');
const PRS = require('../lib');
const client = new PRS({
  env: 'env',
  debug: true,
  privateKey: utility.recoverPrivateKey(user.keystore, user.password),
  address: user.address
});

describe('Subscription', function () {
  it('get subscription json', async function () {
    try {
      const res = await client.subscription.getSubscriptionJson(user.address, { offset: 0, limit: 10 });
      should.exist(res.text);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get subscriptions', async function () {
    try {
      const res = await client.subscription.getSubscriptions(user.address, { offset: 0, limit: 10 });
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get subscripbers', async function () {
    try {
      const res = await client.subscription.getSubscribers(user.address, { offset: 0, limit: 10 });
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get recommendation json', async function () {
    try {
      const res = await client.subscription.getRecommendationJson({ offset: 0, limit: 10 });
      should.exist(res.text);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get recommendations', async function () {
    try {
      const res = await client.subscription.getRecommendations({ offset: 0, limit: 10 });
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('subscribe', async function () {
    try {
      ;
      const res = await client.subscription.subscribe(developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('check subscription', async function () {
    try {
      const res = await client.subscription.checkSubscription(user.address, developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('unsubscribe', async function () {
    try {
      const res = await client.subscription.unsubscribe(developer.address);
      should.exist(res.body);
    } catch (err) {
      assert.fail(err);
    }
  });
});
