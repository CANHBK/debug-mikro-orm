import { ApolloServer } from "apollo-server-express";
import { AuthChecker, buildSchema } from "type-graphql";
import path from "path";
import { MyContext } from "./types";
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { MIKRO_OPTIONS } from "./config";
import { ErrorInterceptor } from "./middleware/ErrorInterceptor";
import { logger } from "./utils/logger";
import { GraphQLError } from "graphql";

const globPathNameToGraphQLResolverFiles =
  "**/resolvers/**/+([A-Za-z]).{ts,js}";

export const getOrm = () => MikroORM.init(MIKRO_OPTIONS);

export const customAuthChecker: AuthChecker<MyContext> = (
  { root, args, context, info },
  roles
) => {
  if (!context.req.account) {
    logger.error("Not Authenticated");
    return false;
  }

  return true; // or false if access is denied
};

export const createApolloServer = async (
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
) => {
  const emitSchemaFile =
    process.env.NODE_ENV !== "production"
      ? {
          path: __dirname + "../../../web/schema.gql",
          commentDescriptions: true,
          sortedSchema: false,
        }
      : undefined;
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        path.join(__dirname, globPathNameToGraphQLResolverFiles),
        path.join(__dirname, "**/modules/**/*.resolver.{ts,js}"),
      ],
      validate: false,
      authChecker: customAuthChecker,
      globalMiddlewares: [ErrorInterceptor],
      emitSchemaFile,
    }),
    uploads: false,
    formatError: (error) => {
      const { originalError } = error;
      console.log(`originalError`, originalError);
      const errorId = v4();

      logger.error(new Error(JSON.stringify({ id: errorId, ...error })));
      return new GraphQLError(`Internal Error: ${errorId}`);
    },
    //@ts-ignore
    context: ({ req, res }): MyContext => ({ em: em.fork(), req, res }),
  });
};
