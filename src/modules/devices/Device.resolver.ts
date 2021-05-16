import { QueryOrder, wrap } from "@mikro-orm/core";
import { Device, DeviceSetting } from "@root/modules/devices/Device.entity";
import {
  MyContext,
  PaginatedResponse,
  QueryOptions,
  Response,
} from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Info,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Vehicle } from "@root/modules/vehicles/Vehicle.entity";
import { logger } from "@root/utils/logger";
import { createBaseResolver } from "../../resolvers/base/BaseResolver";
import fieldsToRelations from "graphql-fields-to-relations";
import { GraphQLResolveInfo } from "graphql";
import { DeviceTemperature } from "./DeviceTemperature.entity";

// @ts-ignore
@ObjectType()
// @ts-ignore
class DeviceResponse extends Response(Device) {}

@ObjectType()
class DeviceStateCount {
  @Field()
  init: number;

  @Field()
  disconnected: number;

  @Field()
  ready: number;

  @Field()
  sleeping: number;

  @Field()
  alert: number;

  @Field()
  lost: number;
}
// //@ts-ignore
// @ObjectType()
// //@ts-ignore
// class DeviceStateCountResponse extends Response(DeviceStateCount) {}

// // @ts-ignore
// @ObjectType()
// // @ts-ignore
// class DeviceTableResponse extends PaginatedResponse(Device) {}

@InputType()
class DeviceCreateInput {
  @Field({ nullable: true })
  vehicleId?: number;

  @Field({ nullable: true })
  name?: string;

  @Field()
  udi!: string;
}

@InputType()
class DeviceUpdateInput {
  @Field()
  id!: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  vehicleId?: number;

  @Field({ nullable: true })
  settings?: DeviceSetting;
}

const BaseResolver = createBaseResolver({ objectTypeCls: Device });

@Resolver((of) => Device)
export class DeviceFieldResolver implements ResolverInterface<Device> {
  @FieldResolver(() => DeviceTemperature)
  async lastTemperature(@Root() device: Device, @Ctx() { em }: MyContext) {
    return (
      (await em.findOne(
        DeviceTemperature,
        { device },
        { orderBy: { createdAt: QueryOrder.DESC } }
      )) || undefined
    );
  }
}

@Resolver()
export class DeviceResolver extends BaseResolver {
  @Query(() => [Device])
  async devices(@Ctx() { em }: MyContext, @Info() info: GraphQLResolveInfo) {
    // Remove nested field not store in database but only has in graphql
    const populate = fieldsToRelations(info).filter(
      (item) => item !== "lastTemperature"
    );
    const devices = await em.find(Device, {}, populate);
    return devices;
  }
  @Query(() => Device)
  async device(
    @Ctx() { em }: MyContext,
    @Arg("id") id: number,
    @Info() info: GraphQLResolveInfo
  ) {
    // Remove nested field not store in database but only has in graphql
    const populate = fieldsToRelations(info).filter(
      (item) => item !== "lastTemperature"
    );

    const device = await em.findOneOrFail(Device, { id }, populate);
    return device;
  }

  @Query(() => DeviceResponse)
  async getDevice(@Ctx() { em }: MyContext, @Arg("id") id: number) {
    const device = await em.findOne(Device, { id });
    if (!device) {
      return {
        errors: [
          {
            message: "Không có thiết bị này trong database",
          },
        ],
      };
    }
    return {
      result: device,
    };
  }

  @Mutation(() => DeviceResponse)
  async createDevice(
    @Arg("inputs") inputs: DeviceCreateInput,
    @Ctx() { em }: MyContext
  ) {
    let vehicle: Vehicle | undefined | null = undefined;
    vehicle = await em.findOne(Vehicle, {
      id: inputs.vehicleId,
    });

    let device = em.create(Device, inputs);
    if (vehicle) {
      device.vehicle = vehicle;
    }

    em.persist(device);
    try {
      await em.flush();
    } catch (error) {
      logger.error(error);
      return {
        errors: [
          {
            message: error,
          },
        ],
      };
    }
    return {
      result: device,
    };
  }

  @Mutation(() => DeviceResponse)
  async updateDevice(
    @Arg("inputs") inputs: DeviceUpdateInput,
    @Ctx() { em }: MyContext
  ) {
    let device = await em.findOne(Device, { id: inputs.id });
    if (!device) {
      return {
        errors: [
          {
            message: "Không tồn tại thiết bị này",
          },
        ],
      };
    }
    if (inputs.vehicleId) {
      const vehicle = await em.findOne(Vehicle, {
        id: inputs.vehicleId,
      });
      if (!vehicle) {
        return {
          errors: [
            {
              message: "Không tồn tại vehicle này",
            },
          ],
        };
      }
      device.vehicle = vehicle;
    }

    try {
      const settings = inputs.settings
        ? JSON.stringify(inputs.settings)
        : undefined;
      wrap(device).assign({
        ...inputs,
        settings,
      });
    } catch (error) {
      logger.error(error);
    }

    em.persist(device);
    try {
      await em.flush();
    } catch (error) {
      return {
        errors: [
          {
            message: error,
          },
        ],
      };
    }
    return {
      result: device,
    };
  }

  // @Mutation(() => DeviceResponse)
  // async deleteDevice(
  //   @Arg("inputs") inputs: DeviceDeleteInput,
  //   @Ctx() { em }: MyContext
  // ) {
  //   const deleteDevice = await em.findOne(Device, {
  //     id: inputs.id,
  //   });
  //   if (!deleteDevice) {
  //     return {
  //       errors: [
  //         {
  //           message: "Không tồn tại thiết bị này",
  //         },
  //       ],
  //     };
  //   }
  //   em.persist(deleteDevice);
  //   await em.remove(deleteDevice).flush();

  //   return {
  //     result: deleteDevice,
  //   };
  // }
}
