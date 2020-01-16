const {
  hashByFileReader,
  hashByReadableStream
} = require("../lib/signUtility");
const CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { randomPng, randomJpeg } = require("./util");
const crypto = require("crypto");

let markdownFileUrl;
let jpegFileUrl;
let pngFileUrl;

before(async function() {
  const markdownFile = `./assets/hash_test.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  jpegFileUrl = `./assets/hash_test.jpg`;
  jpegFileUrl = path.join(__dirname, jpegFileUrl);
  pngFileUrl = `./assets/hash_test.png`;
  pngFileUrl = path.join(__dirname, pngFileUrl);
});

describe("signUtility", function() {
  it("hashByReadableStream text", async function() {
    try {
      const stream = fs.createReadStream(markdownFileUrl);
      const { fileHash } = await hashByReadableStream(stream, "sha256");
      assert(
        fileHash ===
          "cd5e9b1a6c3c37593b8b622b2921ee5320944192acb48b55155cbe8d32dc5ea1"
      );
    } catch (err) {
      assert.fail(err);
    }
  });
  it("hashByReadableStream jpg", async function() {
    try {
      const stream = fs.createReadStream(jpegFileUrl);
      const { fileHash } = await hashByReadableStream(stream, "sha256");
      assert(
        fileHash,
        "2caa3b2429d123738b5f094f04e4633439c26e9b8416cf6d79d29e943a130301"
      );
    } catch (err) {
      assert.fail(err);
    }
  });
  it("hashByReadableStream png", async function() {
    try {
      const stream = fs.createReadStream(pngFileUrl);
      const { fileHash } = await hashByReadableStream(stream, "sha256");
      assert(
        fileHash,
        "9467ad325a17afee4770dfc7117fa87566a6ac5fc70563c680284bd873c0fcad"
      );
    } catch (err) {
      assert.fail(err);
    }
  });
});
