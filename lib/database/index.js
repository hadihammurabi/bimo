const knex = require('knex')
const { Model } = require('objection');

const getModel = config => {
  const db = knex(config);
  Model.knex(db);

  return Model;
}

module.exports = config => ({
  Model: getModel(config),
})
