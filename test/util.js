const PNG = require("pngjs").PNG;
const jpeg = require("jpeg-js");
const fs = require("fs");

async function randomPng(width, height, dstFname) {
  const newfile = new PNG({ width, height });

  for (let i = 0; i < width * height * 4; i++) {
    newfile.data[i] = Math.floor(Math.random() * 256);
  }
  return new Promise((resolve, reject) => {
    newfile
      .pack()
      .pipe(fs.createWriteStream(dstFname))
      .on("finish", resolve)
      .on("error", reject);
  });
}

function randomJpeg(width, height, dstFname) {
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

module.exports = {
  randomJpeg,
  randomPng
};
