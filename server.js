const path = require('path')
const fs = require('fs-extra')

const app = require('fastify')({ logger: true })
// const view = require('edge.js')
const view = require('pug')

const config = require('./config')

// views setup
const dir_tmp_views = path.join(__dirname, '.tmp/views')
const views_global = path.join(__dirname, 'views')
if (fs.existsSync(views_global)) {
  fs.copySync(views_global, dir_tmp_views)
  // view.registerViews(views_global)
}

const apps_dir = path.join(__dirname, 'app')
const apps = fs.readdirSync(apps_dir)
apps.forEach(app => {
  const views_app = path.join(apps_dir, app, 'views')
  if (fs.existsSync(views_app)) {
    fs.copySync(views_app, dir_tmp_views)
    // view.registerViews(dir_tmp_views)
  }
})

app.decorateReply('render', function(page, context={}) {
  const options = {
    ...context,
    basedir: dir_tmp_views,
  }
  const content = view.renderFile(path.join(dir_tmp_views, `${page}.pug`), options)
  return this.type('text/html').send(content)
});

app.register(require('./config/routes'), { prefix: '/' })

app
  .listen(config.app.port)
  .catch(() => {
    app.log.error(err)
    process.exit(1)
  })
