import chalk from 'chalk';
import { execSync } from "child_process";
import fs, { PathLike } from 'fs';
import * as prettier from "prettier";

export async function projectName(name: string) {
  if (fs.existsSync(name)) {
    console.error(chalk.red.bold(`Path ${name} already exists`));   
    return;
  }

  console.log(`Make directory ${name}`);
  try {
    fs.mkdirSync(`${name}`);
  }
  catch (error) {
    console.error(chalk.red.bold(`mkdir error: ${error}`));
    return;
  }

  console.log(`Pull template-ts-nodejs into ${name}`);
  try {
    execSync(`git clone --depth=1 https://github.com/aljosavister/template-ts-nodejs.git ${name}`)
  } catch (error) {
    console.error(chalk.red.bold(`exec error: ${error}`));    
    return;
  }

  try {
    process.chdir(`${name}`);
    console.log(`Working directory: ${process.cwd()}`);
  }
  catch (error) {
    console.error(chalk.red.bold(`chdir error: ${error}`));
    return;
  } 

  console.log(`Change package.json name to ${name}`);
  let file = fs.readFileSync('package.json', 'utf8');
  let doc = JSON.parse(file);
  doc.name = name;
  let docString = await prettier.format(JSON.stringify(doc), {parser: "json"});
  fs.writeFileSync('package.json', docString, 'utf8');
  
  console.log(`Change default.code-workspace name to ${name}`);
  file = fs.readFileSync('default.code-workspace', 'utf8');
  doc = JSON.parse(file);
  doc.folders[0].name = name;
  docString = await prettier.format(JSON.stringify(doc), {parser: "json"});
  fs.writeFileSync('default.code-workspace', docString, 'utf8');

  console.log(`Remove .git repository`);
  try {
    fs.rmSync(".git", {recursive: true, force: true});
  } catch (error) {
    console.error(chalk.red.bold(`exec error: ${error}`));
    return;
  }

  console.log(`Installing node modules...`);
  try {
    execSync("npm install")
  } catch (error) {
    console.error(chalk.red.bold(`npm error: ${error}`));
    return;
  }
  
  return;
}