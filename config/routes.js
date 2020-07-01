module.exports = function (router, opts, done) {
  router.get('/', (_, r) => r.send('mantap'))
  router.register(require('../app/admin/routes'), { prefix: 'admin' })
  done()
}
