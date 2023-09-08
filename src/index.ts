#! /usr/bin/env node

import { program } from 'commander';
import { projectName } from './commands/project.js';
import { expressModule } from './commands/expressModule.js';


program.command('init').description('Initialize a template-ts-nodejs')
  .argument('<new name>', 'Initialize a template-ts-nodejs with <new name>')
  .action(projectName);
program.command('express').description('Add Express server with sample api routes')
  .argument('<path>', '<path> of the project to add express server module')
  .action(expressModule);

program.parse();

