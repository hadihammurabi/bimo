const path = require('path')
const fs = require('fs-extra')
const nodemon = require('nodemon')

const notImplementedYet = () => {
  console.log('This command is not implemented yet')
};

const init = config => () => {
  const cwd = config.cwd
  if (config.is_bimo) {
    console.log('This is Bimo project, no need to initialize anymore')
    return
  }

  fs.copySync(path.join(__dirname, '..', '..', '..', 'templates', 'project'), path.join(cwd))
  fs.mkdirSync(path.join(cwd, 'app'))
};

const run = config => () => {
  if (process.env.NODE_ENV === 'production') {
    require('./server-runner')
  } else {
    nodemon(`-e "json js edge" ${path.join(__dirname, 'server-runner.js')} -- --cwd ${config.cwd}`)
      .on('start', () => {
        console.log('Development server started')
      }).on('restart', () => {
        console.log('Restarting ...')
      }).on('quit', function () {
        process.exit();
      })
  }
};

module.exports = {
  notImplementedYet,
  init,
  run,
};
