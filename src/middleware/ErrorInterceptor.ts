import { Manager } from "@root/entities/Manager";
import { MyContext, IResponse } from "@root/types";
import { logger } from "@root/utils/logger";
import { MiddlewareInterface, NextFn, ResolverData } from "type-graphql";

const NotFoundErrorMessage = {
  [Manager.name]: "Người quản lý không tồn tại",
};

// export const ErrorInterceptor: MiddlewareFn<any> = async (
//   { context, info },
//   next
// ) => {
//   try {
//     return await next();
//   } catch (err) {

//     console.log(`err.message`, err.message);
//     logger.error(err);
//   }
// };

// Example message: `Manager not found ({ employeeId: 1 })`
const entityNameRegex = /([a-zA-z0-9]+)(?= not found \((.*)\))/gim;

export class ErrorInterceptor implements MiddlewareInterface<MyContext> {
  async use(
    { context, info }: ResolverData<MyContext>,
    next: NextFn
  ): Promise<IResponse> {
    try {
      return await next();
    } catch (err) {
      logger.error(err);
      const errors: IResponse["errors"] = [];
      const entityNotFound = entityNameRegex.exec(err.message as string)?.[1];

      // TODO: get field not found from message
      const fieldNotFound = Array.from(
        entityNameRegex.exec(err.message as string) || []
      )[2] as any;

      if (entityNotFound) {
        errors.push({
          field: fieldNotFound,
          message: NotFoundErrorMessage[entityNotFound.trim()],
        });
        return { errors };
      }
      return { message: "Server Error" };
    }
  }
}
