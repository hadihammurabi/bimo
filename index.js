const bim = require('./lib/bim')
const database = require('./lib/database')
const server = require('./lib/server')
const view = require('./lib/server/view')

module.exports = {
  bim,
  Model: database.Model,
  View: view.View,
  app: server.app,
};
