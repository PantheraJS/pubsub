/**
 * @file lib/index.js
 */
'use strict';

// External dependencies
const { Client } = require('pg');

const listen   = require('./functions/listen');
const notify   = require('./functions/notify');
const unlisten = require('./functions/unlisten');

/**
 * Creates and decorates an individual PostgreSQL client with the functionality
 * needed to LISTEN, NOTIFY, and UNLISTEN on specified channels.
 * @param  {Object} options
 * @return {Client}
 * @public
 */
module.exports = (options) => {

  /**
   * The PostgreSQL client to be decorated.
   * @type {Client}
   */
  const client = new Client(options);

  /**
   * A Boolean flag describing whether a given PostgreSQL client is connected.
   * @type {Boolean}
   */
  client._connected = false;

  client.listen   = listen.bind(null, client);
  client.notify   = notify.bind(null, client);
  client.unlisten = unlisten.bind(null, client);

  client.once('end', () => {
    client.removeAllListeners();
  });

  client.on('notification', (message) => {
    const { channel, payload } = message;

    if (client.listenerCount(channel)) {
      client.emit(channel, payload);
    }
  });

  return client;
};
