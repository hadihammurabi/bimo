const Bim = require('./lib/bim')
const server = require('./lib/server')

class Bimo {
  constructor(opts) {
    this.bim = (argv) => {
      opts.argv = argv
      return new Bim(opts)
    }
  }
}

Bimo.View = server.View;
Bimo.database = require('./lib/database');
module.exports = Bimo;
