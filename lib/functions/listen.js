/**
 * @file lib/functions/listen.js
 */
'use strict';

const format = require('pg-format');

const connect = require('./connect');

/**
 * Listens on the specified channel, applying the specified event hander to
 * any notifications received from the PostgreSQL server.
 * @param  {Client}   client
 * @param  {String}   channel
 * @param  {Function} handler
 * @return {Promise.<Client>}
 * @private
 */
module.exports = async function listen(client, channel, handler) {
  const sql = format('LISTEN %I;', channel);

  await connect(client);
  await client.query(sql);

  client.on(channel, handler);

  return client;
};
