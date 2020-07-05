const path = require('path')
const fs = require('fs-extra')

const view = require('edge.js')

class Server {
  constructor(opts) {
    this.opts = opts || {}
    const cwd = this.opts.cwd || process.cwd()
    this.config = require('../utils').getConfig(cwd)
    this.app = require('fastify')({ logger: true })
 
    // views setup
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

    const self = this
    this.app.decorateReply('render', function(page, context={}) {
      const options = {
        ...context,
      }
      let content = view.render(page, options)
      if ('minify' in self.config.app.views) {
        const { minify } = require('html-minifier')
        content = minify(content, {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        })
      }
      return this.type('text/html').send(content)
    });

    this.app.register(this.config.routes, { prefix: '/' })
  }

  listen(port) {
    return this.app.listen(port);
  }
}

module.exports = (opts) => {
  return new Server(opts)
};
