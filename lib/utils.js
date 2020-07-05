const path = require('path');
const fs = require('fs');

const getConfig = (cwd) => {
  cwd = cwd || process.cwd()
  const package_path = path.join(cwd, 'package.json');
  const package_bimo_path = path.join(__dirname, '..', 'package.json')
  const config_dir = path.join(cwd, 'config');
  
  let config = {
    cwd,
    package: require(package_path),
    bimo: {
      package: require(package_bimo_path),
    },
  }

  if (!fs.existsSync(config_dir)) {
    return config;
  }

  const app_dir = path.join(cwd, 'app')
  const bim_path = path.join(cwd, 'bim')
  if (fs.existsSync(config_dir) && fs.existsSync(app_dir) && fs.existsSync(bim_path)) {
    config.is_bimo = true;
  }

  config = {
    ...config,
    ...require(config_dir),
  }
  return config
};


const getApplications = (app_name) => {
  const app_dir = path.join(process.cwd(), 'app');

  if (!fs.existsSync(app_dir)) {
    return [];
  }

  let applications = fs
    .readdirSync(app_dir)
    .map(app => {
      return {
        name: app,
        path: path.join(app_dir, app)
      };
    })

  if (!!app_name) {
    applications = applications.filter(app => app_name === app.name)
    applications = applications.length > 0 ? applications[0] : null
  }

  return applications
};

const getMigrations = (app_name=null) => {
  let migrations = getApplications()
    .map(app => {
      const migrationsDir = path.join(app.path, 'migrations')
      app.migration = {
        path: path.join(app.path, 'migrations'),
        files: fs.readdirSync(migrationsDir).filter(mig => path.extname(mig) === '.js')
      }
      return app
    })

  if (!!app_name) {
    migrations = migrations.filter(app => app_name === app.name)
    return migrations.length > 0 ? migrations.map(mig => mig.migration)[0] : null
  }

  return migrations.map(mig => mig.migration)
};

module.exports = {
  getConfig,
  getApplications,
  getMigrations,
}
