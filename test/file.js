'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const utility = require('prs-utility');
const { user, buyer } = require('../fixtures');
const PRS = require('../lib');
const PNG = require('pngjs').PNG;
const jpeg = require('jpeg-js');
const prsEnv = process.env.ENV || 'env';

const client = new PRS({
  env: prsEnv,
  debug: true,
  privateKey: utility.recoverPrivateKey(user.keystore, user.password),
  address: user.address
});

let fileHash = null;
let fileRId = null;

let markdownFileUrl = null;
let markdownFileUrl2 = null;
let pngFileUrl = null;
let jpegFileUrl = null;

async function randomPng (width, height, dstFname) {
  const newfile = new PNG({ width, height });

  for (let i = 0; i < width * height * 4; i++) {
    newfile.data[i] = Math.floor(Math.random() * 256);
  }
  return new Promise((resolve, reject) => {
    newfile.pack()
      .pipe(fs.createWriteStream(dstFname))
      .on('finish', resolve)
      .on('error', reject);
  });
}

function randomJpeg (width, height, dstFname) {
  var frameData = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height * 4; i++) {
    frameData[i] = Math.floor(Math.random() * 256);
  }
  const rawImageData = {
    data: frameData,
    width: width,
    height: height
  };
  const jpegImageData = jpeg.encode(rawImageData, 80);

  fs.writeFileSync(dstFname, jpegImageData.data);
}

before(async function () {
  const markdownFile = `../${String(Date.now())}_file.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now() + 'file'), 'utf-8');

  const markdownFile2 = `../${String(Date.now())}_file2.md`;
  markdownFileUrl2 = path.join(__dirname, markdownFile2);
  fs.writeFileSync(markdownFileUrl2, String(Date.now() + 'file2'), 'utf-8');

  pngFileUrl = path.join(__dirname, `../${String(Date.now())}_pic1.png`);
  await randomPng(50, 50, pngFileUrl);

  jpegFileUrl = path.join(__dirname, `../${String(Date.now())}_pic2.jpeg`);
  await randomJpeg(50, 50, jpegFileUrl);
});

after(function () {
  fs.unlinkSync(markdownFileUrl);
  fs.unlinkSync(markdownFileUrl2);
  fs.unlinkSync(pngFileUrl);
  fs.unlinkSync(jpegFileUrl);
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

  it('sign png file', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(pngFileUrl);
      const data = { stream: stream, filename: 'test.png', title: 'xxx' };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('sign jpeg file', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(jpegFileUrl);
      const data = { stream: stream, filename: 'test2.jpeg', title: 'axxx' };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('sign file with meta', async function () {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl2);
      const data = { stream: stream, filename: 'text.md', title: 'xxx' };
      const meta = { uuid: 'xxxxxxx' };
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
      const buyClient = new PRS({ env: prsEnv, debug: true, privateKey: utility.recoverPrivateKey(buyer.keystore, buyer.password), address: buyer.address });
      const res = await buyClient.file.reward(fileRId, 1, { comment: 'comment', memo: 'memo' });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get files', async function () {
    try {
      const res = await client.file.getFeeds(user.address, { offset: 0, limit: 10 });
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });
});
