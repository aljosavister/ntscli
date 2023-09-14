# NodeTypeScript command line

This commandline can be used to create empty nodejs projects with initial TypeScript configuration files.

A new project can be initialized with ntscli:
```
npx ntscli init myproject
```

It will contain:
- Project for vscode with launcher and tasks
- Configured for ESM
- With dependencies: dotenv, typescript, prettier, eslint, copyfiles
- Start, build, lint scripts

You can add additional module/s with the same command.

For example to add express server with some api routes and default public folder, you can run
```
cd myproject
npx ntscli express .
```

