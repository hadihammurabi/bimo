const utils = require('../utils')
const config = utils.getConfig()

const knex = require('knex')

const getModel = () => {
  if (config.database) {
    const db = knex({
      client: config.database.driver,
      connection: config.database[config.database.driver],
      pool: config.database.pool,
    });
    const { Model } = require('objection');
    Model.knex(db);
    return Model;
  }

  return class {};
}

module.exports = {
  Model: getModel(),
}
