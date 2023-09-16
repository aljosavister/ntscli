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

### Modules
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
