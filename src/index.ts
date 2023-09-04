#! /usr/bin/env node

import { program } from 'commander';
import { projectName } from './commands/project';
import { graphql } from './commands/graphql';


program.command('init').description('Initialize a template-nodejs')
  .argument('<new name>', 'Initialize a template-nodejs with <new name>')
  .action(projectName);
program.command('graphql').description('Connect project to a graphql server').action(graphql);

program.parse();

