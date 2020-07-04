const path = require('path')
const fs = require('fs-extra')
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

module.exports = {
  notImplementedYet,
  init,
};
