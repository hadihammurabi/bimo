const path = require('path')
const fs = require('fs')
const { Command } = require('commander')

const utils = require('../utils')
const actions = require('./actions')

class Bim {
  constructor(opts) {
    this.opts = opts
    this.config = utils.getConfig(this.opts.cwd)
    this.program = new Command()

    this.program
      .version(this.config.bimo.package.version)
      .name(`${this.config.bimo.package.name}-cli`)

    this.program
      .option('-e, --env <env>', 'Set NODE_ENV variable')
      .on('option:env', () => {
        process.env.NODE_ENV = program.env || 'development'
      })
    
    const runServer = () => {
      const server = require('../server')({
        cwd: this.opts.cwd
      });
      server
        .listen(this.config.app.port)
        .catch((err) => {
          server.log.error(err)
    
          if (process.env.NODE_ENV === 'development') {
            process.exit(1)
          }
        })
    };
    
    this.program
      .command('serve')
      .description('Run development server')
      .action(runServer);
    
    this.program
      .command('migration:make <app_name> <migration_name>')
      .description('Create a migration in specific application')
      .action(actions.migration.make);
    
    this.program
      .command('migration:run [app_name]')
      .description('Run migrations in specific application')
      .action((app_name) => {
        if (app_name) {
          const migrationDir = path.join(this.config.app.app_directory, app_name, 'migrations')
          actions.migration.migrate(migrationDir, app_name)
        } else {
          utils.getApplications().forEach(app => {
            const migrationDir = path.join(app.path, 'migrations')
            actions.migration.migrate(migrationDir, app.name)
          })
        }
      });
      
    this.program
      .command('migration:rollback [app_name]')
      .description('Undo migration(s) in specific application')
      .action(actions.migration.rollback);

    this.program
      .command('migration:reset')
      .description('Undo all migrations and clean database')
      .action(actions.migration.reset);
    
    this.program.parse(process.argv)
  }
}

module.exports = (opts) => {
  return new Bim(opts);
}