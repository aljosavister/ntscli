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

### v1.2.24 [17/09/2023]

- Add docker build script to package.json
- Use API for prettier

## License

Copyright 2023 aljosa.vister@gmail.com

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

## Disclaimer

`ntscli` is still in alpha phase of development. Please report bugs on https://github.com/aljosavister/ntscli/issues