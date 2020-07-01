const controllers = require('./controllers')

module.exports = function (router, opts, done) {
  router.get('/', controllers.ListView.as_controller())
  done()
}
