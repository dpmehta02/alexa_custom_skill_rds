/* eslint-disable  no-console */

const { Client } = require('pg');

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT, // default process.env.PGPORT
  database: process.env.DAISYDATABASE, // default process.env.PGDATABASE || process.env.USER
  user: process.env.PGUSER, // default process.env.PGUSER || process.env.USER
  password: process.env.PGPASSWORD, // default process.env.PGPASSWORD
  //   connectionString?: string // e.g. postgres://user:password@host:5432/database
  //   ssl?: any, // passed directly to node.TLSSocket
  //   types?: any, // custom type parsers
  //   number of milliseconds before a query will time out default is no timeout
  statement_timeout: 0, // None
});

module.exports = {
  query: (text, params, callback) => client.query(text, params, callback),
  getConn: () => client.connect((err) => {
    if (err) {
      console.log('connection error', err.stack);
    } else {
      console.log('connected');
    }
  }),
  closeConn: () => client.end(),
};
