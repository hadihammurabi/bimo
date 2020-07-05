const server = require('../../server')();
const utils = require('../../utils')

server
  .listen(utils.getConfig().app.port)
  .catch((err) => {
    server.log.error(err)
    process.exit(1)
  })
