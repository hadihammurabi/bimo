const utils = require('../utils')
const config = utils.getConfig()

const knex = require('knex')({
  client: config.database.driver,
  connection: config.database[config.database.driver],
  pool: config.database.pool,
})

const { Model } = require('objection');
Model.knex(knex);

module.exports = {
  Model,
}
