import { wrap } from "@mikro-orm/core";
import { Fuel } from "@root/modules/fuels/Fuel.entity";
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
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

// @ts-ignore
@ObjectType()
// @ts-ignore
class VehicleFuelResponse extends Response(Fuel) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class VehicleFuelTableResponse extends PaginatedResponse(Fuel) {}

@InputType()
class VehicleFuelCreateInput {
  @Field()
  name!: string;
}

@InputType()
class VehicleFuelUpdateInput {
  @Field()
  id: number;
  @Field({ nullable: true })
  name?: string;
}

@Resolver()
export class FuelResolver {
  @Query(() => VehicleFuelTableResponse)
  async getVehicleFuels(
    @Ctx() { em }: MyContext,
    @Arg("inputs", { nullable: true })
    options: QueryOptions
  ) {
    const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
    const list_data = await em.find(Fuel, filterBy, {
      limit: perPage,
      offset: perPage * (numPage - 1),
      orderBy: sortBy,
    });
    const total = await em.count(Fuel);
    return {
      result: {
        perPage,
        numPage,
        list_data,
        total,
      },
    };
  }

  @Query(() => VehicleFuelResponse)
  async getVehicleFuel(@Ctx() { em }: MyContext, @Arg("inputs") id: number) {
    const vehicleFuel = await em.findOne(Fuel, { id });
    if (!vehicleFuel) {
      return {
        errors: [
          {
            message: "Không tồn tại nhiên liệu này",
          },
        ],
      };
    }
    em.persist(vehicleFuel);
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
      result: vehicleFuel,
    };
  }

  @Mutation(() => VehicleFuelResponse)
  async createVehicleFuel(
    @Ctx() { em }: MyContext,
    @Arg("inputs") inputs: VehicleFuelCreateInput
  ) {
    const data = await em.findOne(Fuel, { name: inputs.name });
    if (data) {
      return {
        errors: [
          {
            message: "Đã có loại nhiên liệu cùng tên trong database!",
          },
        ],
      };
    }
    const vehicleFuel = em.create(Fuel, inputs);
    em.persist(vehicleFuel);
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
      message: "Tạo loại nhiên liệu mới thành công!",
      result: vehicleFuel,
    };
  }

  @Mutation(() => VehicleFuelResponse)
  async updateVehicleFuel(
    @Ctx() { em }: MyContext,
    @Arg("inputs") inputs: VehicleFuelUpdateInput
  ) {
    const vehicleFuel = await em.findOne(Fuel, { id: inputs.id });
    if (!vehicleFuel) {
      return {
        errors: [
          {
            message: "Không tồn tại loại nhiên liệu này",
          },
        ],
      };
    }
    wrap(vehicleFuel).assign({
      name: inputs.name,
    });

    em.persist(vehicleFuel);
    try {
      em.flush();
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
      result: vehicleFuel,
      message: "Cập nhật thông tin nhiên liệu thành công",
    };
  }

  @Mutation(() => VehicleFuelResponse)
  async deleteVehicleFuel(@Ctx() { em }: MyContext, @Arg("inputs") id: number) {
    const vehicleFuel = await em.findOne(Fuel, { id });
    if (!vehicleFuel) {
      return {
        errors: [
          {
            field: "id",
            message: "Không tồn tại loại nhiên liệu này",
          },
        ],
      };
    }
    em.remove(vehicleFuel);
    try {
      await em.flush();
    } catch (error) {
      return {
        message: error,
      };
    }
    return {
      message: "Đã xoá loại nhiên liệu thành công",
    };
  }
}
