const path = require('path')
const fs = require('fs-extra')

const view = require('edge.js').default

const utils = require('../utils')

module.exports = (config) => {
  const cwd = config.cwd || process.cwd()
  const dir_tmp_views = path.join(cwd, '.tmp/views')
  const views_global = path.join(cwd, 'views')
  view.mount(views_global)

  utils.getApplications().forEach(app => {
    const views_app = path.join(app.path, 'views')
    view.mount(app.name, views_app)
  })

  return view
};

module.exports.View = class {
  static view() {
    return 'index'
  }

  static context() {
    return {}
  }

  static as_controller() {
    return async (_, reply) => {
      reply.render(await this.view(), await this.context())
    };
  }
}
