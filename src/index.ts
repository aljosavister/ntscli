#! /usr/bin/env node

import { program } from 'commander';
import { projectName } from './commands/project.js';
import { expressModule } from './commands/expressModule.js';


program.command('init').description('Initialize a template-nodejs')
  .argument('<new name>', 'Initialize a template-nodejs with <new name>')
  .action(projectName);
program.command('expressModule').description('Add Express server with sample api routes').action(expressModule);

program.parse();

