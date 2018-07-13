/**
 * @file test/index.spec.js
 */
'use strict';

const EventEmitter = require('events');
const proxyquire   = require('proxyquire');
const sinon        = require('sinon');
const test         = require('ava');

const stubs = {
  pg: {
    Client: class Client extends EventEmitter {
      constructor() {
        super();
        this.connect = sinon.stub().callsArg(0);
        this.query   = sinon.stub().resolves();
      }
    }
  }
};

const pubsub = proxyquire('../lib/index.js', stubs);

test('#listen should set `_connected` flag to `true`', async t => {
  const client = pubsub();

  t.false(client._connected);
  await client.listen('channel', () => {});
  t.true(client._connected);
  await client.listen('channel', () => {});
  t.true(client._connected);
});

test('#listen should call `client.query`', async t => {
  const client = pubsub();

  t.true(client.query.callCount === 0);
  await client.listen('channel', () => {});
  t.true(client.query.callCount === 1);
  await client.listen('channel', () => {});
  t.true(client.query.callCount === 2);
});

test('#listen should add event listener', async t => {
  const client = pubsub();

  t.true(client.listenerCount('channel') === 0);
  await client.listen('channel', () => {});
  t.true(client.listenerCount('channel') === 1);
  await client.listen('channel', () => {});
  t.true(client.listenerCount('channel') === 2);
});

test('#notify should set `_connected` flag to `true`', async t => {
  const client = pubsub();

  t.false(client._connected);
  await client.notify('channel', 'payload');
  t.true(client._connected);
  await client.notify('channel', 'payload');
  t.true(client._connected);
});

test('#notify should handle optional payload', async t => {
  const client = pubsub();

  await t.notThrows(() => {
    client.notify('channel');
  });
});

test('#notify should call `client.query`', async t => {
  const client = pubsub();

  t.true(client.query.callCount === 0);
  await client.notify('channel', 'payload');
  t.true(client.query.callCount === 1);
  await client.notify('channel', 'payload');
  t.true(client.query.callCount === 2);
});

test('#unlisten should set `_connected` flag to `true`', async t => {
  const client = pubsub();

  t.false(client._connected);
  await client.unlisten('channel', () => {});
  t.true(client._connected);
  await client.unlisten('channel', () => {});
  t.true(client._connected);
});

test('#unlisten should call `client.query`', async t => {
  const client = pubsub();

  t.true(client.query.callCount === 0);
  await client.unlisten('channel', () => {});
  t.true(client.query.callCount === 1);
  await client.unlisten('channel', () => {});
  t.true(client.query.callCount === 2);
});

test('#unlisten should remove event listener', async t => {
  const client = pubsub();

  t.true(client.listenerCount('channel') === 0);
  await client.listen('channel', () => {});
  t.true(client.listenerCount('channel') === 1);
  await client.unlisten('channel', () => {});
  t.true(client.listenerCount('channel') === 0);
});

test('client `end` event should remove all event listeners', async t => {
  const client = pubsub();

  t.true(client.listenerCount('channel') === 0);
  await client.listen('channel', () => {});
  t.true(client.listenerCount('channel') === 1);
  client.emit('end');
  t.true(client.listenerCount('channel') === 0);
});

test('client `notification` event should emit if listeners attached', async t => {
  const client = pubsub();

  t.true(client.listenerCount('channel') === 0);
  await client.listen('channel', () => {});
  t.true(client.listenerCount('channel') === 1);
  client.emit('notification', {
    channel: 'channel',
    payload: 'data'
  });
  client.emit('end');
  t.true(client.listenerCount('channel') === 0);
});

test('client `notification` event should ignore if no listeners attached', async t => {
  const client = pubsub();

  t.true(client.listenerCount('channel') === 0);
  await client.listen('channel', () => {});
  t.true(client.listenerCount('channel') === 1);
  client.emit('notification', {
    channel: 'notlistening',
    payload: 'data'
  });
  client.emit('end');
  t.true(client.listenerCount('channel') === 0);
});
