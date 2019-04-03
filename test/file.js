'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const utility = require('prs-utility');
const { user, buyer } = require('../fixtures');
const PRS = require('../lib/prs');
const client = new PRS({
  env: 'env',
  debug: true,
  privateKey: utility.recoverPrivateKey(user.keystore, user.password),
  address: user.address
});

let fileHash = null;
let fileRId = null;

let markdownFileUrl = null;
let markdownFileUrl2 = null;

before(function () {
  const markdownFile = `../${String(Date.now())}_file.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now() + 'file'), 'utf-8');

  const markdownFile2 = `../${String(Date.now())}_file2.md`;
  markdownFileUrl2 = path.join(__dirname, markdownFile2);
  fs.writeFileSync(markdownFileUrl2, String(Date.now() + 'file2'), 'utf-8');
});

after(function () {
  fs.unlinkSync(markdownFileUrl);
  fs.unlinkSync(markdownFileUrl2);
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
      assert.fail(err);
    }
  });

  it('sign file with meta', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl2);
      let data = { stream: stream, filename: 'text.md', title: 'xxx' };
      let meta = { uuid: 'xxxxxxx' };
      const res = await client.file.signByStream(data, meta);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get file by rId', async function () {
    try {
      const res = await client.file.getByRId(fileRId);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get file by msghash', async function () {
    try {
      const res = await client.file.getByMsghash(fileHash);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('reward', async function () {
    try {
      const buyClient = new PRS({ env: 'env', debug: true, privateKey: utility.recoverPrivateKey(buyer.keystore, buyer.password), address: buyer.address });
      const res = await buyClient.file.reward(fileRId, 1, 'hello');
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get files', async function () {
    try {
      const res = await client.file.getFilesByAddress(user.address, { offset: 0, limit: 10 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });
});
