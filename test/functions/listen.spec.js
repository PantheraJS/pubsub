/**
 * @file test/functions/listen.spec.js
 */
'use strict';

const sinon = require('sinon');
const test  = require('ava');

const listen = require('../../lib/functions/listen.js');

function handler() {};

test('should execute `LISTEN channel` on database', async t => {
  const client = {
    on:         sinon.stub(),
    query:      sinon.stub().resolves(),
    _connected: true
  };

  await listen.call(null, client, 'channel', handler);

  t.true(client.query.calledOnceWithExactly('LISTEN channel;'));
});

test('should attach an event handler for `channel`', async t => {
  const client = {
    on:         sinon.stub(),
    query:      sinon.stub().resolves(),
    _connected: true
  };

  await listen.call(null, client, 'channel', handler);

  t.true(client.on.calledOnceWithExactly('channel', handler));
});
