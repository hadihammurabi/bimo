const bim = require('./lib/bim')
const database = require('./lib/database')
const view = require('./lib/server/view')

module.exports = {
  bim,
  Model: database.Model,
  View: view.View,
};
