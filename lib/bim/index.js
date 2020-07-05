const path = require('path')
// const fs = require('fs')
const { Command } = require('commander')

const utils = require('../utils')

class Bim {
  constructor(opts) {
    this.config = utils.getConfig(opts)
    this.program = new Command()
    this.actions = require('./actions')

    this.program
      .version(this.config.bimo.package.version)
      .name(`${this.config.bimo.package.name}-cli`)

    this.program
      .option('-e, --env <env>', 'Set NODE_ENV variable')
      .on('option:env', () => {
        process.env.NODE_ENV = this.program.env || 'development'
      })
    
    if (this.config.is_bimo) {
      this.program
        .command('serve')
        .description('Run development server')
        .action(this.actions.server.run(this.config));
      
      this.program
        .command('app:make <app_name>')
        .description('Create new application')
        .action(this.actions.server.notImplementedYet);


      this.program
        .command('migration:make <app_name> <migration_name>')
        .description('Create a migration in specific application')
        .action(this.actions.migration.make(this.config));

      this.program
        .command('migration:run [app_name]')
        .description('Run migrations in specific application')
        .action((app_name) => {
          if (app_name) {
            const migrationDir = path.join(this.config.app.app_directory, app_name, 'migrations')
            this.actions.migration.migrate(this.config)(migrationDir, app_name)
          } else {
            utils.getApplications(this.config).forEach(app => {
              const migrationDir = path.join(app.path, 'migrations')
              this.actions.migration.migrate(this.config)(migrationDir, app.name)
            })
          }
        });

      this.program
        .command('migration:rollback [app_name]')
        .description('Undo migration(s) in specific application')
        .action(this.actions.migration.rollback(this.config));

      this.program
        .command('migration:reset')
        .description('Undo all migrations and clean database')
        .action(this.actions.migration.reset(this.config));
    } else {
      this.program
        .command('init')
        .description('Create new Bimo project')
        .action(this.actions.server.init(this.config));
    }

    this.program.parse(this.config.argv)
  }
}

module.exports = Bim;
