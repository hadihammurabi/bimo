const view = require('./view')

class Server {
  constructor(opts) {
    this.opts = opts
    this.config = require('../utils').getConfig(this.opts)
    this.app = require('fastify')({ logger: true })
    this.view = view(this.config)
    this.app.app = require('./application')(this.config)
 
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

  listen() {
    return this.app.listen(this.config.app.port || 8080);
  }
}

module.exports = (opts) => {
  return new Server(opts)
};

module.exports.View = view.View
