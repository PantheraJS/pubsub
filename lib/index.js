/**
 * @file lib/index.js
 */
'use strict';

// External dependencies
const { Client } = require('pg');
const format     = require('pg-format');

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

  /**
   * @return {Promise.<Client>}
   * @private
   */
  function getClient() {
    return new Promise((resolve) => {
      if (client._connected) {
        resolve(client);
      } else {
        client.connect(() => {
          client._connected = true;
          resolve(client);
        });
      }
    });
  };

  /**
   * Listens on the specified channel, applying the specified event hander to
   * any notifications received from the PostgreSQL server.
   * @param  {String}   channel
   * @param  {Function} handler
   * @return {Promise.<Client>}
   * @public
   */
  client.listen = async (channel, handler) => {
    const sql    = format('LISTEN %I;', channel);
    const client = await getClient();

    await client.query(sql);
    client.on(channel, handler);
    return client;
  };

  /**
   * Notifies the specified channel with an optional payload.
   * @param  {String} channel
   * @param  {String} [payload]
   * @return {Promise.<Client>}
   * @public
   */
  client.notify = async (channel, payload) => {
    const sql = (payload)
      ? format('NOTIFY %I %L', channel, payload)
      : format('NOTIFY %I', channel);

    const client = await getClient();

    await client.query(sql);
    return client;
  };

  /**
   * Unsubscribes from the specified channel and removes all event listeners
   * from the current Client's emitter instance.
   * @param  {String} channel
   * @return {Promise.<Client>}
   * @public
   */
  client.unlisten = async (channel) => {
    const sql    = format('UNLISTEN %I', channel);
    const client = await getClient();

    await client.query(sql);
    client.removeAllListeners(channel);
    return client;
  };

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
