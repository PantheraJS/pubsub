/**
 * @file test/index.spec.js
 */
'use strict';

const sinon = require('sinon');
const test  = require('ava');

const pubsub = require('../lib/index.js');

test('should set `_connected` to `false`', t => {
  const client = pubsub();

  t.false(client._connected);
});

test('should assign `listen`, `notify`, and `unlisten` methods', t => {
  const client = pubsub();

  [ 'listen', 'notify', 'unlisten' ].forEach((property) => {
    t.true(Object.prototype.hasOwnProperty.call(client, property));
    t.true(typeof client[property] === 'function');
  });
});

test('`end` event should remove all event listeners', async t => {
  const client = pubsub();

  client._connected = true;
  sinon.stub(client, 'query').resolves(client);
  sinon.spy(client, 'removeAllListeners');

  t.true(client.listenerCount('channel') === 0);
  t.true(client.removeAllListeners.notCalled);

  await client.listen('channel', () => {});
  t.true(client.listenerCount('channel') === 1);
  t.true(client.removeAllListeners.notCalled);

  client.emit('end');
  t.true(client.listenerCount('channel') === 0);
  t.true(client.removeAllListeners.calledOnce);
});

test('`notification` event should delegate to client#emit if listeners attached', async t => {
  const client  = pubsub();
  const message = {
    channel: 'channel',
    payload: 'data'
  };

  client._connected = true;
  sinon.stub(client, 'query').resolves(client);
  sinon.spy(client, 'emit');

  await client.listen('channel', () => {});

  client.emit('notification', message);

  t.true(client.emit.calledTwice);
  t.true(client.emit.calledWithExactly(message.channel, message.payload));
});

test('`notification` event should not delegate to client#emit if no listeners attached', t => {
  const client  = pubsub();
  const message = {
    channel: 'channel',
    payload: 'data'
  };

  client._connected = true;
  sinon.stub(client, 'query').resolves(client);
  sinon.spy(client, 'emit');

  client.emit('notification', message);

  t.true(client.emit.calledOnce);
  t.true(client.emit.neverCalledWith(message.channel, message.payload));
});
