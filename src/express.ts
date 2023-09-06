/**
 * Module dependencies.
 */
import App from "./app.js";
import HubProxy from "./hub/hub-proxy.js";
import { exit } from "process";
import ShortUniqueId from "short-unique-id";
import MongoPrivateMutations from "./mongo/private-mutations.js";
import MongoPrivateQueries from "./mongo/private-queries.js";
import MongoQueries from "./mongo/queries.js";
import MongoMutations from "./mongo/mutations.js";
import { HubMode } from "./hub/hub-proxy.js";
import terminate from "./terminate.js";
import { AppContext } from "./app-context.js";
import {
  CommandType,
  ICommandMessage,
  ITelemetryMessage,
  TelemetryCommandType,
} from "./graphql/schema.js";
import { CommandsModel, DeviceModel } from "./graphql/model.js";

// Set devel_ prefix if running for development
const devel: string = process.env.NODEJS === "PROD" ? "" : "devel_";
const consumerGroup: string = process.env.NODEJS === "PROD" ? "prod" : "devel";
const mongoHost = process.env.MONGO_HOST;
if (process.env.NODEJS === "PROD") {
  console.log("Production");
} else {
  console.log(`Development with prefix ${devel}`);
}

// Generate unique controller id
const shortUniqueId = new ShortUniqueId.default();
const controllerUID = shortUniqueId();
const controllerGID = process.env.GW_CONTROLLER_GID;

/**
 * MongoDB configuration
 */
const mongoPrivateMutations = new MongoPrivateMutations(
  `mongodb://${mongoHost}/${devel}ilmc`
);

const mongoPrivateQueries = new MongoPrivateQueries(
  `mongodb://${mongoHost}/${devel}ilmc`
);

const mongoQueries = new MongoQueries(`mongodb://${mongoHost}/${devel}ilmc`);

const mongoMutations = new MongoMutations(
  `mongodb://${mongoHost}/${devel}ilmc`
);

// Create hub proxy
const mqttHost: string =
  process.env.MQTT_HOST === null ? "localhost:1883" : process.env.MQTT_HOST;

let mqttSSL: boolean;
try {
  mqttSSL = process.env.MQTT_SSL !== "YES" ? false : true;
} catch {
  console.log("Could not parse MQTT_SSL");
}

let mqttAdvertiseInTopic: string;
try {
  mqttAdvertiseInTopic =
    process.env.MQTT_ADVERTISE_IN_TOPIC === null
      ? "controllers"
      : process.env.MQTT_ADVERTISE_IN_TOPIC.replaceAll(
          "{{UID}}",
          controllerUID
        ).replaceAll("{{GID}}", controllerGID);
} catch {
  console.log("Could not parse MQTT_ADVERTISE_IN_TOPIC");
}

let mqttDataTopic: string;
try {
  mqttDataTopic =
    process.env.MQTT_DATA_TOPIC === null
      ? "controllers"
      : process.env.MQTT_DATA_TOPIC.replaceAll(
          "{{UID}}",
          controllerUID
        ).replaceAll("{{GID}}", controllerGID);
} catch (error) {
  console.log(`Could not parse MQTT_DATA_TOPIC: ${error}`);
}

let mqttCmdReqTopic: string;
try {
  mqttCmdReqTopic =
    process.env.MQTT_CMD_REQ_TOPIC === null
      ? "controllers"
      : process.env.MQTT_CMD_REQ_TOPIC.replaceAll(
          "{{UID}}",
          controllerUID
        ).replaceAll("{{GID}}", controllerGID);
} catch (error) {
  console.log(`Could not parse MQTT_CMD_REQ_TOPIC: ${error}`);
}

let mqttSubToTopics: string[] | string;
try {
  mqttSubToTopics =
    process.env.MQTT_SUB_TO_TOPICS === null
      ? "controllers"
      : process.env.MQTT_SUB_TO_TOPICS.replaceAll("{{UID}}", controllerUID)
          .replaceAll("{{GID}}", controllerGID)
          .concat(";", mqttCmdReqTopic)
          .split(";");
} catch (error) {
  console.log(`Could not parse MQTT_SUB_TO_TOPICS: ${error}`);
}

let hubMode: HubMode = HubMode.Mosquitto;
if (process.env.HUB_MODE === "Mosquitto") {
  hubMode = HubMode.Mosquitto;
} else {
  console.log("Hub mode is undefined");
  exit();
}

const hub = new HubProxy(
  hubMode,
  mqttSubToTopics,
  mqttHost,
  mqttSSL,
  mqttAdvertiseInTopic,
  controllerUID,
  mqttDataTopic,
  mqttCmdReqTopic
);

// Create HTTP server
const context: AppContext = {
  mongoPrivateQueries,
  mongoPrivateMutations,
  mongoQueries,
  mongoMutations,
  hub,
};
const app = new App(context, 3200);
app.start();

/**
 * Event listener for IoT hub events.
 * In this event we store data in the cloud database and update SocketIO clients
 */
HubProxy.eventhub.on(
  "events",
  async (events: ITelemetryMessage[] | ICommandMessage[]) => {
    try {
      for (const message of events) {
        hub.sendEvent(message);
        if (message.command === TelemetryCommandType.Telemetry) {
          const telemetryMessage: ITelemetryMessage = message;
          const device: DeviceModel = {
            configuration: telemetryMessage.configuration,
            controllerId: telemetryMessage.controllerId,
          };
          mongoPrivateMutations.updateDeviceTelemetry(device);
        }
        if (message.command === CommandType.Configuration) {
          const commandMessage: ICommandMessage = message;
          const command: CommandsModel = {
            userId: commandMessage.userId,
            ts: new Date(),
            controllerId: commandMessage.controllerId,
            command: commandMessage.command,
            configuration: commandMessage.configuration,
          };
          mongoPrivateMutations.createCommand(command);
        } else if (message.command === CommandType.Irrigate) {
          const commandMessage: ICommandMessage = message;
          const command: CommandsModel = {
            userId: commandMessage.userId,
            ts: new Date(),
            controllerId: commandMessage.controllerId,
            command: commandMessage.command,
            timeInSeconds: commandMessage.timeInSeconds,
          };
          mongoPrivateMutations.createCommand(command);
        }
      }
    } catch (error) {
      handleResponse(error);
    }
  }
);

function handleResponse(res: any) {
  if (res.UserInputError) {
    console.error(res.UserInputError);
  } else if (res.Error) {
    console.error(res.Error);
  } else if (res.AuthenticationError) {
    console.error(res.AuthenticationError);
  } else if (res instanceof Error) {
    console.error(res.message);
  } else {
    return res;
  }
}

/**
 * Error handler
 */
const exitHandler = terminate(app.server, {
  coredump: false,
  timeout: 500,
});

process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
process.on("SIGTERM", exitHandler(0, "SIGTERM"));
process.on("SIGINT", exitHandler(0, "SIGINT"));
