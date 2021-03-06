'use strict';

const assert = require('assert');
const utility = require('prs-utility');
const { user } = require('../fixtures');
const PRS = require('../lib');

const prsEnv = process.env.ENV || 'env';

const client = new PRS({
  env: prsEnv,
  debug: true,
  privateKey: utility.recoverPrivateKey(user.keystore, user.password),
  address: user.address
});

let draftId = null;

describe('Draft', function () {
  it('create draft', async function () {
    try {
      let draft = {
        title: `draft title ${String(Date.now())}`,
        content: `draft content ${String(Date.now())}`,
        mimeType: 'text/plain'
      };
      const res = await client.draft.create(draft);
      res.status.should.equal(200);
      draftId = res.body.draftId;
    } catch (err) {
      assert.fail(err);
    }
  });

  it('update draft', async function () {
    try {
      let draft = {
        title: `draft update title ${String(Date.now())}`,
        content: `draft update content ${String(Date.now())}`,
        mimeType: 'text/plain'
      };
      const res = await client.draft.update(draftId, draft);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get draft by id', async function () {
    try {
      const res = await client.draft.getById(draftId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get drafts', async function () {
    try {
      const res = await client.draft.getDrafts({ limit: 1, offset: 0 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('delete draft', async function () {
    try {
      const res = await client.draft.delete(draftId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });
});
