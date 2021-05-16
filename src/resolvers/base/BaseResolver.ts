import { PrimaryKey, Property } from "@mikro-orm/core";
import {
  MyContext,
  DeleteResponse,
  QueryOptions,
  IResponse,
  PaginatedResponse,
} from "@root/types";
import { logger } from "@root/utils/logger";
import queryBuilder from "@root/utils/queryBuilder";
import { GraphQLResolveInfo } from "graphql";
import fieldsToRelations from "graphql-fields-to-relations";
import {
  Arg,
  ClassType,
  Ctx,
  Field,
  ObjectType,
  Info,
  Int,
  InterfaceType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

export function createBaseResolver<T extends ClassType>({
  objectTypeCls,
  suffix,
}: {
  objectTypeCls: T;
  suffix?: string;
}) {
  const name = suffix ? suffix : objectTypeCls.name;
  // 	@ts-ignore
  @ObjectType(`${objectTypeCls.name}PaginatedResponse`)
  // @ts-ignore
  class BasePaginatedResponse extends PaginatedResponse(objectTypeCls) {}

  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query(() => BasePaginatedResponse, { name: `get${name}s` })
    async getAll(
      @Ctx() { em }: MyContext,
      @Arg("where", { nullable: true })
      where: QueryOptions,
      @Info() info: GraphQLResolveInfo
    ): Promise<BasePaginatedResponse> {
      const { sortBy, filterBy, numPage, perPage } = queryBuilder(where);
      const list_data = await em.find(
        objectTypeCls,
        { ...filterBy },
        {
          // populate: relationPaths,
          limit: perPage,
          offset: perPage * (numPage - 1),
          orderBy: sortBy,
        }
      );
      const total = await em.count(objectTypeCls);
      return {
        result: {
          perPage,
          numPage,
          list_data,
          total,
        },
      };

      // const relationPaths = fieldsToRelations(info);
      // return em.find(objectTypeCls, {}, relationPaths);
    }

    // @Query(() => objectTypeCls, { name: `get${name}ById` })
    // async getById(
    //   @Arg("id", () => ID) id: any,
    //   @Ctx() { em }: MyContext,
    //   @Info() info: GraphQLResolveInfo
    // ): Promise<T> {
    //   const relationPaths = fieldsToRelations(info);
    //   return em.findOneOrFail(objectTypeCls, { id }, relationPaths);
    // }

    @Mutation(() => IResponse, { name: `delete${name}` })
    async deleteById(
      @Arg("id", () => Int) id: number,
      @Ctx() { em }: MyContext
    ): Promise<DeleteResponse> {
      const res = new DeleteResponse();
      try {
        const deleteAmount = await em.nativeDelete(objectTypeCls, { id });
        if (deleteAmount) {
          res.message = "Xóa thành công";
        } else {
          res.errors = [{ field: "id", message: "Id không tồn tại" }];
        }
      } catch (error) {
        logger.error(error);
        res.message = "Xóa thất bại";
      } finally {
        return res;
      }
    }

    @Mutation(() => IResponse, { name: `delete${name}s` })
    async deleteByIds(
      @Arg("ids", () => [Int]) ids: number,
      @Ctx() { em }: MyContext
    ): Promise<DeleteResponse> {
      const res = new DeleteResponse();
      try {
        const deleteAmount = await em.nativeDelete(objectTypeCls, {
          id: {
            $in: ids,
          },
        });
        console.log(`deleteAmount`, deleteAmount);
        if (deleteAmount) {
          res.message = "Xóa thành công";
        } else {
          res.errors = [{ field: "ids", message: "Id không tồn tại" }];
        }
      } catch (error) {
        logger.error(error);
        res.message = "Xóa thất bại";
      } finally {
        return res;
      }
    }
    // @Mutation(() => objectTypeCls, { name: `create${name}` })
    // async create(
    //   @Arg("data", () => objectTypeCls) data: T,
    //   @Ctx() { em }: MyContext
    // ): Promise<T> {
    //   const entity = em.create(objectTypeCls, data);
    //   await em.persistAndFlush(entity);
    //   return entity;
    // }
  }

  return BaseResolver;
}
