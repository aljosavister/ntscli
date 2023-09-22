import chalk from 'chalk';
import { execSync } from "child_process";
import fs from 'fs';
import copyfiles from 'copyfiles';
import * as prettier from "prettier";


export async function dockerModule(path: string) {
  console.log(`Working directory: ${process.cwd()}`);

  if (!fs.existsSync(`${path}/package.json`)) {
    console.error(chalk.red.bold(`Cannot find ${path}/package.json`));
    return;
  }

  let packageJson = fs.readFileSync(`${path}/package.json`, 'utf8');
  let packageJsonDoc = JSON.parse(packageJson);

  console.log(`Add docker for the ${packageJsonDoc.name} project ...`);

  try {
    process.chdir(`${path}`);
    console.log(`Working directory: ${process.cwd()}`);
  }
  catch (error) {
    console.error(chalk.red.bold(`chdir error: ${error}`));
  }

  console.log(`Pull module-ts-nodejs-docker`);
  try {
    execSync(`git clone --depth=1 https://github.com/aljosavister/module-ts-nodejs-docker.git`)
  } catch (error) {
    console.error(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(`Copy files from module-ts-nodejs-docker`);
  try {
    await cp(["module-ts-nodejs-docker/docker/*", "docker"], {up: 2});
    await cp(["module-ts-nodejs-docker/Dockerfile.azure", "."], {up: 1});
  } catch (error) {
    console.error(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(`Add scripts to package.json`);
  let newPackageJsonDoc = {
    ...packageJsonDoc
  }
  newPackageJsonDoc.scripts = {
    ...packageJsonDoc.scripts,
    "docker-build": `docker build --pull --rm -f "Dockerfile.azure" -t ${packageJsonDoc.name}:latest "."`,
  }

  const newPackageJsonDocString = await prettier.format(JSON.stringify(newPackageJsonDoc), {parser: "json"});
  fs.writeFileSync(`package.json`, newPackageJsonDocString, 'utf8');



  setTimeout(() => {
    console.log(`Remove module-ts-nodejs-docker`);
    try {
      fs.rmSync("module-ts-nodejs-docker", {recursive: true, force: true});
    } catch (error) {
      console.error(chalk.red.bold(`exec error: ${error}`));    
    }
    
    console.log(chalk.green.bold(`\nYou can now build docker image with: npm run docker-build`));
    if (!fs.existsSync(`dist`)) {
      console.log(chalk.yellow.bold(`Warning: Missing dist. Please build ${packageJsonDoc.name} with npm run build, before building docker image.`));
    }
  
    return;
  }, 500);
}

async function cp(path: string[], options: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    copyfiles(path, options, ()=> {
      resolve();
    });
  });
}
