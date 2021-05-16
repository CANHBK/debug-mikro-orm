import { Collection, wrap } from "@mikro-orm/core";
import { Permission } from "@root/entities/Permission";

import { PaginatedResponse, Response } from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import { Field, InputType, ObjectType, Resolver } from "type-graphql";

//@ts-ignore
@ObjectType()
//@ts-ignore
class PermissionResponse extends Response(Permission) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
export class PermissionTableResponse extends PaginatedResponse(Permission) {}

@InputType()
class PermissionCreateInput {
  @Field()
  name: string;
}

@InputType()
class PermissionUpdateInput {
  @Field()
  id!: number;

  @Field({ nullable: true })
  name: string;
}

@Resolver()
export class PermissionResolver {
  // @Query(() => PermissionResponse)
  // async getPermission(@Ctx() { em }: MyContext, @Arg("id") id: number) {
  // 	const permission = await em.findOne(Permission, { id: id });
  // 	if (!permission)
  // 		return {
  // 			errors: [
  // 				{
  // 					message: "Không tìm thấy Permission này",
  // 				},
  // 			],
  // 		};
  // 	return {
  // 		result: permission,
  // 	};
  // }
  //   @Mutation(() => PermissionResponse)
  //   async createPermission(
  //     @Ctx() { em }: MyContext,
  //     @Arg("inputs") inputs: PermissionCreateInput
  //   ) {
  //     const permission = em.create(Permission, inputs);
  //     em.persist(permission);
  //     try {
  //       await em.flush();
  //     } catch (error) {
  //       return {
  //         errors: [
  //           {
  //             message: error,
  //           },
  //         ],
  //       };
  //     }
  //     return {
  //       result: permission,
  //     };
  //   }
  //   @Mutation(() => PermissionResponse)
  //   async updatePermission(
  //     @Ctx() { em }: MyContext,
  //     @Arg("inputs") inputs: PermissionUpdateInput
  //   ) {
  //     let permission = await em.findOne(Permission, { id: inputs.id });
  //     if (!permission) {
  //       return {
  //         errors: [
  //           {
  //             field: "id",
  //             message: "Không tồn tại Permission này",
  //           },
  //         ],
  //       };
  //     }
  //     wrap(permission).assign({
  //       ...inputs,
  //     });
  //     em.persist(permission);
  //     try {
  //       await em.flush();
  //     } catch (error) {
  //       return {
  //         errors: [
  //           {
  //             message: error,
  //           },
  //         ],
  //       };
  //     }
  //     return {
  //       result: permission,
  //       message: "Cập nhật thông tin Permission thành công",
  //     };
  //   }
  //   @Mutation(() => PermissionResponse)
  //   async deletePermission(@Arg("inputs") id: number, @Ctx() { em }: MyContext) {
  //     const permission = await em.findOne(Permission, { id });
  //     if (!permission)
  //       return {
  //         errors: {
  //           message: "Không tồn tại Permission này",
  //           field: "id",
  //         },
  //       };
  //     await em.remove(permission).flush();
  //     return {
  //       message: "Xoá Permission thành công",
  //     };
  //   }
}
