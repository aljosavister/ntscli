# Create Node.js TypeScript project

This command line can be used to create an empty Node.js projects with initial TypeScript configuration files.

A new project can be initialized with ntscli
```
npx ntscli init myproject
```

The command will pull source files from [template-ts-nodejs](https://github.com/aljosavister/template-ts-nodejs.git) and it will contain:
- Project for Visual Studio Code with launcher and tasks
- It is configured for ESM
- The project depends on dotenv, typescript, prettier, eslint and copyfiles
- Start and build scripts are using local tsc

### Modules
You can add additional module/s to the project.

For example to add express server with example api routes and default public folder, you can run
```
cd myproject
npx ntscli express .
```
