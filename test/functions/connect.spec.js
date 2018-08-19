/**
 * @file test/functions/connect.spec.js
 */
'use strict';

const sinon = require('sinon');
const test  = require('ava');

const connect = require('../../lib/functions/connect.js');

test('should resolve immediately if `_connected` is true', async t => {
  const client = {
    _connected: true
  };

  await t.notThrows(() => {
    connect(client);
  });
});

test('should call client#connect if `_connected` is false', async t => {
  const client = {
    _connected: false,
    connect:    sinon.stub().callsArg(0)
  };

  await t.notThrows(() => {
    connect(client);
  });
});
