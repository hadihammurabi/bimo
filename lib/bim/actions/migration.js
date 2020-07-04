const utils = require('../../utils')
const config = utils.getConfig()

const knex = require('knex')

const getConnection = () => {
  if (config.database) {
    return knex({
      client: config.database.driver,
      connection: config.database[config.database.driver],
      pool: config.database.pool,
    })
  }

  return knex({});
}

const make = (app_name, migration_name) => {
  const migration = utils.getMigrations(app_name)
  const db = getConnection()
  db.migrate
    .make(migration_name, {
      directory: migration.path,
    })
    .then(() => {
      db.destroy(() => {
        console.log(`Migration "${migration_name}" has been created in "${app_name}" app`)
      })
    })
}

const migrate = async (migration_dir, app_name='') => {
  const db = getConnection()
  try {
  await db.migrate.latest({
      directory: migration_dir,
    })
    db.destroy(() => {
      console.log(`Migration(s) in "${app_name}" has been migrated`)
    })
  } catch (err) {
    console.log(err);    
  }
};

const reset = async () => {
  const db = getConnection()
  try {
    const migrations = utils.getMigrations();
    for (const mig of migrations) {
      await db.migrate.rollback({
        directory: mig.path,
      }, true)
    }
    db.destroy(() => {
      console.log(`All migrations has been reset`)
    })
  } catch (err) {
    console.log(err);
  }
};

const rollback = async (app_name) => {
  const db = getConnection()
  try {
    const applications = utils.getApplications(app_name);
    if (applications.length > 0) {
      for (const app of applications) {
        const migrations_path = utils.getMigrations(app.name).path
        await db.migrate.rollback({
          directory: migrations_path,
        })
        console.log(`Migration in "${app.name}" has been rolled back`)
      }
    } else if (Object.keys(applications).length > 0) {
      const migrations_path = utils.getMigrations(applications.name).path
      await db.migrate.rollback({
        directory: migrations_path,
      })
      console.log(`Migration in "${app_name}" has been reset`)
    } else {}
    await db.destroy()
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
