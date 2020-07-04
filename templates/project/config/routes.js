module.exports = function (router, opts, done) {
  router.get('/', (_, r) => r.send('mantap'))
  done()
}
