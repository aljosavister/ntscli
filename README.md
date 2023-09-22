# Create Node.js TypeScript project

This command line can be used to create an empty Node.js projects with initial TypeScript configuration files.

A new project can be initialized with ntscli
```
npx ntscli init myproject
```

The command will pull source files from [template-ts-nodejs](https://github.com/aljosavister/template-ts-nodejs.git) and the boilerplate will be initialized with:
- Project file for Visual Studio Code with launcher and tasks
- ESM
- Dependencies: dotenv, typescript, prettier, eslint and copyfiles
- Start and build scripts that will use local tsc

## Prerequisites

Your environment must meet these prerequisites:
- Node.js
- npm
- git

## Modules
You can add additional module/s to the project.

For example to add express server with example api routes and default public folder, you can run
```
cd myproject
npx ntscli express .
```

Docker module:
```
cd myproject
npx ntscli docker .
```
## Change log

### v1.2.34 [22/09/2023]

- Fixing windows path problems
- Fixing removal of stale directories on windows
- Install npm modules after express serves is added

## License

Copyright 2023 aljosa.vister@gmail.com

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

## Disclaimer

`ntscli` is still in alpha phase of development and it is provided for educational purposes and should **not** be used in production environments. It has not undergone the necessary testing, security checks, and optimizations required for reliable and secure production use. Deploying it in such contexts may lead to unforeseen issues and vulnerabilities. Use it at your own risk, and exercise caution when considering production deployment.