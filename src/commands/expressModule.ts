import chalk from 'chalk';
import { execSync } from "child_process";
import fs from 'fs';
import yaml from 'yaml';
import copyfiles from 'copyfiles';



export async function expressModule() {
  process.chdir(`./example`);

  if (!fs.existsSync('./package.json')) {
    console.log(chalk.red.bold(`Path package.json does not exists`));
    return;
  }

  console.log(chalk.green.bold(`Pull module-ts-nodejs-express`));
  try {
    execSync(`git clone git@github.com:aljosavister/module-ts-nodejs-express.git`)
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(chalk.green.bold(`Copy files`));
  try {
    await cp(["module-ts-nodejs-express/src/**/*", "./src/"], {up: 2});
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(chalk.green.bold(`Add modules to package.json`));
  let file = fs.readFileSync('./package.json', 'utf8');
  let doc = JSON.parse(file);
  let moduleFile = fs.readFileSync('./module-ts-nodejs-express/package.json', 'utf8');
  let moduleDoc = JSON.parse(moduleFile);
  doc = {...moduleDoc}
  // console.log(JSON.stringify(doc));
  fs.writeFileSync('./package.json', JSON.stringify(doc), 'utf8');

}

async function cp(path: string[], options: any) {
  return new Promise<void>((resolve, reject) => {
    copyfiles(path, options, ()=> {
      resolve;
    });
  });
}
