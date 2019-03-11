'use strict';

const assert = require('assert');
const { user, buyer } = require('../fixtures');
const utility = require('prs-utility');
const PRS = require('../lib/prs');
const client = new PRS({ env: 'env', debug: true, privateKey: utility.recoverPrivateKey(user.keystore, user.password), address: user.address });

const fs = require('fs');
const path = require('path');

let fileHash = null;
let fileRId = null;

let markdownFileUrl = null;

before(function () {
  const markdownFile = `../${String(Date.now())}_file.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now() + 'file'), 'utf-8');
});

after(function () {
  fs.unlinkSync(markdownFileUrl)
});

describe('File', function () {
  it('sign file', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl);
      let data = { stream: stream, filename: 'text.md', title: 'xxx' };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
      fileHash = res.body.cache.msghash;
      fileRId = res.body.cache.rId;
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by rId', async function () {
    try {
      const res = await client.file.getByRId(fileRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('get file by msghash', async function () {
    try {
      const res = await client.file.getByMsghash(fileHash);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });

  it('reward', async function () {
    try {
      const buyClient = new PRS({ env: 'env', debug: true, privateKey: utility.recoverPrivateKey(buyer.keystore, buyer.password), address: buyer.address });
      const res = await buyClient.file.reward(fileRId, 1, 'hello');
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(JSON.stringify(err.response));
    }
  });
});