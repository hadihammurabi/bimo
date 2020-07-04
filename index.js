const bim = require('./lib/bim')
const database = require('./lib/database')

module.exports = {
  bim,
  Model: database.Model,
};
