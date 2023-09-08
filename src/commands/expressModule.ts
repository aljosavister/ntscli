import chalk from 'chalk';
import { execSync } from "child_process";
import fs from 'fs';
import yaml from 'yaml';
import copyfiles from 'copyfiles';
import {exec} from 'node:child_process';



export async function expressModule(path: string) {
  console.log(chalk.green.bold(`Working directory: ${process.cwd()}`));

  if (!fs.existsSync(`${path}/package.json`)) {
    console.log(chalk.red.bold(`Cannot find ${path}/package.json`));
    return;
  }

  let packageJson = fs.readFileSync(`${path}/package.json`, 'utf8');
  let packageJsonDoc = JSON.parse(packageJson);

  console.log(`Add express to ${packageJsonDoc.name} project ...`);

  try {
    process.chdir(`./${path}`);
    console.log(chalk.green.bold(`Working directory: ${process.cwd()}`));
  }
  catch (error) {
    console.log(chalk.red.bold(`chdir error: ${error}`));
  }

  console.log(chalk.green.bold(`Pull module-ts-nodejs-express`));
  try {
    execSync(`git clone https://github.com/aljosavister/module-ts-nodejs-express.git`)
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(chalk.green.bold(`Copy files`));
  try {
    await cp(["module-ts-nodejs-express/src/**/*", "./src/"], {up: 2});
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(chalk.green.bold(`Add dependencies to package.json`));
  let modulePackageJson = fs.readFileSync('./module-ts-nodejs-express/package.json', 'utf8');
  let modulePackageJsonDoc = JSON.parse(modulePackageJson);
  let newPackageJsonDoc = {
    ...packageJsonDoc
  }
  newPackageJsonDoc.dependencies = {
    ...packageJsonDoc.dependencies,
    ...modulePackageJsonDoc.dependencies
  }
  newPackageJsonDoc.devDependencies = {
    ...packageJsonDoc.devDependencies,
    ...modulePackageJsonDoc.devDependencies
  }  
  fs.writeFileSync(`./package.json`, JSON.stringify(newPackageJsonDoc), 'utf8');

  console.log(chalk.green.bold(`Run Prettier on package.json`));
  exec("./node_modules/prettier/bin/prettier.cjs -w package.json", (error, stdout, stderr) => {
    if (error !== null) {
        console.log(chalk.red.bold(`Prettier error: ${error}`));
    }
  });

}

async function cp(path: string[], options: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    copyfiles(path, options, ()=> {
      resolve();
    });
  });
}
