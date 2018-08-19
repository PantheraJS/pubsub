/**
 * @file lib/functions/notify.js
 */
'use strict';

const format = require('pg-format');

const connect = require('./connect');

/**
 * Notifies the specified channel with an optional payload.
 * @param  {Client} client
 * @param  {String} channel
 * @param  {String} [payload]
 * @return {Promise.<Client>}
 * @private
 */
module.exports = async function notify(client, channel, payload) {
  const sql = (payload)
    ? format('NOTIFY %I %L;', channel, payload)
    : format('NOTIFY %I;', channel);

  await connect(client);
  await client.query(sql);

  return client;
};
