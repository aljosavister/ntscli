/**
 * Module dependencies.
 */
import Express from "express";
import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import Api from "./routes/api.js";
import { fileURLToPath } from "url";
import session from "express-session";
import cookieParser from "cookie-parser";
import { AppContext } from "./app-context.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class App {
  private expressApplication: Express.Application;
  private api: any;
  public server;
  private port;

  constructor(appContext: AppContext, port: number) {
    this.port = port;
    this.api = new Api();
    this.expressApplication = Express();
    this.server = http.createServer(this.expressApplication);
    this.expressApplication.use(
      session({
        secret: "CHANGEME",
        resave: false,
        saveUninitialized: true,
      })
    );

    // Add context
    this.expressApplication.use((req: any, res, next) => {
      req.appContext = appContext;
      next();
    });

    // Body parser (req.body)
    this.expressApplication.use(Express.json());
    this.expressApplication.use(Express.urlencoded({ extended: false }));

    // Add cookie parser
    this.expressApplication.use(cookieParser());

    // Static / public folder
    const publicHome =
      process.env.PUBLIC_HOME === null || process.env.PUBLIC_HOME === undefined
        ? "public"
        : process.env.PUBLIC_HOME;
    this.expressApplication.use(
      Express.static(path.join(__dirname, publicHome))
    );

    // Map routes
    this.expressApplication.use("/api", this.api.router);
  }

  public async start() {
    // Listen on provided port, on all network interfaces.
    this.server.listen(this.port);
    this.server.on("error", (error: { syscall: string; code: any }) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind =
        typeof this.port === "string"
          ? `Pipe ${this.port}`
          : `Port ${this.port}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
    this.server.on("listening", () => {
      App.bind(this);
      const addr = this.server.address();
      const bind =
        typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
      console.log(`Listening on ${bind}`);
    });
  }

}
