const path = require('path')
const fs = require('fs-extra')

class Server {
  constructor(opts) {
    this.opts = opts || {}
    const cwd = this.opts.cwd || process.cwd()
    this.config = require('../utils').getConfig(cwd)
    this.app = require('fastify')({ logger: true })
    this.view = require('./view')(this.config)
 
    const self = this
    this.app.decorateReply('render', function(page, context={}) {
      let content = self.view.render(page, context)
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

module.exports.app = require('./application')
