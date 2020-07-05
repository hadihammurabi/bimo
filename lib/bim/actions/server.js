const path = require('path')
const fs = require('fs-extra')
const nodemon = require('nodemon')
const utils = require('../../utils')

const cwd = process.cwd()
const config = utils.getConfig(cwd)

const notImplementedYet = () => {
  console.log('This command is not implemented yet')
};

const init = () => {
  if (config.is_bimo) {
    console.log('This is Bimo project, no need to initialize anymore')
    return
  }

  fs.copySync(path.join(__dirname, '..', '..', '..', 'templates', 'project'), path.join(cwd))
  fs.mkdirSync(path.join(cwd, 'app'))
};

const run = () => {
  if (process.env.NODE_ENV === 'production') {
    require('./server-runner')
  } else {
    nodemon({
      script: path.join(__dirname, 'server-runner.js'),
      ext: 'json js edge',
    }).on('start', () => {
      console.log('Development server started')
    }).on('restart', () => {
      console.log('Development server re-started')
    })
  }
};

module.exports = {
  notImplementedYet,
  init,
  run,
};
