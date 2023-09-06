import chalk from 'chalk';
import { execSync } from "child_process";
import fs, { PathLike } from 'fs';
import {exec} from 'node:child_process';

export async function projectName(name: string) {
  if (fs.existsSync(name)) {
    console.log(chalk.red.bold(`Path ${name} already exists`));   
    return;
  }

  console.log(chalk.green.bold(`Pull template-ts-nodejs into ${name}`));
  try {
    execSync(`git clone git@github.com:aljosavister/template-ts-nodejs.git ${name}`)
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  try {
    process.chdir(`./${name}`);
    console.log(chalk.green.bold(`Working directory: ${process.cwd()}`));
  }
  catch (error) {
    console.log(chalk.red.bold(`chdir error: ${error}`));
  } 

  console.log(chalk.green.bold(`Change package.json name to ${name}`));
  let file = fs.readFileSync('./package.json', 'utf8');
  let doc = JSON.parse(file);
  doc.name = name;
  // console.log(JSON.stringify(doc));
  fs.writeFileSync('./package.json', JSON.stringify(doc), 'utf8');
  
  console.log(chalk.green.bold(`Change default.code-workspace name to ${name}`));
  file = fs.readFileSync('./default.code-workspace', 'utf8');
  doc = JSON.parse(file);
  doc.folders[0].name = name;
  // console.log(JSON.stringify(doc));
  fs.writeFileSync('./default.code-workspace', JSON.stringify(doc), 'utf8');

  console.log(chalk.green.bold(`Remove .git repository`));
  try {
    execSync("rm -rf .git")
  } catch (error) {
    console.log(chalk.red.bold(`exec error: ${error}`));    
  }

  console.log(chalk.green.bold(`Install node modules`));  
  try {
    execSync("npm install")
  } catch (error) {
    console.log(chalk.red.bold(`npm error: ${error}`));
  }

  console.log(chalk.green.bold(`Run Prettier on package.json`));
  exec("./node_modules/prettier/bin/prettier.cjs -w package.json", (error, stdout, stderr) => {
    if (error !== null) {
        console.log(chalk.red.bold(`Prettier error: ${error}`));
    }
  });  
  
  console.log(chalk.green.bold(`Run Prettier on default.code-workspace`));
  try {
    execSync("./node_modules/prettier/bin/prettier.cjs -w --parser json default.code-workspace")
  } catch (error) {
    console.log(chalk.red.bold(`Prettier error: ${error}`));
  }
}