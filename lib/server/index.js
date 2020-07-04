const path = require('path')
const fs = require('fs-extra')

const view = require('edge.js')

class Server {
  constructor(opts) {
    this.opts = opts
    this.config = require('../utils').getConfig(this.opts.cwd)
    this.app = require('fastify')({ logger: true })
 
    // views setup
    const dir_tmp_views = path.join(this.opts.cwd, '.tmp/views')
    const views_global = path.join(this.opts.cwd, 'views')
    if (fs.existsSync(views_global)) {
      fs.copySync(views_global, dir_tmp_views)
    }

    const apps_dir = path.join(this.opts.cwd, 'app')
    const apps = fs.readdirSync(apps_dir)
    apps.forEach(app => {
      const views_app = path.join(apps_dir, app, 'views')
      if (fs.existsSync(views_app)) {
        fs.copySync(views_app, dir_tmp_views)
      }
    })

    view.registerViews(dir_tmp_views)

    this.app.decorateReply('render', function(page, context={}) {
      const options = {
        ...context,
      }
      const content = view.render(page, options)
      return this.type('text/html').send(content)
    });

    this.app.register(this.config.app.routes, { prefix: '/' })
  }

  listen(port) {
    return this.app.listen(port);
  }
}

module.exports = (opts) => {
  return new Server(opts)
};
