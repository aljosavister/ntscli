import chalk from 'chalk';
import { execSync } from "child_process";
import fs from 'fs';
import yaml from 'yaml';
import copyfiles from 'copyfiles';
import {exec} from 'node:child_process';
import * as prettier from "prettier";


export async function dockerModule(path: string) {
  console.log(chalk.green.bold(`Working directory: ${process.cwd()}`));

  if (!fs.existsSync(`${path}/package.json`)) {
    console.log(chalk.red.bold(`Cannot find ${path}/package.json`));
    return;
  }

  let packageJson = fs.readFileSync(`${path}/package.json`, 'utf8');
  let packageJsonDoc = JSON.parse(packageJson);

  console.log(`Add docker for the ${packageJsonDoc.name} project ...`);

  try {
    process.chdir(`./${path}`);
    console.log(chalk.green.bold(`Working directory: ${process.cwd()}`));
  }
  catch (error) {
    console.log(chalk.red.bold(`chdir error: ${error}`));
  }

  console.log(chalk.green.bold(`Pull module-ts-nodejs-docker`));
  try {
    execSync(`git clone --depth=1 https://github.com/aljosavister/module-ts-nodejs-docker.git`)
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(chalk.green.bold(`Copy files`));
  try {
    await cp(["module-ts-nodejs-docker/docker/*", "./docker"], {up: 2});
    await cp(["module-ts-nodejs-docker/Dockerfile.azure", "./"], {up: 1});
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(chalk.green.bold(`Add dependencies to package.json`));
  let newPackageJsonDoc = {
    ...packageJsonDoc
  }
  newPackageJsonDoc.scripts = {
    ...packageJsonDoc.scripts,
    "docker-build": `docker build --pull --rm -f "Dockerfile.azure" -t ${packageJsonDoc.name}:latest "."`,
  }

  const newPackageJsonDocString = await prettier.format(JSON.stringify(newPackageJsonDoc), {parser: "json"});
  fs.writeFileSync(`./package.json`, newPackageJsonDocString, 'utf8');


  console.log(chalk.green.bold(`Remove module-ts-nodejs-docker`));
  try {
    fs.rmSync("./module-ts-nodejs-docker", {recursive: true, force: true});
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }
  
  console.log(`\nYou can now build docker image with: npm run build-docker`);
  if (!fs.existsSync(`dist`)) {
    console.log(chalk.yellow.bold(`Warning: Missing ./dist. Please build ${packageJsonDoc.name} with npm run build, before building docker image.`));
  }

  return;
}

async function cp(path: string[], options: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    copyfiles(path, options, ()=> {
      resolve();
    });
  });
}
