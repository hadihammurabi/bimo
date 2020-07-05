const cwd = process.argv[3]
const path = require('path')
const config = require(path.join(cwd, 'bimo.config.js'))
const server = require('../../server')({
  cwd,
  ...config,
});

server
  .listen()
  .catch((err) => {
    server.log.error(err)
    process.exit(1)
  })
