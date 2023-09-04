import chalk from 'chalk';
import fs from 'fs';
import yaml from 'yaml';

export function graphql() {
  console.log(chalk.blue.bold('Initializing graphql with bla bla'));
  const file = fs.readFileSync('./codegen.yml', 'utf8');
  const doc = yaml.parseDocument(file);
  console.log(doc.get('schema'));
  doc.set('schema','http://localhost/graphql');
  fs.writeFileSync('./codegen.yml', doc.toString(), 'utf8');

}
