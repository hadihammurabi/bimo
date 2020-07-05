const utils = require('../../utils')

const getConnection = (config) => {
  return config.database.db
}

const make = config => (app_name, migration_name) => {
  const migration = utils.getMigrations(config, app_name)
  const db = getConnection(config)
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

const migrate = config => async (migration_dir, app_name='') => {
  const db = getConnection(config)
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

const reset = config => async () => {
  const db = getConnection(config)
  try {
    const migrations = utils.getMigrations(config);
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

const rollback = config => async (app_name) => {
  const db = getConnection(config)
  try {
    const applications = utils.getApplications(config, app_name);
    if (applications.length > 0) {
      for (const app of applications) {
        const migrations_path = utils.getMigrations(config, app.name).path
        await db.migrate.rollback({
          directory: migrations_path,
        })
        console.log(`Migration in "${app.name}" has been rolled back`)
      }
    } else if (Object.keys(applications).length > 0) {
      const migrations_path = utils.getMigrations(config, applications.name).path
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
