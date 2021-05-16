import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Account } from "../modules/accounts/Account.entity";
import { Base } from "./Base";
import { Decision } from "./Decision";
import { Employee } from "./Employee";
import { ManagerProject } from "./ManagerProject";
import { ProjectDriver } from "./ProjectDriver";
import { ProjectVehicleAssignment } from "./ProjectVehicle";

@ObjectType()
@Entity()
export class Manager {
  @Property({ primary: true })
  employeeId?: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToOne(() => Employee, (employee) => employee.manager, { owner: true })
  @Field(() => Employee)
  employee: Employee;

  @OneToOne(() => Account, (account) => account.manager, {
    nullable: true,
    owner: true,
    cascade: [Cascade.ALL],
  })
  @Field(() => Account, { nullable: true })
  account: Account;

  @OneToMany(() => ProjectDriver, (projectDriver) => projectDriver.manager, {
    cascade: [Cascade.ALL],
  })
  @Field(() => [ProjectDriver])
  projectDrivers = new Collection<ProjectDriver>(this);

  @OneToMany(() => ManagerProject, (managerProject) => managerProject.manager, {
    cascade: [Cascade.ALL],
  })
  @Field(() => [ManagerProject])
  managerProjects = new Collection<ManagerProject>(this);

  @OneToMany(
    () => ProjectVehicleAssignment,
    (projectVehicle) => projectVehicle.createdBy,
    { cascade: [Cascade.ALL] }
  )
  @Field(() => [ProjectDriver])
  projectVehicles = new Collection<ProjectVehicleAssignment>(this);
  @OneToMany(
    () => ProjectVehicleAssignment,
    (projectVehicle) => projectVehicle.updatedBy,
    { cascade: [Cascade.ALL] }
  )
  @Field(() => [ProjectDriver])
  updateProjectVehicles = new Collection<ProjectVehicleAssignment>(this);

  @OneToMany(() => Decision, (decision) => decision.manager)
  @Field(() => [Decision])
  decisions = new Collection<Decision>(this);
}
