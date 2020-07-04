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
    
    if (this.config.is_bimo) {
      this.program
        .command('serve')
        .description('Run development server')
        .action(actions.server.run);
      
      this.program
        .command('app:make <app_name>')
        .description('Create new application')
        .action(actions.server.notImplementedYet);


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
    } else {
      this.program
        .command('init')
        .description('Create new Bimo project')
        .action(actions.server.init);
    }

    this.program.parse(process.argv)
  }
}

module.exports = (opts) => {
  return new Bim(opts);
}
