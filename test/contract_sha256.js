'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const should = require('chai').should();
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

const SHA256_HASH_ALG = 'sha256';

let contractRId = null;
let fileRId = null;
let markdownFileUrl = null;

before(function () {
  const markdownFile = `../${String(Date.now())}.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now()), 'utf-8');
});

after(function () {
  fs.unlinkSync(markdownFileUrl);
});

describe('Contracts', function () {
  it('get templages', async function () {
    try {
      const res = await client.contract.getTemplates();
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('create contract', async function () {
    this.timeout(1000 * 200);
    try {
      const code = `PRSC Ver 0.1
  Name 购买授权
  Desc 这是一个\\n测试合约
  Receiver ${user.address}
  License usage1 ${process.env.ENV === 'prod' ? 'PRS' : 'CNB'}:0.001 Terms: 这是个人使用条款，禁止\\n商业应用。
  License usage2 ${process.env.ENV === 'prod' ? 'PRS' : 'CNB'}:0.002 Terms: 这是商业使用条款，允许\\n修改和复制。`;
      const res = await client.contract.create(code, SHA256_HASH_ALG);
      contractRId = res.body.contract.rId;
      should.exist(contractRId);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('sign text/markdown file', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl);
      let data = { stream: stream, filename: 'xxx.md', title: 'xxx', hashAlg: SHA256_HASH_ALG };
      const res = await client.file.signByStream(data);
      fileRId = res.body.cache.rId;
      should.exist(fileRId);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('bind contract', async function () {
    try {
      const res = await client.contract.bind({
        contractRId,
        fileRId,
        beneficiaryAddress: user.address
      }, SHA256_HASH_ALG);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });
});