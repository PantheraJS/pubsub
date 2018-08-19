/**
 * @file test/functions/unlisten.spec.js
 */
'use strict';

const sinon = require('sinon');
const test  = require('ava');

const unlisten = require('../../lib/functions/unlisten.js');

test('should execute `UNLISTEN channel;` on database', async t => {
  const client = {
    query:              sinon.stub().resolves(),
    removeAllListeners: sinon.stub(),
    _connected:         true
  };

  await unlisten.call(null, client, 'channel');

  t.true(client.query.calledOnceWithExactly('UNLISTEN channel;'));
});

test('should remove all event handlers for `channel`', async t => {
  const client = {
    query:              sinon.stub().resolves(),
    removeAllListeners: sinon.stub(),
    _connected:         true
  };

  await unlisten.call(null, client, 'channel');

  t.true(client.removeAllListeners.calledOnceWithExactly('channel'));
});
