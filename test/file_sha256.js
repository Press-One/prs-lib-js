"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const utility = require("prs-utility");
const { user, buyer } = require("../fixtures");
const PRS = require("../lib");
const prsEnv = process.env.ENV || "env";
const { randomPng, randomJpeg } = require("./util");

const client = new PRS({
  env: prsEnv,
  debug: true,
  privateKey: utility.recoverPrivateKey(user.keystore, user.password),
  address: user.address
});

const SHA256_HASH_ALG = 'sha256';

let fileHash = null;
let fileRId = null;

let markdownFileUrl = null;
let markdownFileUrl2 = null;
let pngFileUrl = null;
let jpegFileUrl = null;

before(async function() {
  const markdownFile = `../${String(Date.now())}_file.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, String(Date.now() + "file"), "utf-8");

  const markdownFile2 = `../${String(Date.now())}_file2.md`;
  markdownFileUrl2 = path.join(__dirname, markdownFile2);
  fs.writeFileSync(markdownFileUrl2, String(Date.now() + "file2"), "utf-8");

  pngFileUrl = path.join(__dirname, `../${String(Date.now())}_pic1.png`);
  await randomPng(50, 50, pngFileUrl);

  jpegFileUrl = path.join(__dirname, `../${String(Date.now())}_pic2.jpeg`);
  await randomJpeg(50, 50, jpegFileUrl);
});

after(function() {
  fs.unlinkSync(markdownFileUrl);
  fs.unlinkSync(markdownFileUrl2);
  fs.unlinkSync(pngFileUrl);
  fs.unlinkSync(jpegFileUrl);
});

describe("File", function() {
  it("sign file", async function() {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl);
      let data = { stream: stream, filename: "text.md", title: "xxx", hashAlg: SHA256_HASH_ALG };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
      fileHash = res.body.cache.msghash;
      fileRId = res.body.cache.rId;
    } catch (err) {
      assert.fail(err);
    }
  });

  it("sign png file", async function() {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(pngFileUrl);
      const data = { stream: stream, filename: "test.png", title: "xxx", hashAlg: SHA256_HASH_ALG };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it("sign jpeg file", async function() {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(jpegFileUrl);
      const data = { stream: stream, filename: "test2.jpeg", title: "axxx", hashAlg: SHA256_HASH_ALG };
      const res = await client.file.signByStream(data);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });

  it("sign file with meta", async function() {
    this.timeout(1000 * 200);
    try {
      const stream = fs.createReadStream(markdownFileUrl2);
      const data = { stream: stream, filename: "text.md", title: "xxx", hashAlg: SHA256_HASH_ALG };
      const meta = { uuid: "xxxxxxx" };
      const res = await client.file.signByStream(data, meta);
      res.status.should.equal(200);
    } catch (err) {
      assert.fail(err);
    }
  });
});
