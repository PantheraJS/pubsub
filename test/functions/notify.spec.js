/**
 * @file test/functions/notify.spec.js
 */
'use strict';

const sinon = require('sinon');
const test  = require('ava');

const notify = require('../../lib/functions/notify.js');

test('should execute `NOTIFY channel;` on database', async t => {
  const client = {
    query:      sinon.stub().resolves(),
    _connected: true
  };

  await notify.call(null, client, 'channel');

  t.true(client.query.calledOnceWithExactly('NOTIFY channel;'));
});

test('should execute `NOTIFY channel \'payload\';` on database', async t => {
  const client = {
    query:      sinon.stub().resolves(),
    _connected: true
  };

  await notify.call(null, client, 'channel', 'payload');

  t.true(client.query.calledOnceWithExactly('NOTIFY channel \'payload\';'));
});
