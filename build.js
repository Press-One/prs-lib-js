const fs = require('fs');
const browserify = require('browserify');
browserify({
  entries: [require.resolve('babel-polyfill'), './standalone.js']
})
  .transform('babelify', { presets: ['@babel/preset-env'], global: true })
  .bundle()
  .pipe(fs.createWriteStream('./dist/bundle.js'));
