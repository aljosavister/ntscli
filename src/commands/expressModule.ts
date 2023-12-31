import chalk from 'chalk';
import { execSync } from "child_process";
import fs from 'fs';
import copyfiles from 'copyfiles';
import * as prettier from "prettier";


export async function expressModule(path: string) {
  console.log(`Working directory: ${process.cwd()}`);

  if (!fs.existsSync(`${path}/package.json`)) {
    console.error(chalk.red.bold(`Cannot find ${path}/package.json`));
    return;
  }

  let packageJson = fs.readFileSync(`${path}/package.json`, 'utf8');
  let packageJsonDoc = JSON.parse(packageJson);

  console.log(`Add express to ${packageJsonDoc.name} project ...`);

  try {
    process.chdir(`${path}`);
    console.log(`Working directory: ${process.cwd()}`);
  }
  catch (error) {
    console.error(chalk.red.bold(`chdir error: ${error}`));
  }

  console.log(`Pull module-ts-nodejs-express`);
  try {
    execSync(`git clone --depth=1 https://github.com/aljosavister/module-ts-nodejs-express.git`)
  } catch (error) {
    console.error(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(`Copy files`);
  try {
    await cp(["module-ts-nodejs-express/src/**/*", "src/"], {up: 2});
  } catch (error) {
    console.error(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(`Add dependencies to package.json`);
  let modulePackageJson = fs.readFileSync('module-ts-nodejs-express/package.json', 'utf8');
  let modulePackageJsonDoc = JSON.parse(modulePackageJson);
  modulePackageJsonDoc.author = "";
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

  const newPackageJsonDocString = await prettier.format(JSON.stringify(newPackageJsonDoc), {parser: "json"});
  fs.writeFileSync(`package.json`, newPackageJsonDocString, 'utf8');

  setTimeout(()=> {
    console.log(`Remove module-ts-nodejs-express`);
    try {
      fs.rmSync("module-ts-nodejs-express", {recursive: true, force: true});
    } catch (error) {
      console.error(chalk.red.bold(`exec error: ${error}`));    
    }

    console.log(`Installing node modules...`);
    try {
      execSync("npm install")
    } catch (error) {
      console.error(chalk.red.bold(`npm error: ${error}`));
      return;
    }    
  
    console.log(chalk.green.bold(`\nYou can now add contents from express-example.ts to your startup file/process`));
  
    return
  }, 500);
}

async function cp(path: string[], options: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    copyfiles(path, options, ()=> {
      resolve();
    });
  });
}
