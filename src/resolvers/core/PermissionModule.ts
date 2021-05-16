import { Collection, wrap } from "@mikro-orm/core";
import { Permission } from "@root/entities/Permission";
import {
  PermissionCode,
  permissionModules,
  permissions,
  Permission as IPermission,
  PermissionModuleCode,
  permissionGroups,
  PermissionGroupCode,
} from "@root/permission";
import { PermissionModule as IPermissionModule } from "@root/permission";

import {
  MyContext,
  PaginatedResponse,
  QueryOptions,
  Response,
} from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import { difference, differenceBy, flatten } from "lodash";
import {
  Arg,
  Authorized,
  createUnionType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  InterfaceType,
  Mutation,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";

registerEnumType(PermissionModuleCode, {
  name: "PermissionModuleCode",
});
registerEnumType(PermissionGroupCode, {
  name: "PermissionGroupCode",
});

registerEnumType(PermissionCode, {
  name: "PermissionCode",
});

@ObjectType({
  description: "Permission Module được định nghĩa trong code",
})
export class PermissionModuleCore implements IPermissionModule {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => PermissionModuleCode)
  code: PermissionModuleCode;
  @Field(() => [IPrivilege])
  privileges: IPrivilege[];
}

@InterfaceType({
  resolveType: (value) => value.constructor.name,
})
export abstract class IPrivilege {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => PermissionModuleCode)
  moduleCode: PermissionModuleCode;
}

@ObjectType({
  description: "Permission được định nghĩa trong code",
  implements: IPrivilege,
})
export class PermissionCore implements IPrivilege {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  moduleCode: PermissionModuleCode;

  @Field(() => PermissionCode, { name: "permissionCode" })
  code: PermissionCode;

  @Field(() => PermissionModuleCore)
  modules: PermissionModuleCore;
}
@ObjectType({
  description: "Permission Group được định nghĩa trong code",
  implements: IPrivilege,
})
export class PermissionGroupCore implements IPrivilege {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  moduleCode: PermissionModuleCode;

  @Field(() => PermissionGroupCode, { name: "groupCode" })
  code: PermissionGroupCode;

  @Field(() => PermissionModuleCore)
  modules: PermissionModuleCore;

  @Field(() => [PermissionCore])
  permissions: PermissionCore[];
}

@Resolver((of) => PermissionModuleCore)
export class PermissionModuleCoreResolver
  implements ResolverInterface<PermissionModuleCore> {
  @FieldResolver()
  privileges(@Root() permissionModuleCore: PermissionModuleCore): IPrivilege[] {
    const permissionsCore = permissions
      .filter(({ moduleCode }) => moduleCode === permissionModuleCore.code)
      .map((item) => {
        const permission = new PermissionCore();
        permission.code = item.code;
        permission.description = item.description;
        permission.moduleCode = item.moduleCode;
        permission.name = item.name;

        return permission;
      });
    const permissionsBelongGroupCore = permissions
      .filter(
        ({ moduleCode, groupCode }) =>
          moduleCode === permissionModuleCore.code && groupCode
      )
      .map((item) => {
        const permission = new PermissionCore();
        permission.code = item.code;
        permission.description = item.description;
        permission.moduleCode = item.moduleCode;
        permission.name = item.name;

        return permission;
      });
    const permissionsGroupCore = permissionGroups
      .filter(({ moduleCode }) => moduleCode === permissionModuleCore.code)
      .map((item) => {
        const permission = new PermissionGroupCore();
        permission.code = item.code;
        permission.description = item.description;
        permission.moduleCode = item.moduleCode;
        permission.name = item.name;

        return permission;
      });

    console.log("a: ", permissionsCore);
    console.log("b: ", permissionsBelongGroupCore);

    console.log(
      "c: ",
      differenceBy(permissionsCore, permissionsBelongGroupCore, "code")
    );

    return [
      ...differenceBy(permissionsCore, permissionsBelongGroupCore, "code"),
      ...permissionsGroupCore,
    ].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }
}

@Resolver((of) => PermissionGroupCore)
export class PermissionGroupCoreResolver
  implements ResolverInterface<PermissionGroupCore> {
  @FieldResolver()
  permissions(
    @Root() permissionGroupCore: PermissionGroupCore
  ): PermissionCore[] {
    const result = permissions
      .filter(({ groupCode }) => groupCode === permissionGroupCore.code)
      .map((item) => {
        const permission = new PermissionCore();
        permission.code = item.code;
        permission.description = item.description;
        permission.moduleCode = item.moduleCode;
        permission.name = item.name;
        return permission;
      });

    return result;
  }
}
@Resolver((of) => PermissionCore)
export class PermissionCoreResolver
  implements ResolverInterface<PermissionCore> {
  @FieldResolver()
  modules(@Root() permissionCore: PermissionCore): PermissionModuleCore {
    const result = permissionModules.find(
      ({ code }) => code === permissionCore.moduleCode
    );

    if (!result) {
      throw new Error("Permission core not set permission module core");
    }
    return { ...result, privileges: [] };
  }
}

@Resolver()
export class PermissionResolver {
  @Authorized()
  @Query(() => [PermissionModuleCore])
  async getPermissionModuleCores(
    @Ctx() { em }: MyContext // @Arg("inputs", { nullable: true }) options: QueryOptions
  ) {
    // const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
    const data = permissionModules;
    return data;
  }
}
