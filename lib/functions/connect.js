/**
 * @file lib/functions/connect.js
 */
'use strict';

/**
 * Returns a Promise for a PostreSQL client that has successfully connected to
 * the database.
 * @param  {Client} client
 * @return {Promise.<Client>}
 * @private
 */
module.exports = function connect(client) {
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
