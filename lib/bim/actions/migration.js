const utils = require('../../utils')
const config = utils.getConfig()

const knex = require('knex')({
  client: config.database.driver,
  connection: config.database[config.database.driver],
  pool: config.database.pool,
})

const make = (app_name, migration_name) => {
  const migration = utils.getMigrations(app_name)
  knex.migrate
    .make(migration_name, {
      directory: migration.path,
    })
    .then(() => {
      knex.destroy(() => {
        console.log(`Migration "${migration_name}" has been created in "${app_name}" app`)
      })
    })
}

const migrate = async (migration_dir, app_name='') => {
  try {
    await knex.migrate.latest({
      directory: migration_dir,
    })
    knex.destroy(() => {
      console.log(`Migration(s) in "${app_name}" has been migrated`)
    })
  } catch (err) {
    console.log(err);    
  }
};

const reset = async () => {
  try {
    const migrations = utils.getMigrations();
    for (const mig of migrations) {
      await knex.migrate.rollback({
        directory: mig.path,
      }, true)
    }
    knex.destroy(() => {
      console.log(`All migrations has been reset`)
    })
  } catch (err) {
    console.log(err);
  }
};

const rollback = async (app_name) => {
  try {
    const applications = utils.getApplications(app_name);
    if (applications.length > 0) {
      for (const app of applications) {
        const migrations_path = utils.getMigrations(app.name).path
        await knex.migrate.rollback({
          directory: migrations_path,
        })
        console.log(`Migration in "${app.name}" has been rolled back`)
      }
    } else if (Object.keys(applications).length > 0) {
      const migrations_path = utils.getMigrations(applications.name).path
      await knex.migrate.rollback({
        directory: migrations_path,
      })
      console.log(`Migration in "${app_name}" has been reset`)
    } else {}
    await knex.destroy()
  } catch (err) {
    console.log(err);
  }
};;

module.exports = {
  make,
  migrate,
  reset,
  rollback,
};
