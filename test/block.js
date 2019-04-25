'use strict';

const assert = require('assert');
const PRS = require('../lib');

describe('Block', function () {
  const detailProperties = ['userName', 'userAvatar', 'userTitle', 'title', 'url'];
  const validBlocks = [
    'ba03bd584d69b89615ce8db22b4c593342a5ec09b343a7859044a8e4d389c4c2',
    '65163724a98d29506b1031dc68fa62fb5a7a11fe631fb723a723b2a19e9bb65c'
  ];
  it('get blocks by rIds without details', async function () {
    try {
      const client = new PRS({ env: 'env', debug: true, onApiSuccess: res => res.body });
      const res = await client.block.getByRIds(validBlocks);
      res.forEach(data => {
        data.should.not.have.keys(detailProperties);
      });
    } catch (err) {
      assert.fail(err);
    }
  });

  it('get blocks by rIds with details', async function () {
    try {
      const client = new PRS({ env: 'env', debug: true, onApiSuccess: res => res.body });
      const res = await client.block.getByRIds(validBlocks, { withDetail: true });
      res.forEach(data => {
        const keys = Object.keys(data);
        detailProperties.forEach(prop => {
          keys.includes(prop).should.to.equal(true);
        });
      });
    } catch (err) {
      assert.fail(err);
    }
  });
});
