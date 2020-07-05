const path = require('path')
const fs = require('fs-extra')

const view = require('edge.js')

module.exports = (config) => {
  const cwd = config.cwd || process.cwd()
  const dir_tmp_views = path.join(cwd, '.tmp/views')
  const views_global = path.join(cwd, 'views')
  if (fs.existsSync(views_global)) {
    fs.copySync(views_global, dir_tmp_views)
  }

  const apps_dir = path.join(cwd, 'app')
  const apps = fs.readdirSync(apps_dir)
  apps.forEach(app => {
    const views_app = path.join(apps_dir, app, 'views')
    if (fs.existsSync(views_app)) {
      fs.copySync(views_app, dir_tmp_views)
    }
  })

  view.registerViews(dir_tmp_views)
  
  return view
};

module.exports.View = class {
  static view() {
    return this.view || 'index'
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
