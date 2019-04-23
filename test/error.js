'use strict';

const PRS = require('../lib');

const baseConfig = {
  privateKey: 'xxx',
  address: 'xxxx',
  host: '127.0.0.1' // should failed
};
describe('onApiError', function () {
  it('test callback returns value', async function () {
    const client = new PRS(Object.assign({}, baseConfig, {
      onApiError: function (err, res) {
        console.log(err, res);
        const defaultRes = true;
        return defaultRes;
      }
    }));
    const draft = {
      title: `draft title ${String(Date.now())}`,
      content: `draft content ${String(Date.now())}`,
      mimeType: 'text/plain'
    };
    const res = await client.draft.create(draft);
    res.should.equal(true);
  });

  it('test callback returns promise', async function () {
    const client = new PRS(Object.assign({}, baseConfig, {
      onApiError: function (err, res) {
        console.log(err, res);
        const defaultRes = true;
        return new Promise(resolve => setTimeout(() => resolve(defaultRes), 100));
      }
    }));
    const draft = {
      title: `draft title ${String(Date.now())}`,
      content: `draft content ${String(Date.now())}`,
      mimeType: 'text/plain'
    };
    const res = await client.draft.create(draft);
    res.should.equal(true);
  });
});
