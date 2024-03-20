# Node.js TypeScript project creator

This command line can be used to create an empty Node.js projects with initial TypeScript configuration files.

A new project can be initialized with ntscli
```
npx ntscli init myproject

or from custom repository with

npx ntscli git myproject 'https://github.com/aljosavister/template-ts-nodejs.git'
```

The command will pull source files from [template-ts-nodejs](https://github.com/aljosavister/template-ts-nodejs.git) and the boilerplate will be initialized with:
- Project file for Visual Studio Code with launcher and tasks
- ECMAScript 2022 configuration with Node.js-style module resolution
- Output directory for transpiled code: ./dist
- Dependencies: dotenv, typescript, prettier, eslint and copyfiles
- Start and build scripts that will use 'tsc' from within the project.

## Prerequisites

Your environment must meet these prerequisites:
- Node.js
- npm
- git

## Modules
You can add additional module/s to the project.

### Express module
- Documentation: [module-ts-nodejs-express](https://github.com/aljosavister/module-ts-nodejs-express)
- To add **express web server** with example api routes and default public folder, you can run:
```
cd myproject
npx ntscli express .
```

### Docker module
- Documentation: [module-ts-nodejs-docker](https://github.com/aljosavister/module-ts-nodejs-docker)
- To add Dockerfile, configured specifically for Azure webapp, you can run:
```
cd myproject
npx ntscli docker .
```

## Change log

### v1.2.41 [20/03/2024]

- Add ability to initialize from custom git repo.

## Disclaimer

`ntscli` is still in alpha phase of development and it is provided for educational purposes and should **not** be used in production environments. It has not undergone the necessary testing, security checks, and optimizations required for reliable and secure production use. Deploying it in such contexts may lead to unforeseen issues and vulnerabilities. Use it at your own risk, and exercise caution when considering production deployment.
