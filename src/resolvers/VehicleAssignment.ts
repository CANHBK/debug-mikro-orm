import { Driver } from "@root/entities/Driver";
import { Employee } from "@root/entities/Employee";
import { Manager } from "@root/entities/Manager";
import { Project } from "@root/entities/Project";
import { ProjectVehicleAssignment } from "@root/entities/ProjectVehicle";
import { MyContext, Response } from "@root/types";
import { logger } from "@root/utils/logger";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  ObjectType,
  ResolverInterface,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";
import { createBaseResolver } from "./base/BaseResolver";

@InputType()
class VehicleAssignmentCreateInput {
  @Field({ nullable: true })
  projectId?: number;
  @Field()
  createdById: number;
  @Field()
  vehicleId: number;
  @Field()
  driverEmployeeId: number;
  @Field({ nullable: true })
  notes?: string;
}

// @ts-ignore
@ObjectType()
// @ts-ignore
class VehicleAssignmentResponse extends Response(ProjectVehicleAssignment) {}

const BaseResolver = createBaseResolver({
  objectTypeCls: ProjectVehicleAssignment,
});

@Resolver((of) => ProjectVehicleAssignment)
export class ProjectVehicleAssignmentResolver
  implements ResolverInterface<ProjectVehicleAssignment> {
  @FieldResolver()
  async driver(
    @Root() vehicleAssignment: ProjectVehicleAssignment,
    @Ctx() { em }: MyContext
  ) {
    const employee = await em.findOneOrFail(Employee, {
      id: vehicleAssignment.driver.employeeId,
    });

    return { ...employee } as any;
  }
}

@Resolver()
export class VehicleAssignment extends BaseResolver {
  @Authorized()
  @Mutation(() => VehicleAssignmentResponse)
  async createVehicleAssignment(
    @Ctx() { em }: MyContext,
    @Arg("inputs") inputs: VehicleAssignmentCreateInput
  ): Promise<VehicleAssignmentResponse> {
    const vehicleAssignment = em.create(ProjectVehicleAssignment, inputs);
    if (inputs.projectId) {
      vehicleAssignment.project = await em.findOneOrFail(Project, {
        id: inputs.projectId,
      });
    }

    vehicleAssignment.createdBy = await em.findOneOrFail(Manager, {
      employeeId: inputs.createdById,
    });
    vehicleAssignment.updatedBy = vehicleAssignment.createdBy;
    vehicleAssignment.driver = await em.findOneOrFail(Driver, {
      employeeId: inputs.driverEmployeeId,
    });

    await em.persistAndFlush(vehicleAssignment);

    return { result: vehicleAssignment };
  }
}
