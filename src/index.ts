require("dotenv").config();
import "reflect-metadata";
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import express from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { verify } from "jsonwebtoken";

import {
  REDIS_OPTIONS,
  SESSION_OPTIONS,
  PORT,
  JWT_SECRET,
  IMG_DIR,
} from "./config";
import { logger } from "./utils/logger";
import { handleMqttMessage, mqttClient } from "./mqtt";
import { createApolloServer, getOrm } from "./graphql-server";
import { graphqlUploadExpress } from "graphql-upload";
import { seed } from "./seed";

export let orm: MikroORM<IDatabaseDriver<Connection>>;
let em: EntityManager<IDatabaseDriver<Connection>>;

export const main = async () => {
  try {
    orm = await getOrm();
    em = orm.em;
    // console.log(`orm.em`, orm.em.);
    const migrator = orm.getMigrator();
    const migrations = await migrator.getPendingMigrations();
    if (migrations && migrations.length > 0) {
      await migrator.up();
    }

    await seed(orm);

    // Only connect to MQTT Broker if database connection is established
    require("@root/mqtt");
    handleMqttMessage(em);
  } catch (error) {
    logger.error("📌 Could not connect to the database", error);
  }

  const app = express();

  //#region Authentication with session approach
  // const RedisStore = connectRedis(session);
  // const redisClient = redis.createClient(REDIS_OPTIONS);
  // redisClient.on("error", (err) => {
  //   logger.error(err);
  // });

  // app.use(
  //   session({
  //     ...SESSION_OPTIONS,
  //     store: new RedisStore({ client: redisClient, disableTouch: true }),
  //   })
  // );

  //#endregion

  app.use("static-resources", express.static(IMG_DIR));

  app.use((req, _, next) => {
    console.log(`req.headers`, req.headers);
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return next();
    try {
      const user = verify(token, JWT_SECRET);
      console.log(`user`, user);
      // @ts-ignore
      req.account = user;
    } catch (error) {
      logger.error(error);
    }
    next();
  });

  app.use(
    graphqlUploadExpress({
      maxFieldSize: 10000000,
      maxFileSize: 10 * 1000 * 1000,
    })
  );

  const apolloServer = await createApolloServer(em);

  apolloServer.applyMiddleware({
    app,
    onHealthCheck: async () => {
      const isDatabaseConnected = await orm.isConnected();
      const isMQTTConnected = mqttClient.connected;
      return new Promise((resolve, reject) => {
        if (isDatabaseConnected && isMQTTConnected) {
          resolve(undefined);
        } else {
          reject();
        }
      });
    },
  });

  app.listen(PORT, () => {
    logger.info(`🚀 Server listening on port ${PORT}`);
  });
};

main().catch((error) => logger.error(error));
