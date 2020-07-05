const path = require('path');
const fs = require('fs');

const getConfig = (opts) => {
  if (global['BIMO']) {
    return JSON.parse(global['BIMO'])
  }

  const { cwd } = opts
  const package_path = path.join(cwd, 'package.json');
  const package_bimo_path = path.join(__dirname, '..', 'package.json')
  const config_path = path.join(cwd, 'bimo.config.js');
  
  let config = {
    ...opts,
    package: require(package_path),
    bimo: {
      package: require(package_bimo_path),
    },
  }

  const app_dir = path.join(cwd, 'app')
  const bim_path = path.join(cwd, 'bim')
  if (fs.existsSync(config_path) && fs.existsSync(app_dir) && fs.existsSync(bim_path)) {
    config.is_bimo = true;
  }

  global['BIMO'] = JSON.stringify(config)

  return config
};


const getApplications = (opts, app_name) => {
  const config = opts
  let { apps } = config.app;

  if (!apps) {
    return [];
  }
  
  apps = Object.keys(apps).map(name => {
    let app_path = apps[name]

    const node_modules = path.join(config.cwd, 'node_modules', app_path)
    if (fs.existsSync(node_modules)) {
      app_path = node_modules
    }

    return {
      name,
      path: app_path,
    }
  })
  apps = apps.filter(app => fs.existsSync(app.path))


  if (!!app_name) {
    apps = apps.filter(app => app_name === app.name)
    apps = apps.length > 0 ? apps[0] : null
  }

  return apps
};

const getMigrations = (config, app_name=null) => {
  let migrations = getApplications(config)
    .map(app => {
      const migrationsDir = path.join(app.path, 'migrations')
      if (!fs.existsSync(migrationsDir)) {
        fs.mkdirSync(migrationsDir)
      }
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
