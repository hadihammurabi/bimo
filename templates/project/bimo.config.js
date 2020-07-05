const path = require('path');
const bimo = require('bimo');

module.exports = {
  app: {
    port: 8080,
    apps: {
    },
    views: {
      minify: true,
    },
  },
  database: bimo.database({
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'bimo',
      user: '',
      password: '',
    },
    pool: {
      min: 0,
      max: 100,
    },
  }),
  routes: (router, opts, done) => {
    router.get('/', (_, r) => r.send('hello'))
    done()
  },
};
