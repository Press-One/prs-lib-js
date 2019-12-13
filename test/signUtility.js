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
  const markdownFile = `../hash_test.md`;
  markdownFileUrl = path.join(__dirname, markdownFile);
  fs.writeFileSync(markdownFileUrl, "hash test", "utf-8");
  jpegFileUrl = `../hash_test.jpg`;
  jpegFileUrl = path.join(__dirname, jpegFileUrl);
  pngFileUrl = `../hash_test.png`;
  pngFileUrl = path.join(__dirname, pngFileUrl);
});

after(function() {
  // fs.unlinkSync(markdownFileUrl);
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
      // FIXME
      const stream = fs.createReadStream(jpegFileUrl);
      const { fileHash } = await hashByReadableStream(stream, "sha256");
      console.log(fileHash);
    } catch (err) {
      assert.fail(err);
    }
  });
  it("hashByReadableStream png", async function() {
    try {
      // FIXME
      const stream = fs.createReadStream(pngFileUrl);
      const { fileHash } = await hashByReadableStream(stream, "sha256");
      console.log(fileHash);
    } catch (err) {
      assert.fail(err);
    }
  });
});
