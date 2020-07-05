const knex = require('knex')
const { Model } = require('objection');

const getModel = config => {
  const db = knex(config);
  Model.knex(db);

  return {
    Model,
    db,
  };
}

module.exports = config => getModel(config);
