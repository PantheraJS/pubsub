/**
 * @file lib/functions/unlisten.js
 */
'use strict';

const format = require('pg-format');

const connect = require('./connect');

/**
 * Unsubscribes from the specified channel and removes all event listeners
 * from the current Client's emitter instance.
 * @param  {Client} client
 * @param  {String} channel
 * @return {Promise.<Client>}
 * @private
 */
module.exports = async function unlisten(client, channel) {
  const sql = format('UNLISTEN %I;', channel);

  await connect(client);
  await client.query(sql);

  client.removeAllListeners(channel);

  return client;
};
